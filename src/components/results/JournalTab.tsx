import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import type { TravelConfig, GenerationResults } from '../../types';
import { addDaysISO, formatDateAU, todayISO } from '../../lib/dateUtils';
import { getDestinationPhoto } from '../../lib/imagery';

interface Props {
  config: TravelConfig;
  results: GenerationResults;
}

const EASE = [0.16, 1, 0.3, 1] as const;

type TripPhase = 'future' | 'during' | 'past';

interface DayEntry {
  photos: string[]; // base64 data URLs
  note: string;
}

function tripIdFor(config: TravelConfig): string {
  return `${config.country?.id ?? 'trip'}-${config.departureDate}`;
}

function storageKey(tripId: string, dayNumber: number): string {
  return `journal:${tripId}:day${dayNumber}`;
}

function readEntry(tripId: string, dayNumber: number): DayEntry {
  try {
    const raw = localStorage.getItem(storageKey(tripId, dayNumber));
    if (!raw) return { photos: [], note: '' };
    const parsed = JSON.parse(raw);
    return {
      photos: Array.isArray(parsed.photos) ? parsed.photos : [],
      note: typeof parsed.note === 'string' ? parsed.note : '',
    };
  } catch {
    return { photos: [], note: '' };
  }
}

function writeEntry(tripId: string, dayNumber: number, entry: DayEntry): { ok: boolean; error?: string } {
  try {
    localStorage.setItem(storageKey(tripId, dayNumber), JSON.stringify(entry));
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Storage full';
    return { ok: false, error: msg };
  }
}

/**
 * Read a file as a data URL with optional in-browser downscale + JPEG re-encode.
 * Why: raw smartphone photos are 4-8 MB; localStorage caps at ~5 MB total.
 * After downscale-to-1280-and-recompress, a typical photo is ~120-180 KB.
 */
async function fileToDataUrl(file: File, maxDimension = 1280, quality = 0.82): Promise<string> {
  // Non-image (or HEIC etc the browser can't decode) — fall back to raw bytes.
  if (!file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // Decode to a canvas, downscale, re-encode as JPEG.
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) {
    // Browser can't decode (e.g. iOS HEIC pre-Safari-17) — fall back.
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', quality);
}

function determinePhase(departure: string, ret: string): TripPhase {
  const today = todayISO();
  if (today < departure) return 'future';
  if (today > ret) return 'past';
  return 'during';
}

export default function JournalTab({ config, results }: Props) {
  const tripId = useMemo(() => tripIdFor(config), [config]);
  const phase = useMemo(
    () => determinePhase(config.departureDate, config.returnDate),
    [config.departureDate, config.returnDate],
  );

  const totalDays = useMemo(() => {
    const ms = new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime();
    return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
  }, [config.departureDate, config.returnDate]);

  const days = useMemo(() => {
    if (results.itinerary && results.itinerary.length > 0) {
      return results.itinerary.map((d) => ({
        day: d.day,
        title: d.title,
        location: d.location,
        date: addDaysISO(config.departureDate, d.day - 1),
      }));
    }
    return Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      location: config.destinations[0]?.name ?? config.country?.name ?? '',
      date: addDaysISO(config.departureDate, i),
    }));
  }, [results.itinerary, config.departureDate, totalDays, config.destinations, config.country?.name]);

  const [entries, setEntries] = useState<Record<number, DayEntry>>({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const initial: Record<number, DayEntry> = {};
    for (const d of days) initial[d.day] = readEntry(tripId, d.day);
    setEntries(initial);
  }, [tripId, days]);

  const handlePhotos = async (dayNumber: number, ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (!files || files.length === 0) return;
    setErrorMsg('');
    try {
      const arr = Array.from(files);
      const dataUrls = await Promise.all(arr.map((f) => fileToDataUrl(f)));
      setEntries((prev) => {
        const current = prev[dayNumber] ?? { photos: [], note: '' };
        const next: DayEntry = { ...current, photos: [...current.photos, ...dataUrls] };
        const result = writeEntry(tripId, dayNumber, next);
        if (!result.ok) {
          setErrorMsg(
            'Your device is out of storage for the journal. Try removing a photo before adding more.',
          );
          return prev;
        }
        return { ...prev, [dayNumber]: next };
      });
    } catch (e) {
      setErrorMsg('Could not read one of your photos. Please try again.');
      console.warn(e);
    } finally {
      // reset so same file can be reselected
      ev.target.value = '';
    }
  };

  const handleRemovePhoto = (dayNumber: number, idx: number) => {
    setEntries((prev) => {
      const current = prev[dayNumber] ?? { photos: [], note: '' };
      const photos = current.photos.filter((_, i) => i !== idx);
      const next: DayEntry = { ...current, photos };
      writeEntry(tripId, dayNumber, next);
      return { ...prev, [dayNumber]: next };
    });
  };

  const handleNoteChange = (dayNumber: number, note: string) => {
    setEntries((prev) => {
      const current = prev[dayNumber] ?? { photos: [], note: '' };
      const next: DayEntry = { ...current, note };
      const result = writeEntry(tripId, dayNumber, next);
      if (!result.ok) setErrorMsg('Could not save your note — storage full.');
      return { ...prev, [dayNumber]: next };
    });
  };

  // FUTURE: preview-only state
  if (phase === 'future') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="mb-10">
          <p className="eyebrow mb-3">Chapter — Journal</p>
          <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
            Your photo journal <span className="italic text-[var(--gold)]">awaits</span>
          </h2>
          <div className="divider my-5 max-w-[120px]" />
        </div>

        <div className="surface-card rounded-3xl overflow-hidden">
          <div
            className="h-72 sm:h-96 relative"
            style={{
              backgroundImage: `url(${getDestinationPhoto(
                config.destinations[0]?.name ?? config.country?.name ?? 'travel',
                1400,
                900,
              )})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-display italic text-3xl sm:text-4xl text-[var(--cream)] leading-snug max-w-2xl">
                When you return, this page will hold every photo, every note, every quiet
                moment from your trip.
              </p>
            </div>
          </div>
          <div className="p-8">
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-2xl">
              We&apos;ll prompt you to upload photos for each day of your itinerary. Pair them with
              a few words and you&apos;ll have a print-ready keepsake by the time the suitcases
              come home.
            </p>
            <div className="eyebrow text-[var(--text-dim)] mt-6">
              Departure · {formatDateAU(config.departureDate)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="print:bg-white"
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter — Journal</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight print:text-black">
          {phase === 'past' ? (
            <>
              A trip <span className="italic text-[var(--gold)]">remembered</span>
            </>
          ) : (
            <>
              A trip <span className="italic text-[var(--gold)]">in progress</span>
            </>
          )}
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl print:text-[var(--ink-3)]">
          Upload a few photos and jot a memory for each day. Your journal saves automatically
          to this device.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 surface-soft rounded-xl px-4 py-3 border border-[var(--terracotta)]/40">
          <p className="text-sm text-[var(--terracotta)]">{errorMsg}</p>
        </div>
      )}

      <div className="space-y-12">
        {days.map((d, i) => {
          const entry = entries[d.day] ?? { photos: [], note: '' };
          const placeholder = getDestinationPhoto(d.location || d.title, 1200, 800);
          return (
            <motion.section
              key={d.day}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}
              className="surface-card rounded-3xl p-6 sm:p-8 print:shadow-none print:border print:border-[var(--line)]"
            >
              <header className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
                <div>
                  <p className="eyebrow text-[var(--text-dim)] mb-1">
                    Day {d.day} · {formatDateAU(d.date)}
                  </p>
                  <h3 className="font-display text-3xl sm:text-4xl text-[var(--cream)] leading-tight print:text-black">
                    {d.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm mt-1">{d.location}</p>
                </div>
                <label className="cursor-pointer text-[11px] tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3.5 py-1.5 transition-all print:hidden">
                  + Add photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(ev) => handlePhotos(d.day, ev)}
                  />
                </label>
              </header>

              {entry.photos.length === 0 ? (
                <div
                  className="rounded-2xl overflow-hidden h-56 sm:h-64 relative print:hidden"
                  style={{
                    backgroundImage: `url(${placeholder})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-[var(--ink)]/65 flex items-center justify-center">
                    <p className="font-display italic text-xl text-[var(--cream)]/80 text-center px-6">
                      No photos yet — your memories from this day will live here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {entry.photos.map((src, idx) => (
                    <figure
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-[4/3] surface-soft"
                    >
                      <img
                        src={src}
                        alt={`Day ${d.day} photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(d.day, idx)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--ink)]/70 text-[var(--cream)] text-xs opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                        aria-label="Remove photo"
                      >
                        ×
                      </button>
                    </figure>
                  ))}
                </div>
              )}

              <div className="mt-5">
                <textarea
                  value={entry.note}
                  onChange={(ev) => handleNoteChange(d.day, ev.target.value)}
                  placeholder="A line, a feeling, a small thing you don't want to forget…"
                  rows={3}
                  className="w-full bg-transparent border-b border-[var(--line)] focus:border-[var(--gold)] outline-none italic font-display text-lg text-[var(--cream)] placeholder:text-[var(--text-dim)] py-2 transition-colors print:text-black print:border-[var(--line-strong)]"
                />
              </div>
            </motion.section>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-6 py-3 rounded-full bg-[var(--cream)] text-[var(--ink)] text-[11px] tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
        >
          Export journal
        </button>
      </div>
    </motion.div>
  );
}

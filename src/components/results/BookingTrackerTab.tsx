import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TravelConfig, GenerationResults } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';
import { getFlightLinks, getHotelLinks } from '../../lib/bookingLinks';
import { parseBookingEmail, type ParsedBooking } from '../../lib/api';
import { tapHaptic } from '../../lib/haptics';
import { getActiveTripId } from '../../lib/tripStore';
import { usePersistentState, usePersistentSet } from '../../lib/usePersistentState';

interface Props {
  config: TravelConfig;
  results: GenerationResults;
}

interface BookingItem {
  id: string;
  category: string;
  title: string;
  detail: string;
  links: Record<string, string>;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function BookingTrackerTab({ config, results }: Props) {
  // Persisted per trip. This is the tab whose whole purpose is remembering what
  // you've booked, so losing it on a tab switch defeated the feature entirely.
  const tripId = getActiveTripId() || 'default';
  const [booked, setBooked] = usePersistentSet(`adventure-planner:booked:${tripId}`);
  const [emailText, setEmailText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsed, setParsed] = useState<ParsedBooking | null>(null);
  const [parsedMatchId, setParsedMatchId] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = usePersistentState<ParsedBooking[]>(`adventure-planner:booking-notes:${tripId}`, []);
  const [statusMsg, setStatusMsg] = useState('');

  const toggle = (id: string) => {
    tapHaptic();
    setBooked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const items: BookingItem[] = [];
  const adults = config.travellers;
  const children = config.ages?.filter(a => a < 18).length || 0;
  const rooms = Math.max(1, Math.ceil(adults / 2));

  results.flights.forEach((f, i) => {
    items.push({
      id: `flight-${i}`,
      category: 'Flights',
      title: f.leg,
      detail: `${formatDateAU(f.date)} · ${f.duration} · ${f.price_estimate_aud}`,
      links: getFlightLinks(f.from_code, f.to_code, f.date, undefined, adults, children),
    });
  });

  results.hotels.forEach((dest, i) => {
    const topPick = dest.hotels.find(h => h.recommended) || dest.hotels[0];
    if (topPick) {
      items.push({
        id: `hotel-${i}`,
        category: 'Hotels',
        title: `${topPick.name} · ${dest.destination}`,
        detail: `${formatDateAU(dest.check_in)} – ${formatDateAU(dest.check_out)} · ${dest.nights}n · ${topPick.price_per_night_aud}/night`,
        links: getHotelLinks(dest.destination, dest.check_in, dest.check_out, adults, rooms),
      });
    }
  });

  results.transport.forEach((t, i) => {
    items.push({
      id: `transport-${i}`,
      category: 'Transport',
      title: `${t.from} → ${t.to}`,
      detail: `${formatDateAU(t.date)} · ${t.mode} · ${t.duration} · ${t.price_estimate_aud}`,
      links: { 'Rome2Rio': `https://www.rome2rio.com/s/${encodeURIComponent(t.from)}/${encodeURIComponent(t.to)}` },
    });
  });

  const total = items.length;
  const done = booked.size;
  const pct = total > 0 ? (done / total) * 100 : 0;
  const categories = Array.from(new Set(items.map(i => i.category)));

  // Match a parsed booking to an existing booking item
  const findMatchId = (p: ParsedBooking): string | null => {
    if (p.type === 'flight' && p.flight) {
      const f = p.flight;
      for (let i = 0; i < results.flights.length; i++) {
        const fl = results.flights[i];
        const sameDate = f.departureDate && fl.date && fl.date === f.departureDate;
        const airlineMatch = f.airline && (fl.airlines || []).some(a => a.toLowerCase().includes(String(f.airline).toLowerCase()) || String(f.airline).toLowerCase().includes(a.toLowerCase()));
        if (sameDate && airlineMatch) return `flight-${i}`;
        if (sameDate) return `flight-${i}`;
      }
    }
    if (p.type === 'hotel' && p.hotel) {
      const h = p.hotel;
      const name = (h.name || '').toLowerCase();
      for (let i = 0; i < results.hotels.length; i++) {
        const dest = results.hotels[i];
        const top = dest.hotels.find(x => x.recommended) || dest.hotels[0];
        if (top && name && top.name.toLowerCase().includes(name)) return `hotel-${i}`;
        if (top && name && name.includes(top.name.toLowerCase())) return `hotel-${i}`;
      }
    }
    return null;
  };

  const handleParse = async () => {
    setParsing(true);
    setParseError('');
    setParsed(null);
    setParsedMatchId(null);
    setStatusMsg('');
    try {
      const result = await parseBookingEmail(emailText);
      setParsed(result);
      setParsedMatchId(findMatchId(result));
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Parse failed');
    } finally {
      setParsing(false);
    }
  };

  const confirmBooked = () => {
    if (parsedMatchId) {
      setBooked(prev => new Set(prev).add(parsedMatchId));
      setStatusMsg('Marked as booked.');
      setParsed(null);
      setParsedMatchId(null);
      setEmailText('');
    }
  };

  const saveAsNote = () => {
    if (parsed) {
      setSavedNotes(prev => [...prev, parsed]);
      setStatusMsg('Saved as note.');
      setParsed(null);
      setParsedMatchId(null);
      setEmailText('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="mb-10">
        <p className="eyebrow mb-3">Check list</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">bookings</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">Tick each booking off as you confirm it. Links open with your details pre-filled.</p>
      </div>

      {/* Paste confirmation email */}
      <details className="surface-soft rounded-2xl mb-6 group">
        <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between">
          <span className="flex items-center gap-3">
            <span className="eyebrow">Quick add</span>
            <span className="text-[var(--cream)] font-display text-base italic">Paste a confirmation email</span>
          </span>
          <span className="text-[var(--text-muted)] text-sm group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <div className="px-5 pb-5 pt-1 border-t border-[var(--line)]">
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste your flight, hotel or activity confirmation here…"
            className="w-full min-h-[140px] mt-4 px-4 py-3 rounded-xl bg-[var(--ink-2)] border border-[var(--line)] focus:border-[var(--gold)]/50 outline-none text-[var(--cream)] text-sm leading-relaxed placeholder:text-[var(--text-dim)] transition-colors"
          />
          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider">
              We'll try to match it to an existing booking.
            </p>
            <button
              type="button"
              onClick={handleParse}
              disabled={!emailText.trim() || parsing}
              className="px-5 py-2 rounded-full text-xs font-medium text-white bg-[var(--terracotta)] hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {parsing ? 'Parsing…' : 'Parse & add'}
            </button>
          </div>

          {parseError && (
            <p className="text-[var(--terracotta)] text-xs mt-3">{parseError}</p>
          )}
          {statusMsg && !parsed && (
            <p className="text-[var(--gold)] text-xs mt-3 italic">{statusMsg}</p>
          )}

          {parsed && (
            <div className="mt-5 surface-card rounded-2xl p-5">
              <div className="flex items-baseline justify-between mb-3">
                <p className="eyebrow">Extracted · {parsed.type}</p>
                <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider">Confidence · {parsed.confidence}</p>
              </div>
              <div className="divider mb-4" />
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {parsed.flight && Object.entries(parsed.flight).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider">{k}</dt>
                    <dd className="text-[var(--cream)] text-right">{String(v)}</dd>
                  </div>
                ))}
                {parsed.hotel && Object.entries(parsed.hotel).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider">{k}</dt>
                    <dd className="text-[var(--cream)] text-right">{String(v)}</dd>
                  </div>
                ))}
                {parsed.activity && Object.entries(parsed.activity).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider">{k}</dt>
                    <dd className="text-[var(--cream)] text-right">{String(v)}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 pt-4 border-t border-[var(--line)] flex items-center justify-between gap-3 flex-wrap">
                {parsedMatchId ? (
                  <>
                    <p className="text-[var(--text-muted)] text-xs italic">
                      Matched to {items.find(i => i.id === parsedMatchId)?.title || 'an existing booking'}.
                    </p>
                    <button
                      type="button"
                      onClick={confirmBooked}
                      className="px-5 py-2 rounded-full text-xs font-medium text-[var(--ink)] bg-[var(--gold)] hover:opacity-90 transition-all"
                    >
                      Mark as booked?
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[var(--text-muted)] text-xs italic">
                      Couldn't match this to an existing booking. Add it as a note?
                    </p>
                    <button
                      type="button"
                      onClick={saveAsNote}
                      className="px-5 py-2 rounded-full text-xs font-medium text-[var(--cream)] border border-[var(--line-strong)] hover:border-[var(--gold)]/50 transition-all"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {savedNotes.length > 0 && (
            <div className="mt-5">
              <p className="eyebrow mb-2">Notes · {savedNotes.length}</p>
              <ul className="space-y-2">
                {savedNotes.map((n, i) => {
                  const head = n.flight?.airline || n.hotel?.name || n.activity?.name || n.type;
                  const sub = n.flight?.departureDate || n.hotel?.checkIn || n.activity?.date || '';
                  return (
                    <li key={i} className="text-[var(--text-muted)] text-xs flex justify-between border-l-2 border-[var(--line-strong)] pl-3">
                      <span className="text-[var(--cream)]">{head}</span>
                      <span className="text-[var(--text-dim)]">{sub}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </details>

      {/* Progress */}
      <div className="surface-card rounded-3xl p-7 mb-10">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <p className="eyebrow mb-2">Progress</p>
            <p className="font-display text-4xl text-[var(--cream)]">
              {done}<span className="text-[var(--text-dim)]"> / {total}</span>
            </p>
          </div>
          <p className="font-display text-5xl text-[var(--gold)] leading-none">{Math.round(pct)}<span className="text-xl">%</span></p>
        </div>
        <div className="w-full h-[3px] bg-[var(--line)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>
        {done === total && total > 0 && (
          <p className="text-[var(--gold)] text-sm mt-4 font-display italic">All booked. Bon voyage.</p>
        )}
      </div>

      {total === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)] font-display text-lg">No bookings to track yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat, ci) => {
            const catItems = items.filter(i => i.category === cat);
            const catDone = catItems.filter(i => booked.has(i.id)).length;

            return (
              <motion.section
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: ci * 0.08, ease: EASE }}
              >
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="eyebrow mb-1">Section {String(ci + 1).padStart(2, '0')}</p>
                    <h3 className="font-display text-2xl text-[var(--cream)]">{cat}</h3>
                  </div>
                  <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider">
                    {catDone} / {catItems.length} done
                  </p>
                </div>
                <div className="divider mb-5" />

                <div className="space-y-2">
                  {catItems.map((item) => {
                    const isBooked = booked.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className="surface-soft rounded-2xl p-5 flex items-start gap-5 transition-all hover:border-[var(--line-strong)]"
                      >
                        <button
                          type="button"
                          onClick={() => toggle(item.id)}
                          className="flex-shrink-0 mt-0.5"
                          aria-label={isBooked ? 'Mark as not booked' : 'Mark as booked'}
                        >
                          <span
                            className={`block w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                              isBooked
                                ? 'border-[var(--gold)] bg-[var(--gold)]'
                                : 'border-[var(--line-strong)] hover:border-[var(--gold)]/60'
                            }`}
                          >
                            {isBooked && <span className="text-[var(--ink)] text-[10px] font-bold">✓</span>}
                          </span>
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`font-display text-lg leading-snug transition-all ${
                            isBooked ? 'text-[var(--text-dim)] line-through' : 'text-[var(--cream)]'
                          }`}>
                            {item.title}
                          </p>
                          <p className="text-[var(--text-muted)] text-[12px] mt-1 mb-3">{item.detail}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(item.links).slice(0, 3).map(([name, url]) => (
                              <a
                                key={name}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-medium px-3 py-1 rounded-full border border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
                              >
                                {name} ↗
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

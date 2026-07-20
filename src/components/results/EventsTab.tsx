import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { TravelConfig } from '../../types';
import {
  fetchPublicHolidays,
  getFestivalsForCountryInRange,
  isoCodeForCountry,
  type PublicEvent,
} from '../../lib/events';
import { addDaysISO, formatDateAU } from '../../lib/dateUtils';

interface Props {
  config: TravelConfig;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const TYPE_BADGE: Record<PublicEvent['type'], { label: string; color: string }> = {
  holiday: { label: 'Public holiday', color: 'var(--terracotta)' },
  festival: { label: 'Festival', color: 'var(--gold)' },
  observance: { label: 'Observance', color: 'var(--sage)' },
};

export default function EventsTab({ config }: Props) {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const { rangeStart, rangeEnd, countryId, countryName } = useMemo(() => {
    const start = addDaysISO(config.departureDate, -1);
    const end = addDaysISO(config.returnDate, 1);
    return {
      rangeStart: start,
      rangeEnd: end,
      countryId: config.country?.id ?? '',
      countryName: config.country?.name ?? 'your destination',
    };
  }, [config.departureDate, config.returnDate, config.country?.id, config.country?.name]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const iso = isoCodeForCountry(countryId);
      const startYear = new Date(rangeStart).getUTCFullYear();
      const endYear = new Date(rangeEnd).getUTCFullYear();
      const years = startYear === endYear ? [startYear] : [startYear, endYear];

      const holidayBatches = iso
        ? await Promise.all(years.map((y) => fetchPublicHolidays(y, iso)))
        : [];
      const holidays = holidayBatches.flat().filter(
        (h) => h.date >= rangeStart && h.date <= rangeEnd,
      );
      const festivals = getFestivalsForCountryInRange(countryId, rangeStart, rangeEnd);

      // Dedupe by date+name
      const seen = new Set<string>();
      const merged = [...holidays, ...festivals].filter((e) => {
        const k = `${e.date}|${(e.name || '').toLowerCase()}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      merged.sort((a, b) => a.date.localeCompare(b.date));

      if (!cancelled) {
        setEvents(merged);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [countryId, rangeStart, rangeEnd]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter — Events</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          What&apos;s happening <span className="italic text-[var(--gold)]">while you&apos;re there</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">
          Public holidays and major festivals in {countryName} during your trip — handy for
          knowing what&apos;s closed, what&apos;s celebrating, and where to be.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-gentle-pulse" />
            <span className="eyebrow text-[var(--text-dim)]">Gathering events…</span>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="surface-card rounded-3xl px-8 py-16 text-center">
          <p className="font-display italic text-3xl text-[var(--cream)] mb-3">
            A quiet stretch.
          </p>
          <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
            No public holidays or major festivals fall within your trip window — which often
            means easier bookings and gentler crowds.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((e, i) => {
            const badge = TYPE_BADGE[e.type] || TYPE_BADGE.observance;
            return (
              <motion.li
                key={`${e.date}-${e.name}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                className="surface-card rounded-2xl px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6"
              >
                <div className="shrink-0">
                  <div className="inline-flex flex-col items-center justify-center min-w-[88px] rounded-xl border border-[var(--line-strong)] bg-[var(--ink-3)]/60 px-3 py-2">
                    <span className="eyebrow text-[var(--text-dim)]">
                      {new Date(e.date).toLocaleString('en-AU', { month: 'short' })}
                    </span>
                    <span className="font-display text-3xl text-[var(--cream)] leading-none">
                      {new Date(e.date).getUTCDate()}
                    </span>
                    <span className="text-[10px] tracking-wider text-[var(--text-dim)] mt-1">
                      {formatDateAU(e.date)}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-0.5 rounded-full border"
                      style={{ color: badge.color, borderColor: `${badge.color}40` }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-[var(--cream)] leading-snug">
                    {e.name}
                  </h3>
                  {e.description && (
                    <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">
                      {e.description}
                    </p>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}

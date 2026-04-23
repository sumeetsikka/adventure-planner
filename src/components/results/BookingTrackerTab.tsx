import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TravelConfig, GenerationResults } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';
import { getFlightLinks, getHotelLinks } from '../../lib/bookingLinks';

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
  const [booked, setBooked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
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

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="mb-10">
        <p className="eyebrow mb-3">Check list</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">bookings</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">Tick each booking off as you confirm it. Links open with your details pre-filled.</p>
      </div>

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

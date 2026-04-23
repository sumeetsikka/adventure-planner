import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FlightLeg, TravelConfig } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';
import { getFlightLinks } from '../../lib/bookingLinks';

interface Props {
  flights: FlightLeg[];
  config?: TravelConfig;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function FlightsTab({ flights, config }: Props) {
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);

  if (flights.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="eyebrow mb-4">In the sky</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-2">Finding your <em>flights</em>…</h2>
        <p className="text-[var(--text-dim)] text-sm">If this persists, try regenerating your trip.</p>
      </div>
    );
  }

  const selected = selectedFlight !== null ? flights[selectedFlight] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      {/* Editorial header */}
      <div className="mb-10">
        <p className="eyebrow mb-3">Above the clouds · {flights.length} legs</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">flights</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">Hand-picked routes and airlines. Tap for full fare breakdown and booking.</p>
      </div>

      {/* Detail panel */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="surface-card rounded-3xl p-8 mb-10"
        >
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <p className="eyebrow mb-3">{selected.type === 'international' ? 'International leg' : 'Domestic leg'} · {formatDateAU(selected.date)}</p>
              <h3 className="font-display text-3xl text-[var(--cream)] leading-tight">{selected.leg}</h3>
              <p className="text-[var(--text-muted)] text-sm mt-2 tracking-wide font-mono">{selected.from_code} → {selected.to_code}</p>
            </div>
            <button
              onClick={() => setSelectedFlight(null)}
              className="w-9 h-9 rounded-full border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)] transition-all flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 pb-8 border-b border-[var(--line)]">
            <div>
              <p className="eyebrow mb-2">Duration</p>
              <p className="font-display text-xl text-[var(--cream)]">{selected.duration}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Stops</p>
              <p className="font-display text-xl text-[var(--cream)]">{selected.stops}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Route</p>
              <p className="font-display text-xl text-[var(--cream)] font-mono">{selected.from_code}–{selected.to_code}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">From</p>
              <p className="font-display text-2xl text-[var(--gold)]">{selected.price_estimate_aud}</p>
            </div>
          </div>

          {/* Airlines */}
          <p className="eyebrow mb-3">Recommended carriers</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {selected.airlines.map((a) => (
              <span key={a} className="px-4 py-2 rounded-full border border-[var(--line)] text-[var(--cream)] text-sm">
                {a}
              </span>
            ))}
          </div>

          {selected.tip && (
            <div className="surface-soft rounded-2xl p-5 mb-8 border-l-2 border-[var(--gold)]">
              <p className="eyebrow mb-1 text-[var(--gold)]">A note</p>
              <p className="text-[var(--text)] text-sm leading-relaxed">{selected.tip}</p>
            </div>
          )}

          <p className="eyebrow mb-3">Compare and book</p>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const adults = config?.travellers || 2;
              const children = config?.ages?.filter(a => a < 18).length || 0;
              const links = getFlightLinks(selected.from_code, selected.to_code, selected.date, undefined, adults, children);
              return Object.entries(links).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-sm font-medium bg-[var(--cream)] text-[var(--ink)] hover:opacity-90 transition-all inline-flex items-center gap-1.5"
                >
                  {name} <span className="text-xs">↗</span>
                </a>
              ));
            })()}
          </div>
        </motion.div>
      )}

      {/* Flight cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {flights.map((f, i) => {
          const isIntl = f.type === 'international';
          const isSelected = selectedFlight === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
              onClick={() => setSelectedFlight(isSelected ? null : i)}
              className={`surface-card rounded-3xl p-6 cursor-pointer transition-all ${
                isSelected ? 'ring-1 ring-[var(--gold)]/50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="eyebrow mb-2">{isIntl ? 'International' : 'Domestic'} · {formatDateAU(f.date)}</p>
                  <h4 className="font-display text-xl text-[var(--cream)] leading-tight">{f.leg}</h4>
                  <p className="text-[var(--text-muted)] text-xs mt-1.5 font-mono tracking-wider">
                    {f.from_code} → {f.to_code}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-3xl text-[var(--gold)] leading-none">{f.price_estimate_aud}</p>
                  <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider mt-1">per person</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-4 pb-4 border-b border-[var(--line)]">
                <span>{f.duration}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--line-strong)]" />
                <span>{f.stops}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {f.airlines.slice(0, 3).map((a) => (
                  <span key={a} className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--text-muted)]">
                    {a}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const adults = config?.travellers || 2;
                  const children = config?.ages?.filter(a => a < 18).length || 0;
                  const links = getFlightLinks(f.from_code, f.to_code, f.date, undefined, adults, children);
                  return Object.entries(links).slice(0, 3).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
                    >
                      {name} ↗
                    </a>
                  ));
                })()}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

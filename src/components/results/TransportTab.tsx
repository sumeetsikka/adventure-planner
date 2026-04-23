import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TransportLeg } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';

interface Props {
  transport: TransportLeg[];
}

const MODE_ICONS: Record<string, string> = {
  train: '🚆', 'high-speed': '🚄', shinkansen: '🚄', bullet: '🚄', sleeper: '🛏️',
  bus: '🚌', coach: '🚌', express: '🚌',
  ferry: '⛴️', boat: '🚢', speedboat: '🚤', catamaran: '⛴️',
  car: '🚗', rental: '🚗', 'private car': '🚙', transfer: '🚙', taxi: '🚕',
  cable: '🚡', tram: '🚊',
};

function getModeIcon(mode: string): string {
  const lower = mode.toLowerCase();
  for (const [key, icon] of Object.entries(MODE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '🚐';
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function TransportTab({ transport }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (transport.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="eyebrow mb-4">Getting around</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-2">No inter-city <em>transport</em> needed.</h2>
        <p className="text-[var(--text-muted)] text-sm">All your destinations share the same city.</p>
      </div>
    );
  }

  const selected = selectedIdx !== null ? transport[selectedIdx] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="mb-10">
        <p className="eyebrow mb-3">Between cities · {transport.length} legs</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">route</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">How you'll travel between destinations. Tap for booking links.</p>
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
              <p className="eyebrow mb-3">{selected.mode} · {formatDateAU(selected.date)}</p>
              <h3 className="font-display text-3xl text-[var(--cream)] leading-tight flex items-center gap-3">
                <span>{selected.from}</span>
                <span className="text-[var(--gold)]">→</span>
                <span>{selected.to}</span>
              </h3>
            </div>
            <button
              onClick={() => setSelectedIdx(null)}
              className="w-9 h-9 rounded-full border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)] transition-all flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 pb-8 border-b border-[var(--line)]">
            <div>
              <p className="eyebrow mb-2">Operator</p>
              <p className="font-display text-lg text-[var(--cream)]">{selected.operator}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Duration</p>
              <p className="font-display text-lg text-[var(--cream)]">{selected.duration}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">From</p>
              <p className="font-display text-2xl text-[var(--gold)]">{selected.price_estimate_aud}</p>
            </div>
          </div>

          {selected.tip && (
            <div className="surface-soft rounded-2xl p-5 mb-8 border-l-2 border-[var(--gold)]">
              <p className="eyebrow mb-1 text-[var(--gold)]">A note</p>
              <p className="text-[var(--text)] text-sm leading-relaxed">{selected.tip}</p>
            </div>
          )}

          <p className="eyebrow mb-3">Book this journey</p>
          <div className="flex flex-wrap gap-2">
            {(selected.booking_sites || []).map((site, i) => {
              const siteUrls: Record<string, string> = {
                '12Go Asia': `https://12go.asia/en/travel/${encodeURIComponent(selected.from)}/${encodeURIComponent(selected.to)}`,
                'Rome2Rio': `https://www.rome2rio.com/s/${encodeURIComponent(selected.from)}/${encodeURIComponent(selected.to)}`,
                'Trainline': `https://www.thetrainline.com/`,
                'Bookaway': `https://www.bookaway.com/routes/${encodeURIComponent(selected.from.toLowerCase())}-to-${encodeURIComponent(selected.to.toLowerCase())}`,
                'Busbud': `https://www.busbud.com/en/`,
                'DirectFerries': `https://www.directferries.com/`,
                'Rentalcars': `https://www.rentalcars.com/`,
                'Kayak': `https://www.kayak.com.au/cars`,
              };
              const url = selected.booking_urls?.[i] || siteUrls[site] || `https://www.google.com/search?q=${encodeURIComponent(`${site} ${selected.from} to ${selected.to} ${selected.mode}`)}`;
              return (
                <a
                  key={site}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-sm font-medium bg-[var(--cream)] text-[var(--ink)] hover:opacity-90 transition-all"
                >
                  {site} ↗
                </a>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-[var(--line)]" aria-hidden />
        <div className="space-y-5">
          {transport.map((t, i) => {
            const isSelected = selectedIdx === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                className="relative pl-12"
              >
                <div
                  className={`absolute left-0 top-5 w-[31px] h-[31px] rounded-full border-2 flex items-center justify-center text-base transition-all ${
                    isSelected ? 'border-[var(--gold)] bg-[var(--gold)]/10' : 'border-[var(--line-strong)] bg-[var(--ink-2)]'
                  }`}
                  aria-hidden
                >
                  <span className="text-sm">{getModeIcon(t.mode)}</span>
                </div>

                <div
                  onClick={() => setSelectedIdx(isSelected ? null : i)}
                  className={`surface-card rounded-2xl p-5 cursor-pointer transition-all ${
                    isSelected ? 'ring-1 ring-[var(--gold)]/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="eyebrow mb-2">{t.mode} · {formatDateAU(t.date)}</p>
                      <h4 className="font-display text-xl text-[var(--cream)] leading-tight flex items-center gap-2 flex-wrap">
                        <span>{t.from}</span>
                        <span className="text-[var(--gold)]">→</span>
                        <span>{t.to}</span>
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-[var(--text-muted)] mt-3">
                        <span>{t.duration}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--line-strong)]" />
                        <span>{t.operator}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-2xl text-[var(--gold)] leading-none">{t.price_estimate_aud}</p>
                      <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider mt-1.5">per person</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

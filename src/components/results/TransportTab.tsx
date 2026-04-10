import { useState } from 'react';
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

function getModeColour(mode: string): string {
  const lower = mode.toLowerCase();
  if (lower.includes('train') || lower.includes('rail') || lower.includes('shinkansen')) return '#0077B6';
  if (lower.includes('bus') || lower.includes('coach')) return '#2D936C';
  if (lower.includes('ferry') || lower.includes('boat') || lower.includes('speed')) return '#6B4C9A';
  if (lower.includes('car') || lower.includes('taxi') || lower.includes('transfer')) return '#E6A817';
  return '#FF6B35';
}

export default function TransportTab({ transport }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (transport.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🚆</span>
        <p className="text-white font-medium mb-2">No inter-city transport needed</p>
        <p className="text-gray-500 text-sm">All your destinations may share the same city, or transport data is still loading.</p>
      </div>
    );
  }

  const selected = selectedIdx !== null ? transport[selectedIdx] : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Inter-City Transport</h2>
        <p className="text-gray-500 text-sm">How to get between your destinations. Tap any journey for full details and booking links.</p>
      </div>

      {/* Detail panel */}
      {selected && (() => {
        const colour = getModeColour(selected.mode);
        return (
          <div className="mb-6 rounded-2xl overflow-hidden border-2" style={{ borderColor: `${colour}40` }}>
            <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${colour}20, ${colour}08)` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{getModeIcon(selected.mode)}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: colour }}>
                        {selected.mode.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg">{selected.from} → {selected.to}</h3>
                    <p className="text-gray-400 text-sm">{formatDateAU(selected.date)} · {selected.duration}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedIdx(null)}
                  className="text-gray-400 hover:text-white w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all text-xl">×</button>
              </div>
            </div>

            <div className="bg-[#131B2E] px-6 py-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                <div className="bg-[#0F1729] rounded-xl p-3">
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Operator</p>
                  <p className="text-white font-medium text-sm">{selected.operator}</p>
                </div>
                <div className="bg-[#0F1729] rounded-xl p-3">
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-gray-300 font-medium text-sm">{selected.duration}</p>
                </div>
                <div className="bg-[#0F1729] rounded-xl p-3">
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Price est.</p>
                  <p className="text-[#2D936C] font-bold text-lg">{selected.price_estimate_aud}</p>
                </div>
              </div>

              {selected.tip && (
                <div className="rounded-xl p-4 mb-5 border" style={{ background: `${colour}08`, borderColor: `${colour}15` }}>
                  <p className="text-sm" style={{ color: colour }}><span className="font-semibold">💡 Tip:</span> {selected.tip}</p>
                </div>
              )}

              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Book This Journey</p>
              <div className="flex flex-wrap gap-2">
                {(selected.booking_sites || []).map((site, i) => {
                  // Build a search URL for each booking site
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
                    <a key={site} href={url} target="_blank" rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl font-semibold text-sm border hover:-translate-y-0.5 hover:shadow-lg transition-all inline-flex items-center gap-1"
                      style={{ background: `${colour}12`, borderColor: `${colour}25`, color: colour }}>
                      {site} ↗
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Journey cards */}
      <div className="space-y-3">
        {transport.map((t, i) => {
          const colour = getModeColour(t.mode);
          const isSelected = selectedIdx === i;

          return (
            <div key={i}
              onClick={() => setSelectedIdx(isSelected ? null : i)}
              className={`group rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'ring-2 shadow-xl'
                  : 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20'
              }`}
              style={{
                borderColor: isSelected ? colour : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? `0 4px 20px ${colour}20` : undefined,
              }}>
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${colour}, ${colour}60)` }} />
              <div className="bg-[#131B2E] group-hover:bg-[#162033] transition-colors p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getModeIcon(t.mode)}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: colour }}>
                      {t.mode}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[#2D936C] font-bold text-base">{t.price_estimate_aud}</p>
                    <p className="text-gray-600 text-[9px]">per person</p>
                  </div>
                </div>

                <h4 className="text-white font-bold text-sm mb-1">{t.from} → {t.to}</h4>
                <p className="text-gray-500 text-[11px] mb-2">{formatDateAU(t.date)} · {t.duration} · {t.operator}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">Tap for booking details</span>
                  <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

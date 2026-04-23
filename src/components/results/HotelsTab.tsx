import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DestinationHotels, Destination, TravelConfig } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';
import { getHotelLinks } from '../../lib/bookingLinks';
import { getDestinationPhoto } from '../../lib/imagery';

interface Props {
  hotels: DestinationHotels[];
  config?: TravelConfig;
  destinations?: Destination[];
}

function estimateTotal(priceStr: string, nights: number): string {
  const nums = priceStr.match(/\d+/g);
  if (!nums || nums.length === 0) return '';
  if (nums.length === 1) return `~$${parseInt(nums[0]) * nights}`;
  return `~$${parseInt(nums[0]) * nights}–$${parseInt(nums[1]) * nights}`;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HotelsTab({ hotels, destinations: _destinations, config }: Props) {
  const [expandedDest, setExpandedDest] = useState<number | null>(0);
  const [selectedHotel, setSelectedHotel] = useState<{ dest: number; hotel: number } | null>(null);

  if (hotels.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="eyebrow mb-4">Where you'll stay</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-2">Finding your <em>hotels</em>…</h2>
        <p className="text-[var(--text-dim)] text-sm">If this persists, try regenerating your trip.</p>
      </div>
    );
  }

  const selDest = selectedHotel !== null && selectedHotel.dest < hotels.length ? hotels[selectedHotel.dest] : null;
  const selHotel = selDest && selectedHotel !== null && selectedHotel.hotel < (selDest.hotels?.length || 0) ? selDest.hotels[selectedHotel.hotel] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="mb-10">
        <p className="eyebrow mb-3">Sleep · {hotels.length} destinations</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">hotels</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">Premium 4–5 star picks. Tap a destination to see options.</p>
      </div>

      {/* Detail overlay */}
      {selHotel && selDest && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="surface-card rounded-3xl p-8 mb-10"
        >
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {selHotel.recommended && (
                  <span className="eyebrow text-[var(--gold)]">Our pick</span>
                )}
                <span className="text-[var(--gold)] text-xs tracking-widest">
                  {'★'.repeat(selHotel.stars)}{'☆'.repeat(5 - selHotel.stars)}
                </span>
                <span className="text-[var(--text-muted)] text-[11px] uppercase tracking-wider">{selHotel.style}</span>
              </div>
              <h3 className="font-display text-3xl text-[var(--cream)] leading-tight">{selHotel.name}</h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">{selHotel.area}, {selDest.destination}</p>
            </div>
            <button
              onClick={() => setSelectedHotel(null)}
              className="w-9 h-9 rounded-full border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)] transition-all flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 pb-8 border-b border-[var(--line)]">
            <div>
              <p className="eyebrow mb-2">Per night</p>
              <p className="font-display text-2xl text-[var(--gold)]">{selHotel.price_per_night_aud}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Estimated total</p>
              <p className="font-display text-2xl text-[var(--cream)]">{estimateTotal(selHotel.price_per_night_aud, selDest.nights)}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow mb-2">Stay</p>
              <p className="text-[var(--cream)] text-sm">{formatDateAU(selDest.check_in)} – {formatDateAU(selDest.check_out)}</p>
              <p className="text-[var(--text-dim)] text-[11px] mt-0.5">{selDest.nights} night{selDest.nights > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {selHotel.highlights.map((hl) => (
              <span key={hl} className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--line)] text-[var(--text)]">
                {hl}
              </span>
            ))}
          </div>

          <div className="surface-soft rounded-2xl p-5 mb-8 border-l-2 border-[var(--gold)]">
            <p className="eyebrow mb-1 text-[var(--gold)]">Why we chose it</p>
            <p className="text-[var(--text)] text-sm leading-relaxed">{selHotel.why}</p>
          </div>

          <p className="eyebrow mb-3">Book this hotel</p>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const adults = config?.travellers || 2;
              const rooms = Math.max(1, Math.ceil(adults / 2));
              const links = getHotelLinks(selDest.destination, selDest.check_in, selDest.check_out, adults, rooms);
              return Object.entries(links).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-sm font-medium bg-[var(--cream)] text-[var(--ink)] hover:opacity-90 transition-all"
                >
                  {name} ↗
                </a>
              ));
            })()}
          </div>
        </motion.div>
      )}

      {/* Destination sections */}
      <div className="space-y-8">
        {hotels.map((dest, di) => {
          const isExpanded = expandedDest === di;
          const banner = getDestinationPhoto(dest.destination, 1400, 400);

          return (
            <motion.div
              key={di}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: di * 0.06, ease: EASE }}
              className="surface-card rounded-3xl overflow-hidden"
            >
              {/* Photo banner header */}
              <button
                onClick={() => setExpandedDest(isExpanded ? null : di)}
                className="relative w-full h-40 sm:h-48 overflow-hidden text-left block group"
              >
                <img src={banner} alt={dest.destination} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { const i = e.currentTarget; if (i.dataset.fell) return; i.dataset.fell = '1'; i.src = `https://picsum.photos/seed/${encodeURIComponent(dest.destination)}/1400/400`; }} />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(10,8,6,0.95) 100%)' }}
                />
                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow mb-2">{dest.nights} night{dest.nights > 1 ? 's' : ''} · {formatDateAU(dest.check_in)}</p>
                    <h3 className="font-display text-2xl sm:text-3xl text-[var(--cream)] leading-tight">{dest.destination}</h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[var(--text-muted)] text-[11px] uppercase tracking-wider">{dest.hotels.length} hotels</p>
                    <span className={`inline-block text-[var(--cream)] text-lg mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                  </div>
                </div>
              </button>

              {/* Hotel cards */}
              <div className={`transition-all duration-500 ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-6 pt-6 pb-8">
                  <div className="divider mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {dest.hotels.map((h, hi) => {
                      const isSelected = selectedHotel?.dest === di && selectedHotel?.hotel === hi;

                      return (
                        <motion.div
                          key={hi}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: hi * 0.04, ease: EASE }}
                          onClick={() => setSelectedHotel(isSelected ? null : { dest: di, hotel: hi })}
                          className={`surface-soft rounded-2xl p-5 cursor-pointer transition-all hover:border-[var(--line-strong)] ${
                            isSelected ? 'ring-1 ring-[var(--gold)]/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-[var(--gold)] text-[11px] tracking-widest">{'★'.repeat(h.stars)}</p>
                              <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider mt-0.5">{h.style}</p>
                            </div>
                            {h.recommended && (
                              <span className="eyebrow text-[var(--gold)]">Pick</span>
                            )}
                          </div>

                          <h4 className="font-display text-lg text-[var(--cream)] mb-1 leading-snug">{h.name}</h4>
                          <p className="text-[var(--text-dim)] text-[11px] mb-4">{h.area}</p>

                          <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-[var(--line)]">
                            <span className="font-display text-xl text-[var(--gold)]">{h.price_per_night_aud}</span>
                            <span className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider">per night</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {h.highlights.slice(0, 3).map((hl) => (
                              <span key={hl} className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--line)] text-[var(--text-muted)]">
                                {hl}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(() => {
                              const adults = config?.travellers || 2;
                              const rooms = Math.max(1, Math.ceil(adults / 2));
                              const links = getHotelLinks(dest.destination, dest.check_in, dest.check_out, adults, rooms);
                              return Object.entries(links).slice(0, 3).map(([name, url]) => (
                                <a
                                  key={name}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
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
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

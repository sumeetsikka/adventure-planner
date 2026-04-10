import { useState } from 'react';
import type { DestinationHotels, Destination, TravelConfig } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';
import { getHotelLinks } from '../../lib/bookingLinks';

interface Props {
  hotels: DestinationHotels[];
  config?: TravelConfig;
  destinations?: Destination[];
}

function getDestInfo(name: string, destinations?: Destination[]) {
  if (!destinations) return { emoji: '🏨', colour: '#0077B6' };
  const match = destinations.find((d) => name.toLowerCase().includes(d.name.split('(')[0].split('/')[0].trim().toLowerCase()));
  return match ? { emoji: match.emoji, colour: match.colour } : { emoji: '🏨', colour: '#0077B6' };
}

function estimateTotal(priceStr: string, nights: number): string {
  const nums = priceStr.match(/\d+/g);
  if (!nums || nums.length === 0) return '';
  if (nums.length === 1) return `~$${parseInt(nums[0]) * nights}`;
  return `~$${parseInt(nums[0]) * nights}-$${parseInt(nums[1]) * nights}`;
}

export default function HotelsTab({ hotels, destinations, config }: Props) {
  const [expandedDest, setExpandedDest] = useState<number | null>(0);
  const [selectedHotel, setSelectedHotel] = useState<{ dest: number; hotel: number } | null>(null);

  if (hotels.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🏨</span>
        <p className="text-white font-medium mb-1">Hotel recommendations are loading</p>
        <p className="text-gray-600 text-sm">If this persists, try regenerating your trip.</p>
      </div>
    );
  }

  const selDest = selectedHotel !== null && selectedHotel.dest < hotels.length ? hotels[selectedHotel.dest] : null;
  const selHotel = selDest && selectedHotel !== null && selectedHotel.hotel < (selDest.hotels?.length || 0) ? selDest.hotels[selectedHotel.hotel] : null;
  const selInfo = selDest ? getDestInfo(selDest.destination, destinations) : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Your Hotel Guide</h2>
        <p className="text-gray-500 text-sm">Premium 4-5 star picks. Tap a destination to see options, then tap a hotel for full details.</p>
      </div>

      {/* Hotel detail overlay */}
      {selHotel && selDest && selInfo && (
        <div className="mb-6 animate-fade-up">
          <div className="rounded-2xl border border-white/10 bg-[#131B2E] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {selHotel.recommended && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ background: 'linear-gradient(135deg, #E6A817, #D4960F)', color: '#0B1120' }}>⭐ Our Pick</span>
                  )}
                  <span className="text-[#E6A817] text-xs">{'★'.repeat(selHotel.stars)}{'☆'.repeat(5 - selHotel.stars)}</span>
                  <span className="text-gray-500 text-xs">{selHotel.style}</span>
                </div>
                <h3 className="text-white font-bold text-lg">{selHotel.name}</h3>
                <p className="text-gray-400 text-sm">{selHotel.area}, {selDest.destination}</p>
              </div>
              <button onClick={() => setSelectedHotel(null)}
                className="text-gray-500 hover:text-white text-xl w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">×</button>
            </div>

            {/* Price and dates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <div className="bg-[#0F1729] rounded-xl p-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Per Night</p>
                <p className="text-[#2D936C] font-bold text-lg">{selHotel.price_per_night_aud}</p>
              </div>
              <div className="bg-[#0F1729] rounded-xl p-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Total Est.</p>
                <p className="text-[#2D936C] font-bold text-lg">{estimateTotal(selHotel.price_per_night_aud, selDest.nights)}</p>
              </div>
              <div className="bg-[#0F1729] rounded-xl p-3 sm:col-span-1 col-span-2">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Stay</p>
                <p className="text-gray-300 text-sm">{formatDateAU(selDest.check_in)} to {formatDateAU(selDest.check_out)} ({selDest.nights}n)</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {selHotel.highlights.map((hl) => (
                <span key={hl} className="text-[11px] px-2.5 py-1 rounded-full bg-[#0F1729] border border-white/5 text-gray-300">{hl}</span>
              ))}
            </div>

            {/* Why */}
            <div className="border-l-2 pl-4 mb-5" style={{ borderColor: `${selInfo.colour}50` }}>
              <p className="text-gray-300 text-sm leading-relaxed">{selHotel.why}</p>
            </div>

            {/* Booking - real deep links */}
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Book This Hotel</p>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const adults = config?.travellers || 2;
                const rooms = Math.max(1, Math.ceil(adults / 2));
                const links = getHotelLinks(selDest.destination, selDest.check_in, selDest.check_out, adults, rooms);
                return Object.entries(links).map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#E6A817]/15 to-[#E6A817]/5 border border-[#E6A817]/20 text-[#E6A817] hover:-translate-y-0.5 hover:shadow-lg transition-all inline-flex items-center gap-1">
                    {name} ↗
                  </a>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Destination accordions */}
      <div className="space-y-3">
        {hotels.map((dest, di) => {
          const info = getDestInfo(dest.destination, destinations);
          const isExpanded = expandedDest === di;

          return (
            <div key={di} className="rounded-2xl border border-white/8 bg-[#131B2E] overflow-hidden">
              {/* Destination header (clickable) */}
              <button
                onClick={() => setExpandedDest(isExpanded ? null : di)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#182036] transition-colors"
              >
                <span className="text-2xl flex-shrink-0">{info.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm">{dest.destination}</h3>
                  <p className="text-gray-500 text-[11px]">
                    {formatDateAU(dest.check_in)} to {formatDateAU(dest.check_out)} · {dest.nights} night{dest.nights > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-gray-500">{dest.hotels.length} hotels</span>
                  <span className={`text-gray-500 text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                </div>
              </button>

              {/* Hotel cards (collapsible) */}
              <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dest.hotels.map((h, hi) => {
                    const isSelected = selectedHotel?.dest === di && selectedHotel?.hotel === hi;

                    return (
                      <div key={hi}
                        onClick={() => setSelectedHotel(isSelected ? null : { dest: di, hotel: hi })}
                        className={`group relative rounded-xl p-4 border cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-white/20 bg-[#182036] ring-1 ring-white/10'
                            : 'border-white/6 bg-[#0F1729] hover:border-white/12 hover:bg-[#141E33] hover:-translate-y-0.5 hover:shadow-lg'
                        }`}>
                        {/* Our Pick badge */}
                        {h.recommended && (
                          <div className="absolute top-3 right-3 text-[8px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'linear-gradient(135deg, #E6A817, #D4960F)', color: '#0B1120' }}>⭐ Pick</div>
                        )}

                        {/* Stars */}
                        <p className="text-[#E6A817] text-[10px] mb-1">{'★'.repeat(h.stars)} · {h.style}</p>

                        {/* Name */}
                        <h4 className="text-white font-bold text-sm mb-1 pr-14 leading-snug">{h.name}</h4>
                        <p className="text-gray-600 text-[10px] mb-3">{h.area}</p>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-[#2D936C] font-bold text-base">{h.price_per_night_aud}</span>
                          <span className="text-gray-600 text-[10px]">/night</span>
                          <span className="text-gray-600 text-[10px]">· {estimateTotal(h.price_per_night_aud, dest.nights)} total</span>
                        </div>

                        {/* Highlights preview */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {h.highlights.slice(0, 3).map((hl) => (
                            <span key={hl} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{hl}</span>
                          ))}
                        </div>

                        {/* Quick booking links */}
                        <div className="pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap">
                          {(() => {
                            const adults = config?.travellers || 2;
                            const rooms = Math.max(1, Math.ceil(adults / 2));
                            const links = getHotelLinks(dest.destination, dest.check_in, dest.check_out, adults, rooms);
                            return Object.entries(links).slice(0, 3).map(([name, url]) => (
                              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[9px] font-semibold px-2 py-1 rounded-lg bg-[#E6A817]/10 text-[#E6A817] hover:bg-[#E6A817]/20 transition-colors">
                                {name} ↗
                              </a>
                            ));
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

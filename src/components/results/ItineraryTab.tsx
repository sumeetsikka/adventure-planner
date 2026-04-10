import { useState, useMemo } from 'react';
import type { ItineraryDay as DayType, TravelConfig, DestinationHotels } from '../../types';
import { generateItinerary } from '../../lib/api';
import { formatDateAU, addDaysISO } from '../../lib/dateUtils';
import { VIBE_COLOURS, VIBE_LABELS } from '../../lib/constants';

interface Props {
  itinerary: DayType[];
  config: TravelConfig;
  hotels: DestinationHotels[];
  onUpdate: (itinerary: DayType[]) => void;
}

function getTopPick(dest: DestinationHotels) {
  if (!dest.hotels || dest.hotels.length === 0) return null;
  return dest.hotels.find((h) => h.recommended) || dest.hotels[0];
}

function findHotelForLocation(location: string, hotels: DestinationHotels[]): DestinationHotels | null {
  if (!hotels.length) return null;
  const loc = location.toLowerCase();
  return hotels.find((h) => {
    const dest = h.destination.toLowerCase();
    return loc.includes(dest.split('(')[0].split('/')[0].trim()) ||
           dest.includes(loc.split('(')[0].split('/')[0].trim());
  }) || null;
}

export default function ItineraryTab({ itinerary, config, hotels, onUpdate }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');
  const [reorderMode, setReorderMode] = useState(false);

  const moveDay = (dayNum: number, direction: 'up' | 'down') => {
    const idx = itinerary.findIndex((d) => d.day === dayNum);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= itinerary.length) return;
    const newItinerary = [...itinerary];
    [newItinerary[idx], newItinerary[swapIdx]] = [newItinerary[swapIdx], newItinerary[idx]];
    // Renumber days sequentially
    const renumbered = newItinerary.map((d, i) => ({ ...d, day: i + 1 }));
    onUpdate(renumbered);
  };

  const regenerate = async () => {
    setRegenerating(true);
    setError('');
    try {
      const result = await generateItinerary(config);
      onUpdate(result);
      setSelectedDay(null);
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  // Group consecutive days by location
  const locationGroups = useMemo(() => {
    const groups: { location: string; days: DayType[]; hotelMatch: DestinationHotels | null; isTravel: boolean }[] = [];
    let currentGroup: typeof groups[0] | null = null;

    for (const day of itinerary) {
      const isTravel = day.vibe === 'travel';
      if (isTravel) {
        groups.push({ location: day.location, days: [day], hotelMatch: null, isTravel: true });
        currentGroup = null;
      } else if (!currentGroup || day.location !== currentGroup.location) {
        currentGroup = {
          location: day.location,
          days: [day],
          hotelMatch: findHotelForLocation(day.location, hotels),
          isTravel: false,
        };
        groups.push(currentGroup);
      } else {
        currentGroup.days.push(day);
      }
    }
    return groups;
  }, [itinerary, hotels]);

  const selectedDayData = selectedDay !== null ? itinerary.find((d) => d.day === selectedDay) : null;

  if (itinerary.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🗺️</span>
        <p className="text-white font-medium mb-2">No itinerary generated yet</p>
        <p className="text-gray-500 text-sm mb-6">Click below to generate your day-by-day plan.</p>
        <button onClick={regenerate} disabled={regenerating}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#E85D26] hover:shadow-lg transition-all disabled:opacity-50">
          {regenerating ? 'Generating...' : 'Generate Itinerary'}
        </button>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-white font-bold text-xl mb-1">Your {itinerary.length}-Day Itinerary</h2>
          <p className="text-gray-500 text-sm">Tap any day card for the full plan and hotel details.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setReorderMode(!reorderMode)}
            className={`text-xs rounded-lg px-3 py-2 transition-all ${
              reorderMode
                ? 'bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30'
                : 'text-gray-400 glass hover:bg-white/8 hover:text-white'
            }`}>
            {reorderMode ? '✓ Done' : '↕ Reorder'}
          </button>
          <button onClick={regenerate} disabled={regenerating}
            className="text-xs text-gray-400 glass rounded-lg px-3 py-2 hover:bg-white/8 hover:text-white transition-all disabled:opacity-50">
            {regenerating ? '...' : '🔄 Regenerate'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Selected day detail panel */}
      {selectedDayData && (() => {
        const vibeColour = VIBE_COLOURS[selectedDayData.vibe] || '#888';
        const hotelMatch = findHotelForLocation(selectedDayData.location, hotels);
        const topPick = hotelMatch ? getTopPick(hotelMatch) : null;
        const dayDate = addDaysISO(config.departureDate, selectedDayData.day - 1);

        return (
          <div className="mb-8 rounded-2xl overflow-hidden border-2" style={{ borderColor: `${vibeColour}40` }}>
            {/* Coloured header bar */}
            <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${vibeColour}20, ${vibeColour}08)` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedDayData.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: vibeColour }}>
                        DAY {selectedDayData.day}
                      </span>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: `${vibeColour}20`, color: vibeColour }}>
                        {VIBE_LABELS[selectedDayData.vibe] || selectedDayData.vibe}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-xl">{selectedDayData.title}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">{selectedDayData.location} · {formatDateAU(dayDate)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDay(null)}
                  className="text-gray-400 hover:text-white w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all text-xl">×</button>
              </div>
            </div>

            {/* Activities */}
            <div className="bg-[#131B2E] px-6 py-5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">What you'll do</p>
              <div className="space-y-3">
                {selectedDayData.activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#0F1729] rounded-xl p-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{ background: vibeColour }}>{i + 1}</div>
                    <p className="text-gray-200 text-sm leading-relaxed pt-0.5">{activity}</p>
                  </div>
                ))}
              </div>

              {/* Hotel */}
              {topPick && selectedDayData.vibe !== 'travel' && (
                <div className="mt-5 pt-5 border-t border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Where you're staying tonight</p>
                  <div className="flex items-center gap-4 bg-[#0F1729] rounded-xl p-4">
                    <span className="text-3xl">🏨</span>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{topPick.name}</p>
                      <p className="text-gray-500 text-xs">{topPick.area} · {'★'.repeat(topPick.stars)} · {topPick.style}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#2D936C] font-bold">{topPick.price_per_night_aud}</p>
                      <p className="text-gray-600 text-[10px]">/night</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Day cards grouped by location */}
      <div className="space-y-6">
        {locationGroups.map((group, gi) => {
          const topPick = group.hotelMatch ? getTopPick(group.hotelMatch) : null;

          // Travel day: render as a thin connector
          if (group.isTravel) {
            const day = group.days[0];
            const vibeColour = VIBE_COLOURS[day.vibe] || '#0077B6';
            const dayDate = addDaysISO(config.departureDate, day.day - 1);
            const isSelected = selectedDay === day.day;

            return (
              <div key={gi} className="flex justify-center">
                <div
                  onClick={() => setSelectedDay(isSelected ? null : day.day)}
                  className={`flex items-center gap-3 rounded-full px-5 py-2.5 cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'border-[#0077B6]/40 bg-[#0077B6]/15 shadow-lg'
                      : 'border-dashed border-white/10 bg-[#0E1525] hover:border-white/20 hover:bg-[#131B2E]'
                  }`}
                >
                  <span>{day.icon}</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{day.title}</p>
                    <p className="text-gray-500 text-[10px]">Day {day.day} · {formatDateAU(dayDate)}</p>
                  </div>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${vibeColour}20`, color: vibeColour }}>
                    {VIBE_LABELS[day.vibe] || 'Travel'}
                  </span>
                </div>
              </div>
            );
          }

          // Destination group: header + card grid
          return (
            <div key={gi}>
              {/* Destination header with hotel */}
              <div className="flex items-center gap-3 mb-3 px-1">
                <h3 className="text-white font-bold text-base">{group.location}</h3>
                <div className="flex-1 h-px bg-white/8" />
                {topPick && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="text-xs">🏨</span>
                    <span className="text-gray-500 text-[10px]">{topPick.name}</span>
                  </div>
                )}
                <span className="text-gray-600 text-[10px]">{group.days.length} day{group.days.length > 1 ? 's' : ''}</span>
              </div>

              {/* Day cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.days.map((day) => {
                  const vibeColour = VIBE_COLOURS[day.vibe] || '#888';
                  const vibeLabel = VIBE_LABELS[day.vibe] || day.vibe;
                  const dayDate = addDaysISO(config.departureDate, day.day - 1);
                  const isSelected = selectedDay === day.day;

                  return (
                    <div key={day.day}
                      onClick={() => setSelectedDay(isSelected ? null : day.day)}
                      className={`group rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? 'ring-2 shadow-xl'
                          : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20'
                      }`}
                      style={{
                        borderColor: isSelected ? vibeColour : 'rgba(255,255,255,0.08)',
                        boxShadow: isSelected ? `0 4px 20px ${vibeColour}20` : undefined,
                      }}
                    >
                      {/* Coloured top strip */}
                      <div className="h-1" style={{ background: `linear-gradient(90deg, ${vibeColour}, ${vibeColour}60)` }} />

                      <div className="bg-[#131B2E] group-hover:bg-[#162033] transition-colors p-4">
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{day.icon}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: vibeColour }}>
                              Day {day.day}
                            </span>
                          </div>
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${vibeColour}15`, color: vibeColour }}>
                            {vibeLabel}
                          </span>
                        </div>

                        {/* Title and date */}
                        <h4 className="text-white font-bold text-[15px] mb-1 leading-snug">{day.title}</h4>
                        <p className="text-gray-500 text-[11px] mb-3">{formatDateAU(dayDate)}</p>

                        {/* Activity previews */}
                        <div className="space-y-2 mb-3">
                          {day.activities.slice(0, 2).map((a, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 opacity-60" style={{ background: vibeColour }} />
                              <p className="text-gray-400 text-[12px] leading-relaxed line-clamp-1">{a}</p>
                            </div>
                          ))}
                          {day.activities.length > 2 && (
                            <p className="text-gray-600 text-[10px] pl-3.5">+{day.activities.length - 2} more</p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                          {reorderMode ? (
                            <div className="flex items-center gap-2 w-full justify-center">
                              <button onClick={(e) => { e.stopPropagation(); moveDay(day.day, 'up'); }}
                                disabled={day.day === 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 transition-all" title="Move up">↑ Up</button>
                              <button onClick={(e) => { e.stopPropagation(); moveDay(day.day, 'down'); }}
                                disabled={day.day === itinerary.length}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 transition-all" title="Move down">↓ Down</button>
                            </div>
                          ) : (
                            <>
                              <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">Tap for full plan</span>
                              <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

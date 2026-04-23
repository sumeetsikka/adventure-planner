import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ItineraryDay as DayType, TravelConfig, DestinationHotels } from '../../types';
import { generateItinerary } from '../../lib/api';
import { formatDateAU, addDaysISO } from '../../lib/dateUtils';
import { VIBE_LABELS } from '../../lib/constants';
import { getDestinationPhoto } from '../../lib/imagery';

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

const EASE = [0.16, 1, 0.3, 1] as const;

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
      <div className="text-center py-20">
        <p className="eyebrow mb-4">The journey</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-3">No <em>itinerary</em> yet.</h2>
        <p className="text-[var(--text-muted)] text-sm mb-8 max-w-md mx-auto">Generate a bespoke day-by-day plan shaped around your destinations and pace.</p>
        <button
          onClick={regenerate}
          disabled={regenerating}
          className="px-7 py-3 rounded-full font-medium text-[var(--ink)] bg-[var(--cream)] hover:opacity-90 transition-all disabled:opacity-50"
        >
          {regenerating ? 'Composing…' : 'Generate itinerary'}
        </button>
        {error && <p className="text-[var(--terracotta)] text-sm mt-6">{error}</p>}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      {/* Editorial header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="eyebrow mb-3">Day by day · {itinerary.length} days</p>
          <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
            The <em className="italic text-[var(--gold)]">journey</em>.
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">Tap any day for the full plan and where you'll rest your head.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setReorderMode(!reorderMode)}
            className={`text-xs rounded-full px-4 py-2 transition-all border ${
              reorderMode
                ? 'border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)]'
                : 'border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)]'
            }`}
          >
            {reorderMode ? 'Done' : 'Reorder'}
          </button>
          <button
            onClick={regenerate}
            disabled={regenerating}
            className="text-xs rounded-full px-4 py-2 border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)] transition-all disabled:opacity-50"
          >
            {regenerating ? '…' : 'Regenerate'}
          </button>
        </div>
      </div>

      {error && (
        <div className="surface-soft rounded-2xl p-4 mb-6 border border-[var(--terracotta)]/30">
          <p className="text-[var(--terracotta)] text-sm">{error}</p>
        </div>
      )}

      {/* Selected day detail */}
      {selectedDayData && (() => {
        const hotelMatch = findHotelForLocation(selectedDayData.location, hotels);
        const topPick = hotelMatch ? getTopPick(hotelMatch) : null;
        const dayDate = addDaysISO(config.departureDate, selectedDayData.day - 1);
        const photo = getDestinationPhoto(selectedDayData.location, 1200, 500);

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="surface-card rounded-3xl overflow-hidden mb-10"
          >
            {/* Photo header */}
            <div className="relative h-56 overflow-hidden">
              <img src={photo} alt={selectedDayData.location} className="w-full h-full object-cover animate-ken-burns"
                onError={(e) => { const i = e.currentTarget; if (i.dataset.fell) return; i.dataset.fell = '1'; i.src = `https://picsum.photos/seed/${encodeURIComponent(selectedDayData.location)}/1200/500`; }} />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(10,8,6,0.95) 100%)' }}
              />
              <button
                onClick={() => setSelectedDay(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--ink)]/60 backdrop-blur-sm text-[var(--cream)] hover:bg-[var(--ink)]/80 transition-all flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>
              <div className="absolute bottom-6 left-8 right-8">
                <p className="eyebrow mb-2">Day {selectedDayData.day} · {VIBE_LABELS[selectedDayData.vibe] || selectedDayData.vibe}</p>
                <h3 className="font-display text-3xl sm:text-4xl text-[var(--cream)] leading-tight">{selectedDayData.title}</h3>
                <p className="text-[var(--text-muted)] text-sm mt-2">{selectedDayData.location} · {formatDateAU(dayDate)}</p>
              </div>
            </div>

            {/* Activities */}
            <div className="px-8 py-7">
              <p className="eyebrow mb-5">What you'll do</p>
              <ol className="space-y-4">
                {selectedDayData.activities.map((activity, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="font-display text-2xl text-[var(--gold)] leading-none w-8 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[var(--text)] text-[15px] leading-relaxed pt-1">{activity}</p>
                  </li>
                ))}
              </ol>

              {topPick && selectedDayData.vibe !== 'travel' && (
                <div className="mt-8 pt-7 border-t border-[var(--line)]">
                  <p className="eyebrow mb-4">Where you'll sleep</p>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <p className="font-display text-xl text-[var(--cream)]">{topPick.name}</p>
                      <p className="text-[var(--text-muted)] text-xs mt-1 tracking-wide">
                        {topPick.area} · {'★'.repeat(topPick.stars)} · {topPick.style}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl text-[var(--gold)]">{topPick.price_per_night_aud}</p>
                      <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider">per night</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })()}

      {/* Location groups */}
      <div className="space-y-12">
        {locationGroups.map((group, gi) => {
          const topPick = group.hotelMatch ? getTopPick(group.hotelMatch) : null;

          if (group.isTravel) {
            const day = group.days[0];
            const dayDate = addDaysISO(config.departureDate, day.day - 1);
            const isSelected = selectedDay === day.day;

            return (
              <motion.div
                key={gi}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: gi * 0.05, ease: EASE }}
                className="flex justify-center"
              >
                <button
                  onClick={() => setSelectedDay(isSelected ? null : day.day)}
                  className={`flex items-center gap-4 rounded-full px-6 py-3 transition-all border ${
                    isSelected
                      ? 'border-[var(--gold)]/50 bg-[var(--gold)]/10'
                      : 'border-dashed border-[var(--line)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  <span className="eyebrow">In transit</span>
                  <span className="divider w-12" />
                  <span className="text-[var(--cream)] text-sm font-display">{day.title}</span>
                  <span className="text-[var(--text-dim)] text-[11px]">Day {day.day} · {formatDateAU(dayDate)}</span>
                </button>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: gi * 0.06, ease: EASE }}
            >
              {/* Location headline */}
              <div className="flex items-end justify-between mb-6 gap-4">
                <div>
                  <p className="eyebrow mb-2">Chapter {String(gi + 1).padStart(2, '0')}</p>
                  <h3 className="font-display text-2xl sm:text-3xl text-[var(--cream)] leading-tight">{group.location}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider">
                    {group.days.length} day{group.days.length > 1 ? 's' : ''}
                  </p>
                  {topPick && (
                    <p className="text-[var(--text-muted)] text-[11px] mt-1">Stay · {topPick.name}</p>
                  )}
                </div>
              </div>
              <div className="divider mb-6" />

              {/* Day cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.days.map((day, di) => {
                  const vibeLabel = VIBE_LABELS[day.vibe] || day.vibe;
                  const dayDate = addDaysISO(config.departureDate, day.day - 1);
                  const isSelected = selectedDay === day.day;
                  const dayPhoto = getDestinationPhoto(day.location, 600, 400);

                  return (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: di * 0.04, ease: EASE }}
                      onClick={() => setSelectedDay(isSelected ? null : day.day)}
                      className={`surface-card rounded-3xl overflow-hidden cursor-pointer transition-all ${
                        isSelected ? 'ring-1 ring-[var(--gold)]/50' : ''
                      }`}
                    >
                      {/* Photo */}
                      <div className="relative h-36 overflow-hidden">
                        <img src={dayPhoto} alt={day.location} className="w-full h-full object-cover" />
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(10,8,6,0.9) 100%)' }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="font-display text-3xl text-[var(--cream)] leading-none">
                            {String(day.day).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-4 right-4 flex items-baseline justify-between">
                          <p className="eyebrow text-[var(--gold)]">{vibeLabel}</p>
                          <p className="text-[var(--text-dim)] text-[10px] tracking-wider uppercase">{formatDateAU(dayDate)}</p>
                        </div>
                      </div>

                      <div className="p-5">
                        <h4 className="font-display text-lg text-[var(--cream)] mb-3 leading-snug">{day.title}</h4>

                        <ul className="space-y-1.5 mb-4">
                          {day.activities.slice(0, 2).map((a, i) => (
                            <li key={i} className="text-[var(--text-muted)] text-[12.5px] leading-relaxed line-clamp-1">
                              — {a}
                            </li>
                          ))}
                          {day.activities.length > 2 && (
                            <li className="text-[var(--text-dim)] text-[10px] tracking-wider uppercase pt-1">
                              +{day.activities.length - 2} more
                            </li>
                          )}
                        </ul>

                        <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
                          {reorderMode ? (
                            <div className="flex items-center gap-2 w-full justify-center">
                              <button
                                onClick={(e) => { e.stopPropagation(); moveDay(day.day, 'up'); }}
                                disabled={day.day === 1}
                                className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] disabled:opacity-20 transition-all"
                              >
                                ↑ Up
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); moveDay(day.day, 'down'); }}
                                disabled={day.day === itinerary.length}
                                className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] disabled:opacity-20 transition-all"
                              >
                                ↓ Down
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">Read on</span>
                              <span className="text-[var(--gold)]">→</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

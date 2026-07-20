import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ItineraryDay as DayType, TravelConfig, DestinationHotels, FlightLeg, TransportLeg, WeatherInfo } from '../../types';
import { generateItinerary, regenerateDay } from '../../lib/api';
import { formatDateAU, addDaysISO, formatDayLabel, weekdayShort } from '../../lib/dateUtils';
import { VIBE_LABELS } from '../../lib/constants';
import { getDestinationPhoto } from '../../lib/imagery';
import { findConflicts, findNudges } from '../../lib/conflicts';
import { buildDayPlans, dayMoves, type DayPlan } from '../../lib/planStitch';
import { dayRouteUrl } from '../../lib/deepLinks';
import { PlaceActions } from '../shared/PlaceLink';

interface Props {
  itinerary: DayType[];
  config: TravelConfig;
  hotels: DestinationHotels[];
  onUpdate: (itinerary: DayType[]) => void;
  flights?: FlightLeg[];
  transport?: TransportLeg[];
  weather?: WeatherInfo[];
}

function getTopPick(dest: DestinationHotels) {
  if (!dest.hotels || dest.hotels.length === 0) return null;
  return dest.hotels.find((h) => h.recommended) || dest.hotels[0];
}

function findHotelForLocation(location: string | undefined, hotels: DestinationHotels[]): DestinationHotels | null {
  if (!hotels.length || !location) return null;
  const loc = location.toLowerCase();
  return hotels.find((h) => {
    const dest = (h.destination || '').toLowerCase();
    if (!dest) return false;
    return loc.includes(dest.split('(')[0].split('/')[0].trim()) ||
           dest.includes(loc.split('(')[0].split('/')[0].trim());
  }) || null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ItineraryTab({ itinerary, config, hotels, onUpdate, flights = [], transport = [], weather = [] }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');
  const [reorderMode, setReorderMode] = useState(false);
  const [conflictsExpanded, setConflictsExpanded] = useState(false);
  const [nudgesExpanded, setNudgesExpanded] = useState(false);
  const [regenDayNum, setRegenDayNum] = useState<number | null>(null);

  // Regenerate ONE day, keeping its date/location fixed and avoiding repeats.
  const regenerateOneDay = async (d: DayType) => {
    setRegenDayNum(d.day);
    setError('');
    try {
      const avoid = (d.timeline && d.timeline.length > 0)
        ? d.timeline.map((ev) => ev.title)
        : (d.activities || []);
      const fresh = await regenerateDay(config, { day: d.day, location: d.location, vibe: d.vibe, avoid });
      if (!fresh) { setError('Could not regenerate that day — please try again.'); return; }
      // Preserve day/location; swap in the fresh content.
      onUpdate(itinerary.map((x) => x.day === d.day ? { ...fresh, day: d.day, location: d.location } : x));
    } catch {
      setError('Could not regenerate that day — please try again.');
    } finally {
      setRegenDayNum(null);
    }
  };

  // Remove one timeline stop from a day.
  const removeTimelineStop = (dayNum: number, stopIdx: number) => {
    onUpdate(itinerary.map((d) => {
      if (d.day !== dayNum || !d.timeline) return d;
      return { ...d, timeline: d.timeline.filter((_, i) => i !== stopIdx) };
    }));
  };

  // Remove one bullet activity from a day (legacy / no-timeline days).
  const removeActivity = (dayNum: number, actIdx: number) => {
    onUpdate(itinerary.map((d) => {
      if (d.day !== dayNum) return d;
      return { ...d, activities: (d.activities || []).filter((_, i) => i !== actIdx) };
    }));
  };

  const conflicts = useMemo(
    () => findConflicts(config, itinerary, flights, hotels, transport),
    [config, itinerary, flights, hotels, transport]
  );

  const nudges = useMemo(
    () => findNudges(config, itinerary, flights, hotels, transport, weather),
    [config, itinerary, flights, hotels, transport, weather]
  );

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  // Stitched plan: every flight / hotel check-in-out / transport joined onto
  // its day so each day reads as a real plan, not a disconnected list.
  const dayPlans = useMemo(
    () => buildDayPlans(config, itinerary, flights, hotels, transport),
    [config, itinerary, flights, hotels, transport]
  );

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
          className="px-7 py-3 rounded-full font-medium text-white bg-[var(--terracotta)] hover:opacity-90 transition-all disabled:opacity-50"
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
          <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">Your whole trip, stitched together day by day — flights, stays, transfers and what to do, all in order. Tap any day for the hour-by-hour.</p>
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

      {conflicts.length > 0 && (() => {
        const visible = conflictsExpanded || conflicts.length <= 3 ? conflicts : conflicts.slice(0, 3);
        const remaining = conflicts.length - visible.length;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="surface-card rounded-3xl p-7 mb-10 border border-[var(--terracotta)]/30"
          >
            <p className="eyebrow mb-3" style={{ color: 'var(--terracotta)' }}>
              Potential issues · {conflicts.length}
            </p>
            <h3 className="font-display text-2xl text-[var(--cream)] leading-tight mb-5">
              Heads <em className="italic" style={{ color: 'var(--terracotta)' }}>up</em>.
            </h3>

            <ul className="space-y-2">
              {visible.map((c, i) => (
                <li key={i} className="surface-soft rounded-2xl px-4 py-3 flex gap-4 items-start">
                  <span
                    className="font-display text-xl leading-none mt-0.5"
                    style={{ color: c.severity === 'warning' ? 'var(--terracotta)' : 'var(--gold)' }}
                  >
                    {c.severity === 'warning' ? '⚠' : 'ⓘ'}
                  </span>
                  <div className="flex-1">
                    <p className="text-[var(--cream)] text-sm leading-snug">
                      <span className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider mr-2">Day {c.day}</span>
                      {c.message}
                    </p>
                    {c.hint && (
                      <p className="text-[var(--text-muted)] text-xs mt-1 italic">{c.hint}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {remaining > 0 && (
              <button
                onClick={() => setConflictsExpanded(true)}
                className="mt-4 text-[11px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors"
              >
                Show {remaining} more →
              </button>
            )}
            {conflictsExpanded && conflicts.length > 3 && (
              <button
                onClick={() => setConflictsExpanded(false)}
                className="mt-4 text-[11px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors"
              >
                Show less ↑
              </button>
            )}
          </motion.div>
        );
      })()}

      {nudges.length > 0 && (() => {
        const visible = nudgesExpanded || nudges.length <= 3 ? nudges : nudges.slice(0, 3);
        const remaining = nudges.length - visible.length;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="surface-card rounded-3xl p-7 mb-10 border border-[var(--gold)]/20"
          >
            <p className="eyebrow mb-3" style={{ color: 'var(--gold)' }}>
              AI tips · {nudges.length}
            </p>
            <h3 className="font-display text-2xl text-[var(--cream)] leading-tight mb-5">
              Heads <em className="italic" style={{ color: 'var(--gold)' }}>up</em>.
            </h3>

            <ul className="space-y-2">
              {visible.map((n, i) => (
                <li key={i} className="surface-soft rounded-2xl px-4 py-3 flex gap-4 items-start">
                  <span
                    className="font-display text-xl leading-none mt-0.5"
                    style={{ color: n.severity === 'caution' ? 'var(--terracotta)' : 'var(--gold)' }}
                  >
                    {n.severity === 'caution' ? '⚠️' : '💡'}
                  </span>
                  <div className="flex-1">
                    <p className="text-[var(--cream)] text-sm leading-snug">
                      <span className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider mr-2">{n.category}</span>
                      {n.message}
                    </p>
                    {n.detail && (
                      <p className="text-[var(--text-muted)] text-xs mt-1 italic">{n.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {remaining > 0 && (
              <button
                onClick={() => setNudgesExpanded(true)}
                className="mt-4 text-[11px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors"
              >
                Show {remaining} more →
              </button>
            )}
            {nudgesExpanded && nudges.length > 3 && (
              <button
                onClick={() => setNudgesExpanded(false)}
                className="mt-4 text-[11px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors"
              >
                Show less ↑
              </button>
            )}
          </motion.div>
        );
      })()}

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
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>
              <div className="absolute bottom-6 left-8 right-8">
                <p className="eyebrow text-white/80 mb-2">Day {selectedDayData.day} · {VIBE_LABELS[selectedDayData.vibe] || selectedDayData.vibe}</p>
                <h3 className="font-display text-3xl sm:text-4xl text-white leading-tight">{selectedDayData.title}</h3>
                <p className="text-white/70 text-sm mt-2">{selectedDayData.location} · {formatDateAU(dayDate)}</p>
                <div className="mt-3">
                  <PlaceActions place={selectedDayData.location} compact />
                </div>
              </div>
            </div>

            {/* Hour-by-hour timeline (preferred) or fall back to activities list */}
            <div className="px-8 py-7">
              {selectedDayData.timeline && selectedDayData.timeline.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <p className="eyebrow">Hour by hour</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-wider uppercase text-[var(--text-dim)]">
                        {selectedDayData.timeline.length} stops
                      </span>
                      <button
                        onClick={() => regenerateOneDay(selectedDayData)}
                        disabled={regenDayNum === selectedDayData.day}
                        className="text-[10px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full border border-[var(--terracotta)]/40 text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 transition-all disabled:opacity-50"
                      >
                        {regenDayNum === selectedDayData.day ? 'Reworking…' : '↻ Redo this day'}
                      </button>
                    </div>
                  </div>
                  <ol className="relative space-y-3 pl-1">
                    {selectedDayData.timeline.map((ev, i) => (
                      <TimelineRow
                        key={i}
                        event={ev}
                        isFirst={i === 0}
                        isLast={i === selectedDayData.timeline!.length - 1}
                        onRemove={() => removeTimelineStop(selectedDayData.day, i)}
                      />
                    ))}
                  </ol>

                  {/* Day-level notes (rainy backup, kids tip, accessibility) */}
                  {(selectedDayData.rainy_backup || selectedDayData.kids_tip || selectedDayData.accessibility_note) && (
                    <div className="mt-6 space-y-2">
                      {selectedDayData.rainy_backup && (
                        <DayNote icon="☔" label="If it rains" text={selectedDayData.rainy_backup} colour="var(--sage)" />
                      )}
                      {selectedDayData.kids_tip && (
                        <DayNote icon="🧸" label="With kids" text={selectedDayData.kids_tip} colour="var(--terracotta)" />
                      )}
                      {selectedDayData.accessibility_note && (
                        <DayNote icon="♿" label="Mobility" text={selectedDayData.accessibility_note} colour="var(--gold)" />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <p className="eyebrow">What you'll do</p>
                    <button
                      onClick={() => regenerateOneDay(selectedDayData)}
                      disabled={regenDayNum === selectedDayData.day}
                      className="text-[10px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full border border-[var(--terracotta)]/40 text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 transition-all disabled:opacity-50"
                    >
                      {regenDayNum === selectedDayData.day ? 'Reworking…' : '↻ Redo this day'}
                    </button>
                  </div>
                  <ol className="space-y-4">
                    {(selectedDayData.activities || []).map((activity, i) => (
                      <li key={i} className="flex gap-5 items-start">
                        <span className="font-display text-2xl text-[var(--gold)] leading-none w-8 flex-shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-[var(--text)] text-[15px] leading-relaxed pt-1 flex-1">{activity}</p>
                        <button
                          onClick={() => removeActivity(selectedDayData.day, i)}
                          aria-label={`Remove ${activity}`}
                          title="Remove"
                          className="mt-1 w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 transition-colors text-xs leading-none flex-shrink-0"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {topPick && selectedDayData.vibe !== 'travel' && (
                <div className="mt-8 pt-7 border-t border-[var(--line)]">
                  <p className="eyebrow mb-4">Where you'll sleep</p>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <p className="font-display text-xl text-[var(--cream)]">{topPick.name}</p>
                      <p className="text-[var(--text-muted)] text-xs mt-1 tracking-wide">
                        {topPick.area} · {'★'.repeat(Math.max(0, Math.min(5, Math.round(topPick.stars || 0))))} · {topPick.style}
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

      {/* Stitched day-by-day plan */}
      <div className="relative">
        {/* Continuous vertical spine connecting the days */}
        <span className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--line)] hidden sm:block" aria-hidden />
        <div className="space-y-4">
          {dayPlans.map((plan, idx) => (
            <StitchedDayCard
              key={plan.day}
              plan={plan}
              index={idx}
              isSelected={selectedDay === plan.day}
              reorderMode={reorderMode}
              canMoveUp={plan.day > 1}
              canMoveDown={plan.day < itinerary.length}
              dayConflicts={conflicts.filter((c) => c.day === plan.day)}
              onMove={(dir) => moveDay(plan.day, dir)}
              onToggle={() => setSelectedDay(selectedDay === plan.day ? null : plan.day)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Stitched day card ─────────────────────────────────────────────────────

function StitchedDayCard({
  plan, index, isSelected, reorderMode, canMoveUp, canMoveDown, dayConflicts, onMove, onToggle,
}: {
  plan: DayPlan;
  index: number;
  isSelected: boolean;
  reorderMode: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  dayConflicts: { severity: string; day: number; message: string; hint?: string }[];
  onMove: (dir: 'up' | 'down') => void;
  onToggle: () => void;
}) {
  const day = plan.itineraryDay;
  const moves = dayMoves(plan);
  const title = day?.title || (plan.isLastDay ? 'Departure day' : plan.isFirstDay ? 'Arrival day' : `Day ${plan.day}`);
  const location = day?.location || plan.checkIns[0]?.dest.destination || plan.stayingTonight?.dest.destination || '';
  const activityCount = day?.timeline?.length || day?.activities?.length || 0;

  // Tonight summary.
  let tonight: { icon: string; text: string } | null = null;
  if (plan.isLastDay && plan.flights.some(f => f.type === 'international')) {
    tonight = { icon: '🏠', text: 'Fly home — trip complete' };
  } else if (plan.stayingTonight?.pick) {
    tonight = { icon: '🛏️', text: `Overnight: ${plan.stayingTonight.pick.name}` };
  } else if (plan.stayingTonight) {
    tonight = { icon: '🛏️', text: `Overnight in ${plan.stayingTonight.dest.destination}` };
  }

  // Map this day: build a walking route from the day's mappable stops, each
  // suffixed with the city so Maps disambiguates ("Temple of Literature, Hanoi").
  const mapStops = (day?.timeline || [])
    .filter((ev) => ev.type !== 'travel' && ev.type !== 'rest')
    .map((ev) => `${ev.location || ev.title}${location ? `, ${location}` : ''}`);
  const dayMapUrl = mapStops.length >= 1 ? dayRouteUrl(mapStops) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4), ease: EASE }}
      className="relative sm:pl-12"
    >
      {/* Spine node */}
      <span
        className="absolute left-0 top-5 hidden sm:flex w-10 h-10 rounded-full bg-[var(--ink-3)] border border-[var(--line-strong)] items-center justify-center z-10"
        aria-hidden
      >
        <span className="font-display text-sm text-[var(--terracotta)] leading-none">{plan.day}</span>
      </span>

      <div className={`surface-card rounded-2xl overflow-hidden transition-all ${isSelected ? 'ring-1 ring-[var(--terracotta)]' : ''}`}>
        {/* Header row — clickable to expand the hour-by-hour detail */}
        <button
          onClick={onToggle}
          className="w-full text-left px-5 py-4 flex items-start gap-3"
        >
          <div className="flex-shrink-0 sm:hidden text-center w-9">
            <p className="text-[9px] uppercase tracking-wider text-[var(--text-dim)]">Day</p>
            <p className="font-display text-xl text-[var(--terracotta)] leading-none">{plan.day}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] tracking-wider uppercase text-[var(--text-dim)] mb-0.5">
              {weekdayShort(plan.date)} · {formatDayLabel(plan.date)}{location ? ` · ${location}` : ''}
            </p>
            <h4 className="font-display-soft text-base text-[var(--cream)] leading-snug">{title}</h4>
          </div>
          {activityCount > 0 && (
            <span className="text-[var(--text-dim)] text-[10px] tracking-wider uppercase flex-shrink-0 mt-1 flex items-center gap-1">
              {isSelected ? 'Hide' : `${activityCount} ${activityCount === 1 ? 'stop' : 'stops'}`}
              <span className={`inline-block transition-transform ${isSelected ? 'rotate-180' : ''}`}>▾</span>
            </span>
          )}
        </button>

        {/* Stitched moves strip — flights / check-out / transport / check-in */}
        {moves.length > 0 && (
          <div className="px-5 pb-4 space-y-2">
            {moves.map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-[var(--ink-2)] border border-[var(--line)] px-3.5 py-2.5"
              >
                <span className="text-base leading-tight flex-shrink-0">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--cream)] text-[13px] leading-snug font-medium">{m.text}</p>
                  {m.sub && <p className="text-[var(--text-muted)] text-[11px] mt-0.5">{m.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inline mismatch warnings for this day */}
        {dayConflicts.length > 0 && (
          <div className="px-5 pb-4 space-y-1.5">
            {dayConflicts.map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl px-3 py-2 border"
                style={{
                  borderColor: c.severity === 'warning' ? 'color-mix(in srgb, var(--terracotta) 35%, transparent)' : 'color-mix(in srgb, var(--gold) 35%, transparent)',
                  background: c.severity === 'warning' ? 'color-mix(in srgb, var(--terracotta) 6%, transparent)' : 'color-mix(in srgb, var(--gold) 6%, transparent)',
                }}
              >
                <span className="text-sm leading-tight flex-shrink-0">{c.severity === 'warning' ? '⚠️' : 'ⓘ'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--cream)] text-[12px] leading-snug">{c.message}</p>
                  {c.hint && <p className="text-[var(--text-muted)] text-[11px] mt-0.5 italic">{c.hint}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Plan teaser — first couple of activities when not expanded */}
        {!isSelected && day && (day.timeline?.length || day.activities?.length) ? (
          <div className="px-5 pb-4">
            <ul className="space-y-1.5">
              {(day.timeline && day.timeline.length > 0
                ? day.timeline.slice(0, 3).map(ev => `${ev.time} · ${ev.title}`)
                : day.activities.slice(0, 3)
              ).map((line, i) => (
                <li key={i} className="text-[var(--text-muted)] text-[13px] leading-snug flex gap-2">
                  <span className="text-[var(--terracotta)] flex-shrink-0">›</span>
                  <span className="truncate">{line}</span>
                </li>
              ))}
              {((day.timeline?.length || day.activities?.length || 0) > 3) && (
                <li className="text-[var(--text-dim)] text-[11px] pl-4">+ more — tap to see the full day</li>
              )}
            </ul>
          </div>
        ) : null}

        {/* Reorder controls */}
        {reorderMode && (
          <div className="px-5 pb-4 flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onMove('up'); }}
              disabled={!canMoveUp}
              className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] disabled:opacity-20 transition-all"
            >
              ↑ Up
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMove('down'); }}
              disabled={!canMoveDown}
              className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] disabled:opacity-20 transition-all"
            >
              ↓ Down
            </button>
          </div>
        )}

        {/* Map this day — opens the day's stops as a walking route */}
        {dayMapUrl && (
          <div className="px-5 pb-4">
            <a
              href={dayMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full border border-[var(--line-strong)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--sage)]/50 transition-colors"
            >
              🗺️ Map this day{mapStops.length > 1 ? ` · ${mapStops.length} stops` : ''}
            </a>
          </div>
        )}

        {/* Tonight footer */}
        {tonight && (
          <div className="px-5 py-3 border-t border-[var(--line)] flex items-center gap-2.5 bg-[var(--ink-2)]/40">
            <span className="text-sm leading-none">{tonight.icon}</span>
            <span className="text-[var(--text-muted)] text-xs">{tonight.text}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Timeline rendering ────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; colour: string }> = {
  travel:    { icon: '✈️', colour: 'var(--gold)' },
  meal:      { icon: '🍽️', colour: 'var(--terracotta)' },
  sight:     { icon: '🗿', colour: 'var(--sage)' },
  activity:  { icon: '✦',  colour: 'var(--terracotta)' },
  rest:      { icon: '🛌', colour: 'var(--text-dim)' },
  shop:      { icon: '🛍️', colour: 'var(--gold)' },
  nightlife: { icon: '🌃', colour: 'var(--terracotta)' },
};

function TimelineRow({
  event, isFirst, isLast, onRemove,
}: {
  event: import('../../types').TimelineEvent;
  isFirst: boolean;
  isLast: boolean;
  onRemove?: () => void;
}) {
  const meta = TYPE_META[event.type] || TYPE_META.activity;
  const endTime = computeEndTime(event.time, event.duration_min);
  return (
    <li className="relative pl-12">
      {/* Vertical guide line */}
      {!isLast && <span className="absolute left-[14px] top-7 bottom-[-12px] w-px bg-[var(--line)]" aria-hidden />}
      {/* Dot */}
      <span
        className="absolute left-[6px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] bg-[var(--ink-3)]"
        style={{ borderColor: meta.colour }}
        aria-hidden
      >
        {isFirst ? '▶' : ''}
      </span>

      {/* Remove button (editable mode) */}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${event.title}`}
          title="Remove this stop"
          className="absolute right-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 transition-colors text-xs leading-none"
        >
          ✕
        </button>
      )}

      {/* Walk/transit time from previous event */}
      {!isFirst && (event.travel_from_prev_min ?? 0) > 0 && (
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] mb-1 -mt-1">
          ↪ {event.travel_from_prev_min} min travel
        </p>
      )}

      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-display text-sm text-[var(--cream)] tabular-nums">{event.time}</span>
        <span className="text-[10px] text-[var(--text-dim)] tracking-wider uppercase">
          {event.duration_min >= 60 ? `${(event.duration_min / 60).toFixed(event.duration_min % 60 === 0 ? 0 : 1)}h` : `${event.duration_min}m`}
          {endTime && ` · ends ${endTime}`}
        </span>
      </div>
      <div className="flex items-start gap-2 mb-0.5 pr-7">
        <span className="text-base leading-tight flex-shrink-0" style={{ filter: 'grayscale(0)' }}>{meta.icon}</span>
        <p className="text-[var(--cream)] text-[14px] leading-snug flex-1">{event.title}</p>
      </div>
      {event.location && (
        <p className="text-[var(--text-muted)] text-xs mt-1 ml-6 italic">📍 {event.location}</p>
      )}
      {event.tip && (
        <p className="text-[var(--text-muted)] text-xs mt-1.5 ml-6 leading-relaxed">💡 {event.tip}</p>
      )}
    </li>
  );
}

function DayNote({ icon, label, text, colour }: { icon: string; label: string; text: string; colour: string }) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-2xl border"
      style={{ borderColor: `color-mix(in srgb, ${colour} 35%, transparent)`, background: `color-mix(in srgb, ${colour} 6%, transparent)` }}
    >
      <span className="text-base leading-none mt-0.5" aria-hidden>{icon}</span>
      <div className="flex-1">
        <p className="text-[10px] tracking-wider uppercase font-semibold" style={{ color: colour }}>{label}</p>
        <p className="text-[var(--cream)] text-[13px] leading-relaxed mt-0.5">{text}</p>
      </div>
    </div>
  );
}

function computeEndTime(start: string, durationMin: number): string | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(start);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (!Number.isFinite(h) || !Number.isFinite(min)) return null;
  const total = h * 60 + min + (durationMin || 0);
  const dayMin = 24 * 60;
  const eh = Math.floor((total % dayMin) / 60);
  const em = total % 60;
  const formatted = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
  // Make day-rollover visible — a 23:00 + 120 min event ends "01:00 +1d", not
  // a misleadingly-implied same-day "01:00".
  if (total >= dayMin) return `${formatted} +1d`;
  return formatted;
}

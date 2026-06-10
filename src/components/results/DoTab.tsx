import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { DestinationActivities, Activity, ActivityTimeFit, ActivityWeather, TravelConfig, ItineraryDay } from '../../types';
import { mapsUrl, directionsUrl, reviewsUrl } from '../../lib/deepLinks';
import { buildDayPlans, destinationDayRanges, dayRangeForDestination } from '../../lib/planStitch';
import { generateActivityAlternatives } from '../../lib/api';
import { addStopToDay } from '../../lib/planEdit';
import { addDaysISO, formatDayLabel } from '../../lib/dateUtils';
import DayRangeChip from '../shared/DayRangeChip';
import AddToDay, { type DayOption } from '../shared/AddToDay';

interface Props {
  activities: DestinationActivities[];
  config?: TravelConfig;
  itinerary?: ItineraryDay[];
  /** When provided, the tab becomes editable: remove an activity, or fetch
   *  more options per destination. */
  onUpdate?: (activities: DestinationActivities[]) => void;
  /** When provided, each card gets "＋ Plan" — add the activity to a day's
   *  itinerary (afternoon slot) via the same plumbing as every other edit. */
  onUpdateItinerary?: (itinerary: ItineraryDay[]) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_META: Record<Activity['category'], { label: string; icon: string; color: string }> = {
  culture: { label: 'Culture', icon: '🏛', color: 'var(--gold)' },
  nature: { label: 'Nature', icon: '🌿', color: 'var(--sage)' },
  adventure: { label: 'Adventure', icon: '⚡', color: 'var(--terracotta)' },
  food: { label: 'Food', icon: '🍴', color: 'var(--gold-soft)' },
  wellness: { label: 'Wellness', icon: '✦', color: 'var(--sage)' },
  family: { label: 'Family', icon: '◉', color: 'var(--gold-soft)' },
  nightlife: { label: 'Nightlife', icon: '✶', color: 'var(--terracotta)' },
  shopping: { label: 'Shopping', icon: '◐', color: 'var(--gold)' },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_META) as Activity['category'][];

type TimeFilter = 'any' | ActivityTimeFit;
type WeatherFilter = 'any' | 'indoor' | 'all-weather';

const TIME_FILTERS: { id: TimeFilter; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
  { id: 'full-day', label: 'Full-day' },
];

const WEATHER_FILTERS: { id: WeatherFilter; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'indoor', label: 'Indoor' },
  { id: 'all-weather', label: 'All-weather' },
];

export default function DoTab({ activities, config, itinerary = [], onUpdate, onUpdateItinerary }: Props) {
  const dayRanges = useMemo(
    () => (config ? destinationDayRanges(buildDayPlans(config, itinerary, [], [], [])) : new Map()),
    [config, itinerary]
  );
  const [filter, setFilter] = useState<Activity['category'] | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('any');
  const [weatherFilter, setWeatherFilter] = useState<WeatherFilter>('any');
  const [loadingMore, setLoadingMore] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string>('');

  // Remove an activity from a destination by name.
  const removeActivity = (destination: string, name: string) => {
    if (!onUpdate) return;
    const next = activities.map((d) =>
      d.destination === destination
        ? { ...d, activities: (d.activities ?? []).filter((a) => a.name !== name) }
        : d
    );
    onUpdate(next);
  };

  // "＋ Plan": day options for a destination's cards — every trip day, with the
  // days you're actually in that destination highlighted.
  const dayOptionsFor = (destination: string): DayOption[] => {
    if (!config?.departureDate || itinerary.length === 0 || !onUpdateItinerary) return [];
    const range = dayRangeForDestination(dayRanges, destination);
    return itinerary.map((d) => ({
      day: d.day,
      label: formatDayLabel(addDaysISO(config.departureDate, d.day - 1)),
      inDest: !!range && d.day >= range.firstDay && d.day <= range.lastDay,
    }));
  };

  // Insert an activity into a day as an afternoon stop (14:00, 2 h).
  const planActivity = (a: Activity, destination: string, dayNum: number) => {
    if (!onUpdateItinerary) return;
    onUpdateItinerary(addStopToDay(itinerary, dayNum, {
      title: a.name,
      location: destination,
      type: 'activity',
      time: '14:00',
      duration_min: 120,
      tip: a.best_time ? `Best time: ${a.best_time}` : undefined,
    }));
  };

  // Fetch fresh activities for one destination and append them.
  const fetchMore = async (destination: string) => {
    if (!onUpdate || !config) return;
    const block = activities.find((d) => d.destination === destination);
    if (!block) return;
    setLoadingMore(destination);
    setMoreError('');
    try {
      const fresh = await generateActivityAlternatives(config, {
        destination,
        exclude: (block.activities ?? []).map((a) => a.name).filter(Boolean),
      });
      if (!fresh || fresh.length === 0) { setMoreError('No new ideas came back — try again.'); return; }
      const have = new Set((block.activities ?? []).map((a) => (a.name || '').toLowerCase().trim()));
      const added = fresh.filter((a) => a?.name && !have.has(a.name.toLowerCase().trim()));
      if (added.length === 0) { setMoreError('No new ideas came back — try again.'); return; }
      const next = activities.map((d) =>
        d.destination === destination ? { ...d, activities: [...(d.activities ?? []), ...added] } : d
      );
      onUpdate(next);
    } catch {
      setMoreError('Could not load more ideas. Please try again.');
    } finally {
      setLoadingMore(null);
    }
  };

  const visibleByDest = useMemo(() => {
    return activities.map((dest) => ({
      destination: dest.destination,
      list: (dest.activities ?? []).filter((a) => {
        if (filter !== 'all' && a.category !== filter) return false;
        if (timeFilter !== 'any') {
          const fits = a.fits ?? [];
          if (!fits.includes(timeFilter)) return false;
        }
        if (weatherFilter !== 'any') {
          const w: ActivityWeather | undefined = a.weather;
          if (w !== weatherFilter) return false;
        }
        return true;
      }),
    }));
  }, [activities, filter, timeFilter, weatherFilter]);

  const filteredTotal = useMemo(
    () => visibleByDest.reduce((s, d) => s + d.list.length, 0),
    [visibleByDest]
  );

  const totalCount = activities.reduce((s, d) => s + (d.activities?.length ?? 0), 0);

  const presentCategories = useMemo(() => {
    const set = new Set<Activity['category']>();
    activities.forEach((d) => (d.activities ?? []).forEach((a) => set.add(a.category)));
    return ALL_CATEGORIES.filter((c) => set.has(c));
  }, [activities]);

  const hasTimeData = useMemo(
    () => activities.some((d) => (d.activities ?? []).some((a) => (a.fits ?? []).length > 0)),
    [activities]
  );
  const hasWeatherData = useMemo(
    () => activities.some((d) => (d.activities ?? []).some((a) => !!a.weather)),
    [activities]
  );

  if (activities.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="eyebrow mb-4">Things to do</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-3">Curating <em>activities</em>…</h2>
        <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
          Six picks per stop — culture, nature, adventure, family-friendly, with booking links where they exist.
        </p>
      </div>
    );
  }

  const filtersActive = filter !== 'all' || timeFilter !== 'any' || weatherFilter !== 'any';
  const countLabel = buildCountLabel(filteredTotal, filter, timeFilter, weatherFilter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-8">
        <p className="eyebrow mb-3">Things to do · {totalCount} ideas</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">field</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">
          Hand-picked things to do per stop — temples, hikes, classes, tastings. Filter by mood.
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] mb-2">Category</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-wide transition-all ${
              filter === 'all'
                ? 'bg-[var(--cream)] text-[var(--ink)] font-medium'
                : 'border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)]'
            }`}
          >
            All
          </button>
          {presentCategories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-wide transition-all ${
                  isActive
                    ? 'bg-[var(--cream)] text-[var(--ink)] font-medium'
                    : 'border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)]'
                }`}
              >
                <span className="mr-1.5">{meta.icon}</span>{meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time-of-day filter */}
      {hasTimeData && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          className="mb-4"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] mb-2">Time of day</p>
          <div className="flex flex-wrap gap-1.5">
            {TIME_FILTERS.map((f) => {
              const isActive = timeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setTimeFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-wide transition-all ${
                    isActive
                      ? 'bg-[var(--cream)] text-[var(--ink)] font-medium'
                      : 'border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Weather filter */}
      {hasWeatherData && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] mb-2">Weather</p>
          <div className="flex flex-wrap gap-1.5">
            {WEATHER_FILTERS.map((f) => {
              const isActive = weatherFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setWeatherFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-wide transition-all ${
                    isActive
                      ? 'bg-[var(--cream)] text-[var(--ink)] font-medium'
                      : 'border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {filtersActive && (
        <motion.p
          key={`${filter}-${timeFilter}-${weatherFilter}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="eyebrow text-[var(--sage)] mb-8"
        >
          {countLabel}
        </motion.p>
      )}
      {!filtersActive && <div className="mb-10" />}

      {filtersActive && filteredTotal === 0 && (
        <div className="surface-soft rounded-2xl p-6 text-center">
          <p className="text-[var(--text-muted)] text-sm">
            No activities match these filters — try widening one.
          </p>
        </div>
      )}

      <div className="space-y-12">
        {visibleByDest.map((dest, di) =>
          dest.list.length === 0 ? null : (
            <motion.section
              key={`${dest.destination}-${di}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: di * 0.08, ease: EASE }}
            >
              <div className="flex items-baseline gap-6 mb-6">
                <span className="eyebrow">Stop {String(di + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl sm:text-3xl text-[var(--cream)]">{dest.destination}</h3>
                <DayRangeChip range={dayRangeForDestination(dayRanges, dest.destination)} />
                <div className="flex-1 h-px bg-[var(--line)]" />
                <span className="eyebrow text-[var(--text-dim)]">{dest.list.length} ideas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dest.list.map((a, ai) => (
                  <ActivityCard
                    key={`${a.name}-${ai}`}
                    activity={a}
                    place={`${a.name}, ${dest.destination}`}
                    onRemove={onUpdate ? () => removeActivity(dest.destination, a.name) : undefined}
                    planDays={dayOptionsFor(dest.destination)}
                    onPlan={(dayNum) => planActivity(a, dest.destination, dayNum)}
                  />
                ))}
              </div>

              {/* More options — fetch fresh activities for this destination */}
              {onUpdate && (
                <div className="mt-5 flex flex-col items-center gap-2">
                  <button
                    onClick={() => fetchMore(dest.destination)}
                    disabled={loadingMore === dest.destination}
                    className="px-5 py-2.5 rounded-full text-sm font-medium border border-[var(--line-strong)] text-[var(--cream)] hover:bg-[var(--ink-4)] transition-colors disabled:opacity-50"
                  >
                    {loadingMore === dest.destination ? 'Finding more…' : `＋ More things to do in ${dest.destination}`}
                  </button>
                  {moreError && loadingMore === null && (
                    <p className="text-[var(--terracotta)] text-xs">{moreError}</p>
                  )}
                </div>
              )}
            </motion.section>
          )
        )}
      </div>
    </motion.div>
  );
}

function buildCountLabel(
  count: number,
  cat: Activity['category'] | 'all',
  time: TimeFilter,
  weather: WeatherFilter
): string {
  const noun = count === 1 ? 'activity' : 'activities';
  const catLabel = cat === 'all' ? '' : CATEGORY_META[cat].label.toLowerCase();
  const timeLabel =
    time === 'any' ? '' : time === 'full-day' ? 'full-day' : `${time}s`;
  const weatherLabel = weather === 'any' ? '' : weather === 'indoor' ? 'indoor' : 'all-weather';

  const qualifiers = [weatherLabel, catLabel, timeLabel].filter(Boolean).join(' ');
  if (!qualifiers) return `${count} ${noun}`;
  return `${count} ${qualifiers} ${noun}`.replace(/\s+/g, ' ').trim();
}

function ActivityCard({ activity: a, place, onRemove, planDays = [], onPlan }: { activity: Activity; place: string; onRemove?: () => void; planDays?: DayOption[]; onPlan?: (day: number) => void }) {
  const meta = CATEGORY_META[a.category] || CATEGORY_META.culture;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="surface-card rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <p className="eyebrow mb-1" style={{ color: meta.color }}>
            {meta.icon} {meta.label}
          </p>
          <h4 className="font-display text-xl text-[var(--cream)] leading-tight">{a.name}</h4>
        </div>
        <div className="flex items-start gap-2 shrink-0">
          <div className="text-right">
            <p className="font-display text-base text-[var(--gold)] leading-none">{a.price_estimate_aud}</p>
            {a.duration && (
              <p className="text-[10px] tracking-wider uppercase text-[var(--text-dim)] mt-1">{a.duration}</p>
            )}
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              aria-label={`Remove ${a.name}`}
              title="Remove from my plan"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 transition-colors text-sm leading-none"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <p className="text-[var(--text-muted)] text-[13px] leading-relaxed mb-4">{a.why}</p>

      {(a.best_time || a.difficulty || a.weather || (a.fits && a.fits.length > 0)) && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {a.best_time && (
            <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--ink-3)] text-[var(--text-muted)] border border-[var(--line)]">
              {a.best_time}
            </span>
          )}
          {a.fits && a.fits.length > 0 && a.fits.map((fit) => (
            <span
              key={fit}
              className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(193, 154, 107, 0.08)',
                color: 'var(--gold-soft)',
                border: '1px solid rgba(193, 154, 107, 0.25)',
              }}
            >
              {fit}
            </span>
          ))}
          {a.weather && a.weather !== 'any' && (
            <span
              className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(196, 110, 84, 0.08)',
                color: 'var(--terracotta)',
                border: '1px solid rgba(196, 110, 84, 0.25)',
              }}
            >
              {a.weather}
            </span>
          )}
          {a.difficulty && (
            <span
              className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(122, 144, 130, 0.1)',
                color: 'var(--sage)',
                border: '1px solid rgba(122, 144, 130, 0.3)',
              }}
            >
              {a.difficulty}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--line)]">
        {a.booking_link && (
          <a
            href={a.booking_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] hover:bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-full px-3 py-1.5 transition-colors"
          >
            Book ↗
          </a>
        )}
        <a
          href={mapsUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3 py-1.5 transition-colors"
        >
          📍 Map
        </a>
        <a
          href={directionsUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3 py-1.5 transition-colors"
        >
          🧭 Directions
        </a>
        <a
          href={reviewsUrl(a.name)}
          target="_blank"
          rel="noopener noreferrer"
          title="See real ratings & reviews"
          className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--sage)]/50 rounded-full px-3 py-1.5 transition-colors"
        >
          ⭐ Reviews
        </a>
        {onPlan && planDays.length > 0 && (
          <AddToDay days={planDays} onAdd={onPlan} />
        )}
      </div>
    </motion.article>
  );
}

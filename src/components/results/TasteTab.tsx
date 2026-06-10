import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { DestinationRestaurants, Restaurant, DietaryOption, TravelConfig, ItineraryDay } from '../../types';
import { mapsUrl, directionsUrl, reviewsUrl } from '../../lib/deepLinks';
import { buildDayPlans, destinationDayRanges, dayRangeForDestination } from '../../lib/planStitch';
import { generateRestaurantAlternatives } from '../../lib/api';
import { addStopToDay } from '../../lib/planEdit';
import { addDaysISO, formatDayLabel } from '../../lib/dateUtils';
import DayRangeChip from '../shared/DayRangeChip';
import AddToDay, { type DayOption } from '../shared/AddToDay';

interface Props {
  restaurants: DestinationRestaurants[];
  config?: TravelConfig;
  itinerary?: ItineraryDay[];
  /** When provided, the tab becomes editable: remove a restaurant, or fetch
   *  more options per destination. */
  onUpdate?: (restaurants: DestinationRestaurants[]) => void;
  /** When provided, each card gets "＋ Plan" — add the restaurant to a day's
   *  itinerary (dinner slot) via the same plumbing as every other edit. */
  onUpdateItinerary?: (itinerary: ItineraryDay[]) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

type DietaryFilter = 'all' | DietaryOption;

const DIETARY_FILTERS: { id: DietaryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'halal', label: 'Halal' },
  { id: 'gluten-free', label: 'Gluten-free' },
];

export default function TasteTab({ restaurants, config, itinerary = [], onUpdate, onUpdateItinerary }: Props) {
  const dayRanges = useMemo(
    () => (config ? destinationDayRanges(buildDayPlans(config, itinerary, [], [], [])) : new Map()),
    [config, itinerary]
  );
  const [dietFilter, setDietFilter] = useState<DietaryFilter>('all');
  const [loadingMore, setLoadingMore] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string>('');

  // Remove a restaurant from a destination by name.
  const removeRestaurant = (destination: string, name: string) => {
    if (!onUpdate) return;
    const next = restaurants.map((d) =>
      d.destination === destination
        ? { ...d, restaurants: (d.restaurants ?? []).filter((r) => r.name !== name) }
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

  // Insert a restaurant into a day as a dinner stop (19:00, 90 min).
  const planRestaurant = (r: Restaurant, destination: string, dayNum: number) => {
    if (!onUpdateItinerary) return;
    onUpdateItinerary(addStopToDay(itinerary, dayNum, {
      title: r.name,
      location: destination,
      type: 'meal',
      time: '19:00',
      duration_min: 90,
      tip: r.signature_dish ? `Order the ${r.signature_dish}` : undefined,
    }));
  };

  // Fetch fresh restaurants for one destination and append them.
  const fetchMore = async (destination: string) => {
    if (!onUpdate || !config) return;
    const block = restaurants.find((d) => d.destination === destination);
    if (!block) return;
    setLoadingMore(destination);
    setMoreError('');
    try {
      const fresh = await generateRestaurantAlternatives(config, {
        destination,
        exclude: (block.restaurants ?? []).map((r) => r.name).filter(Boolean),
      });
      if (!fresh || fresh.length === 0) { setMoreError('No new spots came back — try again.'); return; }
      const have = new Set((block.restaurants ?? []).map((r) => (r.name || '').toLowerCase().trim()));
      const added = fresh.filter((r) => r?.name && !have.has(r.name.toLowerCase().trim()));
      if (added.length === 0) { setMoreError('No new spots came back — try again.'); return; }
      const next = restaurants.map((d) =>
        d.destination === destination ? { ...d, restaurants: [...(d.restaurants ?? []), ...added] } : d
      );
      onUpdate(next);
    } catch {
      setMoreError('Could not load more spots. Please try again.');
    } finally {
      setLoadingMore(null);
    }
  };

  const visibleByDest = useMemo(() => {
    return restaurants.map((dest) => ({
      destination: dest.destination,
      list:
        dietFilter === 'all'
          ? (dest.restaurants ?? [])
          : (dest.restaurants ?? []).filter((r) =>
              (r.dietary_options ?? []).includes(dietFilter)
            ),
    }));
  }, [restaurants, dietFilter]);

  const filteredTotal = useMemo(
    () => visibleByDest.reduce((s, d) => s + d.list.length, 0),
    [visibleByDest]
  );

  const presentDietary = useMemo(() => {
    const set = new Set<DietaryOption>();
    restaurants.forEach((d) =>
      (d.restaurants ?? []).forEach((r) => (r.dietary_options ?? []).forEach((o) => set.add(o)))
    );
    return set;
  }, [restaurants]);

  const availableFilters = DIETARY_FILTERS.filter(
    (f) => f.id === 'all' || presentDietary.has(f.id as DietaryOption)
  );

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="eyebrow mb-4">Taste</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-3">
          Curating <em>restaurants</em>…
        </h2>
        <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
          We're picking 5 places per stop — street food to fine dining. Hold tight.
        </p>
      </div>
    );
  }

  const filterLabel =
    dietFilter === 'all'
      ? null
      : DIETARY_FILTERS.find((f) => f.id === dietFilter)?.label.toLowerCase() ?? dietFilter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">A foodie's atlas</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">table</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">
          Five hand-picked restaurants per stop, mixing street stalls, neighbourhood favourites, and one fine-dining splurge.
        </p>
      </div>

      {/* Dietary filter */}
      {availableFilters.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          className="mb-6"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] mb-2">Dietary</p>
          <div className="flex flex-wrap gap-1.5">
            {availableFilters.map((f) => {
              const isActive = dietFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setDietFilter(f.id)}
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

      {filterLabel && (
        <motion.p
          key={dietFilter}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="eyebrow text-[var(--sage)] mb-8"
        >
          {filteredTotal} {filterLabel} {filteredTotal === 1 ? 'place' : 'places'} across your trip
        </motion.p>
      )}

      {dietFilter !== 'all' && filteredTotal === 0 && (
        <div className="surface-soft rounded-2xl p-6 text-center">
          <p className="text-[var(--text-muted)] text-sm">
            No {filterLabel} options surfaced yet — try a different filter.
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
                <span className="eyebrow text-[var(--text-dim)]">
                  {dest.list.length} places
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dest.list.map((r, ri) => (
                  <RestaurantCard
                    key={`${r.name}-${ri}`}
                    restaurant={r}
                    place={`${r.name}, ${dest.destination}`}
                    onRemove={onUpdate ? () => removeRestaurant(dest.destination, r.name) : undefined}
                    planDays={dayOptionsFor(dest.destination)}
                    onPlan={(dayNum) => planRestaurant(r, dest.destination, dayNum)}
                  />
                ))}
              </div>

              {/* More options — fetch fresh restaurants for this destination */}
              {onUpdate && (
                <div className="mt-5 flex flex-col items-center gap-2">
                  <button
                    onClick={() => fetchMore(dest.destination)}
                    disabled={loadingMore === dest.destination}
                    className="px-5 py-2.5 rounded-full text-sm font-medium border border-[var(--line-strong)] text-[var(--cream)] hover:bg-[var(--ink-4)] transition-colors disabled:opacity-50"
                  >
                    {loadingMore === dest.destination ? 'Finding more…' : `＋ More places to eat in ${dest.destination}`}
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

function RestaurantCard({ restaurant: r, place, onRemove, planDays = [], onPlan }: { restaurant: Restaurant; place: string; onRemove?: () => void; planDays?: DayOption[]; onPlan?: (day: number) => void }) {
  const tierColor = {
    '$': 'var(--sage)',
    '$$': 'var(--gold-soft)',
    '$$$': 'var(--gold)',
    '$$$$': 'var(--terracotta)',
  }[r.price_tier] || 'var(--text-muted)';

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="surface-card rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <p className="eyebrow mb-1">{r.cuisine}</p>
          <h4 className="font-display text-xl text-[var(--cream)] leading-tight">{r.name}</h4>
        </div>
        <div className="flex items-start gap-2 shrink-0">
          <span
            className="font-display text-base tracking-wider"
            style={{ color: tierColor }}
            title={priceLabel(r.price_tier)}
          >
            {r.price_tier}
          </span>
          {onRemove && (
            <button
              onClick={onRemove}
              aria-label={`Remove ${r.name}`}
              title="Remove from my plan"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 transition-colors text-sm leading-none"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <p className="text-[var(--text-dim)] text-[11px] tracking-wider uppercase mb-3">
        {r.neighbourhood}
      </p>

      <div className="surface-soft rounded-xl px-3 py-2 mb-3">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] mb-1">Order this</p>
        <p className="font-display-soft italic text-[var(--cream)] text-sm leading-snug">
          {r.signature_dish}
        </p>
      </div>

      <p className="text-[var(--text-muted)] text-[13px] leading-relaxed mb-4">
        {r.why}
      </p>

      {r.dietary_options && r.dietary_options.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {r.dietary_options.map((opt) => (
            <span
              key={opt}
              className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(122, 144, 130, 0.1)',
                color: 'var(--sage)',
                border: '1px solid rgba(122, 144, 130, 0.3)',
              }}
            >
              {opt}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--line)]">
        {r.reservation_link && (
          <a
            href={r.reservation_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] hover:bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-full px-3 py-1.5 transition-colors"
          >
            Reserve ↗
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
          href={reviewsUrl(r.name, r.neighbourhood)}
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

function priceLabel(tier: Restaurant['price_tier']): string {
  switch (tier) {
    case '$': return 'Cheap eats';
    case '$$': return 'Mid-range';
    case '$$$': return 'Splurge';
    case '$$$$': return 'Fine dining';
    default: return tier;
  }
}

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { NearbyPlace, Destination, NearbyCategory, TravelConfig, ItineraryDay } from '../../types';
import { getDestinationPhoto } from '../../lib/imagery';
import { buildDayPlans, destinationDayRanges, dayRangeForDestination } from '../../lib/planStitch';
import { PlaceActions } from '../shared/PlaceLink';
import DayRangeChip from '../shared/DayRangeChip';
import { EstimateNote } from '../shared/EstimateBadge';

interface Props {
  nearby: NearbyPlace[];
  destinations?: Destination[];
  config?: TravelConfig;
  itinerary?: ItineraryDay[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_META: Record<NearbyCategory, { label: string; icon: string }> = {
  beach: { label: 'Beach', icon: '🏖' },
  nature: { label: 'Nature', icon: '🌿' },
  culture: { label: 'Culture', icon: '🏛' },
  adventure: { label: 'Adventure', icon: '⚡' },
  food: { label: 'Food', icon: '🍴' },
  town: { label: 'Town', icon: '🏘' },
  landmark: { label: 'Landmark', icon: '✦' },
};
const ALL_CATEGORIES = Object.keys(CATEGORY_META) as NearbyCategory[];

type CategoryFilter = 'all' | NearbyCategory;
type LengthFilter = 'all' | 'half-day' | 'full-day';

export default function NearbyTab({ nearby, config, itinerary = [] }: Props) {
  const dayRanges = useMemo(
    () => (config ? destinationDayRanges(buildDayPlans(config, itinerary, [], [], [])) : new Map()),
    [config, itinerary]
  );
  const [catFilter, setCatFilter] = useState<CategoryFilter>('all');
  const [lenFilter, setLenFilter] = useState<LengthFilter>('all');

  const presentCategories = useMemo(() => {
    const set = new Set<NearbyCategory>();
    nearby.forEach((p) => { if (p.category) set.add(p.category); });
    return ALL_CATEGORIES.filter((c) => set.has(c));
  }, [nearby]);

  const hasLengthData = useMemo(() => nearby.some((p) => !!p.trip_length), [nearby]);

  const filtered = useMemo(() => {
    return nearby.filter((p) => {
      if (catFilter !== 'all' && p.category !== catFilter) return false;
      if (lenFilter !== 'all' && p.trip_length !== lenFilter) return false;
      return true;
    });
  }, [nearby, catFilter, lenFilter]);

  if (nearby.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Detours</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">Scouting <span className="text-[var(--gold)]">nearby</span>…</p>
      </div>
    );
  }

  const groups = filtered.reduce<Record<string, NearbyPlace[]>>((acc, place) => {
    const dest = place.destination;
    if (!acc[dest]) acc[dest] = [];
    acc[dest].push(place);
    return acc;
  }, {});
  const destNames = Object.keys(groups);
  const filtersActive = catFilter !== 'all' || lenFilter !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-8">
        <p className="eyebrow mb-3">Chapter IV — Detours</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          Nearby <span className="italic text-[var(--gold)]">gems</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">Day trips and worthwhile departures from each base.</p>
      </div>

      {/* Category filter */}
      {presentCategories.length > 1 && (
        <div className="mb-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] mb-2">Type</p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={catFilter === 'all'} onClick={() => setCatFilter('all')}>All</FilterChip>
            {presentCategories.map((c) => (
              <FilterChip key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>
                <span className="mr-1.5">{CATEGORY_META[c].icon}</span>{CATEGORY_META[c].label}
              </FilterChip>
            ))}
          </div>
        </div>
      )}

      {/* Trip length filter */}
      {hasLengthData && (
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] mb-2">Trip length</p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={lenFilter === 'all'} onClick={() => setLenFilter('all')}>Any</FilterChip>
            <FilterChip active={lenFilter === 'half-day'} onClick={() => setLenFilter('half-day')}>Half-day</FilterChip>
            <FilterChip active={lenFilter === 'full-day'} onClick={() => setLenFilter('full-day')}>Full-day</FilterChip>
          </div>
        </div>
      )}

      {filtersActive && (
        <p className="eyebrow text-[var(--sage)] mb-8">{filtered.length} {filtered.length === 1 ? 'detour' : 'detours'} match</p>
      )}

      {filtered.length === 0 ? (
        <div className="surface-soft rounded-2xl p-6 text-center">
          <p className="text-[var(--text-muted)] text-sm">No detours match these filters — try widening them.</p>
        </div>
      ) : (
        <div className="space-y-14">
          {destNames.map((dest, gi) => (
            <motion.section
              key={dest}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: gi * 0.08 }}
            >
              <div className="flex items-baseline gap-4 mb-6">
                <p className="eyebrow">While in</p>
                <h3 className="font-display italic text-2xl text-[var(--cream)]">{dest}</h3>
                <DayRangeChip range={dayRangeForDestination(dayRanges, dest)} />
                <div className="flex-1 h-px bg-[var(--line)]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {groups[dest].map((place, i) => (
                  <motion.article
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                    className="surface-soft rounded-3xl overflow-hidden flex flex-col group"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={getDestinationPhoto(place.name, 600, 400)}
                        alt={place.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { const img = e.currentTarget; if (img.dataset.fell) return; img.dataset.fell = '1'; img.src = `https://picsum.photos/seed/${encodeURIComponent(place.name)}/600/400`; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      {(place.category || place.trip_length) && (
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {place.category && CATEGORY_META[place.category] && (
                            <span className="text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full bg-black/55 backdrop-blur text-white border border-white/20">
                              {CATEGORY_META[place.category].icon} {CATEGORY_META[place.category].label}
                            </span>
                          )}
                          {place.trip_length && (
                            <span className="text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full bg-[var(--gold)]/95 text-white font-medium">
                              {place.trip_length}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                        <h4 className="font-display text-lg text-white leading-tight pr-2">{place.name}</h4>
                        <span className="shrink-0 text-[10px] font-medium tracking-[0.18em] uppercase px-3 py-1 rounded-full border border-white/30 text-white bg-black/40 backdrop-blur">
                          {place.travel_time}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[var(--text-muted)] text-[13px] leading-relaxed mb-4 flex-1">{place.why_visit}</p>
                      <div className="pt-4 border-t border-[var(--line)]">
                        <p className="eyebrow mb-1">Highlight</p>
                        <p className="font-display-soft italic text-[var(--cream)] text-[13px] leading-relaxed mb-3">{place.highlight}</p>
                        <PlaceActions place={place.name} compact />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      )}

      <EstimateNote what="travel times and trip lengths" />
    </motion.div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-wide transition-all ${
        active
          ? 'bg-[var(--cream)] text-[var(--ink)] font-medium'
          : 'border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)]'
      }`}
    >
      {children}
    </button>
  );
}

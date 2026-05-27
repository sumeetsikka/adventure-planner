import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Destination, VibeOption, TravellerProfile, TripMode, DietaryTag, MobilityTag, InterestTag } from '../../types';
import { calculateMidpointDays, determineEntryCity, orderDestinations } from '../../lib/routePlanner';
import { formatDateAU, addDaysISO, todayISO } from '../../lib/dateUtils';
import {
  ORIGIN_AIRPORTS,
  DEFAULT_ORIGIN,
  HOME_CURRENCIES,
  DEFAULT_HOME_CURRENCY,
} from '../../lib/originAirports';

export interface TravelDetailsData {
  departureDate: string;
  returnDate: string;
  travellers: number;
  ages: number[];
  vibes: VibeOption[];
  origin?: string;
  homeCurrency?: string;
  budgetPerPerson?: number;
  travellerProfiles?: TravellerProfile[];
  tripMode?: TripMode;
}

interface Props {
  destinations: Destination[];
  departureDate: string;
  returnDate: string;
  travellers: number;
  ages: number[];
  vibes: VibeOption[];
  origin?: string;
  homeCurrency?: string;
  budgetPerPerson?: number;
  travellerProfiles?: TravellerProfile[];
  tripMode?: TripMode;
  onUpdate: (data: TravelDetailsData) => void;
  onBack: () => void;
  onGenerate: (data: TravelDetailsData) => void;
}

const DIETARY_OPTIONS: { value: DietaryTag; label: string; icon: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'halal', label: 'Halal', icon: '☪️' },
  { value: 'kosher', label: 'Kosher', icon: '✡️' },
  { value: 'gluten-free', label: 'Gluten-free', icon: '🌾' },
  { value: 'dairy-free', label: 'Dairy-free', icon: '🥛' },
  { value: 'pescatarian', label: 'Pescatarian', icon: '🐟' },
  { value: 'nut-allergy', label: 'Nut allergy', icon: '🥜' },
  { value: 'shellfish-allergy', label: 'Shellfish allergy', icon: '🦐' },
];

const MOBILITY_OPTIONS: { value: MobilityTag; label: string; icon: string }[] = [
  { value: 'wheelchair', label: 'Wheelchair', icon: '♿' },
  { value: 'limited-walking', label: 'Limited walking', icon: '🚶' },
  { value: 'no-stairs', label: 'Avoid stairs', icon: '🪜' },
  { value: 'stroller', label: 'Stroller/pram', icon: '👶' },
  { value: 'vision-impaired', label: 'Vision impaired', icon: '👁️' },
  { value: 'hearing-impaired', label: 'Hearing impaired', icon: '👂' },
];

const INTEREST_OPTIONS: { value: InterestTag; label: string; icon: string }[] = [
  { value: 'food', label: 'Food', icon: '🍜' },
  { value: 'culture', label: 'Culture', icon: '🏛️' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'history', label: 'History', icon: '📜' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'nightlife', label: 'Nightlife', icon: '🌃' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'art', label: 'Art', icon: '🎨' },
  { value: 'family-fun', label: 'Family fun', icon: '🎢' },
  { value: 'wellness', label: 'Wellness', icon: '🧘' },
  { value: 'photography', label: 'Photography', icon: '📷' },
  { value: 'live-music', label: 'Live music', icon: '🎵' },
];

function ProfileChips({
  label, options, selected, onToggle,
}: {
  label: string;
  options: { value: string; label: string; icon: string }[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow mb-2 text-[10px]">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-all border ${
                isActive
                  ? 'border-[var(--terracotta)]/50 bg-[var(--terracotta)]/8 text-[var(--cream)]'
                  : 'border-[var(--line)] bg-[var(--ink)] text-[var(--text-muted)] hover:text-[var(--cream)]'
              }`}
            >
              <span className="text-sm leading-none">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const VIBES: { value: VibeOption; label: string; icon: string; desc: string }[] = [
  { value: 'adventure', label: 'Adventure', icon: '⚡', desc: 'Canyoning, motorbikes, thrills' },
  { value: 'beach', label: 'Beach', icon: '🏖️', desc: 'Sun, sand, surf, snorkelling' },
  { value: 'culture', label: 'Culture', icon: '🏛️', desc: 'Temples, history, traditions' },
  { value: 'foodie', label: 'Foodie', icon: '🍜', desc: 'Street food, cooking classes' },
  { value: 'nature', label: 'Nature', icon: '🌿', desc: 'Trekking, jungles, rice terraces' },
  { value: 'nightlife', label: 'Nightlife', icon: '🍻', desc: 'Rooftop bars, clubs' },
  { value: 'romance', label: 'Romance', icon: '💕', desc: 'Couples, sunsets, intimate dining' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', desc: 'Kid-friendly, safe, educational' },
  { value: 'luxury', label: 'Luxury', icon: '✨', desc: 'Five-star, spas, fine dining' },
  { value: 'backpacker', label: 'Backpacker', icon: '🎒', desc: 'Budget, hostels, local transport' },
  { value: 'photography', label: 'Photography', icon: '📸', desc: 'Golden hour, iconic shots' },
  { value: 'wellness', label: 'Wellness', icon: '🧘', desc: 'Yoga, spas, mindful travel' },
  { value: 'history', label: 'History', icon: '📜', desc: 'War sites, museums, heritage' },
];

export default function TravelDetails({
  destinations,
  departureDate,
  returnDate,
  travellers,
  ages,
  vibes,
  origin,
  homeCurrency,
  budgetPerPerson,
  travellerProfiles,
  tripMode,
  onUpdate,
  onBack,
  onGenerate,
}: Props) {
  const entryCity = determineEntryCity(destinations);
  const ordered = useMemo(() => orderDestinations(destinations, entryCity), [destinations, entryCity]);
  const recommendedDays = calculateMidpointDays(destinations);
  const minDays = destinations.reduce((s, d) => s + d.recommendedDays[0], 0);
  const maxDays = destinations.reduce((s, d) => s + d.recommendedDays[1], 0);

  // Honour incoming dates (a saved trip re-opened in the wizard, or a shared
  // link). Fall back to "today + 30 days" / the recommended length only when
  // no valid dates were passed in.
  const propDays = (() => {
    if (!departureDate || !returnDate) return null;
    const d = Math.round((new Date(returnDate).getTime() - new Date(departureDate).getTime()) / 86_400_000);
    return Number.isFinite(d) && d > 0 ? d : null;
  })();
  const [tripDays, setTripDays] = useState(propDays ?? recommendedDays);
  const [useRecommended, setUseRecommended] = useState(propDays == null || propDays === recommendedDays);
  const [startDate, setStartDate] = useState(departureDate || addDaysISO(todayISO(), 30));
  const [localTravellers, setLocalTravellers] = useState(travellers);
  const [localAges, setLocalAges] = useState<number[]>(
    ages.length === travellers ? ages : Array(travellers).fill(30)
  );
  const [localVibes, setLocalVibes] = useState<VibeOption[]>(vibes.length > 0 ? vibes : ['adventure', 'foodie']);
  const [localOrigin, setLocalOrigin] = useState<string>(origin || DEFAULT_ORIGIN);
  const [localHomeCurrency, setLocalHomeCurrency] = useState<string>(homeCurrency || DEFAULT_HOME_CURRENCY);
  const [originSearch, setOriginSearch] = useState('');
  // Empty string = "no budget target". Stored as a string so the input can be
  // cleared; coerced to a number only when handing off to generation.
  const [budgetInput, setBudgetInput] = useState<string>(
    budgetPerPerson ? String(budgetPerPerson) : ''
  );

  // Per-traveller profiles — names, dietary, mobility, interests. Initialised
  // from incoming prop or empty profiles aligned to the traveller count.
  const [profiles, setProfiles] = useState<TravellerProfile[]>(() => {
    if (travellerProfiles && travellerProfiles.length === travellers) return travellerProfiles;
    return Array.from({ length: travellers }, (_, i) => ({ age: ages[i] ?? 30 }));
  });
  const [expandedProfile, setExpandedProfile] = useState<number | null>(null);

  // Trip mode — auto-detected unless the user manually overrides.
  const autoMode: TripMode = (() => {
    const minAge = Math.min(...localAges);
    const maxAge = Math.max(...localAges);
    const mobilityNeeds = profiles.some(p => (p.mobility?.length ?? 0) > 0);
    if (mobilityNeeds) return 'accessibility';
    if (minAge < 13) return 'family';
    if (maxAge >= 65) return 'senior';
    return 'standard';
  })();
  const [modeOverride, setModeOverride] = useState<TripMode | undefined>(tripMode);
  const effectiveMode: TripMode = modeOverride ?? autoMode;

  const filteredOrigins = useMemo(() => {
    const q = originSearch.trim().toLowerCase();
    if (!q) return ORIGIN_AIRPORTS;
    return ORIGIN_AIRPORTS.filter(
      (a) =>
        a.city.toLowerCase().includes(q) ||
        a.iata.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q)
    );
  }, [originSearch]);

  const endDate = addDaysISO(startDate, tripDays);

  const updateTravellers = (count: number) => {
    setLocalTravellers(count);
    if (localAges.length < count) {
      setLocalAges([...localAges, ...Array(count - localAges.length).fill(30)]);
    } else if (localAges.length > count) {
      setLocalAges(localAges.slice(0, count));
    }
    // Keep per-traveller profiles aligned to the count.
    setProfiles((prev) => {
      if (prev.length === count) return prev;
      if (prev.length < count) {
        return [...prev, ...Array.from({ length: count - prev.length }, () => ({ age: 30 }))];
      }
      return prev.slice(0, count);
    });
    if (expandedProfile != null && expandedProfile >= count) setExpandedProfile(null);
  };

  const updateProfile = (idx: number, patch: Partial<TravellerProfile>) => {
    setProfiles((prev) => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
  };

  const toggleProfileTag = <K extends 'dietary' | 'mobility' | 'interests'>(
    idx: number, key: K, value: K extends 'dietary' ? DietaryTag : K extends 'mobility' ? MobilityTag : InterestTag
  ) => {
    setProfiles((prev) => prev.map((p, i) => {
      if (i !== idx) return p;
      const list = (p[key] as string[] | undefined) ?? [];
      const has = list.includes(value);
      const next = has ? list.filter(x => x !== value) : [...list, value];
      return { ...p, [key]: next.length > 0 ? next : undefined };
    }));
  };

  const toggleVibe = (v: VibeOption) => {
    setLocalVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const parsedBudget = Math.round(Number(budgetInput)) || 0;

  const handleGenerate = () => {
    // Build per-traveller profiles aligned to current ages, only including
    // a profile if it has any non-default detail to share with the LLM.
    const alignedProfiles: TravellerProfile[] = localAges.map((age, i) => {
      const base = profiles[i] || { age };
      return { ...base, age }; // age from the age input always wins
    });
    const hasAnyProfileDetail = alignedProfiles.some(
      p => (p.name && p.name.trim()) || (p.dietary?.length ?? 0) > 0 || (p.mobility?.length ?? 0) > 0 || (p.interests?.length ?? 0) > 0
    );

    const data: TravelDetailsData = {
      departureDate: startDate,
      returnDate: endDate,
      travellers: localTravellers,
      ages: localAges,
      vibes: localVibes.length > 0 ? localVibes : (['adventure', 'foodie'] as VibeOption[]),
      origin: localOrigin,
      homeCurrency: localHomeCurrency,
      budgetPerPerson: parsedBudget > 0 ? parsedBudget : undefined,
      travellerProfiles: hasAnyProfileDetail ? alignedProfiles : undefined,
      tripMode: modeOverride, // undefined means the API auto-detects
    };
    // Persist to app state for saving / ResultsView…
    onUpdate(data);
    // …and hand the SAME fresh values straight to generation, so it can't
    // race the (async) setState above and generate with stale dates.
    onGenerate(data);
  };

  return (
    <div className="min-h-screen bg-[var(--ink)] py-12 sm:py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="eyebrow mb-4">Chapter Three · The details</p>
          <h1 className="font-display text-5xl sm:text-6xl text-[var(--cream)] mb-4">
            When the story<br /><em className="italic text-shimmer">unfolds.</em>
          </h1>
          <p className="text-[var(--text-muted)] text-base font-light max-w-md mx-auto">
            We've mapped your ideal route. Tell us when, who, and how you travel.
          </p>
        </motion.div>

        <div className="space-y-5">
          {/* Route Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="surface-soft p-6"
          >
            <div className="flex items-baseline justify-between mb-4">
              <span className="eyebrow">Your route</span>
              <span className="text-[11px] text-[var(--text-dim)] font-light">{ordered.length} stops</span>
            </div>
            <div className="space-y-3">
              {ordered.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-[10px] text-[var(--text-dim)] w-4 font-light">{String(i + 1).padStart(2, '0')}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: `${d.colour}25`, border: `1px solid ${d.colour}40` }}
                  >
                    {d.emoji}
                  </div>
                  <p className="text-[var(--cream)] text-sm flex-1 font-light">{d.name}</p>
                  <span className="text-[var(--text-dim)] text-[11px]">{d.recommendedDays[0]}–{d.recommendedDays[1]}d</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Origin & Home currency */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="surface-soft p-6"
          >
            <div className="flex items-baseline justify-between mb-4">
              <span className="eyebrow">Where are you flying from?</span>
              <span className="text-[11px] text-[var(--text-dim)] font-light">
                {localOrigin}
              </span>
            </div>

            <input
              type="text"
              value={originSearch}
              onChange={(e) => setOriginSearch(e.target.value)}
              placeholder="Search city, IATA, or country…"
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-xl px-4 py-2.5 text-[var(--cream)] focus:outline-none focus:border-[var(--gold)]/40 transition-colors mb-3 text-sm font-light placeholder:text-[var(--text-dim)]"
            />

            <div className="max-h-44 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                {filteredOrigins.map((a) => {
                  const isActive = localOrigin === a.iata;
                  return (
                    <button
                      key={a.iata}
                      type="button"
                      onClick={() => setLocalOrigin(a.iata)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                        isActive
                          ? 'border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--cream)]'
                          : 'border-[var(--line)] bg-[var(--ink-3)] text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-[var(--cream)]'
                      }`}
                    >
                      <span className="mr-1.5">{a.flag}</span>
                      <span className="font-medium">{a.city}</span>
                      <span className="text-[var(--text-dim)] ml-1.5 tracking-wider text-[10px]">
                        {a.iata}
                      </span>
                    </button>
                  );
                })}
                {filteredOrigins.length === 0 && (
                  <p className="text-[var(--text-dim)] text-xs italic font-light px-1 py-2">
                    No matches — try a different search.
                  </p>
                )}
              </div>
            </div>

            <div className="divider my-5" />

            <div className="flex items-baseline justify-between mb-3">
              <span className="eyebrow">Home currency</span>
              <span className="text-[11px] text-[var(--text-dim)] font-light">
                {localHomeCurrency}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {HOME_CURRENCIES.map((c) => {
                const isActive = localHomeCurrency === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setLocalHomeCurrency(c.code)}
                    title={c.label}
                    className={`px-3 py-1.5 rounded-full text-xs tracking-wider transition-all border ${
                      isActive
                        ? 'border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--cream)]'
                        : 'border-[var(--line)] bg-[var(--ink-3)] text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-[var(--cream)]'
                    }`}
                  >
                    {c.code}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Trip Length */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="surface-soft p-6"
          >
            <span className="eyebrow block mb-3">Trip length</span>
            <p className="text-[var(--text-muted)] text-sm mb-5 font-light">
              We recommend <span className="font-display text-3xl text-[var(--gold)] mx-1">{recommendedDays}</span> days for this route.
            </p>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => { setUseRecommended(true); setTripDays(recommendedDays); }}
                className={`flex-1 px-4 py-3 rounded-full text-xs font-medium tracking-wide transition-all ${
                  useRecommended
                    ? 'bg-[var(--cream)] text-[var(--ink)]'
                    : 'bg-[var(--ink-3)] text-[var(--text-muted)] hover:text-[var(--cream)]'
                }`}
              >
                Accept {recommendedDays} days
              </button>
              <button
                type="button"
                onClick={() => setUseRecommended(false)}
                className={`flex-1 px-4 py-3 rounded-full text-xs font-medium tracking-wide transition-all ${
                  !useRecommended
                    ? 'bg-[var(--cream)] text-[var(--ink)]'
                    : 'bg-[var(--ink-3)] text-[var(--text-muted)] hover:text-[var(--cream)]'
                }`}
              >
                Customise
              </button>
            </div>
            {!useRecommended && (
              <div className="flex items-center justify-center gap-4 bg-[var(--ink-3)] rounded-2xl p-4 mt-3">
                <button type="button" onClick={() => setTripDays(Math.max(minDays, tripDays - 1))}
                  className="w-10 h-10 rounded-full bg-[var(--ink-4)] text-[var(--cream)] text-lg hover:bg-[var(--ink-2)] transition-colors">−</button>
                <div className="text-center">
                  <span className="font-display text-4xl text-[var(--cream)]">{tripDays}</span>
                  <span className="text-[var(--text-dim)] text-xs block">days</span>
                </div>
                <button type="button" onClick={() => setTripDays(Math.min(maxDays + 5, tripDays + 1))}
                  className="w-10 h-10 rounded-full bg-[var(--ink-4)] text-[var(--cream)] text-lg hover:bg-[var(--ink-2)] transition-colors">+</button>
              </div>
            )}
          </motion.div>

          {/* Start Date */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="surface-soft p-6"
          >
            <span className="eyebrow block mb-3">When do you leave?</span>
            <input
              type="date"
              value={startDate}
              min={todayISO()}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-xl px-4 py-3.5 text-[var(--cream)] focus:outline-none focus:border-[var(--gold)]/40 transition-colors mb-3 font-light"
            />
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(212, 165, 116, 0.06)', border: '1px solid rgba(212, 165, 116, 0.15)' }}>
              <span className="text-lg">✈️</span>
              <div>
                <p className="text-[var(--cream)] text-sm font-light">{formatDateAU(startDate)} → {formatDateAU(endDate)}</p>
                <p className="text-[var(--gold)] text-[11px] tracking-wide">{tripDays} days of adventure</p>
              </div>
            </div>
          </motion.div>

          {/* Travellers */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="surface-soft p-6"
          >
            <span className="eyebrow block mb-4">Who's going?</span>
            <div className="flex items-center justify-center gap-5 mb-5">
              <button type="button" onClick={() => updateTravellers(Math.max(1, localTravellers - 1))}
                className="w-10 h-10 rounded-full bg-[var(--ink-3)] text-[var(--cream)] text-lg hover:bg-[var(--ink-4)] transition-colors">−</button>
              <div className="text-center">
                <span className="font-display text-5xl text-[var(--cream)]">{localTravellers}</span>
                <p className="text-[var(--text-dim)] text-[10px] tracking-widest uppercase mt-1">Traveller{localTravellers > 1 ? 's' : ''}</p>
              </div>
              <button type="button" onClick={() => updateTravellers(Math.min(10, localTravellers + 1))}
                className="w-10 h-10 rounded-full bg-[var(--ink-3)] text-[var(--cream)] text-lg hover:bg-[var(--ink-4)] transition-colors">+</button>
            </div>
            {/* Per-traveller rows — name + age + optional details. */}
            <div className="space-y-2">
              {localAges.map((age, i) => {
                const profile = profiles[i] ?? { age };
                const isExpanded = expandedProfile === i;
                const tagCount = (profile.dietary?.length ?? 0) + (profile.mobility?.length ?? 0) + (profile.interests?.length ?? 0);
                return (
                  <div key={i} className="bg-[var(--ink-3)] border border-[var(--line)] rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--text-dim)] w-7 text-center">{String(i + 1).padStart(2, '0')}</span>
                      <input
                        type="text"
                        value={profile.name ?? ''}
                        onChange={(e) => updateProfile(i, { name: e.target.value })}
                        placeholder={`Traveller ${i + 1}`}
                        className="flex-1 bg-transparent text-[var(--cream)] text-sm focus:outline-none placeholder:text-[var(--text-dim)] font-light"
                      />
                      <input
                        type="number" min={1} max={99} value={age}
                        onChange={(e) => {
                          const v = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
                          const next = [...localAges];
                          next[i] = v;
                          setLocalAges(next);
                          updateProfile(i, { age: v });
                        }}
                        aria-label={`Age of traveller ${i + 1}`}
                        className="w-12 bg-[var(--ink)] border border-[var(--line)] rounded-lg px-1.5 py-1.5 text-[var(--cream)] text-center text-sm focus:outline-none focus:border-[var(--gold)]/40"
                      />
                      <button
                        type="button"
                        onClick={() => setExpandedProfile(isExpanded ? null : i)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] tracking-wider uppercase transition-all ${
                          isExpanded
                            ? 'bg-[var(--terracotta)]/10 text-[var(--terracotta)] border border-[var(--terracotta)]/30'
                            : tagCount > 0
                              ? 'bg-[var(--sage)]/10 text-[var(--sage)] border border-[var(--sage)]/30'
                              : 'border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)]'
                        }`}
                        aria-label={`${isExpanded ? 'Hide' : 'Show'} details for traveller ${i + 1}`}
                      >
                        {tagCount > 0 && !isExpanded ? `${tagCount} note${tagCount > 1 ? 's' : ''}` : 'Details'}
                        <span className={`inline-block transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-[var(--line)] space-y-4">
                        <ProfileChips
                          label="Diet"
                          options={DIETARY_OPTIONS}
                          selected={profile.dietary ?? []}
                          onToggle={(v) => toggleProfileTag(i, 'dietary', v as DietaryTag)}
                        />
                        <ProfileChips
                          label="Mobility"
                          options={MOBILITY_OPTIONS}
                          selected={profile.mobility ?? []}
                          onToggle={(v) => toggleProfileTag(i, 'mobility', v as MobilityTag)}
                        />
                        <ProfileChips
                          label="Interests"
                          options={INTEREST_OPTIONS}
                          selected={profile.interests ?? []}
                          onToggle={(v) => toggleProfileTag(i, 'interests', v as InterestTag)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Trip mode — auto-detected from profiles, user can override. */}
            <div className="mt-4 pt-4 border-t border-[var(--line)]">
              <div className="flex items-baseline justify-between mb-2.5">
                <span className="eyebrow">Trip mode</span>
                <span className="text-[10px] text-[var(--text-dim)] tracking-wider uppercase">
                  {modeOverride ? 'Override' : `Auto · ${autoMode}`}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['standard', 'family', 'senior', 'accessibility'] as const).map((m) => {
                  const isActive = effectiveMode === m;
                  const isAuto = !modeOverride && autoMode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModeOverride(isActive && modeOverride === m ? undefined : m)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs transition-all border ${
                        isActive
                          ? 'border-[var(--terracotta)]/60 bg-[var(--terracotta)]/8 text-[var(--cream)]'
                          : 'border-[var(--line)] bg-[var(--ink-3)] text-[var(--text-muted)] hover:text-[var(--cream)]'
                      }`}
                    >
                      <span className="text-lg leading-none">
                        {m === 'standard' ? '✦' : m === 'family' ? '🧸' : m === 'senior' ? '🌿' : '♿'}
                      </span>
                      <span className="font-medium capitalize">{m}</span>
                      {isAuto && <span className="text-[9px] text-[var(--terracotta)] tracking-wider uppercase">Auto</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-[var(--text-dim)] text-[11px] font-light mt-2.5 leading-relaxed">
                {effectiveMode === 'family' && '👨‍👩‍👧‍👦 Kid-friendly attractions, family hotels, indoor backups, naptime-aware pacing.'}
                {effectiveMode === 'senior' && '🌿 Slower pace, fewer activities per day, mobility-friendly routes, medical resources surfaced.'}
                {effectiveMode === 'accessibility' && '♿ Step-free routes, wheelchair-accessible venues, accessible-room hotels prioritised.'}
                {effectiveMode === 'standard' && '✦ Balanced mix of culture, food, adventure — the classic adventure-planner experience.'}
              </p>
            </div>
          </motion.div>

          {/* Budget */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="surface-soft p-6"
          >
            <div className="flex items-baseline justify-between mb-3">
              <span className="eyebrow">Your budget</span>
              <span className="text-[10px] text-[var(--text-dim)] font-light">Optional</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm mb-4 font-light">
              Set a target per person and we'll aim flights, hotels and the whole
              plan to land within ±20%.
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="Budget per person (AUD)"
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-xl pl-8 pr-4 py-3.5 text-[var(--cream)] focus:outline-none focus:border-[var(--gold)]/40 transition-colors font-light placeholder:text-[var(--text-dim)]"
              />
            </div>
            {parsedBudget > 0 && (
              <div
                className="flex items-center gap-3 mt-3 p-3 rounded-xl"
                style={{ background: 'rgba(31, 138, 112, 0.06)', border: '1px solid rgba(31, 138, 112, 0.15)' }}
              >
                <span className="text-lg">🎯</span>
                <div>
                  <p className="text-[var(--cream)] text-sm font-light">
                    ${parsedBudget.toLocaleString()} pp × {localTravellers}{' '}
                    {localTravellers > 1 ? 'travellers' : 'traveller'} ={' '}
                    <span className="font-medium">${(parsedBudget * localTravellers).toLocaleString()}</span> total
                  </p>
                  <p className="text-[var(--sage)] text-[11px] tracking-wide">Target for the whole trip</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Vibes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="surface-soft p-6"
          >
            <div className="flex items-baseline justify-between mb-4">
              <span className="eyebrow">Your vibes</span>
              <span className="text-[10px] text-[var(--text-dim)] font-light">{localVibes.length} selected · pick any</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VIBES.map((v) => {
                const isActive = localVibes.includes(v.value);
                return (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => toggleVibe(v.value)}
                    className={`group px-3 py-3 rounded-xl text-left transition-all border ${
                      isActive
                        ? 'border-[var(--gold)]/50 bg-[var(--gold)]/5'
                        : 'border-[var(--line)] bg-[var(--ink-3)] hover:border-[var(--line-strong)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{v.icon}</span>
                      {isActive && <span className="text-[var(--gold)] text-xs">✓</span>}
                    </div>
                    <span className={`text-xs font-medium block ${isActive ? 'text-[var(--cream)]' : 'text-[var(--text-muted)]'}`}>{v.label}</span>
                    <span className="text-[9px] text-[var(--text-dim)] leading-tight block font-light">{v.desc}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-between mt-10"
        >
          <button type="button" onClick={onBack}
            className="eyebrow text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors">
            ← Back
          </button>
          <button type="button" onClick={handleGenerate}
            className="px-8 py-3.5 rounded-full font-medium text-white bg-[var(--terracotta)] hover:bg-[var(--terracotta-soft)] transition-colors text-sm tracking-wide">
            Craft my journey →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

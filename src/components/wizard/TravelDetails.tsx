import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Destination, VibeOption } from '../../types';
import { calculateMidpointDays, determineEntryCity, orderDestinations } from '../../lib/routePlanner';
import { formatDateAU, addDaysISO, todayISO } from '../../lib/dateUtils';

interface Props {
  destinations: Destination[];
  departureDate: string;
  returnDate: string;
  travellers: number;
  ages: number[];
  vibes: VibeOption[];
  onUpdate: (data: {
    departureDate: string;
    returnDate: string;
    travellers: number;
    ages: number[];
    vibes: VibeOption[];
  }) => void;
  onBack: () => void;
  onGenerate: () => void;
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
  travellers,
  ages,
  vibes,
  onUpdate,
  onBack,
  onGenerate,
}: Props) {
  const entryCity = determineEntryCity(destinations);
  const ordered = useMemo(() => orderDestinations(destinations, entryCity), [destinations, entryCity]);
  const recommendedDays = calculateMidpointDays(destinations);
  const minDays = destinations.reduce((s, d) => s + d.recommendedDays[0], 0);
  const maxDays = destinations.reduce((s, d) => s + d.recommendedDays[1], 0);

  const [tripDays, setTripDays] = useState(recommendedDays);
  const [useRecommended, setUseRecommended] = useState(true);
  const [startDate, setStartDate] = useState(addDaysISO(todayISO(), 30));
  const [localTravellers, setLocalTravellers] = useState(travellers);
  const [localAges, setLocalAges] = useState<number[]>(
    ages.length === travellers ? ages : Array(travellers).fill(30)
  );
  const [localVibes, setLocalVibes] = useState<VibeOption[]>(vibes.length > 0 ? vibes : ['adventure', 'foodie']);

  const endDate = addDaysISO(startDate, tripDays);

  const updateTravellers = (count: number) => {
    setLocalTravellers(count);
    if (localAges.length < count) {
      setLocalAges([...localAges, ...Array(count - localAges.length).fill(30)]);
    } else if (localAges.length > count) {
      setLocalAges(localAges.slice(0, count));
    }
  };

  const toggleVibe = (v: VibeOption) => {
    setLocalVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const handleGenerate = () => {
    onUpdate({
      departureDate: startDate,
      returnDate: endDate,
      travellers: localTravellers,
      ages: localAges,
      vibes: localVibes.length > 0 ? localVibes : ['adventure', 'foodie'],
    });
    onGenerate();
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
            <div className="flex flex-wrap gap-2 justify-center">
              {localAges.map((age, i) => (
                <div key={i} className="text-center">
                  <span className="text-[9px] text-[var(--text-dim)] tracking-widest uppercase block mb-1">Age {i + 1}</span>
                  <input
                    type="number" min={1} max={99} value={age}
                    onChange={(e) => {
                      const next = [...localAges];
                      next[i] = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
                      setLocalAges(next);
                    }}
                    className="w-14 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg px-2 py-2 text-[var(--cream)] text-center text-sm focus:outline-none focus:border-[var(--gold)]/40 transition-colors font-light"
                  />
                </div>
              ))}
            </div>
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
            className="px-8 py-3.5 rounded-full font-medium text-[var(--ink)] bg-[var(--cream)] hover:bg-[var(--paper)] transition-colors text-sm tracking-wide">
            Craft my journey →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

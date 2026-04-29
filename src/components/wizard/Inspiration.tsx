import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries } from '../../data/countries';
import { useWikiImage } from '../../lib/useWikiImage';
import type { Country } from '../../types';

interface Props {
  onSelectCountry: (country: Country) => void;
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Curated mood/season heuristics. Each suggestion maps to country IDs from
 * src/data/countries.ts. Used to seed the recommendation when user picks a
 * vibe + month + budget. Pure client-side, no LLM call needed.
 */
const SUGGESTIONS: Array<{
  vibe: string;
  emoji: string;
  monthsBest: number[]; // 0-indexed
  countryIds: string[];
  budget: 'budget' | 'mid' | 'luxe';
  blurb: string;
}> = [
  // Beach + warm
  { vibe: 'beach', emoji: '🏖️', monthsBest: [11, 0, 1, 2, 3], countryIds: ['maldives', 'fiji', 'mauritius', 'philippines'], budget: 'luxe', blurb: 'Crystal water, no plans.' },
  { vibe: 'beach', emoji: '🏖️', monthsBest: [11, 0, 1, 2, 3], countryIds: ['indonesia', 'thailand', 'vietnam'], budget: 'mid', blurb: 'Island-hop on a budget.' },
  // Nature + cool
  { vibe: 'nature', emoji: '🌿', monthsBest: [5, 6, 7, 8], countryIds: ['iceland', 'norway', 'newzealand', 'switzerland'], budget: 'mid', blurb: 'Glaciers, fjords, midnight sun.' },
  { vibe: 'nature', emoji: '🌿', monthsBest: [9, 10, 11], countryIds: ['peru', 'iceland', 'newzealand'], budget: 'mid', blurb: 'Autumn light, empty trails.' },
  // Culture
  { vibe: 'culture', emoji: '🏛️', monthsBest: [3, 4, 5, 9, 10], countryIds: ['italy', 'greece', 'spain', 'portugal'], budget: 'mid', blurb: 'Ruins, wine, golden hour.' },
  { vibe: 'culture', emoji: '🏛️', monthsBest: [2, 3, 4, 9, 10], countryIds: ['japan', 'cambodia', 'vietnam'], budget: 'mid', blurb: 'Temples and ancient cities.' },
  { vibe: 'culture', emoji: '🏛️', monthsBest: [9, 10, 11, 2, 3], countryIds: ['egypt', 'turkey', 'morocco', 'mexico'], budget: 'budget', blurb: 'Bazaars, pyramids, mezcal nights.' },
  // Foodie
  { vibe: 'foodie', emoji: '🍜', monthsBest: [3, 4, 9, 10], countryIds: ['italy', 'japan', 'thailand', 'spain'], budget: 'mid', blurb: 'Eat your way through.' },
  // Adventure
  { vibe: 'adventure', emoji: '⚡', monthsBest: [11, 0, 1, 2, 5, 6, 7], countryIds: ['newzealand', 'peru', 'iceland', 'norway'], budget: 'mid', blurb: 'Bungy, hike, ride.' },
  // Romance
  { vibe: 'romance', emoji: '💕', monthsBest: [3, 4, 5, 8, 9, 10], countryIds: ['italy', 'france', 'greece', 'maldives'], budget: 'luxe', blurb: 'Sunsets and soft mornings.' },
  // Family
  { vibe: 'family', emoji: '👨‍👩‍👧', monthsBest: [5, 6, 11, 0], countryIds: ['italy', 'japan', 'newzealand', 'mexico'], budget: 'mid', blurb: 'Easy, fun, memorable.' },
  // City
  { vibe: 'city', emoji: '🌃', monthsBest: [3, 4, 5, 8, 9, 10], countryIds: ['japan', 'france', 'germany', 'netherlands'], budget: 'mid', blurb: 'Concrete, neon, espresso.' },
  // Luxury
  { vibe: 'luxury', emoji: '✨', monthsBest: [3, 4, 5, 8, 9, 10], countryIds: ['france', 'switzerland', 'maldives', 'japan'], budget: 'luxe', blurb: 'Suite, spa, sea view.' },
];

const VIBES = [
  { key: 'beach', label: 'Sun + sea', emoji: '🏖️' },
  { key: 'nature', label: 'Wild + outdoors', emoji: '🌿' },
  { key: 'culture', label: 'History + culture', emoji: '🏛️' },
  { key: 'foodie', label: 'Food + drink', emoji: '🍜' },
  { key: 'adventure', label: 'Adventure', emoji: '⚡' },
  { key: 'romance', label: 'Romance', emoji: '💕' },
  { key: 'family', label: 'Family-friendly', emoji: '👨‍👩‍👧' },
  { key: 'city', label: 'City break', emoji: '🌃' },
  { key: 'luxury', label: 'Luxury', emoji: '✨' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BUDGETS = [
  { key: 'budget', label: 'Backpacker', sub: 'Under $2k pp' },
  { key: 'mid', label: 'Mid-range', sub: '$2-5k pp' },
  { key: 'luxe', label: 'Luxe', sub: '$5k+ pp' },
];

export default function Inspiration({ onSelectCountry, onClose }: Props) {
  const [vibe, setVibe] = useState<string | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [budget, setBudget] = useState<string | null>(null);

  const matches = SUGGESTIONS.filter(s => {
    const vibeMatch = !vibe || s.vibe === vibe;
    const monthMatch = s.monthsBest.includes(month);
    const budgetMatch = !budget || s.budget === budget;
    return vibeMatch && monthMatch && budgetMatch;
  });

  const matchedCountryIds = Array.from(new Set(matches.flatMap(s => s.countryIds)));
  const matchedCountries = matchedCountryIds
    .map(id => countries.find(c => c.id === id))
    .filter(Boolean) as Country[];

  return (
    <div className="min-h-screen px-6 py-12 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onClose}
          className="eyebrow text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors mb-8"
        >
          ← Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12"
        >
          <p className="eyebrow mb-4">Don't know where</p>
          <h1 className="font-display text-5xl sm:text-7xl text-[var(--cream)] leading-[0.95] mb-5">
            Tell us the<br />
            <em className="italic text-shimmer">feeling</em>.
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl font-light">
            We'll match it to a country, season, and price tag — and start the planning from there.
          </p>
        </motion.div>

        <div className="space-y-10 mb-16">
          {/* Vibe */}
          <section>
            <p className="eyebrow mb-4">What kind of trip?</p>
            <div className="flex flex-wrap gap-2">
              {VIBES.map(v => (
                <button
                  key={v.key}
                  onClick={() => setVibe(vibe === v.key ? null : v.key)}
                  className={`px-4 py-2.5 rounded-full text-sm border transition-all ${
                    vibe === v.key
                      ? 'bg-[var(--cream)] text-[var(--ink)] border-[var(--cream)]'
                      : 'bg-[var(--ink-3)] text-[var(--text-muted)] border-[var(--line)] hover:border-[var(--line-strong)] hover:text-[var(--cream)]'
                  }`}
                >
                  <span className="mr-2">{v.emoji}</span>{v.label}
                </button>
              ))}
            </div>
          </section>

          {/* Month */}
          <section>
            <p className="eyebrow mb-4">When?</p>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setMonth(i)}
                  className={`py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                    month === i
                      ? 'bg-[var(--gold)] text-[var(--ink)]'
                      : 'bg-[var(--ink-3)] text-[var(--text-muted)] hover:text-[var(--cream)]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          {/* Budget */}
          <section>
            <p className="eyebrow mb-4">Budget?</p>
            <div className="grid grid-cols-3 gap-2 max-w-md">
              {BUDGETS.map(b => (
                <button
                  key={b.key}
                  onClick={() => setBudget(budget === b.key ? null : b.key)}
                  className={`px-4 py-3 rounded-2xl text-left border transition-all ${
                    budget === b.key
                      ? 'bg-[var(--cream)] text-[var(--ink)] border-[var(--cream)]'
                      : 'bg-[var(--ink-3)] text-[var(--cream)] border-[var(--line)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  <span className="font-display text-base block leading-tight">{b.label}</span>
                  <span className={`text-[11px] ${budget === b.key ? 'text-[var(--ink)]/70' : 'text-[var(--text-dim)]'}`}>
                    {b.sub}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <p className="eyebrow">{matchedCountries.length} matches</p>
            {(vibe || budget) && (
              <button
                onClick={() => { setVibe(null); setBudget(null); }}
                className="text-[11px] tracking-wider uppercase text-[var(--text-dim)] hover:text-[var(--cream)]"
              >
                Clear
              </button>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {matchedCountries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <p className="font-display text-3xl text-[var(--cream)] italic mb-2">No match.</p>
                <p className="text-[var(--text-muted)] text-sm">Try a different month or budget.</p>
              </motion.div>
            ) : (
              <motion.div
                key={`${vibe}-${month}-${budget}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {matchedCountries.map((country, i) => (
                  <SuggestionCard
                    key={country.id}
                    country={country}
                    blurb={matches.find(s => s.countryIds.includes(country.id))?.blurb || country.tagline}
                    index={i}
                    onSelect={() => onSelectCountry(country)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ country, blurb, index, onSelect }: { country: Country; blurb: string; index: number; onSelect: () => void }) {
  const photo = useWikiImage(country.name, 'country');

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.04, ease: EASE }}
      whileHover={{ y: -3 }}
      onClick={onSelect}
      className="group relative rounded-2xl overflow-hidden border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors h-56 text-left"
      style={{
        background: `linear-gradient(145deg, ${country.colour}cc 0%, ${country.colour}55 50%, var(--ink-2) 100%)`,
      }}
    >
      {photo && (
        <img
          src={photo}
          alt={country.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-all duration-[1.2s] group-hover:scale-105"
          onError={(e) => {
            const i = e.currentTarget;
            if (i.dataset.fell) { i.style.display = 'none'; return; }
            i.dataset.fell = '1';
            i.src = `https://picsum.photos/seed/${encodeURIComponent(country.id)}/800/600`;
          }}
        />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.15) 0%, rgba(10,8,6,0.6) 50%, rgba(10,8,6,0.95) 100%)' }} />
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <span className="text-2xl drop-shadow-lg mb-2">{country.emoji}</span>
        <h3 className="font-display text-2xl text-[var(--cream)] leading-tight mb-1.5 drop-shadow-md">{country.name}</h3>
        <p className="text-[12px] text-[var(--cream)]/80 italic font-display-soft mb-3">{blurb}</p>
        <div className="pt-3 border-t border-[var(--cream)]/15 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold-soft)]">Plan this</span>
          <span className="text-[var(--cream)] text-sm group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </motion.button>
  );
}

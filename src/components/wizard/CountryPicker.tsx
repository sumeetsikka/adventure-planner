import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries } from '../../data/countries';
import { getDestinationsForCountry } from '../../data/destinations';
import { useWikiImage } from '../../lib/useWikiImage';
import type { Country } from '../../types';

interface Props {
  onSelect: (country: Country) => void;
}

const REGIONS: Record<string, string[]> = {
  'Asia': ['vietnam', 'thailand', 'japan', 'indonesia', 'philippines', 'cambodia'],
  'Europe': ['italy', 'france', 'spain', 'portugal', 'greece', 'switzerland', 'germany', 'netherlands', 'belgium', 'austria', 'norway', 'sweden', 'croatia', 'iceland'],
  'Africa & Middle East': ['morocco', 'egypt', 'turkey', 'mauritius'],
  'Americas': ['peru', 'mexico'],
  'Oceania & Pacific': ['newzealand', 'fiji'],
  'Indian Ocean': ['maldives'],
};

export default function CountryPicker({ onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [hovered, setHovered] = useState<Country | null>(null);

  const grouped = useMemo(() => {
    return Object.entries(REGIONS)
      .map(([name, ids]) => {
        const cs = countries.filter(c => ids.includes(c.id));
        return {
          name,
          countries: search ? cs.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : cs,
        };
      })
      .filter(r => r.countries.length > 0);
  }, [search]);

  const handleCustom = () => {
    if (!customCountry.trim()) return;
    const name = customCountry.trim();
    onSelect({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name, emoji: '🌍', colour: '#C65D3B',
      tagline: `Explore ${name} your way`,
      origin: 'MEL', currency: 'AUD', prebuilt: false,
    });
  };

  // Hero image: show hovered country, or rotate through a few defaults
  const heroCountry = hovered || countries[0];
  const heroImage = useWikiImage(heroCountry.name);

  return (
    <div className="relative min-h-screen">
      {/* Full-bleed cinematic hero */}
      <div className="fixed inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroCountry.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${heroCountry.colour}60 0%, var(--ink) 70%)` }}
          >
            {heroImage && (
              <img
                src={heroImage}
                alt={heroCountry.name}
                className="w-full h-full object-cover animate-ken-burns"
                loading="eager"
              />
            )}
            <div className="absolute inset-0 img-overlay" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0.4) 40%, rgba(10,8,6,0.9) 100%)' }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 sm:py-20">
        {/* Top brand line */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-20 sm:mb-32"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--gold)] animate-gentle-pulse" />
            <span className="eyebrow">The Adventure Planner</span>
          </div>
          <div className="text-[10px] text-[var(--text-dim)] tracking-widest uppercase hidden sm:block">
            ISSUE № 01
          </div>
        </motion.div>

        {/* Editorial headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 sm:mb-20 max-w-3xl"
        >
          <p className="eyebrow mb-4 text-[var(--text-muted)]">Chapter One · Choose your destination</p>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-[var(--cream)] mb-6">
            Where the story<br />
            <em className="italic text-shimmer">begins.</em>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-xl leading-relaxed font-light">
            Twenty-nine countries. Four hundred destinations. One perfectly crafted journey, built just for you.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-lg mb-16"
        >
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a country…"
              className="w-full bg-[var(--ink-2)]/80 backdrop-blur-md border border-[var(--line)] rounded-full pl-14 pr-6 py-4 text-[var(--cream)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)]/40 transition-all font-light"
            />
          </div>
        </motion.div>

        {/* Country regions */}
        <div className="space-y-14">
          {grouped.map((region, ri) => (
            <motion.section
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + ri * 0.1 }}
            >
              <div className="flex items-baseline gap-6 mb-6">
                <h2 className="font-display text-2xl sm:text-3xl text-[var(--cream)]">{region.name}</h2>
                <div className="flex-1 h-px bg-[var(--line)]" />
                <span className="eyebrow text-[var(--text-dim)]">{region.countries.length} destinations</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {region.countries.map((country) => (
                  <CountryTile
                    key={country.id}
                    country={country}
                    onSelect={onSelect}
                    onHover={setHovered}
                  />
                ))}
              </div>
            </motion.section>
          ))}

          {grouped.length === 0 && search && (
            <div className="text-center py-12">
              <p className="font-display text-3xl text-[var(--cream)] italic mb-2">No match</p>
              <p className="text-[var(--text-muted)]">Try the custom destination below.</p>
            </div>
          )}
        </div>

        {/* Custom country */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 mb-8"
        >
          <div className="divider mb-10" />
          <div className="max-w-lg mx-auto text-center">
            <span className="eyebrow block mb-3">Somewhere else?</span>
            <h3 className="font-display text-3xl text-[var(--cream)] mb-3">
              Anywhere in the world.
            </h3>
            <p className="text-[var(--text-muted)] text-sm mb-6 font-light">
              Type any country and we'll build your trip from scratch.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustom()}
                placeholder="e.g. Sri Lanka, South Korea, Argentina…"
                className="flex-1 bg-[var(--ink-2)]/80 backdrop-blur-md border border-[var(--line)] rounded-full px-5 py-3.5 text-[var(--cream)] placeholder-[var(--text-dim)] text-sm focus:outline-none focus:border-[var(--gold)]/40 transition-all font-light"
              />
              <button
                onClick={handleCustom}
                disabled={!customCountry.trim()}
                className="px-6 py-3.5 rounded-full font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--paper)]"
              >
                Begin →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CountryTile({ country, onSelect, onHover }: { country: Country; onSelect: (c: Country) => void; onHover: (c: Country | null) => void }) {
  const destCount = getDestinationsForCountry(country.id)?.length ?? 0;
  const photo = useWikiImage(country.name);

  return (
    <motion.button
      onClick={() => onSelect(country)}
      onMouseEnter={() => onHover(country)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl text-left h-56 border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors"
      style={{
        background: `linear-gradient(145deg, ${country.colour}dd 0%, ${country.colour}55 50%, var(--ink-2) 100%)`,
      }}
    >
      {/* Photo layer (if it loads, blends on top) */}
      <img
        src={photo}
        alt={country.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-[1.2s] group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Readability overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.1) 0%, rgba(10,8,6,0.65) 70%, rgba(10,8,6,0.95) 100%)' }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-multiply" style={{ background: country.colour }} />

      {/* Top row: flag + destination count */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <span className="text-3xl drop-shadow-lg">{country.emoji}</span>
        {destCount > 0 && (
          <span className="text-[9px] tracking-[0.2em] uppercase text-[var(--cream)] bg-[var(--ink)]/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-[var(--line-strong)]">
            {destCount} stops
          </span>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
        <h3 className="font-display text-[28px] sm:text-3xl text-[var(--cream)] leading-[1.05] mb-1.5 drop-shadow-md">
          {country.name}
        </h3>
        <p className="text-[11.5px] text-[var(--cream)]/80 leading-snug font-light italic line-clamp-2 font-display-soft">
          {country.tagline}.
        </p>
        <div className="mt-3 pt-3 border-t border-[var(--cream)]/15 flex items-center justify-between">
          <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--gold-soft)]">
            Begin here
          </span>
          <span className="text-[var(--cream)] text-sm group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </motion.button>
  );
}

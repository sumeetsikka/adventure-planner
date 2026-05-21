import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { countries } from '../../data/countries';
import { getDestinationsForCountry } from '../../data/destinations';
import { useWikiImage } from '../../lib/useWikiImage';
import { isInWishlist, toggleWishlist } from '../../lib/wishlist';
import type { Country } from '../../types';

interface Props {
  onSelect: (country: Country) => void;
  onInspire?: () => void;
  onWishlist?: () => void;
  onMyTrips?: () => void;
  savedTripCount?: number;
}

const REGIONS: Record<string, string[]> = {
  'Asia': ['vietnam', 'thailand', 'japan', 'indonesia', 'philippines', 'cambodia'],
  'Europe': ['italy', 'france', 'spain', 'portugal', 'greece', 'switzerland', 'germany', 'netherlands', 'belgium', 'austria', 'norway', 'sweden', 'croatia', 'iceland'],
  'Africa & Middle East': ['morocco', 'egypt', 'turkey', 'mauritius'],
  'Americas': ['peru', 'mexico'],
  'Oceania & Pacific': ['newzealand', 'fiji'],
  'Indian Ocean': ['maldives'],
};

export default function CountryPicker({ onSelect, onInspire, onWishlist, onMyTrips, savedTripCount = 0 }: Props) {
  const [search, setSearch] = useState('');
  const [customCountry, setCustomCountry] = useState('');

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

  const totalShown = grouped.reduce((n, r) => n + r.countries.length, 0);

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

  return (
    <div className="relative min-h-screen bg-[var(--ink)]">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-30 bg-[var(--ink)]/90 backdrop-blur-xl border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[var(--terracotta)] flex items-center justify-center text-white text-sm">✦</span>
            <span className="font-display-soft text-base text-[var(--cream)]">Adventure Planner</span>
          </div>
          <div className="flex items-center gap-2">
            {onWishlist && (
              <button
                onClick={onWishlist}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--cream)] rounded-full px-3.5 py-2 hover:bg-[var(--ink-4)] transition-colors"
              >
                ★ Wishlist
              </button>
            )}
            {onMyTrips && savedTripCount > 0 && (
              <button
                onClick={onMyTrips}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--cream)] border border-[var(--line-strong)] rounded-full px-4 py-2 hover:bg-[var(--ink-4)] transition-colors"
              >
                My trips
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[var(--terracotta)] text-white text-[11px] font-semibold">
                  {savedTripCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pb-24">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12 sm:pt-20 pb-10"
        >
          <p className="eyebrow mb-4">Choose your destination</p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-[var(--cream)] max-w-3xl">
            Where to <em className="text-[var(--terracotta)]">next?</em>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--text-muted)] max-w-xl leading-relaxed">
            Twenty-nine countries, four hundred destinations — one perfectly crafted journey, built just for you.
          </p>

          {/* Search + actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a country…"
                className="w-full bg-[var(--ink-2)] border border-[var(--line-strong)] rounded-full pl-11 pr-5 py-3.5 text-[var(--cream)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--terracotta)] focus:bg-[var(--ink)] transition-all"
              />
            </div>
            {onInspire && (
              <button
                onClick={onInspire}
                className="px-6 py-3.5 rounded-full text-sm font-medium bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-soft)] transition-colors whitespace-nowrap shadow-[var(--shadow-sm)]"
              >
                ✦ Inspire me
              </button>
            )}
            {onWishlist && (
              <button
                onClick={onWishlist}
                className="sm:hidden px-6 py-3.5 rounded-full text-sm font-medium border border-[var(--line-strong)] text-[var(--cream)] hover:bg-[var(--ink-4)] transition-colors whitespace-nowrap"
              >
                ★ Wishlist
              </button>
            )}
          </div>
        </motion.section>

        {/* Country regions */}
        <div className="space-y-12">
          {grouped.map((region, ri) => (
            <motion.section
              key={region.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + ri * 0.08 }}
            >
              <div className="flex items-baseline gap-4 mb-5">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--cream)]">{region.name}</h2>
                <div className="flex-1 h-px bg-[var(--line)]" />
                <span className="eyebrow text-[var(--text-dim)]">{region.countries.length} countries</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {region.countries.map((country) => (
                  <CountryTile key={country.id} country={country} onSelect={onSelect} />
                ))}
              </div>
            </motion.section>
          ))}

          {totalShown === 0 && search && (
            <div className="text-center py-12">
              <p className="font-display text-2xl text-[var(--cream)] mb-2">No match for "{search}"</p>
              <p className="text-[var(--text-muted)]">Try the custom destination below.</p>
            </div>
          )}
        </div>

        {/* Custom country */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <div className="surface-soft p-7 sm:p-10 text-center">
            <span className="text-3xl">🌍</span>
            <h3 className="font-display text-2xl sm:text-3xl text-[var(--cream)] mt-3 mb-2">
              Somewhere else?
            </h3>
            <p className="text-[var(--text-muted)] text-sm mb-6 max-w-sm mx-auto">
              Type any country in the world and we'll build your trip from scratch.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input
                type="text"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustom()}
                placeholder="e.g. Sri Lanka, South Korea, Argentina…"
                className="flex-1 bg-[var(--ink)] border border-[var(--line-strong)] rounded-full px-5 py-3.5 text-[var(--cream)] placeholder-[var(--text-dim)] text-sm focus:outline-none focus:border-[var(--terracotta)] transition-all"
              />
              <button
                onClick={handleCustom}
                disabled={!customCountry.trim()}
                className="px-7 py-3.5 rounded-full font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-soft)]"
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

function CountryTile({ country, onSelect }: { country: Country; onSelect: (c: Country) => void }) {
  const destCount = getDestinationsForCountry(country.id)?.length ?? 0;
  const photo = useWikiImage(country.name, 'country');
  const [saved, setSaved] = useState<boolean>(() => isInWishlist(country.id));

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(toggleWishlist(country.id));
  };

  return (
    <motion.div
      onClick={() => onSelect(country)}
      role="button"
      tabIndex={0}
      aria-label={`Plan a trip to ${country.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(country); }
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group surface-card overflow-hidden text-left p-0 flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terracotta)]"
    >
      {/* Photo */}
      <div className="relative aspect-[5/4] overflow-hidden bg-[var(--ink-4)]">
        {photo && (
          <img
            src={photo}
            alt={country.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.fell) { img.style.display = 'none'; return; }
              img.dataset.fell = 'true';
              img.src = `https://picsum.photos/seed/${encodeURIComponent(country.id)}/800/600`;
            }}
          />
        )}
        {/* Top row: stops + star */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {destCount > 0 ? (
            <span className="text-[10px] font-semibold tracking-wide uppercase text-[var(--cream)] bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
              {destCount} stops
            </span>
          ) : <span />}
          <button
            onClick={handleStarClick}
            aria-label={saved ? `Remove ${country.name} from wishlist` : `Save ${country.name} to wishlist`}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all shadow-sm ${
              saved
                ? 'bg-[var(--terracotta)] text-white'
                : 'bg-white/90 text-[var(--text-muted)] hover:text-[var(--terracotta)]'
            }`}
          >
            ★
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{country.emoji}</span>
          <h3 className="font-display-soft text-lg text-[var(--cream)] leading-tight">
            {country.name}
          </h3>
        </div>
        <p className="mt-1.5 text-[13px] text-[var(--text-muted)] leading-snug line-clamp-2 flex-1">
          {country.tagline}.
        </p>
        <div className="mt-3 pt-3 border-t border-[var(--line)] flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide uppercase text-[var(--terracotta)]">
            Begin here
          </span>
          <span className="text-[var(--terracotta)] text-base group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </motion.div>
  );
}

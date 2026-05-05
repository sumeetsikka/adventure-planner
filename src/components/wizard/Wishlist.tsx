import { useState } from 'react';
import { motion } from 'framer-motion';
import { countries } from '../../data/countries';
import { listWishlist, removeFromWishlist } from '../../lib/wishlist';
import { useWikiImage } from '../../lib/useWikiImage';
import type { Country } from '../../types';

interface Props {
  onPlanTrip: (country: Country) => void;
  onBack: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Wishlist({ onPlanTrip, onBack }: Props) {
  const [ids, setIds] = useState<string[]>(() => listWishlist());

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    setIds(listWishlist());
  };

  const wishlistCountries = ids
    .map((id) => countries.find((c) => c.id === id))
    .filter(Boolean) as Country[];

  return (
    <div className="min-h-screen px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="eyebrow text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors mb-8"
        >
          ← Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 sm:mb-16"
        >
          <p className="eyebrow mb-4">Saved for later</p>
          <h1 className="font-display text-5xl sm:text-7xl text-[var(--cream)] leading-[0.95] mb-4">
            <em className="italic text-shimmer">Someday</em>.
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl font-light">
            {wishlistCountries.length === 0
              ? 'Tap the star on any country to save it here.'
              : `${wishlistCountries.length} ${wishlistCountries.length === 1 ? 'country' : 'countries'} waiting for you.`}
          </p>
        </motion.div>

        {wishlistCountries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center py-20"
          >
            <span className="text-6xl block mb-6">★</span>
            <p className="font-display text-3xl text-[var(--cream)] italic mb-3">No saves yet.</p>
            <p className="text-[var(--text-muted)] text-sm max-w-sm mx-auto font-light">
              Found a country that caught your eye? Tap the star on its tile to save it for later — no commitment needed.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlistCountries.map((country, i) => (
              <SavedTile
                key={country.id}
                country={country}
                index={i}
                onPlan={() => onPlanTrip(country)}
                onRemove={() => handleRemove(country.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SavedTile({
  country, index, onPlan, onRemove,
}: { country: Country; index: number; onPlan: () => void; onRemove: () => void }) {
  const photo = useWikiImage(country.name, 'country');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05 + index * 0.05, ease: EASE }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors h-72 cursor-pointer"
      style={{
        background: `linear-gradient(145deg, ${country.colour}cc 0%, ${country.colour}55 50%, var(--ink-2) 100%)`,
      }}
      onClick={onPlan}
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
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.15) 0%, rgba(10,8,6,0.55) 50%, rgba(10,8,6,0.95) 100%)' }} />

      {/* Top row: star + remove */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <span className="text-2xl drop-shadow-lg">{country.emoji}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-7 h-7 rounded-full bg-[var(--ink)]/70 backdrop-blur-sm flex items-center justify-center text-[var(--cream)] text-[10px] hover:bg-[var(--terracotta)]/80 border border-[var(--line-strong)] transition-colors"
          aria-label="Remove from wishlist"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
        <p className="eyebrow mb-2 drop-shadow-md" style={{ color: 'var(--gold-soft)' }}>
          ★ Saved
        </p>
        <h3 className="font-display text-2xl sm:text-[26px] text-[var(--cream)] leading-tight mb-2 drop-shadow-md">
          {country.name}
        </h3>
        <p className="text-[12px] text-[var(--cream)]/80 italic font-display-soft line-clamp-2 mb-3">
          {country.tagline}.
        </p>
        <div className="pt-3 border-t border-[var(--cream)]/15 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--gold-soft)]">Plan this trip</span>
          <span className="text-[var(--cream)] text-sm group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </motion.div>
  );
}

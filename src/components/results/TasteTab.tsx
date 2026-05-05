import { motion } from 'framer-motion';
import type { DestinationRestaurants, Restaurant } from '../../types';
import { mapsUrl, directionsUrl } from '../../lib/deepLinks';

interface Props {
  restaurants: DestinationRestaurants[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function TasteTab({ restaurants }: Props) {
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

      <div className="space-y-12">
        {restaurants.map((dest, di) => (
          <motion.section
            key={`${dest.destination}-${di}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: di * 0.08, ease: EASE }}
          >
            <div className="flex items-baseline gap-6 mb-6">
              <span className="eyebrow">Stop {String(di + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-2xl sm:text-3xl text-[var(--cream)]">{dest.destination}</h3>
              <div className="flex-1 h-px bg-[var(--line)]" />
              <span className="eyebrow text-[var(--text-dim)]">
                {dest.restaurants?.length ?? 0} places
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(dest.restaurants ?? []).map((r, ri) => (
                <RestaurantCard key={`${r.name}-${ri}`} restaurant={r} place={`${r.name}, ${dest.destination}`} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

function RestaurantCard({ restaurant: r, place }: { restaurant: Restaurant; place: string }) {
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
        <span
          className="font-display text-base shrink-0 tracking-wider"
          style={{ color: tierColor }}
          title={priceLabel(r.price_tier)}
        >
          {r.price_tier}
        </span>
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
          ◎ Map
        </a>
        <a
          href={directionsUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3 py-1.5 transition-colors"
        >
          ➞ Directions
        </a>
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

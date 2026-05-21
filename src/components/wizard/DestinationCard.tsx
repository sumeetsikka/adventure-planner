import { motion } from 'framer-motion';
import type { Destination } from '../../types';
import { useWikiImage } from '../../lib/useWikiImage';

interface Props {
  destination: Destination;
  selected: boolean;
  onToggle: (id: string) => void;
  onKnowMore: (destination: Destination) => void;
}

export default function DestinationCard({ destination, selected, onToggle, onKnowMore }: Props) {
  const d = destination;
  const daysLabel =
    d.recommendedDays[0] === d.recommendedDays[1]
      ? `${d.recommendedDays[0]} day${d.recommendedDays[0] > 1 ? 's' : ''}`
      : `${d.recommendedDays[0]}–${d.recommendedDays[1]} days`;

  const isMustVisit = !!d.mustVisit;
  const photo = useWikiImage(d.name);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative w-full text-left rounded-2xl overflow-hidden h-[300px] border transition-colors ${
        selected
          ? 'border-[var(--gold)]'
          : isMustVisit
            ? 'border-[var(--gold)]/30 hover:border-[var(--gold)]/60'
            : 'border-[var(--line)] hover:border-[var(--line-strong)]'
      }`}
      style={{
        background: `linear-gradient(145deg, ${d.colour}cc 0%, ${d.colour}55 50%, var(--ink-2) 100%)`,
        boxShadow: selected ? `0 20px 40px -20px ${d.colour}70` : undefined,
      } as React.CSSProperties}
    >
      {/* Photo — instant Loremflickr fallback, upgrades to Wikipedia when ready */}
      {photo && (
        <img
          src={photo}
          alt={d.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-[1.2s] group-hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.dataset.fell) { img.style.display = 'none'; return; }
            img.dataset.fell = 'true';
            img.src = `https://picsum.photos/seed/${encodeURIComponent(d.id)}/800/600`;
          }}
        />
      )}

      {/* Readability overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.15) 0%, rgba(10,8,6,0.55) 50%, rgba(10,8,6,0.95) 100%)' }} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-multiply pointer-events-none"
        style={{ background: d.colour }}
      />

      {/* Tap-to-select layer — covers the card except the action buttons */}
      <button
        type="button"
        onClick={() => onToggle(d.id)}
        aria-label={selected ? `Remove ${d.name} from itinerary` : `Add ${d.name} to itinerary`}
        aria-pressed={selected}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Top row */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-lg">{d.emoji}</span>
          {isMustVisit && (
            <span className="text-[9px] tracking-[0.18em] uppercase font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
              Must visit
            </span>
          )}
        </div>
        {selected ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
            style={{ background: 'var(--terracotta)' }}>✓</div>
        ) : (
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/85 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/20">
            {daysLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end z-20 pointer-events-none">
        <p className="eyebrow mb-2 drop-shadow-md" style={{ color: 'var(--gold-soft)' }}>
          {d.region}
        </p>
        <h3 className="font-display text-[26px] sm:text-[28px] text-white leading-[1.05] mb-2 drop-shadow-md">
          {d.name}
        </h3>
        <p className="text-[12px] text-white/80 leading-snug font-light italic font-display-soft line-clamp-2 mb-3">
          {d.brief}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {d.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full font-light tracking-wide"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions — pointer-events re-enabled so these sit above the select layer */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => onToggle(d.id)}
            className={`flex-1 text-[11px] tracking-wide rounded-full px-3 py-2 transition-colors ${
              selected
                ? 'bg-white/90 text-[var(--cream)] border border-[var(--gold)]/40'
                : 'bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-soft)] font-medium'
            }`}
          >
            {selected ? '✓ Added' : 'Add to trip'}
          </button>
          <button
            type="button"
            onClick={() => onKnowMore(d)}
            className="text-[11px] tracking-wide rounded-full px-3 py-2 border border-white/30 text-white bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            Know more
          </button>
        </div>
      </div>
    </motion.div>
  );
}

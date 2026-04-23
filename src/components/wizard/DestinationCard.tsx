import { motion } from 'framer-motion';
import type { Destination } from '../../types';
import { useWikiImage } from '../../lib/useWikiImage';

interface Props {
  destination: Destination;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function DestinationCard({ destination, selected, onToggle }: Props) {
  const d = destination;
  const daysLabel =
    d.recommendedDays[0] === d.recommendedDays[1]
      ? `${d.recommendedDays[0]} day${d.recommendedDays[0] > 1 ? 's' : ''}`
      : `${d.recommendedDays[0]}–${d.recommendedDays[1]} days`;

  const isMustVisit = !!d.mustVisit;
  const photo = useWikiImage(d.name);

  return (
    <motion.button
      type="button"
      onClick={() => onToggle(d.id)}
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
      {/* Photo */}
      <img
        src={photo}
        alt={d.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-85 transition-all duration-[1.2s] group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Readability overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.15) 0%, rgba(10,8,6,0.55) 50%, rgba(10,8,6,0.95) 100%)' }} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-multiply"
        style={{ background: d.colour }}
      />

      {/* Top row */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--ink)] text-sm font-bold shadow-lg"
            style={{ background: 'var(--cream)' }}>✓</div>
        ) : (
          <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--cream)]/80 bg-[var(--ink)]/50 backdrop-blur-sm rounded-full px-2.5 py-1 border border-[var(--line-strong)]">
            {daysLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
        <p className="eyebrow mb-2 drop-shadow-md" style={{ color: 'var(--gold-soft)' }}>
          {d.region}
        </p>
        <h3 className="font-display text-[26px] sm:text-[28px] text-[var(--cream)] leading-[1.05] mb-2 drop-shadow-md">
          {d.name}
        </h3>
        <p className="text-[12px] text-[var(--cream)]/80 leading-snug font-light italic font-display-soft line-clamp-2 mb-3">
          {d.brief}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {d.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full font-light tracking-wide"
              style={{
                background: 'rgba(245, 237, 224, 0.12)',
                color: 'var(--cream)',
                border: '1px solid rgba(245, 237, 224, 0.18)',
              }}
            >
              {tag}
            </span>
          ))}
          {d.accessNote && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-light tracking-wide text-[var(--gold-soft)]">
              · {d.accessNote}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

import { motion } from 'framer-motion';
import type { Destination } from '../../types';
import { getDestinationPhoto } from '../../lib/imagery';

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
  const photo = getDestinationPhoto(d.name, 800, 900);

  return (
    <motion.button
      type="button"
      onClick={() => onToggle(d.id)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative w-full text-left rounded-2xl overflow-hidden h-[420px] border transition-colors ${
        selected
          ? 'border-[var(--gold)]'
          : 'border-[var(--line)] hover:border-[var(--line-strong)]'
      }`}
      style={{
        boxShadow: selected ? `0 20px 40px -20px ${d.colour}60` : undefined,
      } as React.CSSProperties}
    >
      {/* Photo */}
      <img
        src={photo}
        alt={d.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        onError={(e) => {
          (e.target as HTMLImageElement).style.opacity = '0';
        }}
      />

      {/* Fallback colour layer */}
      <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(160deg, ${d.colour}40, var(--ink-2))` }} />

      {/* Gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.1) 0%, rgba(10,8,6,0.4) 50%, rgba(10,8,6,0.95) 100%)' }} />

      {/* Colour tint on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 mix-blend-multiply"
        style={{ background: d.colour }}
      />

      {/* Must Visit badge */}
      {isMustVisit && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-semibold tracking-[0.2em] uppercase z-10"
          style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
          <span>★</span>
          <span>Editor's Pick</span>
        </div>
      )}

      {/* Selected check */}
      {selected && (
        <div
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-[var(--ink)] text-sm font-bold shadow-lg z-10"
          style={{ background: 'var(--cream)' }}
        >
          ✓
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
        <p className="eyebrow mb-3 opacity-80" style={{ color: 'var(--gold-soft)' }}>
          {d.region}
        </p>
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl leading-none">{d.emoji}</span>
          <h3 className="font-display text-3xl text-[var(--cream)] leading-tight">{d.name}</h3>
        </div>

        <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3 font-light">{d.brief}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {d.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2.5 py-0.5 rounded-full font-light tracking-wide"
              style={{
                background: 'rgba(245, 237, 224, 0.1)',
                color: 'var(--cream)',
                border: '1px solid rgba(245, 237, 224, 0.15)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]">
          <p className="text-[11px] text-[var(--text-dim)] font-light">
            {daysLabel}
            {d.accessNote && ` · ${d.accessNote}`}
          </p>
          {!selected && (
            <span className="text-[10px] text-[var(--text-dim)] group-hover:text-[var(--gold)] transition-colors tracking-widest uppercase">
              Add →
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

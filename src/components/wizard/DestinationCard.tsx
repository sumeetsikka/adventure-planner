import type { Destination } from '../../types';

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
      : `${d.recommendedDays[0]}-${d.recommendedDays[1]} days`;

  const isMustVisit = !!d.mustVisit;

  return (
    <button
      type="button"
      onClick={() => onToggle(d.id)}
      className={`
        group relative w-full text-left rounded-2xl p-4 sm:p-5 transition-all duration-500 cursor-pointer overflow-hidden
        ${selected ? 'scale-[1.02] ring-2 shadow-xl' : 'hover:-translate-y-1.5 hover:shadow-2xl'}
        ${isMustVisit && !selected ? 'must-visit-glow border border-[#E6A817]/20' : ''}
      `}
      style={{
        background: selected
          ? `linear-gradient(160deg, ${d.colour}18 0%, rgba(11,17,32,0.95) 100%)`
          : isMustVisit
            ? 'linear-gradient(160deg, rgba(230,168,23,0.04) 0%, rgba(255,255,255,0.03) 100%)'
            : '#131B2E',
        boxShadow: selected ? `0 8px 32px ${d.colour}25, 0 0 0 2px ${d.colour}` : undefined,
      } as React.CSSProperties}
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(160deg, ${d.colour}0A 0%, transparent 60%)` }}
      />

      {/* Must Visit badge */}
      {isMustVisit && (
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase z-10 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #E6A817, #D4960F)', color: '#0B1120' }}>
          <span>★</span>
          <span>Must Visit</span>
        </div>
      )}

      {/* Selected check */}
      {selected && (
        <div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg z-10"
          style={{ background: d.colour }}
        >
          ✓
        </div>
      )}

      {/* Emoji */}
      <div className={`text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 ${isMustVisit ? 'mt-4' : ''}`}>{d.emoji}</div>

      {/* Name */}
      <h3 className="text-[15px] font-bold text-white mb-1 leading-tight">{d.name}</h3>

      {/* Region */}
      <p className="text-[9px] font-bold tracking-[2.5px] uppercase mb-3 opacity-70" style={{ color: d.colour }}>
        {d.region}
      </p>

      {/* Brief */}
      <p className="text-[13px] text-gray-400 leading-relaxed mb-4 line-clamp-4">{d.brief}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {d.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
            style={{
              background: `${d.colour}0A`,
              color: d.colour,
              borderColor: `${d.colour}20`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-500">
          {daysLabel}
          {d.accessNote && ` · ${d.accessNote}`}
        </p>
        {!selected && (
          <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">
            Tap to add
          </span>
        )}
      </div>

      {/* Bottom border accent */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
        style={{ background: `linear-gradient(90deg, transparent, ${isMustVisit ? '#E6A817' : d.colour}, transparent)` }}
      />
    </button>
  );
}

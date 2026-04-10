import { VIBE_COLOURS, VIBE_LABELS } from '../../lib/constants';

interface Props {
  vibe: string;
  className?: string;
}

export default function VibePill({ vibe, className = '' }: Props) {
  const colour = VIBE_COLOURS[vibe] || '#888';
  const label = VIBE_LABELS[vibe] || vibe;

  return (
    <span
      className={`text-[11px] font-semibold px-3 py-1 rounded-full ${className}`}
      style={{ background: `${colour}20`, color: colour }}
    >
      {label}
    </span>
  );
}

import { useState } from 'react';

/**
 * "＋ Plan" → pick a day → done. The pool→plan control that turns the Taste /
 * Do suggestion lists into an itinerary builder (the Wanderlog loop).
 *
 * Days the traveller is actually IN that destination (per the stitched plan)
 * are highlighted coral; other days stay neutral but remain selectable —
 * people do day-trip across bases.
 */

export interface DayOption {
  day: number;
  /** e.g. "Wed 1 Jul" */
  label: string;
  /** True when the stitched plan has the traveller in this card's destination that day. */
  inDest: boolean;
}

export default function AddToDay({
  days, onAdd,
}: {
  days: DayOption[];
  onAdd: (day: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [addedDay, setAddedDay] = useState<number | null>(null);

  if (days.length === 0) return null;

  if (addedDay !== null) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-[var(--sage)] border border-[var(--sage)]/40 bg-[var(--sage)]/8 rounded-full px-3 py-1.5">
        ✓ Added to Day {addedDay}
      </span>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Add this to a day in your itinerary"
        className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[var(--terracotta)] border border-[var(--terracotta)]/40 hover:bg-[var(--terracotta)]/10 rounded-full px-3 py-1.5 transition-colors"
      >
        ＋ Plan
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      <span className="text-[9px] tracking-wider uppercase text-[var(--text-dim)] mr-0.5">Which day?</span>
      {days.map((d) => (
        <button
          key={d.day}
          type="button"
          onClick={() => { onAdd(d.day); setAddedDay(d.day); setOpen(false); }}
          title={d.label + (d.inDest ? ' — you\'re here this day' : '')}
          className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
            d.inDest
              ? 'border-[var(--terracotta)]/50 bg-[var(--terracotta)]/8 text-[var(--cream)] font-medium'
              : 'border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)]'
          }`}
        >
          D{d.day}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Cancel"
        className="text-[10px] px-1.5 py-1 text-[var(--text-dim)] hover:text-[var(--cream)]"
      >
        ✕
      </button>
    </span>
  );
}

import type { DestinationDays } from '../../lib/planStitch';

/**
 * Small "Days 1–4" chip that anchors a destination's suggestions to when the
 * traveller is actually there, per the stitched plan. Renders nothing when the
 * destination isn't part of the itinerary (e.g. a generic "Nearby" bucket).
 */
export default function DayRangeChip({ range }: { range: DestinationDays | null }) {
  if (!range) return null;
  const label = range.firstDay === range.lastDay
    ? `Day ${range.firstDay}`
    : `Days ${range.firstDay}–${range.lastDay}`;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-[var(--terracotta)] bg-[var(--terracotta)]/10 rounded-full px-2.5 py-1 align-middle">
      🗓️ {label}
    </span>
  );
}

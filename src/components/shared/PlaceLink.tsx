import { mapsUrl, directionsUrl, rideUrl } from '../../lib/deepLinks';

/**
 * Inline action menu for a place: Maps · Directions · Ride.
 * Renders as a small row of pill links — fits inside any card.
 *
 * Use `<PlaceActions place={...} />` next to a heading or below a location title.
 */
export function PlaceActions({ place, compact = false }: { place: string; compact?: boolean }) {
  const cls = compact
    ? 'text-[10px] tracking-[0.18em] uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-2.5 py-1 transition-colors'
    : 'text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3 py-1.5 transition-colors';

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <a
        href={mapsUrl(place)}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        title={`Open ${place} in Maps`}
      >
        📍 Map
      </a>
      <a
        href={directionsUrl(place)}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        title={`Directions to ${place}`}
      >
        🧭 Directions
      </a>
      <a
        href={rideUrl(place)}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        title={`Get a ride to ${place}`}
      >
        🚕 Ride
      </a>
    </div>
  );
}

/**
 * Single Maps link rendered inline — minimal footprint.
 */
export function MapsLink({ place, label, className }: { place: string; label?: string; className?: string }) {
  return (
    <a
      href={mapsUrl(place)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors'}
      title={`Open ${place} in Maps`}
    >
      {label ?? '📍 Open in Maps'}
    </a>
  );
}

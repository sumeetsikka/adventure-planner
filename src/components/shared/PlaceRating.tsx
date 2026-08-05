import { useEffect, useState } from 'react';
import { getPlaceDetails, peekPlace } from '../../lib/placeCache';
import type { PlaceDetails } from '../../lib/api';

/**
 * Live place facts from Google Places, rendered inline on a card:
 *   ★ 4.6 (1,240) · $$ · Open now · ♿
 *
 * Self-contained — it fetches its own data (cached + deduped). When the API
 * key isn't configured or the place can't be matched it renders NOTHING, so
 * cards keep their existing "Reviews ↗" link fallback and the layout is
 * unchanged. Verified data is marked with a "Live" dot so users can tell it
 * apart from the AI estimates everywhere else.
 */

export default function PlaceRating({ query }: { query: string }) {
  // Start from any warm cache so a tab revisit paints instantly.
  const [data, setData] = useState<PlaceDetails | undefined>(() => peekPlace(query));

  useEffect(() => {
    let cancelled = false;
    if (data) return; // already have it (warm cache)
    getPlaceDetails(query).then((res) => {
      if (!cancelled) setData(res);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const shutDown = data?.businessStatus === 'CLOSED_PERMANENTLY' || data?.businessStatus === 'CLOSED_TEMPORARILY';

  // A shut-down venue must surface even when Google returns nothing else about
  // it — that warning is the single most valuable thing this component can say,
  // so it deliberately bypasses the "no facts worth showing" guard below.
  if (!data || !data.available || (!shutDown && data.rating == null && data.openNow == null && data.wheelchair == null)) {
    return null;
  }

  if (shutDown) {
    const permanent = data.businessStatus === 'CLOSED_PERMANENTLY';
    return (
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2 mb-1">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full"
          style={{ background: 'color-mix(in srgb, var(--terracotta) 16%, transparent)', color: 'var(--terracotta)' }}
          title="Verified against Google Places"
        >
          <span aria-hidden>⚠</span>
          {permanent ? 'Permanently closed' : 'Temporarily closed'}
        </span>
        <span className="text-[11px] text-[var(--text-muted)]">
          {permanent ? 'Google says this has shut down — pick something else.' : 'Google says this is shut right now — check before you go.'}
        </span>
        {data.mapsUri && (
          <a
            href={data.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] tracking-wide uppercase text-[var(--text-muted)] hover:text-[var(--cream)] underline-offset-2 hover:underline"
          >
            Maps ↗
          </a>
        )}
      </div>
    );
  }

  const priceStr = data.priceLevel ? '$'.repeat(Math.min(4, Math.max(1, data.priceLevel))) : null;

  // Google returns hours as ["Monday: 9:00 AM – 5:00 PM", …] starting Monday;
  // getDay() is Sunday-based, so remap. Showing TODAY's hours is the useful slice —
  // "Open now" answers this second, this answers "will it still be open when I get there".
  const todayHours = (() => {
    if (!Array.isArray(data.hours) || data.hours.length < 7) return null;
    const idx = (new Date().getDay() + 6) % 7;
    const line = data.hours[idx];
    if (typeof line !== 'string') return null;
    const parts = line.split(': ');
    return parts.length > 1 ? parts.slice(1).join(': ') : line;
  })();

  return (
    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2 mb-1">
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full"
        style={{ background: 'color-mix(in srgb, var(--sage) 14%, transparent)', color: 'var(--sage)' }}
        title="Live data from Google"
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--sage)' }} aria-hidden />
        Live
      </span>
      {data.rating != null && (
        <span className="text-[12px] text-[var(--cream)] font-medium">
          ★ {data.rating.toFixed(1)}
          {data.reviews != null && (
            <span className="text-[var(--text-dim)] font-normal"> ({data.reviews.toLocaleString()})</span>
          )}
        </span>
      )}
      {priceStr && <span className="text-[12px] text-[var(--gold)]">{priceStr}</span>}
      {data.openNow != null && (
        <span className={`text-[11px] font-medium ${data.openNow ? 'text-[var(--sage)]' : 'text-[var(--terracotta)]'}`}>
          {data.openNow ? 'Open now' : 'Closed now'}
        </span>
      )}
      {todayHours && (
        <span
          className="text-[11px] text-[var(--text-muted)]"
          title={Array.isArray(data.hours) ? data.hours.join('\n') : undefined}
        >
          Today {todayHours}
        </span>
      )}
      {data.wheelchair && (
        <span className="text-[12px]" title="Wheelchair-accessible entrance" aria-label="Wheelchair accessible">♿</span>
      )}
      {data.mapsUri && (
        <a
          href={data.mapsUri}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] tracking-wide uppercase text-[var(--text-muted)] hover:text-[var(--cream)] underline-offset-2 hover:underline"
        >
          Maps ↗
        </a>
      )}
    </div>
  );
}

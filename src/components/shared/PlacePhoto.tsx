import { useEffect, useState } from 'react';
import { getPlaceDetails, peekPlace } from '../../lib/placeCache';

/**
 * An <img> that prefers a REAL photo of the place.
 *
 * Everywhere else the app illustrates places with loremflickr/picsum — stock
 * images merely tagged with the destination name, not photographs of the thing
 * being described. When Google Places can match the venue it returns an actual
 * photo of it, so use that and keep the stock image purely as the fallback.
 *
 * Degrades exactly like PlaceRating: no API key, no match, or a failed load all
 * fall back to `fallbackSrc`, so layout is unchanged and the key stays optional.
 */
export default function PlacePhoto({
  query,
  fallbackSrc,
  alt,
  className,
  loading = 'lazy',
}: {
  query: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}) {
  const [src, setSrc] = useState<string>(() => peekPlace(query)?.photoUrl || fallbackSrc);

  useEffect(() => {
    let cancelled = false;
    // No synchronous branch for the warm-cache case: useState already seeded from
    // peekPlace for instant first paint, and getPlaceDetails resolves straight from
    // its own cache anyway — so setting state here too would just cascade a render.
    getPlaceDetails(query).then((res) => {
      if (!cancelled) setSrc(res?.photoUrl || fallbackSrc);
    });
    return () => { cancelled = true; };
  }, [query, fallbackSrc]);

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={(e) => {
        // One retry only — a broken Places photo drops to stock, a broken stock
        // image is left alone rather than looping.
        const img = e.currentTarget;
        if (img.dataset.fell) return;
        img.dataset.fell = '1';
        img.src = fallbackSrc;
      }}
    />
  );
}

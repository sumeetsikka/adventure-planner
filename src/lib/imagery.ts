/**
 * Reliable multi-source imagery.
 *
 * We chain three providers so cards never go empty:
 *   1. Loremflickr — themed Flickr photos, always returns a result
 *   2. Picsum (seeded) — guaranteed real photograph if Flickr fails
 *   3. Wikipedia (via `useWikiImage` hook in src/lib/useWikiImage.ts)
 *      runs in parallel and upgrades to a topical article photo when found
 */

function cleanQuery(name: string): string {
  return name
    .split('(')[0]
    .split('/')[0]
    .split('·')[0]
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '');
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Loremflickr themed photo: `{w}/{h}/{tag},{tag2}`
 * The `lock` param ensures the same seed → same photo every render.
 */
function loremflickr(query: string, width: number, height: number, extraTag = 'travel'): string {
  const clean = cleanQuery(query).toLowerCase().replace(/\s+/g, ',');
  if (!clean) return `https://picsum.photos/seed/${hashSeed(query)}/${width}/${height}`;
  const seed = hashSeed(query);
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(clean)},${extraTag}?lock=${seed}`;
}

/**
 * Picsum with a consistent seed. Always returns a real photograph.
 * Used as secondary fallback and for hotel rooms where we don't need topical.
 */
export function picsum(query: string, width: number, height: number): string {
  const seed = hashSeed(query);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export function getCountryHero(countryNameOrId: string, width = 1600, height = 900): string {
  return loremflickr(countryNameOrId, width, height, 'landscape');
}

export function getDestinationPhoto(destinationName: string, width = 800, height = 600): string {
  return loremflickr(destinationName, width, height, 'travel');
}

export function getDestinationThumbnail(destinationName: string): string {
  return getDestinationPhoto(destinationName, 600, 400);
}

export function getHotelPhoto(hotelName: string, destination: string, width = 800, height = 600): string {
  // Combine hotel + destination so photos look location-relevant
  const query = `${cleanQuery(destination)} hotel`;
  return loremflickr(query, width, height, 'hotel');
}

export function getCountryPhotoStrip(countryName: string): string[] {
  return [
    loremflickr(countryName + ' 1', 1200, 800, 'travel'),
    loremflickr(countryName + ' 2', 1200, 800, 'landscape'),
    loremflickr(countryName + ' 3', 1200, 800, 'culture'),
  ];
}

/** On <img onError>, swap to picsum so the card never ends up blank. */
export function fallbackToPicsum(query: string, width: number, height: number) {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fell) return; // prevent loop
    img.dataset.fell = 'true';
    img.src = picsum(query, width, height);
  };
}

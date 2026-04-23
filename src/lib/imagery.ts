/**
 * Unsplash hero imagery helpers.
 * Uses Unsplash source URLs (no API key). High quality travel photography.
 */

export function getCountryHero(countryName: string, width = 1600, height = 900): string {
  const q = encodeURIComponent(`${countryName} landscape travel cinematic`);
  return `https://source.unsplash.com/${width}x${height}/?${q}`;
}

export function getDestinationPhoto(destinationName: string, width = 800, height = 600): string {
  const clean = destinationName.split('(')[0].split('/')[0].trim();
  const q = encodeURIComponent(`${clean} travel`);
  return `https://source.unsplash.com/${width}x${height}/?${q}`;
}

export function getDestinationThumbnail(destinationName: string): string {
  return getDestinationPhoto(destinationName, 600, 400);
}

export function getCountryPhotoStrip(countryName: string): string[] {
  const q = encodeURIComponent(`${countryName} travel`);
  return [
    `https://source.unsplash.com/1200x800/?${q}&sig=1`,
    `https://source.unsplash.com/1200x800/?${q}&sig=2`,
    `https://source.unsplash.com/1200x800/?${q}&sig=3`,
  ];
}

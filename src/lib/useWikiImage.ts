import { useEffect, useState } from 'react';
import { getCountryHero, getDestinationPhoto, picsum } from './imagery';

// Cache Wikipedia lookups so each name only fires once per session.
const wikiCache = new Map<string, string | null>();
const wikiInflight = new Map<string, Promise<string | null>>();

/**
 * For country-level lookups, Wikipedia's summary endpoint returns the
 * country's FLAG as the article image. Redirect those queries to an
 * iconic landmark page instead so we get real photography.
 */
const COUNTRY_LANDMARK_QUERY: Record<string, string> = {
  vietnam: 'Hạ Long Bay',
  thailand: 'Grand Palace, Bangkok',
  japan: 'Mount Fuji',
  indonesia: 'Borobudur',
  philippines: 'El Nido, Palawan',
  cambodia: 'Angkor Wat',
  italy: 'Colosseum',
  france: 'Eiffel Tower',
  spain: 'Sagrada Família',
  portugal: 'Belém Tower',
  greece: 'Santorini',
  switzerland: 'Matterhorn',
  germany: 'Neuschwanstein Castle',
  netherlands: 'Amsterdam',
  belgium: 'Grand-Place',
  austria: 'Hallstatt',
  norway: 'Geirangerfjord',
  sweden: 'Gamla stan',
  croatia: 'Dubrovnik',
  iceland: 'Skógafoss',
  morocco: 'Jemaa el-Fnaa',
  egypt: 'Great Pyramid of Giza',
  turkey: 'Cappadocia',
  mauritius: 'Le Morne Brabant',
  peru: 'Machu Picchu',
  mexico: 'Chichen Itza',
  'new zealand': 'Milford Sound',
  newzealand: 'Milford Sound',
  maldives: 'Malé',
  fiji: 'Yasawa Islands',
};

function cleanName(name: string): string {
  return name.split('(')[0].split('/')[0].split('·')[0].trim();
}

function landmarkForCountry(name: string): string {
  const key = cleanName(name).toLowerCase();
  return COUNTRY_LANDMARK_QUERY[key] || COUNTRY_LANDMARK_QUERY[key.replace(/\s+/g, '')] || name;
}

async function lookupWiki(query: string): Promise<string | null> {
  if (wikiCache.has(query)) return wikiCache.get(query)!;
  if (wikiInflight.has(query)) return wikiInflight.get(query)!;

  const p = (async () => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      if (!res.ok) {
        wikiCache.set(query, null);
        return null;
      }
      const data = await res.json();
      // Skip SVG thumbnails — those are flags/icons, not photos.
      const src: string | undefined = data?.originalimage?.source || data?.thumbnail?.source;
      if (src && !/\.svg(\.|$)/i.test(src) && !/Flag_of_/i.test(src)) {
        wikiCache.set(query, src);
        return src;
      }
      wikiCache.set(query, null);
      return null;
    } catch {
      wikiCache.set(query, null);
      return null;
    }
  })();

  wikiInflight.set(query, p);
  try {
    return await p;
  } finally {
    wikiInflight.delete(query);
  }
}

/**
 * Multi-source image hook.
 *
 * Returns a URL immediately (Loremflickr-themed fallback so cards never empty),
 * then upgrades to a higher-quality Wikipedia article image in the background
 * if one is available. For `type: 'country'`, reroutes to a landmark query
 * so we get photography rather than a flag.
 */
export function useWikiImage(
  name: string | null | undefined,
  type: 'country' | 'destination' = 'destination'
): string | null {
  const instant = name
    ? (type === 'country' ? getCountryHero(name, 1200, 800) : getDestinationPhoto(name, 1200, 800))
    : null;

  // For countries, query Wikipedia for the country's iconic landmark
  // instead of the country itself (country pages return flags).
  const wikiQuery = name ? (type === 'country' ? landmarkForCountry(name) : cleanName(name)) : null;

  const [url, setUrl] = useState<string | null>(() => {
    if (!wikiQuery) return null;
    const cached = wikiCache.get(wikiQuery);
    return cached ?? instant;
  });

  useEffect(() => {
    if (!wikiQuery) { setUrl(null); return; }
    let cancelled = false;
    lookupWiki(wikiQuery).then((result) => {
      if (cancelled) return;
      if (result) setUrl(result);
    });
    return () => { cancelled = true; };
  }, [wikiQuery]);

  return url;
}

/** Hook variant for any image — same API with explicit Picsum ultimate fallback. */
export function useReliableImage(name: string | null | undefined, type: 'country' | 'destination' = 'destination'): string {
  const u = useWikiImage(name, type);
  if (u) return u;
  return name ? picsum(name, 1200, 800) : '';
}

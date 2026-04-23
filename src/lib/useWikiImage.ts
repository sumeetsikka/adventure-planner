import { useEffect, useState } from 'react';
import { getCountryHero, getDestinationPhoto, picsum } from './imagery';

// Cache Wikipedia lookups so each name only fires once per session.
const wikiCache = new Map<string, string | null>();
const wikiInflight = new Map<string, Promise<string | null>>();

function cleanName(name: string): string {
  return name.split('(')[0].split('/')[0].split('·')[0].trim();
}

async function lookupWiki(query: string): Promise<string | null> {
  if (wikiCache.has(query)) return wikiCache.get(query)!;
  if (wikiInflight.has(query)) return wikiInflight.get(query)!;

  const p = (async () => {
    const candidates = [query, `${query} (country)`, `${query} (city)`];
    for (const candidate of candidates) {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate)}`
        );
        if (!res.ok) continue;
        const data = await res.json();
        const src: string | undefined = data?.originalimage?.source || data?.thumbnail?.source;
        if (src) {
          wikiCache.set(query, src);
          return src;
        }
      } catch {
        /* try next */
      }
    }
    wikiCache.set(query, null);
    return null;
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
 * if one is available for `name`.
 *
 * Pass `type: 'country' | 'destination'` to tune the fallback quality/tags.
 */
export function useWikiImage(
  name: string | null | undefined,
  type: 'country' | 'destination' = 'destination'
): string | null {
  const instant = name
    ? (type === 'country' ? getCountryHero(name, 1200, 800) : getDestinationPhoto(name, 1200, 800))
    : null;

  const [url, setUrl] = useState<string | null>(() => {
    if (!name) return null;
    const cached = wikiCache.get(cleanName(name));
    return cached ?? instant;
  });

  useEffect(() => {
    if (!name) { setUrl(null); return; }
    const query = cleanName(name);
    let cancelled = false;
    lookupWiki(query).then((result) => {
      if (cancelled) return;
      if (result) setUrl(result);
    });
    return () => { cancelled = true; };
  }, [name]);

  return url;
}

/** Hook variant for any image — same API with explicit Picsum ultimate fallback. */
export function useReliableImage(name: string | null | undefined, type: 'country' | 'destination' = 'destination'): string {
  const u = useWikiImage(name, type);
  if (u) return u;
  return name ? picsum(name, 1200, 800) : '';
}

import { useEffect, useState } from 'react';

// Cache Wikipedia lookups so each name only fires once per session.
const cache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

function cleanName(name: string): string {
  return name.split('(')[0].split('/')[0].split('·')[0].trim();
}

/**
 * Try Wikipedia REST summary for the query; if no thumbnail, try a
 * variant with "travel" stripped and a few common suffixes.
 */
async function lookupWiki(query: string): Promise<string | null> {
  if (cache.has(query)) return cache.get(query)!;
  if (inflight.has(query)) return inflight.get(query)!;

  const p = (async () => {
    const candidates = [
      query,
      `${query} (country)`,
      `${query} (city)`,
    ];
    for (const candidate of candidates) {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate)}`
        );
        if (!res.ok) continue;
        const data = await res.json();
        // Prefer the full-resolution original image if available
        const src: string | undefined = data?.originalimage?.source || data?.thumbnail?.source;
        if (src) {
          // Upscale any thumbnail-sized Wikipedia URL to ~1200 px wide.
          const upscaled = src.replace(/\/\d+px-/, '/1200px-');
          cache.set(query, upscaled);
          return upscaled;
        }
      } catch {
        /* try next */
      }
    }
    cache.set(query, null);
    return null;
  })();

  inflight.set(query, p);
  try {
    return await p;
  } finally {
    inflight.delete(query);
  }
}

export function useWikiImage(name: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(() => (name ? cache.get(cleanName(name)) ?? null : null));

  useEffect(() => {
    if (!name) { setUrl(null); return; }
    const query = cleanName(name);
    let cancelled = false;
    lookupWiki(query).then((result) => {
      if (!cancelled) setUrl(result);
    });
    return () => { cancelled = true; };
  }, [name]);

  return url;
}

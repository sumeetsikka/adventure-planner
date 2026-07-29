import type { Destination } from '../types';
import { destinationCounts } from './destinationCounts';

/**
 * Destination data — lazily loaded, one country per chunk.
 *
 * The 29 country files carry ~6,000 lines of destination prose between them.
 * Importing them statically here put every one of them in the first-paint
 * bundle, for a user who then picks exactly one country. They're now behind
 * per-country dynamic imports (Vite splits each into its own chunk), so only
 * the country a user actually opens is fetched.
 *
 * The lightweight per-country COUNT stays eager (`destinationCounts`) so the
 * picker can render "17 stops" on every tile without pulling any prose.
 */

// Vite turns this into a map of `'./countries/japan.ts' -> () => import(...)`.
// Each entry is a separate chunk; calling the loader fetches just that one.
const loaders = import.meta.glob<{ destinations: Destination[] }>('./countries/*.ts');

// Modules are cached by the browser, but memoising the resolved arrays avoids
// re-awaiting a dynamic import on every picker re-render.
const cache = new Map<string, Destination[]>();

/** Number of prebuilt destinations for a country (sync, cheap — for the picker badge). */
export function getDestinationCount(countryId: string): number {
  return destinationCounts[countryId] ?? 0;
}

/** True if we ship a curated destination list for this country (sync). */
export function hasPrebuiltDestinations(countryId: string): boolean {
  return countryId in destinationCounts;
}

/** Load a country's curated destinations on demand. Returns null for countries
 *  we don't ship (custom/AI-generated ones), matching the old sync contract. */
export async function loadDestinationsForCountry(countryId: string): Promise<Destination[] | null> {
  const cached = cache.get(countryId);
  if (cached) return cached;
  const loader = loaders[`./countries/${countryId}.ts`];
  if (!loader) return null;
  try {
    const mod = await loader();
    cache.set(countryId, mod.destinations);
    return mod.destinations;
  } catch (err) {
    console.error(`Failed to load destinations for ${countryId}:`, err);
    return null;
  }
}

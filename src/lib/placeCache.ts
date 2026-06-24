/**
 * Client cache for live place details.
 *
 * Many cards mount at once and several may query the same place across tabs, so
 * we cache by query string and dedupe in-flight requests — a given place is
 * fetched at most once per session. Results also persist to sessionStorage so
 * switching tabs (which unmounts/remounts cards) doesn't re-hit the API.
 *
 * `{available:false}` results are cached too: when there's no API key we want
 * exactly ONE request that comes back unavailable, then silence — not one
 * failed request per card forever.
 */

import { fetchPlaceDetails, type PlaceDetails } from './api';

const SS_KEY = 'adventure-planner:place-cache';
const mem = new Map<string, PlaceDetails>();
const inflight = new Map<string, Promise<PlaceDetails>>();

// Once the API reports no key (or the network is down), stop trying for the
// rest of the session — every query would return the same unavailable result.
let globallyUnavailable = false;

function loadSession(): void {
  if (mem.size > 0) return;
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw) as Record<string, PlaceDetails>;
    for (const [k, v] of Object.entries(obj)) mem.set(k, v);
  } catch { /* ignore */ }
}

function persistSession(): void {
  try {
    sessionStorage.setItem(SS_KEY, JSON.stringify(Object.fromEntries(mem)));
  } catch { /* quota — fine, mem cache still works */ }
}

const norm = (q: string) => q.trim().toLowerCase();

/** Synchronous cache peek — lets components render instantly when warm. */
export function peekPlace(query: string): PlaceDetails | undefined {
  loadSession();
  return mem.get(norm(query));
}

/** Fetch (or return cached) live details. Always resolves — never throws. */
export async function getPlaceDetails(query: string): Promise<PlaceDetails> {
  loadSession();
  const key = norm(query);
  if (!query.trim()) return { available: false };
  if (globallyUnavailable) return { available: false };
  const cached = mem.get(key);
  if (cached) return cached;
  const pending = inflight.get(key);
  if (pending) return pending;

  const p = fetchPlaceDetails(query)
    .then((res) => {
      const safe = res || { available: false };
      mem.set(key, safe);
      persistSession();
      // No key → don't keep asking for the rest of the session.
      if (!safe.available && safe.reason === 'no-key') globallyUnavailable = true;
      return safe;
    })
    .catch(() => {
      const fallback: PlaceDetails = { available: false };
      mem.set(key, fallback);
      return fallback;
    })
    .finally(() => { inflight.delete(key); });

  inflight.set(key, p);
  return p;
}

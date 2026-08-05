/**
 * Local-first trip persistence.
 *
 * Stores trips in localStorage keyed by a UUID. Automatically saves on every
 * change. Survives tab close, browser restart, and (because of the PWA service
 * worker) offline use of the most recent trip.
 *
 * When we add cloud sync (Sprint 3), this same shape will mirror to the API.
 */
import type { TravelConfig, GenerationResults } from '../types';

const STORAGE_KEY = 'adventure-planner:trips';
const ACTIVE_KEY = 'adventure-planner:active-trip';

export interface SavedTrip {
  id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  config: TravelConfig;
  results: GenerationResults;
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Fired when a write is rejected for lack of space. `App` listens and warns —
 *  silently swallowing this meant users lost saved trips with no signal at all. */
export const STORAGE_FULL_EVENT = 'adventure-planner:storage-full';

function isQuotaError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    // 22 is the legacy code; Firefox reports NS_ERROR_DOM_QUOTA_REACHED (1014).
    (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED' || err.code === 22)
  );
}

function safeWrite(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // Privacy mode also throws here; only surface the case the user can act on.
    if (isQuotaError(err)) {
      try { window.dispatchEvent(new CustomEvent(STORAGE_FULL_EVENT)); } catch { /* non-browser */ }
    }
    return false;
  }
}

export function listTrips(): SavedTrip[] {
  const trips = safeRead<SavedTrip[]>(STORAGE_KEY, []);
  return trips.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getTrip(id: string): SavedTrip | null {
  const trips = listTrips();
  return trips.find((t) => t.id === id) ?? null;
}

export function getActiveTripId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function setActiveTripId(id: string | null): void {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
}

export function saveTrip(trip: Partial<SavedTrip> & { config: TravelConfig; results: GenerationResults }): SavedTrip {
  const trips = listTrips();
  const now = Date.now();
  const id = trip.id ?? getActiveTripId() ?? uid();
  const existing = trips.find((t) => t.id === id);

  const name = trip.name ?? existing?.name ?? defaultTripName(trip.config);

  // Only bump updatedAt when something actually changed. The app rehydrates the
  // last trip on boot, which fires the autosave effect — stamping unconditionally
  // meant merely OPENING the app re-sorted My Trips (it orders by updatedAt) and
  // relabelled every trip "Updated just now", destroying the only recency signal.
  const unchanged =
    !!existing &&
    existing.name === name &&
    JSON.stringify(existing.config) === JSON.stringify(trip.config) &&
    JSON.stringify(existing.results) === JSON.stringify(trip.results);

  const merged: SavedTrip = {
    id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: unchanged ? existing.updatedAt : now,
    name,
    config: trip.config,
    results: trip.results,
  };

  // Nothing changed — skip the write entirely rather than re-serialising the
  // whole 30-trip array on every hydration.
  if (unchanged) {
    setActiveTripId(id);
    return merged;
  }

  const next = [merged, ...trips.filter((t) => t.id !== id)];
  // Cap at 30 trips to avoid unbounded growth
  const capped = next.slice(0, 30);
  safeWrite(STORAGE_KEY, capped);
  setActiveTripId(id);
  return merged;
}

export function renameTrip(id: string, name: string): void {
  const trips = listTrips();
  const next = trips.map((t) => (t.id === id ? { ...t, name, updatedAt: Date.now() } : t));
  safeWrite(STORAGE_KEY, next);
}

/**
 * Every localStorage key that belongs to a single trip. Kept here so deleting a
 * trip can purge all of it — previously only the trip record was removed, which
 * left the travel wallet (passport and insurance numbers) on the device
 * indefinitely, invisible to a user who reasonably believed it was gone.
 *
 * Journal is the odd one out: it predates the trip-id scheme and keys off
 * `<countryId>-<departureDate>` with no `adventure-planner:` namespace, so it
 * needs the trip's config to derive.
 */
function perTripKeys(trip: SavedTrip | null, id: string): string[] {
  const keys = [
    `adventure-planner:wallet:${id}`,
    `adventure-planner:expenses:${id}`,
    `adventure-planner:readiness:${id}`,
    `adventure-planner:packing:${id}`,
    `adventure-planner:booked:${id}`,
    `adventure-planner:booking-notes:${id}`,
    `adventure-planner:chat:${id}`,
  ];
  if (trip) {
    const journalId = `${trip.config.country?.id ?? 'trip'}-${trip.config.departureDate}`;
    const prefix = `journal:${journalId}:day`;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
    } catch { /* privacy mode — nothing to purge */ }
  }
  return keys;
}

export function deleteTrip(id: string): void {
  // Resolve before removing the record — the journal key derives from its config.
  const trip = getTrip(id);
  const trips = listTrips().filter((t) => t.id !== id);
  safeWrite(STORAGE_KEY, trips);
  for (const key of perTripKeys(trip, id)) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
  if (getActiveTripId() === id) setActiveTripId(null);
}

export function defaultTripName(config: TravelConfig): string {
  const country = config.country?.name ?? 'Trip';
  if (!config.departureDate) return country;
  const d = new Date(config.departureDate);
  if (isNaN(d.getTime())) return country;
  const month = d.toLocaleString('en-AU', { month: 'short' });
  return `${country} · ${month} ${d.getFullYear()}`;
}

export function newTripId(): string {
  const id = uid();
  setActiveTripId(id);
  return id;
}

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

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / privacy mode — ignore */
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

  const merged: SavedTrip = {
    id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    name: trip.name ?? existing?.name ?? defaultTripName(trip.config),
    config: trip.config,
    results: trip.results,
  };

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

export function deleteTrip(id: string): void {
  const trips = listTrips().filter((t) => t.id !== id);
  safeWrite(STORAGE_KEY, trips);
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

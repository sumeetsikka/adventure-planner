/**
 * Shortlist — local-only "this is the one I'm leaning towards" marker for
 * flights and hotels.
 *
 * HISTORY / NAMING: this shipped as "🔔 Track price" with a bell icon, and the
 * doc here claimed the list "surfaces in the Dashboard watching section". Neither
 * was true — no Dashboard section existed, `listWatched` was never called by
 * anything, and there is no polling layer, so the bell promised alerts that could
 * never fire. The storage and the captured intent are genuinely useful, so rather
 * than delete it the FEATURE was scoped down to what actually works today: a
 * shortlist you can see on the card.
 *
 * Real price monitoring needs a backend cron plus provider price feeds. If that
 * ever lands, `basePrice` (the estimate at time of shortlisting) is already
 * recorded, so alerts can be layered on without changing this contract — but do
 * not reintroduce alert language in the UI until the polling actually exists.
 *
 * The storage key stays `adventure-planner:price-watch` so existing saves survive.
 */

const STORAGE_KEY = 'adventure-planner:price-watch';

export type WatchKind = 'flight' | 'hotel';

export interface WatchItem {
  id: string;             // unique key (kind:hash-of-attrs)
  kind: WatchKind;
  label: string;          // human-readable: "MEL → HAN · 01/07/2026" or "La Sinfonia, Hanoi"
  basePrice: string;      // the price at add-time, raw LLM string
  /** ISO timestamp when added. */
  addedAt: number;
  /** Trip id (when the item was added during a specific trip). */
  tripId?: string;
  /** Optional booking deep link for one-tap retry. */
  link?: string;
  /** Optional flight-specific metadata for richer display. */
  flight?: { from: string; to: string; date: string };
  /** Optional hotel-specific metadata. */
  hotel?: { name: string; destination: string };
}

function safeRead(): WatchItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function safeWrite(items: WatchItem[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  catch { /* ignore */ }
}

export function listWatched(): WatchItem[] {
  return safeRead().sort((a, b) => b.addedAt - a.addedAt);
}

export function listWatchedForTrip(tripId: string | null | undefined): WatchItem[] {
  if (!tripId) return listWatched();
  return listWatched().filter(i => !i.tripId || i.tripId === tripId);
}

export function isWatched(id: string): boolean {
  return safeRead().some(i => i.id === id);
}

export function toggleWatch(item: WatchItem): boolean {
  const items = safeRead();
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    items.splice(idx, 1);
    safeWrite(items);
    return false;
  }
  items.unshift({ ...item, addedAt: Date.now() });
  // Cap at 50
  safeWrite(items.slice(0, 50));
  return true;
}

export function removeWatch(id: string): void {
  safeWrite(safeRead().filter(i => i.id !== id));
}

/** Stable id builder for flights and hotels. Normalises case so the same
 *  route doesn't appear twice when the LLM returns `hkg` vs `HKG` between
 *  generations. */
export function flightWatchId(fromCode: string, toCode: string, date: string): string {
  return `flight:${(fromCode || '').toUpperCase()}-${(toCode || '').toUpperCase()}-${date}`;
}
export function hotelWatchId(name: string, destination: string): string {
  return `hotel:${(destination || '').toLowerCase().trim()}-${(name || '').toLowerCase().replace(/\s+/g, '-')}`;
}

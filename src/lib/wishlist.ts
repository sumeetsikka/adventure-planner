/**
 * Wishlist — destinations the user has saved without committing to a trip.
 * Persisted in localStorage as an array of country IDs.
 */

const KEY = 'adventure-planner:wishlist';

function safeRead(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function safeWrite(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* quota / privacy mode — ignore */
  }
}

export function listWishlist(): string[] {
  return safeRead();
}

export function isInWishlist(countryId: string): boolean {
  return safeRead().includes(countryId);
}

export function toggleWishlist(countryId: string): boolean {
  const list = safeRead();
  const i = list.indexOf(countryId);
  if (i >= 0) {
    list.splice(i, 1);
    safeWrite(list);
    return false;
  }
  list.push(countryId);
  safeWrite(list);
  return true;
}

export function removeFromWishlist(countryId: string): void {
  const list = safeRead().filter((id) => id !== countryId);
  safeWrite(list);
}

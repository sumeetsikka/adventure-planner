/**
 * Travel wallet — one offline place for the documents you scramble for at
 * check-in: passport numbers + expiry, travel-insurance policy + emergency
 * line, frequent-flyer numbers, booking confirmation numbers (PNRs), and free
 * notes (visa reference, lounge code, etc.).
 *
 * PRIVACY: device-only by design. Stored in localStorage, never sent to any
 * server or LLM. This is a personal cheat-sheet, not synced cloud storage — the
 * UI says so plainly. (Same local-first model as journal / expenses / readiness.)
 */

const KEY_PREFIX = 'adventure-planner:wallet:';

export type WalletItemType =
  | 'passport'
  | 'insurance'
  | 'frequent-flyer'
  | 'confirmation'
  | 'note';

export const WALLET_TYPES: { id: WalletItemType; label: string; icon: string; sensitive: boolean }[] = [
  { id: 'passport',       label: 'Passport',            icon: '🛂', sensitive: true },
  { id: 'insurance',      label: 'Travel insurance',    icon: '🛡️', sensitive: true },
  { id: 'frequent-flyer', label: 'Frequent flyer',      icon: '✈️', sensitive: false },
  { id: 'confirmation',   label: 'Booking confirmation', icon: '🎫', sensitive: false },
  { id: 'note',           label: 'Note',                icon: '📝', sensitive: false },
];

export interface WalletItem {
  id: string;
  type: WalletItemType;
  /** Whose / what it is — e.g. traveller name, airline, hotel. */
  label: string;
  /** The number/reference itself (passport no, policy no, PNR, FF number). */
  value: string;
  /** Optional secondary detail — expiry (YYYY-MM-DD for passports), provider
   *  emergency phone for insurance, free text otherwise. */
  detail?: string;
  createdAt: number;
}

function key(tripId: string): string { return KEY_PREFIX + tripId; }

function safeRead(tripId: string): WalletItem[] {
  try {
    const raw = localStorage.getItem(key(tripId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function safeWrite(tripId: string, items: WalletItem[]): void {
  try { localStorage.setItem(key(tripId), JSON.stringify(items)); }
  catch { /* quota / privacy mode */ }
}

export function listWallet(tripId: string): WalletItem[] {
  // Stable order: by type (passport→insurance→…), then creation.
  const order = WALLET_TYPES.map((t) => t.id);
  return safeRead(tripId).sort((a, b) =>
    order.indexOf(a.type) - order.indexOf(b.type) || a.createdAt - b.createdAt
  );
}

export function addWalletItem(tripId: string, item: Omit<WalletItem, 'id' | 'createdAt'>): WalletItem {
  const w: WalletItem = {
    ...item,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: Date.now(),
  };
  safeWrite(tripId, [...safeRead(tripId), w]);
  return w;
}

export function removeWalletItem(tripId: string, id: string): void {
  safeWrite(tripId, safeRead(tripId).filter((w) => w.id !== id));
}

export function isSensitive(type: WalletItemType): boolean {
  return WALLET_TYPES.find((t) => t.id === type)?.sensitive ?? false;
}

/** Mask all but the last 4 chars — "·····4821" — for at-a-glance privacy. */
export function maskValue(value: string): string {
  const v = (value || '').trim();
  if (v.length <= 4) return '••••';
  return '•'.repeat(Math.min(8, v.length - 4)) + v.slice(-4);
}

/**
 * Passport-validity check: many countries require ≥6 months' validity beyond
 * entry. Given a passport expiry and the trip's return date, flag risk.
 * Returns null when not a passport / no expiry / unparseable.
 */
export function passportExpiryWarning(
  item: WalletItem,
  returnDate: string | undefined,
): { level: 'expired' | 'risk' | 'ok'; message: string } | null {
  if (item.type !== 'passport' || !item.detail || !returnDate) return null;
  const exp = new Date(item.detail);
  const ret = new Date(returnDate);
  if (!Number.isFinite(exp.getTime()) || !Number.isFinite(ret.getTime())) return null;
  const monthsAfterReturn = (exp.getTime() - ret.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  if (monthsAfterReturn < 0) return { level: 'expired', message: 'Expires before your trip ends — renew before you travel.' };
  if (monthsAfterReturn < 6) return { level: 'risk', message: 'Under 6 months\' validity after your return — many countries refuse entry. Check the rules.' };
  return { level: 'ok', message: 'Valid 6+ months beyond your return.' };
}

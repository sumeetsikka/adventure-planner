// Live FX rates from frankfurter.app (ECB data, free, CORS-enabled, no key).
// Module-level cache: 1 hour TTL to avoid hammering the API.

interface CacheEntry {
  rate: number;
  fetchedAt: number;
}

const TTL_MS = 60 * 60 * 1000; // 1 hour
const cache: Map<string, CacheEntry> = new Map();

function key(base: string, quote: string): string {
  return `${base.toUpperCase()}_${quote.toUpperCase()}`;
}

export function getCachedTimestamp(base: string, quote: string): number | null {
  const e = cache.get(key(base, quote));
  return e ? e.fetchedAt : null;
}

export async function fetchRate(base: string, quote: string): Promise<number | null> {
  if (!base || !quote) return null;
  const b = base.toUpperCase();
  const q = quote.toUpperCase();
  if (b === q) return 1;

  const cached = cache.get(key(b, q));
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
    return cached.rate;
  }

  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?base=${encodeURIComponent(b)}&symbols=${encodeURIComponent(q)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.rates?.[q];
    if (typeof rate !== 'number' || !isFinite(rate)) return null;
    cache.set(key(b, q), { rate, fetchedAt: Date.now() });
    return rate;
  } catch {
    return null;
  }
}

export async function convert(
  amount: number,
  from: string,
  to: string
): Promise<number | null> {
  if (!isFinite(amount)) return null;
  const f = (from || '').toUpperCase();
  const t = (to || '').toUpperCase();
  if (!f || !t) return null;
  if (f === t) return amount;
  const rate = await fetchRate(f, t);
  if (rate == null) return null;
  return amount * rate;
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  AUD: '$',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  CAD: 'C$',
  INR: '₹',
  AED: 'د.إ',
  ZAR: 'R',
};

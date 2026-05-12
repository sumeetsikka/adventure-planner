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

/**
 * Daily FX rates over the last N days from frankfurter.app.
 * Used by the editorial CurrencyTab sparkline.
 *
 * Returns an array of `{ date: 'YYYY-MM-DD', rate: number }` ordered oldest → newest.
 * Cached per pair for 6h since historical data doesn't churn.
 */
interface SeriesCacheEntry {
  series: Array<{ date: string; rate: number }>;
  fetchedAt: number;
}
const SERIES_TTL_MS = 6 * 60 * 60 * 1000;
const seriesCache: Map<string, SeriesCacheEntry> = new Map();

export async function fetchSeries(
  base: string,
  quote: string,
  days = 30,
): Promise<Array<{ date: string; rate: number }> | null> {
  const b = (base || '').toUpperCase();
  const q = (quote || '').toUpperCase();
  if (!b || !q || b === q) return null;

  const cacheKey = `${b}_${q}_${days}`;
  const cached = seriesCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < SERIES_TTL_MS) return cached.series;

  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  try {
    const url = `https://api.frankfurter.app/${fmt(start)}..${fmt(end)}?base=${encodeURIComponent(b)}&symbols=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const rates = data?.rates as Record<string, Record<string, number>> | undefined;
    if (!rates) return null;
    const series = Object.entries(rates)
      .map(([date, vals]) => ({ date, rate: vals[q] }))
      .filter((p) => typeof p.rate === 'number' && isFinite(p.rate))
      .sort((a, b2) => a.date.localeCompare(b2.date));
    if (series.length === 0) return null;
    seriesCache.set(cacheKey, { series, fetchedAt: Date.now() });
    return series;
  } catch {
    return null;
  }
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

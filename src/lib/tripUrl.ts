import type { TravelConfig } from '../types';

interface MinimalTripConfig {
  c: string;   // country id
  d: string[]; // destination ids
  dd: string;  // departure date
  rd: string;  // return date
  t: number;   // travellers
  a: number[]; // ages
  v: string[]; // vibes
}

export function encodeTripToUrl(config: TravelConfig): string {
  const minimal: MinimalTripConfig = {
    c: config.country?.id || '',
    d: config.destinations.map(d => d.id),
    dd: config.departureDate,
    rd: config.returnDate,
    t: config.travellers,
    a: config.ages,
    v: config.vibes,
  };
  const json = JSON.stringify(minimal);
  const encoded = utf8ToBase64(json);
  const url = `${window.location.origin}${window.location.pathname}?trip=${encoded}`;
  return url;
}

export function decodeTripFromUrl(): MinimalTripConfig | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const tripParam = params.get('trip');
    if (!tripParam) return null;
    const json = base64ToUtf8(tripParam);
    const parsed = JSON.parse(json) as MinimalTripConfig;
    if (!parsed.c || !parsed.d || !parsed.dd || !parsed.rd) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** btoa-safe encoder: raw `btoa` throws InvalidCharacterError on any code
 *  point > 0xFF (anything non-Latin1 — e.g. an emoji or "Côte"). We round-trip
 *  through UTF-8 bytes so the shared link survives Unicode inputs. */
function utf8ToBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToUtf8(s: string): string {
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

/**
 * Native share with copy-to-clipboard fallback.
 * Uses Web Share API on iOS Safari + Android Chrome (and modern desktop
 * Chrome/Edge). Falls back to clipboard everywhere else.
 *
 * Returns: 'shared' | 'copied' | 'cancelled'
 */
export async function shareOrCopy(opts: { title: string; text: string; url: string }): Promise<'shared' | 'copied' | 'cancelled'> {
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({ title: opts.title, text: opts.text, url: opts.url });
      return 'shared';
    } catch (err) {
      // AbortError = user cancelled the share sheet — don't fall back to copy
      if (err instanceof Error && err.name === 'AbortError') return 'cancelled';
      // Some browsers throw if Web Share rejects (e.g. denied permission); fall through
    }
  }
  await copyToClipboard(opts.url);
  return 'copied';
}

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
  const encoded = btoa(json);
  const url = `${window.location.origin}${window.location.pathname}?trip=${encoded}`;
  return url;
}

export function decodeTripFromUrl(): MinimalTripConfig | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const tripParam = params.get('trip');
    if (!tripParam) return null;
    const json = atob(tripParam);
    const parsed = JSON.parse(json) as MinimalTripConfig;
    if (!parsed.c || !parsed.d || !parsed.dd || !parsed.rd) return null;
    return parsed;
  } catch {
    return null;
  }
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

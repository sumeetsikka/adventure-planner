/**
 * Pre-trip readiness — a timeline of things-to-do before departure.
 *
 * Items are generated from the trip config (visa requirements, departure date,
 * destinations). Completion state persists per-trip in localStorage so the
 * dashboard can show a "you're 70% ready" stat.
 */

import type { TravelConfig, VisaInfo } from '../types';

const STORAGE_KEY_PREFIX = 'adventure-planner:readiness:';

export type ReadinessItemId =
  | 'flights-booked'
  | 'visa-applied'
  | 'insurance-purchased'
  | 'bank-notified'
  | 'travel-money'
  | 'driving-permit'
  | 'vaccinations'
  | 'packing-started'
  | 'hotel-confirmations'
  | 'flight-checkin'
  | 'devices-charged'
  | 'offline-maps'
  | 'house-prepared';

export interface ReadinessItem {
  id: ReadinessItemId;
  label: string;
  detail: string;
  /** Days before departure when this item ideally should be done. */
  daysBefore: number;
  /** Optional deep-link (opens external URL or in-app target). */
  link?: string;
  /** Icon emoji. */
  icon: string;
  /** Category — for grouping in the UI. */
  category: 'documents' | 'money' | 'logistics' | 'health' | 'house';
  /** Whether the item is relevant for THIS trip (based on config). */
  relevant: boolean;
}

/** Build the readiness list for a given trip. Items are sorted by daysBefore
 *  desc (earliest first). Length depends on what's relevant — a visa-free
 *  destination skips the visa item, no driving needs skip the driving permit. */
export function buildReadinessItems(_config: TravelConfig, visa: VisaInfo | null): ReadinessItem[] {
  const items: ReadinessItem[] = [
    {
      id: 'flights-booked',
      label: 'Book your flights',
      detail: 'Lock in flights — prices typically rise in the final 60 days.',
      daysBefore: 90,
      icon: '✈️',
      category: 'logistics',
      relevant: true,
    },
    {
      id: 'visa-applied',
      label: 'Apply for visa',
      detail: visa?.processing_time
        ? `Allow ${visa.processing_time} processing time. ${visa.cost_aud ? `Cost ~${visa.cost_aud} pp.` : ''}`
        : 'Apply early — processing can take weeks during peak season.',
      daysBefore: 60,
      icon: '🛂',
      // VisaInfo doesn't expose a structured link field, but if the LLM put a
      // URL in the how_to_apply text, extract it as a convenience deep-link.
      link: extractFirstUrl(visa?.how_to_apply),
      category: 'documents',
      relevant: !!(visa && visa.visa_required),
    },
    {
      id: 'vaccinations',
      label: 'Vaccinations & health check',
      detail: 'Some vaccines need weeks to take effect. Book a travel-clinic visit.',
      daysBefore: 60,
      icon: '💉',
      category: 'health',
      relevant: !!(visa && Array.isArray(visa.vaccinations) && visa.vaccinations.length > 0),
    },
    {
      id: 'insurance-purchased',
      label: 'Buy travel insurance',
      detail: 'Cover cancellations, medical, lost baggage. Most policies need to be in place before departure.',
      daysBefore: 45,
      icon: '🛡️',
      category: 'documents',
      relevant: true,
    },
    {
      id: 'bank-notified',
      label: 'Notify your bank',
      detail: 'Tell your bank you\'re travelling so cards don\'t get blocked overseas.',
      daysBefore: 30,
      icon: '🏦',
      category: 'money',
      relevant: true,
    },
    {
      id: 'travel-money',
      label: 'Sort travel money',
      detail: 'Order foreign currency cash and consider a travel debit card with no FX fees.',
      daysBefore: 21,
      icon: '💱',
      category: 'money',
      relevant: true,
    },
    {
      id: 'driving-permit',
      label: 'International Driving Permit',
      detail: 'If you plan to drive, apply via Australia Post — issued same-day in most outlets.',
      daysBefore: 21,
      icon: '🚗',
      // Heuristic: assume relevant unless the trip is purely city-based. Show as toggleable instead.
      category: 'documents',
      relevant: false,
    },
    {
      id: 'packing-started',
      label: 'Start your packing list',
      detail: 'Reference your AI-generated packing list. Buy any missing essentials early.',
      daysBefore: 14,
      icon: '🧳',
      category: 'logistics',
      relevant: true,
    },
    {
      id: 'hotel-confirmations',
      label: 'Confirm bookings',
      detail: 'Email each hotel to confirm your reservation and any early check-in / late check-out requests.',
      daysBefore: 7,
      icon: '🏨',
      category: 'logistics',
      relevant: true,
    },
    {
      id: 'house-prepared',
      label: 'House & mail',
      detail: 'Hold the mail, arrange pet/plant care, set timers on lights, lock up.',
      daysBefore: 3,
      icon: '🏠',
      category: 'house',
      relevant: true,
    },
    {
      id: 'flight-checkin',
      label: 'Online check-in',
      detail: 'Most airlines open online check-in 24-48h before departure. Pick your seat early.',
      daysBefore: 1,
      icon: '✅',
      category: 'logistics',
      relevant: true,
    },
    {
      id: 'devices-charged',
      label: 'Charge devices, pack chargers',
      detail: 'Power bank, universal adapter, headphones. Save key documents offline.',
      daysBefore: 1,
      icon: '🔌',
      category: 'logistics',
      relevant: true,
    },
    {
      id: 'offline-maps',
      label: 'Offline maps & translation',
      detail: 'Download Google Maps offline regions and Google Translate language packs.',
      daysBefore: 1,
      icon: '🗺️',
      category: 'logistics',
      relevant: true,
    },
  ];
  return items.filter(i => i.relevant).sort((a, b) => b.daysBefore - a.daysBefore);
}

/** Compute days until departure (positive = future, negative = past). */
export function daysUntilDeparture(departureDate: string): number {
  if (!departureDate) return NaN;
  const dep = new Date(departureDate);
  const now = new Date();
  // Use midnight for both to ignore time-of-day.
  const ms = dep.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** Persistence per-trip. */
function storageKey(tripId: string): string {
  return STORAGE_KEY_PREFIX + tripId;
}

export function loadCompleted(tripId: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(storageKey(tripId));
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function toggleCompleted(tripId: string, itemId: ReadinessItemId, done: boolean): void {
  const state = loadCompleted(tripId);
  if (done) state[itemId] = true;
  else delete state[itemId];
  try { localStorage.setItem(storageKey(tripId), JSON.stringify(state)); }
  catch { /* ignore */ }
}

function extractFirstUrl(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const m = text.match(/https?:\/\/[^\s)]+/);
  return m ? m[0] : undefined;
}

/** % complete across all relevant items. */
export function readinessProgress(items: ReadinessItem[], completed: Record<string, boolean>): number {
  if (items.length === 0) return 0;
  const done = items.filter(i => completed[i.id]).length;
  return Math.round((done / items.length) * 100);
}

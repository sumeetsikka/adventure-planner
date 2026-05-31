/**
 * Plan stitching — the layer that turns isolated flights / hotels / transport /
 * itinerary days into ONE chronological plan.
 *
 * The backend already stamps real dates on every flight (`fixFlightDates`) and
 * hotel (`fixHotelDates`), and each itinerary day's date is
 * `departureDate + (day - 1)`. This module joins all of that on the date axis so
 * the UI can say, per day: "fly this, check in here, do these things, sleep here".
 */

import type {
  TravelConfig,
  ItineraryDay,
  FlightLeg,
  DestinationHotels,
  HotelRec,
  TransportLeg,
} from '../types';
import { addDaysISO, isDateInStay } from './dateUtils';

export interface HotelStay {
  dest: DestinationHotels;
  /** The recommended (or first) hotel for this destination. */
  pick: HotelRec | null;
}

export interface DayPlan {
  day: number;            // 1-based
  date: string;           // YYYY-MM-DD (local)
  itineraryDay: ItineraryDay | null;
  /** Flights departing on this date. */
  flights: FlightLeg[];
  /** Transport legs on this date. */
  transport: TransportLeg[];
  /** Hotels you CHECK IN to today. */
  checkIns: HotelStay[];
  /** Hotels you CHECK OUT of today. */
  checkOuts: HotelStay[];
  /** Where you sleep tonight (the stay whose [check_in, check_out) covers today).
   *  null on the final day (you fly home) or when no hotel matches. */
  stayingTonight: HotelStay | null;
  /** Convenience flags. */
  isFirstDay: boolean;
  isLastDay: boolean;
}

function pickHotel(dest: DestinationHotels): HotelRec | null {
  if (!dest.hotels || dest.hotels.length === 0) return null;
  return dest.hotels.find((h) => h.recommended) || dest.hotels[0];
}

/**
 * Build one DayPlan per itinerary day, joining flights/hotels/transport by date.
 * Falls back to a date-range walk when there's no itinerary yet.
 */
export function buildDayPlans(
  config: TravelConfig,
  itinerary: ItineraryDay[],
  flights: FlightLeg[],
  hotels: DestinationHotels[],
  transport: TransportLeg[],
): DayPlan[] {
  const departure = config.departureDate;
  if (!departure) return [];

  // Determine the number of days: prefer the itinerary length, else derive from
  // departure→return.
  let dayCount = itinerary.length;
  if (dayCount === 0 && config.returnDate) {
    const ms = new Date(config.returnDate).getTime() - new Date(departure).getTime();
    dayCount = Number.isFinite(ms) ? Math.max(1, Math.round(ms / 86_400_000) + 1) : 0;
  }
  if (dayCount === 0) return [];

  const stays: HotelStay[] = (hotels || []).map((dest) => ({ dest, pick: pickHotel(dest) }));

  const plans: DayPlan[] = [];
  for (let i = 0; i < dayCount; i++) {
    const date = addDaysISO(departure, i);
    const itineraryDay = itinerary.find((d) => d.day === i + 1) ?? itinerary[i] ?? null;

    const dayFlights = (flights || []).filter((f) => f.date === date);
    const dayTransport = (transport || []).filter((t) => t.date === date);
    const checkIns = stays.filter((s) => s.dest.check_in === date);
    const checkOuts = stays.filter((s) => s.dest.check_out === date);
    const stayingTonight = stays.find((s) => isDateInStay(date, s.dest.check_in, s.dest.check_out)) ?? null;

    plans.push({
      day: i + 1,
      date,
      itineraryDay,
      flights: dayFlights,
      transport: dayTransport,
      checkIns,
      checkOuts,
      stayingTonight,
      isFirstDay: i === 0,
      isLastDay: i === dayCount - 1,
    });
  }
  return plans;
}

/** A flat, ordered list of "moves" for a day — used to render the stitched
 *  header strip above each day's activities (fly → check out → transport →
 *  check in). Returns [] for a pure stay-put day. */
export interface DayMove {
  kind: 'flight' | 'transport' | 'checkout' | 'checkin';
  icon: string;
  text: string;
  sub?: string;
  /** Original object for deep-linking to the relevant tab. */
  ref?: FlightLeg | TransportLeg | HotelStay;
}

/** Which trip-days you spend in each destination, keyed by lowercased name.
 *  Used to anchor Taste/Do/Nearby suggestions to the days you're actually there. */
export interface DestinationDays {
  destination: string;     // original-cased name (from the itinerary)
  firstDay: number;
  lastDay: number;
  firstDate: string;
  lastDate: string;
}

function normaliseLoc(s: string): string {
  return (s || '').toLowerCase().split('(')[0].split('/')[0].trim();
}

export function destinationDayRanges(plans: DayPlan[]): Map<string, DestinationDays> {
  const map = new Map<string, DestinationDays>();
  for (const plan of plans) {
    const loc = plan.itineraryDay?.location || plan.stayingTonight?.dest.destination || plan.checkIns[0]?.dest.destination;
    if (!loc) continue;
    const key = normaliseLoc(loc);
    if (!key) continue;
    const existing = map.get(key);
    if (existing) {
      existing.lastDay = plan.day;
      existing.lastDate = plan.date;
    } else {
      map.set(key, { destination: loc, firstDay: plan.day, lastDay: plan.day, firstDate: plan.date, lastDate: plan.date });
    }
  }
  return map;
}

/** Look up the day-range for a destination name (fuzzy: substring either way).
 *  Returns null if the destination isn't found in the plan. */
export function dayRangeForDestination(
  ranges: Map<string, DestinationDays>,
  destination: string,
): DestinationDays | null {
  const key = normaliseLoc(destination);
  if (!key) return null;
  const exact = ranges.get(key);
  if (exact) return exact;
  // Fuzzy: either name contains the other.
  for (const [k, v] of ranges) {
    if (k.includes(key) || key.includes(k)) return v;
  }
  return null;
}

// ── Per-day cost allocation ───────────────────────────────────────────────

export interface DayCost {
  day: number;
  date: string;
  total: number;          // per-person AUD allocated to this day
  parts: { label: string; amount: number }[];
}

function parseMid(cost: string): number {
  const nums = (cost || '').match(/[\d,]+/g);
  if (!nums || nums.length === 0) return 0;
  const v = nums.map((n) => parseInt(n.replace(/,/g, ''), 10)).filter((n) => Number.isFinite(n));
  if (v.length === 0) return 0;
  if (v.length === 1) return v[0];
  return Math.round((v[0] + v[1]) / 2);
}

/** Allocate the trip's costs across days:
 *  - flights → the day they depart (per person)
 *  - hotels → spread the per-night rate across the nights of that stay (per person share)
 *  - the remaining budget categories (food/activities/transport/misc) → spread
 *    evenly across all days, so each day shows a realistic running spend.
 *  All figures are PER PERSON AUD to match the rest of the Budget tab. */
export function perDayCosts(
  plans: DayPlan[],
  flights: FlightLeg[],
  budget: { category: string; cost: string }[],
  travellers: number,
): DayCost[] {
  const pax = Math.max(1, travellers || 1);
  const dayCosts: DayCost[] = plans.map((p) => ({ day: p.day, date: p.date, total: 0, parts: [] }));
  const byDay = new Map(dayCosts.map((d) => [d.day, d]));

  // Flights → departure day (price is already per person).
  for (const f of flights || []) {
    const plan = plans.find((p) => p.date === f.date);
    if (!plan) continue;
    const amt = parseMid(f.price_estimate_aud);
    if (amt <= 0) continue;
    const dc = byDay.get(plan.day)!;
    dc.parts.push({ label: `Flight ${f.from_code}→${f.to_code}`, amount: amt });
    dc.total += amt;
  }

  // Hotels → spread per-night across the stay's nights (per person = rate / pax,
  // assuming the per-night rate is a room shared by the party).
  for (const plan of plans) {
    const stay = plan.stayingTonight;
    if (!stay?.pick) continue;
    const perNightRoom = parseMid(stay.pick.price_per_night_aud);
    if (perNightRoom <= 0) continue;
    const perPerson = Math.round(perNightRoom / pax);
    const dc = byDay.get(plan.day)!;
    dc.parts.push({ label: `Stay · ${stay.pick.name}`, amount: perPerson });
    dc.total += perPerson;
  }

  // Remaining categories (everything that isn't flights/accommodation) spread
  // evenly across all days.
  const dailyCats = (budget || []).filter((b) => {
    const c = (b.category || '').toLowerCase();
    return !c.includes('flight') && !c.includes('accommodation') && !c.includes('hotel') && !c.includes('lodging');
  });
  const dailyTotal = dailyCats.reduce((s, b) => s + parseMid(b.cost), 0);
  if (dayCosts.length > 0 && dailyTotal > 0) {
    const perDay = Math.round(dailyTotal / dayCosts.length);
    for (const dc of dayCosts) {
      dc.parts.push({ label: 'Food, activities & local transport', amount: perDay });
      dc.total += perDay;
    }
  }

  return dayCosts;
}

export function dayMoves(plan: DayPlan): DayMove[] {
  const moves: DayMove[] = [];

  for (const f of plan.flights) {
    moves.push({
      kind: 'flight',
      icon: '✈️',
      text: `Fly ${f.from_code} → ${f.to_code}`,
      sub: [f.airlines?.[0], f.duration, f.stops].filter(Boolean).join(' · '),
      ref: f,
    });
  }
  for (const co of plan.checkOuts) {
    // Don't show a checkout that coincides with flying home unless there's a hotel pick worth naming.
    moves.push({
      kind: 'checkout',
      icon: '🧳',
      text: `Check out${co.pick ? ` of ${co.pick.name}` : ` of your ${co.dest.destination} hotel`}`,
      ref: co,
    });
  }
  for (const t of plan.transport) {
    moves.push({
      kind: 'transport',
      icon: t.mode?.toLowerCase().includes('train') ? '🚆'
        : t.mode?.toLowerCase().includes('ferry') || t.mode?.toLowerCase().includes('boat') ? '⛴️'
        : t.mode?.toLowerCase().includes('bus') ? '🚌' : '🚗',
      text: `${t.mode || 'Transfer'} ${t.from} → ${t.to}`,
      sub: [t.operator, t.duration].filter(Boolean).join(' · '),
      ref: t,
    });
  }
  for (const ci of plan.checkIns) {
    moves.push({
      kind: 'checkin',
      icon: '🏨',
      text: `Check in${ci.pick ? ` to ${ci.pick.name}` : ` to your ${ci.dest.destination} hotel`}`,
      sub: ci.pick ? [ci.pick.area, ci.pick.price_per_night_aud && `${ci.pick.price_per_night_aud}/night`].filter(Boolean).join(' · ') : undefined,
      ref: ci,
    });
  }

  return moves;
}

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

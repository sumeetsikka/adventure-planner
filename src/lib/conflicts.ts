import type { ItineraryDay, FlightLeg, DestinationHotels, TransportLeg, TravelConfig } from '../types';

export interface Conflict {
  severity: 'warning' | 'info';
  day: number;
  message: string;
  hint?: string;
}

function ciIncludes(haystack: string, needle: string): boolean {
  if (!haystack || !needle) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function locKey(s: string): string {
  return (s || '').toLowerCase().split('(')[0].split('/')[0].trim();
}

function dateDiffDays(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

function looksLikeEvening(activities: string[]): boolean {
  const text = activities.join(' ').toLowerCase();
  return /(\bevening\b|\bnight\b|dinner|sunset|drinks|bar|show|theatre|concert)/.test(text);
}

function isLateArrival(flight: FlightLeg): boolean {
  const text = `${flight.duration || ''} ${flight.tip || ''} ${flight.type || ''}`.toLowerCase();
  return /(arriv\w* (after )?(9|10|11|12)\s?pm|late (arrival|night)|red[- ]?eye|overnight)/.test(text);
}

function parseDurationHours(s: string): number | null {
  if (!s) return null;
  const m = s.match(/(\d+)\s*h(?:r|our)?s?(?:\s*(\d+)\s*m)?/i);
  if (!m) return null;
  const h = parseInt(m[1] || '0');
  const min = parseInt(m[2] || '0');
  return h + min / 60;
}

export function findConflicts(
  config: TravelConfig,
  itinerary: ItineraryDay[],
  flights: FlightLeg[],
  hotels: DestinationHotels[],
  transport: TransportLeg[]
): Conflict[] {
  const conflicts: Conflict[] = [];

  // Day count mismatch
  if (config.departureDate && config.returnDate && itinerary.length > 0) {
    const expected = dateDiffDays(config.departureDate, config.returnDate);
    if (expected > 0 && Math.abs(itinerary.length - expected) >= 1) {
      conflicts.push({
        severity: 'warning',
        day: 1,
        message: `Itinerary has ${itinerary.length} days but trip spans ${expected} days.`,
        hint: 'Adjust the itinerary length or your departure/return dates so they match.',
      });
    }
  }

  // Late-arriving flight on a day with evening activities
  for (const f of flights) {
    if (!isLateArrival(f)) continue;
    const idx = itinerary.findIndex((d) => d.location && (
      ciIncludes(d.location, f.to_code) ||
      ciIncludes(d.title, f.to_code)
    ));
    if (idx >= 0 && looksLikeEvening(itinerary[idx].activities)) {
      conflicts.push({
        severity: 'warning',
        day: itinerary[idx].day,
        message: `Late arrival into ${f.to_code} clashes with evening plans on day ${itinerary[idx].day}.`,
        hint: 'Move evening activities to the next day or pick an earlier flight.',
      });
    }
  }

  // Hotel check-in vs itinerary placement
  for (const h of hotels) {
    if (!h.check_in) continue;
    const targetIdx = itinerary.findIndex((d) => ciIncludes(d.location, locKey(h.destination)));
    if (targetIdx < 0) continue;
    const expectedDate = config.departureDate
      ? new Date(config.departureDate).getTime() + targetIdx * 24 * 60 * 60 * 1000
      : null;
    if (expectedDate == null) continue;
    const checkIn = new Date(h.check_in).getTime();
    const driftDays = Math.abs(Math.round((checkIn - expectedDate) / (1000 * 60 * 60 * 24)));
    if (driftDays >= 1) {
      conflicts.push({
        severity: 'warning',
        day: itinerary[targetIdx].day,
        message: `Hotel check-in for ${h.destination} (${h.check_in}) is ${driftDays} day${driftDays > 1 ? 's' : ''} off from the itinerary.`,
        hint: 'Update the hotel dates or the day-by-day plan so they line up.',
      });
    }
  }

  // Transport leg with no matching itinerary day
  for (const t of transport) {
    if (!t.date) continue;
    const drift = config.departureDate ? dateDiffDays(config.departureDate, t.date) : -1;
    const itinDay = itinerary[drift];
    const matches = itinDay && (
      ciIncludes(itinDay.location, locKey(t.from)) ||
      ciIncludes(itinDay.location, locKey(t.to)) ||
      ciIncludes(itinDay.title, locKey(t.from)) ||
      ciIncludes(itinDay.title, locKey(t.to))
    );
    if (!matches) {
      conflicts.push({
        severity: 'info',
        day: Math.max(1, drift + 1),
        message: `Transport ${t.from} → ${t.to} on ${t.date} has no matching itinerary day.`,
        hint: 'Add a travel day or adjust the transport date.',
      });
    }

    // Less than 2h between transport and next activity (heuristic)
    const hours = parseDurationHours(t.duration);
    if (hours != null && hours > 6 && itinDay && itinDay.activities.length > 2) {
      conflicts.push({
        severity: 'warning',
        day: Math.max(1, drift + 1),
        message: `${Math.round(hours)}h transit on day ${Math.max(1, drift + 1)} leaves little room for the planned activities.`,
        hint: 'Consider lightening the schedule on transit days.',
      });
    }
  }

  return conflicts;
}

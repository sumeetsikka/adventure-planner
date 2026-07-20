import type { ItineraryDay, FlightLeg, DestinationHotels, TransportLeg, TravelConfig, WeatherInfo } from '../types';

export interface Conflict {
  severity: 'warning' | 'info';
  day: number;
  message: string;
  hint?: string;
}

export interface Nudge {
  severity: 'tip' | 'caution';
  category: 'flight' | 'hotel' | 'transport' | 'general';
  message: string;
  detail?: string;
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

  // Day count mismatch. `dateDiffDays` returns nights; an N-night trip has N+1
  // itinerary days, so compare against expected days (= nights + 1). Without the
  // +1 this fired a false "Itinerary has 8 days but trip spans 7 days" warning
  // on every correctly-planned trip.
  if (config.departureDate && config.returnDate && itinerary.length > 0) {
    const expectedDays = dateDiffDays(config.departureDate, config.returnDate) + 1;
    if (expectedDays > 0 && Math.abs(itinerary.length - expectedDays) >= 1) {
      conflicts.push({
        severity: 'warning',
        day: 1,
        message: `Itinerary has ${itinerary.length} days but trip spans ${expectedDays} days.`,
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
    // Skip transports that fall outside the trip window — comparing them to
    // itinerary[-1] / itinerary[outOfRange] yields undefined and produces a
    // misleading "Day 1" conflict message.
    if (drift < 0 || drift >= itinerary.length) continue;
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
        day: drift + 1,
        message: `Transport ${t.from} → ${t.to} on ${t.date} has no matching itinerary day.`,
        hint: 'Add a travel day or adjust the transport date.',
      });
    }

    // Less than 2h between transport and next activity (heuristic)
    const hours = parseDurationHours(t.duration);
    if (hours != null && hours > 6 && itinDay && itinDay.activities.length > 2) {
      conflicts.push({
        severity: 'warning',
        day: drift + 1,
        message: `${Math.round(hours)}h transit on day ${drift + 1} leaves little room for the planned activities.`,
        hint: 'Consider lightening the schedule on transit days.',
      });
    }
  }

  return conflicts;
}

function parseLeadingHours(s: string): number | null {
  if (!s) return null;
  // Find the first number followed by 'h' or 'hour'
  const m = s.match(/(\d+(?:\.\d+)?)\s*h(?:r|our)?/i);
  if (!m) return null;
  const v = parseFloat(m[1]);
  return isNaN(v) ? null : v;
}

export function findNudges(
  config: TravelConfig,
  itinerary: ItineraryDay[],
  flights: FlightLeg[],
  hotels: DestinationHotels[],
  transport: TransportLeg[],
  weather: WeatherInfo[]
): Nudge[] {
  const nudges: Nudge[] = [];
  const seen = new Set<string>();
  const push = (n: Nudge) => {
    const key = `${n.severity}|${n.category}|${n.message}`;
    if (seen.has(key)) return;
    seen.add(key);
    nudges.push(n);
  };

  // Tight layover / multi-stop flights
  for (const f of flights) {
    const stopsText = `${f.stops || ''} ${f.duration || ''}`.toLowerCase();
    const stopsNum = parseInt((f.stops || '').match(/\d+/)?.[0] || '0', 10);
    const hasMultiStop = stopsNum > 1 || /\b1\s*stop\b/.test(stopsText);
    if (hasMultiStop) {
      push({
        severity: 'tip',
        category: 'flight',
        message: 'Flights with stops can be tight — consider arriving night before',
        detail: `${f.leg || `${f.from_code} → ${f.to_code}`} · ${f.stops || ''}`.trim(),
      });
    }
  }

  // Weather: hot, cold, rainy
  if (weather && weather.length > 0) {
    // Match weather to itinerary day by destination
    const findDayForDest = (dest: string): number | null => {
      const k = locKey(dest);
      const idx = itinerary.findIndex((d) => ciIncludes(d.location, k) || ciIncludes(d.title, k));
      return idx >= 0 ? itinerary[idx].day : null;
    };

    let highRainCount = 0;
    for (const w of weather) {
      const day = findDayForDest(w.destination) ?? 1;
      if (typeof w.temp_high_c === 'number' && w.temp_high_c > 32) {
        push({
          severity: 'tip',
          category: 'general',
          message: `Hot day on Day ${day} — pack water, hat, sunscreen`,
          detail: `${w.destination} · high ${w.temp_high_c}°C`,
        });
      }
      if (typeof w.temp_low_c === 'number' && w.temp_low_c < 5) {
        push({
          severity: 'tip',
          category: 'general',
          message: `Cold morning on Day ${day} — layers recommended`,
          detail: `${w.destination} · low ${w.temp_low_c}°C`,
        });
      }
      if (typeof w.rainfall_mm === 'number' && w.rainfall_mm > 100) {
        highRainCount++;
      }
    }
    if (highRainCount > 0) {
      push({
        severity: 'tip',
        category: 'general',
        message: 'Pack a light rain jacket',
        detail: `${highRainCount} destination${highRainCount > 1 ? 's' : ''} with high rainfall`,
      });
    }
  }

  // Long transport legs (>= 10h)
  for (const t of transport) {
    const hours = parseLeadingHours(t.duration);
    if (hours != null && hours >= 10) {
      const drift = config.departureDate ? dateDiffDays(config.departureDate, t.date) : -1;
      const dayNum = Math.max(1, drift + 1);
      push({
        severity: 'caution',
        category: 'transport',
        message: `Long ${t.mode || 'transport'} journey on Day ${dayNum} — consider an overnight option`,
        detail: `${t.from} → ${t.to} · ${t.duration}`,
      });
    }
  }

  // No buffer day: last activity on return flight day
  if (config.departureDate && config.returnDate && itinerary.length > 0) {
    const totalDays = dateDiffDays(config.departureDate, config.returnDate) + 1;
    const lastDay = itinerary[itinerary.length - 1];
    if (lastDay && lastDay.activities && lastDay.activities.length > 1 && lastDay.day >= totalDays) {
      push({
        severity: 'caution',
        category: 'flight',
        message: `Return flight is on Day ${lastDay.day} — leave time for transit`,
        detail: 'Consider lighter plans on the final day.',
      });
    }
  }

  // Tight check-in: hotel check-in date doesn't match itinerary day
  if (config.departureDate) {
    for (const h of hotels) {
      if (!h.check_in) continue;
      const targetIdx = itinerary.findIndex((d) => ciIncludes(d.location, locKey(h.destination)));
      if (targetIdx < 0) continue;
      const expectedDate = new Date(config.departureDate).getTime() + targetIdx * 24 * 60 * 60 * 1000;
      const checkIn = new Date(h.check_in).getTime();
      const driftDays = Math.abs(Math.round((checkIn - expectedDate) / (1000 * 60 * 60 * 24)));
      if (driftDays >= 1) {
        push({
          severity: 'caution',
          category: 'hotel',
          message: `Tight check-in for ${h.destination} — dates don't match the plan`,
          detail: `Hotel check-in ${h.check_in} vs Day ${itinerary[targetIdx].day}`,
        });
      }
    }
  }

  return nudges;
}

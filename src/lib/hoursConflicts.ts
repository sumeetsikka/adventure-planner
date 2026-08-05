/**
 * "Is this stop actually open when we've scheduled you?" — the ground-pass check.
 *
 * Roughly half of AI-generated itineraries schedule a visit outside the venue's
 * opening hours and about a quarter name somewhere that has permanently closed.
 * The plan can't know that on its own, but Google Places does, and the app
 * already fetches Places data for cards.
 *
 * DELIBERATELY CACHE-ONLY. This reads `peekPlace` and never triggers a lookup:
 * field tier prices the whole Places response, so a background sweep over every
 * stop in a plan would spend real money silently, on a schedule nobody asked for.
 * Coverage therefore grows as the traveller browses (each card warms the cache),
 * and a stop we know nothing about produces no claim at all — this only ever
 * reports problems it can actually prove.
 */
import type { ItineraryDay, TravelConfig } from '../types';
import { peekPlace } from './placeCache';
import { addDaysISO } from './dateUtils';
import { checkStopAgainstHours, hoursTextForDate } from './openingHours';
import type { Conflict } from './conflicts';

/** Event types worth checking — travel legs and downtime have no opening hours. */
const CHECKABLE = new Set(['meal', 'sight', 'activity', 'shopping', 'nightlife']);

export function findHoursConflicts(
  config: TravelConfig,
  itinerary: ItineraryDay[],
): Conflict[] {
  const out: Conflict[] = [];
  if (!config?.departureDate || !Array.isArray(itinerary)) return out;

  for (const day of itinerary) {
    const timeline = day.timeline;
    if (!Array.isArray(timeline) || timeline.length === 0) continue;
    const dateISO = addDaysISO(config.departureDate, (day.day || 1) - 1);
    const city = (day.location || '').split('(')[0].split('/')[0].trim();

    for (const ev of timeline) {
      if (!ev?.title || !ev.time) continue;
      if (ev.type && !CHECKABLE.has(ev.type)) continue;

      // Same query shape the cards use, so we hit their warmed cache entries.
      const place = peekPlace(city ? `${ev.title}, ${city}` : ev.title);
      if (!place || !place.available) continue;

      if (place.businessStatus === 'CLOSED_PERMANENTLY') {
        out.push({
          severity: 'warning',
          day: day.day,
          message: `${ev.title} has permanently closed.`,
          hint: 'Google lists this venue as shut down — swap it for something else.',
        });
        continue;
      }

      const verdict = checkStopAgainstHours(place.hours, dateISO, ev.time, ev.duration_min);
      if (verdict === 'closed-that-day') {
        out.push({
          severity: 'warning',
          day: day.day,
          message: `${ev.title} is closed on the day you've planned it.`,
          hint: 'Move it to another day, or replace it.',
        });
      } else if (verdict === 'outside-hours') {
        const hours = hoursTextForDate(place.hours, dateISO);
        out.push({
          severity: 'warning',
          day: day.day,
          message: `${ev.title} is scheduled for ${ev.time}, outside its opening hours.`,
          hint: hours ? `Google lists it as open ${hours} that day.` : 'Check the venue\'s hours and shift the time.',
        });
      }
    }
  }
  return out;
}

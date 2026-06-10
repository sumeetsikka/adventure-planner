/**
 * Plan-editing helpers — pure functions that transform the itinerary.
 *
 * `addStopToDay` powers the Wanderlog-style planning loop: browse the Taste /
 * Do pools, tap "＋ Plan", pick a day — and the place lands inside that day's
 * hour-by-hour timeline (sorted by time) or, for legacy days without a
 * timeline, on the activities list. Same `onUpdateResults` plumbing as every
 * other edit, so it persists and re-stitches automatically.
 */

import type { ItineraryDay, TimelineEvent, TimelineEventType } from '../types';

export interface NewStop {
  title: string;
  location?: string;
  type: TimelineEventType;
  /** HH:MM, 24h. Callers pick a sensible default (19:00 dinner, 14:00 activity). */
  time: string;
  duration_min: number;
  tip?: string;
}

export function addStopToDay(
  itinerary: ItineraryDay[],
  dayNum: number,
  stop: NewStop,
): ItineraryDay[] {
  return itinerary.map((d) => {
    if (d.day !== dayNum) return d;
    if (d.timeline && d.timeline.length > 0) {
      const ev: TimelineEvent = {
        time: stop.time,
        duration_min: stop.duration_min,
        title: stop.title,
        location: stop.location,
        type: stop.type,
        tip: stop.tip,
      };
      // Keep the timeline chronologically sorted — HH:MM compares lexically.
      const timeline = [...d.timeline, ev].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      return { ...d, timeline };
    }
    // No timeline on this day — fall back to the bullet list.
    const line = stop.location && !stop.title.includes(stop.location)
      ? `${stop.title} — ${stop.location}`
      : stop.title;
    return { ...d, activities: [...(d.activities || []), line] };
  });
}

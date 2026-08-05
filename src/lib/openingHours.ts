/**
 * Opening-hours parsing and scheduling checks.
 *
 * Google Places returns `regularOpeningHours.weekdayDescriptions` as human text,
 * Monday-first:
 *   ["Monday: 9:00 AM – 5:00 PM", …, "Sunday: Closed"]
 *
 * Roughly half of AI-generated itineraries schedule a visit outside the venue's
 * opening hours, so this turns that text into something we can actually check a
 * planned stop against.
 *
 * Kept as pure functions with no network and no React so the awkward parts —
 * split service hours, past-midnight closing, assorted dash characters — are
 * verifiable in isolation.
 */

/** Minutes from midnight, or null if unparseable. */
export function parseClock(raw: string): number | null {
  // Normalise the various spaces Google emits (thin/narrow-nbsp/nbsp).
  const s = raw.replace(/[\u2009\u202F\u00A0\s]/g, ' ').trim().toLowerCase();
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const mer = m[3];
  if (!Number.isFinite(h) || !Number.isFinite(min) || h > 23 || min > 59) return null;
  if (mer === 'am') { if (h === 12) h = 0; }
  else if (mer === 'pm') { if (h !== 12) h += 12; }
  return h * 60 + min;
}

export interface HoursRange {
  /** Minutes from midnight. `end` may exceed 1440 when the venue closes after midnight. */
  start: number;
  end: number;
}

export type DayHours =
  | { kind: 'closed' }
  | { kind: 'open24' }
  | { kind: 'ranges'; ranges: HoursRange[] }
  | { kind: 'unknown' };

/** Parse one weekdayDescriptions entry ("Monday: 9:00 AM – 5:00 PM"). */
export function parseDayHours(line: string | undefined): DayHours {
  if (!line || typeof line !== 'string') return { kind: 'unknown' };
  // Drop the leading weekday label; times may themselves contain ": ".
  const colon = line.indexOf(':');
  const body = (colon >= 0 ? line.slice(colon + 1) : line)
    .replace(/[\u2009\u202F\u00A0\s]/g, ' ')
    .trim();
  if (!body) return { kind: 'unknown' };

  const lower = body.toLowerCase();
  if (lower === 'closed') return { kind: 'closed' };
  if (lower.includes('24 hours')) return { kind: 'open24' };

  const ranges: HoursRange[] = [];
  // Split service periods: "11:00 AM – 2:00 PM, 5:00 – 9:00 PM"
  for (const part of body.split(',')) {
    // Any dash variant: hyphen, en, em, minus.
    const bits = part.split(/\s*[–—\-−]\s*/);
    if (bits.length !== 2) continue;
    const end = parseClock(bits[1]);
    // "5:00 – 9:00 PM": when a range shares a meridiem Google writes it once, on
    // the closing time — so the opening time inherits it. This has to key off the
    // ABSENCE of a meridiem, not a parse failure: "5:00" parses happily as 05:00
    // (24h), which would silently turn evening service into a dawn slot.
    const startHasMer = /(am|pm)/i.test(bits[0]);
    const endMer = bits[1].toLowerCase().match(/(am|pm)/)?.[1];
    let start = (!startHasMer && endMer)
      ? parseClock(`${bits[0].trim()} ${endMer}`)
      : parseClock(bits[0]);
    if (start == null) start = parseClock(bits[0]);
    if (start == null || end == null) continue;
    // Closing after midnight ("5:00 PM – 2:00 AM") — carry into the next day.
    ranges.push({ start, end: end <= start ? end + 1440 : end });
  }
  return ranges.length > 0 ? { kind: 'ranges', ranges } : { kind: 'unknown' };
}

/** weekdayDescriptions is Monday-first; Date.getDay() is Sunday-first. */
export function weekdayIndexForDate(dateISO: string): number | null {
  const parts = dateISO?.split('-');
  if (!parts || parts.length !== 3) return null;
  const [y, m, d] = parts.map((p) => parseInt(p, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  const dt = new Date(y, m - 1, d);
  if (isNaN(dt.getTime())) return null;
  return (dt.getDay() + 6) % 7;
}

export type StopVerdict = 'ok' | 'closed-that-day' | 'outside-hours' | 'unknown';

/**
 * Is a stop at `timeHHMM` on `dateISO` within opening hours?
 *
 * `unknown` whenever we can't say confidently — the point is to flag real
 * problems, never to invent them from text we failed to parse.
 */
export function checkStopAgainstHours(
  weekdayDescriptions: string[] | undefined,
  dateISO: string,
  timeHHMM: string,
  durationMin = 0,
): StopVerdict {
  if (!Array.isArray(weekdayDescriptions) || weekdayDescriptions.length < 7) return 'unknown';
  const idx = weekdayIndexForDate(dateISO);
  if (idx == null) return 'unknown';
  const start = parseClock(timeHHMM);
  if (start == null) return 'unknown';

  const today = parseDayHours(weekdayDescriptions[idx]);
  if (today.kind === 'open24') return 'ok';
  if (today.kind === 'unknown') return 'unknown';
  if (today.kind === 'closed') {
    // A venue that shut at 2am today may still be open from last night's range.
    const prev = parseDayHours(weekdayDescriptions[(idx + 6) % 7]);
    if (prev.kind === 'ranges' && prev.ranges.some((r) => r.end > 1440 && start + 1440 < r.end)) return 'ok';
    return 'closed-that-day';
  }

  // Require the arrival to be inside a range; ignore the end of a long visit
  // overrunning closing time, which is a softer signal and noisier to flag.
  const arrivalOk = today.ranges.some((r) => start >= r.start && start < r.end);
  if (arrivalOk) return 'ok';
  // Also allow an overnight range carried from the previous day.
  const prev = parseDayHours(weekdayDescriptions[(idx + 6) % 7]);
  if (prev.kind === 'ranges' && prev.ranges.some((r) => r.end > 1440 && start + 1440 < r.end)) return 'ok';
  void durationMin;
  return 'outside-hours';
}

/** "9:00 AM – 5:00 PM" for the given date, for display. Null if unknown. */
export function hoursTextForDate(
  weekdayDescriptions: string[] | undefined,
  dateISO: string,
): string | null {
  if (!Array.isArray(weekdayDescriptions) || weekdayDescriptions.length < 7) return null;
  const idx = weekdayIndexForDate(dateISO);
  if (idx == null) return null;
  const line = weekdayDescriptions[idx];
  if (typeof line !== 'string') return null;
  const colon = line.indexOf(':');
  return (colon >= 0 ? line.slice(colon + 1) : line).trim() || null;
}

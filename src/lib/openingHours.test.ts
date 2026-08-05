/**
 * Tests for openingHours.ts — run with:  npx tsx src/lib/openingHours.test.ts
 *
 * The project has no test framework, and adding one for a single module isn't
 * worth the dependency — this is a plain assertion script that exits non-zero on
 * failure, so CI can call it directly if that ever matters.
 *
 * It exists because this parsing is genuinely fiddly and already caught one real
 * bug: "5:00 – 9:00 PM" was being read as 5 AM, because "5:00" parses fine as a
 * 24-hour time so the meridiem-inheritance branch never ran. Evening restaurant
 * service silently became a dawn slot.
 *
 * Excluded from tsconfig.app.json (it uses Node's `process`, not the DOM).
 */
import { parseClock, parseDayHours, checkStopAgainstHours, weekdayIndexForDate } from './openingHours';

let pass = 0, fail = 0;
const eq = (name: string, got: unknown, want: unknown) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; } else { fail++; console.log(`FAIL ${name}\n  got:  ${g}\n  want: ${w}`); }
};

// --- parseClock ---
eq('9:00 AM', parseClock('9:00 AM'), 540);
eq('12:00 AM (midnight)', parseClock('12:00 AM'), 0);
eq('12:00 PM (noon)', parseClock('12:00 PM'), 720);
eq('5:30 PM', parseClock('5:30 PM'), 1050);
eq('24h "17:30"', parseClock('17:30'), 1050);
eq('bare "9 AM"', parseClock('9 AM'), 540);
eq('garbage', parseClock('whenever'), null);

// --- parseDayHours ---
eq('closed', parseDayHours('Sunday: Closed'), { kind: 'closed' });
eq('open 24', parseDayHours('Monday: Open 24 hours'), { kind: 'open24' });
eq('simple en-dash', parseDayHours('Monday: 9:00 AM – 5:00 PM'), { kind:'ranges', ranges:[{start:540,end:1020}] });
eq('hyphen', parseDayHours('Monday: 9:00 AM - 5:00 PM'), { kind:'ranges', ranges:[{start:540,end:1020}] });
// Restaurants: split service, second range's opening inherits the closing meridiem
eq('split service', parseDayHours('Tuesday: 11:00 AM – 2:00 PM, 5:00 – 9:00 PM'),
   { kind:'ranges', ranges:[{start:660,end:840},{start:1020,end:1260}] });
// Bar closing after midnight → end carries past 1440
eq('overnight', parseDayHours('Friday: 5:00 PM – 2:00 AM'), { kind:'ranges', ranges:[{start:1020,end:1560}] });
eq('missing', parseDayHours(undefined), { kind: 'unknown' });

// --- weekday remap (Google is Monday-first, getDay() Sunday-first) ---
eq('2026-09-01 is a Tuesday -> idx 1', weekdayIndexForDate('2026-09-01'), 1);
eq('2026-09-06 is a Sunday -> idx 6', weekdayIndexForDate('2026-09-06'), 6);

// --- checkStopAgainstHours ---
const week = [
  'Monday: 9:00 AM – 5:00 PM','Tuesday: 9:00 AM – 5:00 PM','Wednesday: 9:00 AM – 5:00 PM',
  'Thursday: 9:00 AM – 5:00 PM','Friday: 5:00 PM – 2:00 AM','Saturday: 10:00 AM – 6:00 PM','Sunday: Closed',
];
eq('Tue 11:00 inside',  checkStopAgainstHours(week,'2026-09-01','11:00'), 'ok');
eq('Tue 08:00 too early', checkStopAgainstHours(week,'2026-09-01','08:00'), 'outside-hours');
eq('Tue 19:00 too late',  checkStopAgainstHours(week,'2026-09-01','19:00'), 'outside-hours');
eq('Sun closed',        checkStopAgainstHours(week,'2026-09-06','11:00'), 'closed-that-day');
// Sat 01:00 — Sunday is "Closed", but Friday's range runs to 2 AM... that's Sat morning.
eq('Sat 01:00 from Fri overnight', checkStopAgainstHours(week,'2026-09-05','01:00'), 'ok');
eq('no data -> unknown', checkStopAgainstHours(undefined,'2026-09-01','11:00'), 'unknown');
eq('bad time -> unknown', checkStopAgainstHours(week,'2026-09-01','nope'), 'unknown');

// --- regressions for the meridiem-inheritance fix ---
eq('24h range keeps 24h', parseDayHours('Monday: 17:30 – 21:00'), { kind:'ranges', ranges:[{start:1050,end:1260}] });
eq('inherit PM at noon', parseDayHours('Monday: 12:00 – 3:00 PM'), { kind:'ranges', ranges:[{start:720,end:900}] });
eq('inherit AM', parseDayHours('Monday: 6:00 – 11:00 AM'), { kind:'ranges', ranges:[{start:360,end:660}] });
eq('both meridiems untouched', parseDayHours('Monday: 11:00 AM – 2:00 PM'), { kind:'ranges', ranges:[{start:660,end:840}] });

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);

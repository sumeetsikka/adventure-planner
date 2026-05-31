/** Convert YYYY-MM-DD to DD/MM/YYYY for Australian display */
export function formatDateAU(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/** Add days to a YYYY-MM-DD string, returns YYYY-MM-DD */
export function addDaysISO(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Get today as YYYY-MM-DD */
export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Parse a YYYY-MM-DD string into a LOCAL Date (avoids the UTC-midnight
 *  off-by-one that `new Date('2026-07-01')` causes in negative-offset zones). */
export function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map((p) => parseInt(p, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  return new Date(y, m - 1, d);
}

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Mon 1 Jul" — friendly day label for the stitched itinerary. */
export function formatDayLabel(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  if (!d) return '';
  return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** "Monday, 1 July 2026" — full date for headers. */
export function formatDateFull(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  if (!d) return '';
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** Just the short weekday — "Mon". */
export function weekdayShort(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return d ? WEEKDAYS_SHORT[d.getDay()] : '';
}

/** True if `date` is within [start, end) — used to find which hotel you sleep
 *  at on a given night (check-in inclusive, check-out exclusive). */
export function isDateInStay(date: string, checkIn: string, checkOut: string): boolean {
  if (!date || !checkIn || !checkOut) return false;
  return date >= checkIn && date < checkOut; // ISO strings compare lexically = chronologically
}

/**
 * Compute an explicit date-per-destination schedule from the user's travel config.
 * This ensures itinerary, flights, and hotels all use the SAME dates.
 */

interface Destination {
  id: string;
  name: string;
  airport: string;
  region: string;
  recommendedDays: [number, number];
}

interface ScheduleEntry {
  destination: string;
  airport: string;
  arrival: string;   // YYYY-MM-DD
  departure: string; // YYYY-MM-DD
  nights: number;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function computeSchedule(
  destinations: Destination[],
  departureDate: string,
  returnDate: string,
): ScheduleEntry[] {
  const totalDays = Math.round(
    (new Date(returnDate).getTime() - new Date(departureDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Reserve day 1 for arrival flight and last day for departure flight
  const availableDays = Math.max(1, totalDays - 2);

  // Calculate proportional days per destination based on midpoint of recommended range
  const midpoints = destinations.map((d) => Math.round((d.recommendedDays[0] + d.recommendedDays[1]) / 2));
  const totalMidpoints = midpoints.reduce((a, b) => a + b, 0);

  // Allocate days proportionally, minimum 1 per destination
  let allocated = midpoints.map((mid) => {
    const proportion = totalMidpoints > 0 ? mid / totalMidpoints : 1 / destinations.length;
    return Math.max(1, Math.round(availableDays * proportion));
  });

  // Adjust to fit exactly within available days
  let sum = allocated.reduce((a, b) => a + b, 0);
  while (sum > availableDays && allocated.length > 0) {
    // Remove from the largest allocation
    const maxIdx = allocated.indexOf(Math.max(...allocated));
    if (allocated[maxIdx] > 1) { allocated[maxIdx]--; sum--; }
    else break;
  }
  while (sum < availableDays && allocated.length > 0) {
    // Add to the first destination
    allocated[0]++;
    sum++;
  }

  // Build the schedule with exact dates
  const schedule: ScheduleEntry[] = [];
  let currentDate = addDays(departureDate, 1); // Day after arrival

  for (let i = 0; i < destinations.length; i++) {
    const nights = allocated[i];
    const arrival = currentDate;
    const departure = addDays(currentDate, nights);

    schedule.push({
      destination: destinations[i].name,
      airport: destinations[i].airport,
      arrival,
      departure,
      nights,
    });

    currentDate = departure;
  }

  return schedule;
}

export function formatScheduleForPrompt(schedule: ScheduleEntry[]): string {
  return schedule.map((s, i) =>
    `${i + 1}. ${s.destination} (${s.airport}): arrive ${s.arrival}, depart ${s.departure}, ${s.nights} nights`
  ).join('\n');
}

/**
 * Post-process: force correct dates onto flight results.
 * The LLM often invents dates. This overrides them with the computed schedule.
 */
export function fixFlightDates(
  flights: any[],
  schedule: ScheduleEntry[],
  departureDate: string,
  returnDate: string,
): any[] {
  if (!flights || flights.length === 0) return flights;

  // First flight: always departureDate
  if (flights[0]) flights[0].date = departureDate;

  // Last flight: always returnDate
  if (flights.length > 1) flights[flights.length - 1].date = returnDate;

  // Middle flights: match to schedule transitions
  if (flights.length > 2 && schedule.length > 1) {
    let schedIdx = 0;
    for (let i = 1; i < flights.length - 1; i++) {
      if (schedIdx < schedule.length) {
        flights[i].date = schedule[schedIdx].departure;
        schedIdx++;
      }
    }
  }

  return flights;
}

/**
 * Post-process: force correct dates onto hotel results.
 * Maps each hotel destination to the matching schedule entry dates.
 */
export function fixHotelDates(
  hotels: any[],
  schedule: ScheduleEntry[],
): any[] {
  if (!hotels || hotels.length === 0) return hotels;

  for (let i = 0; i < hotels.length; i++) {
    // Try matching by name
    const match = schedule.find((s) =>
      hotels[i].destination?.toLowerCase().includes(s.destination.toLowerCase().split('(')[0].split('/')[0].trim()) ||
      s.destination.toLowerCase().includes(hotels[i].destination?.toLowerCase().split('(')[0].split('/')[0].trim())
    );

    if (match) {
      hotels[i].check_in = match.arrival;
      hotels[i].check_out = match.departure;
      hotels[i].nights = match.nights;
    } else if (i < schedule.length) {
      // Fallback: use positional match
      hotels[i].check_in = schedule[i].arrival;
      hotels[i].check_out = schedule[i].departure;
      hotels[i].nights = schedule[i].nights;
    }
  }

  return hotels;
}

export { addDays };

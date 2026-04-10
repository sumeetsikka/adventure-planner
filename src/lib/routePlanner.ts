import type { Destination } from '../types';

/**
 * Country-agnostic route planner.
 * Uses destination airport codes and regions directly instead of hardcoded IDs.
 */

/** Determine the best entry city by finding the most common airport among selected destinations */
export function determineEntryCity(destinations: Destination[]): string {
  if (destinations.length === 0) return 'MEL';

  // Count how many destinations use each airport
  const airportCount: Record<string, number> = {};
  for (const d of destinations) {
    airportCount[d.airport] = (airportCount[d.airport] || 0) + 1;
  }

  // Return the most common airport (the best hub to fly into)
  let bestAirport = destinations[0].airport;
  let bestCount = 0;
  for (const [airport, count] of Object.entries(airportCount)) {
    if (count > bestCount) {
      bestCount = count;
      bestAirport = airport;
    }
  }

  return bestAirport;
}

/** Map of known airport codes to city names */
const AIRPORT_NAMES: Record<string, string> = {
  // Vietnam
  SGN: 'Ho Chi Minh City', HAN: 'Hanoi', DAD: 'Da Nang', CXR: 'Nha Trang',
  DLI: 'Da Lat', PQC: 'Phu Quoc', HUE: 'Hue', UIH: 'Quy Nhon',
  VDH: 'Dong Hoi', VCS: 'Con Dao',
  // Thailand
  BKK: 'Bangkok', CNX: 'Chiang Mai', HKT: 'Phuket', KBV: 'Krabi', USM: 'Koh Samui',
  // Japan
  NRT: 'Tokyo (Narita)', HND: 'Tokyo (Haneda)', KIX: 'Osaka (Kansai)',
  HIJ: 'Hiroshima', CTS: 'Sapporo', OKA: 'Okinawa', NGO: 'Nagoya', FUK: 'Fukuoka',
  // Indonesia
  DPS: 'Bali (Denpasar)', CGK: 'Jakarta', JOG: 'Yogyakarta', LBJ: 'Labuan Bajo',
  LOP: 'Lombok', SOQ: 'Sorong',
  // Philippines
  MNL: 'Manila', CEB: 'Cebu', PPS: 'Puerto Princesa', USU: 'Busuanga',
  // Cambodia
  REP: 'Siem Reap', PNH: 'Phnom Penh',
  // Europe
  FCO: 'Rome', FLR: 'Florence', VCE: 'Venice', MXP: 'Milan', NAP: 'Naples',
  CDG: 'Paris', NCE: 'Nice', LYS: 'Lyon', BOD: 'Bordeaux', MRS: 'Marseille',
  BCN: 'Barcelona', MAD: 'Madrid', SVQ: 'Seville', AGP: 'Malaga',
  LIS: 'Lisbon', OPO: 'Porto', FAO: 'Faro',
  ATH: 'Athens', JTR: 'Santorini', HER: 'Heraklion',
  ZRH: 'Zurich', GVA: 'Geneva',
  BER: 'Berlin', MUC: 'Munich', FRA: 'Frankfurt', HAM: 'Hamburg',
  AMS: 'Amsterdam', BRU: 'Brussels',
  VIE: 'Vienna', SZG: 'Salzburg', INN: 'Innsbruck',
  OSL: 'Oslo', BGO: 'Bergen', TOS: 'Tromso',
  ARN: 'Stockholm', GOT: 'Gothenburg',
  // Australia
  MEL: 'Melbourne', SYD: 'Sydney',
};

export function getEntryCityName(code: string): string {
  return AIRPORT_NAMES[code] || code;
}

export function getRelevantAirports(destinations: Destination[]): string[] {
  const airports = new Set<string>();
  for (const d of destinations) {
    airports.add(d.airport);
  }
  return Array.from(airports);
}

export function calculateMidpointDays(destinations: Destination[]): number {
  return destinations.reduce((sum, d) => {
    const mid = Math.round((d.recommendedDays[0] + d.recommendedDays[1]) / 2);
    return sum + mid;
  }, 0);
}

export function calculateRooms(ages: number[]): { adults: number; children: number; childAges: number[]; rooms: number } {
  const adults = ages.filter((a) => a >= 18).length;
  const childAges = ages.filter((a) => a < 18);
  const rooms = Math.max(1, Math.ceil(Math.max(1, adults) / 2));
  return { adults: Math.max(1, adults), children: childAges.length, childAges, rooms };
}

/** Order destinations geographically by region, grouping same-region destinations together */
export function orderDestinations(destinations: Destination[], _entryCity: string): Destination[] {
  // Group by region, preserving the order regions appear in the destination list
  const regionOrder: string[] = [];
  for (const d of destinations) {
    if (!regionOrder.includes(d.region)) {
      regionOrder.push(d.region);
    }
  }

  return [...destinations].sort((a, b) => {
    return regionOrder.indexOf(a.region) - regionOrder.indexOf(b.region);
  });
}

export function formatDateForApi(dateStr: string): string {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

interface Destination {
  id: string;
  airport: string;
  region: string;
  name: string;
  recommendedDays: [number, number];
}

/** Determine best entry city by most common airport among selected destinations */
export function determineEntryCity(destinations: Destination[]): string {
  if (!destinations || destinations.length === 0) return 'MEL';

  const airportCount: Record<string, number> = {};
  for (const d of destinations) {
    airportCount[d.airport] = (airportCount[d.airport] || 0) + 1;
  }

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

export function getEntryCityName(code: string): string {
  const names: Record<string, string> = {
    SGN: 'Ho Chi Minh City', HAN: 'Hanoi', DAD: 'Da Nang',
    BKK: 'Bangkok', CNX: 'Chiang Mai', HKT: 'Phuket',
    NRT: 'Tokyo', KIX: 'Osaka', CTS: 'Sapporo',
    DPS: 'Bali', CGK: 'Jakarta', JOG: 'Yogyakarta',
    MNL: 'Manila', CEB: 'Cebu', REP: 'Siem Reap', PNH: 'Phnom Penh',
    FCO: 'Rome', CDG: 'Paris', BCN: 'Barcelona', MAD: 'Madrid',
    LIS: 'Lisbon', ATH: 'Athens', ZRH: 'Zurich', GVA: 'Geneva',
    BER: 'Berlin', MUC: 'Munich', AMS: 'Amsterdam', BRU: 'Brussels',
    VIE: 'Vienna', SZG: 'Salzburg', OSL: 'Oslo', BGO: 'Bergen',
    ARN: 'Stockholm', GOT: 'Gothenburg', MEL: 'Melbourne',
  };
  return names[code] || code;
}

export function calculateRooms(ages: number[]): { adults: number; children: number; childAges: number[]; rooms: number } {
  const adults = ages.filter((a) => a >= 18).length;
  const childAges = ages.filter((a) => a < 18);
  const rooms = Math.max(1, Math.ceil(Math.max(1, adults) / 2));
  return { adults: Math.max(1, adults), children: childAges.length, childAges, rooms };
}

export function orderDestinations(destinations: Destination[], _entryCity: string): Destination[] {
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

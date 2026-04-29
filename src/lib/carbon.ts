// Rough CO2e formulas based on common industry estimates (kg CO2e per passenger-km)

export function flightCO2kg(distanceKm: number): number {
  return distanceKm * 0.115;
}

export function trainCO2kg(distanceKm: number): number {
  return distanceKm * 0.041;
}

export function carCO2kg(distanceKm: number): number {
  return distanceKm * 0.171;
}

export function busCO2kg(distanceKm: number): number {
  return distanceKm * 0.027;
}

const ROUTE_DISTANCES: Record<string, number> = {
  'sydney|melbourne': 705,
  'sydney|brisbane': 730,
  'sydney|gold coast': 680,
  'sydney|cairns': 1965,
  'sydney|perth': 3290,
  'sydney|adelaide': 1165,
  'sydney|hobart': 1050,
  'sydney|auckland': 2160,
  'melbourne|brisbane': 1370,
  'melbourne|adelaide': 645,
  'melbourne|perth': 2720,
  'london|paris': 350,
  'london|amsterdam': 360,
  'london|edinburgh': 530,
  'london|dublin': 465,
  'paris|amsterdam': 430,
  'paris|brussels': 260,
  'paris|barcelona': 830,
  'paris|rome': 1100,
  'rome|florence': 230,
  'rome|venice': 395,
  'rome|milan': 475,
  'florence|venice': 205,
  'tokyo|kyoto': 365,
  'tokyo|osaka': 400,
  'tokyo|hiroshima': 675,
  'kyoto|osaka': 40,
  'kyoto|hiroshima': 320,
  'osaka|hiroshima': 280,
  'bangkok|chiang mai': 580,
  'bangkok|phuket': 690,
  'bangkok|krabi': 660,
  'hanoi|ho chi minh': 1170,
  'hanoi|ho chi minh city': 1170,
  'hanoi|halong': 165,
  'hanoi|hoi an': 540,
  'hoi an|ho chi minh': 605,
  'bali|jakarta': 985,
  'bali|lombok': 95,
  'singapore|kuala lumpur': 320,
  'kuala lumpur|penang': 325,
  'new york|boston': 305,
  'new york|washington': 360,
  'los angeles|san francisco': 560,
  'los angeles|las vegas': 370,
};

function normaliseName(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .split(/[/,]/)[0]
    .trim();
}

export function estimateLegDistance(from: string, to: string): number | null {
  const a = normaliseName(from);
  const b = normaliseName(to);
  if (!a || !b) return null;
  if (a === b) return 0;

  const k1 = `${a}|${b}`;
  const k2 = `${b}|${a}`;
  if (ROUTE_DISTANCES[k1] != null) return ROUTE_DISTANCES[k1];
  if (ROUTE_DISTANCES[k2] != null) return ROUTE_DISTANCES[k2];

  // Loose substring matching for variants ("Tokyo (Shibuya)" etc.)
  for (const key of Object.keys(ROUTE_DISTANCES)) {
    const [p, q] = key.split('|');
    if ((a.includes(p) && b.includes(q)) || (a.includes(q) && b.includes(p))) {
      return ROUTE_DISTANCES[key];
    }
  }

  return null;
}

/** Fallback for unknown airport-code pairs only — treat as long-haul international. */
export const LONG_HAUL_FALLBACK_KM = 1500;

export function isAirportCode(code: string): boolean {
  return /^[A-Z]{3}$/.test((code || '').trim());
}

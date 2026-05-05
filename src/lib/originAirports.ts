// Common origin cities for the Holiday Planner.
// IATA codes for the primary international airport in each city.

export interface OriginAirport {
  city: string;
  iata: string;
  country: string;
  flag: string;
  region: 'Oceania' | 'Asia' | 'Europe' | 'Middle East' | 'Americas' | 'Africa';
}

export const ORIGIN_AIRPORTS: OriginAirport[] = [
  // Oceania
  { city: 'Sydney', iata: 'SYD', country: 'AU', flag: '🇦🇺', region: 'Oceania' },
  { city: 'Melbourne', iata: 'MEL', country: 'AU', flag: '🇦🇺', region: 'Oceania' },
  { city: 'Brisbane', iata: 'BNE', country: 'AU', flag: '🇦🇺', region: 'Oceania' },
  { city: 'Perth', iata: 'PER', country: 'AU', flag: '🇦🇺', region: 'Oceania' },
  { city: 'Auckland', iata: 'AKL', country: 'NZ', flag: '🇳🇿', region: 'Oceania' },

  // Asia
  { city: 'Singapore', iata: 'SIN', country: 'SG', flag: '🇸🇬', region: 'Asia' },
  { city: 'Hong Kong', iata: 'HKG', country: 'HK', flag: '🇭🇰', region: 'Asia' },
  { city: 'Tokyo', iata: 'NRT', country: 'JP', flag: '🇯🇵', region: 'Asia' },
  { city: 'Seoul', iata: 'ICN', country: 'KR', flag: '🇰🇷', region: 'Asia' },
  { city: 'Bangkok', iata: 'BKK', country: 'TH', flag: '🇹🇭', region: 'Asia' },
  { city: 'Mumbai', iata: 'BOM', country: 'IN', flag: '🇮🇳', region: 'Asia' },
  { city: 'Delhi', iata: 'DEL', country: 'IN', flag: '🇮🇳', region: 'Asia' },

  // Europe
  { city: 'London', iata: 'LHR', country: 'UK', flag: '🇬🇧', region: 'Europe' },
  { city: 'Paris', iata: 'CDG', country: 'FR', flag: '🇫🇷', region: 'Europe' },
  { city: 'Frankfurt', iata: 'FRA', country: 'DE', flag: '🇩🇪', region: 'Europe' },
  { city: 'Amsterdam', iata: 'AMS', country: 'NL', flag: '🇳🇱', region: 'Europe' },
  { city: 'Madrid', iata: 'MAD', country: 'ES', flag: '🇪🇸', region: 'Europe' },
  { city: 'Rome', iata: 'FCO', country: 'IT', flag: '🇮🇹', region: 'Europe' },

  // Middle East
  { city: 'Dubai', iata: 'DXB', country: 'AE', flag: '🇦🇪', region: 'Middle East' },
  { city: 'Doha', iata: 'DOH', country: 'QA', flag: '🇶🇦', region: 'Middle East' },

  // Americas
  { city: 'New York', iata: 'JFK', country: 'US', flag: '🇺🇸', region: 'Americas' },
  { city: 'San Francisco', iata: 'SFO', country: 'US', flag: '🇺🇸', region: 'Americas' },
  { city: 'Los Angeles', iata: 'LAX', country: 'US', flag: '🇺🇸', region: 'Americas' },
  { city: 'Chicago', iata: 'ORD', country: 'US', flag: '🇺🇸', region: 'Americas' },
  { city: 'Toronto', iata: 'YYZ', country: 'CA', flag: '🇨🇦', region: 'Americas' },

  // Africa
  { city: 'Johannesburg', iata: 'JNB', country: 'ZA', flag: '🇿🇦', region: 'Africa' },
];

export const DEFAULT_ORIGIN = 'MEL';

export function findOrigin(iata: string): OriginAirport | undefined {
  return ORIGIN_AIRPORTS.find((a) => a.iata === iata.toUpperCase());
}

export const HOME_CURRENCIES: { code: string; label: string }[] = [
  { code: 'AUD', label: 'Australian Dollar' },
  { code: 'NZD', label: 'New Zealand Dollar' },
  { code: 'USD', label: 'US Dollar' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'EUR', label: 'Euro' },
  { code: 'JPY', label: 'Japanese Yen' },
  { code: 'SGD', label: 'Singapore Dollar' },
  { code: 'HKD', label: 'Hong Kong Dollar' },
  { code: 'CAD', label: 'Canadian Dollar' },
  { code: 'INR', label: 'Indian Rupee' },
  { code: 'AED', label: 'UAE Dirham' },
  { code: 'ZAR', label: 'South African Rand' },
];

export const DEFAULT_HOME_CURRENCY = 'AUD';

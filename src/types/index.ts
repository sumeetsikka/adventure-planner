export interface Country {
  id: string;
  name: string;
  emoji: string;
  colour: string;
  tagline: string;
  origin: string;
  currency: string;
  prebuilt: boolean;
}

export interface Destination {
  id: string;
  name: string;
  emoji: string;
  colour: string;
  airport: string;
  region: string;
  brief: string;
  tags: string[];
  recommendedDays: [number, number];
  isDayTrip?: boolean;
  accessNote?: string;
  mustVisit?: boolean;
}

export type VibeOption = 'adventure' | 'beach' | 'culture' | 'romance' | 'family' | 'backpacker' | 'luxury' | 'photography' | 'wellness' | 'nightlife' | 'foodie' | 'nature' | 'history';

export interface TravelConfig {
  country: Country;
  destinations: Destination[];
  departureDate: string;
  returnDate: string;
  travellers: number;
  ages: number[];
  vibes: VibeOption[];
}

export interface FlightLeg {
  leg: string;
  from_code: string;
  to_code: string;
  type: string;
  date: string;
  airlines: string[];
  price_estimate_aud: string;
  duration: string;
  stops: string;
  tip: string;
  booking_sites: string[];
}

export interface HotelRec {
  name: string;
  stars: number;
  style: string;
  area: string;
  price_per_night_aud: string;
  highlights: string[];
  recommended?: boolean;
  why: string;
  booking_sites: string[];
}

export interface DestinationHotels {
  destination: string;
  check_in: string;
  check_out: string;
  nights: number;
  hotels: HotelRec[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  icon: string;
  vibe: string;
  activities: string[];
}

export interface BudgetItem {
  category: string;
  cost: string;
}

export interface Tip {
  icon: string;
  title: string;
  text: string;
}

// New feature types
export interface PackingItem {
  category: string;
  items: string[];
}

export interface WeatherInfo {
  destination: string;
  month: string;
  temp_high_c: number;
  temp_low_c: number;
  rainfall_mm: number;
  humidity_percent: number;
  description: string;
  what_to_pack: string;
}

export interface VisaInfo {
  country: string;
  visa_required: boolean;
  visa_type: string;
  max_stay: string;
  processing_time: string;
  cost_aud: string;
  documents_needed: string[];
  how_to_apply: string;
  important_notes: string[];
}

export interface CurrencyInfo {
  country: string;
  currency_name: string;
  currency_code: string;
  symbol: string;
  rate_to_aud: number;
  tipping_culture: string;
  cash_vs_card: string;
  atm_tips: string;
  common_costs: { item: string; local_price: string; aud_price: string }[];
}

export interface NearbyPlace {
  destination: string;
  name: string;
  travel_time: string;
  why_visit: string;
  highlight: string;
}

export interface TransportLeg {
  from: string;
  to: string;
  date: string;
  mode: string;
  operator: string;
  duration: string;
  price_estimate_aud: string;
  tip: string;
  booking_sites: string[];
  booking_urls: string[];
}

export interface GenerationResults {
  flights: FlightLeg[];
  hotels: DestinationHotels[];
  itinerary: ItineraryDay[];
  budget: BudgetItem[];
  tips: Tip[];
  packing: PackingItem[];
  weather: WeatherInfo[];
  visa: VisaInfo | null;
  currency: CurrencyInfo | null;
  nearby: NearbyPlace[];
  transport: TransportLeg[];
}

export type AppView = 'country' | 'wizard' | 'loading' | 'results';
export type WizardStep = 1 | 2 | 3;
export type ResultsTab = 'dashboard' | 'itinerary' | 'flights' | 'hotels' | 'transport' | 'bookings' | 'map' | 'budget' | 'tips' | 'packing' | 'weather' | 'visa' | 'currency' | 'nearby' | 'checklist' | 'photos';

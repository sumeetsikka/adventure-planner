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

/** Rich on-demand synopsis for a destination — shown in the "Know more" panel. */
export interface DestinationInfo {
  name: string;
  famous_for: string;            // 1-2 sentence summary of what the place is known for
  things_to_do: string[];        // top 8-10 things to do/see
  food_highlights: string[];     // 3-5 must-try dishes / food experiences
  best_time: string;             // best months / season to visit
  ideal_duration: string;        // e.g. "2-3 days"
  good_to_know: string[];        // 3-5 practical tips / local etiquette / watch-outs
  vibe: string;                  // 1 sentence on the atmosphere
}

export interface TravelConfig {
  country: Country;
  destinations: Destination[];
  departureDate: string;
  returnDate: string;
  travellers: number;
  ages: number[];
  vibes: VibeOption[];
  origin?: string;
  homeCurrency?: string;
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

export type HotelAmenity = 'wifi' | 'breakfast' | 'pool' | 'gym' | 'parking' | 'spa' | 'bar' | 'kitchen' | 'aircon' | 'laundry' | 'pet-friendly' | 'airport-shuttle';
export type HotelBestFor = 'families' | 'couples' | 'solo' | 'business' | 'groups' | 'budget' | 'luxury';

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
  amenities?: HotelAmenity[];
  best_for?: HotelBestFor;
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

export type TipCategory = 'money' | 'safety' | 'etiquette' | 'food' | 'transport' | 'health' | 'general';

export interface Tip {
  icon: string;
  title: string;
  text: string;
  category?: TipCategory;
}

// New feature types
export interface PackingItem {
  category: string;
  items: string[];
}

export interface WeatherDay {
  date: string;          // YYYY-MM-DD
  temp_high_c: number;
  temp_low_c: number;
  rainfall_mm: number;
  description: string;
  sunrise?: string;      // HH:MM
  sunset?: string;       // HH:MM
  uv_index?: number;
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
  forecast?: WeatherDay[];  // daily breakdown — optional, fall back to existing fields
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
  evisa_url?: string;
  passport_validity_required_months: number;
  blank_pages_required?: number;
  exit_fee_aud?: string;
  onward_ticket_required?: boolean;
  embassy?: { city: string; address?: string; phone?: string; email?: string; website?: string };
  emergency_phone?: string;
  vaccinations?: { name: string; recommendation: 'required' | 'recommended' | 'consider' }[];
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

export type DietaryOption = 'vegetarian' | 'vegan' | 'halal' | 'kosher' | 'gluten-free' | 'nut-free';

export interface Restaurant {
  name: string;
  cuisine: string;
  price_tier: '$' | '$$' | '$$$' | '$$$$';
  signature_dish: string;
  neighbourhood: string;
  why: string;
  reservation_link?: string; // OpenTable / Resy / Tabelog / local URL
  dietary_options?: DietaryOption[];
}

export interface DestinationRestaurants {
  destination: string;
  restaurants: Restaurant[];
}

export type ActivityWeather = 'sunny' | 'any' | 'indoor' | 'all-weather';
export type ActivityTimeFit = 'morning' | 'afternoon' | 'evening' | 'full-day';

export interface Activity {
  name: string;
  category: 'culture' | 'nature' | 'adventure' | 'food' | 'wellness' | 'family' | 'nightlife' | 'shopping';
  duration: string;             // e.g. "2 hours", "Half day"
  price_estimate_aud: string;   // "$0", "$30-50", etc.
  difficulty?: 'easy' | 'moderate' | 'hard';
  why: string;
  best_time?: string;            // "Sunrise", "Evening", "Year-round"
  booking_link?: string;         // Klook / Viator / GetYourGuide / official site
  weather?: ActivityWeather;     // requirement: 'sunny' | 'any' | 'indoor' | 'all-weather'
  fits?: ActivityTimeFit[];      // time-of-day suitability
}

export interface DestinationActivities {
  destination: string;
  activities: Activity[];
}

export type NearbyCategory = 'beach' | 'nature' | 'culture' | 'adventure' | 'food' | 'town' | 'landmark';

export interface NearbyPlace {
  destination: string;
  name: string;
  travel_time: string;
  why_visit: string;
  highlight: string;
  category?: NearbyCategory;
  trip_length?: 'half-day' | 'full-day';
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
  restaurants: DestinationRestaurants[];
  activities: DestinationActivities[];
}

export type AppView = 'mytrips' | 'inspire' | 'wishlist' | 'country' | 'wizard' | 'loading' | 'results';
export type WizardStep = 1 | 2 | 3;
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ResultsTab = 'dashboard' | 'itinerary' | 'flights' | 'hotels' | 'transport' | 'bookings' | 'map' | 'budget' | 'tips' | 'packing' | 'weather' | 'visa' | 'currency' | 'nearby' | 'checklist' | 'photos' | 'chat' | 'events' | 'journal' | 'taste' | 'do';

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

/** Per-traveller profile — drives age-appropriate, accessible, dietary-aware
 *  recommendations. Each field is optional; the bare minimum is `age`. */
export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'halal'
  | 'kosher'
  | 'gluten-free'
  | 'dairy-free'
  | 'pescatarian'
  | 'nut-allergy'
  | 'shellfish-allergy';

export type MobilityTag =
  | 'wheelchair'
  | 'limited-walking'
  | 'no-stairs'
  | 'stroller'
  | 'vision-impaired'
  | 'hearing-impaired';

export type InterestTag =
  | 'food'
  | 'culture'
  | 'nature'
  | 'history'
  | 'shopping'
  | 'nightlife'
  | 'sports'
  | 'art'
  | 'family-fun'
  | 'wellness'
  | 'photography'
  | 'live-music';

export interface TravellerProfile {
  age: number;
  name?: string;
  dietary?: DietaryTag[];
  mobility?: MobilityTag[];
  interests?: InterestTag[];
}

/** Trip-shape mode. Reshapes the whole experience (pace, content, surfacing).
 *  Auto-derived from traveller profiles (kid → family, 65+ → senior, wheelchair
 *  → accessibility) but the user can override. */
export type TripMode = 'standard' | 'family' | 'senior' | 'accessibility';

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
  /** Optional target budget per person for the WHOLE trip, in AUD.
   *  When set, generation aims to keep the trip total within ±20% of
   *  (budgetPerPerson × travellers). Undefined/0 = no budget target. */
  budgetPerPerson?: number;
  /** Optional per-traveller profiles. When present, length matches ages[].
   *  Drives personalised generation — kid-friendly content, accessibility,
   *  dietary preferences, interest matching. */
  travellerProfiles?: TravellerProfile[];
  /** Optional trip-mode override. When undefined, the API auto-derives from
   *  traveller profiles. Set explicitly to force a specific experience. */
  tripMode?: TripMode;
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

/** A single time-slotted event within a day. */
export type TimelineEventType =
  | 'travel'      // flight / train / drive
  | 'meal'        // breakfast / lunch / dinner / coffee
  | 'sight'       // landmark / museum / temple
  | 'activity'    // tour / experience
  | 'rest'        // hotel / siesta / chill
  | 'shop'        // market / souvenirs
  | 'nightlife';

export interface TimelineEvent {
  /** HH:MM in 24h local time. */
  time: string;
  duration_min: number;
  title: string;
  location?: string;
  type: TimelineEventType;
  /** Optional short tip — opening hours, queue tip, kid-friendly note, etc. */
  tip?: string;
  /** Walk/transit estimate from the PREVIOUS event, in minutes. */
  travel_from_prev_min?: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  icon: string;
  vibe: string;
  /** Day-level activity list — kept for backward compatibility and as a
   *  high-level summary for the LLM/UI when no timeline is present. */
  activities: string[];
  /** Optional hour-by-hour timeline. When present, the UI renders this instead
   *  of the bare activities list. */
  timeline?: TimelineEvent[];
  /** Optional indoor / weather-backup plan for outdoor-heavy days. */
  rainy_backup?: string;
  /** Optional kid-friendly tip for family-mode trips. */
  kids_tip?: string;
  /** Optional accessibility note — steps, mobility considerations. */
  accessibility_note?: string;
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

/** A plan-editing intent the chat concierge can return. The LLM only
 *  CLASSIFIES intent; the client applies the change deterministically through
 *  the same onUpdate plumbing the Hotels/Do/Taste tabs use — the model never
 *  mutates the saved trip directly. `kind: 'none'` = a normal Q&A answer. */
export type ChatAction =
  | { kind: 'none' }
  | { kind: 'remove_activity'; destination: string; name: string }
  | { kind: 'remove_restaurant'; destination: string; name: string }
  | { kind: 'more_activities'; destination: string }
  | { kind: 'more_restaurants'; destination: string }
  | { kind: 'more_hotels'; destination: string }
  | { kind: 'pick_hotel'; destination: string; name: string };

export interface ChatResponse {
  answer: string;
  action?: ChatAction;
}

export type ResultsTab = 'dashboard' | 'itinerary' | 'flights' | 'hotels' | 'transport' | 'bookings' | 'map' | 'budget' | 'tips' | 'packing' | 'weather' | 'visa' | 'currency' | 'nearby' | 'checklist' | 'photos' | 'chat' | 'events' | 'journal' | 'taste' | 'do' | 'prepare' | 'wallet';

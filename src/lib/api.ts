import type { Country, TravelConfig, Destination, FlightLeg, DestinationHotels, HotelRec, ItineraryDay, BudgetItem, Tip, PackingItem, WeatherInfo, VisaInfo, CurrencyInfo, NearbyPlace, TransportLeg, DestinationRestaurants, Restaurant, DestinationActivities, Activity, DestinationInfo } from '../types';

async function postApi<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Server error (${res.status})` }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export async function generateDestinations(country: Country): Promise<Destination[]> {
  return postApi<Destination[]>('/api/destinations', { country });
}

export async function searchFlights(config: TravelConfig): Promise<FlightLeg[]> {
  return postApi<FlightLeg[]>('/api/flights', config);
}

export async function searchHotels(config: TravelConfig): Promise<DestinationHotels[]> {
  return postApi<DestinationHotels[]>('/api/hotels', config);
}

/** Fetch fresh alternative hotels for a single destination + stay window.
 *  Returns a flat list of HotelRec to merge into that destination's options. */
export async function generateHotelAlternatives(
  config: TravelConfig,
  opts: { destination: string; check_in: string; check_out: string; nights: number; exclude: string[] },
): Promise<HotelRec[]> {
  return postApi<HotelRec[]>('/api/hotelAlternatives', { ...config, ...opts });
}

export async function generateItinerary(config: TravelConfig): Promise<ItineraryDay[]> {
  return postApi<ItineraryDay[]>('/api/itinerary', config);
}

export async function generateBudget(config: TravelConfig): Promise<BudgetItem[]> {
  return postApi<BudgetItem[]>('/api/budget', config);
}

export async function generateTips(config: TravelConfig): Promise<Tip[]> {
  return postApi<Tip[]>('/api/tips', config);
}

export async function generatePacking(config: TravelConfig): Promise<PackingItem[]> {
  return postApi<PackingItem[]>('/api/packing', config);
}

export async function generateWeather(config: TravelConfig): Promise<WeatherInfo[]> {
  return postApi<WeatherInfo[]>('/api/weather', config);
}

export async function generateVisa(config: TravelConfig): Promise<VisaInfo> {
  return postApi<VisaInfo>('/api/visa', config);
}

export async function generateCurrency(config: TravelConfig): Promise<CurrencyInfo> {
  return postApi<CurrencyInfo>('/api/currency', config);
}

export async function generateNearby(config: TravelConfig): Promise<NearbyPlace[]> {
  return postApi<NearbyPlace[]>('/api/nearby', config);
}


export async function generateTransport(config: TravelConfig): Promise<TransportLeg[]> {
  return postApi<TransportLeg[]>('/api/transport', config);
}

export async function generateRestaurants(config: TravelConfig): Promise<DestinationRestaurants[]> {
  return postApi<DestinationRestaurants[]>('/api/restaurants', config);
}

/** Fresh alternative restaurants for a single destination.
 *  Returns a flat list of Restaurant to merge into that destination's options. */
export async function generateRestaurantAlternatives(
  config: TravelConfig,
  opts: { destination: string; exclude: string[] },
): Promise<Restaurant[]> {
  return postApi<Restaurant[]>('/api/restaurantAlternatives', { ...config, ...opts });
}

export async function generateActivities(config: TravelConfig): Promise<DestinationActivities[]> {
  return postApi<DestinationActivities[]>('/api/activities', config);
}

/** Fresh alternative activities for a single destination.
 *  Returns a flat list of Activity to merge into that destination's options. */
export async function generateActivityAlternatives(
  config: TravelConfig,
  opts: { destination: string; exclude: string[] },
): Promise<Activity[]> {
  return postApi<Activity[]>('/api/activityAlternatives', { ...config, ...opts });
}

export async function getDestinationInfo(name: string, country: string): Promise<DestinationInfo> {
  return postApi<DestinationInfo>('/api/destinationInfo', { name, country });
}

export interface ParsedBookingFlight {
  airline?: string;
  flightNumber?: string;
  from?: string;
  to?: string;
  departureDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  pnr?: string;
}

export interface ParsedBookingHotel {
  name?: string;
  address?: string;
  checkIn?: string;
  checkOut?: string;
  confirmationNumber?: string;
  totalAud?: string;
}

export interface ParsedBookingActivity {
  name?: string;
  date?: string;
  time?: string;
  venue?: string;
  confirmationNumber?: string;
}

export interface ParsedBooking {
  type: 'flight' | 'hotel' | 'activity' | 'transport' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  flight: ParsedBookingFlight | null;
  hotel: ParsedBookingHotel | null;
  activity: ParsedBookingActivity | null;
}

export async function parseBookingEmail(text: string): Promise<ParsedBooking> {
  return postApi<ParsedBooking>('/api/parseBooking', { text });
}

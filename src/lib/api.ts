import type { Country, TravelConfig, Destination, FlightLeg, DestinationHotels, ItineraryDay, BudgetItem, Tip, PackingItem, WeatherInfo, VisaInfo, CurrencyInfo, NearbyPlace, TransportLeg } from '../types';

async function postApi<T>(endpoint: string, body: any): Promise<T> {
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

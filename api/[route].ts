import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, ITINERARY_SYSTEM, FLIGHTS_SYSTEM, HOTELS_SYSTEM, BUDGET_SYSTEM, TIPS_SYSTEM, PACKING_SYSTEM, VISA_SYSTEM, CURRENCY_SYSTEM, NEARBY_SYSTEM, determineEntryCity, getEntryCityName, orderDestinations, computeSchedule, formatScheduleForPrompt, fixFlightDates, fixHotelDates } from './_shared.js';

// ═══════════════════════════════════════
// Catch-all API handler (single function, routes by path)
// ═══════════════════════════════════════

/** IATA → city resolution for Australian origin airports. Lets the prompts
 *  say "Fly from Sydney" rather than always "Fly from Melbourne". */
const ORIGIN_CITY_BY_IATA: Record<string, string> = {
  MEL: 'Melbourne', SYD: 'Sydney', BNE: 'Brisbane', PER: 'Perth',
  ADL: 'Adelaide', OOL: 'Gold Coast', CBR: 'Canberra', HBA: 'Hobart',
  CNS: 'Cairns', DRW: 'Darwin', AKL: 'Auckland', SIN: 'Singapore',
  HKG: 'Hong Kong', NRT: 'Tokyo', LHR: 'London', LAX: 'Los Angeles',
};

function originCode(config: any): string {
  const code = (config?.origin || 'MEL').toString().toUpperCase();
  return code;
}

function originCity(config: any): string {
  const code = originCode(config);
  return ORIGIN_CITY_BY_IATA[code] || code; // fall back to the IATA code if unknown
}

/** Defensive coercion — the handlers happily assume `destinations`/`ages` are
 *  arrays. If the client ever sends a malformed payload these would throw a
 *  500. Coerce to safe defaults so the worst case is a degraded result, not a
 *  crash. */
function safeConfig(c: any) {
  if (!c || typeof c !== 'object') return c;
  return {
    ...c,
    destinations: Array.isArray(c.destinations) ? c.destinations : [],
    ages: Array.isArray(c.ages) ? c.ages : [],
    travellers: Number(c.travellers) > 0 ? Number(c.travellers) : 1,
    vibes: Array.isArray(c.vibes) ? c.vibes : [],
  };
}

/** Trip length (same nights-based value the prompts have always used), but
 *  NaN-safe: missing/unparseable dates yield 1 instead of `Day NaN` / `Days 2
 *  to NaN` garbage in the generated prompt. */
function tripDays(config: { departureDate?: string; returnDate?: string } | null | undefined): number {
  const dep = Date.parse(config?.departureDate);
  const ret = Date.parse(config?.returnDate);
  if (!Number.isFinite(dep) || !Number.isFinite(ret)) return 1;
  return Math.max(1, Math.round((ret - dep) / (1000 * 60 * 60 * 24)));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const route = req.query.route as string;
  const config = safeConfig(req.body);

  try {
    switch (route) {
      case 'itinerary': return res.json(await handleItinerary(config));
      case 'regenerateDay': return res.json(await handleRegenerateDay(config));
      case 'flights': return res.json(await handleFlights(config));
      case 'hotels': return res.json(await handleHotels(config));
      case 'hotelAlternatives': return res.json(await handleHotelAlternatives(config));
      case 'budget': return res.json(await handleBudget(config));
      case 'tips': return res.json(await handleTips(config));
      case 'packing': return res.json(await handlePacking(config));
      case 'weather': return res.json(await handleWeather(config));
      case 'visa': return res.json(await handleVisa(config));
      case 'currency': return res.json(await handleCurrency(config));
      case 'nearby': return res.json(await handleNearby(config));
      case 'transport': return res.json(await handleTransport(config));
      case 'destinations': return res.json(await handleDestinations(config));
      case 'chat': return res.json(await handleChat(config));
      case 'chatAction': return res.json(await handleChatAction(config));
      case 'restaurants': return res.json(await handleRestaurants(config));
      case 'restaurantAlternatives': return res.json(await handleRestaurantAlternatives(config));
      case 'activities': return res.json(await handleActivities(config));
      case 'activityAlternatives': return res.json(await handleActivityAlternatives(config));
      case 'parseBooking': return res.json(await handleParseBooking(req.body));
      case 'destinationInfo': return res.json(await handleDestinationInfo(req.body));
      case 'placeDetails': return res.json(await handlePlaceDetails(req.body));
      default: return res.status(404).json({ error: `Unknown route: ${route}` });
    }
  } catch (err: any) {
    // Log full error server-side, but don't leak provider/internal details to
    // the client (API keys, stack traces, upstream response bodies).
    console.error(`API ${route} error:`, err?.message || err, err?.stack || '');
    res.status(500).json({ error: `Sorry, ${route} failed. Please try again.` });
  }
}

// ═══════════════════════════════════════
// Route Handlers
// ═══════════════════════════════════════

/**
 * Live place details from Google Places API (New) — the real-data layer that
 * turns AI guesses into verified facts (rating, review count, price level,
 * open-now, wheelchair access, a real Maps link).
 *
 * KEY-OPTIONAL BY DESIGN: with no GOOGLE_PLACES_API_KEY (or any failure) this
 * returns { available: false } and the UI silently falls back to its existing
 * "Reviews ↗" search link. The feature lights up the moment the key is set on
 * Vercel — nothing else changes. We never echo the key or upstream errors.
 */
async function handlePlaceDetails(body: any) {
  const query = (body?.query || '').toString().trim();
  if (!query) return { available: false };

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return { available: false, reason: 'no-key' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Field mask keeps the request to the cheap SKU tier + only what we render.
        // NOTE ON COST: field tier sets the price of the WHOLE response, and this
        // call already requests rating/priceLevel/openingHours — all top-tier — so
        // it is billed at that tier regardless. Adding location (Essentials) and
        // photos (Pro) therefore costs nothing extra *here*. Do not copy this mask
        // into a bulk pass over every place in a plan without re-checking SKUs.
        'X-Goog-FieldMask': [
          'places.displayName',
          'places.rating',
          'places.userRatingCount',
          'places.priceLevel',
          'places.currentOpeningHours.openNow',
          'places.regularOpeningHours.weekdayDescriptions',
          'places.googleMapsUri',
          'places.accessibilityOptions.wheelchairAccessibleEntrance',
          'places.location',
          'places.formattedAddress',
          'places.photos',
        ].join(','),
      },
      body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
    });
    clearTimeout(timeout);
    if (!res.ok) return { available: false, reason: 'upstream' };
    const data = await res.json();
    const place = Array.isArray(data?.places) ? data.places[0] : null;
    if (!place) return { available: false, reason: 'no-match' };

    // Map Google's PRICE_LEVEL_* enum to a 1–4 number ($–$$$$).
    const PRICE: Record<string, number> = {
      PRICE_LEVEL_INEXPENSIVE: 1,
      PRICE_LEVEL_MODERATE: 2,
      PRICE_LEVEL_EXPENSIVE: 3,
      PRICE_LEVEL_VERY_EXPENSIVE: 4,
    };

    // Photo resource names need the key to become URLs, so build them server-side —
    // the client never sees GOOGLE_PLACES_API_KEY.
    const photoName = Array.isArray(place.photos) ? place.photos[0]?.name : undefined;
    const photoUrl = photoName
      ? `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${apiKey}`
      : undefined;

    return {
      available: true,
      name: place.displayName?.text,
      rating: typeof place.rating === 'number' ? place.rating : undefined,
      reviews: typeof place.userRatingCount === 'number' ? place.userRatingCount : undefined,
      priceLevel: place.priceLevel ? PRICE[place.priceLevel] : undefined,
      openNow: place.currentOpeningHours?.openNow,
      wheelchair: place.accessibilityOptions?.wheelchairAccessibleEntrance,
      mapsUri: place.googleMapsUri,
      // Verified extras — real coordinates, real hours, a real photo of the place.
      lat: place.location?.latitude,
      lng: place.location?.longitude,
      address: place.formattedAddress,
      hours: place.regularOpeningHours?.weekdayDescriptions,
      photoUrl,
    };
  } catch {
    // Timeouts / network / parse failures all degrade to the link fallback.
    return { available: false, reason: 'error' };
  }
}

function parseResult(result: any): any[] {
  if (Array.isArray(result)) return result;
  if (result && typeof result === 'object') {
    const arr = Object.values(result).find((v) => Array.isArray(v));
    if (arr) return arr as any[];
  }
  return [];
}

/** Auto-derive the trip mode from traveller profiles when not explicitly set.
 *  Priority: any mobility need → accessibility; any kid < 13 → family;
 *  oldest ≥ 65 → senior; otherwise standard. */
function deriveTripMode(config: any): 'standard' | 'family' | 'senior' | 'accessibility' {
  if (config?.tripMode === 'standard' || config?.tripMode === 'family' || config?.tripMode === 'senior' || config?.tripMode === 'accessibility') {
    return config.tripMode;
  }
  const profiles: any[] = Array.isArray(config?.travellerProfiles) ? config.travellerProfiles : [];
  const ages: number[] = Array.isArray(config?.ages) ? config.ages : [];
  const anyMobility = profiles.some(p => Array.isArray(p?.mobility) && p.mobility.length > 0);
  if (anyMobility) return 'accessibility';
  const minAge = ages.length ? Math.min(...ages) : 30;
  const maxAge = ages.length ? Math.max(...ages) : 30;
  if (minAge < 13) return 'family';
  if (maxAge >= 65) return 'senior';
  return 'standard';
}

/** Mode directive — reshapes the LLM's recommendations. */
function modeDirective(config: any): string {
  const mode = deriveTripMode(config);
  switch (mode) {
    case 'family':
      return `\n\nTRIP MODE: FAMILY. Recommendations MUST be family-friendly with children in mind: prefer attractions with low queues and stroller access, family-room hotels, restaurants with kids' menus or relaxed seating. Pace days gently with afternoon rest/pool time. Suggest indoor backups for outdoor-heavy days. Avoid late-night activities. Highlight playgrounds, parks, kid-friendly museums.`;
    case 'senior':
      return `\n\nTRIP MODE: SENIOR. Slow the pace: 2-3 activities per day max, with rest stops. Prioritise sit-down meals over standing-bar food. Prefer attractions with elevators/ramps and short walks. Flag the nearest pharmacy and hospital for each base. Avoid long-haul early flights; allow recovery time after travel days.`;
    case 'accessibility':
      return `\n\nTRIP MODE: ACCESSIBILITY. Every recommendation MUST be step-free or have an alternative step-free route. Prefer hotels with accessible rooms, restaurants with ground-floor entry. Note specifically any unavoidable barriers (cobblestones, narrow alleys, long staircases). Surface accessible transport options (metro elevators, accessible taxis).`;
    default:
      return '';
  }
}

/** Per-traveller profile context — names, dietary, mobility, interests.
 *  Returns '' when no detailed profiles are provided. */
function profilesHint(config: any): string {
  const profiles: any[] = Array.isArray(config?.travellerProfiles) ? config.travellerProfiles : [];
  if (profiles.length === 0) return '';
  const lines: string[] = [];
  for (let i = 0; i < profiles.length; i++) {
    const p = profiles[i] || {};
    const parts: string[] = [];
    parts.push(`#${i + 1}: age ${p.age ?? 'unknown'}`);
    if (p.name) parts.push(`(${p.name})`);
    if (Array.isArray(p.dietary) && p.dietary.length) parts.push(`diet: ${p.dietary.join('/')}`);
    if (Array.isArray(p.mobility) && p.mobility.length) parts.push(`mobility: ${p.mobility.join('/')}`);
    if (Array.isArray(p.interests) && p.interests.length) parts.push(`loves: ${p.interests.join('/')}`);
    lines.push(parts.join(' · '));
  }
  return `\n\nTRAVELLER PROFILES (tailor every recommendation to these people):\n${lines.join('\n')}\nMatch dietary needs in restaurant picks. Respect mobility constraints in routing. Weight activity choices toward stated interests.`;
}

/** Combined personalisation block — profiles + mode together. */
function personalisationHint(config: any): string {
  return modeDirective(config) + profilesHint(config);
}

/**
 * Build a budget-target instruction for the LLM prompt.
 * Returns '' when the traveller set no budget — the prompt is unchanged then.
 */
function budgetHint(config: any): string {
  const pp = Math.round(Number(config?.budgetPerPerson) || 0);
  if (pp <= 0) return '';
  const travellers = Math.max(1, Number(config?.travellers) || 1);
  const total = pp * travellers;
  return `\n\nBUDGET TARGET (important): The traveller's target is about A$${pp.toLocaleString('en-AU')} per person for the WHOLE trip — roughly A$${total.toLocaleString('en-AU')} total for ${travellers} traveller${travellers > 1 ? 's' : ''}. Recommend good-value options that keep the full trip total within ±20% of this target. Do not suggest premium choices that would clearly blow the budget; if the destination genuinely cannot be done for this amount, choose the most affordable realistic options.`;
}

async function handleItinerary(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const vibeList = (config.vibes || ['mix']).join(', ');
  const totalDays = tripDays(config);
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
  const scheduleText = formatScheduleForPrompt(schedule);

  const userMessage = `Country: ${countryName}.\nCRITICAL: Generate EXACTLY ${totalDays} days (Day 1 through Day ${totalDays}).\nDay 1 (${config.departureDate}): Fly from ${originCity(config)} (${originCode(config)}) to ${countryName}.\nDays 2 to ${totalDays - 1}:\n${scheduleText}\nDay ${totalDays} (${config.returnDate}): Fly home to ${originCity(config)}.\nTravellers: ${config.travellers}, ages: ${config.ages.join(', ')}. Vibes: ${vibeList}.${budgetHint(config)}${personalisationHint(config)}`;

  let itinerary = await callLLM(ITINERARY_SYSTEM, userMessage);
  if (!Array.isArray(itinerary)) itinerary = [];
  itinerary = itinerary.map((d: any, i: number) => ({ ...d, day: i + 1 }));
  if (itinerary.length > totalDays) itinerary = itinerary.slice(0, totalDays);
  return itinerary;
}

/**
 * Regenerate a SINGLE itinerary day — used by the per-day "Regenerate" edit.
 * Client sends: day (number), date, location, vibe, and `avoid` (the current
 * day's activity titles, so the new version is genuinely different). Returns
 * one ItineraryDay object with a fresh timeline, keeping day/location/date fixed.
 */
async function handleRegenerateDay(config: any) {
  const countryName = config.country?.name || 'the destination';
  const day = Number(config.day) || 1;
  const location = (config.location || '').toString() || countryName;
  const vibe = (config.vibe || 'culture').toString();
  const avoid: string[] = Array.isArray(config.avoid) ? config.avoid.filter(Boolean) : [];
  const avoidLine = avoid.length
    ? `\nMake it genuinely DIFFERENT — do NOT repeat any of these: ${avoid.join('; ')}.`
    : '';

  const SINGLE_DAY_SYSTEM = `You are a travel expert rewriting ONE day of an itinerary. Return ONLY a single JSON object (not an array) for this one day, in this shape:
{
  "day": <number>,
  "title": "short evocative day title",
  "location": "<the location given>",
  "icon": "single emoji",
  "vibe": "adventure | nature | travel | food | beach | cruise | culture | rest",
  "activities": ["3-4 short summary strings"],
  "timeline": [ { "time": "HH:MM", "duration_min": <number>, "title": "specific thing to do", "location": "venue/area", "type": "travel|meal|sight|activity|rest|shop|nightlife", "tip": "optional short tip", "travel_from_prev_min": <number optional> } ],
  "rainy_backup": "optional one-sentence indoor alternative",
  "kids_tip": "optional one-line family note",
  "accessibility_note": "optional one-line mobility note"
}
Cover ~08:00–22:00 with 5–8 timeline events, named real venues/dishes, realistic walking times. Return ONLY the JSON object.`;

  const userMessage = `Country: ${countryName}. Rewrite Day ${day} in ${location} (vibe: ${vibe}). Keep "day" = ${day} and "location" = "${location}".${avoidLine}${personalisationHint(config)}`;
  const result = await callLLM(SINGLE_DAY_SYSTEM, userMessage);
  // Accept either a bare object or (defensively) the first element of an array.
  const dayObj = Array.isArray(result) ? result[0] : result;
  if (!dayObj || typeof dayObj !== 'object') return null;
  return { ...dayObj, day, location };
}

async function handleFlights(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);

  // No destinations → nothing to fly to. Return empty rather than emitting a
  // malformed prompt that says "Melbourne to undefined (undefined) on ...".
  if (schedule.length === 0) return [];

  const flightLegs: string[] = [];
  flightLegs.push(`Flight 1: ${originCity(config)} (${originCode(config)}) to ${schedule[0]?.destination || getEntryCityName(entryCity)} (${schedule[0]?.airport || entryCity}) on ${config.departureDate}`);
  for (let i = 1; i < schedule.length; i++) {
    if (schedule[i].airport !== schedule[i - 1].airport) {
      flightLegs.push(`Flight ${flightLegs.length + 1}: ${schedule[i - 1].destination} (${schedule[i - 1].airport}) to ${schedule[i].destination} (${schedule[i].airport}) on ${schedule[i].arrival}`);
    }
  }
  const lastDest = schedule[schedule.length - 1];
  flightLegs.push(`Flight ${flightLegs.length + 1}: ${lastDest?.destination} (${lastDest?.airport}) to ${originCity(config)} (${originCode(config)}) on ${config.returnDate}`);

  const userMessage = `Country: ${countryName}. Travellers: ${config.travellers}.\n\nGenerate flight recommendations for these EXACT flights with these EXACT dates:\n${flightLegs.join('\n')}${budgetHint(config)}${personalisationHint(config)}`;
  let flights = parseResult(await callLLM(FLIGHTS_SYSTEM, userMessage));
  flights = fixFlightDates(flights, schedule, config.departureDate, config.returnDate);
  return flights;
}

async function handleHotels(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const vibeList = (config.vibes || ['mix']).join(', ');
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
  const limitedSchedule = schedule.slice(0, 5);
  const hotelSchedule = limitedSchedule.map((s, i) => `${i + 1}. ${s.destination}: check-in ${s.arrival}, check-out ${s.departure}, ${s.nights} nights`).join('\n');

  const userMessage = `Country: ${countryName}. Vibes: ${vibeList}. Travellers: ${config.travellers}, ages: ${config.ages.join(', ')}.\n\nRecommend 3 hotels per destination for these EXACT dates:\n${hotelSchedule}${budgetHint(config)}${personalisationHint(config)}`;
  let hotels = parseResult(await callLLM(HOTELS_SYSTEM, userMessage));
  hotels = fixHotelDates(hotels, limitedSchedule);
  return hotels;
}

/**
 * Fetch fresh hotel options for a SINGLE destination — used by the "More
 * options" editing flow. The client sends the normal config plus:
 *   - destination: the destination name to re-search
 *   - check_in / check_out / nights: the exact stay dates to preserve
 *   - exclude: names already shown (so we don't repeat them)
 * Returns a flat array of HotelRec (not the per-destination wrapper).
 */
async function handleHotelAlternatives(config: any) {
  const countryName = config.country?.name || 'the destination';
  const destination = (config.destination || '').toString();
  if (!destination) return [];
  const vibeList = (config.vibes || ['mix']).join(', ');
  const checkIn = config.check_in || config.departureDate;
  const checkOut = config.check_out || config.returnDate;
  const nights = Number(config.nights) || 1;
  const exclude: string[] = Array.isArray(config.exclude) ? config.exclude.filter(Boolean) : [];
  const excludeLine = exclude.length
    ? `\nDo NOT suggest any of these already-shown hotels: ${exclude.join('; ')}.`
    : '';

  const userMessage = `Country: ${countryName}. Vibes: ${vibeList}. Travellers: ${config.travellers}, ages: ${(config.ages || []).join(', ')}.\n\nRecommend 3 DIFFERENT hotels in ${destination} for these EXACT dates: check-in ${checkIn}, check-out ${checkOut}, ${nights} nights.${excludeLine}${budgetHint(config)}${personalisationHint(config)}`;

  const parsed = parseResult(await callLLM(HOTELS_SYSTEM, userMessage));
  // The hotels prompt returns per-destination objects; flatten to the hotel
  // list and stamp the preserved stay dates onto the wrapper the client merges.
  let hotelList: any[] = [];
  for (const block of parsed) {
    if (Array.isArray(block?.hotels)) hotelList = hotelList.concat(block.hotels);
    else if (block?.name) hotelList.push(block); // already a flat hotel object
  }
  // Drop any that duplicate an excluded name (defensive — LLMs ignore instructions ~5%).
  const seen = new Set(exclude.map((e) => e.toLowerCase().trim()));
  hotelList = hotelList.filter((h) => h?.name && !seen.has(String(h.name).toLowerCase().trim()));
  return hotelList.slice(0, 3);
}

async function handleBudget(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const vibeList = (config.vibes || ['mix']).join(', ');
  const totalDays = tripDays(config);
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
  const scheduleText = formatScheduleForPrompt(schedule);

  const userMessage = `Country: ${countryName}. Trip: ${config.departureDate} to ${config.returnDate} (${totalDays} days). Travellers: ${config.travellers}, ages: ${config.ages.join(', ')}. Vibes: ${vibeList}.\n\nSchedule:\n${scheduleText}\n\nInclude flight costs for ${originCity(config)} to ${schedule[0]?.destination || countryName} and back.${budgetHint(config)}${personalisationHint(config)}`;
  return parseResult(await callLLM(BUDGET_SYSTEM, userMessage));
}

async function handleTips(config: any) {
  const countryName = config.country?.name || 'the destination';
  const destNames = config.destinations.map((d: any) => d.name).join(', ');
  const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });
  const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Travel month: ${travelMonth}. Ages: ${config.ages.join(', ')}.${personalisationHint(config)}`;
  return parseResult(await callLLM(TIPS_SYSTEM, userMessage));
}

async function handlePacking(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });
  const vibeList = (config.vibes || ['mix']).join(', ');
  const totalDays = tripDays(config);
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
  const scheduleText = formatScheduleForPrompt(schedule);

  const userMessage = `Country: ${countryName}. Travel month: ${travelMonth}. Total days: ${totalDays}. Vibes: ${vibeList}.\n\nSchedule:\n${scheduleText}${personalisationHint(config)}`;
  return parseResult(await callLLM(PACKING_SYSTEM, userMessage));
}

async function handleWeather(config: any) {
  const destinations = config.destinations || [];
  const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });

  // Determine which API to use based on how far the dates are
  const departureDate = new Date(config.departureDate);
  const today = new Date();
  const daysAhead = Math.round((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const useForecast = daysAhead >= -1 && daysAhead <= 13; // Forecast works for next ~14 days

  // For future trips, use historical data from the same month one year ago
  let startDate = config.departureDate;
  let endDate = config.returnDate;
  if (!useForecast) {
    const histYear = today.getFullYear() - 1;
    const month = String(departureDate.getMonth() + 1).padStart(2, '0');
    const startDay = String(departureDate.getDate()).padStart(2, '0');
    const returnDate = new Date(config.returnDate);
    const endDay = String(returnDate.getDate()).padStart(2, '0');
    const endMonth = String(returnDate.getMonth() + 1).padStart(2, '0');
    startDate = `${histYear}-${month}-${startDay}`;
    endDate = `${histYear}-${endMonth}-${endDay}`;
  }

  const apiUrl = useForecast
    ? 'https://api.open-meteo.com/v1/forecast'
    : 'https://archive-api.open-meteo.com/v1/archive';

  const results = await Promise.all(
    destinations.map(async (d: any) => {
      const fallback = { destination: d.name, month: travelMonth, temp_high_c: 25, temp_low_c: 18, rainfall_mm: 50, humidity_percent: 65, description: 'Weather data unavailable.', what_to_pack: 'Pack versatile layers.' };
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(d.name.split('(')[0].trim())}&count=1`);
        const geoData = await geoRes.json();
        if (!geoData.results?.length) return fallback;

        const { latitude, longitude } = geoData.results[0];
        // sunrise/sunset/uv_index_max feed WeatherDay — the per-day strip, golden-hour
        // and UV panels were fully built but never rendered because these were never requested.
        const wxRes = await fetch(`${apiUrl}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean,sunrise,sunset,uv_index_max&start_date=${startDate}&end_date=${endDate}&timezone=auto`);
        const wxData = await wxRes.json();
        const daily = wxData.daily || {};
        const clean = (arr: any[]) => (arr || []).filter((v: any) => v !== null && !isNaN(v));
        const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a: number, b: number) => a + b, 0) / arr.length) : 0;
        const highs = clean(daily.temperature_2m_max);
        const lows = clean(daily.temperature_2m_min);
        const precips = clean(daily.precipitation_sum);
        const hums = clean(daily.relative_humidity_2m_mean);

        // If no valid data returned, use fallback
        if (highs.length === 0 && lows.length === 0) return fallback;

        const high = avg(highs);
        const low = avg(lows);
        const rain = Math.round(precips.reduce((a: number, b: number) => a + b, 0));
        const hum = avg(hums);

        const historicalNote = useForecast ? '' : ' Based on last year\'s data for the same dates.';

        // Per-day breakdown. Open-Meteo returns sunrise/sunset as ISO datetimes
        // ("2026-09-01T06:14"); WeatherDay wants bare HH:MM.
        const hhmm = (iso: unknown) =>
          typeof iso === 'string' && iso.includes('T') ? iso.split('T')[1].slice(0, 5) : undefined;
        const describeDay = (dayHigh: number, dayRain: number) =>
          dayRain >= 10 ? 'Wet — plan indoor options.'
          : dayRain >= 2 ? 'Showers possible.'
          : dayHigh > 30 ? 'Hot and clear.'
          : dayHigh > 20 ? 'Warm and pleasant.'
          : dayHigh > 10 ? 'Cool.' : 'Cold.';

        // For trips beyond the ~14-day forecast window we query LAST year's dates,
        // so the returned series is labelled 2025-xx-xx. Re-stamp each entry onto
        // the real trip date (day i = departure + i) — otherwise the strip renders
        // the wrong weekday and can't line up with the itinerary. Sunrise/sunset/UV
        // are astronomical and carry over almost exactly; temp/rain are indicative,
        // which the summary description already discloses.
        const dates: string[] = Array.isArray(daily.time) ? daily.time : [];
        const tripDayISO = (i: number) => {
          const base = Date.parse(`${config.departureDate}T00:00:00`);
          if (!Number.isFinite(base)) return dates[i];
          return new Date(base + i * 86_400_000).toISOString().slice(0, 10);
        };
        const forecast = dates.map((_date: string, i: number) => {
          const date = useForecast ? dates[i] : tripDayISO(i);
          const dHigh = Number(daily.temperature_2m_max?.[i]);
          const dLow = Number(daily.temperature_2m_min?.[i]);
          const dRain = Number(daily.precipitation_sum?.[i]);
          const uv = Number(daily.uv_index_max?.[i]);
          return {
            date,
            temp_high_c: Number.isFinite(dHigh) ? Math.round(dHigh) : high,
            temp_low_c: Number.isFinite(dLow) ? Math.round(dLow) : low,
            rainfall_mm: Number.isFinite(dRain) ? Math.round(dRain) : 0,
            description: describeDay(
              Number.isFinite(dHigh) ? dHigh : high,
              Number.isFinite(dRain) ? dRain : 0,
            ),
            sunrise: hhmm(daily.sunrise?.[i]),
            sunset: hhmm(daily.sunset?.[i]),
            uv_index: Number.isFinite(uv) ? Math.round(uv * 10) / 10 : undefined,
          };
        }).filter((day) => !!day.date);

        return { destination: d.name, month: travelMonth, temp_high_c: high, temp_low_c: low, rainfall_mm: rain, humidity_percent: hum,
          description: (high > 30 ? 'Hot conditions.' : high > 20 ? 'Warm and pleasant.' : high > 10 ? 'Cool, layers needed.' : 'Cold weather.') + historicalNote,
          what_to_pack: high > 28 ? 'Light breathable clothing, sunscreen, hat.' : high > 15 ? 'Light layers, one warm layer for evenings.' : 'Warm layers, jacket.',
          ...(forecast.length > 0 ? { forecast } : {}) };
      } catch { return fallback; }
    })
  );
  return results;
}

async function handleVisa(config: any) {
  const countryName = config.country?.name || 'the destination';
  const userMessage = `Country: ${countryName}. Visa requirements for Australian passport holders.`;
  const result = await callLLM(VISA_SYSTEM, userMessage);
  return Array.isArray(result) ? result[0] : result;
}

async function handleCurrency(config: any) {
  const countryName = config.country?.name || 'the destination';
  let currencyHint = '';
  try {
    const metaRes = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=currencies`);
    if (metaRes.ok) {
      const metaData = await metaRes.json();
      const currencies = metaData[0]?.currencies || {};
      const code = Object.keys(currencies)[0];
      if (code) currencyHint = `The currency is ${currencies[code].name} (${code}, symbol: ${currencies[code].symbol}).`;
    }
  } catch {}
  const userMessage = `Country: ${countryName}. ${currencyHint} Currency information for Australian travellers.`;
  const result = await callLLM(CURRENCY_SYSTEM, userMessage);
  return Array.isArray(result) ? result[0] : result;
}

async function handleNearby(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
  const destNames = schedule.map((s) => `${s.destination} (${s.nights} nights)`).join(', ');
  const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Suggest 2-3 nearby day trips from each destination.${personalisationHint(config)}`;
  return parseResult(await callLLM(NEARBY_SYSTEM, userMessage));
}

const RESTAURANTS_SYSTEM = `You are a food editor for a luxury travel magazine. For each destination, recommend 5 restaurants spanning street-food to fine dining. Return ONLY a valid JSON array of objects, one per destination, in this shape:
[
  {
    "destination": "Hanoi",
    "restaurants": [
      {
        "name": "Restaurant name",
        "cuisine": "Cuisine style (e.g. 'Vietnamese · Pho')",
        "price_tier": "$" | "$$" | "$$$" | "$$$$",
        "signature_dish": "1-3 word dish name",
        "neighbourhood": "neighbourhood/area",
        "why": "1 sentence why this restaurant",
        "reservation_link": "https://... if known (OpenTable/Resy/Tabelog/local), otherwise omit",
        "dietary_options": ["vegetarian" | "vegan" | "halal" | "kosher" | "gluten-free" | "nut-free"]
      }
    ]
  }
]
Rules: REAL restaurants only — do not invent names. Mix price tiers (1 $, 2 $$, 1 $$$, 1 $$$$ ideally). Use proper nouns. Do NOT include placeholder text. If unsure on reservation_link, omit the field entirely.
ALWAYS include "dietary_options" — list every diet the restaurant can genuinely accommodate, using ONLY the exact values above. Use [] if it caters to none. This drives a dietary filter travellers rely on, including for allergies, so be conservative: only claim what the restaurant actually offers.`;

async function handleRestaurants(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const destNames = ordered.map((d: any) => d.name).join(', ');
  const vibes = (config.vibes || []).join(', ');
  const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Traveller vibes: ${vibes || 'general'}. Recommend restaurants per destination, mixing street food, mid-range, and one fine-dining pick each.${personalisationHint(config)}`;
  return parseResult(await callLLM(RESTAURANTS_SYSTEM, userMessage));
}

/**
 * Fresh restaurants for a SINGLE destination — the "More options" editing flow.
 * Client sends config plus `destination` and `exclude` (names already shown).
 * Returns a flat array of Restaurant objects.
 */
async function handleRestaurantAlternatives(config: any) {
  const countryName = config.country?.name || 'the destination';
  const destination = (config.destination || '').toString();
  if (!destination) return [];
  const vibes = (config.vibes || []).join(', ');
  const exclude: string[] = Array.isArray(config.exclude) ? config.exclude.filter(Boolean) : [];
  const excludeLine = exclude.length
    ? `\nDo NOT suggest any of these already-shown restaurants: ${exclude.join('; ')}.`
    : '';
  const userMessage = `Country: ${countryName}. Destination: ${destination}. Traveller vibes: ${vibes || 'general'}.\n\nRecommend 4 DIFFERENT real restaurants in ${destination}, mixing street food, mid-range and one fine-dining pick.${excludeLine}${personalisationHint(config)}`;

  const parsed = parseResult(await callLLM(RESTAURANTS_SYSTEM, userMessage));
  let list: any[] = [];
  for (const block of parsed) {
    if (Array.isArray(block?.restaurants)) list = list.concat(block.restaurants);
    else if (block?.name) list.push(block);
  }
  const seen = new Set(exclude.map((e) => e.toLowerCase().trim()));
  list = list.filter((r) => r?.name && !seen.has(String(r.name).toLowerCase().trim()));
  return list.slice(0, 4);
}

const ACTIVITIES_SYSTEM = `You are a travel editor curating things to do. For each destination, recommend 6 activities ranging from free/walking-tour to paid/full-day. Return ONLY a valid JSON array, one object per destination:
[
  {
    "destination": "Kyoto",
    "activities": [
      {
        "name": "Activity name",
        "category": "culture" | "nature" | "adventure" | "food" | "wellness" | "family" | "nightlife" | "shopping",
        "duration": "2 hours" | "Half day" | "Full day" | "Evening",
        "price_estimate_aud": "$0" | "$30-50" | "$120" | etc,
        "difficulty": "easy" | "moderate" | "hard" (optional, only for adventure/nature),
        "best_time": "Sunrise" | "Morning" | "Afternoon" | "Evening" | "Year-round",
        "why": "1 sentence why this activity",
        "booking_link": "https://... if known (Klook/Viator/GetYourGuide/official site), otherwise omit",
        "weather": "sunny" | "any" | "indoor" | "all-weather",
        "fits": ["morning" | "afternoon" | "evening" | "full-day"]
      }
    ]
  }
]
Rules: REAL activities tied to the destination — temples, hikes, classes, tours, museums. Mix free and paid. Include at least one local/cultural experience and one outdoor/active option per destination. Do NOT invent. Omit booking_link if unsure.
ALWAYS include "weather" and "fits", using ONLY the exact values above. "weather" is what the activity NEEDS: "sunny" for things ruined by rain (beaches, viewpoints, hikes), "indoor" for museums and galleries, "all-weather" for covered venues that work rain or shine, "any" otherwise. "fits" lists every time-of-day the activity genuinely works — these power the traveller's time and weather filters.`;

async function handleActivities(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const destNames = ordered.map((d: any) => d.name).join(', ');
  const vibes = (config.vibes || []).join(', ');
  const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Traveller vibes: ${vibes || 'general'}. Recommend things to do per destination — culture, nature, adventure, family-friendly mix.${personalisationHint(config)}`;
  return parseResult(await callLLM(ACTIVITIES_SYSTEM, userMessage));
}

/**
 * Fresh activities for a SINGLE destination — the "More options" editing flow.
 * Client sends config plus `destination` and `exclude` (names already shown).
 * Returns a flat array of Activity objects.
 */
async function handleActivityAlternatives(config: any) {
  const countryName = config.country?.name || 'the destination';
  const destination = (config.destination || '').toString();
  if (!destination) return [];
  const vibes = (config.vibes || []).join(', ');
  const exclude: string[] = Array.isArray(config.exclude) ? config.exclude.filter(Boolean) : [];
  const excludeLine = exclude.length
    ? `\nDo NOT suggest any of these already-shown activities: ${exclude.join('; ')}.`
    : '';
  const userMessage = `Country: ${countryName}. Destination: ${destination}. Traveller vibes: ${vibes || 'general'}.\n\nRecommend 4 DIFFERENT things to do in ${destination} — a mix of culture, nature, adventure, food and family-friendly.${excludeLine}${personalisationHint(config)}`;

  const parsed = parseResult(await callLLM(ACTIVITIES_SYSTEM, userMessage));
  let list: any[] = [];
  for (const block of parsed) {
    if (Array.isArray(block?.activities)) list = list.concat(block.activities);
    else if (block?.name) list.push(block);
  }
  const seen = new Set(exclude.map((e) => e.toLowerCase().trim()));
  list = list.filter((a) => a?.name && !seen.has(String(a.name).toLowerCase().trim()));
  return list.slice(0, 4);
}

async function handleTransport(config: any) {
  const TRANSPORT_SYSTEM = `You are a transport expert. Generate inter-city transport as a JSON array. Each object: {from, to, date (YYYY-MM-DD), mode, operator, duration, price_estimate_aud, tip, booking_sites[], booking_urls[]}. No flights. Only trains, buses, ferries, cars. Use EXACT dates provided. Return ONLY valid JSON array.`;
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);

  const journeys: string[] = [];
  for (let i = 0; i < schedule.length - 1; i++) {
    if (schedule[i].airport !== schedule[i + 1].airport)
      journeys.push(`${schedule[i].destination} to ${schedule[i + 1].destination} on ${schedule[i].departure}`);
  }
  if (journeys.length === 0) return [];

  const userMessage = `Country: ${countryName}. Travellers: ${config.travellers}.\n\n${journeys.map((j, i) => `${i + 1}. ${j}`).join('\n')}`;
  const transport = parseResult(await callLLM(TRANSPORT_SYSTEM, userMessage));
  let si = 0;
  for (let i = 0; i < transport.length && si < schedule.length - 1; i++) { transport[i].date = schedule[si].departure; si++; }
  return transport;
}

async function handleDestinations(config: any) {
  const DEST_SYSTEM = `Generate 15-20 tourist destinations as JSON array. Each: {id, name, emoji, colour (hex), airport (IATA), region (ALL CAPS), brief (3-5 sentences), tags (4 strings), recommendedDays [min,max], mustVisit (boolean, 5-7 true)}. Return ONLY JSON array.`;
  const country = config.country;
  const userMessage = `Generate tourist destinations for ${country?.name || 'the country'}. Origin: Melbourne, Australia.`;
  return parseResult(await callLLM(DEST_SYSTEM, userMessage));
}

async function handleParseBooking(body: any) {
  const PARSE_BOOKING_SYSTEM = `You are a travel-confirmation parser. Read the email body and extract booking details. Return ONLY a JSON object:
{
  "type": "flight" | "hotel" | "activity" | "transport" | "unknown",
  "confidence": "high" | "medium" | "low",
  "flight": { "airline": string, "flightNumber": string, "from": string, "to": string, "departureDate": "YYYY-MM-DD", "departureTime": string, "arrivalTime": string, "pnr": string } | null,
  "hotel": { "name": string, "address": string, "checkIn": "YYYY-MM-DD", "checkOut": "YYYY-MM-DD", "confirmationNumber": string, "totalAud": string } | null,
  "activity": { "name": string, "date": "YYYY-MM-DD", "time": string, "venue": string, "confirmationNumber": string } | null
}
Use null for fields not found. Be conservative on confidence: "high" only when you're certain.`;

  const text = (body?.text || '').toString().slice(0, 8000);
  if (!text.trim()) {
    return { type: 'unknown', confidence: 'low', flight: null, hotel: null, activity: null };
  }
  const result = await callLLM(PARSE_BOOKING_SYSTEM, `Confirmation email body:\n\n${text}`);
  const parsed = Array.isArray(result) ? result[0] : result;
  return {
    type: parsed?.type || 'unknown',
    confidence: parsed?.confidence || 'low',
    flight: parsed?.flight || null,
    hotel: parsed?.hotel || null,
    activity: parsed?.activity || null,
  };
}

async function handleDestinationInfo(body: any) {
  const DEST_INFO_SYSTEM = `You are a knowledgeable travel writer. Given a destination, return a rich, accurate synopsis as a JSON object:
{
  "name": "destination name",
  "famous_for": "1-2 sentences on what this place is best known for",
  "things_to_do": ["8-10 specific, real things to do or see — named attractions, experiences, neighbourhoods"],
  "food_highlights": ["3-5 must-try dishes or food experiences specific to this place"],
  "best_time": "best months/season to visit and why, 1 sentence",
  "ideal_duration": "recommended length of stay, e.g. '2-3 days'",
  "good_to_know": ["3-5 practical tips — local etiquette, scams to avoid, transport, money, what surprises visitors"],
  "vibe": "1 sentence capturing the atmosphere/character of the place"
}
Be SPECIFIC and accurate — use real attraction names, real dishes. No placeholder text. Return ONLY the JSON object, no markdown.`;

  const name = (body?.name || '').toString().slice(0, 120);
  const country = (body?.country || '').toString().slice(0, 80);
  if (!name.trim()) {
    return { name: '', famous_for: '', things_to_do: [], food_highlights: [], best_time: '', ideal_duration: '', good_to_know: [], vibe: '' };
  }
  const userMessage = `Destination: ${name}${country ? `, ${country}` : ''}. Write the traveller synopsis.`;
  const result = await callLLM(DEST_INFO_SYSTEM, userMessage);
  const parsed = Array.isArray(result) ? result[0] : result;
  return {
    name: parsed?.name || name,
    famous_for: parsed?.famous_for || '',
    things_to_do: Array.isArray(parsed?.things_to_do) ? parsed.things_to_do : [],
    food_highlights: Array.isArray(parsed?.food_highlights) ? parsed.food_highlights : [],
    best_time: parsed?.best_time || '',
    ideal_duration: parsed?.ideal_duration || '',
    good_to_know: Array.isArray(parsed?.good_to_know) ? parsed.good_to_know : [],
    vibe: parsed?.vibe || '',
  };
}

async function handleChat(config: any) {
  const CHAT_SYSTEM = `You are a friendly travel expert helping an Australian traveller. Answer concisely (2-4 sentences). Use Australian English. Return as JSON: {"answer": "your response"}`;
  const { question, country, destinations } = config;
  if (!question) return { answer: 'Please ask a question.' };
  const countryName = country?.name || 'the destination';
  const destNames = (destinations || []).map((d: any) => d.name).join(', ');
  const userMessage = `Country: ${countryName}. Destinations: ${destNames || 'none'}.\n\nQuestion: ${question}`;
  const result = await callLLM(CHAT_SYSTEM, userMessage);
  return { answer: result?.answer || result?.text || (typeof result === 'string' ? result : JSON.stringify(result)) };
}

/**
 * Chat-that-acts: classify the user's message into either a normal Q&A answer
 * or ONE plan-editing action. The model only CLASSIFIES — the client applies
 * the change. We pass a compact inventory so it can resolve fuzzy references
 * ("the museum", "my Hanoi hotel") to exact names that exist in the plan.
 */
async function handleChatAction(config: any) {
  const { question, country } = config;
  if (!question) return { answer: 'Please ask a question.', action: { kind: 'none' } };
  const countryName = country?.name || 'the destination';

  // Inventory the client sends: destinations + the names currently in each list.
  const inv = config.inventory || {};
  const destinations: string[] = Array.isArray(inv.destinations) ? inv.destinations : [];
  const hotels = inv.hotels || {};        // { dest: [names] }
  const activities = inv.activities || {}; // { dest: [names] }
  const restaurants = inv.restaurants || {}; // { dest: [names] }

  const invText = destinations.map((d) => {
    const h = (hotels[d] || []).join(' | ') || '—';
    const a = (activities[d] || []).join(' | ') || '—';
    const r = (restaurants[d] || []).join(' | ') || '—';
    return `Destination "${d}":\n  hotels: ${h}\n  activities: ${a}\n  restaurants: ${r}`;
  }).join('\n');

  const CHAT_ACTION_SYSTEM = `You are a travel concierge that can EDIT a traveller's plan. Read their message and the plan inventory, then decide if they want a plan change or just an answer.

Return ONLY JSON: {"answer": "<short friendly confirmation or answer, Australian English, 1-2 sentences>", "action": <action object>}

The "action" must be EXACTLY ONE of:
- {"kind":"none"} — they asked a question, not an edit. Put the answer in "answer".
- {"kind":"remove_activity","destination":"<exact destination>","name":"<exact activity name from inventory>"}
- {"kind":"remove_restaurant","destination":"<exact destination>","name":"<exact restaurant name from inventory>"}
- {"kind":"more_activities","destination":"<exact destination>"}
- {"kind":"more_restaurants","destination":"<exact destination>"}
- {"kind":"more_hotels","destination":"<exact destination>"}
- {"kind":"pick_hotel","destination":"<exact destination>","name":"<exact hotel name from inventory>"}

CRITICAL rules:
1. "destination" and "name" MUST be copied EXACTLY from the inventory below. If you cannot match the user's reference to a real item, use {"kind":"none"} and explain in "answer".
2. Only ONE action per message. If they ask for multiple edits, do the first and mention the rest in "answer".
3. For removals/picks, "answer" should confirm what you did (e.g. "Done — removed the War Museum from your Hanoi plans.").
4. For "more_*", "answer" should say you're fetching options (e.g. "Finding a few more places to eat in Hanoi…").
5. If it's a normal question, answer it concisely with kind "none".`;

  const userMessage = `Country: ${countryName}.\n\nPLAN INVENTORY:\n${invText || '(empty)'}\n\nTraveller message: ${question}`;
  const result = await callLLM(CHAT_ACTION_SYSTEM, userMessage);

  const answer = result?.answer || (typeof result === 'string' ? result : 'Done.');
  let action = result?.action;
  // Defensive validation — never trust the model's shape blindly.
  const VALID = new Set(['none', 'remove_activity', 'remove_restaurant', 'more_activities', 'more_restaurants', 'more_hotels', 'pick_hotel']);
  if (!action || typeof action !== 'object' || !VALID.has(action.kind)) {
    action = { kind: 'none' };
  }
  return { answer, action };
}

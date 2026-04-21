import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, ITINERARY_SYSTEM, FLIGHTS_SYSTEM, HOTELS_SYSTEM, BUDGET_SYSTEM, TIPS_SYSTEM, PACKING_SYSTEM, VISA_SYSTEM, CURRENCY_SYSTEM, NEARBY_SYSTEM, determineEntryCity, getEntryCityName, orderDestinations, computeSchedule, formatScheduleForPrompt, fixFlightDates, fixHotelDates } from './_shared.js';

// ═══════════════════════════════════════
// Catch-all API handler (single function, routes by path)
// ═══════════════════════════════════════

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const route = req.query.route as string;
  const config = req.body;

  try {
    switch (route) {
      case 'itinerary': return res.json(await handleItinerary(config));
      case 'flights': return res.json(await handleFlights(config));
      case 'hotels': return res.json(await handleHotels(config));
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
      default: return res.status(404).json({ error: `Unknown route: ${route}` });
    }
  } catch (err: any) {
    console.error(`API ${route} error:`, err.message);
    res.status(500).json({ error: err.message || `${route} failed` });
  }
}

// ═══════════════════════════════════════
// Route Handlers
// ═══════════════════════════════════════

function parseResult(result: any): any[] {
  if (Array.isArray(result)) return result;
  if (result && typeof result === 'object') {
    const arr = Object.values(result).find((v) => Array.isArray(v));
    if (arr) return arr as any[];
  }
  return [];
}

async function handleItinerary(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const vibeList = (config.vibes || ['mix']).join(', ');
  const totalDays = Math.round((new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24));
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
  const scheduleText = formatScheduleForPrompt(schedule);

  const userMessage = `Country: ${countryName}.\nCRITICAL: Generate EXACTLY ${totalDays} days (Day 1 through Day ${totalDays}).\nDay 1 (${config.departureDate}): Fly Melbourne to ${countryName}.\nDays 2 to ${totalDays - 1}:\n${scheduleText}\nDay ${totalDays} (${config.returnDate}): Fly home.\nTravellers: ${config.travellers}, ages: ${config.ages.join(', ')}. Vibes: ${vibeList}.`;

  let itinerary = await callLLM(ITINERARY_SYSTEM, userMessage);
  if (!Array.isArray(itinerary)) itinerary = [];
  itinerary = itinerary.map((d: any, i: number) => ({ ...d, day: i + 1 }));
  if (itinerary.length > totalDays) itinerary = itinerary.slice(0, totalDays);
  return itinerary;
}

async function handleFlights(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);

  const flightLegs: string[] = [];
  flightLegs.push(`Flight 1: Melbourne (MEL) to ${schedule[0]?.destination || getEntryCityName(entryCity)} (${schedule[0]?.airport || entryCity}) on ${config.departureDate}`);
  for (let i = 1; i < schedule.length; i++) {
    if (schedule[i].airport !== schedule[i - 1].airport) {
      flightLegs.push(`Flight ${flightLegs.length + 1}: ${schedule[i - 1].destination} (${schedule[i - 1].airport}) to ${schedule[i].destination} (${schedule[i].airport}) on ${schedule[i].arrival}`);
    }
  }
  const lastDest = schedule[schedule.length - 1];
  flightLegs.push(`Flight ${flightLegs.length + 1}: ${lastDest?.destination} (${lastDest?.airport}) to Melbourne (MEL) on ${config.returnDate}`);

  const userMessage = `Country: ${countryName}. Travellers: ${config.travellers}.\n\nGenerate flight recommendations for these EXACT flights with these EXACT dates:\n${flightLegs.join('\n')}`;
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

  const userMessage = `Country: ${countryName}. Vibes: ${vibeList}. Travellers: ${config.travellers}, ages: ${config.ages.join(', ')}.\n\nRecommend 3 hotels per destination for these EXACT dates:\n${hotelSchedule}`;
  let hotels = parseResult(await callLLM(HOTELS_SYSTEM, userMessage));
  hotels = fixHotelDates(hotels, limitedSchedule);
  return hotels;
}

async function handleBudget(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const vibeList = (config.vibes || ['mix']).join(', ');
  const totalDays = Math.round((new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24));
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
  const scheduleText = formatScheduleForPrompt(schedule);

  const userMessage = `Country: ${countryName}. Trip: ${config.departureDate} to ${config.returnDate} (${totalDays} days). Travellers: ${config.travellers}, ages: ${config.ages.join(', ')}. Vibes: ${vibeList}.\n\nSchedule:\n${scheduleText}\n\nInclude flight costs for Melbourne to ${schedule[0]?.destination || countryName} and back.`;
  return parseResult(await callLLM(BUDGET_SYSTEM, userMessage));
}

async function handleTips(config: any) {
  const countryName = config.country?.name || 'the destination';
  const destNames = config.destinations.map((d: any) => d.name).join(', ');
  const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });
  const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Travel month: ${travelMonth}. Ages: ${config.ages.join(', ')}.`;
  return parseResult(await callLLM(TIPS_SYSTEM, userMessage));
}

async function handlePacking(config: any) {
  const countryName = config.country?.name || 'the destination';
  const entryCity = determineEntryCity(config.destinations);
  const ordered = orderDestinations(config.destinations, entryCity);
  const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });
  const vibeList = (config.vibes || ['mix']).join(', ');
  const totalDays = Math.round((new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24));
  const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
  const scheduleText = formatScheduleForPrompt(schedule);

  const userMessage = `Country: ${countryName}. Travel month: ${travelMonth}. Total days: ${totalDays}. Vibes: ${vibeList}.\n\nSchedule:\n${scheduleText}`;
  return parseResult(await callLLM(PACKING_SYSTEM, userMessage));
}

async function handleWeather(config: any) {
  const destinations = config.destinations || [];
  const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });

  const results = await Promise.all(
    destinations.map(async (d: any) => {
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(d.name.split('(')[0].trim())}&count=1`);
        const geoData = await geoRes.json();
        if (!geoData.results?.length) return { destination: d.name, month: travelMonth, temp_high_c: 25, temp_low_c: 18, rainfall_mm: 50, humidity_percent: 65, description: 'Weather data unavailable.', what_to_pack: 'Pack versatile layers.' };

        const { latitude, longitude } = geoData.results[0];
        const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&start_date=${config.departureDate}&end_date=${config.returnDate}&timezone=auto`);
        const wxData = await wxRes.json();
        const daily = wxData.daily || {};
        const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a: number, b: number) => a + b, 0) / arr.length) : 0;
        const high = avg(daily.temperature_2m_max || []);
        const low = avg(daily.temperature_2m_min || []);
        const rain = Math.round((daily.precipitation_sum || []).reduce((a: number, b: number) => a + b, 0));
        const hum = avg(daily.relative_humidity_2m_mean || []);

        return { destination: d.name, month: travelMonth, temp_high_c: high, temp_low_c: low, rainfall_mm: rain, humidity_percent: hum,
          description: high > 30 ? 'Hot conditions.' : high > 20 ? 'Warm and pleasant.' : high > 10 ? 'Cool, layers needed.' : 'Cold weather.',
          what_to_pack: high > 28 ? 'Light breathable clothing, sunscreen, hat.' : high > 15 ? 'Light layers, one warm layer for evenings.' : 'Warm layers, jacket.' };
      } catch { return { destination: d.name, month: travelMonth, temp_high_c: 25, temp_low_c: 18, rainfall_mm: 50, humidity_percent: 65, description: 'Weather data unavailable.', what_to_pack: 'Pack versatile layers.' }; }
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
  const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Suggest 2-3 nearby day trips from each destination.`;
  return parseResult(await callLLM(NEARBY_SYSTEM, userMessage));
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
  let transport = parseResult(await callLLM(TRANSPORT_SYSTEM, userMessage));
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

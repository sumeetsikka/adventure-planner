import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, FLIGHTS_SYSTEM, determineEntryCity, getEntryCityName, orderDestinations, computeSchedule, fixFlightDates } from './_shared.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';
    const entryCity = determineEntryCity(config.destinations);
    const ordered = orderDestinations(config.destinations, entryCity);

    const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);

    // Build explicit flight list
    const flightLegs: string[] = [];
    // 1. International outbound
    flightLegs.push(`Flight 1: Melbourne (MEL) to ${schedule[0]?.destination || getEntryCityName(entryCity)} (${schedule[0]?.airport || entryCity}) on ${config.departureDate}`);

    // 2. Internal flights between destinations with different airports
    for (let i = 1; i < schedule.length; i++) {
      if (schedule[i].airport !== schedule[i - 1].airport) {
        flightLegs.push(`Flight ${flightLegs.length + 1}: ${schedule[i - 1].destination} (${schedule[i - 1].airport}) to ${schedule[i].destination} (${schedule[i].airport}) on ${schedule[i].arrival}`);
      }
    }

    // 3. International return
    const lastDest = schedule[schedule.length - 1];
    flightLegs.push(`Flight ${flightLegs.length + 1}: ${lastDest?.destination || 'last destination'} (${lastDest?.airport || entryCity}) to Melbourne (MEL) on ${config.returnDate}`);

    const userMessage = `Country: ${countryName}. Travellers: ${config.travellers}.

Generate flight recommendations for these EXACT flights with these EXACT dates:
${flightLegs.join('\n')}

IMPORTANT: Use the EXACT dates shown above. Do NOT change the dates.`;

    const result = await callLLM(FLIGHTS_SYSTEM, userMessage);
    let flights: any[];
    if (Array.isArray(result)) { flights = result; }
    else if (result && typeof result === 'object') { flights = (Object.values(result).find((v) => Array.isArray(v)) as any[]) || []; }
    else { flights = []; }

    // Force correct dates (LLM often ignores date instructions)
    flights = fixFlightDates(flights, schedule, config.departureDate, config.returnDate);
    res.json(flights);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Flights generation failed' });
  }
}

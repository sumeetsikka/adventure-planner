import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, NEARBY_SYSTEM, determineEntryCity, orderDestinations, computeSchedule } from './_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';
    const entryCity = determineEntryCity(config.destinations);
    const ordered = orderDestinations(config.destinations, entryCity);

    const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
    const destNames = schedule.map((s) => `${s.destination} (${s.nights} nights)`).join(', ');

    const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Suggest 2-3 nearby day trips from each destination.`;

    const result = await callLLM(NEARBY_SYSTEM, userMessage);
    res.json(Array.isArray(result) ? result : []);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Nearby generation failed' });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, PACKING_SYSTEM, determineEntryCity, orderDestinations, computeSchedule, formatScheduleForPrompt } from './_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';
    const entryCity = determineEntryCity(config.destinations);
    const ordered = orderDestinations(config.destinations, entryCity);
    const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });
    const vibeList = (config.vibes || ['mix']).join(', ');

    const totalDays = Math.round(
      (new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
    const scheduleText = formatScheduleForPrompt(schedule);

    const userMessage = `Country: ${countryName}. Travel month: ${travelMonth}. Total days: ${totalDays}. Travel vibes: ${vibeList}.

Destination schedule:
${scheduleText}`;

    const result = await callLLM(PACKING_SYSTEM, userMessage);
    res.json(Array.isArray(result) ? result : []);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Packing generation failed' });
  }
}

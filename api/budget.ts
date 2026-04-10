import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, BUDGET_SYSTEM, determineEntryCity, orderDestinations, computeSchedule, formatScheduleForPrompt } from './_shared.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';
    const entryCity = determineEntryCity(config.destinations);
    const ordered = orderDestinations(config.destinations, entryCity);
    const vibeList = (config.vibes || ['mix']).join(', ');

    const totalDays = Math.round(
      (new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);
    const scheduleText = formatScheduleForPrompt(schedule);

    const userMessage = `Country: ${countryName}. Trip: ${config.departureDate} to ${config.returnDate} (${totalDays} days). Travellers: ${config.travellers}, ages: ${config.ages.join(', ')}. Vibes: ${vibeList}.

Destination schedule:
${scheduleText}

Include flight costs for Melbourne to ${schedule[0]?.destination || countryName} and back.`;

    const result = await callLLM(BUDGET_SYSTEM, userMessage);
    res.json(Array.isArray(result) ? result : []);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Budget generation failed' });
  }
}

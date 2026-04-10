import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, ITINERARY_SYSTEM, determineEntryCity, orderDestinations, computeSchedule, formatScheduleForPrompt } from './_shared';

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

    const userMessage = `Country: ${countryName}.

CRITICAL: Generate EXACTLY ${totalDays} days (Day 1 through Day ${totalDays}).

Day 1 (${config.departureDate}): Fly Melbourne to ${countryName}. Arrive at ${schedule[0]?.destination || 'first destination'}.
Days 2 to ${totalDays - 1}: Follow this EXACT schedule:
${scheduleText}
Day ${totalDays} (${config.returnDate}): Fly home to Melbourne.

Travellers: ${config.travellers} people, ages: ${config.ages.join(', ')}. Travel vibes: ${vibeList}.

IMPORTANT: Use the EXACT dates shown above for each destination. Do NOT change the dates.`;

    let itinerary = await callLLM(ITINERARY_SYSTEM, userMessage);
    if (!Array.isArray(itinerary)) itinerary = [];

    // Force renumber days sequentially (LLM sometimes skips or misnumbers)
    itinerary = itinerary.map((day: any, i: number) => ({ ...day, day: i + 1 }));

    // Trim or pad to exactly totalDays
    if (itinerary.length > totalDays) {
      itinerary = itinerary.slice(0, totalDays);
    }

    res.json(itinerary);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Itinerary generation failed' });
  }
}

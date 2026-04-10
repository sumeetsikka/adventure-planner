import { Router } from 'express';
import { callLLM } from '../lib/gemini';
import { ITINERARY_SYSTEM } from '../lib/prompts';
import { determineEntryCity, orderDestinations } from '../lib/routePlanner';
import { computeSchedule, formatScheduleForPrompt } from '../lib/dateSchedule';

const router = Router();

router.post('/', async (req, res) => {
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
    console.error('Itinerary generation error:', err.message);
    res.status(500).json({ error: err.message || 'Itinerary generation failed' });
  }
});

export default router;

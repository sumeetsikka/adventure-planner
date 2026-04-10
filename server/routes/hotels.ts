import { Router } from 'express';
import { callLLM } from '../lib/gemini';
import { HOTELS_SYSTEM } from '../lib/prompts';
import { orderDestinations, determineEntryCity } from '../lib/routePlanner';
import { computeSchedule, fixHotelDates } from '../lib/dateSchedule';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';
    const entryCity = determineEntryCity(config.destinations);
    const ordered = orderDestinations(config.destinations, entryCity);
    const vibeList = (config.vibes || ['mix']).join(', ');

    const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);

    // Limit to max 5 destinations
    const limitedSchedule = schedule.slice(0, 5);

    // Build explicit hotel date schedule
    const hotelSchedule = limitedSchedule.map((s, i) =>
      `${i + 1}. ${s.destination}: check-in ${s.arrival}, check-out ${s.departure}, ${s.nights} nights`
    ).join('\n');

    const userMessage = `Country: ${countryName}. Vibes: ${vibeList}. Travellers: ${config.travellers}, ages: ${config.ages.join(', ')}.

Recommend 3 hotels per destination for these EXACT dates:
${hotelSchedule}

CRITICAL: Use the EXACT check-in and check-out dates shown above. Do NOT change the dates. The dates must match exactly.`;

    const result = await callLLM(HOTELS_SYSTEM, userMessage);
    let hotels: any[];
    if (Array.isArray(result)) { hotels = result; }
    else if (result && typeof result === 'object') { hotels = (Object.values(result).find((v) => Array.isArray(v)) as any[]) || []; }
    else { hotels = []; }

    // Force correct dates (override whatever the LLM returned)
    hotels = fixHotelDates(hotels, limitedSchedule);
    res.json(hotels);
  } catch (err: any) {
    console.error('Hotels generation error:', err.message);
    res.status(500).json({ error: err.message || 'Hotels generation failed' });
  }
});

export default router;

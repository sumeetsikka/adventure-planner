import { Router } from 'express';
import { callLLM } from '../lib/gemini';
import { PACKING_SYSTEM } from '../lib/prompts';
import { determineEntryCity, orderDestinations } from '../lib/routePlanner';
import { computeSchedule, formatScheduleForPrompt } from '../lib/dateSchedule';

const router = Router();

router.post('/', async (req, res) => {
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
    console.error('Packing generation error:', err.message);
    res.status(500).json({ error: err.message || 'Packing generation failed' });
  }
});

export default router;

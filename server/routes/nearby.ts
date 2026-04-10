import { Router } from 'express';
import { callLLM } from '../lib/gemini';
import { NEARBY_SYSTEM } from '../lib/prompts';
import { determineEntryCity, orderDestinations } from '../lib/routePlanner';
import { computeSchedule } from '../lib/dateSchedule';

const router = Router();

router.post('/', async (req, res) => {
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
    console.error('Nearby generation error:', err.message);
    res.status(500).json({ error: err.message || 'Nearby generation failed' });
  }
});

export default router;

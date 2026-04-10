import { Router } from 'express';
import { callLLM } from '../lib/gemini';
import { TIPS_SYSTEM } from '../lib/prompts';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';
    const destNames = config.destinations.map((d: any) => d.name).join(', ');
    const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });

    const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Travel month: ${travelMonth}. Traveller ages: ${config.ages.join(', ')}.`;

    const result = await callLLM(TIPS_SYSTEM, userMessage);
    res.json(Array.isArray(result) ? result : []);
  } catch (err: any) {
    console.error('Tips generation error:', err.message);
    res.status(500).json({ error: err.message || 'Tips generation failed' });
  }
});

export default router;

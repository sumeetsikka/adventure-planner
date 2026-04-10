import { Router } from 'express';
import { callLLM } from '../lib/gemini';
import { VISA_SYSTEM } from '../lib/prompts';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';

    const userMessage = `Country: ${countryName}. Visa requirements for Australian passport holders.`;

    const result = await callLLM(VISA_SYSTEM, userMessage);
    res.json(Array.isArray(result) ? result[0] : result);
  } catch (err: any) {
    console.error('Visa generation error:', err.message);
    res.status(500).json({ error: err.message || 'Visa generation failed' });
  }
});

export default router;

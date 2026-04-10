import { Router } from 'express';
import { callLLM } from '../lib/gemini';

const router = Router();

const DESTINATIONS_SYSTEM = `You are a travel destination expert. Generate a comprehensive list of tourist destinations for the specified country.

Return a JSON array of 15-20 destination objects. Each object must have:
- id (string): lowercase kebab-case identifier
- name (string): destination name
- emoji (string): single relevant emoji
- colour (string): unique hex colour code for this destination
- airport (string): nearest IATA airport code (3 letters)
- region (string): geographic region within the country (e.g. "NORTHERN THAILAND", "SOUTHERN FRANCE"). Use ALL CAPS.
- brief (string): 3-5 sentences explaining what makes this destination special and what fills the recommended days. Be specific about activities, landmarks, and experiences.
- tags (array of 4 strings): key highlights as short phrases
- recommendedDays (array of 2 numbers [min, max]): realistic day range based on how much there is to do
- mustVisit (boolean): true for 5-7 essential destinations that every first-time visitor should consider. Use criteria: UNESCO sites, gateway cities, unique bucket-list experiences, broad appeal.
- accessNote (string, optional): only if not directly accessible by flight, e.g. "3-hour drive from Bangkok"

Include a mix of:
- Major cities and cultural capitals
- Beach/coastal destinations
- Mountain/nature destinations
- Historical/heritage sites
- Off-the-beaten-path gems
- Day trip options from major cities

Use realistic airport codes. Vary the recommendedDays (1-2 for day trips, 2-3 for medium stays, 3-5 for major destinations). Write in Australian English. Do not use em dashes.

Return ONLY valid JSON array, no markdown.`;

router.post('/', async (req, res) => {
  try {
    const { country } = req.body;
    const userMessage = `Generate tourist destinations for ${country.name}. Origin city for travellers: Melbourne, Australia.`;

    const result = await callLLM(DESTINATIONS_SYSTEM, userMessage);

    if (Array.isArray(result)) {
      res.json(result);
    } else if (result && typeof result === 'object') {
      const arr = Object.values(result).find((v) => Array.isArray(v));
      res.json(arr || []);
    } else {
      res.json([]);
    }
  } catch (err: any) {
    console.error('Destinations generation error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate destinations' });
  }
});

export default router;

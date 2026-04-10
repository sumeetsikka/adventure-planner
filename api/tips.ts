import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, TIPS_SYSTEM } from './_shared.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';
    const destNames = config.destinations.map((d: any) => d.name).join(', ');
    const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });

    const userMessage = `Country: ${countryName}. Destinations: ${destNames}. Travel month: ${travelMonth}. Traveller ages: ${config.ages.join(', ')}.`;

    const result = await callLLM(TIPS_SYSTEM, userMessage);
    res.json(Array.isArray(result) ? result : []);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Tips generation failed' });
  }
}

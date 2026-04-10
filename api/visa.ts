import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, VISA_SYSTEM } from './_shared.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';

    const userMessage = `Country: ${countryName}. Visa requirements for Australian passport holders.`;

    const result = await callLLM(VISA_SYSTEM, userMessage);
    res.json(Array.isArray(result) ? result[0] : result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Visa generation failed' });
  }
}

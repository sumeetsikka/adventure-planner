import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM } from './_shared.js';

const CHAT_SYSTEM = `You are a friendly, knowledgeable travel expert helping an Australian traveller plan their trip.

Answer questions about safety, best times to visit, cultural etiquette, food, transport, money, visa, health, packing, activities, and off-the-beaten-path suggestions.

Be concise (2-4 sentences unless detail is needed). Use Australian English. Be warm and practical.

IMPORTANT: Return your response as a JSON object with a single "answer" field. Example: {"answer": "Your response here."}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { question, country, destinations } = req.body;
    if (!question) return res.status(400).json({ error: 'No question provided' });

    const countryName = country?.name || 'the destination';
    const destNames = (destinations || []).map((d: any) => d.name).join(', ');
    const userMessage = `Country: ${countryName}. Destinations: ${destNames || 'none'}.\n\nQuestion: ${question}`;

    const result = await callLLM(CHAT_SYSTEM, userMessage);
    const answer = result?.answer || result?.text || (typeof result === 'string' ? result : JSON.stringify(result));
    res.json({ answer });
  } catch (err: any) {
    res.json({ answer: 'Sorry, I could not process your question right now. Please try again.' });
  }
}

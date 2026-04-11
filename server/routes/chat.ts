import { Router } from 'express';
import { callLLM } from '../lib/gemini';

const router = Router();

const CHAT_SYSTEM = `You are a friendly, knowledgeable travel expert helping an Australian traveller plan their trip.

Answer questions about safety, best times to visit, cultural etiquette, food, transport, money, visa, health, packing, activities, and off-the-beaten-path suggestions.

Be concise (2-4 sentences unless detail is needed). Use Australian English. Be warm and practical.

Return your response as a JSON object with a single "answer" field containing your response text. Example: {"answer": "Your helpful response here."}`;

router.post('/', async (req, res) => {
  try {
    const { question, country, destinations } = req.body;
    if (!question) return res.status(400).json({ error: 'No question provided' });

    const countryName = country?.name || 'the destination';
    const destNames = (destinations || []).map((d: any) => d.name).join(', ');
    const userMessage = `Country: ${countryName}. Destinations: ${destNames || 'none'}.\n\nQuestion: ${question}`;

    const result = await callLLM(CHAT_SYSTEM, userMessage);
    const answer = result?.answer || result?.text || result?.response || (typeof result === 'string' ? result : JSON.stringify(result));
    res.json({ answer });
  } catch (err: any) {
    console.error('Chat error:', err.message);
    res.json({ answer: 'Sorry, I could not process your question right now. Please try again.' });
  }
});

export default router;

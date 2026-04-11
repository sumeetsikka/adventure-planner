import { Router } from 'express';
import { callLLM } from '../lib/gemini';

const router = Router();

const CHAT_SYSTEM = `You are a friendly, knowledgeable travel expert helping an Australian traveller plan their trip. You have deep knowledge about the specific country and destinations they've selected.

Answer questions about:
- Safety and security at specific destinations
- Best times to visit, seasonal events, festivals
- Cultural etiquette and customs
- Food recommendations and dietary considerations
- Local transport tips (Grab, trains, buses, ferries)
- Money and tipping advice
- Visa and entry requirements for Australians
- Health and vaccination advice
- Packing suggestions for the climate
- Specific activity recommendations
- Off-the-beaten-path suggestions
- Night-time safety, scams to watch for
- Family-friendly or accessibility considerations

Be concise (2-4 sentences per answer unless the question needs detail). Use Australian English. Be warm and practical. If you don't know something, say so honestly.

IMPORTANT: Respond in plain text only. No JSON, no markdown code blocks. Just natural conversational text.`;

router.post('/', async (req, res) => {
  try {
    const { question, country, destinations } = req.body;
    if (!question) return res.status(400).json({ error: 'No question provided' });

    const countryName = country?.name || 'the destination';
    const destNames = (destinations || []).map((d: any) => d.name).join(', ');

    const context = `Country: ${countryName}. Selected destinations: ${destNames || 'none yet'}.`;
    const userMessage = `${context}\n\nTraveller's question: ${question}`;

    // For chat, we want plain text not JSON
    const result = await callLLMText(CHAT_SYSTEM, userMessage);
    res.json({ answer: result });
  } catch (err: any) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message || 'Chat failed' });
  }
});

// Special version that returns raw text, not parsed JSON
async function callLLMText(systemPrompt: string, userMessage: string): Promise<string> {
  // Re-use the same provider chain but don't JSON.parse the result
  const { callLLM } = require('../lib/gemini');
  try {
    // callLLM will try to parse JSON and fail, so we catch and extract text
    const result = await callLLM(systemPrompt, userMessage);
    // If it somehow parsed as JSON, stringify it back
    return typeof result === 'string' ? result : JSON.stringify(result);
  } catch {
    // The LLM returned plain text (not JSON) which is what we want for chat
    // But callLLM throws on non-JSON. We need a workaround.
    // Let's trick it by wrapping the prompt to request JSON
    const wrappedSystem = systemPrompt + '\n\nReturn your response as a JSON object with a single "answer" field containing your response text.';
    try {
      const result = await callLLM(wrappedSystem, userMessage);
      return result?.answer || result?.text || result?.response || JSON.stringify(result);
    } catch (err2: any) {
      return 'Sorry, I could not process your question right now. Please try again.';
    }
  }
}

export default router;

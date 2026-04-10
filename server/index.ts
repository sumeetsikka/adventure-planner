import express from 'express';
import cors from 'cors';
import destinationsRouter from './routes/destinations';
import flightsRouter from './routes/flights';
import hotelsRouter from './routes/hotels';
import itineraryRouter from './routes/itinerary';
import budgetRouter from './routes/budget';
import tipsRouter from './routes/tips';
import packingRouter from './routes/packing';
import weatherRouter from './routes/weather';
import visaRouter from './routes/visa';
import currencyRouter from './routes/currency';
import nearbyRouter from './routes/nearby';
import transportRouter from './routes/transport';

const app = express();
const PORT = 3173;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

app.use('/api/destinations', destinationsRouter);
app.use('/api/flights', flightsRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/tips', tipsRouter);
app.use('/api/packing', packingRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/visa', visaRouter);
app.use('/api/currency', currencyRouter);
app.use('/api/nearby', nearbyRouter);
app.use('/api/transport', transportRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  const isReal = (key: string | undefined, placeholder?: string) => key && key !== placeholder;
  const providers = [
    isReal(process.env.GROQ_API_KEY) && 'Groq',
    isReal(process.env.CEREBRAS_API_KEY, 'your_cerebras_key_here') && 'Cerebras',
    isReal(process.env.MISTRAL_API_KEY, 'your_mistral_key_here') && 'Mistral',
    isReal(process.env.OPENROUTER_API_KEY, 'your_openrouter_key_here') && 'OpenRouter',
    isReal(process.env.GEMINI_API_KEY) && 'Gemini',
    isReal(process.env.GITHUB_MODELS_TOKEN, 'your_github_token_here') && 'GitHub Models',
    'Ollama (local)',
  ].filter(Boolean);
  console.log(`LLM chain (${providers.length} providers): ${providers.join(' → ')}`);
  if (providers.length <= 3) {
    console.warn('TIP: Add more free API keys (no credit card needed):');
    console.warn('  CEREBRAS_API_KEY   - cloud.cerebras.ai');
    console.warn('  MISTRAL_API_KEY    - console.mistral.ai');
    console.warn('  OPENROUTER_API_KEY - openrouter.ai/keys');
    console.warn('  GITHUB_MODELS_TOKEN - github.com/settings/tokens');
  }
});

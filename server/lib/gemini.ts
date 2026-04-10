import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mistral } from '@mistralai/mistralai';

// ═══════════════════════════════════════
// Provider Setup (7 providers, all free)
// ═══════════════════════════════════════

// 1. Groq: free, 30 RPM, very fast
const groqKey = process.env.GROQ_API_KEY || '';
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

// 2. Cerebras: free, 30 RPM, 1M tokens/day, extremely fast
const cerebrasKey = process.env.CEREBRAS_API_KEY || '';
const cerebras = cerebrasKey ? new OpenAI({ apiKey: cerebrasKey, baseURL: 'https://api.cerebras.ai/v1' }) : null;

// 3. Mistral: free, 43K req/day, 500K tok/min (massive free tier)
const mistralKey = process.env.MISTRAL_API_KEY || '';
const mistral = mistralKey ? new Mistral({ apiKey: mistralKey }) : null;

// 4. OpenRouter: free models, 200 req/day
const openRouterKey = process.env.OPENROUTER_API_KEY || '';
const openRouter = openRouterKey ? new OpenAI({ apiKey: openRouterKey, baseURL: 'https://openrouter.ai/api/v1' }) : null;

// 5. Gemini: free tier with retry
const geminiKey = process.env.GEMINI_API_KEY || '';
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// 6. GitHub Models: free with GitHub token, 150 req/day
const githubToken = process.env.GITHUB_MODELS_TOKEN || '';
const githubModels = githubToken ? new OpenAI({ apiKey: githubToken, baseURL: 'https://models.inference.ai.azure.com' }) : null;

// 7. Ollama: local, no key, unlimited
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ═══════════════════════════════════════
// Provider Implementations
// ═══════════════════════════════════════

// --- Groq ---
const GROQ_MODELS = ['meta-llama/llama-4-scout-17b-16e-instruct', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

async function callGroq(systemPrompt: string, userMessage: string): Promise<string> {
  if (!groq) throw new Error('GROQ_API_KEY not set');
  let lastErr: Error | null = null;
  for (const model of GROQ_MODELS) {
    try {
      const c = await groq.chat.completions.create({
        model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        temperature: 0.7, max_tokens: 4096,
      });
      return c.choices[0]?.message?.content || '';
    } catch (err: any) {
      lastErr = err;
      if (err.status === 429 || err.status === 400 || err.message?.includes('decommissioned')) {
        console.warn(`Groq ${model} unavailable, trying next...`); continue;
      }
      throw err;
    }
  }
  throw lastErr || new Error('All Groq models unavailable');
}

// --- Cerebras ---
const CEREBRAS_MODELS = ['llama-3.3-70b', 'llama3.3-70b', 'llama-3.1-8b', 'qwen-3-32b'];

async function callCerebras(systemPrompt: string, userMessage: string): Promise<string> {
  if (!cerebras) throw new Error('CEREBRAS_API_KEY not set');
  let lastErr: Error | null = null;
  for (const model of CEREBRAS_MODELS) {
    try {
      const c = await cerebras.chat.completions.create({
        model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        temperature: 0.7, max_tokens: 4096,
      });
      return c.choices[0]?.message?.content || '';
    } catch (err: any) {
      lastErr = err;
      if (err.status === 404 || err.status === 429 || err.status === 400) {
        console.warn(`Cerebras ${model} unavailable (${err.status}), trying next...`);
        continue;
      }
      throw err;
    }
  }
  throw lastErr || new Error('All Cerebras models unavailable');
}

// --- Mistral ---
async function callMistral(systemPrompt: string, userMessage: string): Promise<string> {
  if (!mistral) throw new Error('MISTRAL_API_KEY not set');
  const models = ['mistral-small-latest', 'open-mistral-nemo'];
  let lastErr: Error | null = null;
  for (const model of models) {
    try {
      const c = await mistral.chat.complete({
        model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        temperature: 0.7, maxTokens: 4096,
      });
      return (c.choices?.[0]?.message?.content as string) || '';
    } catch (err: any) {
      lastErr = err;
      if (err.statusCode === 429 || err.status === 429) {
        console.warn(`Mistral ${model} rate limited, trying next...`); continue;
      }
      throw err;
    }
  }
  throw lastErr || new Error('All Mistral models unavailable');
}

// --- OpenRouter (free models) ---
const OPENROUTER_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
];

async function callOpenRouter(systemPrompt: string, userMessage: string): Promise<string> {
  if (!openRouter) throw new Error('OPENROUTER_API_KEY not set');
  let lastErr: Error | null = null;
  for (const model of OPENROUTER_MODELS) {
    try {
      const c = await openRouter.chat.completions.create({
        model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        temperature: 0.7, max_tokens: 4096,
      });
      return c.choices[0]?.message?.content || '';
    } catch (err: any) {
      lastErr = err;
      if (err.status === 429 || err.status === 400) { console.warn(`OpenRouter ${model} unavailable, trying next...`); continue; }
      throw err;
    }
  }
  throw lastErr || new Error('All OpenRouter models unavailable');
}

// --- Gemini ---
const GEMINI_MODELS = ['gemini-2.0-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'];

async function callGeminiWithRetry(systemPrompt: string, userMessage: string): Promise<string> {
  if (!genAI) throw new Error('GEMINI_API_KEY not set');
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemPrompt });
        const result = await model.generateContent(userMessage);
        return result.response.text();
      } catch (err: any) {
        if (err.message?.includes('429') || err.message?.includes('quota')) {
          const retryMatch = err.message?.match(/retry in (\d+)/i);
          const waitSec = retryMatch ? Math.min(parseInt(retryMatch[1]) + 2, 30) : 15;
          console.warn(`Gemini ${modelName} rate limited. Waiting ${waitSec}s...`);
          await delay(waitSec * 1000);
          continue;
        }
        console.warn(`Gemini ${modelName} error: ${err.message}`);
        continue;
      }
    }
  }
  throw new Error('All Gemini models exhausted');
}

// --- GitHub Models ---
async function callGitHubModels(systemPrompt: string, userMessage: string): Promise<string> {
  if (!githubModels) throw new Error('GITHUB_MODELS_TOKEN not set');
  const models = ['gpt-4o-mini', 'Meta-Llama-3.1-70B-Instruct'];
  let lastErr: Error | null = null;
  for (const model of models) {
    try {
      const c = await githubModels.chat.completions.create({
        model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        temperature: 0.7, max_tokens: 4096,
      });
      return c.choices[0]?.message?.content || '';
    } catch (err: any) {
      lastErr = err;
      if (err.status === 429 || err.status === 400) { console.warn(`GitHub Models ${model} unavailable, trying next...`); continue; }
      throw err;
    }
  }
  throw lastErr || new Error('All GitHub Models unavailable');
}

// --- Ollama (local) ---
async function callOllama(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      stream: false, options: { temperature: 0.7 },
    }),
  });
  if (!res.ok) throw new Error(`Ollama returned ${res.status}`);
  const data = await res.json();
  return data.message?.content || '';
}

async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch { return false; }
}

// ═══════════════════════════════════════
// Main LLM Dispatcher
// ═══════════════════════════════════════

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)),
  ]);
}

export async function callLLM(systemPrompt: string, userMessage: string): Promise<any> {
  // Chain: Groq → Cerebras → Mistral → OpenRouter → Gemini → GitHub Models → Ollama
  const providers: Array<{ name: string; fn: () => Promise<string> }> = [];

  if (groq) providers.push({ name: 'Groq', fn: () => callGroq(systemPrompt, userMessage) });
  if (cerebras) providers.push({ name: 'Cerebras', fn: () => callCerebras(systemPrompt, userMessage) });
  if (mistral) providers.push({ name: 'Mistral', fn: () => callMistral(systemPrompt, userMessage) });
  if (openRouter) providers.push({ name: 'OpenRouter', fn: () => callOpenRouter(systemPrompt, userMessage) });
  if (genAI) providers.push({ name: 'Gemini', fn: () => callGeminiWithRetry(systemPrompt, userMessage) });
  if (githubModels) providers.push({ name: 'GitHub Models', fn: () => callGitHubModels(systemPrompt, userMessage) });
  providers.push({ name: `Ollama (${OLLAMA_MODEL})`, fn: () => callOllama(systemPrompt, userMessage) });

  let lastError: Error | null = null;

  for (const provider of providers) {
    if (provider.name.startsWith('Ollama') && !(await isOllamaAvailable())) {
      console.warn('Ollama not available, skipping.');
      continue;
    }
    try {
      console.log(`Using ${provider.name}...`);
      const text = await withTimeout(provider.fn(), 60000, provider.name);
      const parsed = parseJsonFromText(text);
      console.log(`${provider.name} succeeded.`);
      return parsed;
    } catch (err: any) {
      console.warn(`${provider.name} failed: ${err.message}`);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('All LLM providers failed.');
}

// ═══════════════════════════════════════
// JSON Parser
// ═══════════════════════════════════════

function parseJsonFromText(text: string): any {
  if (!text || text.trim().length === 0) throw new Error('Empty LLM response');

  let cleaned = text.trim();
  cleaned = cleaned.replace(/```(?:json)?\s*\n?/gi, '').replace(/```/g, '');
  cleaned = cleaned.trim();

  try { return JSON.parse(cleaned); } catch { /* continue */ }

  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]); } catch {
      try { return JSON.parse(arrMatch[0].replace(/,\s*([}\]])/g, '$1')); } catch { /* continue */ }
    }
  }

  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch {
      try { return JSON.parse(objMatch[0].replace(/,\s*([}\]])/g, '$1')); } catch { /* continue */ }
    }
  }

  try { return JSON.parse(`[${cleaned}]`); } catch { /* give up */ }

  console.error('Failed to parse LLM response. First 500 chars:', cleaned.substring(0, 500));
  throw new Error('Could not parse JSON from LLM response');
}

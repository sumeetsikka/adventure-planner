import { Router } from 'express';
import { callLLM } from '../lib/gemini';
import { CURRENCY_SYSTEM } from '../lib/prompts';

const router = Router();

async function getCountryMeta(countryName: string) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=currencies,languages,capital,flags`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const country = data[0];
    const currencies = country.currencies || {};
    const currCode = Object.keys(currencies)[0];
    const curr = currencies[currCode];
    return {
      currency_code: currCode,
      currency_name: curr?.name || '',
      symbol: curr?.symbol || '',
      capital: Array.isArray(country.capital) ? country.capital[0] : '',
      flag_url: country.flags?.svg || country.flags?.png || '',
      languages: Object.values(country.languages || {}),
    };
  } catch {
    return null;
  }
}

router.post('/', async (req, res) => {
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';

    // Get real country data from RestCountries (free, no key)
    const meta = await getCountryMeta(countryName);
    const currencyHint = meta
      ? `The currency is ${meta.currency_name} (${meta.currency_code}, symbol: ${meta.symbol}).`
      : '';

    const userMessage = `Country: ${countryName}. ${currencyHint} Currency information for Australian travellers.`;

    const result = await callLLM(CURRENCY_SYSTEM, userMessage);
    let currency = Array.isArray(result) ? result[0] : result;

    // Enrich with real data if available
    if (meta && currency) {
      currency.currency_code = currency.currency_code || meta.currency_code;
      currency.currency_name = currency.currency_name || meta.currency_name;
      currency.symbol = currency.symbol || meta.symbol;
    }

    res.json(currency || null);
  } catch (err: any) {
    console.error('Currency generation error:', err.message);
    res.status(500).json({ error: err.message || 'Currency generation failed' });
  }
});

export default router;

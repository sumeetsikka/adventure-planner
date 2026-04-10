import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callLLM, determineEntryCity, orderDestinations, computeSchedule } from './_shared';

const TRANSPORT_SYSTEM = `You are a transport and logistics expert for travellers. Generate inter-city transport recommendations as a JSON array.

For each journey between consecutive destinations, recommend the BEST transport mode. Do NOT include flights (those are handled separately). Focus on ground and water transport:
- Trains (high-speed, sleeper, scenic)
- Buses (long-distance, luxury, local)
- Ferries and boats
- Private car transfers
- Rental car / self-drive
- Speedboats
- Cable cars (inter-city)

Each transport object must have:
- from (string): departure city/destination name
- to (string): arrival city/destination name
- date (string): travel date YYYY-MM-DD
- mode (string): e.g. "High-Speed Train", "Overnight Sleeper Train", "Express Bus", "Ferry", "Private Car Transfer", "Rental Car", "Speedboat"
- operator (string): specific operator name e.g. "JR Shinkansen", "Eurostar", "12Go Asia", "Rome2Rio"
- duration (string): e.g. "2h 30m", "overnight (10h)"
- price_estimate_aud (string): price range per person e.g. "$25-$50"
- tip (string): one practical booking tip for this specific journey
- booking_sites (string array): 2-3 sites to book e.g. ["12Go Asia", "Rome2Rio", "Trainline"]
- booking_urls (string array): actual booking URLs if known, or general site URLs

Only include journeys where BOTH cities share the same country. If two consecutive destinations have different airports but are in the same country, include a ground transport option.

CRITICAL: Use the EXACT dates provided. Do NOT change or invent dates.

Return ONLY valid JSON array, no markdown.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    const countryName = config.country?.name || 'the destination';
    const entryCity = determineEntryCity(config.destinations);
    const ordered = orderDestinations(config.destinations, entryCity);

    const schedule = computeSchedule(ordered, config.departureDate, config.returnDate);

    // Build the inter-city journeys from the schedule
    const journeys: string[] = [];
    for (let i = 0; i < schedule.length - 1; i++) {
      const from = schedule[i];
      const to = schedule[i + 1];
      // Skip if same airport (same city area, no inter-city transport needed)
      if (from.airport === to.airport) continue;
      journeys.push(`${from.destination} to ${to.destination} on ${from.departure}`);
    }

    if (journeys.length === 0) {
      res.json([]);
      return;
    }

    const userMessage = `Country: ${countryName}. Travellers: ${config.travellers}.

Recommend the best ground/water transport for these inter-city journeys:
${journeys.map((j, i) => `${i + 1}. ${j}`).join('\n')}

Do NOT include flights. Only ground transport, trains, buses, ferries, boats, car transfers.
Use the EXACT dates shown above.`;

    const result = await callLLM(TRANSPORT_SYSTEM, userMessage);
    let transport: any[];
    if (Array.isArray(result)) { transport = result; }
    else if (result && typeof result === 'object') { transport = (Object.values(result).find((v) => Array.isArray(v)) as any[]) || []; }
    else { transport = []; }

    // Force correct dates from schedule
    let schedIdx = 0;
    for (let i = 0; i < transport.length && schedIdx < schedule.length - 1; i++) {
      transport[i].date = schedule[schedIdx].departure;
      schedIdx++;
    }

    res.json(transport);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Transport generation failed' });
  }
}

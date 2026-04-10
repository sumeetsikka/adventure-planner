import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GeoResult {
  latitude: number;
  longitude: number;
  name: string;
}

async function geocode(name: string): Promise<GeoResult | null> {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return { latitude: data.results[0].latitude, longitude: data.results[0].longitude, name: data.results[0].name };
    }
    return null;
  } catch {
    return null;
  }
}

async function getWeather(lat: number, lon: number, startDate: string, endDate: string) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&start_date=${startDate}&end_date=${endDate}&timezone=auto`
    );
    const data = await res.json();
    const daily = data.daily || {};
    const maxTemps = daily.temperature_2m_max || [];
    const minTemps = daily.temperature_2m_min || [];
    const precip = daily.precipitation_sum || [];
    const humidity = daily.relative_humidity_2m_mean || [];

    // Average across all forecast days
    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    return {
      temp_high_c: avg(maxTemps),
      temp_low_c: avg(minTemps),
      rainfall_mm: Math.round(precip.reduce((a: number, b: number) => a + b, 0)),
      humidity_percent: avg(humidity),
    };
  } catch {
    return null;
  }
}

function getPackAdvice(high: number, low: number, rain: number): string {
  const items: string[] = [];
  if (high > 30) items.push('light breathable clothing, sunscreen, hat');
  else if (high > 20) items.push('light layers, t-shirts, one warm layer for evenings');
  else if (high > 10) items.push('warm layers, jacket, long pants');
  else items.push('heavy winter coat, thermals, warm accessories');

  if (rain > 50) items.push('waterproof jacket and umbrella essential');
  else if (rain > 20) items.push('light rain jacket recommended');

  if (low < 5) items.push('thermal base layers for cold nights');

  return items.join('. ') + '.';
}

function getDescription(high: number, low: number, rain: number, humidity: number): string {
  let desc = '';
  if (high > 35) desc = 'Very hot conditions expected.';
  else if (high > 28) desc = 'Warm and pleasant weather.';
  else if (high > 20) desc = 'Mild and comfortable temperatures.';
  else if (high > 10) desc = 'Cool conditions, layers recommended.';
  else desc = 'Cold weather expected.';

  if (rain > 100) desc += ' Heavy rainfall likely.';
  else if (rain > 40) desc += ' Moderate rain expected.';
  else if (rain > 10) desc += ' Light showers possible.';
  else desc += ' Generally dry conditions.';

  if (humidity > 80) desc += ' High humidity.';

  return desc;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    const destinations = config.destinations || [];
    const travelMonth = new Date(config.departureDate).toLocaleString('en-AU', { month: 'long' });

    // Use Open-Meteo forecast API (free, no key)
    const results = await Promise.all(
      destinations.map(async (d: any) => {
        const geo = await geocode(d.name.split('(')[0].split('/')[0].trim());
        if (!geo) {
          return {
            destination: d.name,
            month: travelMonth,
            temp_high_c: 25,
            temp_low_c: 18,
            rainfall_mm: 50,
            humidity_percent: 65,
            description: 'Weather data unavailable for this location. Check closer to your travel date.',
            what_to_pack: 'Pack versatile layers and a light rain jacket.',
          };
        }

        const weather = await getWeather(geo.latitude, geo.longitude, config.departureDate, config.returnDate);
        if (!weather) {
          return {
            destination: d.name,
            month: travelMonth,
            temp_high_c: 25, temp_low_c: 18, rainfall_mm: 50, humidity_percent: 65,
            description: 'Forecast unavailable. Check closer to travel date.',
            what_to_pack: 'Pack versatile layers and a light rain jacket.',
          };
        }

        return {
          destination: d.name,
          month: travelMonth,
          ...weather,
          description: getDescription(weather.temp_high_c, weather.temp_low_c, weather.rainfall_mm, weather.humidity_percent),
          what_to_pack: getPackAdvice(weather.temp_high_c, weather.temp_low_c, weather.rainfall_mm),
        };
      })
    );

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Weather data failed' });
  }
}

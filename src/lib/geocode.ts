const cache = new Map<string, { lat: number; lon: number } | null>();

export async function geocodeDestination(name: string): Promise<{ lat: number; lon: number } | null> {
  const cleanName = name.split('(')[0].split('/')[0].trim();

  if (cache.has(cleanName)) return cache.get(cleanName) || null;

  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const result = { lat: data.results[0].latitude, lon: data.results[0].longitude };
      cache.set(cleanName, result);
      return result;
    }
    cache.set(cleanName, null);
    return null;
  } catch {
    cache.set(cleanName, null);
    return null;
  }
}

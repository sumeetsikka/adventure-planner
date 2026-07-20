export interface PublicEvent {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'holiday' | 'festival' | 'observance';
  description?: string;
  global?: boolean;
}

const COUNTRY_ISO: Record<string, string> = {
  vietnam: 'VN',
  thailand: 'TH',
  japan: 'JP',
  indonesia: 'ID',
  philippines: 'PH',
  cambodia: 'KH',
  italy: 'IT',
  france: 'FR',
  spain: 'ES',
  portugal: 'PT',
  greece: 'GR',
  switzerland: 'CH',
  germany: 'DE',
  netherlands: 'NL',
  belgium: 'BE',
  austria: 'AT',
  norway: 'NO',
  sweden: 'SE',
  croatia: 'HR',
  iceland: 'IS',
  morocco: 'MA',
  egypt: 'EG',
  turkey: 'TR',
  mauritius: 'MU',
  peru: 'PE',
  mexico: 'MX',
  newzealand: 'NZ',
  maldives: 'MV',
  fiji: 'FJ',
};

export function isoCodeForCountry(countryId: string): string | null {
  return COUNTRY_ISO[countryId] ?? null;
}

interface NagerHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed?: boolean;
  global?: boolean;
  types?: string[];
}

const cache = new Map<string, PublicEvent[]>();

export async function fetchPublicHolidays(
  year: number,
  countryCode: string,
): Promise<PublicEvent[]> {
  const key = `${year}-${countryCode}`;
  if (cache.has(key)) return cache.get(key)!;
  try {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw: NagerHoliday[] = await res.json();
    const events: PublicEvent[] = raw.map((h) => ({
      date: h.date,
      name: h.localName && h.localName !== h.name ? `${h.name} (${h.localName})` : h.name,
      type: 'holiday',
      description: h.global ? 'National public holiday' : 'Regional public holiday',
      global: h.global,
    }));
    cache.set(key, events);
    return events;
  } catch (err) {
    console.warn('fetchPublicHolidays failed', err);
    return [];
  }
}

// ---- Curated festival lookup ----
// Each entry has either a fixed date (month + day) or a month range,
// scoped to a country. Resolved against the trip year at runtime.
interface FestivalEntry {
  countryId: string;
  name: string;
  type: 'festival' | 'observance';
  description: string;
  // resolver returns 0..n date strings (YYYY-MM-DD) for a given year
  resolve: (year: number) => string[];
}

function ymd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function range(year: number, m1: number, d1: number, m2: number, d2: number): string[] {
  const start = new Date(Date.UTC(year, m1 - 1, d1));
  const end = new Date(Date.UTC(year, m2 - 1, d2));
  const out: string[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// Last weekday-of-month resolver (e.g. last Wednesday of August)
function lastWeekdayOf(year: number, month: number, weekday: number): string {
  // weekday: 0=Sun..6=Sat
  const last = new Date(Date.UTC(year, month, 0)); // last day of month
  const lastDow = last.getUTCDay();
  const diff = (lastDow - weekday + 7) % 7;
  const day = last.getUTCDate() - diff;
  return ymd(year, month, day);
}

const FESTIVALS: FestivalEntry[] = [
  // Japan
  { countryId: 'japan', name: 'Cherry Blossom Season (Hanami)', type: 'festival',
    description: 'Sakura blooms across Japan — picnics under pink canopies.',
    resolve: (y) => range(y, 3, 20, 4, 15) },
  { countryId: 'japan', name: 'Gion Matsuri', type: 'festival',
    description: 'Kyoto’s grand month-long summer festival.',
    resolve: (y) => range(y, 7, 1, 7, 31) },
  { countryId: 'japan', name: 'Awa Odori (Tokushima)', type: 'festival',
    description: 'Riotous summer dance festival.',
    resolve: (y) => range(y, 8, 12, 8, 15) },
  { countryId: 'japan', name: 'Autumn Leaves (Koyo)', type: 'observance',
    description: 'Maple foliage peaks across the country.',
    resolve: (y) => range(y, 11, 1, 11, 30) },

  // Thailand
  { countryId: 'thailand', name: 'Songkran (Thai New Year)', type: 'festival',
    description: 'Nationwide water-fight celebration.',
    resolve: (y) => range(y, 4, 13, 4, 15) },
  { countryId: 'thailand', name: 'Loy Krathong', type: 'festival',
    description: 'Floating-lantern festival on rivers and waterways.',
    resolve: (y) => [ymd(y, 11, 15)] },
  { countryId: 'thailand', name: 'Yi Peng Lantern Festival (Chiang Mai)', type: 'festival',
    description: 'Thousands of sky lanterns released over Chiang Mai.',
    resolve: (y) => range(y, 11, 14, 11, 16) },

  // Vietnam
  { countryId: 'vietnam', name: 'Tết (Lunar New Year)', type: 'festival',
    description: 'Vietnam’s biggest holiday — many shops close.',
    resolve: (y) => range(y, 1, 25, 2, 15) },
  { countryId: 'vietnam', name: 'Mid-Autumn Festival', type: 'festival',
    description: 'Mooncakes, lanterns and dragon dances.',
    resolve: (y) => [ymd(y, 9, 17)] },

  // Indonesia
  { countryId: 'indonesia', name: 'Nyepi (Balinese Day of Silence)', type: 'observance',
    description: 'Bali shuts down for 24 hours of silence.',
    resolve: (y) => [ymd(y, 3, 11)] },
  { countryId: 'indonesia', name: 'Galungan', type: 'festival',
    description: 'Balinese Hindu celebration with penjor poles lining streets.',
    resolve: (y) => [ymd(y, 4, 23)] },

  // Cambodia
  { countryId: 'cambodia', name: 'Khmer New Year', type: 'festival',
    description: 'Country-wide celebrations with games and temple visits.',
    resolve: (y) => range(y, 4, 13, 4, 16) },
  { countryId: 'cambodia', name: 'Water Festival (Bon Om Touk)', type: 'festival',
    description: 'Boat races on the Tonlé Sap.',
    resolve: (y) => range(y, 11, 14, 11, 16) },

  // Philippines
  { countryId: 'philippines', name: 'Sinulog Festival (Cebu)', type: 'festival',
    description: 'Drumbeats and street dancing honouring Santo Niño.',
    resolve: (y) => [ymd(y, 1, 19)] },
  { countryId: 'philippines', name: 'Ati-Atihan (Kalibo)', type: 'festival',
    description: '"Mother of all Philippine festivals" — tribal street parties.',
    resolve: (y) => range(y, 1, 12, 1, 19) },

  // Spain
  { countryId: 'spain', name: 'La Tomatina (Buñol)', type: 'festival',
    description: 'World’s largest tomato fight — last Wednesday of August.',
    resolve: (y) => [lastWeekdayOf(y, 8, 3)] },
  { countryId: 'spain', name: 'Las Fallas (Valencia)', type: 'festival',
    description: 'Giant satirical figures burned at midnight.',
    resolve: (y) => range(y, 3, 15, 3, 19) },
  { countryId: 'spain', name: 'San Fermín (Pamplona)', type: 'festival',
    description: 'The Running of the Bulls.',
    resolve: (y) => range(y, 7, 6, 7, 14) },

  // Italy
  { countryId: 'italy', name: 'Carnival of Venice', type: 'festival',
    description: 'Masquerades and gondola parades.',
    resolve: (y) => range(y, 2, 8, 2, 18) },
  { countryId: 'italy', name: 'Palio di Siena', type: 'festival',
    description: 'Bareback horse race around the Piazza del Campo.',
    resolve: (y) => [ymd(y, 7, 2), ymd(y, 8, 16)] },

  // France
  { countryId: 'france', name: 'Bastille Day', type: 'festival',
    description: 'Parades and fireworks across France.',
    resolve: (y) => [ymd(y, 7, 14)] },
  { countryId: 'france', name: 'Cannes Film Festival', type: 'festival',
    description: 'The Croisette buzzes with cinema royalty.',
    resolve: (y) => range(y, 5, 13, 5, 24) },
  { countryId: 'france', name: 'Fête de la Musique', type: 'festival',
    description: 'Free music in every street.',
    resolve: (y) => [ymd(y, 6, 21)] },

  // Germany
  { countryId: 'germany', name: 'Oktoberfest (Munich)', type: 'festival',
    description: 'World’s largest beer festival.',
    resolve: (y) => range(y, 9, 20, 10, 5) },
  { countryId: 'germany', name: 'Christmas Markets', type: 'festival',
    description: 'Glühwein, lebkuchen and twinkling stalls.',
    resolve: (y) => range(y, 11, 27, 12, 23) },

  // Netherlands
  { countryId: 'netherlands', name: 'Tulip Season (Keukenhof)', type: 'observance',
    description: 'Tulip fields in full bloom.',
    resolve: (y) => range(y, 3, 21, 5, 12) },
  { countryId: 'netherlands', name: 'King’s Day', type: 'festival',
    description: 'Orange-clad street parties nationwide.',
    resolve: (y) => [ymd(y, 4, 27)] },

  // Greece
  { countryId: 'greece', name: 'Greek Easter', type: 'festival',
    description: 'Greece’s most important religious celebration.',
    resolve: (y) => range(y, 4, 18, 4, 25) },

  // Iceland
  { countryId: 'iceland', name: 'Northern Lights Season', type: 'observance',
    description: 'Aurora viewing peaks on dark, clear nights.',
    // Aurora season spans the year boundary (Sep–Apr); `range` can't cross years
    // (start > end yields an empty list), so build both halves of the year.
    resolve: (y) => [...range(y, 9, 1, 12, 31), ...range(y, 1, 1, 4, 15)] },
  { countryId: 'iceland', name: 'Midnight Sun', type: 'observance',
    description: 'The sun barely sets.',
    resolve: (y) => range(y, 6, 1, 7, 15) },

  // Norway / Sweden
  { countryId: 'norway', name: 'Midnight Sun (Northern Norway)', type: 'observance',
    description: 'Continuous daylight above the Arctic Circle.',
    resolve: (y) => range(y, 5, 20, 7, 22) },
  { countryId: 'sweden', name: 'Midsummer', type: 'festival',
    description: 'Maypole dancing and flower crowns.',
    resolve: (y) => range(y, 6, 19, 6, 26) },

  // India-adjacent festivals across countries (kept minimal)
  // Mexico
  { countryId: 'mexico', name: 'Día de los Muertos', type: 'festival',
    description: 'Marigold altars and parades for the departed.',
    resolve: (y) => range(y, 11, 1, 11, 2) },
  { countryId: 'mexico', name: 'Guelaguetza (Oaxaca)', type: 'festival',
    description: 'Indigenous dance and culture festival.',
    resolve: (y) => range(y, 7, 15, 7, 31) },

  // Peru
  { countryId: 'peru', name: 'Inti Raymi (Cusco)', type: 'festival',
    description: 'Inca Festival of the Sun.',
    resolve: (y) => [ymd(y, 6, 24)] },

  // Morocco / Egypt / Turkey — Diwali for Mauritius
  { countryId: 'morocco', name: 'Marrakech Popular Arts Festival', type: 'festival',
    description: 'Music, dance and folklore in the medina.',
    resolve: (y) => range(y, 7, 5, 7, 12) },
  { countryId: 'turkey', name: 'Cappadocia Hot-Air Balloon Festival', type: 'festival',
    description: 'Hundreds of balloons drift over fairy chimneys.',
    resolve: (y) => range(y, 7, 14, 7, 21) },
  { countryId: 'mauritius', name: 'Diwali', type: 'festival',
    description: 'Festival of Lights — homes glow with diyas.',
    resolve: (y) => [ymd(y, 11, 1)] },

  // New Zealand
  { countryId: 'newzealand', name: 'Matariki', type: 'observance',
    description: 'Māori New Year — rising of the Pleiades.',
    resolve: (y) => [ymd(y, 6, 27)] },

  // Fiji
  { countryId: 'fiji', name: 'Bula Festival (Nadi)', type: 'festival',
    description: 'Week-long celebration of Fijian culture.',
    resolve: (y) => range(y, 7, 19, 7, 26) },

  // Croatia
  { countryId: 'croatia', name: 'Dubrovnik Summer Festival', type: 'festival',
    description: 'Open-air theatre and concerts in the old town.',
    resolve: (y) => range(y, 7, 10, 8, 25) },

  // Switzerland / Austria / Belgium / Portugal
  { countryId: 'switzerland', name: 'Montreux Jazz Festival', type: 'festival',
    description: 'Iconic lakeside music festival.',
    resolve: (y) => range(y, 7, 4, 7, 19) },
  { countryId: 'austria', name: 'Salzburg Festival', type: 'festival',
    description: 'World-class opera and classical music.',
    resolve: (y) => range(y, 7, 20, 8, 31) },
  { countryId: 'belgium', name: 'Tomorrowland (Boom)', type: 'festival',
    description: 'World’s largest electronic music festival.',
    resolve: (y) => range(y, 7, 18, 7, 27) },
  { countryId: 'portugal', name: 'Festas de Lisboa', type: 'festival',
    description: 'Sardines, parades and street parties for Santo António.',
    resolve: (y) => range(y, 6, 1, 6, 30) },
];

export function getFestivalsForCountryInRange(
  countryId: string,
  startISO: string,
  endISO: string,
): PublicEvent[] {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const years = new Set<number>();
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    years.add(d.getUTCFullYear());
  }
  const out: PublicEvent[] = [];
  for (const f of FESTIVALS) {
    if (f.countryId !== countryId) continue;
    for (const y of years) {
      for (const date of f.resolve(y)) {
        if (date >= startISO && date <= endISO) {
          out.push({ date, name: f.name, type: f.type, description: f.description });
        }
      }
    }
  }
  return out;
}

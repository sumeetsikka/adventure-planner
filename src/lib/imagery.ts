/**
 * Curated imagery helpers.
 *
 * Country heroes use hand-picked Unsplash direct image URLs (permanent CDN).
 * Destination photos fall back to Unsplash source search; if those fail, the
 * consuming card renders a gradient + emoji composition that stands on its own.
 */

// Curated Unsplash photo IDs — one iconic shot per country.
// The CDN `images.unsplash.com` serves these permanently.
const COUNTRY_PHOTO_IDS: Record<string, string> = {
  vietnam: 'photo-1528127269322-539801943592',
  thailand: 'photo-1528181304800-259b08848526',
  japan: 'photo-1493976040374-85c8e12f0c0e',
  indonesia: 'photo-1537996194471-e657df975ab4',
  philippines: 'photo-1518509562904-e7ef99cddc85',
  cambodia: 'photo-1563492065599-3520f775eeed',
  italy: 'photo-1552832230-c0197dd311b5',
  france: 'photo-1502602898657-3e91760cbb34',
  spain: 'photo-1543783207-ec64e4d95325',
  portugal: 'photo-1555881400-74d7acaacd8b',
  greece: 'photo-1533105079780-92b9be482077',
  switzerland: 'photo-1530122037265-a5f1f91d3b99',
  germany: 'photo-1467269204594-9661b134dd2b',
  netherlands: 'photo-1534351590666-13e3e96c5017',
  belgium: 'photo-1491557345352-5929e343eb89',
  austria: 'photo-1516550893923-42d28e5677af',
  norway: 'photo-1520769945061-0a448c463865',
  sweden: 'photo-1509356843151-3e7d96241e11',
  croatia: 'photo-1555990538-32f5c0b0e7e6',
  iceland: 'photo-1504284402738-4f43fcdd19d5',
  morocco: 'photo-1489749798305-4fea3ae63d43',
  egypt: 'photo-1539650116574-75c0c6d73f6e',
  turkey: 'photo-1527838832700-5059252407fa',
  mauritius: 'photo-1544979590-37e9b47eb705',
  peru: 'photo-1526392060635-9d6019884377',
  mexico: 'photo-1512813195386-6cf811ad3542',
  newzealand: 'photo-1469854523086-cc02fe5d8800',
  maldives: 'photo-1514282401047-d79a71a590e8',
  fiji: 'photo-1540541338287-41700207dee6',
};

// Curated destination imagery for high-traffic places. The key is a
// lowercased, dash-separated match on the destination name stem.
const DESTINATION_PHOTO_IDS: Record<string, string> = {
  paris: 'photo-1502602898657-3e91760cbb34',
  rome: 'photo-1552832230-c0197dd311b5',
  venice: 'photo-1514890547357-a9ee288728e0',
  florence: 'photo-1541370545574-83ec8bcb1e47',
  'amalfi-coast': 'photo-1516483638261-f4dbaf036963',
  barcelona: 'photo-1583422409516-2895a77efded',
  madrid: 'photo-1539037116277-4db20889f2d4',
  seville: 'photo-1559070081-648fb1c75afa',
  lisbon: 'photo-1555881400-74d7acaacd8b',
  porto: 'photo-1555881400-74d7acaacd8b',
  santorini: 'photo-1533105079780-92b9be482077',
  athens: 'photo-1555993539-1732b0258235',
  mykonos: 'photo-1570077188670-e3a8d69ac5ff',
  tokyo: 'photo-1493976040374-85c8e12f0c0e',
  kyoto: 'photo-1528360983277-13d401cdc186',
  osaka: 'photo-1590559899731-a382839e5549',
  hanoi: 'photo-1528127269322-539801943592',
  'ho-chi-minh-city': 'photo-1583417319070-4a69db38a482',
  'ha-long-bay': 'photo-1528127269322-539801943592',
  bangkok: 'photo-1528181304800-259b08848526',
  'phi-phi-islands': 'photo-1552465011-b4e21bf6e79a',
  'chiang-mai': 'photo-1528181304800-259b08848526',
  bali: 'photo-1537996194471-e657df975ab4',
  ubud: 'photo-1518509562904-e7ef99cddc85',
  reykjavik: 'photo-1504284402738-4f43fcdd19d5',
  marrakech: 'photo-1489749798305-4fea3ae63d43',
  cairo: 'photo-1539650116574-75c0c6d73f6e',
  istanbul: 'photo-1527838832700-5059252407fa',
  cappadocia: 'photo-1527838832700-5059252407fa',
  cusco: 'photo-1526392060635-9d6019884377',
  'machu-picchu': 'photo-1526392060635-9d6019884377',
  'mexico-city': 'photo-1512813195386-6cf811ad3542',
  tulum: 'photo-1518638150340-f706e86654de',
  queenstown: 'photo-1469854523086-cc02fe5d8800',
  auckland: 'photo-1507699622108-4be3abd695ad',
};

function unsplashUrl(photoId: string, width: number, height: number): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`;
}

export function getCountryHero(countryNameOrId: string, width = 1600, height = 900): string {
  const key = countryNameOrId.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  // Try direct ID match
  for (const [id, photo] of Object.entries(COUNTRY_PHOTO_IDS)) {
    if (id === key || id.replace(/[-\s]/g, '') === key) {
      return unsplashUrl(photo, width, height);
    }
  }
  // Fallback: unsplash search (may fail — cards are designed to look great without)
  const q = encodeURIComponent(`${countryNameOrId} landscape travel`);
  return `https://source.unsplash.com/${width}x${height}/?${q}`;
}

function normaliseDestinationKey(name: string): string {
  return name
    .split('(')[0]
    .split('/')[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function getDestinationPhoto(destinationName: string, width = 800, height = 600): string {
  const key = normaliseDestinationKey(destinationName);
  const photo = DESTINATION_PHOTO_IDS[key];
  if (photo) return unsplashUrl(photo, width, height);

  // Also try a prefix match (e.g. "ha-long-bay-cruise" → "ha-long-bay")
  for (const [id, p] of Object.entries(DESTINATION_PHOTO_IDS)) {
    if (key.startsWith(id)) return unsplashUrl(p, width, height);
  }

  const clean = destinationName.split('(')[0].split('/')[0].trim();
  const q = encodeURIComponent(`${clean} travel`);
  return `https://source.unsplash.com/${width}x${height}/?${q}`;
}

export function getDestinationThumbnail(destinationName: string): string {
  return getDestinationPhoto(destinationName, 600, 400);
}

export function getCountryPhotoStrip(countryName: string): string[] {
  const key = countryName.toLowerCase().replace(/\s+/g, '');
  const hero = COUNTRY_PHOTO_IDS[key];
  if (hero) {
    return [
      unsplashUrl(hero, 1200, 800),
      unsplashUrl(hero, 1200, 800),
      unsplashUrl(hero, 1200, 800),
    ];
  }
  const q = encodeURIComponent(`${countryName} travel`);
  return [
    `https://source.unsplash.com/1200x800/?${q}&sig=1`,
    `https://source.unsplash.com/1200x800/?${q}&sig=2`,
    `https://source.unsplash.com/1200x800/?${q}&sig=3`,
  ];
}

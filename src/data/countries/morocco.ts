import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Morocco
 * 4. Consistently ranked in top Morocco destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Marrakech: gateway, UNESCO medina, bucket-list souks and Djemaa el-Fna (1,2,3,4,5) ✓
 * - Fes: UNESCO medina, world's oldest university, most intact medieval city (1,3,4,5) ✓
 * - Sahara/Merzouga: bucket-list dune experience unavailable elsewhere (3,4,5) ✓
 * - Ait Benhaddou: UNESCO ksar, most filmed location in Morocco (1,3,4,5) ✓
 * - Chefchaouen: globally iconic blue city, broad appeal (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Casablanca: largely commercial, lacks singular experience (fails 3)
 * - Rabat: pleasant but administrative, limited bucket-list pull (fails 3,5)
 * - Agadir: primarily beach resort, niche appeal (fails 3,5)
 * - Essaouira: lovely but slow-paced, limited reach (fails 5)
 * - Others: day-trip scale or too niche
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // IMPERIAL CITIES
  // ═══════════════════════════════════════════
  {
    id: 'marrakech',
    name: 'Marrakech',
    emoji: '🕌',
    colour: '#C1440E',
    airport: 'RAK',
    region: 'IMPERIAL CITIES',
    brief:
      "Morocco's most visited city packs an extraordinary sensory experience into a walled medina that has barely changed in a thousand years. Djemaa el-Fna, the great main square, transforms from a daytime market of snake charmers and orange juice stalls into an open-air theatre of musicians, storytellers, and food carts at dusk. Spend a full day getting lost in the colour-coded souks, bargaining for leather goods in Souk Cherratin and spices in Souk el-Attarine, and visiting the exquisitely tiled Bahia Palace and the stark ruins of El Badi Palace. A third day fits the Yves Saint Laurent Museum, the Majorelle Garden's cobalt-blue pavilions, and a hammam session in the mellah. Four days allows a half-day excursion to the Ourika Valley in the Atlas foothills.",
    tags: ['Medina', 'Souks', 'Hammam', 'Majorelle Garden', 'Street Food'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'fes',
    name: 'Fes',
    emoji: '🏺',
    colour: '#A05C1A',
    airport: 'FEZ',
    region: 'IMPERIAL CITIES',
    brief:
      "The world's largest car-free urban area and arguably the most intact medieval city on earth, where 9,000 streets and alleys form a living labyrinth that can still disorient even after three days. The tanneries of Chouara, where leather hides have been dyed in honeycomb stone vats using the same methods since the 11th century, are Morocco's most iconic sight and best viewed from a terrace above. The al-Qarawiyyin mosque complex, founded in 859 AD, lays claim to being the world's oldest continuously operating university. A second day covers the Bou Inania Madrasa, the cavernous Al-Attarine spice souk, and the Jewish mellah quarter with its rooftop views over the entire medina.",
    tags: ['Medieval Medina', 'Tanneries', 'Madrasas', 'UNESCO', 'Ceramics'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'chefchaouen',
    name: 'Chefchaouen',
    emoji: '💙',
    colour: '#4A7FBF',
    airport: 'FEZ',
    region: 'IMPERIAL CITIES',
    brief:
      "The celebrated Blue City tumbles down a Rif Mountain ravine in every shade of indigo, cobalt, and sky blue, making it arguably the most photogenic town in Africa. Founded in 1471 as a refuge for Andalusian Muslims and Jews, its winding kasbah streets remain largely untouched and a pleasure to wander without agenda. Spend a morning photographing the cascading blue steps and flower-filled windowsills of the medina quarter, then hike up to the Spanish Mosque ruin for the sweeping valley panorama at golden hour. The second day allows a guided walk to the Ras el-Maa waterfall and a cooking class focused on Rif Mountain cuisine.",
    tags: ['Blue Medina', 'Photography', 'Mountain Hiking', 'Rif Culture'],
    recommendedDays: [2, 2],
    accessNote: 'Best accessed from Fes (4hr by bus or shared taxi)',
  },
  {
    id: 'rabat',
    name: 'Rabat',
    emoji: '🏛️',
    colour: '#2E7D9E',
    airport: 'CMN',
    region: 'IMPERIAL CITIES',
    brief:
      "Morocco's capital is a refreshingly unhurried alternative to Marrakech, with a UNESCO-listed medina that feels authentically lived-in rather than tourist-facing. The Hassan Tower, a 12th-century minaret that was meant to be the world's tallest mosque, stands alongside the Mausoleum of Mohammed V in a vast marble plaza that is one of the most elegant royal monuments in North Africa. Spend the morning in the Kasbah of the Udayas, a whitewashed Andalusian fortification above the Atlantic where residents hang laundry between bougainvillea-draped arches. An afternoon covers the Royal Palace gates, the archaeological museum, and the Chellah necropolis where storks nest atop Roman ruins.",
    tags: ['Royal Monuments', 'UNESCO Medina', 'Kasbah', 'Roman Ruins'],
    recommendedDays: [1, 2],
    accessNote: 'Accessible from Casablanca (CMN) by train in 1hr',
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    emoji: '🕍',
    colour: '#1A6B8A',
    airport: 'CMN',
    region: 'IMPERIAL CITIES',
    brief:
      "Morocco's commercial capital and main international gateway is primarily a transit city, but the Hassan II Mosque justifies a dedicated visit on its own terms. The mosque, completed in 1993, is the seventh-largest in the world and the only one in Morocco open to non-Muslims, with a retractable roof, a floor of glass revealing the Atlantic Ocean below, and a 210-metre minaret visible from 50 kilometres out at sea. The Corniche seafront promenade, the Art Deco architecture of the central ville nouvelle, and a lunch of fresh seafood at La Sqala are the remaining highlights. One to two days is ample before continuing by train to Marrakech, Fes, or Rabat.",
    tags: ['Hassan II Mosque', 'Art Deco', 'Seafront', 'Gateway City'],
    recommendedDays: [1, 2],
  },
  {
    id: 'tangier',
    name: 'Tangier',
    emoji: '⚓',
    colour: '#3D6B6B',
    airport: 'TNG',
    region: 'IMPERIAL CITIES',
    brief:
      "The gateway between Africa and Europe perches at the northern tip of Morocco where the Atlantic meets the Mediterranean, a city long associated with writers, artists, and spies drawn to its louche international character. The medina's Petit Socco square was once the café haunt of William S. Burroughs, Tennessee Williams, and the Beat Generation, and several of those old cafes still serve mint tea under crumbling arches. Spend a morning in the kasbah museum for sweeping views of the Strait of Gibraltar and Spain's coastline barely 15 kilometres away, then visit the American Legation, the oldest US diplomatic building outside the United States. A second day suits a excursion to the dramatic Hercules Caves and the Roman ruins at Volubilis.",
    tags: ['Strait of Gibraltar', 'Beat Generation History', 'Kasbah', 'Roman Ruins'],
    recommendedDays: [2, 2],
  },

  // ═══════════════════════════════════════════
  // SAHARA & SOUTH
  // ═══════════════════════════════════════════
  {
    id: 'merzouga',
    name: 'Sahara Desert / Merzouga',
    emoji: '🐪',
    colour: '#D4822A',
    airport: 'RAK',
    region: 'SAHARA & SOUTH',
    brief:
      "The Erg Chebbi dunes near Merzouga are among the most spectacular in the entire Sahara, rising to 150 metres and glowing deep amber at sunrise and sunset in a way that photographs simply cannot capture. The quintessential bucket-list experience is a camel trek at dusk into the dunes to a Berber desert camp, where dinner is cooked over charcoal and the sky fills with more stars than most visitors have ever seen. A second night in the desert allows a pre-dawn climb to the highest dune crest for sunrise, then a morning of sandboarding before the heat sets in. The drive from Marrakech via the Draa Valley and Dades Gorge is a journey as rewarding as the destination.",
    tags: ['Sahara Dunes', 'Camel Trekking', 'Desert Camping', 'Stargazing', 'Berber Culture'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Best reached via 2-day drive from Marrakech (RAK) through Ouarzazate',
  },
  {
    id: 'aitbenhaddou',
    name: 'Ait Benhaddou',
    emoji: '🏰',
    colour: '#B5581A',
    airport: 'RAK',
    region: 'SAHARA & SOUTH',
    brief:
      "The most famous ksar in Morocco is a UNESCO World Heritage Site so visually arresting that it has served as the backdrop for dozens of films and television series, including Gladiator, The Mummy, Game of Thrones, and Lawrence of Arabia. The fortified earthen city rises in tiered towers of reddish-brown pisé clay above the dry Ounila riverbed, and a walk to the upper granary for views across the valley is one of the most memorable short hikes in Morocco. A guide from one of the families that still lives inside the ksar can reveal the history of each neighbourhood and the clay construction techniques passed down over generations. Ait Benhaddou is best combined with Ouarzazate as a single full day.",
    tags: ['UNESCO', 'Film Location', 'Kasbahs', 'Earthen Architecture'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    mustVisit: true,
    accessNote: 'Day trip from Ouarzazate (30min) or en route from Marrakech (RAK)',
  },
  {
    id: 'ouarzazate',
    name: 'Ouarzazate',
    emoji: '🎬',
    colour: '#9E4E1A',
    airport: 'RAK',
    region: 'SAHARA & SOUTH',
    brief:
      "Dubbed the 'Hollywood of Morocco', this desert gateway town sits at 1,160 metres on the southern slopes of the High Atlas, where clear light and dramatic scenery have attracted filmmakers for decades. The Atlas Film Studios are the largest in Africa and still-active sets from Ben-Hur to Babel can be toured on a guided walk through Moroccan riads, Roman coliseums, and Egyptian temples constructed from painted polystyrene. The Taourirt Kasbah, a clay-brick palace complex that once housed the pasha's 300-strong family, is the most impressive in the region and warrants a couple of hours with a guide. Ouarzazate works perfectly as an overnight stop between Marrakech and the Sahara.",
    tags: ['Film Studios', 'Desert Gateway', 'Kasbahs', 'High Atlas Views'],
    recommendedDays: [1, 2],
    accessNote: 'Accessible from Marrakech (RAK) by bus or shared taxi (4hr)',
  },
  {
    id: 'dadesvalley',
    name: 'Dades Valley',
    emoji: '🌄',
    colour: '#8B4513',
    airport: 'RAK',
    region: 'SAHARA & SOUTH',
    brief:
      "The Dades Valley stretches along a fertile river corridor between the High Atlas and the Jbel Saghro mountains, often called the Valley of a Thousand Kasbahs for the crumbling earthen fortresses that punctuate every bend in the road. The road climbing above Boumalne Dades narrows into dramatic switchbacks at the Dades Gorge, where ochre rock walls close in to barely a car-width as the road follows the river upstream. In spring, the valley floor between Skoura and Kelaa M'Gouna bursts with rose plantations, and the rose water distilleries open for free tastings. The route connects Ouarzazate to the Sahara and rewards a leisurely overnight stop.",
    tags: ['Gorge Scenery', 'Rose Valley', 'Kasbahs', 'Road Trip'],
    recommendedDays: [1, 2],
    accessNote: 'En route between Ouarzazate and Merzouga via Marrakech (RAK)',
  },
  {
    id: 'todragorge',
    name: 'Todra Gorge',
    emoji: '🪨',
    colour: '#7A4F2E',
    airport: 'RAK',
    region: 'SAHARA & SOUTH',
    brief:
      "One of the most dramatic natural formations in North Africa, where the Todra River has carved a slot canyon up to 300 metres tall but barely 10 metres wide at its narrowest point. Early morning is the best time to walk the canyon floor, when shafts of sunlight pierce the gap between the walls and illuminate the river in brilliant colours while the rock climbers are just beginning their ascent. Todra is a world-renowned sport-climbing destination with hundreds of bolted routes graded from beginner to expert. The gorge is easily combined with Tinghir town and the nearby Dades Valley as part of a broader Sahara circuit.",
    tags: ['Canyon Hiking', 'Rock Climbing', 'Desert Scenery', 'Photography'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip via Marrakech (RAK); best combined with Dades Valley',
  },

  // ═══════════════════════════════════════════
  // COAST & MOUNTAINS
  // ═══════════════════════════════════════════
  {
    id: 'essaouira',
    name: 'Essaouira',
    emoji: '🌊',
    colour: '#2E7B8A',
    airport: 'RAK',
    region: 'COAST & MOUNTAINS',
    brief:
      "A wind-swept Atlantic port town enclosed in 18th-century Portuguese ramparts, with a UNESCO-listed medina painted entirely in blue and white and a creative, bohemian character utterly unlike Marrakech or Fes. The ramparts themselves are the best place to start, walking the Skala de la Ville clifftop cannons at sunset with the ocean crashing below. The medina's fish market serves the morning's catch grilled on the spot within minutes of landing. Essaouira hosts the Gnaoua World Music Festival each June, drawing hundreds of thousands of visitors to trance music performances on the beach, and the coast's near-constant wind makes it one of the best windsurfing and kitesurfing spots in Africa.",
    tags: ['Atlantic Ramparts', 'UNESCO Medina', 'Windsurfing', 'Gnaoua Music', 'Seafood'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Marrakech (RAK) by bus or taxi (3hr)',
  },
  {
    id: 'agadir',
    name: 'Agadir',
    emoji: '🏖️',
    colour: '#D4A017',
    airport: 'AGA',
    region: 'COAST & MOUNTAINS',
    brief:
      "Morocco's premier beach resort was rebuilt from scratch after a devastating 1960 earthquake and has since grown into a modern, resort-focused city with a long sandy bay and a reliably sunny climate almost year-round. The 10-kilometre beach promenade backed by palms and hotels is ideal for a leisurely morning walk, and the reconstructed Kasbah hill above the city offers panoramic views over the bay and a rebuilt facsimile of the original fortifications. The Souk El Had, one of the largest traditional markets in Morocco, fills a vast covered complex with spices, argan oil products, and Berber jewellery. Agadir serves as the gateway for excursions into the Anti-Atlas Mountains, Paradise Valley's natural pools, and the argan forests around Taroudant.",
    tags: ['Beach Resort', 'Argan Oil Country', 'Anti-Atlas Day Trips', 'Souk El Had'],
    recommendedDays: [2, 3],
  },
  {
    id: 'atlasimliil',
    name: 'Atlas Mountains / Imlil',
    emoji: '⛰️',
    colour: '#5A7A3A',
    airport: 'RAK',
    region: 'COAST & MOUNTAINS',
    brief:
      "The High Atlas Mountains rise directly behind Marrakech and the village of Imlil at 1,740 metres is the standard base for trekking to the summit of Jebel Toubkal, the highest peak in North Africa at 4,167 metres. The two-day Toubkal summit route via the Neltner refuge hut is the most popular trekking route in Morocco, requiring no technical climbing equipment in summer but crampons and ice axes from November to April. Even without summiting, the walk from Imlil up the Mizane Valley through walnut and apple orchards to the Sidi Chamarouch shrine is rewarding in itself. A stay in a traditional Berber guesthouse in Imlil or Aroumd village, with a home-cooked tagine and mountain silence, is one of the most authentic experiences Morocco offers.",
    tags: ['Toubkal Summit', 'Berber Villages', 'Mountain Trekking', 'High Atlas'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Marrakech (RAK) by taxi in 1.5hr',
  },
];

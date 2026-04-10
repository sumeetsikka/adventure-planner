import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Mexico
 * 4. Consistently ranked in top Mexico destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Mexico City: gateway, cultural capital, UNESCO historic centre, broadest appeal (1,2,3,4,5) ✓
 * - Tulum: cliffside ruins over Caribbean, cenotes, globally recognised (1,3,4,5) ✓
 * - Chichen Itza: New Wonder of the World, UNESCO, universally bucket-listed (1,3,4,5) ✓
 * - Oaxaca: UNESCO city, mezcal origin, food capital of Mexico, Monte Alban ruins (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Cancun: resort zone lacks singular cultural depth despite gateway status (fails 3)
 * - Playa del Carmen: excellent but similar experience to broader Riviera Maya (fails 3)
 * - Merida: wonderful colonial city but appeal is somewhat specialist (fails 3,5)
 * - San Cristobal: magnificent highland town but niche, limited international profile (fails 2,5)
 * - Guanajuato: highly ranked but more niche European-style appeal (fails 5)
 * - Puerto Vallarta: popular but multiple comparable Pacific beach towns (fails 3)
 * - Cabo San Lucas: luxury resort destination without singular cultural hook (fails 1,3)
 * - Others: strong regional appeal but fall short of must-visit threshold
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // MEXICO CITY & CENTRAL
  // ═══════════════════════════════════════════
  {
    id: 'mexico-city',
    name: 'Mexico City',
    emoji: '🏛️',
    colour: '#C0392B',
    airport: 'MEX',
    region: 'MEXICO CITY & CENTRAL',
    brief:
      "One of the great megacities of the world and the cultural, gastronomic, and historical capital of Latin America, with enough depth to absorb five to seven days without effort. The UNESCO-listed historic centre anchors day one: the vast Zocalo square, the Metropolitan Cathedral built over Aztec rubble, and the Templo Mayor ruins excavated beneath the city centre form a layered 700-year timeline in a single morning. Day two: Chapultepec Park and the extraordinary Museo Nacional de Antropologia, home to the Aztec Sun Stone and the most comprehensive pre-Columbian collection anywhere. Day three: the bohemian borough of Coyoacan, birthplace of Frida Kahlo, where the Casa Azul museum and the nearby Leon Trotsky Museum sit within a few cobblestoned blocks of each other. Day four: the Xochimilco floating gardens, a UNESCO World Heritage Site, where mariachi-laden trajinera boats drift through ancient Aztec canals amid flower nurseries and street food vendors. Reserve a fifth day for a half-day trip to the Pyramid of the Sun and Moon at Teotihuacan, one of the largest pre-Columbian cities ever built, just 50 kilometres northeast of the city.",
    tags: ['UNESCO', 'Museums', 'Frida Kahlo', 'Aztec History', 'Food Scene'],
    recommendedDays: [5, 7],
    mustVisit: true,
  },
  {
    id: 'guanajuato',
    name: 'Guanajuato',
    emoji: '🎭',
    colour: '#F39C12',
    airport: 'BJX',
    region: 'MEXICO CITY & CENTRAL',
    brief:
      "A UNESCO World Heritage colonial city tucked into a narrow ravine in central Mexico, famous for its rainbow-painted facades, its web of subterranean car tunnels carved from old silver-mine shafts, and the unsettling Mummy Museum housing naturally mummified bodies unearthed from the local cemetery. The University of Guanajuato's neoclassical facade looms over the centro historico and the steep stone alleyways called callejones wind between hillside homes, culminating in the famous Callejon del Beso where legend has it lovers kiss from balconies just 68 centimetres apart. Evenings are animated by student callejoneadas, roving bands who lead singing processions through the lanes. Two days covers the city thoroughly, with a half-day trip to the silver-mining ghost town of Real de Catorce or the wine region of Dolores Hidalgo fitting into a third.",
    tags: ['Colonial Architecture', 'Mummy Museum', 'Tunnel Roads', 'Silver Mining History'],
    recommendedDays: [2, 3],
  },
  {
    id: 'oaxaca',
    name: 'Oaxaca',
    emoji: '🍫',
    colour: '#6E2C00',
    airport: 'OAX',
    region: 'MEXICO CITY & CENTRAL',
    brief:
      "Mexico\'s undisputed food capital and the spiritual home of mezcal, set in a richly indigenous highland valley that has been producing extraordinary culture for three thousand years. The UNESCO-listed city centre is a feast of green quarry-stone churches, lively markets overflowing with mole negro paste, chocolate, and tlayudas, and galleries showing the best of Zapotec and contemporary Mexican art. The Monte Alban archaeological site crowns a flattened hilltop above the city with pyramids, ball courts, and carved stone monuments dating from 500 BC, making it one of the earliest urban centres in the Americas. Mezcal producers in the surrounding Sierra Juarez villages offer hands-on visits to palenques where smoky spirits are distilled using methods unchanged for centuries. A fourth day fits a visit to the weavers\' village of Teotitlan del Valle and the Hierve el Agua mineral spring formations that look like petrified waterfalls.",
    tags: ['Food Capital', 'Mezcal', 'Monte Alban Ruins', 'Indigenous Culture'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'san-cristobal-de-las-casas',
    name: 'San Cristobal de las Casas',
    emoji: '🌄',
    colour: '#7D3C98',
    airport: 'OAX',
    region: 'MEXICO CITY & CENTRAL',
    brief:
      "A colonial highland town at 2,200 metres in Chiapas, surrounded by misty pine forests and dozens of indigenous Tzotzil and Tzeltal villages where ancient Maya traditions are maintained with remarkable vitality. The cobblestoned centro historico is lined with amber shops, textile cooperatives, and cafe-bars selling locally grown coffee at high-altitude cool temperatures that make it feel entirely unlike coastal Mexico. Day trips from San Cristobal are exceptional: the indigenous church of San Juan Chamula, where Catholic imagery merges with shamanic healing rituals, candles, and Pox spirit offerings, is one of the most unusual religious experiences in the Americas. The canyons and waterfalls of El Chiflón and Lagunas de Montebello national park fill a second day trip.",
    tags: ['Highland Town', 'Indigenous Villages', 'Shamanic Church', 'Coffee Country'],
    recommendedDays: [2, 3],
    accessNote: 'Fly via Mexico City (MEX) or Oaxaca (OAX) then transfer by bus',
  },
  {
    id: 'palenque',
    name: 'Palenque',
    emoji: '🏺',
    colour: '#1E8449',
    airport: 'OAX',
    region: 'MEXICO CITY & CENTRAL',
    brief:
      "One of the most atmospheric Maya ruins in Mexico, where palatial stone temples emerge from the edge of dense Chiapas jungle and howler monkeys call from the canopy above. The Temple of Inscriptions houses the tomb of King Pakal, discovered intact beneath a nine-storey pyramid in 1952, and the carved sarcophagus lid is among the most celebrated artefacts in pre-Columbian archaeology. An early morning arrival before tour groups lets you walk the site in eerie quiet, with low mist threading between the temples. The Agua Azul cascades, a series of brilliant turquoise waterfalls an hour away, and the smaller Misol-Ha waterfall make the afternoon worthwhile before an overnight in the nearby town.",
    tags: ['Jungle Ruins', 'Maya Archaeology', 'Waterfall', 'King Pakal Tomb'],
    recommendedDays: [2, 2],
    accessNote: 'Accessible from San Cristobal (5hr bus) or via Villahermosa',
  },

  // ═══════════════════════════════════════════
  // YUCATAN PENINSULA
  // ═══════════════════════════════════════════
  {
    id: 'cancun',
    name: 'Cancun',
    emoji: '🏖️',
    colour: '#17A589',
    airport: 'CUN',
    region: 'YUCATAN PENINSULA',
    brief:
      "The main international gateway to the Yucatan Peninsula, where a 25-kilometre hotel zone of all-inclusive resorts lines a barrier island facing the translucent Caribbean Sea. The beach and water quality along Zona Hotelera is genuinely world-class: the Caribbean here is an extraordinary shade of jade, calm, warm, and shallow. Cancun\'s nightlife on Boulevard Kukulkan is among the most energetic in all of Mexico, with large-format clubs, rooftop bars, and international DJs catering to the resort crowd. Three to four days is the right amount to use Cancun as a base for day trips to Chichen Itza, Isla Mujeres, and the Cancun Underwater Museum\'s submerged sculpture garden.",
    tags: ['Caribbean Beach', 'Nightlife', 'Resort Zone', 'Day Trip Hub'],
    recommendedDays: [3, 4],
  },
  {
    id: 'tulum',
    name: 'Tulum',
    emoji: '🌅',
    colour: '#D4AC0D',
    airport: 'CUN',
    region: 'YUCATAN PENINSULA',
    brief:
      "The only Maya archaeological site positioned on a cliff directly above the Caribbean Sea, where the Castillo pyramid stands against a backdrop of turquoise water that is arguably the most photogenic ruin setting in the world. Beyond the clifftop site, Tulum\'s beach zone stretches south along a pristine white-sand coastline lined with bohemian boutique hotels, open-air beach clubs, and some of Mexico\'s most celebrated restaurants. The cenotes of the surrounding jungle are Tulum\'s other great draw: Gran Cenote, Dos Ojos, and Cenote Calavera are freshwater sinkholes with crystalline visibility and dramatic underwater cave systems, accessible for snorkelling and open-water diving. Two days covers the ruins, a cenote tour, and a beach club sunset; a third day fits a day trip into the Sian Ka\'an Biosphere Reserve.",
    tags: ['Clifftop Ruins', 'Cenotes', 'Beach Clubs', 'Biosphere Reserve'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: '2hr south of Cancun (CUN) by bus or shared van',
  },
  {
    id: 'playa-del-carmen',
    name: 'Playa del Carmen',
    emoji: '🎶',
    colour: '#E74C3C',
    airport: 'CUN',
    region: 'YUCATAN PENINSULA',
    brief:
      "A lively beach town midway along the Riviera Maya that manages to balance a thriving local Mexican community with a well-developed tourism scene, making it feel more authentic than Cancun\'s resort strip. La Quinta Avenida (Fifth Avenue) is a pedestrianised kilometre of restaurants, bars, souvenir shops, and mezcal tasting rooms that is genuinely enjoyable to wander day or night. The diving and snorkelling off Playa del Carmen is some of the best in the Caribbean: the MUSA underwater museum and the cenote dive sites of the Riviera Maya are accessible from local operators on the main beach. Two to three days allows the beach clubs, a SCUBA diving day trip, and an evening exploring the Colosio neighbourhood\'s street art and taco stands.",
    tags: ['Fifth Avenue', 'Scuba Diving', 'Beach', 'Nightlife'],
    recommendedDays: [2, 3],
    accessNote: '1hr south of Cancun (CUN) by bus or colectivo',
  },
  {
    id: 'chichen-itza',
    name: 'Chichen Itza',
    emoji: '🗿',
    colour: '#784212',
    airport: 'CUN',
    region: 'YUCATAN PENINSULA',
    brief:
      "One of the New Seven Wonders of the World and Mexico\'s most visited archaeological site, the ancient Maya city of Chichen Itza reaches its climax at El Castillo, a perfectly proportioned 30-metre pyramid aligned with astronomical precision so that the equinox sun creates a serpent shadow descending its northern staircase. The site also contains the Great Ball Court, the largest in the ancient Americas, where the acoustic design means a whisper at one end carries clearly to the other 135 metres away. The Sacred Cenote, a natural sinkhole where jade and gold offerings were cast, and the Observatory building for celestial mapping underscore how sophisticated this civilisation was. A single full day is sufficient; arrive at opening at 8am before tour buses from Cancun arrive, and finish at the nearby cenote Ik Kil for a swim.",
    tags: ['New Wonder of the World', 'Maya Ruins', 'UNESCO', 'Pyramid'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    mustVisit: true,
    accessNote: 'Day trip from Cancun (3hr) or Merida (1.5hr)',
  },
  {
    id: 'merida',
    name: 'Merida',
    emoji: '🎨',
    colour: '#F8C471',
    airport: 'MID',
    region: 'YUCATAN PENINSULA',
    brief:
      "The graceful colonial capital of the Yucatan state, nicknamed the White City for its limestone buildings, and one of the best places in Mexico to experience the living Maya culture that surrounds it. The Plaza Grande and Cathedral of San Ildefonso anchor a compact historic centre of pastel-painted mansions, many of which date to the 19th-century henequen (sisal fibre) boom that made Yucatan\'s elite extraordinarily wealthy. The local cuisine is distinct from the rest of Mexico: cochinita pibil (slow-roasted pork in achiote and citrus buried in a pit), sopa de lima, and papadzules are best found at the Lucas de Galvez market. Two to three days in Merida suits exploration of the city, day trips to Chichen Itza and the flamingo colonies at Celestun, and evenings at the free dance performances held in the main plaza every night of the week.",
    tags: ['Colonial City', 'Maya Culture', 'Cochinita Pibil', 'Flamingo Day Trips'],
    recommendedDays: [2, 3],
  },
  {
    id: 'isla-holbox',
    name: 'Isla Holbox',
    emoji: '🦈',
    colour: '#85C1E9',
    airport: 'CUN',
    region: 'YUCATAN PENINSULA',
    brief:
      "A car-free island off the northern tip of the Yucatan Peninsula, where sandy streets lined with colourful wooden buildings and golf carts lead to an extraordinary shallow sea where the Gulf of Mexico and the Caribbean converge. Between June and September, Holbox is one of the few places on Earth where you can swim with whale sharks, the world\'s largest fish, in a UNESCO-protected biosphere reserve just offshore. The island\'s bioluminescent plankton lights the water electric blue on dark nights around the western sandbar, and the sheer volume and variety of birds visible from the lagoon boardwalk is remarkable. Two to three days is the right amount: one day for the whale shark tour or bioluminescence night trip, another for the nearby Isla de los Pajaros bird sanctuary and a slow evening with fresh ceviche at a beachfront palapa.",
    tags: ['Whale Sharks', 'Bioluminescence', 'Car-Free Island', 'Birdwatching'],
    recommendedDays: [2, 3],
    accessNote: 'Ferry from Chiquila (2.5hr from Cancun CUN by bus then 30-min ferry)',
  },
  {
    id: 'valladolid',
    name: 'Valladolid',
    emoji: '🏛️',
    colour: '#AED6F1',
    airport: 'CUN',
    region: 'YUCATAN PENINSULA',
    brief:
      "A beautifully preserved colonial town midway between Cancun and Merida that makes an ideal stopover or day trip on the Yucatan circuit. The town\'s candy-coloured 16th-century streets converge on the San Servacio Cathedral and a central park filled with local vendors selling marquesitas (crispy crepe rolls) and a charming evening atmosphere quite distinct from the tourist coast. The Cenote Zaci sits in an open-air cavern right in the town centre, its turquoise pool dramatically lit from above. The nearby Cenote Ik Kil, El Balaam Maya ruins, and several smaller cenotes along the Ruta de los Cenotes make Valladolid an ideal one-day base for combining colonial charm with swimming in natural sinkholes.",
    tags: ['Colonial Town', 'Cenotes', 'Local Food', 'El Balaam Ruins'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Cancun (2hr) or Merida (1.5hr)',
  },

  // ═══════════════════════════════════════════
  // PACIFIC COAST
  // ═══════════════════════════════════════════
  {
    id: 'puerto-vallarta',
    name: 'Puerto Vallarta',
    emoji: '🐋',
    colour: '#E8A0BF',
    airport: 'PVR',
    region: 'PACIFIC COAST',
    brief:
      "A Pacific resort city where a lively colonial old town meets a string of beaches and one of the best whale-watching corridors in the Americas. The cobblestoned Zona Romantica is Puerto Vallarta\'s most charming quarter: the Church of Our Lady of Guadalupe presides over a sea-view malecón lined with contemporary sculpture, while the surrounding streets are packed with LGBTQ-friendly bars, art galleries, and seafood restaurants. From December to March, humpback whales breed and raise calves in Banderas Bay directly offshore, and the boat trips to watch them breach and spy-hop are among the most reliable in Mexico. A fourth day fits a hike through the Sierra Madre to the Huichol-indigenous village of San Sebastian del Oeste or a boat trip to the hidden Yelapa beach cove.",
    tags: ['Whale Watching', 'Old Town', 'Beach', 'LGBTQ-Friendly'],
    recommendedDays: [3, 4],
  },
  {
    id: 'sayulita',
    name: 'Sayulita',
    emoji: '🏄',
    colour: '#F0B27A',
    airport: 'PVR',
    region: 'PACIFIC COAST',
    brief:
      "A surf-and-soul village an hour north of Puerto Vallarta that has evolved from a fishing hamlet into one of Mexico\'s most beloved bohemian getaways without losing its essential character. The main beach faces a gentle left-hand point break that is perfect for beginner and intermediate surfers, with several surf schools offering two-hour lessons that reliably get beginners standing. Sayulita\'s central plaza and surrounding streets are a riot of colour: hand-painted tiles, Huichol yarn art, and hammock-strewn courtyards front the taco stands and mezcal bars that keep things lively into the evening. Two to three days here suits surfing in the mornings, exploring the Saturday tianguis artisan market, and taking a day trip to the harder-to-reach Playa Los Muertos for pristine snorkelling.",
    tags: ['Surfing', 'Boho Vibe', 'Artisan Market', 'Pacific Beach'],
    recommendedDays: [2, 3],
    accessNote: '1hr north of Puerto Vallarta (PVR) by bus or taxi',
  },

  // ═══════════════════════════════════════════
  // BAJA CALIFORNIA
  // ═══════════════════════════════════════════
  {
    id: 'cabo-san-lucas',
    name: 'Cabo San Lucas',
    emoji: '⛵',
    colour: '#F1C40F',
    airport: 'SJD',
    region: 'BAJA CALIFORNIA',
    brief:
      "A glamorous resort town at the southern tip of the Baja California peninsula, where the Pacific Ocean meets the Sea of Cortez at Land\'s End, an arc of sea-carved granite arches that ranks among Mexico\'s most photographed natural landmarks. The Arch of Cabo San Lucas is accessible by glass-bottomed boat from the marina, and the surrounding coves shelter a colony of sea lions that are visible at close range. From January to March, grey whales migrate through the waters offshore and humpbacks perform spectacularly close to the cape. The marina strip is lined with open-air bars, sport-fishing charter operators, and some of Mexico\'s most extravagant nightclubs. Three to four days suits the arch boat trip, a whale-watching excursion, deep-sea fishing, and an ATV ride through the Baja desert.",
    tags: ['Land\'s End Arch', 'Whale Watching', 'Sport Fishing', 'Luxury Nightlife'],
    recommendedDays: [3, 4],
  },
  {
    id: 'la-paz',
    name: 'La Paz',
    emoji: '🦭',
    colour: '#5DADE2',
    airport: 'LAP',
    region: 'BAJA CALIFORNIA',
    brief:
      "The laid-back capital of Baja California Sur is the launching point for some of the most extraordinary marine wildlife encounters in North America, in a Sea of Cortez that Jacques Cousteau once called the world\'s aquarium. Between November and March, whale sharks gather in enormous numbers in La Paz Bay and snorkelling with them, some exceeding 10 metres in length, is considered among the best wildlife experiences in the world. California sea lions have a permanent colony on Los Islotes, a small rocky island reachable by a 40-minute boat trip, where the animals are famously bold and playful underwater. The malecón sunset promenade, lined with ceviche stands and palapa bars, and the day trip to the extraordinary Espiritu Santo Island biosphere reserve round out a genuinely exceptional two to three days.",
    tags: ['Whale Sharks', 'Sea Lions', 'Sea of Cortez', 'Island Biosphere'],
    recommendedDays: [2, 3],
  },
];

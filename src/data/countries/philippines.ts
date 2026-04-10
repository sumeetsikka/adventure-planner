import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in the Philippines
 * 4. Consistently ranked in top Philippines destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Manila: gateway (2,4,5) ✓
 * - El Nido / Palawan: world-class island seascape, bucket-list (1,3,4,5) ✓
 * - Coron: world's top shipwreck diving, unique seascape (3,4,5) ✓
 * - Bohol: Chocolate Hills, tarsiers, unique (1,3,4,5) ✓
 * - Siargao: Southeast Asia's surf capital, bucket-list (3,4,5) ✓
 * - Boracay: White Beach, internationally iconic (3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Cebu: great gateway but similar beaches available elsewhere (fails 3)
 * - Batanes: incredible but remote and niche (fails 5)
 * - Sagada: adventure-niche, small audience (fails 5)
 * - Others: too niche, day-trip, or lack broad international recognition
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // LUZON
  // ═══════════════════════════════════════════
  {
    id: 'manila',
    name: 'Manila',
    emoji: '🏙️',
    colour: '#E63946',
    airport: 'MNL',
    region: 'LUZON',
    brief:
      "The Philippines' capital is a chaotic, layered megalopolis that rewards curious travellers who give it time. Day one starts in historic Intramuros, the walled Spanish colonial city, with Fort Santiago and the Manila Cathedral before an afternoon in Binondo, the world's oldest Chinatown. Day two suits Bonifacio Global City for rooftop bars and the National Museum of the Philippines in Rizal Park. Two days is the sweet spot before hopping to the islands, but a third day opens up a day trip to Tagaytay to see Taal Volcano from the crater's rim.",
    tags: ['History', 'Chinatown', 'Night Markets', 'Colonial Architecture'],
    recommendedDays: [2, 3],
  },
  {
    id: 'banaue',
    name: 'Banaue Rice Terraces',
    emoji: '🌾',
    colour: '#6A994E',
    airport: 'MNL',
    region: 'LUZON',
    brief:
      "Carved into the mountains of Ifugao by hand over 2,000 years ago, these UNESCO-listed rice terraces are often called the eighth wonder of the world. Two days allows a proper visit: the first for the famous Banaue viewpoint and a guided walk to Batad's amphitheatre terraces with their waterfall swimming hole. The second day suits the Bangaan village trek and a visit to Banaue Museum to understand Ifugao culture. Getting here requires an overnight bus or private van from Manila, but the terraces are unlike anything else in the country.",
    tags: ['UNESCO', 'Rice Terraces', 'Trekking', 'Ifugao Culture'],
    recommendedDays: [2, 3],
    accessNote: 'Overnight bus or private van from Manila (8-9hrs)',
  },
  {
    id: 'sagada',
    name: 'Sagada',
    emoji: '⛰️',
    colour: '#7B5EA7',
    airport: 'MNL',
    region: 'LUZON',
    brief:
      "A misty mountain village in the Cordillera highlands known for its hanging coffins, cave connections, and pine-scented hiking trails. The signature experience is the Cave Connection tour: crawl, wade, and squeeze through two linked limestone caves by lamplight over about four hours. Echo Valley holds the famous hanging coffins of the Igorot people wedged into cliffside crevices. Two days is ideal, combining the cave tour with a Kiltepan sunrise viewpoint and a stop at Bomod-ok Falls. Pair this with Banaue for an efficient Cordillera loop.",
    tags: ['Caves', 'Hanging Coffins', 'Hiking', 'Mountain Village'],
    recommendedDays: [2, 2],
    accessNote: 'Bus from Manila via Baguio (9-10hrs total)',
  },
  {
    id: 'batanes',
    name: 'Batanes Islands',
    emoji: '🌬️',
    colour: '#3A7CA5',
    airport: 'BSO',
    region: 'LUZON',
    brief:
      "The northernmost islands of the Philippines, just 200 kilometres from Taiwan, feel like a separate country altogether. Rolling green hills, stone Ivatan houses that have weathered typhoons for centuries, dramatic sea cliffs, and a pace of life measured by fishing tides rather than tourist schedules. Two days covers the main Batan Island highlights: the Vayang Rolling Hills, Marlboro Country hills on horseback or motorbike, and the historic Basco lighthouse. A third day suits a boat trip to Sabtang Island and its preserved stone village of Chavayan. Flights are limited and weather-dependent, so build in flexibility.",
    tags: ['Remote Islands', 'Stone Houses', 'Rolling Hills', 'Unique Culture'],
    recommendedDays: [2, 3],
    accessNote: 'Direct flight from Manila (2hrs, limited schedule)',
  },

  // ═══════════════════════════════════════════
  // PALAWAN
  // ═══════════════════════════════════════════
  {
    id: 'elnido',
    name: 'El Nido',
    emoji: '🏝️',
    colour: '#0096C7',
    airport: 'USU',
    region: 'PALAWAN',
    brief:
      "Consistently ranked among the world's best island destinations, El Nido sits at the northern tip of Palawan amid an archipelago of dramatic limestone karsts, hidden lagoons, and coral-rich waters. Three full days are the minimum: Tours A and C cover the Big Lagoon, Small Lagoon, Secret Lagoon, and Cathedral Cave by bangka boat with snorkelling stops. A third day suits kayaking into hidden beaches and a sunset cocktail at a cliffside bar above the town. A fourth day can be spent on the Bacuit Archipelago's quieter islands or beginning the Coron ferry journey south. This is a bucket-list destination with few peers in Southeast Asia.",
    tags: ['Island Hopping', 'Lagoons', 'Snorkelling', 'Limestone Karsts'],
    recommendedDays: [3, 4],
    mustVisit: true,
    accessNote: 'Fly into Puerto Princesa (PPS) then van (5hrs), or direct flight to El Nido (ENI)',
  },
  {
    id: 'coron',
    name: 'Coron',
    emoji: '🤿',
    colour: '#023E8A',
    airport: 'USU',
    region: 'PALAWAN',
    brief:
      "Coron is home to some of the best shipwreck diving on earth: over a dozen Japanese warships sunk during World War II now rest in warm, clear water encrusted with coral and schooling fish. Non-divers are equally rewarded with island-hopping tours to Kayangan Lake (the Philippines' cleanest lake), Twin Lagoon, and the thermal-spring-fed Maquinit Hot Springs at sunset. Two days covers the essential dive sites and island hop; a third day suits Malcapuya Island for powdery white sand and snorkelling. Coron is typically combined with El Nido via a scenic ferry through the Calamian Islands.",
    tags: ['Shipwreck Diving', 'Island Hopping', 'Kayangan Lake', 'WWII History'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Fly into Busuanga (USU) or ferry from El Nido (4-5hrs)',
  },
  {
    id: 'puertoprincesa',
    name: 'Puerto Princesa',
    emoji: '🦅',
    colour: '#2D6A4F',
    airport: 'PPS',
    region: 'PALAWAN',
    brief:
      "The capital of Palawan is the main gateway into the island province and home to the Puerto Princesa Subterranean River, a UNESCO World Heritage Site and one of the New Seven Wonders of Nature. A half-day tour takes a bangka boat deep into the cave where the underground river winds through enormous cathedral-like chambers. One full day covers the river, Honda Bay island hopping for snorkelling, and a local Palaweno dinner in the city. A second day suits the Iwahig Firefly River cruise at dusk and preparation for onwards travel to El Nido.",
    tags: ['Underground River', 'UNESCO', 'Fireflies', 'Island Hopping'],
    recommendedDays: [1, 2],
    accessNote: 'Main gateway city for Palawan with direct international flights',
  },

  // ═══════════════════════════════════════════
  // VISAYAS
  // ═══════════════════════════════════════════
  {
    id: 'cebu',
    name: 'Cebu',
    emoji: '🐋',
    colour: '#F4A261',
    airport: 'CEB',
    region: 'VISAYAS',
    brief:
      "The Philippines' second city is a busy regional hub that also serves as the jumping-off point for some of the Visayas' best experiences. The main city warrants a day: Magellan's Cross, Basilica del Santo Nino, and the excellent street lechon roast pork at Larsian BBQ. The real drawcard is outside the city: whale shark snorkelling in Oslob, canyoneering at Kawasan Falls via the Badian river, and the sardine run dive at Moalboal all sit within a day trip. Two to three days covers city highlights plus two of these excursions, making Cebu an essential regional base.",
    tags: ['Whale Sharks', 'Canyoneering', 'Lechon', 'Diving'],
    recommendedDays: [2, 3],
  },
  {
    id: 'bohol',
    name: 'Bohol',
    emoji: '🍫',
    colour: '#BC6C25',
    airport: 'TAG',
    region: 'VISAYAS',
    brief:
      "Bohol is one of the Philippines' most rewarding islands, packing extraordinary variety into a compact area. The Chocolate Hills are the island's icon: over 1,200 perfectly conical brown mounds spreading across the interior that look surreal from any viewpoint. The Philippine tarsier, one of the world's smallest primates with enormous eyes, can be seen at the Tarsier Sanctuary near Corella. Two days covers a countryside tour hitting both highlights, the Loboc River lunch cruise, and the Baclayon Church. A third day suits the Panglao Island beaches and Balicasag Island diving, which ranks among the best in the Visayas.",
    tags: ['Chocolate Hills', 'Tarsiers', 'Panglao Beach', 'Diving'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: '2hr ferry from Cebu or direct flight (TAG)',
  },
  {
    id: 'boracay',
    name: 'Boracay',
    emoji: '🏄',
    colour: '#48CAE4',
    airport: 'MPH',
    region: 'VISAYAS',
    brief:
      "White Beach on Boracay's western shore is a genuine contender for the world's most beautiful beach: four kilometres of powdery white sand lapped by turquoise water that glows at sunset. The island emerged from a government-mandated rehabilitation in 2018 in better shape than ever, with restrictions on motorised vehicles and improved water quality. Two days gives you the beach itself, a sunset sailing paraw catamaran cruise, cliff jumping at Ariel's Point, and the Station 2 nightlife strip. A third day suits kitesurfing lessons at Bulabog Beach on the windier eastern coast or a snorkelling island-hop.",
    tags: ['White Beach', 'Sailing', 'Kitesurfing', 'Sunsets'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Fly into Caticlan (MPH), then 10min bangka to island',
  },
  {
    id: 'siquijor',
    name: 'Siquijor',
    emoji: '✨',
    colour: '#9B5DE5',
    airport: 'CEB',
    region: 'VISAYAS',
    brief:
      "A small, mystical island with a reputation for folk healing, firefly mangroves, and stunning waterfalls that remains refreshingly off the main tourist circuit. The island is easily circled by motorbike in a day: stop at Cambugahay Falls for a rope-swing into turquoise pools, visit the century-old balete tree with its resident fish spa, and seek out the resident healers in San Antonio who compound herbal remedies each Holy Week. Two days suits a full motorbike circuit on day one and beach time at Paliton Beach on day two. The vibe is slow, the beaches are uncrowded, and the seafood is spectacularly fresh.",
    tags: ['Waterfalls', 'Motorbike Circuit', 'Folk Healing', 'Quiet Beaches'],
    recommendedDays: [2, 3],
    accessNote: 'Ferry from Cebu or Dumaguete (1-2hrs)',
  },
  {
    id: 'dumaguete',
    name: 'Dumaguete',
    emoji: '🌊',
    colour: '#06A77D',
    airport: 'DGT',
    region: 'VISAYAS',
    brief:
      "A small university city on the southern tip of Negros Oriental known as the City of Gentle People, and a superb base for diving and island exploration. The top dive site is Apo Island, a marine sanctuary 30 minutes offshore where hawksbill turtles are so accustomed to divers they swim alongside you without concern. Dolphin watching at Tanon Strait is reliable, and the Liberty's restaurant strip on Rizal Boulevard is one of the Philippines' best for affordable fresh seafood. One day covers Apo Island and the boulevard; a second suits a trip to Twin Lakes for trekking around a dormant caldera.",
    tags: ['Diving', 'Apo Island', 'Turtles', 'Dolphin Watching'],
    recommendedDays: [1, 2],
  },

  // ═══════════════════════════════════════════
  // MINDANAO
  // ═══════════════════════════════════════════
  {
    id: 'siargao',
    name: 'Siargao',
    emoji: '🌊',
    colour: '#1B998B',
    airport: 'IAO',
    region: 'MINDANAO',
    brief:
      "The surf capital of the Philippines and one of Southeast Asia's defining island experiences. Cloud 9 is the famous hollow right-hand tube break that appears on every shortlist of Asia's best waves, but the island has over 20 surf spots catering to every level. Non-surfers are equally catered for: island-hopping to Naked Island, Daku Island, and Guyam Island is a full day of sandbar beauty and snorkelling, and the Sugba Lagoon day trip through mangroves to a brilliant emerald swimming spot is unmissable. Three days is the minimum to sample surf, island hopping, and the lagoon; a fourth lets you explore the jungle interior and the Magpupungko rock pools at low tide.",
    tags: ['Surfing', 'Island Hopping', 'Sugba Lagoon', 'Cloud 9'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
];

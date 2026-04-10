import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Thailand
 * 4. Consistently ranked in top Thailand destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Bangkok: gateway, temples, street food, nightlife (1,2,4,5) ✓
 * - Chiang Mai: gateway north, temples, markets, trekking (1,2,4,5) ✓
 * - Ayutthaya: UNESCO, ancient capital, day trip bucket-list (1,3,4,5) ✓
 * - Chiang Rai: White Temple, unique bucket-list (1,3,4,5) ✓
 * - Koh Phi Phi: iconic island scenery, Maya Bay (3,4,5) ✓
 * - Khao Sok: unique ancient rainforest, floating bungalows (3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Phuket: great but beach-niche and commercialised (fails 3,5)
 * - Koh Samui: beach-niche, many similar alternatives (fails 3,5)
 * - Koh Tao: diving-niche (fails 5)
 * - Koh Lipe: remote and beach-niche (fails 5)
 * - Pai: hippy enclave, too niche (fails 5)
 * - Sukhothai: incredible but overshadowed by Ayutthaya (fails 3,5)
 * - Kanchanaburi: WWII history-niche (fails 5)
 * - Krabi/Hua Hin: beach-niche, alternatives nearby (fails 3,5)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // CENTRAL THAILAND
  // ═══════════════════════════════════════════
  {
    id: 'bangkok',
    name: 'Bangkok',
    emoji: '🛺',
    colour: '#E63946',
    airport: 'BKK',
    region: 'CENTRAL THAILAND',
    brief:
      "Thailand's chaotic, electric capital deserves at least three full days. Day one: tuk-tuk to the Grand Palace and Wat Pho's giant reclining Buddha, then cross the Chao Phraya by ferry to Wat Arun. Day two: ride the MRT to Chatuchak Weekend Market or the frenetic Chinatown for boat noodles and durian, then explore Silom's rooftop bars at sunset. Day three: the Jim Thompson House, Lumphini Park at dawn, and a deep dive into the backpacker chaos of Khao San Road. A fourth day opens up day trips to Ayutthaya or the floating markets at Damnoen Saduak.",
    tags: ['Street Food', 'Temples', 'Nightlife', 'Markets'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'ayutthaya',
    name: 'Ayutthaya',
    emoji: '🏛️',
    colour: '#B5451B',
    airport: 'BKK',
    region: 'CENTRAL THAILAND',
    brief:
      "Thailand's ancient capital and a UNESCO World Heritage Site, just 80 kilometres north of Bangkok. Hire a bicycle to weave between sprawling temple ruins: the headless Buddha statues of Wat Mahathat, the three great prangs of Wat Phra Si Sanphet, and the island's moat-lined perimeter. Sunset over the brick spires reflected in the river is one of the most arresting sights in Southeast Asia. The highlights fit into a single day but an overnight stay rewards you with golden-hour light and far fewer crowds.",
    tags: ['UNESCO', 'Ancient Ruins', 'Cycling', 'History'],
    recommendedDays: [1, 1],
    mustVisit: true,
    isDayTrip: true,
    accessNote: 'Day trip from Bangkok (1.5hr by train or road)',
  },
  {
    id: 'kanchanaburi',
    name: 'Kanchanaburi',
    emoji: '🌉',
    colour: '#6B4226',
    airport: 'BKK',
    region: 'CENTRAL THAILAND',
    brief:
      "A deeply moving destination on the River Kwai, built around the history of the Death Railway constructed by Allied POWs during WWII. Day one: walk the Bridge over the River Kwai, visit the harrowing JEATH War Museum and Kanchanaburi War Cemetery, then ride the Death Railway to Hellfire Pass. Day two: waterfall hike in Erawan National Park with its seven tiers of luminous turquoise pools, or visit the Sai Yok Noi waterfall cascading directly into the river. The combination of sobering history and lush natural scenery is unlike anywhere else near Bangkok.",
    tags: ['WWII History', 'Death Railway', 'Waterfalls', 'River Kwai'],
    recommendedDays: [1, 2],
    accessNote: '2-3 hours from Bangkok by road or train',
  },
  {
    id: 'huahin',
    name: 'Hua Hin',
    emoji: '🐘',
    colour: '#3A7CA5',
    airport: 'BKK',
    region: 'CENTRAL THAILAND',
    brief:
      "Thailand's original royal resort town sits three hours south of Bangkok and feels a world away from the tourist trail. Day one: stroll the long sandy beach, explore the ornate Hua Hin Railway Station, and graze through the famous night market for grilled seafood and pad thai. Day two: visit the hilltop Khao Takiab temple where macaque monkeys rule the stairs, then ride horses on the beach at sunset. Add a third day for the nearby Kaeng Krachan National Park, Thailand's largest, or the Sam Roi Yot wetlands for rare waterbirds.",
    tags: ['Royal Resort', 'Night Market', 'Beach', 'Wildlife'],
    recommendedDays: [2, 3],
    accessNote: '3 hours from Bangkok by road',
  },

  // ═══════════════════════════════════════════
  // NORTHERN THAILAND
  // ═══════════════════════════════════════════
  {
    id: 'chiangmai',
    name: 'Chiang Mai',
    emoji: '🏯',
    colour: '#F4A261',
    airport: 'CNX',
    region: 'NORTHERN THAILAND',
    brief:
      "The cultural capital of the north and the best base for exploring the Thai highlands. Day one: circle the ancient walled Old City on foot visiting Wat Chedi Luang and Wat Phra Singh, then browse the unmissable Sunday Night Walking Street. Day two: half-day ethical elephant sanctuary experience -- feeding, bathing, and walking with elephants without riding. Day three: Doi Suthep temple perched on the mountain above the city with sweeping views, a Thai cooking class in a garden kitchen, and the Saturday Night Bazaar. A fourth day opens up hill tribe village treks or whitewater rafting on the Maetang River.",
    tags: ['Elephant Sanctuary', 'Night Markets', 'Temples', 'Cooking Classes'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'chiangrai',
    name: 'Chiang Rai',
    emoji: '🕌',
    colour: '#FFFFFF',
    airport: 'CNX',
    region: 'NORTHERN THAILAND',
    brief:
      "Home to the most visually extraordinary temples in Thailand. Day one: the White Temple (Wat Rong Khun), a hallucinatory maze of mirrored mosaics and surreal contemporary sculpture; the Blue Temple (Wat Rong Suea Ten) with its deep cobalt interior; and the Black House (Baan Dam), a sprawling collection of dark animist art. Day two: golden triangle boat trip to where Thailand, Laos, and Myanmar meet at the confluence of the Mekong and Ruak rivers, visiting the Hall of Opium museum. Chiang Rai also serves as the gateway for trekking to remote Akha, Karen, and Yao hill tribe villages.",
    tags: ['White Temple', 'Golden Triangle', 'Hill Tribes', 'Unique Architecture'],
    recommendedDays: [1, 2],
    accessNote: '3-hour drive or 45-min flight from Chiang Mai (CNX)',
  },
  {
    id: 'pai',
    name: 'Pai',
    emoji: '🌄',
    colour: '#6D9B3A',
    airport: 'CNX',
    region: 'NORTHERN THAILAND',
    brief:
      "A small mountain valley town north of Chiang Mai that has become a haven for free spirits and slow travellers. Day one: hire a scooter and loop the valley -- Pai Canyon at sunset, the hot springs at Tha Pai, and the bamboo bridge. Day two: Mo Paeng Waterfall, the Chinese Yunnan village at Santichon, and a tube float down the Pai River. The three-hour road from Chiang Mai winds through 762 curves of mountain scenery that is half the experience. Pai rewards travellers who want to slow down and linger.",
    tags: ['Scooter Riding', 'Valley Views', 'Hot Springs', 'Bohemian Vibe'],
    recommendedDays: [2, 3],
    accessNote: '3-hour winding drive from Chiang Mai (CNX)',
  },
  {
    id: 'sukhothai',
    name: 'Sukhothai',
    emoji: '🗿',
    colour: '#C9A84C',
    airport: 'CNX',
    region: 'NORTHERN THAILAND',
    brief:
      "The cradle of Thai civilisation: a UNESCO-listed historical park spread across 70 square kilometres of ruins from the 13th-century Sukhothai Kingdom. Rent a bicycle to glide between the most photogenic temples at dawn when mist still clings to the lotus ponds -- Wat Mahathat's lotus-bud spires, the elegant Wat Sa Si on its island, and the colossal standing Buddha of Wat Saphan Hin. The pace is gentle, the crowds thin, and the 40-kilometre Old Sukhothai to Si Satchanalai cycling route through rural countryside is outstanding. One full day covers the Central Zone; a second rewards those who want to explore the surrounding zones at leisure.",
    tags: ['UNESCO', 'Ancient Kingdom', 'Cycling', 'Temple Ruins'],
    recommendedDays: [1, 2],
    accessNote: '5-hour drive from Chiang Mai or 7 hours from Bangkok',
  },

  // ═══════════════════════════════════════════
  // SOUTHERN THAILAND
  // ═══════════════════════════════════════════
  {
    id: 'phuket',
    name: 'Phuket',
    emoji: '🌊',
    colour: '#0096C7',
    airport: 'HKT',
    region: 'SOUTHERN THAILAND',
    brief:
      "Thailand's largest island is the gateway to the Andaman Sea and packs in a huge range of experiences. Day one: Patong or Kata Beach, the Big Buddha on its hilltop, and Promthep Cape for sunset. Day two: Phang Nga Bay speedboat tour to the famous James Bond Island, sea-kayaking into hongs (sea caves), and floating villages. Day three: Old Phuket Town's Portuguese Sino shophouses, weekend Walking Street, and sundowners over the sea at Laem Singh viewpoint. A fourth day is best spent as a base for day trips to Koh Phi Phi, Koh Yao Noi, or diving at Shark Point.",
    tags: ['Beaches', 'Phang Nga Bay', 'Old Town', 'Island Hopping'],
    recommendedDays: [3, 4],
  },
  {
    id: 'krabi',
    name: 'Krabi / Ao Nang',
    emoji: '🧗',
    colour: '#48CAE4',
    airport: 'KBV',
    region: 'SOUTHERN THAILAND',
    brief:
      "A stunning coastline of sheer limestone karsts plunging into turquoise water. Day one: four-islands boat tour visiting Koh Poda, Chicken Island, Koh Mor, and the half-submerged Tiger Cave, finishing at Railay Beach (only accessible by longtail boat). Day two: rock climbing on Railay's world-class limestone walls, kayaking through mangroves into bat caves at sunset. Day three: snorkel the Phi Phi islands from Krabi, or hike to Tiger Cave Temple's 1,237 steps for a panoramic reward. Krabi balances adventure and relaxation better than anywhere on the Andaman coast.",
    tags: ['Limestone Cliffs', 'Rock Climbing', 'Railay Beach', 'Island Hopping'],
    recommendedDays: [2, 3],
  },
  {
    id: 'kohphiphi',
    name: 'Koh Phi Phi',
    emoji: '🏖️',
    colour: '#06D6A0',
    airport: 'HKT',
    region: 'SOUTHERN THAILAND',
    brief:
      "Perhaps the most photogenic island in Thailand: dramatic karst peaks bracketing a narrow strip of land between two bays. Day one: snorkel Maya Bay (made famous by 'The Beach'), Viking Cave, and Monkey Beach by longtail tour. Day two: hike to the Phi Phi viewpoint for a panorama over both bays at sunrise, kayak the sheltered Loh Dalum Bay, and join the sunset boat party. Day three: dive the King Cruiser wreck or Hin Daeng's stunning drop-offs, or settle into a beachside hammock. The island has no roads, only sandy paths and the sound of the sea.",
    tags: ['Maya Bay', 'Snorkelling', 'Diving', 'Iconic Scenery'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: '1.5-hour ferry from Phuket (HKT) or Krabi (KBV)',
  },
  {
    id: 'khaosok',
    name: 'Khao Sok National Park',
    emoji: '🛖',
    colour: '#2D6A4F',
    airport: 'HKT',
    region: 'SOUTHERN THAILAND',
    brief:
      "One of the oldest rainforests on earth, covering 739 square kilometres of limestone peaks, jungle rivers, and a vast emerald lake. Day one: guided jungle trek through ancient forest listening for gibbons, visit Ratchaprapa Dam, then transfer by longtail to floating bungalows on Cheow Lan Lake, surrounded by cathedral karsts rising from still water. Day two: morning kayak on the lake in total silence, canoe through flooded canyon passages, and cave tour with stalactites descending to the waterline. Day three: early morning wildlife walk along the river trail for macaques and hornbills, then a bamboo raft trip. The floating bungalow overnight is one of the most memorable experiences in Thailand.",
    tags: ['Rainforest', 'Floating Bungalows', 'Kayaking', 'Wildlife'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Central point between Phuket (HKT) and Koh Samui (USM)',
  },
  {
    id: 'kohsamui',
    name: 'Koh Samui',
    emoji: '🥥',
    colour: '#FFB703',
    airport: 'USM',
    region: 'SOUTHERN THAILAND',
    brief:
      "The Gulf of Thailand's largest island with a wide mix of beach, culture, and natural scenery. Day one: Chaweng Beach, the famous Big Buddha temple on its causeway island, and the ornate Wat Plai Laem with its 18-armed goddess. Day two: a full-day tour to Ang Thong Marine National Park by speedboat -- snorkel a hidden emerald lake inside a karst island, kayak sea caves, and swim off uninhabited beaches. Day three: the dramatic Na Muang Waterfalls in the jungle interior, a Muay Thai fight at Chaweng stadium, and the Saturday Night Market. Koh Samui is the most accessible Gulf island with direct international flights.",
    tags: ['Ang Thong Park', 'Beaches', 'Temples', 'Island Tours'],
    recommendedDays: [3, 4],
  },
  {
    id: 'kohtao',
    name: 'Koh Tao',
    emoji: '🤿',
    colour: '#0077B6',
    airport: 'USM',
    region: 'SOUTHERN THAILAND',
    brief:
      "The world's most popular place to get a PADI Open Water diving certification, and a spectacular diving destination for all levels. Day one: introductory dive or snorkel at Shark Bay for leopard sharks, Japanese Gardens for turtles, and the HTMS Sattakut wreck. Day two: full-day dive with two or three tanks covering Chumphon Pinnacle (whale sharks possible), and Southwest Pinnacle. Day three: the famous boulders of Haad Tien beach, a snorkel sunset cruise, and the legendary Full Moon warm-up parties at Sairee Beach. The coral visibility is exceptional and the water temperature rarely drops below 27 degrees.",
    tags: ['Diving', 'Snorkelling', 'Dive Certification', 'Beach Parties'],
    recommendedDays: [2, 3],
    accessNote: '2-hour ferry from Koh Samui (USM) or Chumphon',
  },
  {
    id: 'kohlipe',
    name: 'Koh Lipe',
    emoji: '🐠',
    colour: '#90E0EF',
    airport: 'HKT',
    region: 'SOUTHERN THAILAND',
    brief:
      "A tiny, remote island in the Tarutao Marine National Park, right on the border with Malaysia. The three main beaches are each distinct: Pattaya Beach for day-trippers and longtail noise, Sunrise Beach for calm turquoise shallows, Sunset Beach for the quietest swimming. Day one: snorkel the fringing reefs off Koh Rawi and Koh Adang in the national park. Day two: dive with blacktip reef sharks, sea turtles, and massive Napoleon wrasse at the park's protected reef systems. Day three: full-beach day, watching the sunset from the pier. Getting there is an adventure involving speedboats or high-season ferries -- the remoteness keeps the crowds manageable.",
    tags: ['Pristine Reefs', 'Diving', 'Remote Island', 'Marine Park'],
    recommendedDays: [2, 3],
    accessNote: 'Speedboat from Pak Bara or seasonal ferry via Phuket (HKT)',
  },
];

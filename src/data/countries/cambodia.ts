import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Cambodia
 * 4. Consistently ranked in top Cambodia destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Siem Reap / Angkor Wat: UNESCO megasite, bucket-list, gateway (1,2,3,4,5) ✓
 * - Phnom Penh: capital gateway, Killing Fields, Royal Palace (1,2,4,5) ✓
 * - Tonle Sap: unique floating villages, UNESCO Biosphere, day trip from Siem Reap (1,3,4) ✓
 * - Kampot: standout colonial town, unique pepper region, broad appeal (3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Koh Rong: great but beach-niche (fails 1,3)
 * - Battambang: interesting but secondary to Siem Reap (fails 3,5)
 * - Sihanoukville: overdeveloped, niche (fails 1,3,5)
 * - Mondulkiri: remote, adventure-niche (fails 2,5)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // SIEM REAP & TEMPLES
  // ═══════════════════════════════════════════
  {
    id: 'siemreap',
    name: 'Siem Reap & Angkor Wat',
    emoji: '🏛️',
    colour: '#C77DFF',
    airport: 'REP',
    region: 'SIEM REAP & TEMPLES',
    brief:
      "Angkor Wat is the largest religious monument ever constructed and the defining reason to visit Cambodia. Three full days are needed to do the Angkor Archaeological Park justice: day one for the Grand Circuit covering Angkor Wat at sunrise, Angkor Thom, the Bayon's serene face towers, and the jungle-consumed Ta Prohm. Day two suits the smaller temples of the Small Circuit and Banteay Srei, whose intricate pink sandstone carvings represent the artistic peak of the Khmer Empire. Day three opens up Beng Mealea, a vast unrestored temple swallowed whole by the jungle 40 kilometres east. Siem Reap town itself has a vibrant Pub Street, floating village boat trips, and an excellent Khmer culinary scene.",
    tags: ['Angkor Wat', 'UNESCO', 'Temples', 'Sunrise'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'tonlesap',
    name: 'Tonle Sap Lake',
    emoji: '🛶',
    colour: '#4CC9F0',
    airport: 'REP',
    region: 'SIEM REAP & TEMPLES',
    brief:
      "The largest freshwater lake in Southeast Asia and a UNESCO Biosphere Reserve, Tonle Sap is home to entire communities living on floating villages that expand and contract with the seasonal flood cycle. The experience is unlike anything else in the region: entire schools, petrol stations, pig farms, and churches float on the water, moving with the lake's edge as it expands up to five times its dry season size. A one-day boat tour from Siem Reap visits the Chong Kneas or Kompong Phluk floating villages, passing through flooded forests by kayak at the right season. This is best taken as a half-day or full-day excursion from Siem Reap rather than an independent overnight stop.",
    tags: ['Floating Villages', 'Boat Tour', 'UNESCO Biosphere', 'Flooded Forest'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    mustVisit: true,
    accessNote: 'Day trip from Siem Reap (15-30min drive)',
  },
  {
    id: 'battambang',
    name: 'Battambang',
    emoji: '🎨',
    colour: '#F7B731',
    airport: 'REP',
    region: 'SIEM REAP & TEMPLES',
    brief:
      "Cambodia's second largest city is a charming colonial riverside town with the country's best-preserved French architecture and a surprisingly vibrant arts scene. The bamboo train, a flat wooden platform propelled by a small engine along a single set of tracks, is a gloriously ramshackle and uniquely Cambodian experience. One day covers the colonial quarter walk, the bamboo train, Phare Ponleu Selpak circus school performances, and the bat cave at Phnom Sampeau where millions of bats emerge at dusk. A second day suits a slow boat journey or tuk-tuk tour through the rice-wine producing villages of the surrounding countryside.",
    tags: ['Colonial Architecture', 'Bamboo Train', 'Circus Arts', 'Bat Cave'],
    recommendedDays: [1, 2],
    accessNote: 'Bus or slow boat from Siem Reap (3-5hrs)',
  },

  // ═══════════════════════════════════════════
  // PHNOM PENH & CENTRAL
  // ═══════════════════════════════════════════
  {
    id: 'phnompenh',
    name: 'Phnom Penh',
    emoji: '🏯',
    colour: '#FF6B6B',
    airport: 'PNH',
    region: 'PHNOM PENH & CENTRAL',
    brief:
      "Cambodia's capital sits at the confluence of the Mekong and Tonle Sap rivers and carries a weight of history that is both painful and essential to understand. Day one should be devoted to the Tuol Sleng Genocide Museum and the Choeung Ek Killing Fields memorial, which together document the horror of the Khmer Rouge era with devastating clarity. Day two shifts to the Royal Palace and its Silver Pagoda, the National Museum's world-class Khmer sculpture collection, and the Russian Market for silk scarves and street food. A third day can include a Mekong island bicycle tour, the AEON Mall rooftop for city views, or a cooking class focused on Khmer home cooking.",
    tags: ['Killing Fields', 'Royal Palace', 'Khmer History', 'National Museum'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },

  // ═══════════════════════════════════════════
  // SOUTHERN COAST
  // ═══════════════════════════════════════════
  {
    id: 'kampot',
    name: 'Kampot',
    emoji: '🌶️',
    colour: '#F77F00',
    airport: 'PNH',
    region: 'SOUTHERN COAST',
    brief:
      "A sleepy riverside colonial town in southern Cambodia that has grown into one of the country's most beloved stops for independent travellers, and for good reason. Kampot pepper, grown in the volcanic soil of the Elephant Mountains, is regarded by chefs worldwide as among the finest pepper on earth, and the farm tours here are genuinely fascinating. The Bokor Hill Station, a crumbling French colonial resort on a cloud-shrouded plateau, rewards a motorbike ride up the mountain with misty views and eerie abandoned buildings. Two days allows a kayak down the Kampot River at sunset, a pepper farm visit, the Bokor Hill climb, and evenings on the riverside strip of bars and restaurants. A third day suits a day trip to Kep for crab market seafood.",
    tags: ['Kampot Pepper', 'Bokor Hill Station', 'Kayaking', 'Colonial Town'],
    recommendedDays: [2, 3],
    accessNote: '3hr bus or shared taxi from Phnom Penh',
  },
  {
    id: 'kep',
    name: 'Kep',
    emoji: '🦀',
    colour: '#52B788',
    airport: 'PNH',
    region: 'SOUTHERN COAST',
    brief:
      "A tiny former French colonial beach resort that was once the holiday destination of the Cambodian elite, now a tranquil crab-fishing village with the best seafood on the southern coast. The Kep Crab Market is the essential stop: choose your live mud crabs from the fishing boats at the dock, hand them to a nearby vendor, and eat them grilled or stir-fried with the local Kampot pepper within 20 minutes. The Kep National Park walking trail winds through forested hills to a breezy hilltop pagoda. One day covers the market and the park; a second suits a boat trip to Rabbit Island for swimming and hammock time. Best combined with Kampot as an easy day trip or overnight.",
    tags: ['Crab Market', 'Seafood', 'Rabbit Island', 'Colonial Ruins'],
    recommendedDays: [1, 2],
    accessNote: '3.5hr bus from Phnom Penh or 30min from Kampot',
  },
  {
    id: 'sihanoukville',
    name: 'Sihanoukville',
    emoji: '⚓',
    colour: '#457B9D',
    airport: 'KOS',
    region: 'SOUTHERN COAST',
    brief:
      "The main coastal city and ferry hub for Cambodia's southern islands, most useful as a transit point. Serendipity Beach and Otres Beach have calmer pockets, and the town has decent fresh seafood. The primary reason most travellers come is to catch a ferry to Koh Rong or Koh Rong Samloem, and a single day is generally sufficient for that purpose, covering the ferry terminal, a seafood lunch, and one of the quieter beaches before departure. Those who choose to stay longer are rewarded by Otres Village's relaxed bar scene and a local fishing village tuk-tuk tour.",
    tags: ['Ferry Hub', 'Otres Beach', 'Seafood', 'Island Gateway'],
    recommendedDays: [1, 2],
  },
  {
    id: 'kohrong',
    name: 'Koh Rong',
    emoji: '🌴',
    colour: '#06D6A0',
    airport: 'PNH',
    region: 'SOUTHERN COAST',
    brief:
      "Cambodia's largest island is a lush, forested escape with long white sand beaches and bioluminescent plankton that lights the sea an electric blue on dark nights. Koh Tuch Village on the southern tip has the main pier, beach bars, and guesthouses, while Long Set Beach on the western coast is quieter and more scenic. Two days is a sweet spot: one day for the jungle trekking trail to the island's freshwater lagoon and the other for kayaking around the coast and swimming at sunset. The bioluminescence is best viewed from a kayak on moonless nights between May and October. The island pairs well with Koh Rong Samloem if you want a longer island escape.",
    tags: ['Bioluminescence', 'White Sand', 'Jungle Trekking', 'Kayaking'],
    recommendedDays: [2, 3],
    accessNote: 'Ferry from Sihanoukville (45min-1.5hrs)',
  },
  {
    id: 'kohrong-samloem',
    name: 'Koh Rong Samloem',
    emoji: '🐠',
    colour: '#118AB2',
    airport: 'PNH',
    region: 'SOUTHERN COAST',
    brief:
      "The quieter, more pristine sister island to Koh Rong, with cleaner beaches, better snorkelling, and a deliberate lack of the party scene that draws crowds to its neighbour. Saracen Bay on the eastern coast is a near-perfect crescent of white sand with calm, clear water ideal for swimming year-round. The island's Marine Conservation Cambodia project offers snorkelling tours to see the coral restoration work and resident seahorses up close. Two days allows a complete circuit of the island by longtail boat, two beach bases, snorkelling, and evening bioluminescence swimming. The combination of both Koh Rong islands makes for a compelling three to four night southern coast island itinerary.",
    tags: ['Pristine Beaches', 'Snorkelling', 'Marine Conservation', 'Bioluminescence'],
    recommendedDays: [2, 3],
    accessNote: 'Ferry from Sihanoukville (1-2hrs)',
  },

  // ═══════════════════════════════════════════
  // NORTHEASTERN CAMBODIA
  // ═══════════════════════════════════════════
  {
    id: 'mondulkiri',
    name: 'Mondulkiri',
    emoji: '🐘',
    colour: '#4A7C59',
    airport: 'PNH',
    region: 'NORTHEASTERN CAMBODIA',
    brief:
      "A remote highland province in northeastern Cambodia bordering Vietnam, home to the Bunong ethnic minority, wild jungle, waterfalls, and Cambodia's best ethical elephant sanctuary. The Elephant Valley Project takes in former logging and circus elephants to live freely in forested land, and visitors can walk with the herd through the jungle for a full day observing natural elephant behaviour without riding or performing. Sen Monorom, the provincial capital, is a small, breezy hill town with excellent coffee grown by local Bunong farmers. Two days is ideal: one day with the elephants and a second for Bou Sra Waterfall, a Bunong village visit, and motorbike trails through pine forest. The journey from Phnom Penh takes six to seven hours and the remoteness is part of the appeal.",
    tags: ['Elephant Sanctuary', 'Bunong Culture', 'Waterfalls', 'Highland Jungle'],
    recommendedDays: [2, 3],
    accessNote: 'Bus or shared taxi from Phnom Penh (6-7hrs)',
  },
];

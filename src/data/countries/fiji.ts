import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Fiji
 * 4. Consistently ranked in top Fiji destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Denarau Island: main gateway resort hub, broad appeal, top-ranked (2,4,5) ✓
 * - Mamanuca Islands: iconic Fiji resort islands, top-ranked, broad appeal (3,4,5) ✓
 * - Yasawa Islands: bucket-list remote islands, Blue Lagoon filming, unique (3,4,5) ✓
 * - Taveuni: Garden Island, Rainbow Reef, Bouma Falls, unique biodiversity (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Nadi: functional gateway but limited draw beyond transit (fails 3,5)
 * - Suva: capital with good museums but limited tourist appeal (fails 3,4,5)
 * - Coral Coast, Pacific Harbour: strong for niche activities but not broadly iconic (fails 1,3)
 * - Savusavu, Beqa: excellent but specialist diving/yachting audience (fails 2,5)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // VITI LEVU
  // ═══════════════════════════════════════════
  {
    id: 'nadi',
    name: 'Nadi',
    emoji: '✈️',
    colour: '#E67E22',
    airport: 'NAN',
    region: 'VITI LEVU',
    brief:
      "Nadi is Fiji's main entry point and international gateway, a busy town on the western Viti Levu coast that most visitors pass through but which rewards those who pause for a day. The Sri Siva Subramaniya temple on the main street is the largest Hindu temple in the Southern Hemisphere, its ornate gopuram towers painted in vivid colours and open to respectful visitors for a fascinating glimpse into Fiji's significant Indo-Fijian community. The Garden of the Sleeping Giant north of town, originally cultivated by James Michener, contains one of the finest collections of tropical orchids in the Pacific. Sabeto mud pools and natural hot springs in the shadow of the Sleeping Giant mountain range offer an unexpected geothermal experience just 20 minutes from the airport.",
    tags: ['Gateway', 'Hindu Temple', 'Orchid Garden', 'Mud Pools'],
    recommendedDays: [1, 2],
  },
  {
    id: 'denarau-island',
    name: 'Denarau Island',
    emoji: '🏝️',
    colour: '#2980B9',
    airport: 'NAN',
    region: 'VITI LEVU',
    brief:
      "Denarau Island is Fiji's most developed resort precinct, a purpose-built island connected to the Nadi mainland by a short bridge and home to the country's largest concentration of international hotels, restaurants, and tourism facilities. The Port Denarau Marina is the departure point for most day trips, sunset cruises, and ferry transfers to the Mamanuca and Yasawa Islands, making it a practical hub for island-hopping adventures. Golf at the Denarau Golf and Racquet Club, water sports at the hotel beaches, and the Denarau Village retail and dining complex offer activities for those who prefer a resort base to remote island accommodation. The resort strip's nightly cultural shows, kava ceremonies, and Fijian fire dances give visitors an accessible and entertaining introduction to Fijian traditions.",
    tags: ['Resort Hub', 'Marina', 'Golf', 'Water Sports'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'coral-coast',
    name: 'Coral Coast',
    emoji: '🌺',
    colour: '#27AE60',
    airport: 'NAN',
    region: 'VITI LEVU',
    brief:
      "The Coral Coast is a 60-kilometre stretch of Viti Levu's southern shore lined with mid-range resorts, traditional Fijian villages, and a range of adventure activities that make it a popular alternative to the more expensive island resorts. The Sigatoka Sand Dunes National Park protects Fiji's only national park on the mainland, a remarkable landscape of shifting sand dunes rising up to 60 metres above the Coral Coast with ancient pottery and burial sites exposed by the wind. The Kalevu Cultural Centre at Pacific Harbour presents authentic Fijian village life and traditional crafts, and various operators offer village visits to genuinely welcoming local communities. Surfing breaks along the Coral Coast, particularly at Yanuca Island and the renowned Frigates Passage offshore, attract surfers seeking consistent reef swells.",
    tags: ['Sand Dunes', 'Cultural Villages', 'Surfing', 'Zip-lining'],
    recommendedDays: [2, 3],
    accessNote: 'Via Nadi (NAN), approximately 1 hour east along the Queen\'s Road',
  },
  {
    id: 'pacific-harbour',
    name: 'Pacific Harbour',
    emoji: '🦈',
    colour: '#922B21',
    airport: 'NAN',
    region: 'VITI LEVU',
    brief:
      "Pacific Harbour bills itself as the adventure capital of Fiji, a small town on Viti Levu's southern coast that has built a global reputation around an exceptional range of adrenaline activities in a single compact location. Shark diving at Beqa Lagoon just offshore is world famous: a controlled dive with up to eight species of shark including bull sharks and tiger sharks, managed by a team that has run the programme for over two decades. Sigatoka River Safari combines jet boat, 4WD, and canoe travel into the Fijian interior to visit remote highland villages rarely seen by tourists. The Arts Village cultural centre in Pacific Harbour offers meke dance performances, fire walking demonstrations, and craft markets in a pleasant setting, providing cultural depth alongside the adventure credentials.",
    tags: ['Shark Diving', 'White Water Rafting', 'Zip-lining', 'Adventure Capital'],
    recommendedDays: [2, 3],
    accessNote: 'Via Nadi (NAN), approximately 1.5 hours east along the Queen\'s Road',
  },
  {
    id: 'suva',
    name: 'Suva',
    emoji: '🏛️',
    colour: '#6C3483',
    airport: 'SUV',
    region: 'VITI LEVU',
    brief:
      "Suva is the capital and largest city of Fiji, a bustling and genuinely cosmopolitan South Pacific capital on the rainy southeastern corner of Viti Levu with a character quite different from the resort-focused west coast. The Fiji Museum in Thurston Gardens is the finest in the Pacific islands, housing cannibal forks, war clubs, traditional barkcloth, and the rudder of HMS Bounty from the famous mutiny. Suva Municipal Market is one of the best in the South Pacific, a covered market of extraordinary colour and noise where vendors sell tropical produce, kava root, fresh coconuts, and traditional handicrafts alongside one another. Suva's multicultural restaurant scene, reflecting the city's Fijian, Indo-Fijian, Chinese, and expatriate communities, includes some surprisingly excellent dining options.",
    tags: ['Fiji Museum', 'Municipal Market', 'Capital City', 'Multicultural'],
    recommendedDays: [1, 2],
  },

  // ═══════════════════════════════════════════
  // MAMANUCA ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'mamanuca-islands',
    name: 'Mamanuca Islands',
    emoji: '🐠',
    colour: '#1ABC9C',
    airport: 'NAN',
    region: 'MAMANUCA ISLANDS',
    brief:
      "The Mamanuca Islands are the most accessible and best-known of Fiji's island groups, a cluster of about 20 small islands within 40 kilometres of Nadi that deliver the quintessential Fiji experience of white sand, warm turquoise water, and resort accommodation ranging from backpacker to luxury. Castaway Island (Qalito) was the setting for the Tom Hanks film Cast Away and remains one of the group's most charming resorts. Mana Island has a large resort and a beautiful backpacker beach scene, with excellent snorkelling directly off both its resort and public beaches. Cloud 9 is a multi-storey floating bar and pizzeria anchored above a pristine coral reef, accessible by water taxi for day trips combining swimming, lounging, and afternoon drinks above the ocean.",
    tags: ['Castaway Island', 'Cloud 9 Bar', 'Snorkelling', 'Resort Islands'],
    recommendedDays: [3, 5],
    mustVisit: true,
    accessNote: 'Via Nadi (NAN) by fast ferry from Port Denarau, 30 minutes to 1 hour depending on island',
  },

  // ═══════════════════════════════════════════
  // YASAWA ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'yasawa-islands',
    name: 'Yasawa Islands',
    emoji: '🌊',
    colour: '#2471A3',
    airport: 'NAN',
    region: 'YASAWA ISLANDS',
    brief:
      "The Yasawa Islands are a 90-kilometre chain of volcanic islands stretching north from the Mamanucas, offering a more remote, authentic, and spectacularly beautiful version of the Fiji island experience. The Sawa-i-Lau limestone caves on the northern Yasawas are an extraordinary natural wonder: a system of caverns containing a luminous freshwater pool reachable by diving through an underwater tunnel, with ceiling formations that glow in the filtered light. Village visits to traditional Fijian communities along the chain provide genuine cultural exchange through the formal sevu-sevu kava ceremony and meke performances, and local families often host overnight guests in simple bures. The northern Yasawa waters featured as the filming location for both versions of the Blue Lagoon film, and the beaches there remain among the most isolated and pristine in the South Pacific.",
    tags: ['Sawa-i-Lau Caves', 'Village Visits', 'Blue Lagoon Filming', 'Pristine Beaches'],
    recommendedDays: [3, 5],
    mustVisit: true,
    accessNote: 'Via Nadi (NAN) by Yasawa Flyer catamaran from Port Denarau, travel time varies by destination from 2 to 6 hours',
  },

  // ═══════════════════════════════════════════
  // OUTER ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'taveuni',
    name: 'Taveuni',
    emoji: '🌺',
    colour: '#1D8348',
    airport: 'TVU',
    region: 'OUTER ISLANDS',
    brief:
      "Taveuni is Fiji's third-largest island and one of the most biodiverse places in the Pacific, earning its title as the Garden Island from a lush volcanic interior that receives some of the highest rainfall in Fiji and supports remarkable native flora and fauna. Bouma National Heritage Park contains Tavoro Waterfalls, three tiers of waterfalls cascading into natural swimming pools through forest, and the Lavena Coastal Walk passes remote beaches, waterfalls, and river crossings to reach a remote shoreline rarely visited by outsiders. Taveuni also borders the International Date Line, and a roadside marker at Waiyevo marks the point where one side is one day ahead of the other. The Rainbow Reef in the Somosomo Strait between Taveuni and Vanua Levu is consistently rated among the top five dive sites in the world, a 32-kilometre wall of soft coral in extraordinary colours.",
    tags: ['Rainbow Reef Diving', 'Bouma Falls', 'Lavena Walk', 'Garden Island'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'savusavu',
    name: 'Savusavu',
    emoji: '⚓',
    colour: '#17A589',
    airport: 'SVU',
    region: 'OUTER ISLANDS',
    brief:
      "Savusavu is a small and charming town on the southern coast of Vanua Levu, Fiji's second-largest island, with a natural deep-water harbour that makes it one of the finest yachting destinations in the South Pacific and a recognised Pacific hurricane hole. The town's main street runs along the waterfront with a relaxed pace and a genuine local character quite removed from the resort-driven tourism of the west, and fresh produce at Savusavu Market includes vanilla grown in the surrounding hills which produces some of the finest vanilla beans in the world. Hot springs bubble directly up through the foreshore near the marina, and locals use the natural geothermal heat for cooking. The waters around Vanua Levu offer excellent and uncrowded diving on healthy reefs with very few other divers.",
    tags: ['Hot Springs', 'Yacht Harbour', 'Vanilla Plantations', 'Uncrowded Diving'],
    recommendedDays: [2, 3],
  },
  {
    id: 'beqa-island',
    name: 'Beqa Island',
    emoji: '🔥',
    colour: '#B7950B',
    airport: 'NAN',
    region: 'OUTER ISLANDS',
    brief:
      "Beqa Island is a small volcanic island south of Viti Levu whose surrounding lagoon is one of the premier shark diving destinations in the world, home to the famous Shark Reef Marine Reserve where controlled dives with bull sharks, tiger sharks, and up to eight other species are conducted daily. The island is also the ancestral home of the Sawau tribe, who maintain the ancient tradition of vilavilairevo, firewalking across white-hot stones, a practice that predates Fijian history and continues to be performed at ceremonies and cultural shows throughout Fiji today. The Beqa Lagoon within its protective outer reef contains exceptional coral gardens and visibility conditions that attract serious divers from across the Pacific. Access to the island and the reef is typically by day trip from Pacific Harbour, though a small number of island lodges offer multiday stays.",
    tags: ['Shark Diving', 'Fire Walking', 'Beqa Lagoon', 'Traditional Culture'],
    recommendedDays: [2, 3],
    accessNote: 'Via Nadi (NAN) to Pacific Harbour, then boat transfer; approximately 15 minutes by boat from Pacific Harbour',
  },
];

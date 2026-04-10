import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Indonesia
 * 4. Consistently ranked in top Indonesia destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Jakarta: gateway, major hub (2,4,5) ✓
 * - Ubud: bucket-list culture, rice terraces, broad appeal (1,3,4,5) ✓
 * - Nusa Penida: dramatic cliffs, snorkelling, widely ranked must-do from Bali (3,4,5) ✓
 * - Yogyakarta: UNESCO Borobudur + Prambanan, cultural capital (1,3,4,5) ✓
 * - Komodo National Park: UNESCO, dragons + world-class diving, bucket-list (1,3,4,5) ✓
 * - Raja Ampat: world's best diving, bucket-list, globally iconic (3,4,5) ✓
 * - Labuan Bajo: gateway to Komodo, rapidly growing international profile (2,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Seminyak/Canggu: great beach/nightlife but niche (fails 1,3)
 * - Uluwatu: incredible but surf/temple niche (fails 5 broadly)
 * - Gili Islands: popular but similar beach options exist (fails 1,3)
 * - Lombok: solid all-rounder but overshadowed by nearby picks (fails 1)
 * - Flores: spectacular but very niche adventure travel (fails 5)
 * - Toraja: extraordinary but highly niche cultural experience (fails 5)
 * - Sumba: stunning but remote and niche (fails 2,5)
 * - Bandung: pleasant day-trip but limited international appeal (fails 3,5)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // BALI
  // ═══════════════════════════════════════════
  {
    id: 'ubud',
    name: 'Ubud',
    emoji: '🌿',
    colour: '#4A7C59',
    airport: 'DPS',
    region: 'BALI',
    brief:
      "Bali's spiritual and cultural heartland sits amid lush river gorges and the world-famous Tegallalang rice terraces. Spend days exploring the Sacred Monkey Forest, watching hypnotic Kecak fire dances at Pura Dalem Ubud, and cycling through emerald paddies at dawn. Ubud is also the island's wellness capital, with dozens of world-class yoga retreats, Ayurvedic spas, and plant-based cafes lining the streets. The surrounding villages produce outstanding woodcarvings, silverwork, and batik textiles, making it the best place in Bali to support local artisans.",
    tags: ['Rice Terraces', 'Yoga', 'Monkey Forest', 'Arts & Crafts', 'Temples'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'seminyak-canggu',
    name: 'Seminyak & Canggu',
    emoji: '🏄',
    colour: '#F4A261',
    airport: 'DPS',
    region: 'BALI',
    brief:
      "Bali's most stylish coastal strip stretches from the designer boutiques and beach clubs of Seminyak to the surf-soaked lanes of Canggu. Seminyak delivers effortless beach luxury: sunset cocktails at Ku De Ta, world-class restaurants, and sprawling villa accommodation. Canggu has a grittier creative energy, with surf schools on Echo Beach, hip coffee shops, and an increasingly international food scene fuelled by digital nomads. Together they offer Bali's best nightlife outside Kuta, with something on from sunrise yoga sessions to late-night DJ sets.",
    tags: ['Beaches', 'Surf', 'Beach Clubs', 'Nightlife', 'Restaurants'],
    recommendedDays: [2, 3],
  },
  {
    id: 'uluwatu',
    name: 'Uluwatu',
    emoji: '🌊',
    colour: '#0077B6',
    airport: 'DPS',
    region: 'BALI',
    brief:
      "The Bukit Peninsula's southern tip is one of Bali's most dramatic landscapes, where white limestone cliffs plunge directly into the Indian Ocean. The ancient Pura Luhur Uluwatu temple perches on a 70-metre cliff edge and hosts nightly Kecak fire dance performances at sunset. World-renowned surf breaks including Uluwatu, Padang Padang, and Bingin attract travelling surfers from across the globe. Clifftop beach clubs like Single Fin have made this Bali's most cinematic spot for a sundowner, with views stretching endlessly across the ocean.",
    tags: ['Cliffs', 'Temples', 'Surf', 'Sunset Views', 'Beach Clubs'],
    recommendedDays: [2, 3],
  },
  {
    id: 'nusa-dua',
    name: 'Nusa Dua',
    emoji: '🏖️',
    colour: '#E6A817',
    airport: 'DPS',
    region: 'BALI',
    brief:
      "Bali's most polished beach enclave sits on the southeastern tip of the island, home to world-class resorts, pristine white sand, and calm turquoise waters perfect for swimming year-round. Day one: relax at the immaculate Geger Beach, try parasailing or jet-skiing at Tanjung Benoa's water sports strip, and stroll through the Bali Collection shopping complex at sunset. Day two: visit the spectacular Water Blow cliff formation where waves crash dramatically through a rock channel, explore the Museum Pasifika for Southeast Asian art, and enjoy a beachfront seafood dinner. Day three: take a morning stand-up paddleboard session on the glass-calm bay, visit the Devdan Show for a Balinese cultural performance, and indulge in a spa day at one of the luxury resorts.",
    tags: ['Luxury Resorts', 'Water Sports', 'White Sand', 'Family-Friendly'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'nusa-penida',
    name: 'Nusa Penida',
    emoji: '🦅',
    colour: '#00B4D8',
    airport: 'DPS',
    region: 'BALI',
    brief:
      "A rugged island 45 minutes by fast boat from Sanur that has become one of Southeast Asia's most photographed destinations. Kelingking Beach's T-Rex shaped cliff and the crystal-clear natural pools of Angel's Billabong and Broken Beach are genuinely breathtaking sights unlike anywhere else in the region. The island's waters are home to Manta rays and if you're lucky, Mola mola sunfish, making it a bucket-list snorkelling and diving destination. Despite its rising popularity the roads remain rough, the landscapes stay wild, and the island retains a beautifully raw character that feels far removed from polished mainland Bali.",
    tags: ['Cliffs', 'Snorkelling', 'Manta Rays', 'Instagram', 'Island Life'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Fast boat from Sanur (DPS) approx 45 min',
  },

  // ═══════════════════════════════════════════
  // LOMBOK & NUSA TENGGARA
  // ═══════════════════════════════════════════
  {
    id: 'gili-islands',
    name: 'Gili Islands',
    emoji: '🐠',
    colour: '#48CAE4',
    airport: 'LOP',
    region: 'LOMBOK & NUSA TENGGARA',
    brief:
      "Three tiny coral-fringed islands off the northwest coast of Lombok, each with its own distinct personality. Gili Trawangan is the party island, with beach bars, reggae music, and a lively backpacker scene that runs late. Gili Air strikes a perfect balance between social and serene, with good snorkelling reefs and a relaxed cafe culture. Gili Meno is the quietest, ringed by the best underwater turtle habitat of the three. There are no motorised vehicles on any island: everyone gets around by bicycle or horse-drawn cidomo cart, giving the Gilis an irresistibly laid-back tropical island atmosphere.",
    tags: ['Snorkelling', 'Turtles', 'Island Hopping', 'Beach Bars', 'Diving'],
    recommendedDays: [2, 3],
    accessNote: 'Fast boat from Lombok (LOP) or Bali (DPS)',
  },
  {
    id: 'lombok',
    name: 'Lombok',
    emoji: '🌋',
    colour: '#E76F51',
    airport: 'LOP',
    region: 'LOMBOK & NUSA TENGGARA',
    brief:
      "Bali's quieter neighbour packs extraordinary diversity into a single island. The centrepiece is Gunung Rinjani, Indonesia's second-highest volcano at 3,726 metres, whose summit crater lake is one of the most spectacular trekking destinations in Southeast Asia. The south coast beaches at Kuta Lombok and Tanjung Aan are arguably more beautiful than Bali's and far less crowded. The Sasak culture is distinct and fascinating, with traditional weaving villages and hilltop mosques that reflect Lombok's strong Islamic identity. Two to three days lets you sample the beaches and coast; three days minimum for the Rinjani climb.",
    tags: ['Mt Rinjani', 'Trekking', 'Beaches', 'Sasak Culture', 'Surfing'],
    recommendedDays: [2, 3],
  },

  // ═══════════════════════════════════════════
  // KOMODO & FLORES
  // ═══════════════════════════════════════════
  {
    id: 'labuan-bajo',
    name: 'Labuan Bajo',
    emoji: '⚓',
    colour: '#E9C46A',
    airport: 'LBJ',
    region: 'KOMODO & FLORES',
    brief:
      "A small fishing town on the western tip of Flores that has transformed into the gateway to Komodo National Park and one of Indonesia's fastest growing tourist hubs. The waterfront is lined with liveaboard operators, dive shops, and a rapidly improving restaurant scene. Sunset from the viewpoint hills overlooking the harbour and surrounding islands is spectacular, and the town itself makes a comfortable base for organising boat trips and diving excursions. Plan at least one full day in Labuan Bajo itself: the Batu Cermin crystal cave and Cunca Wulang canyon are both worth visiting before or after your Komodo adventure.",
    tags: ['Gateway', 'Diving', 'Liveaboards', 'Sunsets', 'Harbour'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Direct flights from Bali (DPS) and Jakarta (CGK)',
  },
  {
    id: 'komodo-national-park',
    name: 'Komodo National Park',
    emoji: '🦎',
    colour: '#8D6E63',
    airport: 'LBJ',
    region: 'KOMODO & FLORES',
    brief:
      "A UNESCO World Heritage Site protecting the last wild population of Komodo dragons alongside some of the most biodiverse marine waters on earth. Trekking Rinca or Komodo Island to see the world's largest lizards in their natural habitat is a genuine bucket-list experience. Below the surface, the park's currents create extraordinary diving: manta rays at Manta Point, sharks at Crystal Rock, and an absurd density of coral and fish life throughout. The pink beach on Komodo Island is one of only a handful of pink sand beaches anywhere in the world. A two-night liveaboard is the definitive way to experience the park properly.",
    tags: ['Komodo Dragons', 'Diving', 'Manta Rays', 'Pink Beach', 'UNESCO'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Boat trips depart from Labuan Bajo (LBJ)',
  },
  {
    id: 'flores',
    name: 'Flores',
    emoji: '🌋',
    colour: '#6D4C41',
    airport: 'LBJ',
    region: 'KOMODO & FLORES',
    brief:
      "A long, mountainous island east of Komodo that rewards travellers willing to explore beyond the Komodo crowds. The centrepiece is Kelimutu volcano, home to three summit crater lakes that change colour independently due to volcanic mineral activity, shifting between turquoise, black, and deep red. The Trans-Flores Highway passes through traditional Ngada villages with distinctive megalithic architecture, thatched ancestor shrines, and weavers producing some of eastern Indonesia's most prized ikat textiles. Spider-web rice fields near Ruteng and the stone village of Bena are among the island's many understated highlights that most visitors on flying boat tours never reach.",
    tags: ['Kelimutu Crater Lakes', 'Ikat Weaving', 'Volcano', 'Traditional Villages', 'Off the Beaten Path'],
    recommendedDays: [3, 4],
    accessNote: 'Fly into LBJ or ENE (Ende)',
  },

  // ═══════════════════════════════════════════
  // JAVA
  // ═══════════════════════════════════════════
  {
    id: 'jakarta',
    name: 'Jakarta',
    emoji: '🏙️',
    colour: '#C0392B',
    airport: 'CGK',
    region: 'JAVA',
    brief:
      "Indonesia's sprawling capital is the country's primary international gateway and a megacity of contrasts worth at least a day between flights. The old Dutch colonial quarter of Kota Tua (Batavia) clusters around Fatahillah Square with well-preserved Dutch East India Company warehouses, the Jakarta History Museum, and excellent warungs serving soto Betawi. The National Museum houses one of Southeast Asia's finest archaeological collections from across the archipelago. Jakarta's food scene is genuinely world-class, spanning cheap street-side nasi goreng through to sophisticated Indonesian fine dining at restaurants increasingly making international lists.",
    tags: ['Gateway', 'Colonial History', 'Street Food', 'Shopping', 'Museums'],
    recommendedDays: [1, 2],
    mustVisit: true,
  },
  {
    id: 'bandung',
    name: 'Bandung',
    emoji: '🌿',
    colour: '#7986CB',
    airport: 'CGK',
    region: 'JAVA',
    brief:
      "A cool highland city at 768 metres surrounded by active volcanoes and colonial-era Dutch architecture. The Kawah Putih white sulphur crater lake and the Tangkuban Perahu volcano crater are the headline natural attractions, both reachable on a single day trip. Bandung is also West Java's fashion and food capital, with factory outlet shopping for local brands, outstanding Sundanese cuisine, and a lively creative arts scene centred on Jalan Braga. Most Australians visit as a side trip from Jakarta, but Bandung's climate, food, and laid-back pace are compelling enough for an independent overnight stay.",
    tags: ['Volcanoes', 'Crater Lakes', 'Factory Outlets', 'Sundanese Food', 'Cool Climate'],
    recommendedDays: [1, 2],
    accessNote: '3-hour drive from Jakarta (CGK) or short flight',
  },
  {
    id: 'yogyakarta',
    name: 'Yogyakarta',
    emoji: '🛕',
    colour: '#D4A017',
    airport: 'JOG',
    region: 'JAVA',
    brief:
      "The cultural heart of Java and home to two UNESCO World Heritage Sites within an hour of the city. Borobudur, the world's largest Buddhist temple, is one of the greatest monuments in Asia and best visited at sunrise when mist rolls through the surrounding valleys. Prambanan is a magnificent 9th-century Hindu temple complex of soaring stone towers dedicated to the Trimurti. The city itself rewards a day of exploration: the Sultan's Kraton palace, the nearby Taman Sari water castle, and Malioboro Street lined with batik sellers and wayang puppet workshops. The overnight train from Jakarta makes this an easy and atmospheric inclusion in any Java itinerary.",
    tags: ['Borobudur', 'Prambanan', 'UNESCO', 'Batik', 'Kraton Palace'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },

  // ═══════════════════════════════════════════
  // SULAWESI
  // ═══════════════════════════════════════════
  {
    id: 'toraja',
    name: 'Tana Toraja',
    emoji: '🏠',
    colour: '#A0522D',
    airport: 'UPG',
    region: 'SULAWESI',
    brief:
      "One of the most unique cultural destinations in Southeast Asia, hidden in the highlands of South Sulawesi. The Torajan people practice elaborate multi-day funeral ceremonies that are the centrepiece of their society, involving buffalo sacrifice, traditional music, and feasting on a scale that reflects the deceased's status in the community. Traditional tongkonan clan houses with their distinctive curved rooflines and buffalo horn facades cluster across the highlands. Cliff graves, hanging coffins, and tau tau effigy galleries carved into limestone walls make the burial sites unlike anything else on earth. Visit with a local guide who can navigate family connections and potentially witness a ceremony.",
    tags: ['Funeral Ceremonies', 'Tongkonan Houses', 'Cliff Graves', 'Buffalo', 'Culture'],
    recommendedDays: [2, 3],
    accessNote: 'Fly to Makassar (UPG), then 8-hour drive or short domestic flight to Rantepao',
  },

  // ═══════════════════════════════════════════
  // RAJA AMPAT & PAPUA
  // ═══════════════════════════════════════════
  {
    id: 'raja-ampat',
    name: 'Raja Ampat',
    emoji: '🤿',
    colour: '#006994',
    airport: 'SOQ',
    region: 'RAJA AMPAT & PAPUA',
    brief:
      "Consistently ranked the world's best diving destination, Raja Ampat sits at the very heart of the Coral Triangle and holds more marine species than anywhere else on the planet. Above water the scenery is equally extraordinary: hundreds of limestone mushroom islands covered in jungle rise from mirror-flat channels, creating a landscape that looks painted. Diving here means swimming through walls of schooling fish, hovering over pygmy seahorses, and watching wobbegong sharks resting on coral. A liveaboard covering multiple island groups is the ultimate experience, but land-based resorts on Waigeo and Batanta make Raja Ampat accessible to non-divers too who come purely for the scenery and snorkelling.",
    tags: ['World-Class Diving', 'Coral Triangle', 'Limestone Islands', 'Snorkelling', 'Liveaboards'],
    recommendedDays: [3, 5],
    mustVisit: true,
    accessNote: 'Fly to Sorong (SOQ) via Jakarta or Makassar, then speedboat to resorts',
  },
  {
    id: 'sumba',
    name: 'Sumba',
    emoji: '🏇',
    colour: '#BC8A5F',
    airport: 'WGP',
    region: 'LOMBOK & NUSA TENGGARA',
    brief:
      "A remote island west of Flores that remains one of Indonesia's least visited and most rewarding destinations. East Sumba holds some of Indonesia's most dramatic beaches: the steep grassy bluffs above Mandorak and Weekuri lagoon's turquoise natural saltwater pool are genuinely stunning. The Sumbanese are known for their animist Marapu religion, stone-slab megalithic tombs, and the spectacular Pasola festival in which mounted horsemen hurl spears at each other across open fields as a ritual offering. Luxury eco-lodges including Nihi Sumba have placed the island on the international travel radar without yet overwhelming it.",
    tags: ['Remote Beaches', 'Megalithic Tombs', 'Pasola Festival', 'Eco Lodges', 'Horses'],
    recommendedDays: [2, 3],
    accessNote: 'Fly to Waingapu (WGP) or Tambolaka via Bali or Kupang',
  },
];

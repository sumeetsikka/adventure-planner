import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Japan
 * 4. Consistently ranked in top Japan destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Tokyo: gateway, iconic, broadest appeal (1,2,4,5) ✓
 * - Kyoto: UNESCO temples/shrines, Japan's cultural heart (1,3,4,5) ✓
 * - Osaka: gateway, food capital, broad appeal (2,4,5) ✓
 * - Hiroshima + Miyajima: UNESCO, peace landmark, iconic torii gate (1,3,4,5) ✓
 * - Hokkaido/Sapporo: unique wilderness, snow festival, gateway (2,3,4,5) ✓
 * - Mt Fuji/Kawaguchiko: Japan's most iconic image, bucket-list (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Hakone: great but overlaps Mt Fuji experience (fails 3)
 * - Nara: half-day or day trip, lacks standalone depth (fails 3, 5)
 * - Kanazawa: excellent but niche cultural appeal (fails 5)
 * - Fukuoka: strong city but lacks singular bucket-list hook (fails 3)
 * - Others: day-trip scale, niche, or limited international recognition
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // KANTO
  // ═══════════════════════════════════════════
  {
    id: 'tokyo',
    name: 'Tokyo',
    emoji: '🗼',
    colour: '#E8003D',
    airport: 'NRT',
    region: 'KANTO',
    brief:
      "Japan's vast capital earns every one of its three to four days. Spend a day crossing the timelines from ancient Senso-ji Temple in Asakusa to the neon-drenched scramble crossing at Shibuya and the robot-filled arcades of Akihabara. Devote another to the neighbourhoods: vintage shopping in Shimokitazawa, teamLab Borderless digital art, and a towering view from the Tokyo Skytree. A third day can take in the serene Meiji Shrine and Harajuku, followed by the Michelin-dense izakaya alleys of Shinjuku's Golden Gai at night. A fourth day fits a teamLab Planets visit, the Tsukiji Outer Market at dawn, and a sake-fuelled boat cruise on Tokyo Bay.",
    tags: ['Temples', 'Nightlife', 'Street Food', 'Digital Art', 'Shopping'],
    recommendedDays: [5, 7],
    mustVisit: true,
  },
  {
    id: 'hakone',
    name: 'Hakone',
    emoji: '♨️',
    colour: '#7B68C8',
    airport: 'NRT',
    region: 'KANTO',
    brief:
      "A mountainous hot-spring resort town with one of the world's most photographed backdrops. On a clear day, Mt Fuji looms perfectly over the valley from the lakeside at Hakone-en and from the open-air sculpture park. Ride the scenic Hakone Ropeway over volcanic steam vents at Owakudani, take a pirate-ship cruise across Lake Ashi, and unwind in a traditional ryokan with a private onsen fed by geothermal springs. Two days lets you do the full loop: ropeway, lake cruise, and a morning soak before the day-trippers arrive from Tokyo.",
    tags: ['Onsen', 'Mt Fuji Views', 'Ropeway', 'Ryokan', 'Lake Cruise'],
    recommendedDays: [1, 2],
    accessNote: '90 min from Tokyo via Romancecar',
  },
  {
    id: 'nikko',
    name: 'Nikko',
    emoji: '⛩️',
    colour: '#C65B2A',
    airport: 'NRT',
    region: 'KANTO',
    brief:
      "An ornate UNESCO World Heritage shrine complex hidden in forested mountains north of Tokyo. The Tosho-gu Shrine, burial place of shogun Tokugawa Ieyasu, is arguably the most lavishly decorated religious site in all of Japan, covered in gilded carvings and lacquerwork across 55 individual buildings. A single full day covers the main shrine complex, the Rinno-ji temple, and a walk to the 97-metre Kegon Waterfall. Nikko works perfectly as a day trip from Tokyo, though an overnight stay lets you catch the crowds-free morning atmosphere.",
    tags: ['UNESCO', 'Shrines', 'Waterfalls', 'Tokugawa History'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Tokyo (2hr by train)',
  },
  {
    id: 'kamakura',
    name: 'Kamakura',
    emoji: '🪷',
    colour: '#3D8B6E',
    airport: 'NRT',
    region: 'KANTO',
    brief:
      "A compact coastal temple town anchored by the great bronze Kotoku-in Buddha, sitting serenely in the open air since 1252. Walk or cycle the Daibutsu Hiking Course through cedar forest linking five zen temples in half a day, then descend to Yuigahama Beach for a seaside lunch. The Hase-dera cave temple and Tsurugaoka Hachimangu shrine round out a satisfying full day. Kamakura is one of Japan's finest day trips and rarely warrants more than a single overnight unless you want to explore the quieter inland temple trails.",
    tags: ['Great Buddha', 'Temple Hiking', 'Cycling', 'Beach'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Tokyo (1hr by train)',
  },

  // ═══════════════════════════════════════════
  // CHUBU
  // ═══════════════════════════════════════════
  {
    id: 'mtfuji',
    name: 'Mt Fuji / Kawaguchiko',
    emoji: '🗻',
    colour: '#5B8DB8',
    airport: 'NRT',
    region: 'CHUBU',
    brief:
      "Japan's most iconic image and a UNESCO World Heritage Site that rewards at least one overnight stay in the Fuji Five Lakes region. Lake Kawaguchiko offers the classic mirror-reflection view of the cone at dawn and dusk, best captured from the Chureito Pagoda on the hillside above Fujiyoshida. From July to early September, the official climbing season is open and a guided overnight summit hike to watch sunrise from the crater rim is a genuine bucket-list experience. The second day at the lake fills easily with a cycle around the shoreline, a trip to Oshino Hakkai's crystal-clear spring pools, and the Fuji-Q Highland roller coasters.",
    tags: ['Iconic Views', 'Summit Hike', 'Chureito Pagoda', 'Lake Cycling', 'UNESCO'],
    recommendedDays: [1, 2],
    accessNote: '2hr from Tokyo by highway bus or train',
  },
  {
    id: 'kanazawa',
    name: 'Kanazawa',
    emoji: '🦢',
    colour: '#4A8FA8',
    airport: 'KMQ',
    region: 'CHUBU',
    brief:
      "Often called 'Little Kyoto', Kanazawa escaped the Second World War's bombing and retains its castle town streets, samurai and geisha districts entirely intact. Kenroku-en, one of Japan's three great gardens, justifies a long morning stroll through its manicured ponds and stone lanterns. Spend a second day exploring the Higashi Chaya geisha quarter over matcha tea, the 21st Century Museum of Contemporary Art, and Omicho Market's crab and fresh-caught seafood stalls. A third day pairs a morning at the preserved Nagamachi samurai neighbourhood with a day trip to the UNESCO gassho-zukuri farmhouses at Shirakawa-go.",
    tags: ['Gardens', 'Geisha District', 'Samurai Quarter', 'Contemporary Art', 'Seafood Market'],
    recommendedDays: [2, 3],
  },
  {
    id: 'takayama',
    name: 'Takayama',
    emoji: '🏚️',
    colour: '#8B6B3D',
    airport: 'NGO',
    region: 'CHUBU',
    brief:
      "A beautifully preserved Edo-period merchant town deep in the Japanese Alps, connected to Kanazawa and Nagoya by scenic limited-express train. The Sanmachi Suji historic district is a grid of dark timber merchant houses, sake breweries, and craft galleries that invite a slow morning wander. Spend the afternoon at Jinya, the impeccably preserved provincial government house, and tackle the two morning markets at Jinya-mae and Miyagawa for pickled vegetables and local ceramics. Two full days allow a half-day bus trip to the UNESCO thatched-roof villages of Shirakawa-go and Gokayama, considered by many the most beautiful rural scenery in Japan.",
    tags: ['Edo Architecture', 'Sake Breweries', 'Morning Markets', 'Shirakawa-go Day Trip'],
    recommendedDays: [2, 2],
  },
  {
    id: 'nagoya',
    name: 'Nagoya',
    emoji: '🏯',
    colour: '#D4A520',
    airport: 'NGO',
    region: 'CHUBU',
    brief:
      "Japan's fourth-largest city is a practical hub between Tokyo and Osaka with its own distinct culture and food scene. Nagoya Castle is the city's centrepiece, notable for its golden shachi (killer whale) roof ornaments, and the reconstructed main keep towers over a moat and garden worth an hour or two. Nagoya's soul is in its food: hitsumabushi (grilled eel over rice eaten three ways), miso katsu pork cutlet, and tebasaki chicken wings are hyper-local dishes found nowhere else. One full day covers the castle and the old town Shikemichi district; two days adds Atsuta Shrine and Toyota Commemorative Museum of Industry.",
    tags: ['Nagoya Castle', 'Miso Katsu', 'Hitsumabushi', 'Industrial History'],
    recommendedDays: [1, 2],
  },

  // ═══════════════════════════════════════════
  // KANSAI
  // ═══════════════════════════════════════════
  {
    id: 'kyoto',
    name: 'Kyoto',
    emoji: '🏮',
    colour: '#C8102E',
    airport: 'KIX',
    region: 'KANSAI',
    brief:
      "Japan's ancient imperial capital and its cultural heart, with 17 UNESCO World Heritage Sites spread across a walkable city of temples, shrines, and preserved geisha districts. Day one: Fushimi Inari's tunnel of 10,000 vermilion torii gates at dawn, then Nishiki Market, Gion's cobblestone streets, and the gilded Kinkaku-ji Golden Pavilion. Day two: Arashiyama bamboo grove, the Tenryu-ji zen garden, and a kimono walk along the Philosopher's Path. Day three: the immense Nijo Castle, Kiyomizu-dera temple perched on the hillside, and a multi-course kaiseki dinner in a machiya townhouse. A fourth day adds the Fushimi sake district or a day trip to Nara.",
    tags: ['UNESCO Temples', 'Geisha District', 'Bamboo Grove', 'Kaiseki Dining', 'Torii Gates'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'osaka',
    name: 'Osaka',
    emoji: '🦑',
    colour: '#FF6600',
    airport: 'KIX',
    region: 'KANSAI',
    brief:
      "Japan's self-declared kitchen and its most boisterously fun city. The Dotonbori canal strip at night is a sensory overload of neon signs, giant mechanical crabs, and the world-famous takoyaki octopus balls. Day one: Osaka Castle in the morning, then the Kuromon Ichiba market for street snacks, followed by Dotonbori and Shinsekai at night. Day two: a pilgrimage to the original Konamon Museum, Amerikamura for vintage fashion, and Namba Grand Kagetsu comedy theatre for rakugo and manzai. A third day fits a day trip to Nara or the Minoh Waterfall hiking trail and a yakitori crawl along the railway arches of Hozenji Yokocho.",
    tags: ['Street Food', 'Nightlife', 'Osaka Castle', 'Dotonbori', 'Takoyaki'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'nara',
    name: 'Nara',
    emoji: '🦌',
    colour: '#7CB878',
    airport: 'KIX',
    region: 'KANSAI',
    brief:
      "Japan's first permanent capital, where over 1,200 free-roaming sacred deer wander among ancient temples and shrines in Nara Park. The Todai-ji temple houses the world's largest bronze Buddha statue inside the world's largest wooden building, and both are genuinely awe-inspiring at close range. Pick up a pack of shika senbei (deer crackers) at the park gate and brace yourself for affectionate nudging. Nara is a perfect half-day from Kyoto or Osaka, though a full day allows visits to Kasuga-taisha Shrine's lantern-lined path and the quieter Naramachi merchant district.",
    tags: ['Sacred Deer', 'Giant Buddha', 'Ancient Temples', 'Naramachi'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Kyoto (45min) or Osaka (35min)',
  },
  {
    id: 'kobe',
    name: 'Kobe',
    emoji: '🥩',
    colour: '#B5294E',
    airport: 'KIX',
    region: 'KANSAI',
    brief:
      "A cosmopolitan port city best known for the world's most celebrated beef and a sophisticated, European-influenced atmosphere. The Kitano district's Western-style stone mansions, built by foreign traders in the Meiji era, make for an atmospheric morning stroll. Kobe beef is the main event: a teppanyaki lunch where the marbled sirloin is seared on a hot iron plate in front of you is a splurge worth every yen. Nada, Kobe's sake-brewing district, offers free tastings at centuries-old breweries, and the waterfront Harborland is pleasant at dusk. One full day covers the highlights comfortably as a day trip from Osaka or Kyoto.",
    tags: ['Kobe Beef', 'Sake Breweries', 'Kitano District', 'Harbour'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Osaka via KIX (30min by train)',
  },
  {
    id: 'naoshima',
    name: 'Naoshima',
    emoji: '🎨',
    colour: '#9B59B6',
    airport: 'KIX',
    region: 'KANSAI',
    brief:
      "A small Seto Inland Sea island transformed into one of the world's most extraordinary contemporary art destinations. Benesse Art Site Naoshima integrates museums, installations, and sculptures into the island's landscape: Yayoi Kusama's polka-dot pumpkins have become globally iconic, while the underground Chichu Art Museum built into a hillside houses permanent Monet and James Turrell works in natural light. Cycling between outdoor installations across pine-covered hills to the fishing village of Honmura, where artists have converted traditional machiya houses into 'Art House Projects', fills a satisfying full day. An overnight stay lets you catch the museums at golden hour and explore the quieter corners at dawn.",
    tags: ['Contemporary Art', 'Yayoi Kusama', 'Chichu Museum', 'Cycling', 'Art House Projects'],
    recommendedDays: [1, 2],
    accessNote: 'Ferry from Uno Port via KIX (2.5hr total)',
  },

  // ═══════════════════════════════════════════
  // CHUGOKU
  // ═══════════════════════════════════════════
  {
    id: 'hiroshima',
    name: 'Hiroshima and Miyajima',
    emoji: '🕊️',
    colour: '#E05C2A',
    airport: 'HIJ',
    region: 'CHUGOKU',
    brief:
      "Two of Japan's most powerful and beautiful places combined into one unmissable stop. Hiroshima's Peace Memorial Park and Museum confront the atomic bombing of August 1945 with unflinching honesty: the skeletal A-Bomb Dome, preserved at the epicentre, and the Children's Peace Monument draped in folded cranes demand a full, unhurried morning. A short ferry from Ujina Port reaches Miyajima Island, where the vermilion O-torii gate of Itsukushima Shrine appears to float on the sea at high tide and has been a sacred site for over 1,400 years. Day one covers the Peace Park and Museum thoroughly; day two is for Miyajima, hiking Mt Misen through primeval forest for panoramic views over the Seto Inland Sea. Three days adds Hiroshima's Shukkei-en garden and Sake Museum in nearby Saijo.",
    tags: ['Peace Memorial', 'UNESCO', 'Floating Torii Gate', 'Mt Misen', 'History'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },

  // ═══════════════════════════════════════════
  // KYUSHU
  // ═══════════════════════════════════════════
  {
    id: 'fukuoka',
    name: 'Fukuoka',
    emoji: '🍜',
    colour: '#E84545',
    airport: 'FUK',
    region: 'KYUSHU',
    brief:
      "Kyushu's largest city and the birthplace of tonkotsu ramen, Japan's most copied and beloved noodle style. The Nakasu yatai stalls are a unique Fukuoka institution: open-air wooden food carts lining the river where locals and visitors crowd in at dusk for ramen, yakitori, and cold Asahi. Day one: Ohori Park and Fukuoka Castle ruins in the morning, Canal City shopping complex, and Nakasu at night. Day two: Dazaifu Tenmangu shrine complex surrounded by ancient cedar trees, the stunning contemporary Kyushu National Museum, and a final bowl of ramen at the original Shin-Shin or Ichiran before the ferry or flight onward. Fukuoka also serves as the gateway for Beppu's hell hot springs and Nagasaki's history.",
    tags: ['Tonkotsu Ramen', 'Yatai Food Stalls', 'Dazaifu Shrine', 'Nightlife'],
    recommendedDays: [2, 3],
  },
  {
    id: 'yakushima',
    name: 'Yakushima',
    emoji: '🌲',
    colour: '#2E7B52',
    airport: 'KOJ',
    region: 'KYUSHU',
    brief:
      "A wild, moss-draped UNESCO World Heritage island off southern Kyushu, home to ancient cedar trees thousands of years old and the inspiration for Hayao Miyazaki's Princess Mononoke forest. The Jomon Sugi, estimated at between 2,170 and 7,200 years old and the largest cedar in Japan, requires a full-day 22-kilometre return hike through cloud forest to reach, but the experience of standing before something so ancient is genuinely overwhelming. Day two covers the Shiratani Unsuikyo Ravine trail, a shorter but equally atmospheric mossy gorge walk. A third day allows snorkelling with sea turtles in the bays around Inaka Beach, which has some of Japan's clearest ocean water.",
    tags: ['Ancient Forest', 'Jomon Cedar', 'UNESCO', 'Sea Turtles', 'Hiking'],
    recommendedDays: [2, 3],
    accessNote: 'Fly from Kagoshima (KOJ, 35min) or ferry (4hr)',
  },

  // ═══════════════════════════════════════════
  // HOKKAIDO
  // ═══════════════════════════════════════════
  {
    id: 'hokkaido',
    name: 'Hokkaido / Sapporo',
    emoji: '❄️',
    colour: '#1E7ACB',
    airport: 'CTS',
    region: 'HOKKAIDO',
    brief:
      "Japan's northernmost island is a place of extraordinary natural beauty with experiences that change entirely by season. In February, the Sapporo Snow Festival fills Odori Park with colossal ice sculptures and attracts two million visitors, while the ski resorts at Niseko and Furano deliver Japan's legendary powder snow. In summer, the Furano and Biei lavender fields turn the hillsides violet and blue, and Hokkaido's national parks -- Daisetsuzan and Shiretoko -- offer wilderness hiking that feels genuinely remote. Sapporo itself rewards a day: the Sapporo Beer Museum, the vast open grid of the Tanuki-koji arcade, and the seafood don (rice bowl) at Nijo Market with Hokkaido uni (sea urchin) and scallop. Three to four days is right for Sapporo plus one of the national parks or ski resorts.",
    tags: ['Powder Skiing', 'Lavender Fields', 'Snow Festival', 'National Parks', 'Uni Seafood'],
    recommendedDays: [4, 6],
    mustVisit: true,
  },

  // ═══════════════════════════════════════════
  // OKINAWA
  // ═══════════════════════════════════════════
  {
    id: 'okinawa',
    name: 'Okinawa',
    emoji: '🐠',
    colour: '#00A3BF',
    airport: 'OKA',
    region: 'OKINAWA',
    brief:
      "A subtropical island chain in the East China Sea with a culture, cuisine, and dialect entirely distinct from mainland Japan. Okinawa has some of the clearest, warmest ocean water in Japan and is the nation's top snorkelling and diving destination: the Blue Cave at Cape Maeda and the outer islands of Kerama are world-class dive sites. Day one: Shuri Castle, the restored UNESCO palace of the Ryukyu Kingdom, and the harrowing Himeyuri Peace Museum at the former wartime underground hospital. Day two: Cape Maeda snorkelling, fresh champuru (stir-fry) and sea grape salad at a local shokudo. Day three onward: hop a ferry to the outer Kerama Islands for pristine beaches and humpback whale watching from January to March.",
    tags: ['Diving', 'Snorkelling', 'Ryukyu History', 'Subtropical Beaches', 'UNESCO'],
    recommendedDays: [3, 4],
  },
];

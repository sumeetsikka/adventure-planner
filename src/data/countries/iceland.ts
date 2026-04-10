import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Iceland
 * 4. Consistently ranked in top Iceland destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Reykjavik: main gateway, top-ranked, broad appeal (2,4,5) ✓
 * - Golden Circle: Thingvellir UNESCO, Geysir unique, top-ranked, broad appeal (1,3,4,5) ✓
 * - Blue Lagoon: globally iconic geothermal spa, bucket-list, top-ranked (3,4,5) ✓
 * - Jokulsarlon Glacier Lagoon: unique iceberg lagoon, bucket-list, top-ranked (3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - South Coast: stunning but a route rather than a single destination (fails 2,5 as standalone)
 * - Snaefellsnes, Myvatn: exceptional but niche adventure/photography audience (fails 2,5)
 * - Akureyri: good gateway but lacks globally iconic draw (fails 1,3)
 * - Husavik, Landmannalaugar, Westfjords, Vatnajokull: niche or specialist traveller appeal (fails 5)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // REYKJAVIK & SOUTHWEST
  // ═══════════════════════════════════════════
  {
    id: 'reykjavik',
    name: 'Reykjavik',
    emoji: '🏙️',
    colour: '#2980B9',
    airport: 'KEF',
    region: 'REYKJAVIK & SOUTHWEST',
    brief:
      "Reykjavik is the world's northernmost capital, a compact and culturally vibrant city of colourful corrugated iron houses, geothermally heated outdoor swimming pools, and a nightlife scene that punches well above its modest population. The Hallgrimskirkja church, inspired by basalt lava columns and visible from almost anywhere in the city, is Iceland's most photographed building and offers panoramic views from its tower. The Harpa Concert Hall on the waterfront, with its geometric glass facade echoing the Northern Lights, is a work of contemporary architecture worth visiting in its own right. Whale watching tours from the old harbour run year-round, hot pot culture at the Vesturbaejarlaug outdoor pool is the authentic local pastime, and the Laugavegur street is lined with some of the world's most creative small restaurants and independent design shops.",
    tags: ['Hallgrimskirkja', 'Whale Watching', 'Hot Pots', 'Nightlife'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'golden-circle',
    name: 'Golden Circle',
    emoji: '⭕',
    colour: '#F39C12',
    airport: 'KEF',
    region: 'REYKJAVIK & SOUTHWEST',
    brief:
      "The Golden Circle is Iceland's most popular touring route, connecting three of the country's greatest natural and historical attractions in a comfortable day loop from Reykjavik. Thingvellir National Park is a UNESCO World Heritage Site where the North American and Eurasian tectonic plates are visibly pulling apart, and where the Althing, the world's oldest parliament, first convened in 930 AD. The Geysir geothermal field contains Strokkur, which erupts a 20-metre column of boiling water every five to ten minutes with extraordinary reliability, the original Great Geysir that gave all geysers their name. Gullfoss is a thundering double-tier waterfall where the Hvita River plunges 32 metres into a glacier-carved canyon in a perpetual cloud of spray.",
    tags: ['Thingvellir UNESCO', 'Geysir', 'Gullfoss', 'Tectonic Plates'],
    recommendedDays: [1, 2],
    mustVisit: true,
    accessNote: 'Day trip from Reykjavik (KEF), self-drive or organised tour, approximately 300 km loop',
  },
  {
    id: 'blue-lagoon',
    name: 'Blue Lagoon',
    emoji: '♨️',
    colour: '#5DADE2',
    airport: 'KEF',
    region: 'REYKJAVIK & SOUTHWEST',
    brief:
      "The Blue Lagoon is Iceland's most famous attraction: a milky-blue geothermal seawater pool in the middle of a lava field on the Reykjanes Peninsula, whose silica-rich waters have made it globally synonymous with Icelandic wellness. The water maintains a constant temperature of around 39 degrees Celsius year-round, and bathing in the steaming pools while surrounded by black volcanic rock is a genuinely extraordinary experience in any season, particularly on crisp winter nights under potential aurora skies. The in-water silica mud masks are an obligatory ritual, and the recently opened Retreat Hotel offers a premium experience with private lagoon access. Conveniently located between Keflavik Airport and Reykjavik, the Blue Lagoon makes an ideal first or last stop on any Iceland trip.",
    tags: ['Geothermal Spa', 'Silica Mud', 'Lava Fields', 'Wellness'],
    recommendedDays: [1, 1],
    mustVisit: true,
    isDayTrip: true,
    accessNote: 'Day trip from Reykjavik (KEF), 45 minutes by car, or stop en route between airport and city',
  },
  {
    id: 'snaefellsnes-peninsula',
    name: 'Snaefellsnes Peninsula',
    emoji: '🌋',
    colour: '#6C3483',
    airport: 'KEF',
    region: 'REYKJAVIK & SOUTHWEST',
    brief:
      "The Snaefellsnes Peninsula is often called Iceland in miniature, packing glaciers, lava fields, black sand beaches, fishing villages, and dramatic sea cliffs into a single compact landmass two hours north of Reykjavik. The Snaefellsjokull glacier-capped volcano at the peninsula's tip is the entrance to the centre of the earth in Jules Verne's classic novel and a National Park in its own right. Kirkjufell, a distinctive arrow-shaped mountain rising from the north coast near Grundarfjordur, is the most photographed mountain in Iceland and doubly recognisable as the mountain in Game of Thrones. The Djupalonssandur black pebble beach and the basalt sea stacks at Londrangar are among the many dramatic coastal features that reward a full day's exploration by car.",
    tags: ['Kirkjufell', 'Glacier Volcano', 'Jules Verne', 'Dramatic Coastline'],
    recommendedDays: [2, 2],
    accessNote: 'Via Reykjavik (KEF), approximately 2 hours by car to the start of the peninsula',
  },

  // ═══════════════════════════════════════════
  // SOUTH COAST
  // ═══════════════════════════════════════════
  {
    id: 'south-coast',
    name: 'South Coast',
    emoji: '🏖️',
    colour: '#34495E',
    airport: 'KEF',
    region: 'SOUTH COAST',
    brief:
      "Iceland's South Coast is one of the most rewarding drives in the world, stretching from Selfoss through a relentless succession of waterfalls, glaciers, black sand beaches, and coastal bird colonies to the village of Vik. Seljalandsfoss is a 60-metre curtain waterfall with a path that runs behind the falling water for a soaking but unforgettable experience. Skogarfoss a few kilometres further east is wider and even more powerful, with a staircase to the right side leading to clifftop views and the start of the famous Fimmvorduhals hiking trail. Reynisfjara black sand beach near Vik is one of the most dramatic coastlines in Europe, with columnar basalt caves, towering rock stacks called Reynisdrangar, and powerful Atlantic surf.",
    tags: ['Seljalandsfoss', 'Skogafoss', 'Reynisfjara Beach', 'Vik'],
    recommendedDays: [2, 3],
    accessNote: 'Via Reykjavik (KEF) heading east on Route 1; Vik is approximately 2.5 hours by car',
  },
  {
    id: 'jokulsarlon-glacier-lagoon',
    name: 'Jokulsarlon Glacier Lagoon',
    emoji: '🧊',
    colour: '#85C1E9',
    airport: 'KEF',
    region: 'SOUTH COAST',
    brief:
      "Jokulsarlon is Iceland's largest and most dramatic glacial lagoon, where enormous blue-tinted icebergs calve from the Breidamerkurjokull glacier and drift slowly out to sea in a procession of ever-changing sculptural forms. Amphibious boat tours navigate between the icebergs at close range, and seal colonies lounge on the ice floes with impressive indifference to visitors. Diamond Beach, just across the road at the lagoon's outlet, is a black sand shoreline scattered with translucent ice blocks washed up from the lagoon, creating one of the most surreal and photogenic landscapes in the world. The lagoon is located within Vatnajokull National Park and the drive there along the Ring Road from Reykjavik passes through the full breadth of Iceland's South Coast scenery.",
    tags: ['Icebergs', 'Diamond Beach', 'Boat Tours', 'Glacier'],
    recommendedDays: [1, 2],
    mustVisit: true,
    accessNote: 'Via Reykjavik (KEF), approximately 5 hours east along the Ring Road; best combined with a multi-day South Coast drive',
  },
  {
    id: 'landmannalaugar',
    name: 'Landmannalaugar',
    emoji: '🏔️',
    colour: '#E74C3C',
    airport: 'KEF',
    region: 'SOUTH COAST',
    brief:
      "Landmannalaugar is Iceland's most spectacular highland destination, a remote geothermal valley surrounded by rhyolite mountains in extraordinary shades of pink, yellow, orange, and green that look improbable in almost every photograph. It is the starting point of the Laugavegur trek, widely regarded as one of the finest multi-day hikes in the world, which takes four to five days to complete through obsidian lava fields, emerald glaciers, and hot spring valleys to the village of Thorsmork. For day visitors, a natural hot river flows through the camp area, providing a geothermal soak surrounded by surreal mountain colour. The destination is accessible only in summer (typically late June to September) by 4WD vehicle or highland bus.",
    tags: ['Rhyolite Mountains', 'Laugavegur Trek', 'Hot River', 'Highland'],
    recommendedDays: [2, 2],
    accessNote: 'Via Reykjavik (KEF), accessible by highland bus (F road) in summer only, approximately 3 to 4 hours',
  },
  {
    id: 'vatnajokull-glacier',
    name: 'Vatnajokull Glacier',
    emoji: '🏔️',
    colour: '#BDC3C7',
    airport: 'KEF',
    region: 'SOUTH COAST',
    brief:
      "Vatnajokull is the largest glacier in Europe by volume, a vast ice cap covering roughly 8 per cent of Iceland's total land area and spawning numerous outlet glaciers that can be reached for guided walking tours. Glacier hiking on one of the accessible tongues such as Svinafellsjokull or Falljokull is one of Iceland's most rewarding adventure activities, combining crampons, ice axes, and the eerie blue world of crevassed ice. In winter, ice cave tours into naturally formed crystal blue caverns beneath the glacier are among the most spectacular experiences available anywhere in the world, though caves vary in size and accessibility each year. The surrounding Vatnajokull National Park encompasses both Jokulsarlon Glacier Lagoon and the Skaftafell nature reserve.",
    tags: ['Glacier Hiking', 'Ice Caves', 'Crampons', 'Ice Cap'],
    recommendedDays: [1, 2],
    accessNote: 'Via Reykjavik (KEF), approximately 5 hours east along the Ring Road; guided tours are essential for glacier access',
  },

  // ═══════════════════════════════════════════
  // NORTH ICELAND
  // ═══════════════════════════════════════════
  {
    id: 'akureyri',
    name: 'Akureyri',
    emoji: '🐋',
    colour: '#27AE60',
    airport: 'AEY',
    region: 'NORTH ICELAND',
    brief:
      "Akureyri is Iceland's second city and the unofficial capital of the north, a surprisingly cosmopolitan town of 20,000 people sitting at the head of Eyjafjordur, Iceland's longest fjord, with a compact and lively centre disproportionate to its size. The Akureyrarkirkja church, with its stained glass windows incorporating medieval English glass, sits on a hill above the town and is the architectural centrepiece of the north. Whale watching from Akureyri's harbour is among the most productive in Iceland, with humpback whales reliably present in summer in the rich waters of the fjord. Godafoss, the Waterfall of the Gods where Iceland's law speaker cast his Norse idols when the country adopted Christianity in 1000 AD, is just 40 minutes east along the Ring Road.",
    tags: ['Whale Watching', 'Godafoss', 'Gateway North', 'Fjord Town'],
    recommendedDays: [2, 3],
  },
  {
    id: 'husavik',
    name: 'Husavik',
    emoji: '🐳',
    colour: '#2E86C1',
    airport: 'AEY',
    region: 'NORTH ICELAND',
    brief:
      "Husavik is the self-proclaimed whale watching capital of Iceland and arguably of Europe, a charming fishing village whose traditional wooden church and colourful harbour front appear on postcards across the country. The waters of Skjalfandi Bay are exceptionally rich in krill and capelin, attracting up to eleven whale species including humpback, minke, blue, and fin whales with a frequency and closeness that consistently exceeds encounters elsewhere. The GeoSea Geothermal Sea Baths opened in 2018 on a clifftop above the harbour, offering a saltwater geothermal soaking experience with views over the bay and the distant mountains. The town is also home to the Exploration Museum and a very good whale museum explaining the science and conservation of Iceland's cetacean populations.",
    tags: ['Whale Capital', 'GeoSea Baths', 'Fishing Village', 'Wildlife'],
    recommendedDays: [1, 2],
    accessNote: 'Via Akureyri (AEY), approximately 1 hour by car',
  },
  {
    id: 'myvatn',
    name: 'Myvatn',
    emoji: '🌋',
    colour: '#922B21',
    airport: 'AEY',
    region: 'NORTH ICELAND',
    brief:
      "Lake Myvatn and its surrounding area is one of Iceland's most geologically diverse destinations, a shallow lake sitting in the middle of a volcanic zone characterised by pseudocraters, lava pillars, mud pots, fumaroles, and active fissures. The Myvatn Nature Baths are a less crowded and equally impressive alternative to the Blue Lagoon, with geothermally heated milky blue water in a dramatic volcanic setting above the lake. Dimmuborgir, a field of spectacular lava formations resembling a ruined city, and Hverfell, a perfect tephra ring crater walkable around the rim, are highlights of the immediately surrounding landscape. Krafla caldera and the Leirhnjukur lava fields, still warm to the touch from volcanic activity as recent as 1984, add a genuinely dramatic geological dimension to the area.",
    tags: ['Volcanic Landscape', 'Nature Baths', 'Pseudocraters', 'Lava Fields'],
    recommendedDays: [2, 2],
    accessNote: 'Via Akureyri (AEY), approximately 1 hour by car east along Route 1',
  },

  // ═══════════════════════════════════════════
  // EAST & WESTFJORDS
  // ═══════════════════════════════════════════
  {
    id: 'westfjords',
    name: 'Westfjords',
    emoji: '🦊',
    colour: '#1D6A96',
    airport: 'KEF',
    region: 'EAST & WESTFJORDS',
    brief:
      "The Westfjords are Iceland's most remote and least visited major region, a dramatically indented peninsula of deep fjords, towering bird cliffs, and Arctic wilderness that sees only a fraction of the tourists that visit the south and north. Dynjandi waterfall, a series of cascading drops totalling 100 metres wide at the base, is among the most spectacular waterfalls in Iceland and largely unknown outside the country. The Latrabjarg bird cliffs on the westernmost tip of the peninsula form the largest seabird colony in the North Atlantic, with millions of puffins, guillemots, razorbills, and gannets nesting on a 14-kilometre stretch of 400-metre cliffs. Arctic foxes, the only native land mammal of Iceland, are commonly seen in the Westfjords at the Melrakkasetur Arctic Fox Centre and in the surrounding landscape.",
    tags: ['Dynjandi Waterfall', 'Puffin Cliffs', 'Arctic Foxes', 'Remote Wilderness'],
    recommendedDays: [3, 4],
    accessNote: 'Via Reykjavik (KEF) by domestic flight to Isafjordur (IFJ) or long drive north, approximately 5 to 6 hours by car',
  },
];

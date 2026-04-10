import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in New Zealand
 * 4. Consistently ranked in top NZ destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Queenstown: adventure capital, bucket-list, broad appeal (3,4,5) ✓
 * - Milford Sound: UNESCO Fiordland, globally iconic, bucket-list (1,3,4,5) ✓
 * - Hobbiton: globally iconic film location, broad appeal (3,4,5) ✓
 * - Tongariro: UNESCO dual-heritage, globally ranked alpine crossing (1,3,4,5) ✓
 * - Mt Cook/Aoraki: UNESCO, NZ's highest peak, iconic landscape (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Auckland: gateway but lacks compelling standalone attractions (fails 3)
 * - Rotorua: remarkable geothermal but niche appeal to some vibes (fails 5)
 * - Wellington: excellent capital but limited bucket-list singular experience (fails 3)
 * - Franz Josef: impressive but glacier retreat makes experience less reliable (fails 3)
 * - Others: day-trip scale, regional appeal, or niche traveller types
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // NORTH ISLAND
  // ═══════════════════════════════════════════
  {
    id: 'auckland',
    name: 'Auckland',
    emoji: '🌉',
    colour: '#1A5FA0',
    airport: 'AKL',
    region: 'NORTH ISLAND',
    brief:
      "New Zealand's largest city and main international gateway sits on a narrow isthmus between two harbours, giving it a distinctive waterfront character and a skyline punctuated by the Sky Tower. Climb or bungee jump from the 192-metre Sky Tower observation deck for the first sweeping view of the Waitemata Harbour, then walk down to the Viaduct Harbour precinct for a craft beer and fresh seafood lunch at the water's edge. The ferry to Waiheke Island takes 35 minutes from downtown and delivers wine estates, olive groves, and secluded beaches that feel worlds away from the city. A third day suits a drive to the Waitakere Ranges rainforest and Piha's black sand surf beach, or a visit to the Auckland War Memorial Museum for an excellent introduction to Maori and Pacific culture.",
    tags: ['Sky Tower', 'Waiheke Island', 'Maori Culture', 'Harbour', 'Wine'],
    recommendedDays: [2, 3],
  },
  {
    id: 'bayofislands',
    name: 'Bay of Islands',
    emoji: '⛵',
    colour: '#2E8B8B',
    airport: 'AKL',
    region: 'NORTH ISLAND',
    brief:
      "A sub-tropical scatter of 144 islands in the far north of New Zealand where dolphins play in the bow waves of charter boats and historic sites mark the birthplace of the modern nation. Paihia is the main base for day cruises, diving, and kayaking among the islands, with the famous Hole in the Rock sea arch at Cape Brett requiring a full-day boat excursion. Waitangi Treaty Grounds, where the founding document of New Zealand was signed between Maori chiefs and the British Crown in 1840, is the country's most significant historic site and warrants a full morning with a guided tour. Cape Reinga at the very tip of the North Island, where the Tasman Sea meets the Pacific in a visible line of clashing currents, is a profound day trip through the Aupouri Peninsula's giant sand dunes.",
    tags: ['Dolphin Cruises', 'Waitangi Treaty Grounds', 'Sailing', 'Cape Reinga'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Auckland (AKL) by bus or car (3.5hr north)',
  },
  {
    id: 'coromandel',
    name: 'Coromandel Peninsula',
    emoji: '🌿',
    colour: '#3D7A4A',
    airport: 'AKL',
    region: 'NORTH ISLAND',
    brief:
      "A forested peninsula two hours east of Auckland with some of the most scenic beaches on the North Island and a relaxed alternative-lifestyle character shaped by artists, craftspeople, and former hippies who moved here in the 1970s. Cathedral Cove, accessible only on foot or by kayak, is an extraordinary sea arch leading to a beach enclosed by cream-coloured cliffs and is one of the most photographed spots in New Zealand. Hot Water Beach has a geothermal quirk: at low tide, visitors hire shovels and dig their own personal hot spa pools in the sand as thermal water bubbles up directly from the beach. The Coromandel township itself has good art galleries, local craft beer, and the Driving Creek Railway, a narrow-gauge train through kauri forest to a panoramic hilltop.",
    tags: ['Cathedral Cove', 'Hot Water Beach', 'Coastal Walks', 'Art Scene'],
    recommendedDays: [2, 2],
    accessNote: 'Accessible from Auckland (AKL) by bus or car (2.5hr)',
  },
  {
    id: 'rotorua',
    name: 'Rotorua',
    emoji: '♨️',
    colour: '#C8500A',
    airport: 'ROT',
    region: 'NORTH ISLAND',
    brief:
      "New Zealand's geothermal heartland is the country's most concentrated destination for Maori culture and volcanic activity, where the earth literally steams and the air carries a faint sulphuric tang. Wai-O-Tapu Thermal Wonderland presents boiling mud pools, vivid Champagne Pool mineral terraces, and a daily Lady Knox Geyser eruption in a surreal landscape that looks computer-generated. The Te Puia cultural centre combines a living Maori arts school with haka performances and the Pohutu Geyser, the largest active geyser in the southern hemisphere. Mountain biking in the Whakarewarewa Forest through world-class redwood trails and a Maori hangi dinner cooked underground in geothermal steam round out a thoroughly active and culturally immersive visit.",
    tags: ['Geothermal', 'Maori Culture', 'Mountain Biking', 'Hangi Dinner', 'Pohutu Geyser'],
    recommendedDays: [2, 3],
  },
  {
    id: 'hobbiton',
    name: 'Hobbiton',
    emoji: '🧙',
    colour: '#7A9A3A',
    airport: 'ROT',
    region: 'NORTH ISLAND',
    brief:
      "The Hobbiton Movie Set in the Waikato farmland near Matamata is the most detailed and permanent film location tourism attraction in the world, where 44 Hobbit holes built into the hillside around the Party Tree and the Green Dragon Inn are maintained in full working condition year-round as if the Shire's residents have simply stepped out for the afternoon. The two-hour guided tour takes visitors through all the principal filming locations used across the six Lord of the Rings and Hobbit films, finishing at the Green Dragon for an exclusive Southfur Ales beer or cider brewed for the attraction. Evening Banquet tours operate year-round with a three-course dinner under lantern light in the Party Field, and special seasonal events run throughout the year. Hobbiton is an easy day trip from both Rotorua and Auckland.",
    tags: ['Lord of the Rings', 'Film Location', 'Hobbit Holes', 'Green Dragon Inn'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    mustVisit: true,
    accessNote: 'Day trip from Rotorua (ROT, 45min) or Auckland (AKL, 2hr)',
  },
  {
    id: 'tongariro',
    name: 'Tongariro National Park',
    emoji: '🌋',
    colour: '#8B4A1A',
    airport: 'ROT',
    region: 'NORTH ISLAND',
    brief:
      "New Zealand's oldest national park is a UNESCO dual World Heritage Area for both its outstanding volcanic landscapes and its deep spiritual significance to the Maori people, who gifted the land to New Zealand in 1887. The Tongariro Alpine Crossing is consistently ranked among the world's best one-day walks, a 19-kilometre trail across a volcanic plateau passing three active volcanoes, the vivid Emerald Lakes, Red Crater, and the steam-venting South Crater in a landscape of unearthly beauty. The Crossing requires two cars, a shuttle, or a guided group as it is a point-to-point route and should only be attempted in stable weather conditions with proper clothing and footwear. A second day in the park fits a walk around the base of Mt Ngauruhoe, which served as Mount Doom in Peter Jackson's Lord of the Rings films.",
    tags: ['Tongariro Crossing', 'UNESCO Volcanic', 'Alpine Walking', 'Mt Doom', 'Emerald Lakes'],
    recommendedDays: [2, 2],
    mustVisit: true,
    accessNote: 'Accessible from Rotorua (ROT) by shuttle (2hr) or Taupo',
  },
  {
    id: 'wellington',
    name: 'Wellington',
    emoji: '🎭',
    colour: '#4A2E8A',
    airport: 'WLG',
    region: 'NORTH ISLAND',
    brief:
      "New Zealand's compact and walkable capital punches well above its size in food, arts, and culture, frequently ranked as one of the world's most liveable small cities. Te Papa Tongarewa, the national museum on the waterfront, is the finest museum in New Zealand and one of the best in the Pacific, with definitive collections on Maori taonga and natural history that warrant a full day. The Cuban Quarter's coffee roasters, independent bookshops, and craft beer bars along Courtenay Place define a capital-city weekend scene that feels genuinely local and unhurried. A second day suits a ride on the historic cable car to the Botanic Garden for harbour views, a Weta Workshop film effects tour for Lord of the Rings enthusiasts, and a seal colony walk at the Miramar Peninsula.",
    tags: ['Te Papa Museum', 'Craft Coffee', 'Cable Car', 'Weta Workshop', 'Waterfront'],
    recommendedDays: [2, 3],
  },

  // ═══════════════════════════════════════════
  // SOUTH ISLAND
  // ═══════════════════════════════════════════
  {
    id: 'christchurch',
    name: 'Christchurch',
    emoji: '🌸',
    colour: '#3A8A6A',
    airport: 'CHC',
    region: 'SOUTH ISLAND',
    brief:
      "The South Island's gateway city has transformed dramatically since the 2011 earthquake, with a revitalised creative precinct of repurposed shipping container shops and innovative new architecture rising around the rebuilt Cathedral Square. The Botanic Gardens and Hagley Park provide a green oasis ideal for a morning stroll along the Avon River, and the Canterbury Museum has an excellent Antarctic exploration wing befitting the city's role as gateway to the ice. The arts precinct around Tūranga central library and the newly rebuilt Convention Centre are focal points for a city still reimagining its identity with evident energy. Christchurch is primarily a departure point for the rest of the South Island, but two days lets you appreciate its genuine resurrection.",
    tags: ['Post-Earthquake Revival', 'Botanic Gardens', 'Arts Precinct', 'Canterbury Museum'],
    recommendedDays: [2, 2],
  },
  {
    id: 'kaikoura',
    name: 'Kaikoura',
    emoji: '🐋',
    colour: '#1A6B8A',
    airport: 'CHC',
    region: 'SOUTH ISLAND',
    brief:
      "A small fishing town on a peninsula backed by the snow-capped Seaward Kaikoura Range where the deep Hikurangi Trench brings marine life unusually close to shore, making it one of the most accessible whale-watching destinations on earth. Sperm whales are present year-round and can be reliably spotted on three-hour boat tours departing daily, while dusky dolphins are seen in pods of hundreds that allow swimmers to snorkel alongside them in season. The local crayfish, pulled from pots in the bay and served from roadside stalls with melted butter, is the best value seafood meal in New Zealand. The Kaikoura Peninsula Walkway provides two hours of spectacular coastal scenery above seal colonies and provides a view back to the mountains that is one of the most distinctive in the South Island.",
    tags: ['Whale Watching', 'Dolphin Swimming', 'Crayfish', 'Seal Colonies', 'Mountain Coast'],
    recommendedDays: [1, 2],
    accessNote: 'Accessible from Christchurch (CHC) by bus or car (2.5hr north)',
  },
  {
    id: 'abeltasman',
    name: 'Abel Tasman National Park',
    emoji: '🚣',
    colour: '#2E9A7A',
    airport: 'CHC',
    region: 'SOUTH ISLAND',
    brief:
      "New Zealand's smallest national park protects 60 kilometres of golden-sand coastline and clear turquoise water in the top of the South Island, best explored by sea kayak along the Abel Tasman Coast Track. The track is one of New Zealand's Great Walks and can be done in two to three days hiking between DOC huts and campsites, or four to five days paddling a rented kayak and camping on private beaches only accessible from the water. Fur seals haul out on the rocks at Tonga Island in the centre of the park, and guided kayak tours can approach closely with care. Water taxis shuttle between Marahau and the park's northern end, allowing day visitors to walk a section of the coast in each direction from a drop-off point.",
    tags: ['Sea Kayaking', 'Great Walk', 'Golden Beaches', 'Fur Seals', 'Coast Track'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Christchurch (CHC) via Nelson (4hr by road)',
  },
  {
    id: 'franzjosef',
    name: 'Franz Josef Glacier',
    emoji: '🧊',
    colour: '#5A8AAA',
    airport: 'CHC',
    region: 'SOUTH ISLAND',
    brief:
      "Franz Josef is one of the world's most accessible glaciers, descending from the Southern Alps through temperate rainforest almost to sea level in a way that occurs nowhere else on earth outside the polar regions. Ice climbing on the glacier's blue seracs and crevasses is available via helicopter-accessed guided hikes, as the lower glacier valley is no longer safely walkable due to recent retreat. The rainforest walks around the glacier terminal face, through ancient rimu and kahikatea trees draped in ferns, are rewarding in their own right and provide views up the ice tongue. The nearby Westland Tai Poutini National Park hot pools at Waiho are a restorative finish after a day on ice.",
    tags: ['Glacier Hiking', 'Helicopter Access', 'Temperate Rainforest', 'Scenic Flights'],
    recommendedDays: [2, 2],
    accessNote: 'Accessible from Christchurch (CHC) by bus or car via the West Coast (6hr)',
  },
  {
    id: 'mtcookaoraki',
    name: 'Mt Cook / Aoraki',
    emoji: '🗻',
    colour: '#A8C8E8',
    airport: 'CHC',
    region: 'SOUTH ISLAND',
    brief:
      "Aoraki Mount Cook, New Zealand's highest peak at 3,724 metres, sits within the UNESCO Aoraki/Mount Cook National Park and is flanked by 19 other peaks over 3,000 metres, creating one of the most dramatic alpine panoramas in the southern hemisphere. The Hooker Valley Track is the most rewarding easy walk in New Zealand, a three-hour return trail past swing bridges and glacier lakes to a viewpoint directly facing Mount Cook's south face and the Hooker Glacier terminus, with icebergs floating in the milky glacial lake. The Tasman Glacier nearby is the longest in New Zealand and offers small boat tours among the glacier icebergs calving into the terminal lake. The village of Mount Cook, with no light pollution for 1.5 million hectares in every direction, sits within one of the world's best designated Dark Sky Reserves for stargazing.",
    tags: ['UNESCO Alpine', "Hooker Valley Walk", 'Glacier Lake', 'Dark Sky Stargazing', 'Aoraki Summit Views'],
    recommendedDays: [2, 2],
    mustVisit: true,
    accessNote: 'Accessible from Christchurch (CHC) by bus or car (4.5hr)',
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    emoji: '🪂',
    colour: '#1A3A6B',
    airport: 'ZQN',
    region: 'SOUTH ISLAND',
    brief:
      "The self-proclaimed adventure capital of the world sits on the shores of Lake Wakatipu beneath the jagged Remarkables mountain range and has built an entire town identity around adrenaline, fine food, and spectacular scenery. Queenstown invented commercial bungee jumping at the Kawarau Bridge in 1988 and the original 43-metre jump is still operating, though the 134-metre Nevis Bungy has since claimed top billing among the town's roster of skydiving, jetboating, canyon swinging, and white-water rafting. In winter, three ski fields within an hour of town attract serious skiers and snowboarders from around the world for the Southern Hemisphere season from June to October. The Gibbston Valley wine trail, a 20-minute drive through the gorge, produces some of the world's most southerly pinot noir and pairs a late afternoon of cellar door tastings with the mountain backdrop perfectly.",
    tags: ['Bungee Jumping', 'Ski Fields', 'Jetboating', 'Pinot Noir', 'Adventure Sports'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'wanaka',
    name: 'Wanaka',
    emoji: '🌅',
    colour: '#4A7A9A',
    airport: 'ZQN',
    region: 'SOUTH ISLAND',
    brief:
      "Queenstown's quieter and more relaxed neighbour sits at the northern end of Lake Wanaka with the same access to spectacular mountain scenery but a smaller-town character that attracts visitors who want adventure without the crowds. The lone Wanaka Tree, a willow growing from the lake shallows, is one of the most photographed subjects in New Zealand and best seen at dawn before other visitors arrive. Roy's Peak Track is a strenuous six-hour return climb rewarded with one of the finest panoramic views in the South Island, looking down the length of Lake Wanaka to the Matukituki Valley and Mt Aspiring. Treble Cone ski field above the lake offers advanced terrain and half the lift queues of Queenstown's fields in winter, and summer brings mountain biking, paragliding, and kayaking on the lake.",
    tags: ["Roy's Peak Hike", 'Wanaka Tree', 'Ski Fields', 'Lake Kayaking', 'Mountain Biking'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Queenstown (ZQN) by bus or car (1hr)',
  },
  {
    id: 'milfordsound',
    name: 'Milford Sound',
    emoji: '🏔️',
    colour: '#1A5A3A',
    airport: 'ZQN',
    region: 'SOUTH ISLAND',
    brief:
      "Rudyard Kipling called Milford Sound the eighth wonder of the world, and the sheer 1,200-metre vertical walls of Mitre Peak rising directly from the fiord surface justify the hyperbole on any day when low cloud adds drama to the scene. A two-hour boat cruise is the essential experience, passing Stirling and Bowen Falls that plunge directly into the sea, fur seal colonies on the rocks, and occasional pods of dolphins and penguins that inhabit the fiord year-round. Overnight kayaking expeditions sleep aboard a floating platform inside the fiord and allow a dawn paddle when the tourist boats have not yet arrived and the reflections are perfectly still. The Milford Track, one of New Zealand's Great Walks, is a four-day guided or independent trek through the heart of Fiordland that finishes with a boat crossing of the fiord.",
    tags: ['UNESCO Fiordland', 'Fiord Cruise', 'Milford Track', 'Kayaking', 'Mitre Peak'],
    recommendedDays: [1, 2],
    mustVisit: true,
    accessNote: 'Accessible from Queenstown (ZQN) by bus or car (4hr) or scenic flight',
  },
  {
    id: 'teanau',
    name: 'Te Anau',
    emoji: '🦆',
    colour: '#2A6B4A',
    airport: 'ZQN',
    region: 'SOUTH ISLAND',
    brief:
      "The gateway town to Fiordland National Park sits on the eastern shore of New Zealand's largest South Island lake, a peaceful base for the Milford Track, the Kepler Track, and the boat trips to Doubtful Sound. The Te Anau Glowworm Caves, accessible only by boat across the lake, contain a living population of Arachnocampa luminosa glowworms clinging to the cave ceiling in a display of bioluminescence that is unique to New Zealand. The Kepler Track, one of New Zealand's Great Walks, begins directly from the town and circles the Lake Te Anau arm through beech forest, high alpine ridgelines, and glacial valleys over three to four days. Te Anau is less touristically developed than Queenstown and provides the best value accommodation as a base for Fiordland.",
    tags: ['Fiordland Gateway', 'Glowworm Caves', 'Kepler Track', 'Lake Te Anau', 'Doubtful Sound'],
    recommendedDays: [1, 2],
    accessNote: 'Accessible from Queenstown (ZQN) by bus or car (2hr)',
  },
  {
    id: 'dunedin',
    name: 'Dunedin',
    emoji: '🐧',
    colour: '#5A3A7A',
    airport: 'DUD',
    region: 'SOUTH ISLAND',
    brief:
      "New Zealand's Scottish-heritage city built on a gold rush has the steepest street in the world, a Victorian Gothic railway station that is the most photographed building in the country, and a wildlife peninsula five minutes from the city centre where the world's only mainland royal albatross colony can be observed from a clifftop hide. The Otago Peninsula is Dunedin's essential attraction: boat tours to view yellow-eyed penguins, New Zealand fur seals, and blue penguins returning to their burrows at dusk deliver wildlife encounters that rival anything in the Galapagos. The Speight's Brewery, founded in 1876, runs guided tours and tastings that explain a century of South Island beer culture. Dunedin serves as the base for exploring the Catlins coastal wilderness, the Otago Central Rail Trail, and the Moeraki Boulders beach.",
    tags: ['Royal Albatross Colony', 'Yellow-Eyed Penguins', 'Victorian Architecture', 'Otago Peninsula'],
    recommendedDays: [1, 2],
  },
];

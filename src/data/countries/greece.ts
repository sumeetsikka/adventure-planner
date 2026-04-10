import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Greece
 * 4. Consistently ranked in top Greece destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Athens: Acropolis UNESCO, main gateway, top-ranked (1,2,4,5) ✓
 * - Santorini: iconic caldera, bucket-list sunsets, top-ranked globally (1,3,4,5) ✓
 * - Crete: largest island, diverse experiences, top-ranked (1,3,4,5) ✓
 * - Meteora: UNESCO, bucket-list monasteries atop rock pillars, unique (1,3,4,5) ✓
 * - Mykonos: internationally iconic, gateway to Cyclades (2,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Rhodes: great but beach/history niche (fails 3,5 at scale)
 * - Corfu: popular but not globally iconic (fails 1,3)
 * - Naxos/Paros/Milos: beloved but niche island audience (fails 2,5)
 * - Others: day-trip scope, or niche traveller appeal
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // ATHENS & MAINLAND
  // ═══════════════════════════════════════════
  {
    id: 'athens',
    name: 'Athens',
    emoji: '🏛️',
    colour: '#C0932B',
    airport: 'ATH',
    region: 'ATHENS & MAINLAND',
    brief:
      "One of the world's great cities, where ancient history and modern life collide at every turn. A full day on the Acropolis hill takes in the Parthenon, the Theatre of Dionysus, and the sweeping views across the Attic plain from the summit. Dedicate another to the extraordinary National Archaeological Museum, the lively Monastiraki flea market, and a wander through Plaka's neoclassical lanes for souvlaki and loukoumades. The third day suits a food tour through the Central Market, a sunset cocktail at a rooftop bar overlooking the floodlit Acropolis, and an evening of mezedes and retsina in the Psiri neighbourhood.",
    tags: ['Acropolis', 'Ancient History', 'Street Food', 'Rooftop Bars'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'delphi',
    name: 'Delphi',
    emoji: '🐍',
    colour: '#6D4C1F',
    airport: 'ATH',
    region: 'ATHENS & MAINLAND',
    brief:
      "The ancient sanctuary of Apollo sits on a dramatic mountainside above the Gulf of Corinth, believed by the ancient Greeks to be the centre of the world. The archaeological site is among the most evocative in Greece: the Sacred Way climbs past treasuries to the Temple of Apollo, the ancient stadium is remarkably intact, and the views down the olive-covered valley to the sea are stunning. The site museum houses the magnificent bronze Charioteer, one of the finest surviving works of ancient Greek sculpture. Best as a full-day trip from Athens, pausing in Arachova village for spoon sweets and local wine on the way back.",
    tags: ['Oracle of Delphi', 'Ancient Ruins', 'Mountain Scenery', 'Day Trip'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Athens (2.5 hr by bus)',
  },
  {
    id: 'meteora',
    name: 'Meteora',
    emoji: '⛪',
    colour: '#7F8C8D',
    airport: 'ATH',
    region: 'ATHENS & MAINLAND',
    brief:
      "One of the most surreal landscapes on earth: six working Eastern Orthodox monasteries perched atop sheer sandstone rock pillars rising from the Thessaly plain. The monasteries were built from the 14th century onwards, originally accessible only by rope ladder and nets, and are now a UNESCO World Heritage Site. Sunrise over the rocks from the Psaropetra viewpoint is genuinely breathtaking. Most travellers visit on a long day trip from Athens, though an overnight stay in the village of Kalampaka allows for golden-hour photography and fewer crowds at the monastery gates.",
    tags: ['Monasteries', 'UNESCO', 'Rock Pillars', 'Sunrise Views'],
    recommendedDays: [1, 2],
    mustVisit: true,
    accessNote: 'Via Athens (4 hr by train to Kalampaka)',
  },
  {
    id: 'thessaloniki',
    name: 'Thessaloniki',
    emoji: '🥐',
    colour: '#922B21',
    airport: 'SKG',
    region: 'ATHENS & MAINLAND',
    brief:
      "Greece's second city is widely considered the best food city in the country, with a Byzantine heritage that rivals Athens and a youthful university energy that makes it endlessly lively. The Byzantine walls, the White Tower on the waterfront, and the remarkable mosaics of the Rotunda and Agios Demetrios basilica occupy a full day of sightseeing. The rest of the time belongs to eating: bougatsa (custard pastry) for breakfast, endless mezedes at a traditional ouzeri, and the Modiano Market for local cheeses, olives, and the famed Macedonian spiced sausages.",
    tags: ['Food City', 'Byzantine History', 'Nightlife', 'Markets'],
    recommendedDays: [2, 2],
  },
  {
    id: 'hydra',
    name: 'Hydra',
    emoji: '🫏',
    colour: '#2471A3',
    airport: 'ATH',
    region: 'ATHENS & MAINLAND',
    brief:
      "A car-free island an hour from Athens by hydrofoil, where the only transport is on foot, by donkey, or by water taxi. The absence of vehicles gives Hydra a timeless, romantic atmosphere that has attracted artists and writers for decades. The stone-paved port town is lined with elegant neoclassical mansions, the beaches are reached by short walks or water taxis, and the swimming off the rocks is exceptional. Hydra is the perfect antidote to busier island destinations, best enjoyed as a long day trip from Athens or an indulgent overnight stay.",
    tags: ['Car-Free Island', 'Swimming', 'Donkeys', 'Artists Retreat'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Athens (1 hr by hydrofoil from Piraeus)',
  },

  // ═══════════════════════════════════════════
  // CYCLADES
  // ═══════════════════════════════════════════
  {
    id: 'santorini',
    name: 'Santorini',
    emoji: '🌅',
    colour: '#1A6EA8',
    airport: 'JTR',
    region: 'CYCLADES',
    brief:
      "The most photographed island in Greece needs no introduction: the blue-domed churches of Oia perched above a flooded volcanic caldera are one of the defining images of Mediterranean travel. Watching the sunset from Oia's castle ruins is an experience worth the crowds. Beyond the postcard, there is remarkable substance: a catamaran cruise around the caldera visiting hot springs and the volcanic island of Nea Kameni, the striking black and red sand beaches at Perissa and Akrotiri, and the ancient Minoan city buried under volcanic ash at the Akrotiri archaeological site. The local assyrtiko white wine, grown in basket-shaped vines to resist the volcanic winds, is world-class.",
    tags: ['Caldera Views', 'Sunset', 'Volcanic Beaches', 'Wine'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'mykonos',
    name: 'Mykonos',
    emoji: '💃',
    colour: '#E74C3C',
    airport: 'JMK',
    region: 'CYCLADES',
    brief:
      "Greece's most glamorous island has two distinct personalities: the iconic whitewashed windmills and Little Venice by day, and one of the Mediterranean's most legendary party scenes after dark. Paradise and Super Paradise beaches host internationally renowned DJs through the summer, Nammos and Scorpios are world-famous beach clubs, and the main town's labyrinthine alleys reveal boutique fashion, excellent restaurants, and the famous resident pelicans. Mykonos is also an easy ferry hub for reaching Delos, the sacred island birthplace of Apollo, which is one of Greece's most significant archaeological sites.",
    tags: ['Nightlife', 'Windmills', 'Beach Clubs', 'Delos Day Trip'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'naxos',
    name: 'Naxos',
    emoji: '🧀',
    colour: '#229954',
    airport: 'ATH',
    region: 'CYCLADES',
    brief:
      "The largest and most self-sufficient Cycladic island, with the longest beaches, the highest mountain, and the best local food in the island group. The Portara, an enormous ancient marble doorway standing alone on a small islet at the harbour entrance, is a striking landmark. The old Venetian kastro above the main town has atmospheric medieval lanes, the beaches at Agios Prokopios and Plaka are among the finest in the Cyclades, and the mountain village of Apiranthos rewards those who rent a car and explore inland. Naxos potato chips, graviera cheese, and kitron liqueur are obligatory local discoveries.",
    tags: ['Long Beaches', 'Local Food', 'Venetian Castle', 'Mountain Villages'],
    recommendedDays: [2, 3],
    accessNote: 'Via Athens (ferry from Piraeus, 5 hr)',
  },
  {
    id: 'paros',
    name: 'Paros',
    emoji: '🪁',
    colour: '#2E86C1',
    airport: 'ATH',
    region: 'CYCLADES',
    brief:
      "A perfectly balanced Cycladic island that delivers whitewashed villages, excellent beaches, and a consistently excellent breeze that makes it one of the top windsurfing and kitesurfing destinations in Europe. The main town of Parikia has a beautiful Venetian castle and the early Christian Ekatontapyliani church, while the fishing village of Naoussa in the north is widely considered one of the most attractive small harbours in the Cyclades. Golden Beach is the windsurfing hub, and the sunset from Lefkes, the marble-paved hilltop village, rivals anything in Santorini without the queues.",
    tags: ['Windsurfing', 'Whitewashed Villages', 'Fishing Harbour', 'Marble'],
    recommendedDays: [2, 3],
    accessNote: 'Via Athens (ferry from Piraeus, 4.5 hr)',
  },
  {
    id: 'milos',
    name: 'Milos',
    emoji: '🌈',
    colour: '#E67E22',
    airport: 'ATH',
    region: 'CYCLADES',
    brief:
      "A volcanic island of lunar landscapes, coloured rock formations, and the most diverse collection of beaches in Greece. Sarakiniko, with its white pumice moonscape plunging into bright turquoise water, is one of the most surreal natural settings in the Mediterranean. The sea caves at Kleftiko are only accessible by boat and glow electric blue in the afternoon light. Milos is less visited than Santorini or Mykonos, which makes its extraordinary coastline all the more rewarding, and the village of Plaka above the harbour is an authentic and uncrowded Cycladic gem.",
    tags: ['Sarakiniko Beach', 'Sea Caves', 'Volcanic Landscape', 'Boat Tours'],
    recommendedDays: [2, 3],
    accessNote: 'Via Athens (ferry from Piraeus, 5 hr or short flight)',
  },
  {
    id: 'ios',
    name: 'Ios',
    emoji: '🎉',
    colour: '#8E44AD',
    airport: 'ATH',
    region: 'CYCLADES',
    brief:
      "A small Cycladic island with a big reputation for nightlife and some of the most beautiful beaches in the archipelago. Mylopotas beach is a sweeping arc of fine white sand with crystal-clear water, perfect for a beach day before the evening gets started in the hilltop Chora. The town comes alive at sunset and keeps going well into the small hours, with bars and clubs clustered on the main square and the winding alleys around it. Ios also claims to be the burial place of Homer, and the tomb on the northern tip of the island makes for a surprisingly contemplative morning hike.",
    tags: ['Nightlife', 'Mylopotas Beach', 'Cycladic Village', 'Homer'],
    recommendedDays: [2, 2],
    accessNote: 'Via Athens (ferry from Piraeus, 7 hr)',
  },

  // ═══════════════════════════════════════════
  // DODECANESE & EASTERN ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'rhodes',
    name: 'Rhodes',
    emoji: '🦌',
    colour: '#B7950B',
    airport: 'RHO',
    region: 'DODECANESE & EASTERN ISLANDS',
    brief:
      "A large island of remarkable contrasts: the UNESCO medieval walled city of Rhodes Town is one of the best preserved in the world, the east coast has calm turquoise beaches, and the inland villages are genuinely off the tourist trail. The Street of the Knights inside the old city is an intact medieval thoroughfare, the Palace of the Grand Masters is a formidable fortress, and the village of Lindos, built around an ancient acropolis above a perfect circular bay, is one of Greece's most photogenic settings. Rhodes has excellent connections and is a natural hub for day-tripping to the smaller Dodecanese islands.",
    tags: ['Medieval Old City', 'UNESCO', 'Lindos', 'Beaches'],
    recommendedDays: [2, 3],
  },

  // ═══════════════════════════════════════════
  // IONIAN ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'corfu',
    name: 'Corfu',
    emoji: '🫒',
    colour: '#1D8348',
    airport: 'CFU',
    region: 'IONIAN ISLANDS',
    brief:
      "The most cosmopolitan of the Ionian Islands, with a UNESCO-listed old town that bears the mark of Venetian, French, and British rule in its architecture, cuisine, and culture. The narrow Venetian lanes of Corfu Town are unlike anything else in Greece, and the 19th-century cricket pitch on the Esplanade is one of the more delightfully surreal colonial legacies in Europe. The northern coast beaches at Paleokastritsa are among the most dramatic in the Ionians, the village of Kassiopi is charming and relatively quiet, and the Achilleion Palace built by Empress Elisabeth of Austria offers extraordinary gardens and sea views.",
    tags: ['Venetian Old Town', 'UNESCO', 'Beaches', 'Olive Groves'],
    recommendedDays: [2, 3],
  },
  {
    id: 'zakynthos',
    name: 'Zakynthos',
    emoji: '🐢',
    colour: '#17A589',
    airport: 'ZTH',
    region: 'IONIAN ISLANDS',
    brief:
      "An island of extraordinary natural beauty most famous for the iconic Navagio Shipwreck Beach, a rusting ship marooned on a white pebble cove accessible only by boat and viewed from an impossibly dramatic clifftop lookout. The Blue Caves on the northern coast shimmer with electric blue light when the morning sun hits the water, and the loggerhead sea turtles that nest on Laganas Bay from June to August are among the most accessible in the Mediterranean. The main town has a pleasant Venetian-influenced seafront, and the interior roads through olive groves to mountain villages are rewarding to explore by scooter.",
    tags: ['Shipwreck Beach', 'Sea Turtles', 'Blue Caves', 'Clifftop Views'],
    recommendedDays: [2, 3],
  },
  {
    id: 'lefkada',
    name: 'Lefkada',
    emoji: '🪂',
    colour: '#5DADE2',
    airport: 'CFU',
    region: 'IONIAN ISLANDS',
    brief:
      "The only Greek island connected to the mainland by a causeway, making it uniquely accessible without a ferry. Porto Katsiki and Egremni beaches on the west coast are consistently rated among the best beaches in Europe: sheer white cliffs drop to vivid turquoise water and fine pale pebbles. The island is also a world-renowned windsurfing destination, with Vassiliki bay at the southern tip producing the reliable afternoon thermal winds that draw professionals from around the globe. The main town has a charming earthquake-resistant Ionian architecture of painted corrugated iron facades.",
    tags: ['Porto Katsiki Beach', 'Windsurfing', 'Clifftop Beaches', 'Accessible by Road'],
    recommendedDays: [2, 3],
    accessNote: 'Via Corfu or drive from Athens (5 hr)',
  },

  // ═══════════════════════════════════════════
  // CRETE
  // ═══════════════════════════════════════════
  {
    id: 'crete',
    name: 'Crete',
    emoji: '🏺',
    colour: '#6E2C00',
    airport: 'HER',
    region: 'CRETE',
    brief:
      "Greece's largest island is practically a country unto itself, with enough variety to fill two weeks. The Minoan Palace of Knossos outside Heraklion is one of the most important archaeological sites in Europe, predating classical Greece by over a thousand years. The Samaria Gorge hike through a 16-kilometre canyon to the Libyan Sea is one of the great walks of Europe. The old Venetian harbours of Chania and Rethymno are the most beautiful in Crete, the beach at Elafonisi is famous for its pink sand, and the local cuisine of lamb with stamnagathi greens, fresh mizithra cheese, and aged tsikoudia raki is extraordinary.",
    tags: ['Knossos', 'Samaria Gorge', 'Venetian Harbour', 'Minoan History'],
    recommendedDays: [4, 6],
    mustVisit: true,
  },
];

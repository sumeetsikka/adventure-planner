import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Croatia
 * 4. Consistently ranked in top Croatia destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Dubrovnik: UNESCO old city, globally iconic, top-ranked (1,3,4,5) ✓
 * - Split: Diocletian's Palace UNESCO, main gateway to islands, top-ranked (1,2,4,5) ✓
 * - Hvar: Stari Grad UNESCO, bucket-list glamour island, top-ranked (1,3,4,5) ✓
 * - Plitvice Lakes: UNESCO cascading lakes, unique natural wonder, top-ranked (1,3,4,5) ✓
 * - Krka National Park: bucket-list swimming waterfalls, unique, broadly appealing (3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Zagreb: excellent but lacks unique bucket-list draw vs European capitals (fails 3,5 at scale)
 * - Rovinj, Pula: Istrian gems but niche regional appeal (fails 3,5)
 * - Korcula, Mljet, Brac, Vis: beloved islands but niche audience (fails 2,5)
 * - Zadar, Sibenik: great but not globally top-ranked (fails 1,3,5 at scale)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // DALMATIAN COAST
  // ═══════════════════════════════════════════
  {
    id: 'dubrovnik',
    name: 'Dubrovnik',
    emoji: '🏰',
    colour: '#C0392B',
    airport: 'DBV',
    region: 'DALMATIAN COAST',
    brief:
      "Dubrovnik's UNESCO-listed old city is one of the best-preserved medieval walled towns in the world, its honey-coloured limestone streets and baroque churches spilling down to the shimmering Adriatic. Walking the full 2-kilometre circuit of the city walls is the single best thing to do in Croatia, offering rooftop views over terracotta tiles and the open sea. Game of Thrones fans will recognise countless locations from King's Landing throughout the old town, and guided tours bring the filming sites to vivid life. A cable car ascent to Mount Srd rewards with panoramic views over the city and the Elaphiti Islands, while a short boat trip to Lokrum Island offers forested walking trails, a saltwater lake, and free-roaming peacocks.",
    tags: ['City Walls', 'UNESCO', 'Game of Thrones', 'Cable Car'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'split',
    name: 'Split',
    emoji: '🏛️',
    colour: '#E8A838',
    airport: 'SPU',
    region: 'DALMATIAN COAST',
    brief:
      "Split is Croatia's second city and the busiest gateway to the Dalmatian islands, built literally inside the walls of Diocletian's Palace, a UNESCO-listed Roman imperial residence completed in 305 AD. Wandering the palace's warren of narrow streets, vaulted cellars, and open peristyle square is one of the most atmospheric experiences in the Mediterranean, with bars, restaurants, and market stalls operating where Roman emperors once walked. Marjan Hill, a forested peninsula just west of the old town, offers shaded walking trails, clifftop swimming spots, and sweeping views over the islands. The Riva waterfront promenade is the social heart of the city, lined with cafe terraces for watching the daily pageant of ferries, locals, and travellers.",
    tags: ['Diocletian\'s Palace', 'UNESCO', 'Island Gateway', 'Waterfront'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'zadar',
    name: 'Zadar',
    emoji: '🌊',
    colour: '#2980B9',
    airport: 'ZAD',
    region: 'DALMATIAN COAST',
    brief:
      "Zadar is a compact and underrated Dalmatian city with a peninsula old town packed with Roman ruins, Byzantine churches, and a genuinely local cafe culture largely undisturbed by mass tourism. The Sea Organ, a stepped marble shoreline with underwater pipes that produce haunting harmonic music as waves push through them, is one of the most original public artworks in Europe. Beside it, the Sun Salutation installation absorbs solar energy by day and projects a spectacular light display onto the quayside after dark. Alfred Hitchcock famously declared Zadar's sunset over the sea the most beautiful in the world, a claim that draws devotees to the Zadar waterfront every evening.",
    tags: ['Sea Organ', 'Roman Ruins', 'Sunset', 'Underrated Gem'],
    recommendedDays: [2, 2],
  },
  {
    id: 'sibenik',
    name: 'Sibenik',
    emoji: '⛪',
    colour: '#7D6608',
    airport: 'SPU',
    region: 'DALMATIAN COAST',
    brief:
      "Sibenik is an authentic Dalmatian city with two UNESCO-listed cathedrals and a characterful old town of stepped medieval streets that sees far fewer visitors than Dubrovnik or Split. The Cathedral of St James, built entirely from local stone without any brick or mortar, is a masterpiece of Renaissance architecture completed in 1536 and deserves an hour of careful attention. The fortress of St Michael above the town offers sweeping views over the Sibenik Channel and the islands beyond. Sibenik is the ideal base for day trips to Krka National Park, just 30 minutes away by car or local bus, making it a practical and rewarding overnight stop on the Dalmatian coast drive.",
    tags: ['UNESCO Cathedral', 'Medieval Town', 'Krka Base', 'Dalmatian Culture'],
    recommendedDays: [1, 2],
    accessNote: 'Via Split (SPU), approximately 1 hour by car or bus',
  },
  {
    id: 'korcula',
    name: 'Korcula',
    emoji: '🍷',
    colour: '#6E2C00',
    airport: 'DBV',
    region: 'DALMATIAN COAST',
    brief:
      "Korcula Town is a miniature walled city on the tip of a wooded island, so compact and perfectly formed that it is often called Little Dubrovnik, though it retains a quieter and more authentically Croatian character. The fortified old town sits on a small oval peninsula, its herringbone street layout designed to channel the prevailing winds while blocking the sun, and the views from the towers over the Peljesac Channel are superb. The island is traditionally credited as the birthplace of Marco Polo, and a tower house museum in the old town marks the claim. The Peljesac Peninsula across the water produces some of Croatia's finest red wines, particularly the rich Dingac and Postup varietals of the Plavac Mali grape.",
    tags: ['Walled Old Town', 'Marco Polo', 'Wine Country', 'Island Life'],
    recommendedDays: [2, 3],
    accessNote: 'Via Dubrovnik (DBV) by ferry or catamaran, approximately 3 hours',
  },
  {
    id: 'mljet',
    name: 'Mljet',
    emoji: '🌿',
    colour: '#1D8348',
    airport: 'DBV',
    region: 'DALMATIAN COAST',
    brief:
      "Mljet is one of the most forested and tranquil islands in Croatia, with the western third protected as a national park centred on two saltwater lakes connected to the sea by a channel. Cycling or walking the 9-kilometre loop around the lakes is the defining activity, and swimming in the warm, clear water of the larger Veliko Jezero is genuinely special. A small island in the middle of the lake holds a 12th-century Benedictine monastery, reachable by a small boat that makes the crossing regularly. Mljet has very limited nightlife and entertainment, making it ideal for travellers seeking nature, cycling, and quiet rather than the party atmosphere of Hvar.",
    tags: ['National Park', 'Saltwater Lakes', 'Monastery Island', 'Cycling'],
    recommendedDays: [2, 2],
    accessNote: 'Via Dubrovnik (DBV) by catamaran or ferry, approximately 1.5 to 2 hours',
  },

  // ═══════════════════════════════════════════
  // ISTRIA & KVARNER
  // ═══════════════════════════════════════════
  {
    id: 'rovinj',
    name: 'Rovinj',
    emoji: '🎨',
    colour: '#E74C3C',
    airport: 'PUY',
    region: 'ISTRIA & KVARNER',
    brief:
      "Rovinj is widely considered the most beautiful town in Istria, an old Venetian fishing port whose pastel-coloured houses stack up a wooded peninsula crowned by the baroque Church of St Euphemia, whose bell tower is modelled on Venice's St Mark's. The town has evolved into a sophisticated destination for art lovers, food travellers, and anyone seeking a slower pace than the Dalmatian coast bustle further south. Istria's culinary reputation is built on fresh seafood, hand-rolled pasta with truffle shavings, and local malvazija white wine, all of which are done exceptionally well in Rovinj's restaurants. The surrounding oak and pine forests around the Lim Canal fjord are rich truffle territory, and autumn truffle hunts with dogs are a memorable local experience.",
    tags: ['Venetian Charm', 'Seafood', 'Truffles', 'Art Galleries'],
    recommendedDays: [2, 3],
    accessNote: 'Via Pula (PUY), approximately 40 minutes by car',
  },
  {
    id: 'pula',
    name: 'Pula',
    emoji: '🏟️',
    colour: '#F39C12',
    airport: 'PUY',
    region: 'ISTRIA & KVARNER',
    brief:
      "Pula is Istria's largest city and home to one of the best-preserved Roman amphitheatres in the world, a first-century colosseum that seated 20,000 spectators and now hosts open-air concerts and film festival screenings each summer. The compact old town is scattered with impressive Roman monuments including the Temple of Augustus, the Triumphal Arch of the Sergii, and sections of the original city walls. The Brijuni Islands national park, just a short boat trip from the mainland near Pula, offers safari park wildlife, Roman and Byzantine ruins, and a nature reserve that was Tito's personal summer residence during the Yugoslav era.",
    tags: ['Roman Amphitheatre', 'Ancient History', 'Brijuni Islands', 'Concerts'],
    recommendedDays: [1, 2],
  },

  // ═══════════════════════════════════════════
  // ZAGREB & INLAND
  // ═══════════════════════════════════════════
  {
    id: 'zagreb',
    name: 'Zagreb',
    emoji: '☕',
    colour: '#8E44AD',
    airport: 'ZAG',
    region: 'ZAGREB & INLAND',
    brief:
      "Zagreb is a Central European capital that rewards visitors willing to look beyond the coast, with a charming medieval Upper Town, a lively 19th-century Lower Town, and a cafe culture of almost Viennese intensity. The Upper Town's cobbled streets, St Mark's Church with its colourful tiled roof, the funicular connecting the two levels, and the atmospheric Museum of Broken Relationships are among the highlights. Dolac Market, just below the Upper Town, is the city's daily covered and open-air produce market and the best place to taste local cheeses, cured meats, and seasonal fruit. Zagreb's street art scene, particularly in the Marticesva Street area, and its growing collection of independent boutiques and cocktail bars make it an increasingly compelling urban destination.",
    tags: ['Upper Town', 'Dolac Market', 'Cafe Culture', 'Street Art'],
    recommendedDays: [2, 3],
  },
  {
    id: 'plitvice-lakes',
    name: 'Plitvice Lakes',
    emoji: '💧',
    colour: '#1ABC9C',
    airport: 'ZAG',
    region: 'ZAGREB & INLAND',
    brief:
      "Plitvice Lakes National Park is Croatia's most visited natural attraction and a UNESCO World Heritage Site of extraordinary beauty: sixteen terraced lakes connected by a series of cascading waterfalls, all coloured in shifting shades of turquoise and emerald by minerals dissolved in the water. The boardwalk trail system allows visitors to walk directly over the lakes and beside the falls, with the 78-metre Veliki Slap waterfall being Croatia's tallest. The park rewards early arrival to avoid the summer crowds, and the Lower Lakes circuit combining boat crossing and lakeside boardwalks is the most spectacular route. Autumn colours reflected in the impossibly blue water are among the most photographed scenes in all of Europe.",
    tags: ['UNESCO', 'Waterfalls', 'Turquoise Lakes', 'Boardwalk Trails'],
    recommendedDays: [1, 2],
    mustVisit: true,
    accessNote: 'Via Zagreb (ZAG), approximately 2 hours by car or bus',
  },

  // ═══════════════════════════════════════════
  // ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'hvar',
    name: 'Hvar',
    emoji: '💜',
    colour: '#7D3C98',
    airport: 'SPU',
    region: 'ISLANDS',
    brief:
      "Hvar is Croatia's most glamorous island and one of the Mediterranean's premier summer destinations, balancing a UNESCO-listed old town, lavender-covered hillsides, and a nightlife scene that attracts an international jet-set crowd. The main town's Renaissance piazza, fortress, and cathedral are among the finest in Dalmatia, and the Pakleni Islands just offshore offer crystal-clear swimming coves reachable by water taxi. The island's interior is carpeted with lavender fields harvested in late June, producing local oils and soaps sold throughout the island's markets. Stari Grad Plain on the northern part of the island is a UNESCO World Heritage Site, an ancient Greek agricultural landscape in continuous cultivation for 2,400 years.",
    tags: ['Lavender Fields', 'UNESCO', 'Nightlife', 'Crystal Water'],
    recommendedDays: [3, 4],
    mustVisit: true,
    accessNote: 'Via Split (SPU) by catamaran to Hvar Town or car ferry to Stari Grad, approximately 1 hour',
  },
  {
    id: 'brac',
    name: 'Brac',
    emoji: '🏄',
    colour: '#2471A3',
    airport: 'SPU',
    region: 'ISLANDS',
    brief:
      "Brac is the largest island in Dalmatia and home to Zlatni Rat, Croatia's most famous beach: a distinctive white pebble spit that extends into the turquoise sea and shifts its shape with the currents, forming a different outline each day. The beach's consistent bora and maestral winds make it one of the premier windsurfing and kitesurfing destinations in the Adriatic, with a reliable summer season that draws professionals from across Europe. The island's white limestone has been quarried since antiquity and used in buildings ranging from Diocletian's Palace in Split to the White House in Washington. The village of Bol below the island's central mountain provides a pleasant base with good restaurants and a laid-back Dalmatian pace.",
    tags: ['Zlatni Rat Beach', 'Windsurfing', 'White Limestone', 'Dalmatian Village'],
    recommendedDays: [2, 3],
    accessNote: 'Via Split (SPU) by car ferry to Supetar, approximately 50 minutes',
  },
  {
    id: 'vis',
    name: 'Vis',
    emoji: '🎬',
    colour: '#17A589',
    airport: 'SPU',
    region: 'ISLANDS',
    brief:
      "Vis is the most remote inhabited island in the Croatian Adriatic, closed to foreign visitors during the Yugoslav era as a military base and consequently preserved with an authenticity that more accessible islands have largely lost. The island's wine, particularly Vugava white and Plavac Mali red, is among the finest in Croatia and largely consumed on the island itself. The Blue Cave on nearby Bisevo Island produces one of the most spectacular natural light effects in the Mediterranean, with morning sunlight refracted through an underwater opening to illuminate the cave interior in electric blue. Vis Town and Komiza are the settings for key scenes in the Mamma Mia: Here We Go Again film, and the island's British wartime connections are explored at the town museum.",
    tags: ['Blue Cave', 'Mamma Mia Filming', 'Island Wine', 'Unspoilt'],
    recommendedDays: [2, 3],
    accessNote: 'Via Split (SPU) by catamaran or ferry, approximately 2 to 2.5 hours',
  },
  {
    id: 'krka-national-park',
    name: 'Krka National Park',
    emoji: '🌊',
    colour: '#27AE60',
    airport: 'SPU',
    region: 'DALMATIAN COAST',
    brief:
      "Krka National Park is one of Croatia's greatest natural spectacles: the Krka River drops over a series of seven travertine waterfalls and cascades through a limestone canyon, and the park's signature activity is swimming in the pools directly beneath the thundering falls at Skradinski Buk. The falls are among the most dramatic freshwater swimming locations in all of Europe, and the emerald-green pools fringed by wooden boardwalks justify the UNESCO consideration the park regularly receives. The medieval Franciscan monastery on the island of Visovac, reachable by boat tour from within the park, adds cultural interest to what is otherwise a day defined by extraordinary natural beauty. The park is best visited in the morning to beat the midday crowds that arrive from Split and Sibenik on summer day trips.",
    tags: ['Swimming Waterfalls', 'Canyon', 'Boat Tour', 'Franciscan Monastery'],
    recommendedDays: [1, 1],
    mustVisit: true,
    isDayTrip: true,
    accessNote: 'Day trip from Split (SPU, 1.5 hr by car) or Sibenik (30 min by car or bus)',
  },
];

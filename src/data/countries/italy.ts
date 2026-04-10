import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Italy
 * 4. Consistently ranked in top Italy destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Rome: UNESCO, gateway, Colosseum/Vatican bucket-list (1,2,3,4,5) ✓
 * - Florence: UNESCO, Renaissance art/architecture bucket-list (1,3,4,5) ✓
 * - Venice: UNESCO, unique canal city unavailable anywhere else (1,3,4,5) ✓
 * - Amalfi Coast: iconic coastal scenery, consistently top-ranked (1,3,4,5) ✓
 * - Cinque Terre: UNESCO, iconic coastal villages, broad appeal (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Milan: fashion/design niche, less universally compelling (fails 3,5)
 * - Sicily: excellent but requires extra flight, less universal (fails 2)
 * - Others: regional interest, day-trip, or niche appeal
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // NORTHERN ITALY
  // ═══════════════════════════════════════════
  {
    id: 'venice',
    name: 'Venice',
    emoji: '🚤',
    colour: '#2E86AB',
    airport: 'VCE',
    region: 'NORTHERN ITALY',
    brief:
      'Venice is the most extraordinary city ever built and demands at least two full days to do it justice. Spend the first day getting lost in the labyrinthine sestieri away from St Mark\'s Square, riding a vaporetto down the Grand Canal, and watching sunset from the Rialto Bridge. Dedicate the second day to the Doge\'s Palace, the Basilica di San Marco\'s golden mosaics, and an evening cicchetti and Aperol spritz crawl through local bacari. A third day allows a day trip to the glass-blowing island of Murano and the colourful fishing village of Burano.',
    tags: ['Canals', 'Gondolas', 'Architecture', 'Cicchetti'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'milan',
    name: 'Milan',
    emoji: '👗',
    colour: '#C8102E',
    airport: 'MXP',
    region: 'NORTHERN ITALY',
    brief:
      'Italy\'s most modern and fashion-forward city is often underestimated as a destination in its own right. Two days gives you time to queue for (or pre-book) Leonardo da Vinci\'s Last Supper, explore the magnificent Gothic Duomo and its rooftop terraces, and stroll the glass-vaulted Galleria Vittorio Emanuele II. The Navigli canal district delivers the evening aperitivo scene Milan is famous for: generous free snacks with every drink. Milan also serves as the gateway hub for Lake Como and the Italian Dolomites.',
    tags: ['Fashion', 'Last Supper', 'Duomo', 'Aperitivo'],
    recommendedDays: [2, 2],
  },
  {
    id: 'cinque-terre',
    name: 'Cinque Terre',
    emoji: '🌈',
    colour: '#F4A261',
    airport: 'GOA',
    region: 'NORTHERN ITALY',
    brief:
      'Five vibrantly coloured fishing villages clinging to dramatic cliffside terraces above the Ligurian Sea. Two days are the minimum to visit all five villages by train, swim in the turquoise coves below Vernazza, and hike at least one section of the coastal trail between villages. A third day allows the full Sentiero Azzurro hike from Riomaggiore to Monterosso, the most spectacular coastal walk in Italy, rewarded with cold white wine and fresh pesto pasta at trail\'s end. Book accommodation and Cinque Terre card well in advance as the villages fill quickly.',
    tags: ['Coastal Villages', 'Hiking', 'Clifftop Views', 'Swimming'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Via Genoa (GOA) or La Spezia',
  },
  {
    id: 'lake-como',
    name: 'Lake Como',
    emoji: '⛵',
    colour: '#4C9BE8',
    airport: 'MXP',
    region: 'NORTHERN ITALY',
    brief:
      'The most glamorous lake in Italy, ringed by snow-capped Alps and opulent 18th-century villas with terraced gardens tumbling down to the water. Two days lets you take the ferry between Bellagio, Varenna, and Como town, tour the ornate gardens of Villa Carlotta and Villa del Balbianello (filming location for Star Wars and James Bond), and kayak along the quieter northern reaches of the lake. Evening dining in Bellagio with lake views and a Campari spritz is as good as Italy gets without a Michelin star.',
    tags: ['Villas', 'Ferry Rides', 'Alpine Views', 'Bellagio'],
    recommendedDays: [2, 2],
    accessNote: 'Via Milan (MXP), 1hr by train',
  },
  {
    id: 'verona',
    name: 'Verona',
    emoji: '🎭',
    colour: '#8B2252',
    airport: 'VCE',
    region: 'NORTHERN ITALY',
    brief:
      'A beautifully preserved Roman city famous for its arena, its wine, and its Shakespearean connections. One day is enough to visit Juliet\'s courtyard and balcony, walk the Roman Arena (which still hosts summer opera performances), explore the medieval Castelvecchio fortress along the Adige River, and eat the local dish of horse-meat ragu with bigoli pasta in a traditional osteria. Verona is a natural stopover between Venice and Milan, and the surrounding Valpolicella and Soave wine regions reward a second day for wine lovers.',
    tags: ['Roman Arena', 'Opera', 'Romeo & Juliet', 'Wine Region'],
    recommendedDays: [1, 1],
    accessNote: 'Via Venice (VCE), 1.5hr by train',
  },
  {
    id: 'bologna',
    name: 'Bologna',
    emoji: '🍝',
    colour: '#B5451B',
    airport: 'BLQ',
    region: 'NORTHERN ITALY',
    brief:
      'Italy\'s culinary capital and one of the country\'s most underrated cities, home to the world\'s oldest university and the original Bolognese ragu. One day covers the medieval porticoed streets, the twin towers of Garisenda and Asinelli (climb the taller for panoramic views), and the extraordinary Basilica di San Petronio. A second day is entirely justified for a food market tour through the Quadrilatero, a pasta-making class with a local nonna, and afternoon cycling to the suburban Santuario di San Luca via 3.8km of porticoed arches. Bologna is also the ideal base for day trips to Modena (Ferrari museum, Pavarotti birthplace, balsamic vinegar) and Parma.',
    tags: ['Food Capital', 'Pasta', 'Porticoes', 'University City'],
    recommendedDays: [1, 2],
  },

  // ═══════════════════════════════════════════
  // CENTRAL ITALY
  // ═══════════════════════════════════════════
  {
    id: 'florence',
    name: 'Florence',
    emoji: '🎨',
    colour: '#C17817',
    airport: 'FLR',
    region: 'CENTRAL ITALY',
    brief:
      'The birthplace of the Renaissance contains more masterpieces per square kilometre than anywhere on earth. Two days are the minimum: Michelangelo\'s David at the Accademia, Botticelli\'s Birth of Venus and Primavera at the Uffizi, Brunelleschi\'s Duomo dome (pre-book the climb), and Ponte Vecchio at sunset. A third day allows the Pitti Palace and Boboli Gardens, a drive into the Chianti wine hills for olive oil tastings, and a traditional bistecca Fiorentina dinner at a trattoria in the Oltrarno neighbourhood. Book all major museums weeks ahead.',
    tags: ['Renaissance Art', 'Uffizi', 'Duomo', 'Chianti'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'tuscany-siena',
    name: 'Tuscany & Siena',
    emoji: '🌻',
    colour: '#D4A017',
    airport: 'FLR',
    region: 'CENTRAL ITALY',
    brief:
      'The rolling cypress-lined hills, medieval hilltop towns, and world-class wine of Tuscany reward two to three days of slow exploration based out of Siena or Montalcino. Siena\'s fan-shaped Piazza del Campo and striped Gothic Duomo are among Italy\'s most beautiful spaces. Dedicate a second day to driving the Val d\'Orcia, a UNESCO landscape of golden wheat fields, lone cypress trees, and Renaissance villages like Pienza and Monticchiello. A third day suits a Brunello di Montalcino winery visit, truffle hunting in San Miniato, or the thermal spa pools at Bagno Vignoni.',
    tags: ['Rolling Hills', 'Medieval Towns', 'Wine', 'Scenic Drives'],
    recommendedDays: [2, 3],
    accessNote: 'Via Florence (FLR), 1.5hr by train or car',
  },
  {
    id: 'rome',
    name: 'Rome',
    emoji: '🏛️',
    colour: '#9B2335',
    airport: 'FCO',
    region: 'CENTRAL ITALY',
    brief:
      'The Eternal City layers 3,000 years of history into a living metropolis and is the single most unmissable destination in Italy. Day one: the Colosseum, Roman Forum, and Palatine Hill. Day two: Vatican City, St Peter\'s Basilica, the Sistine Chapel, and the Castel Sant\'Angelo. Day three: the Pantheon, Piazza Navona, Campo de\' Fiori market, and tossing a coin at the Trevi Fountain. A fourth day unlocks the Borghese Gallery (Bernini\'s sculptures are as good as the Sistine Chapel), the Aventine Keyhole view of St Peter\'s, and a local food tour through Testaccio market.',
    tags: ['Colosseum', 'Vatican', 'Ancient History', 'Piazzas'],
    recommendedDays: [4, 6],
    mustVisit: true,
  },

  // ═══════════════════════════════════════════
  // SOUTHERN ITALY & ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'naples',
    name: 'Naples',
    emoji: '🍕',
    colour: '#FF6D00',
    airport: 'NAP',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'Chaotic, passionate, and unforgettable: Naples is the raw soul of southern Italy and the birthplace of pizza. Two days is the right amount to experience the gritty energy of the Spaccanapoli quarter, eat a Margherita at L\'Antica Pizzeria da Michele (the world\'s most famous pizza shop), explore the extraordinary underground Napoli Sotterranea tunnels, and visit the National Archaeological Museum housing the best collection of Roman artefacts outside Rome. Naples is also the gateway hub for Pompeii, Herculaneum, the Amalfi Coast, and Capri, making it a natural base for the south.',
    tags: ['Pizza', 'Archaeology', 'Underground City', 'Gateway Hub'],
    recommendedDays: [2, 2],
  },
  {
    id: 'amalfi-coast',
    name: 'Amalfi Coast',
    emoji: '🌊',
    colour: '#00838F',
    airport: 'NAP',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'The most dramatic coastline in Europe: lemon-yellow villages spilling down vertical cliffsides into turquoise water. Two days covers the key towns by ferry and bus: Positano for its pastel hillside lanes and beach clubs, Amalfi town for the Arab-Norman cathedral, and Ravello for the clifftop Villa Rufolo gardens with Mediterranean views. A third day adds the Path of the Gods hike above the coast, a boat trip to the Emerald Grotto sea cave, or a cooking class centred on fresh mozzarella and house-made limoncello. May to early July and September are optimal to avoid summer peak crowds.',
    tags: ['Clifftop Villages', 'Ferry Rides', 'Beaches', 'Limoncello'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'pompeii',
    name: 'Pompeii',
    emoji: '🌋',
    colour: '#6D4C41',
    airport: 'NAP',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'The most complete Roman city in existence, frozen in time by the 79 AD eruption of Vesuvius. A full day with a good guide or audio tour allows you to walk the original stone-paved streets, see the plaster casts of victims caught in the ash, visit the Forum, the Lupanar brothel with its frescoes, the House of the Faun, and the bakeries and fast-food thermopolia. Combine with a morning hike up Mt Vesuvius crater for the full volcanic experience. Herculaneum, a smaller but even better-preserved sister site a short train ride away, is worth adding for archaeology enthusiasts.',
    tags: ['Roman Ruins', 'Vesuvius', 'Ancient History', 'UNESCO'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Naples (40min by Circumvesuviana train)',
  },
  {
    id: 'capri',
    name: 'Capri',
    emoji: '🔵',
    colour: '#0D47A1',
    airport: 'NAP',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'A glamorous island of limestone sea stacks, celebrity-magnet piazzas, and the mesmerising Blue Grotto sea cave. One full day covers the hydrofoil from Naples, a boat tour around the island including the Blue Grotto (visit early morning for best light), the chairlift up to Anacapri for panoramic views, and a Campari in the Piazzetta before the last ferry back. Staying overnight allows you to experience the island after the day-trippers leave, with a dramatic change in atmosphere: emptier streets, cooler temperatures, and dinner at a garden restaurant under a pergola of lemon trees.',
    tags: ['Blue Grotto', 'Boat Tours', 'Glamour', 'Clifftop Views'],
    recommendedDays: [1, 2],
    accessNote: 'Via Naples (NAP), 40min by hydrofoil',
  },
  {
    id: 'positano',
    name: 'Positano',
    emoji: '🏘️',
    colour: '#E53935',
    airport: 'NAP',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'The most photographed village on the Amalfi Coast: a near-vertical cascade of pastel-coloured houses above a pebbly beach. Two days allows you to properly soak in the village beyond the day-trip rush: swim at Fornillo Beach (quieter than the main beach), walk the 300 steps up to the Church of Santa Maria Assunta, and hire a small boat to explore the hidden sea grottos and Laurito cove. Evenings in Positano when the tour groups have departed reveal an entirely different and far more romantic village, ideal for aperitivo on a cliffside terrace above the Tyrrhenian Sea.',
    tags: ['Clifftop Village', 'Beach', 'Photography', 'Sea Grottos'],
    recommendedDays: [2, 2],
    accessNote: 'Via Naples (NAP), 1.5hr by ferry or bus',
  },
  {
    id: 'puglia-lecce',
    name: 'Puglia & Lecce',
    emoji: '🫒',
    colour: '#558B2F',
    airport: 'BDS',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'The heel of Italy\'s boot is one of the country\'s most rewarding and least-touristed regions. Lecce is the \'Florence of the South\': its entire historic centre is carved from golden local limestone into an extraordinary Baroque cityscape. Day one in Lecce: the Piazza del Duomo, the Roman amphitheatre, and a pasticiotto pastry at a 100-year-old pasticceria. Day two: drive north to the whitewashed trulli houses of Alberobello (UNESCO), the cave dwellings of Locorotondo, and olive oil tastings in the ancient groves. A third day adds the Adriatic sea stacks and turquoise coves around Polignano a Mare.',
    tags: ['Baroque Architecture', 'Trulli Houses', 'Olive Oil', 'Adriatic'],
    recommendedDays: [2, 3],
  },
  {
    id: 'matera',
    name: 'Matera',
    emoji: '🪨',
    colour: '#795548',
    airport: 'BRI',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'One of the oldest continuously inhabited settlements on earth, Matera\'s sassi (cave dwellings cut into the ravine walls) were named a European Capital of Culture in 2019. One day covers the main sassi districts of Barisano and Caveoso, the rock-carved churches with Byzantine frescoes, and the dramatic ravine viewpoint at Belvedere. A second day allows a guided cave-dwelling tour to understand how families lived in these prehistoric homes until the 1950s, a visit to MUSMA contemporary sculpture museum inside a cave, and sunset cocktails with the entire sassi cityscape illuminated behind you.',
    tags: ['Cave City', 'Ancient History', 'UNESCO', 'Unique Architecture'],
    recommendedDays: [1, 2],
    accessNote: 'Via Bari (BRI), 1.5hr by bus',
  },
  {
    id: 'sicily',
    name: 'Sicily',
    emoji: '🍋',
    colour: '#F9A825',
    airport: 'CTA',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'The largest island in the Mediterranean is a world unto itself: Greek temples older than Rome, Arab-Norman architecture unlike anywhere else in Europe, active volcanoes, and food culture that is distinctly Sicilian rather than Italian. Three days based in Catania covers Mt Etna (hiking the summit crater), the Valley of the Temples at Agrigento, and the baroque hilltop town of Taormina with its Greek theatre overlooking the sea. A fourth day adds the Aeolian Islands by ferry, Palermo\'s street food chaos at the Ballarò market, or a boat trip to the cave-riddled coastline around Syracuse.',
    tags: ['Mt Etna', 'Greek Temples', 'Street Food', 'Arab-Norman Culture'],
    recommendedDays: [3, 4],
  },
  {
    id: 'sardinia',
    name: 'Sardinia',
    emoji: '🏖️',
    colour: '#00ACC1',
    airport: 'CAG',
    region: 'SOUTHERN ITALY & ISLANDS',
    brief:
      'The second-largest Mediterranean island offers some of the clearest water and most pristine beaches in all of Europe. Three days based in Cagliari covers the old Castello quarter, the pink flamingo lagoons just outside the city, and the Costa Rei beaches with Caribbean-clear water. A fourth day adds a drive north to the Barumini nuraghe (UNESCO Bronze Age stone towers unique to Sardinia), the macchia-scented interior, and sunset at Is Arutas beach with quartz-crystal white sand. The Maddalena Archipelago in the north and Orosei Gulf caves in the east reward dedicated beach-goers who stay longer.',
    tags: ['Crystal Clear Water', 'Beaches', 'Nuraghe', 'Pink Flamingos'],
    recommendedDays: [3, 4],
  },
];

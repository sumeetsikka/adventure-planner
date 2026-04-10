import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Portugal
 * 4. Consistently ranked in top Portugal destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Lisbon: gateway, UNESCO-adjacent, top ranked (1,2,4,5) ✓
 * - Porto: gateway, UNESCO historic centre, top ranked (1,2,4,5) ✓
 * - Sintra: UNESCO, bucket-list palaces, day-trip essential (1,3,4,5) ✓
 * - Madeira: unique volcanic island, bucket-list levada walks (3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Algarve/Lagos: beach-niche, similar options exist elsewhere (fails 3,5)
 * - Azores: incredibly unique but remote and niche (fails 2,5)
 * - Others: day-trip scope, or lack international gateway status
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // LISBON & CENTRAL
  // ═══════════════════════════════════════════
  {
    id: 'lisbon',
    name: 'Lisbon',
    emoji: '🟡',
    colour: '#E8531A',
    airport: 'LIS',
    region: 'LISBON & CENTRAL',
    brief:
      "Portugal's sun-drenched capital rewards every type of traveller with its mosaic-tiled streets, hilltop viewpoints, and world-class pastries. Spend a day riding the iconic Tram 28 through Alfama, listening to haunting fado music in a neighbourhood tasca, and watching the sun set from Miradouro da Graca. Dedicate another to the riverside Belem district: the ornate Jeronimos Monastery, Torre de Belem, and the original Pasteis de Belem custard tarts. A third day opens up the LX Factory weekend market, the vibrant Bairro Alto nightlife scene, and a ferry across the Tagus to the Cristo Rei viewpoint.",
    tags: ['Fado', 'Architecture', 'Pasteis de Nata', 'Tram 28'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'sintra',
    name: 'Sintra',
    emoji: '🏰',
    colour: '#9B59B6',
    airport: 'LIS',
    region: 'LISBON & CENTRAL',
    brief:
      "A fairytale village of colourful palaces clinging to forested hillsides just 40 minutes from Lisbon. The candy-striped Pena Palace is one of the most photographed buildings in Europe, the ruined Moorish Castle offers sweeping Atlantic views, and the mysterious Quinta da Regaleira hides underground initiatory wells and secret tunnels. Sintra is perfectly manageable as a day trip from Lisbon, though arriving early is essential to beat the crowds. The town centre is lined with pastry shops selling queijadas and travesseiros, the local custard and almond pastries.",
    tags: ['Palaces', 'UNESCO', 'Day Trip', 'Fairytale'],
    recommendedDays: [1, 1],
    mustVisit: true,
    isDayTrip: true,
    accessNote: 'Day trip from Lisbon (40 min by train)',
  },
  {
    id: 'coimbra',
    name: 'Coimbra',
    emoji: '📚',
    colour: '#C0392B',
    airport: 'LIS',
    region: 'LISBON & CENTRAL',
    brief:
      "Home to one of the oldest universities in the world, Coimbra is a city of students, scholars, and soulful fado. The Biblioteca Joanina is a jaw-dropping baroque library with books dating back centuries, its shelves guarded by a colony of bats that eat the bookworms at night. Explore the medieval old town on the hill, hear Coimbra-style fado performed by black-caped students, and visit the Se Velha cathedral built by the first king of Portugal. An overnight stay is far more rewarding than a simple transit stop.",
    tags: ['University', 'Fado', 'Historic Old Town', 'Baroque Library'],
    recommendedDays: [1, 2],
    accessNote: 'Via Lisbon (2 hr by train)',
  },
  {
    id: 'evora',
    name: 'Evora',
    emoji: '🏛️',
    colour: '#D4AC0D',
    airport: 'LIS',
    region: 'LISBON & CENTRAL',
    brief:
      "A remarkably preserved walled medieval city in the Alentejo plains, with a Roman temple standing almost intact in the centre of town. The Chapel of Bones is one of Portugal's most extraordinary sights: its walls and ceiling are entirely decorated with the skulls and femurs of over 5,000 monks. Wander the cobbled lanes to the 12th-century Se Cathedral, browse the Saturday market for local cheeses and black pork products, and finish with a glass of full-bodied Alentejo red wine at a shaded courtyard cafe.",
    tags: ['Roman Ruins', 'Medieval Walls', 'Chapel of Bones', 'Alentejo Wine'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Via Lisbon (1.5 hr by bus)',
  },
  {
    id: 'nazare',
    name: 'Nazare',
    emoji: '🌊',
    colour: '#1A5276',
    airport: 'LIS',
    region: 'LISBON & CENTRAL',
    brief:
      "A dramatic fishing village famous for producing the biggest surfable waves on earth, regularly exceeding 20 metres during winter swells. The clifftop Sitio district offers spectacular views over the beach and the Atlantic, and the funicular ride up is a classic Portuguese experience. Outside of big swell season the beach is wide and calm, the local fisherwomen still wear the traditional seven-petticoat skirts, and the seafood restaurants along the esplanade are excellent. Easily combined with Obidos or Peniche for a full day out from Lisbon.",
    tags: ['Giant Waves', 'Surf', 'Clifftop Views', 'Fishing Village'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Via Lisbon (1.5 hr by bus)',
  },
  {
    id: 'obidos',
    name: 'Obidos',
    emoji: '🍒',
    colour: '#A93226',
    airport: 'LIS',
    region: 'LISBON & CENTRAL',
    brief:
      "One of Portugal's most charming small towns, entirely enclosed within intact medieval castle walls draped in bougainvillea. Walk the full circuit of the ramparts for views over the white-and-blue village below, explore the cobblestone main street lined with flower-filled balconies, and sample ginjinha, a sour cherry liqueur served in a chocolate cup that is Obidos's signature treat. The town hosts a celebrated Medieval Market each July and a Chocolate Festival in March. Best visited as a half-day trip from Lisbon or en route to Nazare.",
    tags: ['Medieval Walls', 'Ginjinha', 'Cobblestone Village', 'Day Trip'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Lisbon (1 hr by bus)',
  },
  {
    id: 'cascais',
    name: 'Cascais',
    emoji: '⛵',
    colour: '#2980B9',
    airport: 'LIS',
    region: 'LISBON & CENTRAL',
    brief:
      "A relaxed coastal resort town at the end of the Lisbon Riviera, once the summer retreat of the Portuguese royal family. The old fishing harbour is still working and the daily catch goes straight to the esplanade restaurants, where grilled sea bream and percebes barnacles are the order of the day. Rent a bike and cycle the coastal path to Boca do Inferno, a dramatic sea cave carved by Atlantic waves, then continue to the sweeping sands of Guincho beach. The train ride from Lisbon along the Tagus estuary is itself a scenic highlight.",
    tags: ['Coastal Cycling', 'Seafood', 'Beaches', 'Day Trip'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Lisbon (40 min by train)',
  },
  {
    id: 'peniche',
    name: 'Peniche and Berlengas',
    emoji: '🦜',
    colour: '#117A65',
    airport: 'LIS',
    region: 'LISBON & CENTRAL',
    brief:
      "A rugged Atlantic peninsula with world-class surf breaks and a short ferry ride to one of Portugal's most spectacular natural reserves. The Berlengas Archipelago is a UNESCO biosphere reserve: crystal-clear water surrounds a fortress island, sea caves glow turquoise in the afternoon light, and the snorkelling is the best on the Portuguese mainland. Peniche itself is an authentic working fishing port with a fascinating 16th-century fortress that once served as a political prison during the Salazar dictatorship.",
    tags: ['Berlengas Island', 'Snorkelling', 'Surf', 'Nature Reserve'],
    recommendedDays: [1, 2],
    accessNote: 'Via Lisbon (1.5 hr by bus)',
  },

  // ═══════════════════════════════════════════
  // ALGARVE & SOUTH
  // ═══════════════════════════════════════════
  {
    id: 'algarve',
    name: 'Algarve and Lagos',
    emoji: '🏖️',
    colour: '#F39C12',
    airport: 'FAO',
    region: 'ALGARVE & SOUTH',
    brief:
      "Portugal's sun-soaked southern coast delivers some of Europe's most dramatic coastline: towering golden sea stacks, hidden grottos accessible only by kayak, and wide sandy beaches framed by ochre cliffs. Lagos is the ideal base: the old town is compact and walkable, the nightlife is lively without being overwhelming, and Ponta da Piedade's rock formations are among the most photogenic in Europe. A boat trip into the sea caves is non-negotiable, Meia Praia is perfect for a lazy beach afternoon, and the surrounding villages of Sagres and Alvor reward a half-day exploration.",
    tags: ['Sea Stacks', 'Kayaking', 'Beaches', 'Sea Caves'],
    recommendedDays: [3, 4],
  },

  // ═══════════════════════════════════════════
  // PORTO & NORTH
  // ═══════════════════════════════════════════
  {
    id: 'porto',
    name: 'Porto',
    emoji: '🍷',
    colour: '#6E2C00',
    airport: 'OPO',
    region: 'PORTO & NORTH',
    brief:
      "Portugal's second city is frequently voted one of Europe's most beautiful, and for good reason. The UNESCO-listed Ribeira waterfront, the azulejo-tiled facades, and the port wine lodges across the river in Vila Nova de Gaia combine to create a city unlike anywhere else on the continent. Spend a day exploring the Livraria Lello (one of the world's most beautiful bookshops), the ornate Sao Bento railway station entrance hall, and the cliff-top gardens of the Crystal Palace. Reserve another for a cellar tour and tasting at a port wine lodge, a boat trip on the Douro River, and dinner of bacalhau a bras in a traditional tasca.",
    tags: ['Port Wine', 'Azulejo Tiles', 'Ribeira', 'UNESCO'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'douro',
    name: 'Douro Valley',
    emoji: '🍇',
    colour: '#7D3C98',
    airport: 'OPO',
    region: 'PORTO & NORTH',
    brief:
      "One of the oldest wine regions in the world, where terraced vineyards cascade down steep schist hillsides above the jade-green Douro River. The classic experience is a two-day journey: take the scenic train from Porto to Pinhao, stay at a quinta (wine estate), tour the cellar and harvest vines if visiting in September, and return by river cruise. The landscape is a UNESCO World Heritage Site and is most dramatic in autumn when the vines turn gold and crimson. Wine tastings, quintas open to visitors, and long lunches of roasted kid and local red wine make this a serious food and drink destination.",
    tags: ['Wine Estates', 'River Cruise', 'Terraced Vineyards', 'UNESCO'],
    recommendedDays: [2, 2],
    accessNote: 'Via Porto (2 hr by train to Pinhao)',
  },
  {
    id: 'aveiro',
    name: 'Aveiro',
    emoji: '🛶',
    colour: '#1F618D',
    airport: 'OPO',
    region: 'PORTO & NORTH',
    brief:
      "Often called the Venice of Portugal, Aveiro is built around a network of canals crossed by brightly painted moliceiro boats with ornately decorated prows. A gondola-style canal cruise is the essential activity, followed by a visit to the Art Nouveau museum and a stop at a pastelaria for ovos moles, the local sweet made from egg yolk and rice wafer. The beaches at Costa Nova, with their striped candy-coloured beach huts, are a 15-minute bus ride away and wonderfully photogenic. Aveiro makes a perfect half-day stop between Porto and Coimbra.",
    tags: ['Canal Boats', 'Art Nouveau', 'Ovos Moles', 'Striped Beach Huts'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Via Porto (1 hr by train)',
  },

  // ═══════════════════════════════════════════
  // ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'madeira',
    name: 'Madeira',
    emoji: '🌺',
    colour: '#1E8449',
    airport: 'FNC',
    region: 'ISLANDS',
    brief:
      "A volcanic island of extraordinary natural beauty floating in the Atlantic, with a year-round mild climate that earns it the nickname Island of Eternal Spring. The levada walks are the headline experience: centuries-old irrigation channels cut into cliffsides and through laurisilva forests, with trails ranging from gentle valley strolls to vertigo-inducing high-altitude routes. Take the cable car up to Monte, toboggan back down in the traditional wicker sledge, explore the dramatic coastal cliffs at Cabo Girao, and visit the Mercado dos Lavradores for tropical flowers and exotic fruits. Funchal's old town is animated and colourful, the local poncha rum cocktails are dangerously easy to drink, and the views from Pico do Arieiro at sunrise are unforgettable.",
    tags: ['Levada Walks', 'Volcanic Scenery', 'Toboggan Rides', 'Tropical Gardens'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'azores',
    name: 'Azores',
    emoji: '🌋',
    colour: '#0E6655',
    airport: 'PDL',
    region: 'ISLANDS',
    brief:
      "Nine volcanic islands scattered across the mid-Atlantic, unlike anywhere else in Europe. Sao Miguel, the main island, packs extraordinary variety into a small area: the twin crater lakes of Sete Cidades glowing blue and green, geothermal hot springs bubbling up at Furnas where locals cook caldo verde stew underground, and whale watching encounters with sperm whales and dolphins year-round. The landscape swings between lush green valleys carpeted in hydrangeas, black lava coastline, and cloud-shrouded calderas. Adventurous travellers can island-hop to Pico for mountain climbing and vineyard touring, or to Flores for the most dramatic waterfall landscape in the Atlantic.",
    tags: ['Crater Lakes', 'Whale Watching', 'Geothermal Springs', 'Volcanic Scenery'],
    recommendedDays: [3, 4],
  },
];

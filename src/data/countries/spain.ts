import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Spain
 * 4. Consistently ranked in top Spain destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Barcelona: Gaudi/Sagrada Familia bucket-list, major gateway (1,2,3,4,5) ✓
 * - Madrid: Prado/Golden Triangle of Art, primary gateway (1,2,3,4,5) ✓
 * - Seville: Alcazar/flamenco birthplace, consistently top-ranked (1,3,4,5) ✓
 * - Granada: Alhambra is Spain's single most visited monument (1,3,4,5) ✓
 * - San Sebastian: world's highest Michelin-star concentration, unique (3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Mallorca: excellent but beach/resort niche, lacks singular monument (fails 3,5)
 * - Ibiza: nightlife-niche, very specific traveller type (fails 3,5)
 * - Bilbao: Guggenheim is superb but niche architecture/art appeal (fails 5)
 * - Others: regional, island-specific, or day-trip destinations
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // CENTRAL SPAIN
  // ═══════════════════════════════════════════
  {
    id: 'madrid',
    name: 'Madrid',
    emoji: '🎨',
    colour: '#C62828',
    airport: 'MAD',
    region: 'CENTRAL SPAIN',
    brief:
      'Spain\'s capital is a city that truly comes alive at night: dinner at 10pm, dancing until 6am, and a churros con chocolate breakfast to close the evening. Two to three days covers the Golden Triangle of Art: the Prado (Velazquez, Goya, Bosch) and the Reina Sofia (Picasso\'s Guernica) are essential. Spend the rest exploring the ornate Retiro Park, the San Miguel market, and the centuries-old Chocolateria San Gines. A third day unlocks the historic El Rastro flea market (Sunday only), the Royal Palace, and a day trip to medieval Toledo on the TGV.',
    tags: ['Prado Museum', 'Nightlife', 'Tapas', 'Royal Palace'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'toledo',
    name: 'Toledo',
    emoji: '⚔️',
    colour: '#6D4C41',
    airport: 'MAD',
    region: 'CENTRAL SPAIN',
    brief:
      'Spain\'s former imperial capital perches on a dramatic rocky outcrop above a bend in the Tagus River, its medieval skyline unchanged since El Greco painted it in 1599. One full day covers the Gothic Cathedral (Spain\'s finest), the Alcazar fortress, El Greco\'s house-museum, and the extraordinary coexistence of Christian, Jewish, and Moorish heritage in the old town\'s tangled lanes. Toledo is a natural and easy day trip from Madrid via the 25-minute high-speed train, arriving in a UNESCO World Heritage cityscape that feels completely separate from the modern capital.',
    tags: ['Medieval City', 'El Greco', 'UNESCO', 'Three Cultures'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Madrid (25min by AVE high-speed train)',
  },

  // ═══════════════════════════════════════════
  // CATALONIA & NORTHEAST
  // ═══════════════════════════════════════════
  {
    id: 'barcelona',
    name: 'Barcelona',
    emoji: '🏗️',
    colour: '#FF6F00',
    airport: 'BCN',
    region: 'CATALONIA & NORTHEAST',
    brief:
      'Spain\'s most visited city combines Gaudi\'s architectural fever dreams, medieval Gothic lanes, and a beach culture that most European cities can only envy. Three days covers the essentials: the Sagrada Familia (a genuine wonder of the modern world, pre-book well ahead), Park Guell\'s mosaic terraces, Casa Batllo and La Pedrera on the Passeig de Gracia. Explore the labyrinthine Barri Gotic and El Born for tapas and vermouth at noon. A fourth day adds Barceloneta beach, the Picasso Museum, Montjuic cable car and castle views, and an evening at a local flamenco tablao or a Barça match at Camp Nou if the season allows.',
    tags: ['Gaudi', 'Sagrada Familia', 'Gothic Quarter', 'Beach'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'costa-brava',
    name: 'Costa Brava',
    emoji: '🌊',
    colour: '#00897B',
    airport: 'BCN',
    region: 'CATALONIA & NORTHEAST',
    brief:
      'The rugged Costa Brava stretches north of Barcelona to the French border with a dramatically different character to the overdeveloped southern costas: rocky coves, medieval hilltop villages, and the clearest water on the Spanish mainland. Two to three days based around Girona covers the old city\'s brilliantly preserved Jewish quarter and Game of Thrones filming locations, the Salvador Dali Theatre-Museum at Figueres (the most-visited museum in Spain after the Prado), and the medieval village of Besalu with its fortified bridge. Add a day exploring the coastal path between the fishing villages of Calella de Palafrugell and Llafranc for the definitive Costa Brava walking experience.',
    tags: ['Coves & Beaches', 'Dali Museum', 'Medieval Villages', 'Coastal Hiking'],
    recommendedDays: [2, 3],
    accessNote: 'Via Barcelona (BCN), 1-1.5hr by car or bus',
  },
  {
    id: 'valencia',
    name: 'Valencia',
    emoji: '🥘',
    colour: '#FF8F00',
    airport: 'VLC',
    region: 'CATALONIA & NORTHEAST',
    brief:
      'The birthplace of paella is a city of warm Mediterranean light, futuristic architecture, and 18km of free city beaches. Two days covers the spectacular Ciudad de las Artes y las Ciencias (Calatrava\'s science-fiction complex), a paella lunch at a traditional barraca restaurant in La Albufera rice paddies (where the dish was invented), and the old town\'s Central Market. The Barrio del Carmen neighbourhood delivers the nightlife Valencia is increasingly famous for, and the city\'s February Las Fallas festival, when giant satirical sculptures are set ablaze in the streets, is one of the world\'s most extraordinary public events.',
    tags: ['Paella', 'City of Arts & Sciences', 'City Beach', 'Las Fallas'],
    recommendedDays: [2, 2],
  },

  // ═══════════════════════════════════════════
  // ANDALUSIA
  // ═══════════════════════════════════════════
  {
    id: 'seville',
    name: 'Seville',
    emoji: '💃',
    colour: '#E65100',
    airport: 'SVQ',
    region: 'ANDALUSIA',
    brief:
      'The soul of Andalusia and the birthplace of flamenco, Seville is arguably Spain\'s most atmospheric city. Two to three days covers the extraordinary Alcazar palace complex (Game of Thrones\' Dorne, and a UNESCO World Heritage site still used by the royal family), the world\'s largest Gothic cathedral and its Giralda tower, and the maze of whitewashed lanes in the Santa Cruz Jewish quarter. Book a flamenco show at a traditional tablao for a genuinely spine-tingling evening. A third day suits the Plaza de Espana tiled monument, the Triana neighbourhood across the river for ceramics and tapas culture, and a day trip to the Roman ruins at Italica.',
    tags: ['Flamenco', 'Alcazar Palace', 'Gothic Cathedral', 'Santa Cruz Quarter'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'granada',
    name: 'Granada',
    emoji: '🕌',
    colour: '#AD1457',
    airport: 'GRX',
    region: 'ANDALUSIA',
    brief:
      'The Alhambra is the single most-visited monument in Spain and one of the greatest architectural achievements in human history: a 14th-century Nasrid palace of lace-carved stucco, reflecting pools, and mathematically perfect geometric patterns. Book tickets months in advance for the Nasrid Palaces as timed entry is strictly limited. Two days covers the Alhambra complex (including the Generalife gardens), the Albaicin Moorish quarter, the Sacromonte cave neighbourhood, and a free tapas culture unique to Granada where every drink comes with a complimentary plate of food. The contrast of Islamic and Christian architecture within a single city is unlike anywhere else in Europe.',
    tags: ['Alhambra Palace', 'Moorish Quarter', 'Free Tapas', 'Sacromonte Caves'],
    recommendedDays: [2, 2],
    mustVisit: true,
  },
  {
    id: 'cordoba',
    name: 'Cordoba',
    emoji: '🕍',
    colour: '#8E24AA',
    airport: 'SVQ',
    region: 'ANDALUSIA',
    brief:
      'Cordoba\'s Mezquita is one of the most staggering buildings on earth: a seemingly infinite forest of 856 red-and-white striped Roman arches, built as the great mosque of the Western Caliphate and later bisected by a Renaissance cathedral rising from its centre. One full day covers the Mezquita at opening before the crowds, the medieval Jewish quarter of Juderia with its flower-filled courtyards, the Alcazar de los Reyes Cristianos, and a long lunch of salmorejo (thick Cordoban tomato soup) and rabo de toro braised oxtail at a white-walled taverna. Cordoba is the ideal stopping point between Seville and Granada.',
    tags: ['Mezquita', 'Jewish Quarter', 'Flower Courtyards', 'UNESCO'],
    recommendedDays: [1, 1],
    accessNote: 'Via Seville (SVQ), 45min by AVE high-speed train',
  },
  {
    id: 'malaga',
    name: 'Malaga',
    emoji: '☀️',
    colour: '#F4511E',
    airport: 'AGP',
    region: 'ANDALUSIA',
    brief:
      'Picasso\'s birthplace has transformed from a simple gateway to the Costa del Sol into one of Spain\'s most dynamic cultural cities. Two days covers the Picasso Museum in the 16th-century Buenavista Palace, the Pompidou Centre Malaga (the only Pompidou outside France), the Moorish Alcazaba fortress, and the vibrant Soho street art district. The old town\'s tapas scene is exceptional and underpriced compared to Seville or Granada, and Malaga\'s beaches are excellent. The city is also the natural gateway to the spectacular Caminito del Rey gorge walk, one of Spain\'s most thrilling day hikes.',
    tags: ['Picasso Museum', 'Alcazaba', 'Caminito del Rey', 'Beach Gateway'],
    recommendedDays: [2, 2],
  },

  // ═══════════════════════════════════════════
  // ISLANDS
  // ═══════════════════════════════════════════
  {
    id: 'mallorca',
    name: 'Mallorca',
    emoji: '🏖️',
    colour: '#26C6DA',
    airport: 'PMI',
    region: 'ISLANDS',
    brief:
      'Spain\'s largest Balearic island has enough range to satisfy every kind of traveller across three to four days. The northwest coast around Valldemossa and Deia is dramatic and mountainous, with the Serra de Tramuntana UNESCO range offering walks above clifftop olive groves. The northeast\'s Cala Mesquida and Cap de Formentor beaches have genuinely stunning turquoise water. Palma de Mallorca is a proper city: the cathedral La Seu illuminated at night above the harbour is one of Spain\'s great sights, and the Mallorcan food and wine scene has become quietly excellent. Hire a car to escape the resort-heavy south.',
    tags: ['Serra de Tramuntana', 'Coves & Beaches', 'Palma Cathedral', 'Cycling'],
    recommendedDays: [3, 4],
  },
  {
    id: 'ibiza',
    name: 'Ibiza',
    emoji: '🎶',
    colour: '#FF4081',
    airport: 'IBZ',
    region: 'ISLANDS',
    brief:
      'The world\'s clubbing capital has a dual personality that surprises most visitors: beyond the superclubs of San Antonio and Playa d\'en Bossa lies a quieter, more beautiful island of pine-scented coves, hippie markets, and a remarkably well-preserved UNESCO fortified old town. Two to three days covers Dalt Vila\'s hilltop citadel at sunset, the hidden beaches of Cala Conta and Cala Saladeta on the northwest coast, the eclectic Las Dalias hippie market on Saturdays, and if it\'s your thing, at least one night at Amnesia or Pacha. The island is entirely different between October and May when the clubs are closed and the landscape takes over.',
    tags: ['Nightlife', 'Hidden Coves', 'Dalt Vila', 'Hippie Markets'],
    recommendedDays: [2, 3],
  },
  {
    id: 'tenerife',
    name: 'Tenerife',
    emoji: '🌋',
    colour: '#FF7043',
    airport: 'TFS',
    region: 'ISLANDS',
    brief:
      'The largest Canary Island has the most dramatic landscape in Spain: the Teide volcano (3,715m, Spain\'s highest peak and a UNESCO World Heritage site) dominates the island like no other geological feature in Europe. Three days covers a cable car ascent of Teide inside the extraordinary Mars-like caldera, the dramatically carved Masca gorge hike down to a black-sand beach accessible only by boat, and the colonial capital Santa Cruz de Tenerife with its CAAM museum and Mercado de Nuestra Senora de Africa. The north\'s Anaga Rural Park offers ancient laurisilva forest hiking that feels prehistoric and utterly unlike anywhere else in Spain.',
    tags: ['Mt Teide', 'Volcanic Landscape', 'Anaga Forest', 'UNESCO'],
    recommendedDays: [3, 3],
  },
  {
    id: 'menorca',
    name: 'Menorca',
    emoji: '🐎',
    colour: '#4DD0E1',
    airport: 'MAH',
    region: 'ISLANDS',
    brief:
      'The least developed and most ecologically protected of the Balearic Islands, Menorca is a UNESCO Biosphere Reserve of turquoise coves, Bronze Age talayot monuments, and a genuinely unhurried pace. Two to three days is ideal: the north coast\'s wild, wind-battered beaches like Cala Pregonda contrast sharply with the south\'s sheltered Caribbean-clear coves like Cala Macarella, accessible only on foot or by boat. Ciutadella\'s Gothic old town and harbour is one of Spain\'s most beautiful small cities, and the local gin tradition (introduced by 18th-century British occupation) makes for a distinctive aperitivo culture.',
    tags: ['Unspoilt Coves', 'Biosphere Reserve', 'Bronze Age Sites', 'Ciutadella'],
    recommendedDays: [2, 3],
  },

  // ═══════════════════════════════════════════
  // NORTHERN SPAIN
  // ═══════════════════════════════════════════
  {
    id: 'san-sebastian',
    name: 'San Sebastian',
    emoji: '🦐',
    colour: '#43A047',
    airport: 'EAS',
    region: 'NORTHERN SPAIN',
    brief:
      'San Sebastian has the highest concentration of Michelin stars per capita of any city on earth and the best pintxos bar culture in the world. Two to three days is justified entirely by eating: the old town\'s Parte Vieja bars where the marble counters groan with towers of txakoli-washed pintxos at noon, a reservation at a starred restaurant in the Gros district, and the local market for anchovy bocadillos at breakfast. Playa de la Concha, the urban beach wrapping the bay below the old quarter, is consistently rated one of the finest city beaches in Europe. A third day adds a surf lesson at Zurriola, the Guggenheim Bilbao day trip, or a cider-house lunch in the surrounding Basque countryside.',
    tags: ['Pintxos', 'Michelin Stars', 'La Concha Beach', 'Basque Culture'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'bilbao',
    name: 'Bilbao',
    emoji: '🏛️',
    colour: '#1976D2',
    airport: 'BIO',
    region: 'NORTHERN SPAIN',
    brief:
      'Frank Gehry\'s titanium-scaled Guggenheim Bilbao is one of the most important works of architecture of the 20th century and single-handedly triggered the regeneration of a former industrial port city into one of Spain\'s most compelling urban destinations. Two days covers the Guggenheim\'s permanent collection (Jeff Koons\' Puppy outside, Richard Serra\'s Torqued Ellipses inside), the Casco Viejo\'s Siete Calles medieval quarter, and the covered Mercado de la Ribera (Europe\'s largest indoor market) for Basque street food. Bilbao pairs naturally with San Sebastian as a two-city Basque Country itinerary.',
    tags: ['Guggenheim', 'Basque Cuisine', 'Casco Viejo', 'Architecture'],
    recommendedDays: [2, 2],
  },
  {
    id: 'santiago-de-compostela',
    name: 'Santiago de Compostela',
    emoji: '⛪',
    colour: '#5D4037',
    airport: 'SCQ',
    region: 'NORTHERN SPAIN',
    brief:
      'The final destination of the Camino de Santiago pilgrimage routes: a medieval UNESCO World Heritage city built around one of the most extraordinary Romanesque cathedrals in existence. Two days covers the Cathedral\'s Portico de la Gloria, the Praza do Obradoiro (arguably Spain\'s finest public square), the Archbishop\'s Palace museum, and the atmospheric stone-flagged old town where pilgrims from 100 countries celebrate their arrival. The famous Botafumeiro incense burner swings on cables the length of the transept at special masses. Galician food is its own compelling reason to visit: percebes (barnacles), pulpo a feira (octopus), and Albarino white wine are the local triumvirate.',
    tags: ['Cathedral', 'Camino End Point', 'Pilgrimage City', 'Galician Food'],
    recommendedDays: [2, 2],
  },
];

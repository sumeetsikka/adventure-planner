import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Peru
 * 4. Consistently ranked in top Peru destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Lima: gateway, culinary capital, broad appeal (2,4,5) ✓
 * - Cusco: UNESCO, gateway to Inca heartland, bucket-list city (1,2,3,4,5) ✓
 * - Machu Picchu: UNESCO, bucket-list, globally iconic (1,3,4,5) ✓
 * - Iquitos/Amazon: gateway to the Amazon, unique jungle experience (2,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Sacred Valley: excellent but feeds into Machu Picchu, lacks standalone landmark (fails 3)
 * - Lake Titicaca: remarkable but niche to certain vibes (fails 5)
 * - Arequipa: beautiful city but limited bucket-list pull beyond Colca (fails 3,5)
 * - Nazca: fascinating but a one-trick stop (fails 5)
 * - Others: day-trip scale or too niche
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // LIMA & COAST
  // ═══════════════════════════════════════════
  {
    id: 'lima',
    name: 'Lima',
    emoji: '🦭',
    colour: '#D4A017',
    airport: 'LIM',
    region: 'LIMA & COAST',
    brief:
      "Peru's capital on the Pacific coast has reinvented itself as one of the world's great food cities, home to multiple restaurants on the World's 50 Best list and a dining culture built on the superb biodiversity of Peruvian ingredients. The colonial centre of Lima and the Franciscan Catacombs beneath the Plaza Mayor are UNESCO-listed and genuinely absorbing for a full morning. Miraflores and Barranco districts provide a walkable afternoon of clifftop ocean views, the Larco Museum's extraordinary pre-Columbian gold collections, and street art laneways lined with cevicherias. A fourth day suits a cookery class, a sea lion colony boat trip from Callao, or a day trip to the Pachacamac ruins.",
    tags: ['Gastronomy', 'UNESCO Colonial Centre', 'Pre-Columbian Museums', 'Pacific Views', 'Ceviche'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'nazca',
    name: 'Nazca Lines',
    emoji: '✈️',
    colour: '#C8A96E',
    airport: 'LIM',
    region: 'LIMA & COAST',
    brief:
      "The Nazca Lines are a collection of hundreds of giant geoglyphs etched into the desert floor by the Nazca culture between 500 BC and 500 AD and best understood from the air, where the scale of a 90-metre spider or a 300-metre pelican becomes clear. A 30-minute light aircraft flight from Nazca airport over the main figures is the standard way to experience them, offering an extraordinary perspective on one of archaeology's great unsolved mysteries. The Maria Reiche Museum nearby explains the life of the German mathematician who dedicated her career to mapping and protecting the lines. Nazca is most commonly visited as a full-day stop on the Panamericana highway between Lima and Arequipa.",
    tags: ['UNESCO Geoglyphs', 'Scenic Flight', 'Archaeology', 'Desert'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Lima (LIM) by bus (6-7hr) or short internal flight',
  },
  {
    id: 'huacachina',
    name: 'Huacachina',
    emoji: '🏜️',
    colour: '#C9A84C',
    airport: 'LIM',
    region: 'LIMA & COAST',
    brief:
      "A surreal oasis of palm trees and a green lagoon ringed by 100-metre sand dunes in the Peruvian desert, making it one of the most dramatic natural settings in South America. The classic experience is a late-afternoon dune buggy ride up the highest surrounding ridges followed by sandboarding down the steep faces as the sun dips below the horizon and the sand turns gold. The lagoon village itself is tiny and agreeable for an evening: a cold Peruvian craft beer at one of the open-air bars watching the dunes change colour after sunset. Huacachina is best combined with the Nazca Lines as a two-day coastal detour from Lima.",
    tags: ['Sand Dunes', 'Sandboarding', 'Dune Buggies', 'Desert Oasis'],
    recommendedDays: [1, 2],
    accessNote: 'Accessible from Lima (LIM) by bus to Ica (4hr), then taxi',
  },
  {
    id: 'paracas',
    name: 'Paracas',
    emoji: '🦩',
    colour: '#5B8FA8',
    airport: 'LIM',
    region: 'LIMA & COAST',
    brief:
      "A small coastal town on a dramatic desert peninsula where the Atacama meets the Pacific, forming one of Peru's most biodiverse marine reserves. The Ballestas Islands boat trip is the essential experience: a two-hour circuit past thousands of Humboldt penguins, sea lions, dolphins, and Peruvian pelicans clustered on guano-covered rocks that rival the Galapagos for sheer wildlife density. The Paracas National Reserve's ochre desert cliffs, red beaches, and flamingo-filled lagoons can be explored by bicycle or hired 4WD, and the Candelabra geoglyph carved into a cliffside is visible from the bay. Paracas pairs naturally with Huacachina and the Nazca Lines for a three-day southern coastal loop.",
    tags: ['Ballestas Islands', 'Marine Wildlife', 'National Reserve', 'Flamingos'],
    recommendedDays: [1, 2],
    accessNote: 'Accessible from Lima (LIM) by bus (3.5hr)',
  },
  {
    id: 'mancora',
    name: 'Mancora',
    emoji: '🏄',
    colour: '#1A8B7A',
    airport: 'LIM',
    region: 'LIMA & COAST',
    brief:
      "Peru's top beach destination sits in the far north near the Ecuadorian border, where warm Pacific waters, consistent surf breaks, and year-round sun attract surfers and backpackers looking to decompress after Machu Picchu. The long sandy beach fronts a strip of hostels, seafood shacks, and beach bars with an easy, unhurried atmosphere. Beginners find the waves accessible with a half-day surf lesson, while advanced surfers head to the Punta Bal point break for heavier sets. Lobster and ceviche cooked by beachside vendors with no menu and plastic chairs is the dining highlight, and whale sharks occasionally pass offshore from November to March.",
    tags: ['Surfing', 'Beach', 'Seafood', 'Backpacker Scene'],
    recommendedDays: [2, 3],
    accessNote: 'Fly from Lima (LIM) to Piura or take overnight bus (18hr)',
  },
  {
    id: 'huaraz',
    name: 'Huaraz',
    emoji: '🏔️',
    colour: '#3A6B8A',
    airport: 'LIM',
    region: 'LIMA & COAST',
    brief:
      "The trekking capital of the Andes sits at 3,052 metres in the Cordillera Blanca, home to the highest concentration of tropical glaciers on earth and some of the finest mountain scenery outside the Himalayas. The Laguna 69 day trek is the most celebrated in the region, climbing steeply through queñoa woodland to a turquoise glacial lake beneath the sheer 5,000-metre walls of Chacraraju in around six hours. The Santa Cruz four-day circuit through the heart of the Blanca is considered one of the best trekking routes in South America, passing beneath snowcapped peaks exceeding 6,000 metres. Huaraz itself has a lively Plaza de Armas, excellent gear rental shops, and a growing craft brewery scene fuelled by returning trekkers.",
    tags: ['High Altitude Trekking', 'Glacial Lakes', 'Cordillera Blanca', 'Santa Cruz Trek'],
    recommendedDays: [3, 4],
    accessNote: 'Accessible from Lima (LIM) by overnight bus (8hr)',
  },

  // ═══════════════════════════════════════════
  // SACRED VALLEY & CUSCO
  // ═══════════════════════════════════════════
  {
    id: 'cusco',
    name: 'Cusco',
    emoji: '🦙',
    colour: '#8B1A1A',
    airport: 'CUZ',
    region: 'SACRED VALLEY & CUSCO',
    brief:
      "The former capital of the Inca Empire and the gateway to Machu Picchu is a UNESCO World Heritage city where Spanish colonial churches and palaces were built directly on top of Inca stone foundations, creating a layered urban history unlike anywhere else. Allow a full first day simply to acclimatise to the 3,400-metre altitude and explore the Plaza de Armas, the Qorikancha Temple of the Sun, and the nearby San Blas artisan neighbourhood. A second day goes to the Sacsayhuaman fortress ruins on the hill above the city, where the precision-fitted megaliths are as bewildering in person as in any photograph. A third day suits a cooking class, the San Pedro market, and preparation for Machu Picchu the following morning.",
    tags: ['Inca Ruins', 'UNESCO', 'Colonial Architecture', 'High Altitude', 'Andean Cuisine'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'machupicchu',
    name: 'Machu Picchu',
    emoji: '🏛️',
    colour: '#5A7A3A',
    airport: 'CUZ',
    region: 'SACRED VALLEY & CUSCO',
    brief:
      "The most famous archaeological site in the Americas is a 15th-century Inca citadel perched at 2,430 metres on a narrow mountain ridge above the Urubamba River, entirely invisible from the valley below, which is why it escaped Spanish conquest and was unknown to the outside world until 1911. The classic entry is by Vistadome train from Cusco to Aguas Calientes, then bus up the switchback road, arriving before 8am to beat the crowds and experience the terraces under morning mist before the valley clears. The Sun Gate hike above the main ruins provides the iconic panoramic view looking back down the mountain, and the Huayna Picchu summit requires a separate permit but offers vertiginous views straight down the 600-metre drop into the valley. A second day allows a thorough exploration of the Intihuatana stone, the Temple of the Sun, and the quieter agricultural terraces with a licensed guide.",
    tags: ['UNESCO', 'Inca Citadel', 'Mountain Hike', 'Bucket List', 'Archaeology'],
    recommendedDays: [2, 2],
    mustVisit: true,
    accessNote: 'Accessible from Cusco (CUZ) by train to Aguas Calientes, then bus',
  },
  {
    id: 'sacredvalley',
    name: 'Sacred Valley',
    emoji: '🌽',
    colour: '#6B4E2A',
    airport: 'CUZ',
    region: 'SACRED VALLEY & CUSCO',
    brief:
      "The broad river valley between Cusco and Machu Picchu was the agricultural and spiritual heartland of the Inca Empire, and its terraced hillsides and village markets remain among the most authentic in Peru. The salt pans of Maras, where hundreds of terraced evaporation pools cascade down a hillside in brilliant white and pink since pre-Inca times, are one of the most striking landscapes in South America. The nearby Moray circular terraces, believed to have functioned as an agricultural laboratory for cultivating crops at different altitudes, are equally mysterious. The Pisac market on Sundays draws Andean communities from surrounding villages in traditional dress to sell textiles and produce, and Ollantaytambo's living Inca town layout makes it the most authentic Inca urban experience outside Cusco.",
    tags: ['Salt Pans', 'Moray Terraces', 'Pisac Market', 'Ollantaytambo', 'Andean Villages'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Cusco (CUZ) by road; usually combined with Machu Picchu',
  },
  {
    id: 'rainbowmountain',
    name: 'Rainbow Mountain',
    emoji: '🌈',
    colour: '#C45B8A',
    airport: 'CUZ',
    region: 'SACRED VALLEY & CUSCO',
    brief:
      "Vinicunca, known as Rainbow Mountain, is a 5,200-metre peak whose exposed face layers of red, purple, yellow, and green mineral sediment in stripes that appear almost artificially vivid. The mountain was covered in glacial ice until recently, meaning it only became a tourism destination around 2015, which gives it an extraordinary freshness as a discovery. The day hike from the trailhead ascends around 500 vertical metres over six kilometres of high-altitude terrain and requires reasonable fitness and acclimatisation in Cusco first. An early 3am departure from Cusco allows arrival at the summit by mid-morning before afternoon cloud rolls in to obscure the colours.",
    tags: ['Coloured Mountains', 'High Altitude Hike', 'Photography', 'Andes'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Cusco (CUZ); requires prior acclimatisation',
  },

  // ═══════════════════════════════════════════
  // SOUTHERN PERU
  // ═══════════════════════════════════════════
  {
    id: 'arequipa',
    name: 'Arequipa',
    emoji: '🌋',
    colour: '#E8DDCB',
    airport: 'AQP',
    region: 'SOUTHERN PERU',
    brief:
      "The White City, built from pale volcanic sillar stone quarried from nearby volcanoes, is Peru's second city and a UNESCO World Heritage Centre with a relaxed, elegant atmosphere quite unlike Cusco. The Santa Catalina Monastery is the most remarkable religious complex in Peru: a self-contained walled city within the city where cloistered nuns lived in colourful private residences for 400 years until it opened to the public in 1970. Day two covers the Juanita mummy museum, where a perfectly preserved 500-year-old Inca girl sacrificed on Ampato volcano is on display, and the Yanahuara mirador for the iconic view of El Misti volcano looming directly over the city. Arequipa is the gateway for the Colca Canyon and requires at minimum one overnight stay before the early-morning departure.",
    tags: ['UNESCO Colonial City', 'Santa Catalina Monastery', 'Sillar Architecture', 'Volcano Views'],
    recommendedDays: [2, 3],
  },
  {
    id: 'colcacanyon',
    name: 'Colca Canyon',
    emoji: '🦅',
    colour: '#7A4A2A',
    airport: 'AQP',
    region: 'SOUTHERN PERU',
    brief:
      "One of the world's deepest canyons at over 3,000 metres, the Colca is most famous for the Cruz del Condor viewpoint where giant Andean condors, with wingspans up to 3.3 metres, ride thermal updrafts from the canyon floor between 7am and 10am in a display of effortless soaring that reliably stops visitors in their tracks. The two-day trek down into the canyon base village of Sangalle, where a natural oasis pool awaits at the bottom, is the most rewarding physical activity in southern Peru and finishes with a pre-dawn hike back to the rim before the midday heat. Traditional Colca villages along the rim road retain their pre-Inca terracing and women still wear the elaborate embroidered chivato hats of their specific community.",
    tags: ['Condor Watching', 'Canyon Trekking', 'Andean Villages', 'Inca Terraces'],
    recommendedDays: [2, 2],
    accessNote: 'Accessible from Arequipa (AQP) by bus in 3hr',
  },
  {
    id: 'titicaca',
    name: 'Lake Titicaca / Puno',
    emoji: '🛶',
    colour: '#2A5FA5',
    airport: 'JUL',
    region: 'SOUTHERN PERU',
    brief:
      "The world's highest navigable lake at 3,812 metres sits on the altiplano between Peru and Bolivia, its deep blue water reflecting a sky that feels closer than anywhere on earth. The Uros Floating Islands are the lake's most unusual attraction: artificial islands constructed entirely from layers of totora reeds by an indigenous community that has lived on the water for centuries to escape mainland conflicts. An overnight stay on Amantani Island in a community family home, with no electricity after dark and a sky full of stars at altitude, is one of the most memorable experiences in Peru. The Taquile Island weavers, who practise a UNESCO-recognised textile tradition, produce some of the finest hand-woven cloth in the Americas.",
    tags: ['Floating Reed Islands', 'High Altitude Lake', 'Indigenous Culture', 'UNESCO Textiles'],
    recommendedDays: [2, 3],
  },

  // ═══════════════════════════════════════════
  // AMAZON & JUNGLE
  // ═══════════════════════════════════════════
  {
    id: 'iquitos',
    name: 'Iquitos / Amazon',
    emoji: '🌿',
    colour: '#1E7A3A',
    airport: 'IQT',
    region: 'AMAZON & JUNGLE',
    brief:
      "The world's largest city with no road connection, accessible only by river or air, Iquitos is the gateway to the Peruvian Amazon and one of the most biodiverse regions on earth. A three-night jungle lodge stay along the Amazon or Napo rivers provides guided night walks to spot tarantulas, caiman, and dart frogs; piranha fishing from dugout canoes in the blackwater tributaries; and pink river dolphin encounters in the flooded forest. The Belen market in Iquitos itself is a floating neighbourhood built on rafts that rises and falls with the river, selling exotic jungle fruits, bushmeat, and medicinal plants used by Amazonian healers. A fourth day allows a visit to a local indigenous community and a traditional plant-medicine ceremony with a certified facilitator.",
    tags: ['Amazon Jungle', 'Wildlife', 'River Lodge', 'Pink Dolphins', 'Indigenous Culture'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
];

import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Egypt
 * 4. Consistently ranked in top Egypt destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Cairo: gateway, Egyptian Museum, Islamic Cairo, Coptic Cairo (1,2,4,5) ✓
 * - Giza Pyramids: the only surviving Wonder of the Ancient World, bucket-list (1,3,4,5) ✓
 * - Luxor: world's greatest open-air museum, Valley of the Kings, Karnak (1,3,4,5) ✓
 * - Abu Simbel: UNESCO, one of Egypt's most iconic images (1,3,4,5) ✓
 * - Nile Cruise: bucket-list journey linking the great monuments (3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Hurghada: excellent beach resort but lacks cultural depth (fails 1,3)
 * - Dahab: niche backpacker appeal (fails 2,5)
 * - Siwa Oasis: remote and specialist (fails 2,5)
 * - White Desert: niche photography appeal (fails 2,5)
 * - Alexandria: historically rich but most highlights are modest compared to Cairo (fails 3)
 * - Marsa Alam: niche diving destination (fails 1,5)
 * - Sharm el-Sheikh: resort town, niche appeal (fails 1,3)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // CAIRO & GIZA
  // ═══════════════════════════════════════════
  {
    id: 'cairo',
    name: 'Cairo',
    emoji: '🏙️',
    colour: '#C8860A',
    airport: 'CAI',
    region: 'CAIRO & GIZA',
    brief:
      "Egypt's vast, chaotic, and utterly compelling capital rewards four to five full days of exploration. Spend the first day immersed in the Egyptian Museum on Tahrir Square, where over 120,000 artefacts including Tutankhamun's golden death mask and the Royal Mummy Room fill an entire 19th-century building. Devote the second day to Islamic Cairo: the medieval Khan el-Khalili bazaar, the Sultan Hassan Mosque, and a slow wander through the City of the Dead necropolis. A third day belongs to Coptic Cairo's ancient churches and the Ben Ezra Synagogue in the old Roman fortress district of Babylon, followed by a sunset felucca ride on the Nile. The fourth day is well spent crossing to the Giza Plateau and experiencing the Pyramids and Sphinx at dawn before the crowds, then returning for dinner at a rooftop restaurant overlooking the city.",
    tags: ['Egyptian Museum', 'Islamic Cairo', 'Bazaars', 'Coptic History', 'Nile'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'giza-pyramids',
    name: 'Giza Pyramids',
    emoji: '🔺',
    colour: '#D4A017',
    airport: 'CAI',
    region: 'CAIRO & GIZA',
    brief:
      "The only surviving Wonder of the Ancient World and one of the most recognisable sights on Earth, sitting dramatically on the limestone plateau at the edge of the Western Desert. The Great Pyramid of Khufu, built around 2560 BCE, remained the tallest structure on Earth for nearly 4,000 years and entering its narrow internal passages is an experience that puts the scale of ancient ambition into visceral perspective. The enigmatic Great Sphinx crouches nearby, carved from a single limestone outcrop, while the Solar Boat Museum beside the pyramid shelters a fully intact 4,600-year-old cedar boat. Allow a half-day to explore the Giza Plateau properly and consider arriving at opening time for the best light and fewest tourists.",
    tags: ['Ancient Wonders', 'Archaeology', 'Sphinx', 'Iconic Views'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Cairo (30min by taxi)',
    mustVisit: true,
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    emoji: '🏛️',
    colour: '#2A6496',
    airport: 'CAI',
    region: 'CAIRO & GIZA',
    brief:
      "Egypt's Mediterranean port city and the ancient seat of learning, founded by Alexander the Great in 331 BCE and once home to the greatest library of the ancient world. The Bibliotheca Alexandrina, a stunning modern recreation of the ancient library, houses a remarkable museum and panoramic reading room overlooking the sea. The Catacombs of Kom el-Shoqafa, a three-level Roman necropolis fusing Egyptian and Greco-Roman funerary art, are genuinely haunting and largely crowd-free. Two days allows a morning at the catacombs and the Pompey's Pillar complex, an afternoon along the Corniche seafront, and a second day at the Greco-Roman Museum and the coastal Qaitbay Citadel.",
    tags: ['Mediterranean Coast', 'Catacombs', 'Modern Library', 'Seafront'],
    recommendedDays: [1, 2],
    accessNote: 'Accessible from Cairo (3hr by train)',
  },

  // ═══════════════════════════════════════════
  // UPPER EGYPT & NILE
  // ═══════════════════════════════════════════
  {
    id: 'luxor',
    name: 'Luxor',
    emoji: '⚱️',
    colour: '#B5451B',
    airport: 'LXR',
    region: 'UPPER EGYPT & NILE',
    brief:
      "The world's greatest open-air museum, standing on the ruins of ancient Thebes, the capital of Egypt at the height of its New Kingdom power. The East Bank alone fills a full day: the immense Karnak Temple complex, the world's largest ancient religious site with its forest of carved pillars, and the riverside Luxor Temple floodlit dramatically at night. The West Bank demands an equally dedicated day: the Valley of the Kings, where 63 pharaonic tombs including Tutankhamun's were carved into the limestone cliffs, the funerary Temple of Hatshepsut rising in three terraced colonnades, and the massive twin Colossi of Memnon. A third day adds Medinet Habu, the Valley of the Queens, and a sunrise hot-air balloon flight over the Theban necropolis.",
    tags: ['Valley of the Kings', 'Karnak Temple', 'Archaeology', 'Hot-Air Balloons'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'aswan',
    name: 'Aswan',
    emoji: '⛵',
    colour: '#7B3F00',
    airport: 'ASW',
    region: 'UPPER EGYPT & NILE',
    brief:
      "Egypt's most relaxed and visually striking city, where the Nile narrows between golden granite boulders and felucca sails drift past Nubian villages on the islands. Philae Temple, rescued from rising waters after the Aswan High Dam was built and reassembled on Agilkia Island, is one of Egypt's most beautifully positioned ancient sites and best visited at sunset. A full day fits the Unfinished Obelisk lying in its quarry, the colourful Nubian Museum tracing 5,000 years of Nubian culture, and a felucca sail around Elephantine Island. The second day is perfectly spent on a day trip to the magnificent Abu Simbel temples, only accessible by road or air from Aswan.",
    tags: ['Philae Temple', 'Felucca Sailing', 'Nubian Culture', 'Abu Simbel Access'],
    recommendedDays: [2, 3],
  },
  {
    id: 'abu-simbel',
    name: 'Abu Simbel',
    emoji: '🗿',
    colour: '#8B6914',
    airport: 'ASW',
    region: 'UPPER EGYPT & NILE',
    brief:
      "One of the most awe-inspiring ancient sites on Earth, carved entirely from a sandstone cliff by Ramesses II around 1264 BCE and relocated block by block to save it from Lake Nasser's rising waters in the 1960s. The Great Temple's four colossal seated statues of Ramesses II, each 20 metres tall, guard an interior lined with vivid battle reliefs and hieroglyphs. The smaller Temple of Nefertari next door is equally stunning, the only Egyptian temple built to honour a queen as a goddess in her own right. Most visitors make the trip as an early-morning day trip from Aswan, flying or driving through the desert before the heat builds.",
    tags: ['Ramesses II', 'UNESCO', 'Colossal Statues', 'Lake Nasser'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Aswan (30min by flight or 3hr by road)',
    mustVisit: true,
  },
  {
    id: 'nile-cruise',
    name: 'Nile Cruise',
    emoji: '🚢',
    colour: '#1A7A6E',
    airport: 'LXR',
    region: 'UPPER EGYPT & NILE',
    brief:
      "The classic way to travel through the heart of ancient Egypt, sailing between Luxor and Aswan on a traditional river cruise ship that docks beside the monuments. Most itineraries of three nights take in Karnak and Luxor temples, Edfu's well-preserved Ptolemaic Temple of Horus, the twin sandstone temples at Kom Ombo overlooking a crocodile pool, and Philae Temple in Aswan. Waking at sunrise to see the Nile's banks slide past, golden with desert light and dotted with villages and egrets, is one of travel's genuinely timeless experiences. A four-night cruise allows unhurried exploration at each stop and time to linger at the deck bar as the sun sets over the west bank.",
    tags: ['Nile River', 'Temple Hopping', 'Felucca', 'Sunset Cruising'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },

  // ═══════════════════════════════════════════
  // RED SEA COAST
  // ═══════════════════════════════════════════
  {
    id: 'hurghada',
    name: 'Hurghada',
    emoji: '🤿',
    colour: '#0077B6',
    airport: 'HRG',
    region: 'RED SEA COAST',
    brief:
      "Egypt's original Red Sea resort strip, rebuilt from a small fishing village into a sprawling beach destination with some of the world's most accessible coral reef diving. The reefs of Giftun Island, reachable by boat in under 30 minutes, host colourful schools of snapper, parrotfish, and reef sharks in water clear enough to see 20 metres down. Day one suits a liveaboard or guided dive day to the outer reef walls, while day two can be spent at leisure on the resort beach before an evening seafood dinner on the marina. Three to four days allows a glass-bottom boat excursion, a quad-bike safari into the Eastern Desert, and a day trip north to the quieter beaches of El Gouna.",
    tags: ['Diving', 'Snorkelling', 'Red Sea Reef', 'Beach Resorts'],
    recommendedDays: [3, 4],
  },
  {
    id: 'sharm-el-sheikh',
    name: 'Sharm el-Sheikh',
    emoji: '🐠',
    colour: '#0096C7',
    airport: 'SSH',
    region: 'RED SEA COAST',
    brief:
      "The Sinai Peninsula's premier dive and beach destination at the southern tip of the Sinai Mountains, where the Red Sea meets the Gulf of Aqaba. Ras Mohammed National Park, a 30-minute drive from town, has two of the best dive sites in the world: Shark Reef and Yolanda Reef, where steep walls drop into the blue and resident sharks cruise the current. The Thistlegorm wreck, a Second World War British supply ship sunk in 1941 and lying 32 metres down, is widely considered one of the top ten dive sites globally. Non-divers fill three to four days with Naama Bay's beach clubs, Bedouin jeep safaris into the Sinai interior, and a dawn camel trek to the summit of Mount Sinai.",
    tags: ['World-Class Diving', 'Ras Mohammed', 'Wreck Diving', 'Sinai Treks'],
    recommendedDays: [3, 4],
  },
  {
    id: 'dahab',
    name: 'Dahab',
    emoji: '🏄',
    colour: '#4A90D9',
    airport: 'SSH',
    region: 'RED SEA COAST',
    brief:
      "A laid-back backpacker diving town on the Gulf of Aqaba coast, famous for the Blue Hole: a 130-metre submarine sinkhole whose azure colour against the desert shore makes it one of the most photographed dive sites in the world. The town's casual open-air restaurants and dive shacks line a sandy promenade where it is entirely acceptable to spend an afternoon snorkelling off the shore, then eating grilled fish at a cushioned restaurant while camels wander past. PADI open-water certification courses are among the most affordable in the world here, making Dahab the Egyptian coast's best value option. Two to three days gives enough time for two dive days and a Bedouin day trip to the Coloured Canyon.",
    tags: ['Blue Hole Diving', 'Backpacker Vibe', 'Budget Diving Courses', 'Coloured Canyon'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Sharm el-Sheikh (SSH, 1.5hr by minibus)',
  },
  {
    id: 'marsa-alam',
    name: 'Marsa Alam',
    emoji: '🐢',
    colour: '#00808A',
    airport: 'RMF',
    region: 'RED SEA COAST',
    brief:
      "A quieter stretch of Red Sea coast well south of Hurghada that has become Egypt's top destination for encounters with dugongs, sea turtles, and oceanic manta rays in pristine, uncrowded conditions. Marsa Mubarak Bay is one of the most reliable spots on Earth to snorkel alongside wild dugongs grazing on sea grass, and the resident sea turtles at Marsa Abu Dabbab beach are so accustomed to swimmers that encounters at close range are almost guaranteed. Three days fits two dive or snorkel days on the outer reefs and a jeep safari to the ancient emerald mines at Wadi al-Gemal. The national park that covers this stretch of coast protects some of Africa's most biodiverse near-shore marine habitat.",
    tags: ['Dugongs', 'Sea Turtles', 'Pristine Reefs', 'Marine Park'],
    recommendedDays: [3, 3],
  },

  // ═══════════════════════════════════════════
  // WESTERN DESERT
  // ═══════════════════════════════════════════
  {
    id: 'siwa-oasis',
    name: 'Siwa Oasis',
    emoji: '🌴',
    colour: '#4B7C3D',
    airport: 'CAI',
    region: 'WESTERN DESERT',
    brief:
      "A remote oasis town near the Libyan border, almost entirely cut off from the rest of Egypt and governed by its own Berber culture and Siwi language. Alexander the Great made the difficult desert journey here in 331 BCE to consult the Oracle of Amun at the Temple of the Oracle, and the ancient mudbrick ruins of the oracle complex still stand on the rock of Aghurmi above date palm groves. The Great Sand Sea surrounding the oasis stretches uninterrupted for hundreds of kilometres, and a 4WD safari across its enormous dunes to bathe in the hot freshwater spring at Bir Wahid at sunset is unforgettable. Two to three days also allows time at the cool saltwater Cleopatra's Pool, the Roman-era tombs at Gebel el-Mawta, and olive oil tasting at local family farms.",
    tags: ['Desert Oasis', 'Berber Culture', 'Oracle of Amun', 'Sand Sea Safari'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Cairo (CAI, 9hr by bus or private transfer)',
  },
  {
    id: 'white-desert',
    name: 'White Desert',
    emoji: '🏜️',
    colour: '#E8E0D0',
    airport: 'CAI',
    region: 'WESTERN DESERT',
    brief:
      "One of the most surreal landscapes in Africa, where centuries of wind erosion have sculpted enormous formations of white chalk into mushroom shapes, inselbergs, and abstract towers rising from a flat cream-coloured plain. The effect at night, when the chalk glows silver under moonlight against a sky blazing with desert stars, is genuinely otherworldly and explains why photographers make the overnight trip from Cairo. A two-day itinerary typically includes a stop at the Black Desert's volcanic cones and the Crystal Mountain on the drive in, followed by an afternoon among the formations and a night camped under the stars at the oasis town of Farafra. The White Desert is best visited as part of an organised 4WD tour departing from Cairo.",
    tags: ['Chalk Formations', 'Desert Camping', 'Stargazing', 'Photography'],
    recommendedDays: [2, 2],
    accessNote: 'Accessible from Cairo (CAI, 6hr by 4WD via Bahariya Oasis)',
  },
];

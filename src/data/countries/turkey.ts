import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Turkey
 * 4. Consistently ranked in top Turkey destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Istanbul: gateway, Hagia Sophia, Grand Bazaar, Bosphorus (1,2,3,4,5) ✓
 * - Cappadocia: bucket-list hot-air balloons, cave hotels, unique landscape (1,3,4,5) ✓
 * - Pamukkale: UNESCO, unique travertine terraces, globally iconic (1,3,4,5) ✓
 * - Ephesus: UNESCO, one of the best-preserved Roman cities on Earth (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Antalya: great base but lacks singular bucket-list hook (fails 3)
 * - Bodrum: resort town, niche nightlife appeal (fails 1,3)
 * - Fethiye: beautiful coast but regional appeal (fails 1,2)
 * - Trabzon: culturally distinct but niche (fails 2,5)
 * - Mardin: outstanding but niche historical appeal (fails 2,5)
 * - Ankara: functional capital, limited traveller appeal (fails 3,5)
 * - Others: day-trip scale or specialist interest
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // ISTANBUL & MARMARA
  // ═══════════════════════════════════════════
  {
    id: 'istanbul',
    name: 'Istanbul',
    emoji: '🕌',
    colour: '#C0392B',
    airport: 'IST',
    region: 'ISTANBUL & MARMARA',
    brief:
      "The only city in the world straddling two continents, where 2,500 years of Byzantine, Ottoman, and modern history layer on top of each other in a magnificent, bewildering whole. Day one covers the Historic Peninsula: the cavernous Hagia Sophia, the Blue Mosque's six slender minarets and tiled interior, the Topkapi Palace treasury housing the Prophet's cloak and Spoonmaker's Diamond, and the subterranean Basilica Cistern. Day two belongs to the Grand Bazaar's 4,000 shops and the Egyptian Spice Bazaar, followed by an afternoon in the hip Karakoy and Cihangir neighbourhoods. Day three is best spent on the Bosphorus: a ferry cruise past yalis (Ottoman wooden mansions), stopping at Rumeli Fortress, and crossing to the Asian side for the Kadikoy market and sunset tea on the waterfront. Two more days open up Dolmabahce Palace, the Istanbul Modern museum, and the fishing villages on the Princes' Islands.",
    tags: ['Hagia Sophia', 'Grand Bazaar', 'Bosphorus', 'Ottoman History', 'Blue Mosque'],
    recommendedDays: [5, 7],
    mustVisit: true,
  },
  {
    id: 'gallipoli',
    name: 'Gallipoli',
    emoji: '🕊️',
    colour: '#6B7B3A',
    airport: 'IST',
    region: 'ISTANBUL & MARMARA',
    brief:
      "The Gallipoli Peninsula, site of the brutal 1915 First World War campaign that shaped the national identities of Australia, New Zealand, and modern Turkey, is one of the most emotionally powerful sites in the world. The ANZAC Cove memorial, Lone Pine Cemetery, Chunuk Bair, and the Turkish memorials at Cape Helles are carefully maintained and deeply moving, the more so for the density of graves on a very small stretch of ground. Kemal Ataturk's famous tribute to the fallen Allied soldiers -- carved on a monument at ANZAC Cove -- is among the most gracious acts of post-war reconciliation anywhere. A single long day from Istanbul covers the main ANZAC and Turkish sites with a guided tour; an overnight stay on the peninsula allows a quieter, more contemplative visit.",
    tags: ['WWI History', 'ANZAC Heritage', 'Memorials', 'Guided Tours'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Istanbul (3.5hr by bus or ferry via Canakkale)',
  },

  // ═══════════════════════════════════════════
  // CAPPADOCIA & CENTRAL ANATOLIA
  // ═══════════════════════════════════════════
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    emoji: '🎈',
    colour: '#E07B39',
    airport: 'ASR',
    region: 'CAPPADOCIA & CENTRAL ANATOLIA',
    brief:
      "One of the most otherworldly landscapes on Earth, where millions of years of volcanic eruption and erosion have sculpted the Anatolian plateau into a forest of fairy chimneys, cave churches, and honeycombed cliff faces. Sunrise hot-air balloon flights over the Rose Valley and the Goreme basin, with dozens of coloured balloons drifting against the orange-lit tufa formations, are arguably the single most beautiful morning in Turkish travel. Spend a day underground at Derinkuyu or Kaymakli, two of the region's 36 multi-storey subterranean cities that once sheltered thousands of early Christians from Arab raids. A third day suits a hike through the Ihlara Valley's canyon of Byzantine cave chapels frescoed in vivid colours, followed by a wine tasting at one of Cappadocia's volcanic-soil boutique wineries.",
    tags: ['Hot-Air Balloons', 'Cave Hotels', 'Underground Cities', 'Fairy Chimneys', 'Hiking'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'ankara',
    name: 'Ankara',
    emoji: '🏛️',
    colour: '#8E44AD',
    airport: 'ESB',
    region: 'CAPPADOCIA & CENTRAL ANATOLIA',
    brief:
      "Turkey's functional capital city earns a day or two for the Ataturk Mausoleum and the exceptional Museum of Anatolian Civilisations. Anitkabir, the vast hilltop tomb of Mustafa Kemal Ataturk, is a solemn and architecturally striking monument to the founder of modern Turkey that carries genuine emotional weight for visitors who understand his significance. The Museum of Anatolian Civilisations, housed in a restored 15th-century bedesten, holds the world's finest collection of Hittite artefacts and provides essential context for visiting the ancient sites of Central Anatolia. The old Citadel district above the city preserves an atmospheric cluster of Ottoman streets, craft workshops, and a fine view over the capital.",
    tags: ['Ataturk Mausoleum', 'Anatolian Museum', 'Hittite History', 'Old Citadel'],
    recommendedDays: [1, 2],
  },
  {
    id: 'mount-nemrut',
    name: 'Mount Nemrut',
    emoji: '⛰️',
    colour: '#6C3483',
    airport: 'MQM',
    region: 'CAPPADOCIA & CENTRAL ANATOLIA',
    brief:
      "A UNESCO World Heritage summit in southeastern Turkey where the mad king Antiochus I of Commagene erected colossal stone heads of gods and himself around a royal tomb mound at 2,134 metres elevation. The scattered heads -- serene faces of Apollo, Zeus, and Antiochus looking out over the Euphrates valley -- are most dramatic at sunrise and sunset when the light rakes across the weathered limestone. The two-day trip from Adiyaman typically includes the afternoon drive up to the eastern terrace for sunset, a night at a simple guesthouse near the summit, and a pre-dawn wake-up for the sunrise ceremony watched by a small international crowd. The remote Euphrates valley below hides further Commagene-era bridges and the submerged ruins of the ancient city of Samosata under Ataturk Dam.",
    tags: ['UNESCO', 'Ancient Statues', 'Sunrise Trek', 'Commagene History'],
    recommendedDays: [2, 2],
    accessNote: 'Accessible from Adiyaman (MQM, 2hr by road)',
  },

  // ═══════════════════════════════════════════
  // AEGEAN & MEDITERRANEAN COAST
  // ═══════════════════════════════════════════
  {
    id: 'izmir',
    name: 'Izmir',
    emoji: '🌊',
    colour: '#1A6B9A',
    airport: 'ADB',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "Turkey's third-largest city and the Aegean coast's main hub, a cosmopolitan and liberal port city with a lively bazaar quarter and a long waterfront kordon lined with cafes and seafood restaurants. The Kemeralti Bazaar is a more authentic and relaxed alternative to the Grand Bazaar in Istanbul, where goldsmiths, spice merchants, and booksellers occupy centuries-old hans and caravanserais. Izmir is primarily used as a base for day trips to Ephesus and Pergamon, but the city's own Agora, the Roman marketplace beneath the Kadifekale hilltop fortress, warrants a morning stop. The evening oyster and raki culture along the Kordon is a quintessentially Aegean experience.",
    tags: ['Aegean Coast', 'Bazaar Quarter', 'Seafood', 'Day Trip Base'],
    recommendedDays: [1, 2],
  },
  {
    id: 'ephesus',
    name: 'Ephesus',
    emoji: '🏺',
    colour: '#B7950B',
    airport: 'ADB',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "The best-preserved Roman city in the Eastern Mediterranean and one of the great archaeological sites of the world, where marble-paved streets lead past intact temples, latrines, fountains, and the Library of Celsus in extraordinary condition. The Library of Celsus facade, two storeys of carved columns framing statues of the four virtues, is one of archaeology's most photogenic compositions and was the ancient world's third-largest library. The Great Theatre, carved into the hillside and seating 25,000, still hosts concerts in summer. One full day covers the main archaeological site thoroughly, including the Terrace Houses whose mosaic floors and frescoed walls are protected under a climate-controlled canopy at extra charge but are absolutely worth it.",
    tags: ['Roman Ruins', 'Library of Celsus', 'Ancient Theatre', 'Archaeology'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Izmir (ADB, 1hr) or Kusadasi (30min)',
    mustVisit: true,
  },
  {
    id: 'pergamon',
    name: 'Pergamon',
    emoji: '🗡️',
    colour: '#7D6608',
    airport: 'ADB',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "The dramatic acropolis of ancient Pergamon rises 300 metres above the modern town of Bergama, one of the great Hellenistic cities that rivalled Alexandria in wealth, culture, and the quality of its library. The acropolis theatre, carved into the steepest hillside of any ancient theatre in the world at an almost vertical 80-degree pitch, offers breathtaking views over the Bakircay valley. The Asclepion medical sanctuary at the base of the hill was the ancient world's foremost medical centre, where patients underwent dream therapy, hydrotherapy, and exercise programmes in a remarkable complex of temples and underground passages. A cable car now connects the town to the upper acropolis, making Pergamon a comfortable day trip from Izmir.",
    tags: ['Hellenistic Acropolis', 'Ancient Theatre', 'Asclepion', 'Greek History'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Izmir (ADB, 1.5hr by bus)',
  },
  {
    id: 'bodrum',
    name: 'Bodrum',
    emoji: '⚓',
    colour: '#2874A6',
    airport: 'BJV',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "The Aegean coast's most stylish resort town, built around a crusader castle and a whitewashed hillside that has attracted Turkish artists and writers since the 1950s. The Bodrum Castle, built by the Knights of St John using stones from the ancient Mausoleum at Halicarnassus, houses the Museum of Underwater Archaeology with its remarkable Bronze Age shipwreck collections. Bodrum Peninsula's sheltered coves and turquoise bays are best explored by gulet, the traditional wooden sailing boat, on a Blue Voyage cruise stopping at Gokova Bay and the Greek island of Kos. Evenings in Bodrum revolve around the Bodrum Bar Street, one of Turkey's most celebrated nightlife strips, stretching along the waterfront below the castle.",
    tags: ['Crusader Castle', 'Gulet Sailing', 'Aegean Nightlife', 'Underwater Museum'],
    recommendedDays: [2, 3],
  },
  {
    id: 'pamukkale',
    name: 'Pamukkale',
    emoji: '🏊',
    colour: '#AED6F1',
    airport: 'AYT',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "A UNESCO World Heritage Site where millennia of calcium-rich thermal spring water cascading down a white hillside have built up a series of frozen-looking terraced pools of brilliant white travertine. Bathing in the warm mineral pools against the backdrop of the cotton-castle terraces, with the Anatolian plateau stretching to the horizon, is one of Turkey's most otherworldly experiences. At the top of the terraces, the ancient Greco-Roman city of Hierapolis contains a remarkably intact necropolis, a vast theatre, and the Antique Pool where you can swim among submerged Roman columns. A single full day comfortably covers both the travertine terraces and the Hierapolis ruins; an overnight stay allows a peaceful sunrise walk on the terraces before the tour groups arrive.",
    tags: ['Travertine Terraces', 'Thermal Pools', 'Hierapolis Ruins', 'UNESCO'],
    recommendedDays: [1, 2],
    mustVisit: true,
    accessNote: 'Accessible from Antalya (AYT, 3hr) or Denizli (DEN, 20min)',
  },
  {
    id: 'antalya',
    name: 'Antalya',
    emoji: '🌅',
    colour: '#E74C3C',
    airport: 'AYT',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "The Turkish Riviera's main gateway city, combining a beautifully preserved Roman and Ottoman old town with easy access to some of the Mediterranean coast's best beaches and waterfalls. Kaleici, the walled old city, is a labyrinth of narrow cobbled lanes flanked by Ottoman wooden houses, Roman walls, and the Hadrian's Gate triumphal arch built to honour the emperor's visit in 130 CE. Duden and Kursunlu waterfalls plunge directly into the Mediterranean from coastal cliffs and are a short drive from the city. Three to four days using Antalya as a base allows day trips west to the ancient Lycian ruins at Termessos, north to the remarkable rock tombs at Myra, and east along the sandy Konyaalti Beach to the Roman theatre at Aspendos.",
    tags: ['Kaleici Old Town', 'Mediterranean Coast', 'Waterfalls', 'Roman Ruins'],
    recommendedDays: [3, 4],
  },
  {
    id: 'fethiye',
    name: 'Fethiye',
    emoji: '🦋',
    colour: '#17A589',
    airport: 'AYT',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "A pine-forested harbour town that serves as the base for exploring one of the Mediterranean's most celebrated stretches of coastline, from the turquoise lagoon of Oludeniz to the ancient Lycian rock tombs carved into the cliffs above town. Oludeniz's Blue Lagoon, a calm turquoise bay sheltered by a sandy spit with the Babadag Mountain rising behind, is consistently rated among the most beautiful beaches in the world and is the launch site for paragliding flights over the coast. The Lycian Way, one of the world's great long-distance hiking trails, begins near Fethiye and can be sampled in day sections past ancient ruins and coastal cliffs. A third day suits a boat tour along the coast to Butterfly Valley, Gemiler Island, and the sunken ruins of the ancient city of Kaya Koy.",
    tags: ['Oludeniz', 'Blue Lagoon', 'Paragliding', 'Lycian Way Hiking'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Antalya (AYT, 3hr by bus)',
  },
  {
    id: 'kas',
    name: 'Kas',
    emoji: '🏝️',
    colour: '#148F77',
    airport: 'AYT',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "A small, car-free harbour town tucked between mountains and the Mediterranean, dotted with Lycian rock tombs and one of the coast's most relaxed and sophisticated atmospheres. Kas is the base for sea kayaking over the sunken ruins of the ancient city of Kekova, where Byzantine archways and building foundations lie in two to three metres of clear turquoise water, visible from the surface. The Antiphellos amphitheatre above town, carved from the hillside with a view over the Greek island of Meis just four kilometres offshore, is one of the most atmospherically positioned ancient theatres in Turkey. Two days allows a morning kayak to Kekova, an afternoon at Kaputas Beach -- a tiny strip of fine sand at the base of a dramatic gorge -- and a boat trip to the Blue Cave.",
    tags: ['Kekova Sunken City', 'Sea Kayaking', 'Lycian Ruins', 'Kaputas Beach'],
    recommendedDays: [2, 2],
    accessNote: 'Accessible from Antalya (AYT, 3.5hr by bus)',
  },
  {
    id: 'olympos',
    name: 'Olympos',
    emoji: '🔥',
    colour: '#935116',
    airport: 'AYT',
    region: 'AEGEAN & MEDITERRANEAN COAST',
    brief:
      "A romantically overgrown ancient Lycian city partially buried in a riverbed that opens onto a beautiful pebble beach, best known for the Chimaera eternal flames: natural methane vents that have burned continuously from a rocky hillside above the site since antiquity, inspiring the Greek myth of the fire-breathing monster. Olympos has a well-established backpacker scene built around treehouse bungalows in the fig and laurel forest, making it one of the most atmospheric and affordable places to base yourself on the Turkish coast. A morning exploring the ruins among the tangled roots and Byzantine archways gives way to an afternoon on the beach, and the Chimaera flames are visited at night when they burn most visibly. Two days comfortably fits the ruins, beach, evening Chimaera visit, and a hike to the summit ridge of Mount Olympos.",
    tags: ['Eternal Flames', 'Ancient Ruins', 'Treehouse Camps', 'Backpacker Coast'],
    recommendedDays: [2, 2],
    accessNote: 'Accessible from Antalya (AYT, 1.5hr by minibus)',
  },

  // ═══════════════════════════════════════════
  // EASTERN TURKEY
  // ═══════════════════════════════════════════
  {
    id: 'trabzon-sumela',
    name: 'Trabzon and Sumela',
    emoji: '⛪',
    colour: '#1E8449',
    airport: 'TZX',
    region: 'EASTERN TURKEY',
    brief:
      "A historic Black Sea port city providing access to the spectacular Sumela Monastery, a Byzantine rock-cut monastery clinging to a vertical cliff face 300 metres above a forested valley in the Pontic Mountains. Founded in the 4th century CE and continuously occupied until 1923, Sumela's painted rock frescoes of biblical scenes remain vivid against the dark stone despite centuries of mountain weather. Trabzon itself has a charming old quarter around the Ataturk Pavilion and the Hagia Sophia of Trabzon, a 13th-century Byzantine church with well-preserved frescoes. Two days comfortably covers Trabzon's own sights plus the half-day return trip to Sumela and a drive through the mountain tea estates and hazelnut orchards of the surrounding Pontic highlands.",
    tags: ['Cliff Monastery', 'Byzantine Frescoes', 'Black Sea Coast', 'Pontic Mountains'],
    recommendedDays: [2, 2],
  },
  {
    id: 'mardin',
    name: 'Mardin',
    emoji: '🪨',
    colour: '#CA6F1E',
    airport: 'MQM',
    region: 'EASTERN TURKEY',
    brief:
      "One of Turkey's most remarkable historic cities, a honey-coloured stone town cascading down a steep ridge above the Mesopotamian plain, its skyline of Syriac Christian churches and Artuqid minarets rising above a labyrinth of vaulted lanes and carved doorways. The Grand Mosque of Mardin and the Deyrulzafaran Monastery, a 5th-century Syriac Orthodox complex still housing an active monastic community and a Syrian patriarch's throne, can be visited on the same day. From the citadel at the top of the ridge, the Mesopotamian plain -- the biblical cradle of civilisation -- stretches flat to the Syrian and Iraqi horizons. Two days also allows a day trip to the ancient bee-hive villages of Harran and the fortified city of Diyarbakir, whose black basalt walls are a UNESCO World Heritage Site.",
    tags: ['Syriac Heritage', 'Artuqid Architecture', 'Mesopotamian Views', 'Stone Town'],
    recommendedDays: [2, 2],
  },
];

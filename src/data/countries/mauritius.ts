import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Mauritius
 * 4. Consistently ranked in top Mauritius destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Grand Baie: north coast hub, nightlife, catamaran trips, broadest tourist appeal (2,4,5) ✓
 * - Flic-en-Flac: longest beach, iconic sunset coast, dolphin swimming (3,4,5) ✓
 * - Chamarel: seven coloured earth is Mauritius's most singular natural wonder (1,3,4,5) ✓
 * - Le Morne: UNESCO Cultural Landscape, kitesurfing mecca, luxury resort strip (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Port Louis: practical capital, worth a day but lacks bucket-list draw (fails 3,5)
 * - Ile aux Cerfs: stunning lagoon but day-trip only scale (fails 2,5)
 * - Trou aux Biches: beautiful but similar to other northern beaches (fails 3)
 * - Black River Gorges: excellent hiking but niche appeal (fails 5)
 * - Mahebourg: historic and charming but limited standalone depth (fails 3,5)
 * - Belle Mare: luxury beach but one of several comparable east coast strips (fails 3)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // NORTH MAURITIUS
  // ═══════════════════════════════════════════
  {
    id: 'port-louis',
    name: 'Port Louis',
    emoji: '🏙️',
    colour: '#1A5276',
    airport: 'MRU',
    region: 'NORTH MAURITIUS',
    brief:
      "The capital and commercial heart of Mauritius rewards a full day of colourful, chaotic exploration. Start at the Central Market, a two-storey labyrinth of spice stalls, street food vendors, and handicraft sellers that captures the island\'s Creole-Indian-Chinese cultural fusion perfectly. The Caudan Waterfront complex sits right on the harbour and houses boutique shops, a casino, and excellent seafood restaurants with views over the Indian Ocean. Spend the afternoon at the Blue Penny Museum, home to Mauritius\'s famous 1847 Post Office stamps and colonial art collections. The city is typically combined with a day of island orientation rather than treated as a multi-night base.",
    tags: ['Markets', 'Harbour', 'History', 'Street Food'],
    recommendedDays: [1, 2],
  },
  {
    id: 'grand-baie',
    name: 'Grand Baie',
    emoji: '⛵',
    colour: '#1F8ECD',
    airport: 'MRU',
    region: 'NORTH MAURITIUS',
    brief:
      "The undisputed social and tourist hub of northern Mauritius, built around a sweeping natural bay fringed with restaurants, bars, and dive shops. Catamaran day trips departing from the bay visit the northern offshore islands of Flat Island and Gabriel, where snorkelling over coral reefs in turquoise shallows is exceptional. The coastal road through Grand Baie and into Pereybere is lined with casual beach shacks serving grilled fish and rum cocktails at sunset, making evenings here among the liveliest on the island. Book a full-day catamaran cruise for the first day, then spend the remaining time island-hopping by speedboat, exploring the street food of Supermarche roundabout, and bar-hopping along the Royal Road.",
    tags: ['Catamaran Trips', 'Snorkelling', 'Nightlife', 'Water Sports'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
  {
    id: 'trou-aux-biches',
    name: 'Trou aux Biches',
    emoji: '🌊',
    colour: '#48C9B0',
    airport: 'MRU',
    region: 'NORTH MAURITIUS',
    brief:
      "One of Mauritius\'s most consistently praised public beaches, a long arc of powdery white sand with calm, shallow turquoise water protected by a coral reef that makes it ideal for families and beginner snorkellers. The lagoon here is exceptionally gentle, and the reef just offshore hosts parrotfish, moray eels, and sea turtles that are visible with basic snorkelling gear. The beach itself is shaded by casuarina trees and dotted with local fishermen\'s pirogues, giving it a more authentic feel than the fully manicured resort beaches nearby. Two or three days here combines beach time with day trips to Grand Baie and the northern offshore islands.",
    tags: ['Snorkelling', 'Family Beach', 'Calm Lagoon', 'Reef'],
    recommendedDays: [2, 3],
  },

  // ═══════════════════════════════════════════
  // SOUTH MAURITIUS
  // ═══════════════════════════════════════════
  {
    id: 'chamarel',
    name: 'Chamarel',
    emoji: '🌈',
    colour: '#E67E22',
    airport: 'MRU',
    region: 'SOUTH MAURITIUS',
    brief:
      "A remarkable highland village in the Black River district that packs three of Mauritius\'s most extraordinary sights into a single day trip. The Seven Coloured Earths are a geological curiosity found nowhere else on the planet: rolling sand dunes of different-coloured volcanic soils that have never mixed despite rain and wind over thousands of years, glowing in shades from rust-red to violet. The Chamarel Waterfall plunges 100 metres into a forested gorge a short walk away, best seen after heavy rain when the volume is dramatic. Round out the day at the Rhumerie de Chamarel, an artisan rum distillery set on a coffee and vanilla estate, where guided tours end with generous tastings of aged rums infused with local spices.",
    tags: ['Seven Coloured Earth', 'Waterfall', 'Rum Distillery', 'Highlands'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    mustVisit: true,
    accessNote: 'Day trip from Flic-en-Flac or Le Morne (30-45 min by car)',
  },
  {
    id: 'black-river-gorges',
    name: 'Black River Gorges',
    emoji: '🌿',
    colour: '#27AE60',
    airport: 'MRU',
    region: 'SOUTH MAURITIUS',
    brief:
      "Mauritius\'s only national park protects the last significant tract of native subtropical forest on the island, covering 6,574 hectares of the central plateau\'s rugged interior. The park is home to endemic species found nowhere else on Earth, including the Mauritius kestrel, the pink pigeon, and the echo parakeet, all pulled back from the brink of extinction through intensive conservation programs. Several well-marked trails of varying difficulty wind through the forest, with the Black River Peak trail offering the island\'s most rewarding panoramic views over the southwest coast. A single full day is plenty to hike one major trail, spot endemic birds, and picnic beside a waterfall.",
    tags: ['Hiking', 'Birdwatching', 'Endemic Wildlife', 'Waterfalls'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Flic-en-Flac or Le Morne (20-40 min by car)',
  },
  {
    id: 'le-morne',
    name: 'Le Morne',
    emoji: '🏄',
    colour: '#8E44AD',
    airport: 'MRU',
    region: 'SOUTH MAURITIUS',
    brief:
      "A UNESCO Cultural Landscape dominated by the dramatic basalt monolith of Le Morne Brabant, a mountain that served as a refuge for escaped enslaved people in the 18th century and holds profound historical significance for Mauritius. The peninsula is now the island\'s kitesurfing and windsurfing capital: consistent trade winds, a shallow turquoise lagoon, and a 20-kilometre sandbar extending north create near-perfect conditions, and several internationally acclaimed kite schools operate on the beach. Luxury five-star resorts line the western shore and offer world-class spa treatments with views of the mountain at golden hour. Two nights is the minimum to catch a lesson or a session on the water and still hike the mountain trail to the summit cave.",
    tags: ['UNESCO', 'Kitesurfing', 'Luxury Resorts', 'Mountain Hike'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },

  // ═══════════════════════════════════════════
  // EAST MAURITIUS
  // ═══════════════════════════════════════════
  {
    id: 'ile-aux-cerfs',
    name: 'Ile aux Cerfs',
    emoji: '🏝️',
    colour: '#F0E68C',
    airport: 'MRU',
    region: 'EAST MAURITIUS',
    brief:
      "A privately managed island just off the east coast of Mauritius, reached by a five-minute ferry from Trou d\'Eau Douce, and considered by many visitors to offer the most picture-perfect lagoon on the island. The surrounding shallow waters are an extraordinary shade of turquoise, protected by a massive offshore reef that keeps conditions calm enough for parasailing, water-skiing, kayaking, and glass-bottomed boat rides. Beach chairs, restaurants, and water sports hire are all available on the island itself. A single day trip is the standard visit: arrive early by ferry before the day-tripper crowds peak, then spend the morning snorkelling before a seafood lunch on the beach.",
    tags: ['Lagoon', 'Water Sports', 'Snorkelling', 'Island Day Trip'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: '5-min ferry from Trou d\'Eau Douce on the east coast',
  },
  {
    id: 'mahebourg',
    name: 'Mahebourg',
    emoji: '⚓',
    colour: '#2C3E50',
    airport: 'MRU',
    region: 'EAST MAURITIUS',
    brief:
      "A charming, unhurried coastal town on the southeast shore that offers the richest concentration of Mauritian colonial history on the island. The National History Museum is housed in a 1768 French colonial mansion and tells the story of the Battle of Grand Port, the only Napoleonic naval victory commemorated on the Arc de Triomphe in Paris. Blue Bay Marine Park, a short drive south, is Mauritius\'s premier protected snorkelling site: a shallow lagoon over a UNESCO-listed coral reef system home to 38 species of coral and over 70 species of fish. One to two days covers the museum, the Monday market by the waterfront, and a snorkelling session at Blue Bay.",
    tags: ['History', 'Blue Bay Snorkelling', 'Colonial Architecture', 'Markets'],
    recommendedDays: [1, 2],
  },
  {
    id: 'belle-mare',
    name: 'Belle Mare',
    emoji: '🌴',
    colour: '#F4D03F',
    airport: 'MRU',
    region: 'EAST MAURITIUS',
    brief:
      "A long, undeveloped stretch of brilliant white sand on the east coast, consistently rated among the finest beaches in the Indian Ocean and home to some of the island\'s most prestigious luxury resorts. The beach is extraordinarily wide at low tide, shaded by casuarina pines, and faces a deep-blue lagoon that is calmer and clearer than many areas on the west coast. Several five-star properties along this strip operate world-class spas, and a round of golf at the Constance Belle Mare Plage course amid tropical gardens is a standout experience. Two to three days here is ideal for those seeking a more secluded, resort-style experience away from the more commercialised northern coast.",
    tags: ['White Sand Beach', 'Luxury Resorts', 'Golf', 'Spa'],
    recommendedDays: [2, 3],
  },

  // ═══════════════════════════════════════════
  // WEST MAURITIUS
  // ═══════════════════════════════════════════
  {
    id: 'flic-en-flac',
    name: 'Flic-en-Flac',
    emoji: '🐬',
    colour: '#F1948A',
    airport: 'MRU',
    region: 'WEST MAURITIUS',
    brief:
      "Home to Mauritius\'s longest public beach and one of the island\'s most beloved sunset strips, Flic-en-Flac faces west across the Indian Ocean and turns gold and rose every evening in a way that makes it the most atmospheric place on the island to end a day. The beach itself stretches for six kilometres of ivory sand and is calm enough for swimming almost year-round, thanks to an offshore reef. The real drawcard is the resident pod of spinner dolphins that live in the bay: sunrise boat trips to swim alongside them in open water are a genuine bucket-list encounter offered by several local operators. Three to four days here allows the dolphin swim, a day trip to Chamarel, snorkelling dives on the Rempart Snake Island reef, and long sundowner evenings at beachfront restaurants serving grilled octopus and rum.",
    tags: ['Dolphin Swimming', 'Sunset Beach', 'Snorkelling', 'Reef Diving'],
    recommendedDays: [3, 4],
    mustVisit: true,
  },
];

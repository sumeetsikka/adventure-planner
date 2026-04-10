import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in the Maldives
 * 4. Consistently ranked in top Maldives destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - North Male Atoll Resorts: gateway zone, luxury overwater villas (2,3,4,5) ✓
 * - Ari Atoll: whale shark diving, manta rays, world-class reefs (3,4,5) ✓
 * - Baa Atoll: UNESCO Biosphere Reserve, Hanifaru Bay manta aggregation (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Male: capital, practical stop but limited traveller appeal (fails 3,5)
 * - South Male Atoll: excellent but overshadowed by North Male for first-timers (fails 4)
 * - Maafushi: budget niche, appeals to specific traveller type (fails 3,5)
 * - Addu Atoll: remote, WWII niche (fails 2,5)
 * - Lhaviyani Atoll: pristine but lesser-known (fails 2,4)
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // NORTH MALE ATOLL
  // ═══════════════════════════════════════════
  {
    id: 'male',
    name: 'Male',
    emoji: '🏙️',
    colour: '#1A6B5E',
    airport: 'MLE',
    region: 'NORTH MALE ATOLL',
    brief:
      "The Maldives' compact and densely packed capital city, one of the most populous urban islands in the world, is typically just a transit stop but rewards a few hours of walking before guests transfer to their resort. The colourful waterfront fish market, open from before dawn, is a vivid snapshot of Maldivian daily life with tuna landed directly from wooden dhoni fishing boats onto ice-filled slabs. The Friday Mosque, built in 1658 from coral stone with finely carved wooden interiors, is the island's most beautiful building. Most visitors spend no more than a single night in Male, using the domestic terminal or speedboat jetty to reach their resort atoll.",
    tags: ['Capital City', 'Fish Market', 'Coral Mosque', 'Transit Hub'],
    recommendedDays: [1, 1],
  },
  {
    id: 'north-male-atoll',
    name: 'North Male Atoll Resorts',
    emoji: '🏝️',
    colour: '#0E86D4',
    airport: 'MLE',
    region: 'NORTH MALE ATOLL',
    brief:
      "The Maldives' most accessible and most famous resort zone, a short speedboat or seaplane ride from Male airport and home to some of the world's most celebrated overwater villa resorts perched above a lagoon of liquid turquoise. Waking in an overwater bungalow with a glass floor panel looking into the coral garden below, then descending directly from your deck into the warm Indian Ocean, is as close to paradise as the travel industry has yet manufactured. The house reef systems off North Male Atoll resorts are among the most intact in the Maldives, with excellent snorkelling over coral bommies alive with hawksbill turtles and reef sharks just metres from the jetty. Four to five days allows diving the famous sites at Banana Reef and HP Reef, a dolphin-watching sunset cruise, and genuine decompression.",
    tags: ['Overwater Villas', 'House Reef Snorkelling', 'Luxury Resorts', 'Dolphin Cruises'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'maafushi',
    name: 'Maafushi Island',
    emoji: '🏄',
    colour: '#2E86C1',
    airport: 'MLE',
    region: 'NORTH MALE ATOLL',
    brief:
      "The Maldives' most well-developed local island destination and the best option for budget-conscious travellers who want to experience the archipelago without the eye-watering resort price tag. Maafushi's guesthouses have transformed what was a quiet fishing island into a relaxed beach town with PADI dive centres, surf lessons, snorkel excursions, and sunset dolphin trips all available at a fraction of resort costs. The bikini beach at the island's eastern tip is designated for tourists, while the rest of the island follows local customs and provides an authentic look at Maldivian village life. Two to three days fits multiple snorkel or dive day trips to nearby reefs and sandbanks, along with the slower pleasures of fresh tuna curry at a local cafe.",
    tags: ['Budget Travel', 'Guest Houses', 'Local Island Life', 'Reef Day Trips'],
    recommendedDays: [2, 3],
    accessNote: 'Accessible from Male (MLE, 1hr by speedboat)',
  },

  // ═══════════════════════════════════════════
  // SOUTH MALE & ARI ATOLL
  // ═══════════════════════════════════════════
  {
    id: 'south-male-atoll',
    name: 'South Male Atoll',
    emoji: '🦈',
    colour: '#1565C0',
    airport: 'MLE',
    region: 'SOUTH MALE & ARI ATOLL',
    brief:
      "South Male Atoll sits immediately south of the capital and shares many of the same qualities as the North Atoll while offering some of the Maldives' best surf breaks at Guraidhoo and Kandooma, making it an ideal destination for the growing number of surf-and-dive travellers. The outer reef channels consistently see grey reef sharks and white-tip reef sharks patrolling the walls, while the deeper passes yield occasional thresher sharks and hammerheads during seasonal aggregations. Resorts in the South Atoll tend to be slightly lower-key and better value than their North Atoll equivalents, attracting guests who prioritise diving and surfing over pure luxury. Three to four days suits a diving focus with time for a snorkel safari, a cultural excursion to the inhabited islands, and sunset fishing aboard a traditional dhoni.",
    tags: ['Reef Sharks', 'Surf Breaks', 'Diving', 'Traditional Fishing'],
    recommendedDays: [3, 4],
  },
  {
    id: 'ari-atoll',
    name: 'Ari Atoll',
    emoji: '🦭',
    colour: '#0D47A1',
    airport: 'MLE',
    region: 'SOUTH MALE & ARI ATOLL',
    brief:
      "The Maldives' premier diving atoll and one of the best places in the world to reliably encounter whale sharks, the ocean's largest fish, which congregate year-round in the warm waters around the southern half of the atoll. South Ari Marine Protected Area was established specifically to protect the whale shark population and snorkel encounters with these gentle five-to-ten-metre filter feeders in the open ocean are the defining experience of any Ari Atoll visit. The atoll is also one of the most consistent locations in the Maldives for oceanic manta ray encounters, particularly at the cleaning stations around Kudarah and Maagaa. Four to five days allows multiple whale shark excursions, manta encounters, wall dives on the outer reef, and relaxed afternoons on the house reef of whichever resort you choose.",
    tags: ['Whale Shark Swimming', 'Manta Rays', 'Marine Reserve', 'World-Class Diving'],
    recommendedDays: [4, 5],
    mustVisit: true,
    accessNote: 'Accessible from Male (MLE, 25min by seaplane or 2.5hr by speedboat)',
  },

  // ═══════════════════════════════════════════
  // OUTER ATOLLS
  // ═══════════════════════════════════════════
  {
    id: 'baa-atoll',
    name: 'Baa Atoll',
    emoji: '🦟',
    colour: '#006064',
    airport: 'MLE',
    region: 'OUTER ATOLLS',
    brief:
      "A UNESCO Biosphere Reserve and the site of Hanifaru Bay, the most spectacular manta ray aggregation on Earth, where hundreds of oceanic manta rays gather between June and November to feed on plankton-rich currents in a shallow natural bowl barely 300 metres across. During peak feeding events, mantas stack in spiralling feeding tornados, barrel-rolling and looping through the water column so close to snorkellers that their five-metre wingspans fill the entire field of vision. The bay is strictly managed with limited entry numbers and a snorkel-only rule, which preserves the experience but requires advance booking well ahead of the feeding season. Three to four days in Baa Atoll also gives time to explore the coral gardens of the UNESCO zone, visit the traditional boat-building village of Eydhafushi, and drift dive the pristine outer reef.",
    tags: ['Manta Ray Aggregation', 'UNESCO Biosphere', 'Hanifaru Bay', 'Pristine Reefs'],
    recommendedDays: [3, 4],
    mustVisit: true,
    accessNote: 'Accessible from Male (MLE, 30min by seaplane)',
  },
  {
    id: 'lhaviyani-atoll',
    name: 'Lhaviyani Atoll',
    emoji: '🐡',
    colour: '#00695C',
    airport: 'MLE',
    region: 'OUTER ATOLLS',
    brief:
      "One of the Maldives' least-visited northern atolls, where the reduced tourist footprint has left the coral ecosystems in exceptional condition and the dive sites far less crowded than in the central atolls. Fushivaru Thila and Kuredu Express are among the Maldives' top drift dives, with strong currents that funnel schools of barracuda, Napoleon wrasse, and reef sharks past overhangs draped in black coral and sea fans. Above water, the atoll's islands offer wide stretches of untouched sandbank accessible by short boat trip, perfect for a private picnic on a sandbank that appears and disappears with the tide. Three to four days works well here for dedicated divers seeking pristine conditions, and the seaplane journey itself provides a spectacular aerial view of the atoll's ring structure.",
    tags: ['Pristine Reefs', 'Drift Diving', 'Uncrowded', 'Sandbank Picnics'],
    recommendedDays: [3, 4],
    accessNote: 'Accessible from Male (MLE, 40min by seaplane)',
  },
  {
    id: 'addu-atoll',
    name: 'Addu Atoll',
    emoji: '🪸',
    colour: '#004D40',
    airport: 'GAN',
    region: 'OUTER ATOLLS',
    brief:
      "The Maldives' southernmost atoll, just 35 kilometres from the equator, with its own distinct character shaped by its history as a British Royal Air Force base from the Second World War until 1976 and its geographic isolation from the rest of the country. The British military legacy is visible in the overgrown runways, gun emplacements, and the remarkable British Loyalty wreck, a fuel tanker sunk in the lagoon in 1946 and now a 137-metre long artificial reef colonised by enormous coral formations and patrolled by large groupers. The atoll's islands are connected by a causeway, a rarity in the Maldives, allowing scooter exploration of mangrove wetlands, freshwater lakes, and the colonial-era buildings of Hithadhoo. Three to four days suits the combination of WWII history, unique diving on the British Loyalty, and the tranquil unhurried pace of the far south.",
    tags: ['WWII History', 'Wreck Diving', 'British Loyalty', 'Remote Atoll'],
    recommendedDays: [3, 4],
  },
];

import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Vietnam
 * 4. Consistently ranked in top Vietnam destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - HCMC: gateway (1,2,4,5) ✓
 * - Hanoi: gateway (1,2,4,5) ✓
 * - Ha Long Bay: UNESCO, bucket-list (1,3,4,5) ✓
 * - Hoi An: UNESCO, bucket-list (1,3,4,5) ✓
 * - Da Nang: Golden Bridge landmark, gateway airport, broad appeal (1,2,4,5) ✓
 * - Sapa: unique rice terraces, bucket-list (3,4,5) ✓
 * - Phong Nha: UNESCO, world's largest cave, bucket-list (1,3,4) ✓
 *
 * NOT must-visit (fails criteria):
 * - Phu Quoc: great but beach-niche (fails 5)
 * - Nha Trang: similar beach options exist elsewhere (fails 3)
 * - Ha Giang: incredible but too adventurous/niche (fails 5)
 * - Others: too niche, day-trip, or lack international recognition
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // SOUTHERN VIETNAM
  // ═══════════════════════════════════════════
  {
    id: 'hcmc',
    name: 'Ho Chi Minh City',
    emoji: '🏍️',
    colour: '#FF6B35',
    airport: 'SGN',
    region: 'SOUTHERN VIETNAM',
    brief:
      "Vietnam's largest city demands at least three full days. Spend a day exploring District 1's French colonial architecture, the War Remnants Museum, and Ben Thanh Market. Dedicate another to a Cu Chi Tunnels half-day trip and Chinatown's Binh Tay Market. Reserve evenings for the legendary street food scene on Bui Vien Walking Street, rooftop cocktails at Saigon Skydeck, and riding pillion on a motorbike food tour through Districts 4 and 7.",
    tags: ['Street Food', 'Nightlife', 'History', 'Rooftop Bars'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'mekong',
    name: 'Mekong Delta',
    emoji: '🚤',
    colour: '#2D936C',
    airport: 'SGN',
    region: 'SOUTHERN VIETNAM',
    brief:
      "A vast network of rivers, swamps, and floating markets south of Saigon. One day covers the highlights: speedboat through mangrove canals, sample exotic tropical fruits straight from the tree, and eat the famous 'elephant ear' fish on a river island. Stay overnight to catch the Cai Rang floating market at dawn and cycle through coconut palm villages.",
    tags: ['Floating Markets', 'Boat Tours', 'Tropical Fruit', 'Rural Life'],
    recommendedDays: [1, 2],
    isDayTrip: true,
    accessNote: 'Day trip from HCMC or Can Tho',
  },
  {
    id: 'phuquoc',
    name: 'Phu Quoc Island',
    emoji: '🏝️',
    colour: '#00B4D8',
    airport: 'PQC',
    region: 'SOUTHERN VIETNAM',
    brief:
      "Vietnam's largest island deserves a proper stay. Day one: Sao Beach and the night market for grilled scallops. Day two: snorkelling or diving at An Thoi Islands. Day three: the world's longest over-sea cable car to Hon Thom and a sunset cruise. Extra days let you explore pepper farms, fish sauce factories, Phu Quoc National Park, and the wild, undeveloped north coast beaches.",
    tags: ['Beaches', 'Snorkelling', 'Night Market', 'Cable Car'],
    recommendedDays: [3, 5],
  },
  {
    id: 'nhatrang',
    name: 'Nha Trang',
    emoji: '🏖️',
    colour: '#0077B6',
    airport: 'CXR',
    region: 'SOUTHERN VIETNAM',
    brief:
      "A buzzing coastal resort city with a long crescent beach. Day one: island-hopping boat tour with snorkelling at Mun Island and a floating bar. Day two: Vinpearl amusement park via cable car, mud baths at Thap Ba Hot Springs, and sunset seafood on Tran Phu Street. Add a third day for diving, the Po Nagar Cham Towers, or just beach time.",
    tags: ['Beach', 'Island Hopping', 'Diving', 'Vinpearl'],
    recommendedDays: [2, 3],
  },
  {
    id: 'dalat',
    name: 'Da Lat',
    emoji: '🌲',
    colour: '#6B4C9A',
    airport: 'DLI',
    region: 'SOUTHERN VIETNAM',
    brief:
      "A cool highland city at 1,500m surrounded by pine forests and coffee plantations. Day one: full-day canyoning down waterfalls, cliff jumping, and ziplining. Day two: visit specialty coffee farms, explore the surreal Crazy House, and hit the Dalat Night Market for grilled rice paper and strawberry wine. Day three: mountain biking, Datanla Waterfall alpine coaster, or the Valley of Love.",
    tags: ['Canyoning', 'Coffee Farms', 'Waterfalls', 'Cool Climate'],
    recommendedDays: [2, 3],
  },
  {
    id: 'muine',
    name: 'Mui Ne',
    emoji: '🪁',
    colour: '#D4A017',
    airport: 'SGN',
    region: 'SOUTHERN VIETNAM',
    brief:
      "A laid-back coastal town famous for its striking red and white sand dunes. Catch a sunrise jeep tour across the dunes, try kitesurfing or windsurfing on consistent winds, and explore the colourful fishing village harbour at dawn. Best as a quick stop between HCMC and Da Lat, or a relaxed overnight beach break.",
    tags: ['Sand Dunes', 'Kitesurfing', 'Jeep Tours', 'Fishing Village'],
    recommendedDays: [1, 2],
    accessNote: '4-5 hour drive from HCMC',
  },
  {
    id: 'condao',
    name: 'Con Dao Islands',
    emoji: '🐢',
    colour: '#1B9AAA',
    airport: 'VCS',
    region: 'SOUTHERN VIETNAM',
    brief:
      "A remote archipelago with pristine beaches, incredible diving, and poignant history. These 16 islands are where Vietnam's rarest wildlife thrives: sea turtles nest on the beaches from June to September. Explore the former French colonial prison, dive crystal-clear waters with barracuda and reef sharks, and hike through untouched jungle to deserted bays. The remoteness is the entire point.",
    tags: ['Diving', 'Sea Turtles', 'Pristine Beaches', 'History'],
    recommendedDays: [2, 3],
    accessNote: 'Flight from HCMC (1hr)',
  },
  {
    id: 'cantho',
    name: 'Can Tho',
    emoji: '🛶',
    colour: '#8B6914',
    airport: 'SGN',
    region: 'SOUTHERN VIETNAM',
    brief:
      "The largest city in the Mekong Delta and the best base for experiencing river life. Wake before dawn to visit the famous Cai Rang floating market by boat, cycle through rice paddies and fruit orchards, and sample Mekong specialities: hu tieu noodle soup and banh cong fried shrimp cakes. Perfect as an alternative to the HCMC day-trip version of the delta.",
    tags: ['Floating Market', 'River Life', 'Cycling', 'Local Food'],
    recommendedDays: [1, 2],
    accessNote: '3.5-hour drive from HCMC',
  },

  // ═══════════════════════════════════════════
  // CENTRAL VIETNAM
  // ═══════════════════════════════════════════
  {
    id: 'hoian',
    name: 'Hoi An',
    emoji: '🏮',
    colour: '#E6A817',
    airport: 'DAD',
    region: 'CENTRAL VIETNAM',
    brief:
      "This UNESCO ancient town is the soul of Vietnam and rewards a slow visit. Day one: wander the lantern-lit Old Town, get measured for a custom-tailored suit (ready in 24 hours). Day two: morning cooking class in a riverside garden, afternoon cycling through Tra Que vegetable village to An Bang Beach. Day three: collect your tailoring, explore the Japanese Covered Bridge and Chinese assembly halls, and release floating lanterns on the Thu Bon River at night. A fourth day lets you add a basket boat ride in the coconut groves.",
    tags: ['Tailoring', 'Lanterns', 'Cooking Classes', 'Ancient Town'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'danang',
    name: 'Da Nang',
    emoji: '🌉',
    colour: '#FF8C42',
    airport: 'DAD',
    region: 'CENTRAL VIETNAM',
    brief:
      "Vietnam's most modern city sits between mountains and sea. Spend a day at Ba Na Hills riding the cable car to the famous Golden Bridge held by giant stone hands. Another day for My Khe Beach (one of Asia's best), the Marble Mountains, and Dragon Bridge at night. Add time for surfing at Non Nuoc Beach, the Cham Museum, or Son Tra Peninsula where monkeys roam wild. Pairs perfectly with Hoi An (30 minutes away).",
    tags: ['Golden Bridge', 'Surfing', 'Marble Mountains', 'Beaches'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: '30 min from Hoi An',
  },
  {
    id: 'hue',
    name: 'Hue',
    emoji: '🏯',
    colour: '#9B2335',
    airport: 'HUE',
    region: 'CENTRAL VIETNAM',
    brief:
      "Vietnam's former imperial capital is a city of royal tombs, ancient citadels, and extraordinary cuisine. Day one: explore the vast Imperial Citadel and the Forbidden Purple City within its walls. Day two: cruise the Perfume River visiting the elaborate royal tombs of emperors Minh Mang and Khai Dinh, and the Thien Mu Pagoda. Hue is also Vietnam's culinary capital: bun bo Hue (spicy beef noodle soup), banh khoai (crispy crepes), and com hen (baby clam rice) are legendary.",
    tags: ['Imperial Citadel', 'Royal Tombs', 'Cuisine Capital', 'Perfume River'],
    recommendedDays: [2, 3],
  },
  {
    id: 'quynhon',
    name: 'Quy Nhon',
    emoji: '🌅',
    colour: '#3CACAE',
    airport: 'UIH',
    region: 'CENTRAL VIETNAM',
    brief:
      "An emerging coastal gem that most tourists haven't discovered yet. The Eo Gio sea cliff walk is breathtaking, Ky Co beach has water clearer than Nha Trang, and the Cham towers at Banh It are beautifully uncrowded. The city beach is clean and local, the seafood is cheap and fresh, and the vibe is authentically Vietnamese rather than tourist-oriented. Perfect for travellers wanting something off the beaten path.",
    tags: ['Hidden Gem', 'Ky Co Beach', 'Cham Towers', 'Seafood'],
    recommendedDays: [2, 3],
  },
  {
    id: 'phongnha',
    name: 'Phong Nha',
    emoji: '🦇',
    colour: '#2E7D32',
    airport: 'VDH',
    region: 'CENTRAL VIETNAM',
    brief:
      "Home to the world's largest cave (Son Doong) and an entire UNESCO karst landscape riddled with underground rivers and caverns. Day one: boat trip into Phong Nha Cave and hike to Paradise Cave, the longest dry cave in Asia. Day two: the Dark Cave experience, zip-lining and kayaking into a pitch-black cavern, followed by jungle trekking. This is Vietnam's top adventure destination and a must for anyone who loves the outdoors. The surrounding countryside is stunning: limestone peaks, jungle-covered mountains, and the Chay River for swimming.",
    tags: ['Caves', 'Adventure', 'Jungle Trekking', 'UNESCO'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Fly to Dong Hoi (VDH), 1hr drive',
  },

  // ═══════════════════════════════════════════
  // NORTHERN VIETNAM
  // ═══════════════════════════════════════════
  {
    id: 'hanoi',
    name: 'Hanoi',
    emoji: '🏙️',
    colour: '#C1440E',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "Vietnam's capital is raw, chaotic, and utterly captivating, and it needs at least three days. Day one: lose yourself in the Old Quarter's 36 Streets, try egg coffee at Giang Cafe, eat bun cha at a street-side joint. Day two: Hoan Kiem Lake, Temple of Literature, Ho Chi Minh Mausoleum complex, and a motorbike food tour hitting pho bo, banh cuon, and cha ca La Vong. Day three: explore West Lake, the trendy Tay Ho district, a water puppet show, and drink 25-cent bia hoi on tiny plastic stools on Ta Hien Street. A fourth day adds the Museum of Ethnology and deeper neighbourhood exploration.",
    tags: ['Old Quarter', 'Egg Coffee', 'Street Food', 'Bia Hoi'],
    recommendedDays: [4, 5],
    mustVisit: true,
  },
  {
    id: 'halong',
    name: 'Ha Long Bay',
    emoji: '⛵',
    colour: '#0077B6',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "Nearly 2,000 limestone karsts and islands rising from emerald water. The overnight cruise is the essential experience: board a traditional junk boat, kayak through hidden caves and lagoons, cliff jump from low karst ledges, try sunset squid fishing from the deck, and wake to tai chi at sunrise surrounded by mist-covered peaks. Two nights lets you explore further to the less-visited Bai Tu Long Bay and Lan Ha Bay areas with better swimming and fewer boats. Three days means adding Cat Ba Island too.",
    tags: ['Cruise', 'Kayaking', 'Limestone Caves', 'Cliff Jumping'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: '3-hour transfer from Hanoi',
  },
  {
    id: 'sapa',
    name: 'Sapa',
    emoji: '⛰️',
    colour: '#4A7C59',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "Dramatic mountain scenery in Vietnam's far north with some of the most photogenic rice terraces on earth. Day one: trek to Cat Cat village and the Silver Waterfall with a Hmong guide. Day two: full-day trek through Lao Chai and Ta Van villages, staying overnight in a family homestay. Day three: Fansipan cable car to the summit of Indochina's highest peak (3,143m) for panoramic views. Day four: Muong Hoa Valley, local Sapa market, and brocade textile shopping. The terraces look completely different across seasons: lush green in summer, golden pre-harvest in September, and flooded mirror-like paddies in winter.",
    tags: ['Rice Terraces', 'Trekking', 'Homestays', 'Fansipan'],
    recommendedDays: [4, 5],
    mustVisit: true,
    accessNote: 'Overnight train or 5-hour drive from Hanoi',
  },
  {
    id: 'ninhbinh',
    name: 'Ninh Binh',
    emoji: '🚣',
    colour: '#5C7A3E',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "Often called 'Ha Long Bay on land': towering limestone karsts rise from bright green rice paddies and lazy rivers. The key experiences fit into a full day: sampan boat through Tam Coc's river caves, cycle through the countryside, and climb 500 steps to the top of Mua Cave for one of Vietnam's most unforgettable panoramic views. Add a second day for Trang An boat tour (UNESCO site), Bai Dinh Pagoda (Vietnam's largest), and Cuc Phuong National Park.",
    tags: ['Boat Rides', 'Rice Paddies', 'Mua Cave', 'Cycling'],
    recommendedDays: [1, 2],
    accessNote: '2-hour drive from Hanoi',
  },
  {
    id: 'hagiang',
    name: 'Ha Giang',
    emoji: '🏔️',
    colour: '#8B5E3C',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "The most spectacular road trip in Southeast Asia. The Ha Giang Loop is a 3-4 day motorbike circuit through Vietnam's most extreme mountain scenery: the Ma Pi Leng Pass (one of the most dramatic roads in the world), the Nho Que River gorge far below, terraced hillsides farmed by H'mong families, and remote villages where time has barely moved. This is raw, adventurous Vietnam at its absolute best. Not for the faint-hearted, but unforgettable for those who go.",
    tags: ['Motorbike Loop', 'Mountain Passes', 'Remote Villages', 'Epic Scenery'],
    recommendedDays: [3, 4],
    accessNote: '6-hour drive from Hanoi or bus',
  },
  {
    id: 'catba',
    name: 'Cat Ba Island',
    emoji: '🦎',
    colour: '#00838F',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "The largest island in Ha Long Bay and a brilliant alternative to the standard cruise experience. Hike through Cat Ba National Park to a panoramic viewpoint, kayak through Lan Ha Bay's quieter emerald waters, rock climb on limestone cliffs, and join a boat trip to the floating fishing villages. Less touristy than Ha Long proper, with better beaches and more active adventure options. Combines well with a Ha Long Bay cruise.",
    tags: ['Hiking', 'Kayaking', 'Rock Climbing', 'Lan Ha Bay'],
    recommendedDays: [2, 3],
    accessNote: 'Ferry from Hai Phong (45min)',
  },
  {
    id: 'maichau',
    name: 'Mai Chau',
    emoji: '🌾',
    colour: '#7CB342',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "A peaceful valley surrounded by green mountains, home to White Thai ethnic minority communities. Cycle through rice paddies between stilted wooden villages, learn traditional weaving, and stay in a communal stilt house homestay where your hosts cook dinner together. Mai Chau is the easiest and fastest highland escape from Hanoi: less dramatic than Sapa but more accessible and wonderfully calm. Perfect as a one-night reset between busier stops.",
    tags: ['Cycling', 'Homestays', 'Rice Paddies', 'Thai Villages'],
    recommendedDays: [1, 2],
    accessNote: '3.5-hour drive from Hanoi',
  },
  {
    id: 'puluong',
    name: 'Pu Luong',
    emoji: '🌿',
    colour: '#558B2F',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "Terraced rice paddies, bamboo water wheels, and genuine rural tranquillity. Pu Luong Nature Reserve is Sapa without the crowds: trek through cascading terraces with a local Muong guide, swim in natural pools beneath waterfalls, and sleep in eco-lodges perched on hillsides with valley views. The trek from Pu Luong to the coast via Ninh Binh is one of Vietnam's great multi-day walking routes. Best for travellers who value peace over spectacle.",
    tags: ['Rice Terraces', 'Trekking', 'Eco-Lodges', 'Waterfalls'],
    recommendedDays: [2, 3],
    accessNote: '4-hour drive from Hanoi',
  },
  {
    id: 'babe',
    name: 'Ba Be Lake',
    emoji: '🏞️',
    colour: '#006064',
    airport: 'HAN',
    region: 'NORTHERN VIETNAM',
    brief:
      "Vietnam's largest natural lake sits in a remote national park surrounded by limestone peaks and evergreen forest. Boat across the tranquil jade-green lake, kayak into Puong Cave where thousands of bats roost, trek to Dau Dang Waterfall, and stay in a Tay minority family homestay on the lakeshore. Ba Be is genuinely off the tourist trail: you may be the only foreigner there. The remoteness requires commitment but delivers an experience unlike anywhere else in Vietnam.",
    tags: ['Lake Cruising', 'Caves', 'Homestays', 'Off the Beaten Path'],
    recommendedDays: [2, 3],
    accessNote: '6-hour drive from Hanoi',
  },
];

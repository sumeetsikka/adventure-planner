import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in Switzerland
 * 4. Consistently ranked in top Switzerland destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Lucerne: iconic Chapel Bridge, top-ranked, gateway to Alps (1,4,5) ✓
 * - Interlaken: adventure capital, gateway to Jungfrau region (2,3,4,5) ✓
 * - Jungfraujoch: Top of Europe, bucket-list train journey, unique (1,3,4,5) ✓
 * - Zermatt: Matterhorn, bucket-list, top-ranked (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Zurich: great city but more business than bucket-list (fails 3)
 * - Geneva: international hub but not the scenic highlight (fails 3,4)
 * - St Moritz: excellent but luxury/ski niche (fails 5)
 * - Others: single-experience or niche appeal
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // GERMAN SWITZERLAND
  // ═══════════════════════════════════════════
  {
    id: 'zurich',
    name: 'Zurich',
    emoji: '🏦',
    colour: '#2C3E50',
    airport: 'ZRH',
    region: 'GERMAN SWITZERLAND',
    brief:
      "Switzerland's largest city and main international gateway combines world-class museums, lakeside promenades, and a vibrant food scene in a compact and walkable old town. The medieval Altstadt on both banks of the Limmat River is best explored on foot, taking in the twin-towered Grossmunster, the Kunsthaus art museum with its outstanding collection of Swiss and international art, and the designer boutiques of Bahnhofstrasse. The lake swimming season from June to September is a highlight: locals jump from the Strandbad bathing platforms at dusk, sip Zurich sausage and beer from lakeside kiosks, and watch the Alps glow pink at sunset.",
    tags: ['Old Town', 'Lake Swimming', 'Museums', 'Shopping'],
    recommendedDays: [2, 2],
  },
  {
    id: 'lucerne',
    name: 'Lucerne',
    emoji: '🌉',
    colour: '#C0392B',
    airport: 'ZRH',
    region: 'GERMAN SWITZERLAND',
    brief:
      "One of the most beautiful small cities in Europe, where a medieval covered wooden bridge crosses a turquoise lake ringed by snow-capped Alps. The 14th-century Chapel Bridge and its octagonal Water Tower are the iconic centrepiece, and the preserved old town of painted guild houses and flower-covered fountains rewards hours of unhurried wandering. Take the cogwheel railway or cable car up Mount Pilatus or Mount Rigi for panoramic views over the Lake Lucerne region, visit the moving Lion Monument carved into a sandstone cliff face, and make time for the Swiss Museum of Transport, one of the finest in Europe.",
    tags: ['Chapel Bridge', 'Lake Views', 'Mount Pilatus', 'Medieval Old Town'],
    recommendedDays: [2, 2],
    mustVisit: true,
    accessNote: 'Via Zurich (50 min by train)',
  },
  {
    id: 'bern',
    name: 'Bern',
    emoji: '🐻',
    colour: '#8B4513',
    airport: 'ZRH',
    region: 'GERMAN SWITZERLAND',
    brief:
      "Switzerland's federal capital is an unhurried city of sandstone arcades, medieval clock towers, and terraced rose gardens overlooking the emerald Aare River. The UNESCO old town is one of the best preserved medieval city centres in Europe, its six kilometres of covered arcades sheltering boutiques, cafes, and fountains. The Zytglogge astronomical clock tower performs an elaborate mechanical show on the hour, the Bear Park on the riverside is home to the city's heraldic animal, and the view of the Bernese Alps on a clear day from the Rose Garden is one of the great urban panoramas of Switzerland.",
    tags: ['UNESCO Old Town', 'Arcades', 'Rose Garden', 'Zytglogge Clock'],
    recommendedDays: [1, 2],
    accessNote: 'Via Zurich (1 hr by train)',
  },

  // ═══════════════════════════════════════════
  // ALPINE REGION
  // ═══════════════════════════════════════════
  {
    id: 'interlaken',
    name: 'Interlaken',
    emoji: '🪂',
    colour: '#1A8CFF',
    airport: 'ZRH',
    region: 'ALPINE REGION',
    brief:
      "Switzerland's adventure capital sits between two glacial lakes, with the Eiger, Monch, and Jungfrau mountains towering above and every extreme sport imaginable on offer. Skydiving over the Alps, paragliding from the Beatenberg ridge, white-water rafting on the Lutschine River, canyoning in the Saxeten gorge, and bungee jumping from the Stockhorn all depart from Interlaken's doorstep. It is also the gateway to the entire Jungfrau region: the cogwheel trains to Grindelwald, Wengen, Murren, and the Jungfraujoch summit all begin here. In winter, the valley connects to some of the finest ski terrain in the Alps.",
    tags: ['Adventure Sports', 'Paragliding', 'Gateway to Jungfrau', 'Alpine Views'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Via Zurich (2 hr by train)',
  },
  {
    id: 'jungfraujoch',
    name: 'Jungfraujoch',
    emoji: '🗻',
    colour: '#85C1E9',
    airport: 'ZRH',
    region: 'ALPINE REGION',
    brief:
      "The Top of Europe sits at 3,454 metres, reached by the most scenic cogwheel railway journey in the world, tunnelling through the Eiger and Monch before emerging above the clouds onto the Aletsch Glacier. The Sphinx Observatory offers a 360-degree panorama across the Alps to France, Germany, and Italy on clear days, the Ice Palace is carved entirely within the glacier, and the Plateau lets you walk out onto the eternal snow in the high Alpine silence. Book tickets well in advance and check the weather forecast carefully, as the experience is entirely different on a clear summit day versus an overcast one.",
    tags: ['Top of Europe', 'Cogwheel Railway', 'Aletsch Glacier', 'Alpine Summit'],
    recommendedDays: [1, 1],
    mustVisit: true,
    isDayTrip: true,
    accessNote: 'Via Zurich (3 hr by train via Interlaken)',
  },
  {
    id: 'grindelwald',
    name: 'Grindelwald',
    emoji: '⛷️',
    colour: '#2E86AB',
    airport: 'ZRH',
    region: 'ALPINE REGION',
    brief:
      "A classic Swiss mountain village at the foot of the Eiger's legendary North Face, combining spectacular alpine scenery with outstanding year-round outdoor activities. In summer, the First cliff walk with its iconic Cliff Walk bridge hanging over a 2,168-metre drop is one of the most exhilarating via ferrata-style experiences in the Alps, and the First Flyer zipline over the glacier is purely thrilling. In winter, Grindelwald connects to the Jungfrau Ski Region, one of the largest ski areas in Switzerland. The Eiger's sheer north wall looms directly above the village and is visible from every cafe terrace.",
    tags: ['Eiger Views', 'Cliff Walk', 'Skiing', 'First Mountain'],
    recommendedDays: [2, 3],
    accessNote: 'Via Zurich (2.5 hr by train via Interlaken)',
  },
  {
    id: 'lauterbrunnen',
    name: 'Lauterbrunnen',
    emoji: '💧',
    colour: '#1ABC9C',
    airport: 'ZRH',
    region: 'ALPINE REGION',
    brief:
      "A glacier-carved valley of jaw-dropping proportions, with 72 waterfalls cascading off 300-metre vertical cliff walls that rise on both sides. Staubbach Falls plunges directly from the cliff face above the village in a free-fall of mist and spray, Trummelbach Falls roars through the mountain itself and can be visited inside the rock via tunnels and lifts. The valley is also the base for the car-free villages of Wengen above and Murren on the opposite cliff, both offering extraordinary Alpine views and access to some of the best hiking in the Bernese Oberland. This is the Switzerland of postcards made real.",
    tags: ['72 Waterfalls', 'Valley of Waterfalls', 'Car-Free Villages', 'Hiking'],
    recommendedDays: [1, 2],
    accessNote: 'Via Zurich (2 hr by train via Interlaken)',
  },
  {
    id: 'zermatt',
    name: 'Zermatt and the Matterhorn',
    emoji: '🏔️',
    colour: '#6C3483',
    airport: 'GVA',
    region: 'ALPINE REGION',
    brief:
      "The Matterhorn is one of the most recognisable mountains in the world, and standing at its base in the car-free village of Zermatt is a genuinely moving experience. The Gornergrat cogwheel railway climbs to 3,089 metres for an unobstructed view of the pyramid peak, and the Klein Matterhorn cable car reaches 3,883 metres to access Europe's highest ski terrain, open year-round. The village itself is beautifully preserved, with traditional Valais chalets, excellent fondue and raclette restaurants, and a high street of mountaineering equipment shops that speak to the seriousness of the surrounding peaks. Book well ahead for summer; the village fills quickly.",
    tags: ['Matterhorn', 'Skiing', 'Gornergrat Railway', 'Car-Free Village'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Via Geneva (3.5 hr by train)',
  },
  {
    id: 'stmoritz',
    name: 'St Moritz',
    emoji: '🎿',
    colour: '#884EA0',
    airport: 'ZRH',
    region: 'ALPINE REGION',
    brief:
      "The birthplace of alpine tourism and winter sports, St Moritz has been the playground of European aristocracy and international jetsetters since the 19th century. The ski terrain across the Engadine valley is among the finest in the Alps: the Corviglia, Corvatsch, and Diavolezza ski areas combined offer enormous variety for all ability levels. In summer the lake is the centrepiece, with sailing, windsurfing, and the impossibly scenic Bernina Express train departing for Tirano across some of the most dramatic rail scenery in Europe. The town's Segantini Museum houses one of the finest collections of Alpine art in existence.",
    tags: ['Luxury Skiing', 'Bernina Express', 'Alpine Lake', 'Engadine Valley'],
    recommendedDays: [2, 3],
    accessNote: 'Via Zurich (3 hr by train)',
  },

  // ═══════════════════════════════════════════
  // FRENCH SWITZERLAND
  // ═══════════════════════════════════════════
  {
    id: 'geneva',
    name: 'Geneva',
    emoji: '🕊️',
    colour: '#E74C3C',
    airport: 'GVA',
    region: 'FRENCH SWITZERLAND',
    brief:
      "The most international city in the world by population, home to the United Nations, the Red Cross, and the Jet d'Eau, one of the tallest water fountains on earth shooting 140 metres into Lake Geneva. The old town climbs to the 12th-century St Pierre Cathedral where Calvin preached the Reformation, and the Bourg-de-Four square below is the liveliest spot for a cafe au lait and a watch of the world going by. The lakeside promenade, the English Garden's famous floral clock, and the Broken Chair sculpture outside the UN all make for a rewarding half-day walk.",
    tags: ['Jet d\'Eau', 'United Nations', 'Lake Geneva', 'Watchmaking'],
    recommendedDays: [1, 2],
  },
  {
    id: 'lausanne',
    name: 'Lausanne',
    emoji: '🚂',
    colour: '#E67E22',
    airport: 'GVA',
    region: 'FRENCH SWITZERLAND',
    brief:
      "A hilly university city on the north shore of Lake Geneva with a vibrant arts scene, a beautiful Gothic cathedral, and some of the finest lakeside dining in Switzerland. The steep old town steps lead up to the Place de la Palud and the 12th-century Notre-Dame Cathedral, the best-preserved Gothic cathedral in Switzerland. The Olympic Museum on the lakeside is world-class and warmly recommended for any sports enthusiast, the Collection de l'Art Brut is one of the finest outsider art collections in the world, and the Lavaux vineyard terraces on the hillside above the lake are a UNESCO World Heritage Site reachable by a 20-minute train ride.",
    tags: ['Olympic Museum', 'Gothic Cathedral', 'Lavaux Vineyards', 'Lake Views'],
    recommendedDays: [1, 2],
    accessNote: 'Via Geneva (40 min by train)',
  },
  {
    id: 'montreux',
    name: 'Montreux',
    emoji: '🎸',
    colour: '#F39C12',
    airport: 'GVA',
    region: 'FRENCH SWITZERLAND',
    brief:
      "A glamorous resort town on the eastern tip of Lake Geneva, famous for its Jazz Festival, its palm-lined promenade, and the 13th-century Chateau de Chillon rising from the lake on a rocky island just outside town. The castle is one of the most visited historic sites in Switzerland, its lakeside towers and dungeon immortalised in Byron's poem The Prisoner of Chillon. Montreux hosted the recording sessions of Freddie Mercury and Queen, and the lakeside statue of Mercury is a popular pilgrimage spot. The Mountain Flower Train climbing to Rochers-de-Naye above the lake offers extraordinary views across to the French Alps.",
    tags: ['Chateau de Chillon', 'Jazz Festival', 'Lake Promenade', 'Freddie Mercury'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Via Geneva (1 hr by train)',
  },

  // ═══════════════════════════════════════════
  // ITALIAN SWITZERLAND
  // ═══════════════════════════════════════════
  {
    id: 'lugano',
    name: 'Lugano',
    emoji: '🌴',
    colour: '#27AE60',
    airport: 'ZRH',
    region: 'ITALIAN SWITZERLAND',
    brief:
      "Switzerland's southernmost major city feels entirely Mediterranean: the language is Italian, the piazzas are filled with espresso drinkers, the cooking is Ticinese and outstanding, and the lake is warm enough to swim in from May to September. Lugano sits at the foot of Monte San Salvatore and Monte Bre, both of which are reached by funicular and offer sweeping views across the lake to the snowy Alps above. The old town has a beautiful 16th-century cathedral with outstanding Renaissance frescoes, the lakeside parks are immaculately kept, and the day trip by boat to the fishing village of Gandria is a quintessential Lugano experience.",
    tags: ['Mediterranean Vibe', 'Lake Swimming', 'Italian Cuisine', 'Monte San Salvatore'],
    recommendedDays: [1, 2],
    accessNote: 'Via Zurich (2.5 hr by train)',
  },
];

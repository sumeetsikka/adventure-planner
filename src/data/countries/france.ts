import type { Destination } from '../../types';

/**
 * Must Visit criteria: a destination is marked mustVisit if it meets 3+ of these:
 * 1. UNESCO World Heritage Site or internationally recognised landmark
 * 2. Gateway city (major international airport, most travellers pass through)
 * 3. Unique, bucket-list experience unavailable elsewhere in France
 * 4. Consistently ranked in top France destinations by Lonely Planet, Rough Guides, etc.
 * 5. Appeals across all travel vibes (not niche to one type of traveller)
 *
 * Applied:
 * - Paris: Eiffel Tower/Louvre bucket-list, primary gateway (1,2,3,4,5) ✓
 * - Nice/French Riviera: iconic coastline, consistent top-ranking, broad appeal (1,3,4,5) ✓
 * - Mont Saint-Michel: UNESCO, unique tidal island, true bucket-list (1,3,4,5) ✓
 * - Chamonix: bucket-list alpine scenery, Mont Blanc, broad appeal (3,4,5) ✓
 * - Loire Valley: UNESCO, France's greatest chateau landscape (1,3,4,5) ✓
 *
 * NOT must-visit (fails criteria):
 * - Lyon: excellent food city but niche, lacks iconic landmark (fails 3)
 * - Bordeaux: wine-niche appeal, less universal (fails 3,5)
 * - Corsica: remote, requires extra flight, more niche (fails 2,5)
 * - Others: regional interest or niche traveller type
 */

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════
  // PARIS & ILE-DE-FRANCE
  // ═══════════════════════════════════════════
  {
    id: 'paris',
    name: 'Paris',
    emoji: '🗼',
    colour: '#3F51B5',
    airport: 'CDG',
    region: 'PARIS & ILE-DE-FRANCE',
    brief:
      'The most visited city on earth rewards a slow stay of three to four days rather than a breathless checklist sprint. Day one covers the essential icons: the Eiffel Tower at dusk, Montmartre and Sacre-Coeur at golden hour, and a Seine river cruise. Day two: the Louvre (pre-book, arrive at opening), the Tuileries Garden, and the Palais Royal arcades. Day three: Musee d\'Orsay for the Impressionists, Saint-Germain-des-Pres cafe culture, and the covered Galerie Vivienne passage. A fourth day unlocks the Marais district\'s galleries and falafel, the Canal Saint-Martin for a picnic, and the city\'s finest bistrot cooking in the 11th arrondissement.',
    tags: ['Eiffel Tower', 'Louvre', 'Bistros', 'Cafe Culture'],
    recommendedDays: [5, 7],
    mustVisit: true,
  },
  {
    id: 'versailles',
    name: 'Versailles',
    emoji: '👑',
    colour: '#C8A951',
    airport: 'CDG',
    region: 'PARIS & ILE-DE-FRANCE',
    brief:
      'The most extravagant palace ever built and one of the defining statements of absolute monarchy. A full day is required to do justice to the Hall of Mirrors, the King\'s and Queen\'s apartments, and the vast formal gardens stretching to the horizon. Arrive at opening to beat the crowds and rent a golf buggy or bike to reach the Grand Trianon and Petit Trianon, Marie Antoinette\'s private retreat with its pastoral hamlet. Tuesday closures and weekend crowds make a Wednesday to Friday visit the smartest choice.',
    tags: ['Palace', 'Hall of Mirrors', 'Royal Gardens', 'UNESCO'],
    recommendedDays: [1, 1],
    isDayTrip: true,
    accessNote: 'Day trip from Paris (40min by RER C)',
  },
  {
    id: 'mont-saint-michel',
    name: 'Mont Saint-Michel',
    emoji: '🏰',
    colour: '#546E7A',
    airport: 'CDG',
    region: 'PARIS & ILE-DE-FRANCE',
    brief:
      'A medieval abbey rising from a tidal island in Normandy\'s bay, connected to the mainland only at low tide: one of the most dramatic built environments in the world. One day covers the winding medieval lanes, the Benedictine abbey at the summit with its extraordinary Gothic architecture, and watching the world\'s fastest tides surge back across the sand flats at dusk. Staying overnight lets you experience the island after day visitors depart, walk the tidal flats with a guide at low tide, and see the mount illuminated against the night sky. This is a genuine bucket-list sight that photographs cannot overstate.',
    tags: ['Medieval Abbey', 'Tidal Island', 'Pilgrimage Site', 'UNESCO'],
    recommendedDays: [1, 1],
    mustVisit: true,
    accessNote: 'Via Paris (CDG) or Rennes, 3.5hr by TGV and shuttle',
  },
  {
    id: 'loire-valley',
    name: 'Loire Valley',
    emoji: '🏯',
    colour: '#7B8C3E',
    airport: 'CDG',
    region: 'PARIS & ILE-DE-FRANCE',
    brief:
      'The Loire Valley is France\'s garden: 1,000 kilometres of river flanked by more than 300 chateaux, from fairy-tale Chambord (365 chimneys, a double-helix staircase attributed to Leonardo da Vinci) to the bridge-spanning Chenonceau and the medieval Amboise where da Vinci spent his final years. Two days by hire car covers the four greatest chateaux, a wine tasting of Vouvray whites and Chinon reds, and a slow dinner of rillettes, pike perche, and tarte Tatin in a riverside village. This is the definitive French countryside experience and the country\'s most complete UNESCO landscape.',
    tags: ['Chateaux', 'Wine', 'Renaissance History', 'UNESCO'],
    recommendedDays: [2, 2],
    mustVisit: true,
    accessNote: 'Via Paris (CDG), 1hr by TGV to Tours',
  },
  {
    id: 'normandy',
    name: 'Normandy & D-Day Beaches',
    emoji: '🪖',
    colour: '#455A64',
    airport: 'CDG',
    region: 'PARIS & ILE-DE-FRANCE',
    brief:
      'The Normandy landing beaches of 6 June 1944 are among the most moving and historically significant landscapes in the world. Two days does the region justice: the American Cemetery at Colleville-sur-Mer overlooking Omaha Beach, the Pointe du Hoc Ranger monument with its still-visible bomb craters, the Overlord Museum near Bayeux for the most comprehensive D-Day artefact collection, and the medieval city of Bayeux with its extraordinary 11th-century tapestry depicting the Norman Conquest. Hire a car from Paris or join a guided tour from Bayeux for the most rewarding experience.',
    tags: ['D-Day History', 'War Memorials', 'Bayeux Tapestry', 'WWII'],
    recommendedDays: [2, 2],
    accessNote: 'Via Paris (CDG), 2hr by train to Bayeux',
  },

  // ═══════════════════════════════════════════
  // SOUTHERN FRANCE
  // ═══════════════════════════════════════════
  {
    id: 'nice-riviera',
    name: 'Nice & French Riviera',
    emoji: '🌴',
    colour: '#00BCD4',
    airport: 'NCE',
    region: 'SOUTHERN FRANCE',
    brief:
      'The French Riviera is the original glamour coast: a 115-kilometre sweep of beach clubs, Belle Epoque grand hotels, and sun-baked old towns from Nice to the Italian border. Nice itself deserves two days: the vibrant Cours Saleya flower and food market, the Old Town\'s Baroque churches, the Promenade des Anglais at sunset, and the Matisse and Chagall museums. A third day suits the jet-set villages of Eze perched on a cliff 427m above the sea, the Principality of Monaco for a circuit walk and Casino Square spectacle, and the village of Antibes with its Picasso Museum and yachting harbour.',
    tags: ['Riviera Beaches', 'Monaco', 'Old Town', 'Belle Epoque'],
    recommendedDays: [2, 3],
    mustVisit: true,
  },
  {
    id: 'marseille',
    name: 'Marseille',
    emoji: '⛵',
    colour: '#1565C0',
    airport: 'MRS',
    region: 'SOUTHERN FRANCE',
    brief:
      'France\'s oldest city and its most viscerally alive: a raw, multi-cultural port with extraordinary food, dramatic calanques, and more character per square metre than anywhere else in the south. Two days covers the Vieux-Port fish market at 8am for a bowl of bouillabaisse at Chez Fonfon, the spectacular Calanques National Park sea cliffs by kayak or boat, the MuCEM museum on the water, and the basilica of Notre-Dame de la Garde for panoramic city views. Marseille is better experienced than merely visited: its rough edges are part of the appeal.',
    tags: ['Bouillabaisse', 'Calanques', 'Vieux-Port', 'Multicultural'],
    recommendedDays: [2, 2],
  },
  {
    id: 'provence-avignon',
    name: 'Provence & Avignon',
    emoji: '💜',
    colour: '#7B1FA2',
    airport: 'MRS',
    region: 'SOUTHERN FRANCE',
    brief:
      'Lavender fields, Roman ruins, sun-drenched hilltop villages, and the medieval city that was once the seat of the papacy: Provence delivers the France of imagination. Two days covers Avignon\'s extraordinary Palais des Papes (the largest Gothic palace in the world) and the Pont d\'Avignon, plus a drive through the Luberon to the ochre-coloured village of Roussillon and the perched village of Gordes. A third day suits the Pont du Gard Roman aqueduct, the perfectly preserved Roman theatre at Orange, or in July the Luberon lavender fields in full violet bloom.',
    tags: ['Lavender', 'Roman Ruins', 'Hilltop Villages', 'Papal Palace'],
    recommendedDays: [2, 3],
    accessNote: 'Via Marseille (MRS), 1hr by TGV',
  },
  {
    id: 'saint-tropez',
    name: 'Saint-Tropez',
    emoji: '🛥️',
    colour: '#FF8F00',
    airport: 'NCE',
    region: 'SOUTHERN FRANCE',
    brief:
      'The original summer playground of the global jet set, Saint-Tropez rewards two days of deliberate indulgence. Spend mornings at Pampelonne Beach (the famous beach club strip where Brigitte Bardot made the bikini famous), afternoons wandering the cobblestone old town and the Annonciade Museum with its extraordinary Fauve and Post-Impressionist collection, and evenings on the harbour watching superyachts larger than suburban houses. Go in May or September to avoid the paralysing July to August crowds; the village is transformed and genuinely charming outside peak season.',
    tags: ['Beach Clubs', 'Superyachts', 'Riviera Glamour', 'Pampelonne Beach'],
    recommendedDays: [2, 2],
    accessNote: 'Via Nice (NCE), 2hr by ferry from Nice or Cannes',
  },
  {
    id: 'corsica',
    name: 'Corsica',
    emoji: '🏔️',
    colour: '#2E7D32',
    airport: 'AJA',
    region: 'SOUTHERN FRANCE',
    brief:
      'France\'s wild island in the Mediterranean has the beaches of Sardinia, the mountains of the Alps, and a fierce independent culture that considers itself Corsican first and French second. Three days based around Ajaccio covers the old port, Napoleon\'s birthplace museum, and a drive north to the Scandola Nature Reserve (UNESCO, accessible only by boat) with its dramatic red rock sea cliffs and crystal water. The GR20, often rated the toughest long-distance hike in Europe, traverses the island\'s granite spine for multi-day trekkers. Bonifacio\'s chalk-cliff fortress town in the south is another unmissable stop.',
    tags: ['Wild Beaches', 'Mountain Hiking', 'Maquis Scrubland', 'Scandola Reserve'],
    recommendedDays: [3, 3],
  },

  // ═══════════════════════════════════════════
  // WESTERN FRANCE
  // ═══════════════════════════════════════════
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    emoji: '🍷',
    colour: '#6A1B4D',
    airport: 'BOD',
    region: 'WESTERN FRANCE',
    brief:
      'The wine capital of the world is also one of France\'s most elegant cities, with a UNESCO-listed 18th-century centre and the world\'s best wine museum. Two days covers the Cite du Vin wine museum with its extraordinary architecture and interactive tastings, the Grand Theatre and Place de la Bourse with its water-mirror reflection, and the vibrant Saint-Pierre market quarter for Basque pintxos and local oysters. A third day suits a half-day drive along the Medoc wine road, stopping at legendary chateaux Margaux, Pichon Baron, and a cave tasting at a Grand Cru estate.',
    tags: ['Wine Estates', 'Cite du Vin', 'Elegant Architecture', 'UNESCO'],
    recommendedDays: [2, 3],
  },

  // ═══════════════════════════════════════════
  // EASTERN FRANCE
  // ═══════════════════════════════════════════
  {
    id: 'lyon',
    name: 'Lyon',
    emoji: '🍽️',
    colour: '#C62828',
    airport: 'LYS',
    region: 'EASTERN FRANCE',
    brief:
      'The undisputed gastronomic capital of France, Lyon contains more restaurants per capita than any other city in the country and is home to the legendary bouchon: a small, traditional Lyonnais bistro serving quenelles, andouillette sausage, and tablier de sapeur tripe. Two days covers a morning at the Traboules (secret Renaissance passageways through apartment blocks), the Fourviere basilica and Roman amphitheatres on the hill above the city, the old town of Vieux-Lyon, and at least one proper bouchon dinner. Lyon is also the capital of French silk and has a world-class Musee des Beaux-Arts often called the Louvre of the south.',
    tags: ['Gastronomic Capital', 'Bouchons', 'Roman Theatre', 'Silk Heritage'],
    recommendedDays: [2, 2],
  },
  {
    id: 'chamonix',
    name: 'Chamonix',
    emoji: '⛷️',
    colour: '#1A237E',
    airport: 'GVA',
    region: 'EASTERN FRANCE',
    brief:
      'Sitting at the foot of Mont Blanc (4,808m, the highest peak in the Alps), Chamonix is the adventure sports capital of Europe. Two days covers the Aiguille du Midi cable car to 3,842m for breathtaking summit views across France, Switzerland, and Italy, plus the Mer de Glace glacier accessed by rack railway. A third day suits a via ferrata on the granite cliffs above town, a paragliding flight landing in the valley, white-water rafting on the Arve River, or in winter a day on the world-famous Vallee Blanche off-piste descent. The village itself is lively and international with excellent mountain cuisine.',
    tags: ['Mont Blanc', 'Cable Car', 'Skiing', 'Alpine Adventure'],
    recommendedDays: [2, 3],
    mustVisit: true,
    accessNote: 'Via Geneva (GVA), 1.5hr by bus or train',
  },
  {
    id: 'annecy',
    name: 'Annecy',
    emoji: '🏞️',
    colour: '#00838F',
    airport: 'GVA',
    region: 'EASTERN FRANCE',
    brief:
      'Often called the Venice of the Alps, Annecy is built around canals, a turquoise glacial lake, and a medieval old town of flower-draped pastel houses. One full day covers the old town\'s Palais de l\'Isle prison-island, the weekly Tuesday and Friday market (one of France\'s best), a swim in the crystal-clear Lake Annecy (consistently rated the cleanest in Europe), and a sunset cycle around the lakefront path to the Champ de Mars gardens. A second day suits a paddle-board lesson on the lake, the Chateau d\'Annecy museum, or a half-day hike on the surrounding limestone ridges for panoramic lake and Alpine views.',
    tags: ['Alpine Lake', 'Medieval Old Town', 'Swimming', 'Cycling'],
    recommendedDays: [1, 2],
    accessNote: 'Via Geneva (GVA), 45min by train',
  },
  {
    id: 'strasbourg',
    name: 'Strasbourg',
    emoji: '🏡',
    colour: '#BF360C',
    airport: 'SXB',
    region: 'EASTERN FRANCE',
    brief:
      'The capital of Alsace sits on the Rhine border between France and Germany and has been shaped by both cultures into something utterly unique. One to two days explores the half-timbered Petite France quarter, the extraordinary Gothic Cathedral with its 14th-century astronomical clock, and the European Parliament building open for public visits. The Alsatian food is its own reason to visit: choucroute garnie (sauerkraut with meats), flammekueche (Alsatian wood-fired tart), and baeckeoffe stew, all washed down with exceptional local Riesling and Pinot Gris wines.',
    tags: ['Petite France', 'Gothic Cathedral', 'Alsatian Food', 'European Parliament'],
    recommendedDays: [1, 2],
  },
  {
    id: 'colmar',
    name: 'Colmar',
    emoji: '🌸',
    colour: '#E91E63',
    airport: 'SXB',
    region: 'EASTERN FRANCE',
    brief:
      'Colmar is the most preserved medieval Alsatian town in France and, with its canals and candy-coloured half-timbered houses, is said to have inspired the village in Disney\'s Beauty and the Beast. One full day covers the Little Venice canal quarter by foot and boat, the extraordinary Isenheim Altarpiece at the Musee Unterlinden (one of the greatest works of German Renaissance art), and a walk through the old merchants\' quarter. Colmar serves perfectly as a second-day excursion from Strasbourg, or as a base for exploring the Alsace Wine Route through the Vosges foothills with their hilltop ruined castles and vine-covered villages.',
    tags: ['Medieval Town', 'Little Venice', 'Alsatian Wine Route', 'Half-Timbered Houses'],
    recommendedDays: [1, 1],
    accessNote: 'Via Strasbourg (SXB), 30min by train',
  },
];

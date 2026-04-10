import type { Country } from '../types';

export const countries: Country[] = [
  // ASIA
  { id: 'vietnam', name: 'Vietnam', emoji: '🇻🇳', colour: '#FF6B35', tagline: 'Street food, motorbikes, and emerald bays', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'thailand', name: 'Thailand', emoji: '🇹🇭', colour: '#E6A817', tagline: 'Temples, islands, and legendary nightlife', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'japan', name: 'Japan', emoji: '🇯🇵', colour: '#C1440E', tagline: 'Ancient temples, neon cities, and cherry blossoms', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'indonesia', name: 'Indonesia', emoji: '🇮🇩', colour: '#2D936C', tagline: 'Bali, Komodo dragons, and tropical paradise', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'philippines', name: 'Philippines', emoji: '🇵🇭', colour: '#0077B6', tagline: 'Island hopping, diving, and white sand beaches', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'cambodia', name: 'Cambodia', emoji: '🇰🇭', colour: '#8B5E3C', tagline: 'Angkor Wat, floating villages, and raw beauty', origin: 'MEL', currency: 'AUD', prebuilt: true },

  // EUROPE
  { id: 'italy', name: 'Italy', emoji: '🇮🇹', colour: '#2E7D32', tagline: 'Roman ruins, Tuscan hills, and the best food on earth', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'france', name: 'France', emoji: '🇫🇷', colour: '#0077B6', tagline: 'Paris, lavender fields, and the French Riviera', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'spain', name: 'Spain', emoji: '🇪🇸', colour: '#C1440E', tagline: 'Tapas, flamenco, and sun-drenched coastlines', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'portugal', name: 'Portugal', emoji: '🇵🇹', colour: '#2D936C', tagline: 'Pastel de nata, surf towns, and tile-covered streets', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'greece', name: 'Greece', emoji: '🇬🇷', colour: '#0077B6', tagline: 'Whitewashed islands, ancient history, and Mediterranean sunsets', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'switzerland', name: 'Switzerland', emoji: '🇨🇭', colour: '#C1440E', tagline: 'Alpine peaks, chocolate, and scenic train journeys', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'germany', name: 'Germany', emoji: '🇩🇪', colour: '#E6A817', tagline: 'Fairytale castles, beer gardens, and vibrant cities', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'netherlands', name: 'Netherlands', emoji: '🇳🇱', colour: '#FF6B35', tagline: 'Canals, cycling, tulips, and world-class museums', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'belgium', name: 'Belgium', emoji: '🇧🇪', colour: '#8B5E3C', tagline: 'Chocolate, waffles, medieval towns, and craft beer', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'austria', name: 'Austria', emoji: '🇦🇹', colour: '#C1440E', tagline: 'Vienna, alpine villages, and The Sound of Music', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'norway', name: 'Norway', emoji: '🇳🇴', colour: '#0077B6', tagline: 'Fjords, northern lights, and midnight sun adventures', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'sweden', name: 'Sweden', emoji: '🇸🇪', colour: '#E6A817', tagline: 'Stockholm archipelago, ABBA, and Scandinavian design', origin: 'MEL', currency: 'AUD', prebuilt: true },

  // AFRICA & MIDDLE EAST
  { id: 'morocco', name: 'Morocco', emoji: '🇲🇦', colour: '#C1440E', tagline: 'Souks, Sahara dunes, and mountain kasbahs', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'egypt', name: 'Egypt', emoji: '🇪🇬', colour: '#E6A817', tagline: 'Pyramids, pharaohs, and the Nile at sunset', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'turkey', name: 'Turkey', emoji: '🇹🇷', colour: '#C1440E', tagline: 'Istanbul bazaars, Cappadocia balloons, and turquoise coast', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'mauritius', name: 'Mauritius', emoji: '🇲🇺', colour: '#00B4D8', tagline: 'Tropical paradise, luxury resorts, and underwater waterfalls', origin: 'MEL', currency: 'AUD', prebuilt: true },

  // AMERICAS
  { id: 'peru', name: 'Peru', emoji: '🇵🇪', colour: '#8B5E3C', tagline: 'Machu Picchu, ceviche, and the Sacred Valley', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'mexico', name: 'Mexico', emoji: '🇲🇽', colour: '#2E7D32', tagline: 'Mayan ruins, tacos, cenotes, and Caribbean beaches', origin: 'MEL', currency: 'AUD', prebuilt: true },

  // OCEANIA
  { id: 'newzealand', name: 'New Zealand', emoji: '🇳🇿', colour: '#2D936C', tagline: 'Fiords, hobbits, bungy jumping, and untouched wilderness', origin: 'MEL', currency: 'AUD', prebuilt: true },

  // INDIAN OCEAN
  { id: 'maldives', name: 'Maldives', emoji: '🇲🇻', colour: '#00B4D8', tagline: 'Overwater villas, crystal lagoons, and world-class diving', origin: 'MEL', currency: 'AUD', prebuilt: true },

  // MORE EUROPE
  { id: 'croatia', name: 'Croatia', emoji: '🇭🇷', colour: '#0077B6', tagline: 'Dubrovnik walls, island hopping, and Adriatic sunsets', origin: 'MEL', currency: 'AUD', prebuilt: true },
  { id: 'iceland', name: 'Iceland', emoji: '🇮🇸', colour: '#6B4C9A', tagline: 'Glaciers, geysers, northern lights, and black sand beaches', origin: 'MEL', currency: 'AUD', prebuilt: true },

  // PACIFIC
  { id: 'fiji', name: 'Fiji', emoji: '🇫🇯', colour: '#00B4D8', tagline: 'Island paradise, village culture, and warm Bula smiles', origin: 'MEL', currency: 'AUD', prebuilt: true },
];

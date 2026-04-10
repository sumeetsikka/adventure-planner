export const GBP_TO_AUD = 1.95;

export const COLOURS = {
  base: '#0B1120',
  orange: '#FF6B35',
  green: '#2D936C',
  blue: '#0077B6',
  gold: '#E6A817',
  cyan: '#00B4D8',
  purple: '#6B4C9A',
  darkRed: '#C1440E',
  forestGreen: '#4A7C59',
  oliveGreen: '#5C7A3E',
} as const;

export const VIBE_COLOURS: Record<string, string> = {
  adventure: COLOURS.orange,
  nature: COLOURS.green,
  travel: COLOURS.blue,
  food: COLOURS.gold,
  beach: COLOURS.cyan,
  cruise: '#6B4C9A',
  culture: '#9B2335',
  romance: '#E91E63',
  family: '#4CAF50',
  backpacker: '#8B5E3C',
  luxury: '#FFD700',
  photography: '#FF8C42',
  wellness: '#00BFA5',
  nightlife: '#7C4DFF',
  foodie: COLOURS.gold,
  history: '#8D6E63',
};

export const VIBE_LABELS: Record<string, string> = {
  adventure: 'Adventure',
  nature: 'Nature',
  travel: 'Travel',
  food: 'Food',
  beach: 'Beach',
  cruise: 'Cruise',
  culture: 'Culture',
  romance: 'Romance',
  family: 'Family',
  backpacker: 'Backpacker',
  luxury: 'Luxury',
  photography: 'Photography',
  wellness: 'Wellness',
  nightlife: 'Nightlife',
  foodie: 'Foodie',
  history: 'History',
};


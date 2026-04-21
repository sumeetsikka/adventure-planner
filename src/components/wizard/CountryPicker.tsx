import { useState, useMemo } from 'react';
import { countries } from '../../data/countries';
import type { Country } from '../../types';

interface Props {
  onSelect: (country: Country) => void;
}

const REGION_MAP: Record<string, string[]> = {
  'Asia': ['vietnam', 'thailand', 'japan', 'indonesia', 'philippines', 'cambodia'],
  'Europe': ['italy', 'france', 'spain', 'portugal', 'greece', 'switzerland', 'germany', 'netherlands', 'belgium', 'austria', 'norway', 'sweden', 'croatia', 'iceland'],
  'Africa & Middle East': ['morocco', 'egypt', 'turkey', 'mauritius'],
  'Americas': ['peru', 'mexico'],
  'Oceania & Pacific': ['newzealand', 'fiji'],
  'Indian Ocean': ['maldives'],
};

const REGION_EMOJIS: Record<string, string> = {
  'Asia': '🌏',
  'Europe': '🌍',
  'Africa & Middle East': '🌍',
  'Americas': '🌎',
  'Oceania & Pacific': '🌏',
  'Indian Ocean': '🌊',
};

export default function CountryPicker({ onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [customCountry, setCustomCountry] = useState('');

  const regions = useMemo(() => {
    return Object.entries(REGION_MAP)
      .map(([name, ids]) => {
        const regionCountries = countries.filter((c) => ids.includes(c.id));
        const filtered = search
          ? regionCountries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
          : regionCountries;
        return { name, emoji: REGION_EMOJIS[name] || '🌍', countries: filtered };
      })
      .filter((r) => r.countries.length > 0);
  }, [search]);

  const handleCustomSubmit = () => {
    if (!customCountry.trim()) return;
    const custom: Country = {
      id: customCountry.trim().toLowerCase().replace(/\s+/g, '-'),
      name: customCountry.trim(),
      emoji: '🌍',
      colour: '#FF6B35',
      tagline: `Explore ${customCountry.trim()} your way`,
      origin: 'MEL',
      currency: 'AUD',
      prebuilt: false,
    };
    onSelect(custom);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF6B35]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-[#0077B6]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#2D936C]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-16">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#2D936C] animate-pulse" />
            <span className="text-[11px] text-gray-400 font-medium tracking-wide">ADVENTURE PLANNER</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Where in the world<br />
            <span className="text-shimmer">are you heading?</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            Pick a country below, or type any destination. We'll build your perfect trip.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full bg-[#131B2E] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B35]/50 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Regions */}
        {regions.map((region) => (
          <div key={region.name} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-lg">{region.emoji}</span>
              <h2 className="text-sm font-bold text-gray-500 tracking-[3px] uppercase">{region.name}</h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-3">
              {region.countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => onSelect(country)}
                  className="group rounded-2xl border border-white/8 bg-[#131B2E] hover:bg-[#182036] hover:border-white/15 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 p-4 text-left overflow-hidden relative"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(160deg, ${country.colour}10, transparent 60%)` }}
                  />
                  <div className="relative">
                    <span className="text-3xl block mb-2">{country.emoji}</span>
                    <h3 className="text-white font-bold text-sm mb-0.5">{country.name}</h3>
                    <p className="text-gray-500 text-[10px] leading-snug line-clamp-2">{country.tagline}</p>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${country.colour}, transparent)` }}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* No results */}
        {regions.length === 0 && search && (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-2">No pre-built countries match "{search}"</p>
            <p className="text-gray-500 text-sm">But you can explore it anyway using AI below.</p>
          </div>
        )}

        {/* Custom country */}
        <div className="mt-12">
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#131B2E] p-6 text-center">
              <span className="text-3xl block mb-3">🌍</span>
              <h3 className="text-white font-bold text-base mb-1">Explore another country</h3>
              <p className="text-gray-500 text-sm mb-4">
                Type any country and we'll generate destinations using AI.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                  placeholder="e.g. Sri Lanka, South Korea, Croatia..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#FF6B35]/50 transition-colors"
                />
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customCountry.trim()}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    customCountry.trim()
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85D26] text-white hover:shadow-lg'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Go →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

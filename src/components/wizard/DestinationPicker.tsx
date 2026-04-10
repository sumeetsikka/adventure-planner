import { useState } from 'react';
import type { Country, Destination } from '../../types';
import { countries } from '../../data/countries';
import { getDestinationsForCountry } from '../../data/destinations';
import { generateDestinations } from '../../lib/api';
import DestinationCard from './DestinationCard';

interface Props {
  selected: Destination[];
  onSelect: (destinations: Destination[]) => void;
  onNext: () => void;
  country: Country;
  destinations: Destination[];
  onBackToCountries: () => void;
  onAddDestinations?: (newDests: Destination[]) => void;
}

export default function DestinationPicker({ selected, onSelect, onNext, country, destinations, onBackToCountries, onAddDestinations }: Props) {
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [addingCountry, setAddingCountry] = useState(false);

  const handleAddFromCountry = async (c: Country) => {
    if (!onAddDestinations) return;
    setAddingCountry(true);
    try {
      const prebuilt = getDestinationsForCountry(c.id);
      if (prebuilt) {
        onAddDestinations(prebuilt);
      } else {
        const generated = await generateDestinations(c);
        onAddDestinations(generated);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setAddingCountry(false);
      setShowAddCountry(false);
    }
  };

  const selectedIds = new Set(selected.map((d) => d.id));
  const mustVisitDests = destinations.filter((d) => d.mustVisit);

  // Get unique regions in order of appearance
  const regions = Array.from(new Set(destinations.map((d) => d.region)));

  const toggle = (id: string) => {
    if (selectedIds.has(id)) {
      onSelect(selected.filter((d) => d.id !== id));
    } else {
      const dest = destinations.find((d) => d.id === id);
      if (dest) onSelect([...selected, dest]);
    }
  };

  const totalDays = selected.reduce((sum, d) => {
    return sum + Math.round((d.recommendedDays[0] + d.recommendedDays[1]) / 2);
  }, 0);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: `${country.colour}08` }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#0077B6]/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-32">
        {/* Back button */}
        <button onClick={onBackToCountries}
          className="text-xs text-gray-500 hover:text-white glass rounded-lg px-3 py-1.5 hover:bg-white/8 transition-all mb-6">
          ← All Countries
        </button>

        {/* Hero */}
        <div className="text-center mb-12 animate-fade-up">
          <span className="text-5xl block mb-4">{country.emoji}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            Explore <span style={{ color: country.colour }}>{country.name}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            {country.tagline}. Pick your destinations below.
          </p>
        </div>

        {/* Must Visit Featured Section */}
        {mustVisitDests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[#E6A817] text-lg">★</span>
              <h2 className="text-sm font-bold text-[#E6A817] tracking-[3px] uppercase">Must Visit</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#E6A817]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mustVisitDests.map((d) => (
                <DestinationCard key={d.id} destination={d} selected={selectedIds.has(d.id)} onToggle={toggle} />
              ))}
            </div>
          </div>
        )}

        {/* Region Sections */}
        {regions.map((region) => {
          const regionDests = destinations.filter((d) => d.region === region);
          return (
            <div key={region} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-sm font-bold text-gray-500 tracking-[3px] uppercase">{region}</h2>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] text-gray-600">{regionDests.length} destinations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {regionDests.map((d) => (
                  <DestinationCard key={`${region}-${d.id}`} destination={d} selected={selectedIds.has(d.id)} onToggle={toggle} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add from another country */}
        {onAddDestinations && (
          <div className="mt-8 mb-4">
            {!showAddCountry ? (
              <button onClick={() => setShowAddCountry(true)}
                className="w-full max-w-md mx-auto block rounded-2xl border border-dashed border-white/10 bg-[#131B2E] p-5 text-center hover:border-white/20 transition-all">
                <span className="text-2xl block mb-2">🌍</span>
                <span className="text-white font-semibold text-sm block">Add destinations from another country</span>
                <span className="text-gray-500 text-xs block mt-1">Build a multi-country trip</span>
              </button>
            ) : addingCountry ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-500 text-xs">Loading destinations...</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-[#131B2E] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">Pick a country to add</h3>
                  <button onClick={() => setShowAddCountry(false)} className="text-gray-500 hover:text-white text-sm">×</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {countries.filter((c) => c.id !== country.id).map((c) => (
                    <button key={c.id} onClick={() => handleAddFromCountry(c)}
                      className="rounded-xl border border-white/6 bg-[#0F1729] hover:bg-[#182036] hover:border-white/12 p-2.5 text-center transition-all">
                      <span className="text-lg block">{c.emoji}</span>
                      <span className="text-[10px] text-gray-400 block mt-1">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-t from-[#0B1120] via-[#0B1120]/98 to-transparent pt-8 pb-5 px-4">
          <div className="max-w-lg mx-auto">
            <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl shadow-black/30">
              <div>
                <p className="text-white font-semibold text-sm">
                  {selected.length === 0 ? 'No destinations yet' : `${selected.length} destination${selected.length !== 1 ? 's' : ''} selected`}
                </p>
                {selected.length > 0 && (
                  <p className="text-gray-500 text-xs mt-0.5">~{totalDays} days recommended</p>
                )}
              </div>
              <button onClick={onNext} disabled={selected.length === 0}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  selected.length > 0
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85D26] text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 pulse-ring'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

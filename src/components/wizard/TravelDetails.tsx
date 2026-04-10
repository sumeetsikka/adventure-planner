import { useState, useMemo } from 'react';
import type { Destination, VibeOption } from '../../types';
import { calculateMidpointDays, determineEntryCity, orderDestinations } from '../../lib/routePlanner';
import { formatDateAU, addDaysISO, todayISO } from '../../lib/dateUtils';

interface Props {
  destinations: Destination[];
  departureDate: string;
  returnDate: string;
  travellers: number;
  ages: number[];
  vibes: VibeOption[];
  onUpdate: (data: {
    departureDate: string;
    returnDate: string;
    travellers: number;
    ages: number[];
    vibes: VibeOption[];
  }) => void;
  onBack: () => void;
  onGenerate: () => void;
}

const VIBES: { value: VibeOption; label: string; icon: string; desc: string }[] = [
  { value: 'adventure', label: 'Adventure', icon: '⚡', desc: 'Canyoning, motorbikes, thrills' },
  { value: 'beach', label: 'Beach', icon: '🏖️', desc: 'Sun, sand, surf, snorkelling' },
  { value: 'culture', label: 'Culture', icon: '🏛️', desc: 'Temples, history, traditions' },
  { value: 'foodie', label: 'Foodie', icon: '🍜', desc: 'Street food, cooking classes' },
  { value: 'nature', label: 'Nature', icon: '🌿', desc: 'Trekking, jungles, rice terraces' },
  { value: 'nightlife', label: 'Nightlife', icon: '🍻', desc: 'Rooftop bars, bia hoi, clubs' },
  { value: 'romance', label: 'Romance', icon: '💕', desc: 'Couples, sunsets, intimate dining' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', desc: 'Kid-friendly, safe, educational' },
  { value: 'luxury', label: 'Luxury', icon: '✨', desc: 'Five-star, spas, fine dining' },
  { value: 'backpacker', label: 'Backpacker', icon: '🎒', desc: 'Budget, hostels, local transport' },
  { value: 'photography', label: 'Photography', icon: '📸', desc: 'Golden hour, iconic shots' },
  { value: 'wellness', label: 'Wellness', icon: '🧘', desc: 'Yoga, spas, mindful travel' },
  { value: 'history', label: 'History', icon: '📜', desc: 'War sites, museums, heritage' },
];

export default function TravelDetails({
  destinations,
  travellers,
  ages,
  vibes,
  onUpdate,
  onBack,
  onGenerate,
}: Props) {
  const entryCity = determineEntryCity(destinations);
  const ordered = useMemo(() => orderDestinations(destinations, entryCity), [destinations, entryCity]);
  const recommendedDays = calculateMidpointDays(destinations);
  const minDays = destinations.reduce((s, d) => s + d.recommendedDays[0], 0);
  const maxDays = destinations.reduce((s, d) => s + d.recommendedDays[1], 0);

  const [tripDays, setTripDays] = useState(recommendedDays);
  const [useRecommended, setUseRecommended] = useState(true);
  const [startDate, setStartDate] = useState(addDaysISO(todayISO(), 30));
  const [localTravellers, setLocalTravellers] = useState(travellers);
  const [localAges, setLocalAges] = useState<number[]>(
    ages.length === travellers ? ages : Array(travellers).fill(30)
  );
  const [localVibes, setLocalVibes] = useState<VibeOption[]>(vibes.length > 0 ? vibes : ['adventure', 'foodie']);

  const endDate = addDaysISO(startDate, tripDays);

  const updateTravellers = (count: number) => {
    setLocalTravellers(count);
    if (localAges.length < count) {
      setLocalAges([...localAges, ...Array(count - localAges.length).fill(30)]);
    } else if (localAges.length > count) {
      setLocalAges(localAges.slice(0, count));
    }
  };

  const toggleVibe = (v: VibeOption) => {
    setLocalVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const handleGenerate = () => {
    onUpdate({
      departureDate: startDate,
      returnDate: endDate,
      travellers: localTravellers,
      ages: localAges,
      vibes: localVibes.length > 0 ? localVibes : ['adventure', 'foodie'],
    });
    onGenerate();
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#FF6B35]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Plan your trip</h1>
          <p className="text-gray-500 text-sm">We've mapped your ideal route. Adjust the details below.</p>
        </div>

        <div className="space-y-5 stagger-children">
          {/* Route Card */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[3px] mb-4">Your Route</h2>
            <div className="space-y-2.5">
              {ordered.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${d.colour}15` }}
                  >
                    {d.emoji}
                  </div>
                  <p className="text-white text-sm font-medium flex-1">{d.name}</p>
                  <span className="text-gray-500 text-xs">{d.recommendedDays[0]}-{d.recommendedDays[1]}d</span>
                  {i < ordered.length - 1 && (
                    <span className="text-gray-700 text-[10px]">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trip Length */}
          <div className="rounded-2xl p-5 border border-[#FF6B35]/15" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.06) 0%, rgba(11,17,32,1) 100%)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📅</span>
              <h2 className="text-white font-bold text-sm">Trip Length</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              We recommend <span className="text-[#FF6B35] font-bold text-xl">{recommendedDays} days</span> for this route.
            </p>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => { setUseRecommended(true); setTripDays(recommendedDays); }}
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  useRecommended
                    ? 'border-[#FF6B35]/40 bg-[#FF6B35]/10 text-[#FF6B35]'
                    : 'border-white/8 bg-white/3 text-gray-500 hover:border-white/15'
                }`}
              >
                ✅ Accept {recommendedDays} days
              </button>
              <button
                type="button"
                onClick={() => setUseRecommended(false)}
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  !useRecommended
                    ? 'border-[#FF6B35]/40 bg-[#FF6B35]/10 text-[#FF6B35]'
                    : 'border-white/8 bg-white/3 text-gray-500 hover:border-white/15'
                }`}
              >
                ✏️ Customise
              </button>
            </div>
            {!useRecommended && (
              <div className="flex items-center gap-3 glass rounded-xl p-3">
                <button type="button" onClick={() => setTripDays(Math.max(minDays, tripDays - 1))}
                  className="w-9 h-9 rounded-lg bg-white/8 text-white text-lg font-bold hover:bg-white/12 transition-colors flex items-center justify-center">-</button>
                <span className="text-2xl font-bold text-white w-10 text-center">{tripDays}</span>
                <button type="button" onClick={() => setTripDays(Math.min(maxDays + 5, tripDays + 1))}
                  className="w-9 h-9 rounded-lg bg-white/8 text-white text-lg font-bold hover:bg-white/12 transition-colors flex items-center justify-center">+</button>
                <span className="text-gray-500 text-xs">days</span>
              </div>
            )}
          </div>

          {/* Start Date + Preview */}
          <div className="glass rounded-2xl p-5">
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">When do you leave?</label>
            <input
              type="date"
              value={startDate}
              min={todayISO()}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35]/50 transition-colors mb-3"
            />
            <div className="bg-[#2D936C]/8 border border-[#2D936C]/15 rounded-xl p-3.5 flex items-center gap-3">
              <span className="text-lg">✈️</span>
              <div>
                <p className="text-white text-sm font-semibold">{formatDateAU(startDate)} to {formatDateAU(endDate)}</p>
                <p className="text-[#2D936C] text-xs">{tripDays} days of adventure</p>
              </div>
            </div>
          </div>

          {/* Travellers */}
          <div className="glass rounded-2xl p-5">
            <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Who's going?</label>
            <div className="flex items-center gap-4 mb-4">
              <button type="button" onClick={() => updateTravellers(Math.max(1, localTravellers - 1))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white text-lg hover:bg-white/10 transition-colors flex items-center justify-center">-</button>
              <div className="text-center">
                <span className="text-2xl font-bold text-white">{localTravellers}</span>
                <p className="text-gray-500 text-[10px]">traveller{localTravellers > 1 ? 's' : ''}</p>
              </div>
              <button type="button" onClick={() => updateTravellers(Math.min(10, localTravellers + 1))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white text-lg hover:bg-white/10 transition-colors flex items-center justify-center">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localAges.map((age, i) => (
                <div key={i} className="text-center">
                  <span className="text-[9px] text-gray-600 block mb-1">Age</span>
                  <input
                    type="number" min={1} max={99} value={age}
                    onChange={(e) => {
                      const next = [...localAges];
                      next[i] = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
                      setLocalAges(next);
                    }}
                    className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-center text-sm focus:outline-none focus:border-[#FF6B35]/50 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Vibes (multi-select) */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Your vibes</label>
              <span className="text-[10px] text-gray-600">{localVibes.length} selected · pick as many as you like</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VIBES.map((v) => {
                const isActive = localVibes.includes(v.value);
                return (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => toggleVibe(v.value)}
                    className={`group px-3 py-3 rounded-xl text-left transition-all duration-300 border ${
                      isActive
                        ? 'border-[#FF6B35]/40 bg-[#FF6B35]/8 shadow-lg shadow-[#FF6B35]/5'
                        : 'border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/4'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg">{v.icon}</span>
                      {isActive && <span className="text-[#FF6B35] text-xs">✓</span>}
                    </div>
                    <span className={`text-xs font-semibold block ${isActive ? 'text-white' : 'text-gray-400'}`}>{v.label}</span>
                    <span className="text-[9px] text-gray-600 leading-tight block">{v.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8">
          <button type="button" onClick={onBack}
            className="px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white border border-white/8 hover:border-white/15 transition-all">
            ← Back
          </button>
          <button type="button" onClick={handleGenerate}
            className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#E85D26] shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300 text-base">
            Generate My Trip 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

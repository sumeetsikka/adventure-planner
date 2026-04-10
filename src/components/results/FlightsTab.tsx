import { useState } from 'react';
import type { FlightLeg, TravelConfig } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';
import { getFlightLinks } from '../../lib/bookingLinks';

interface Props {
  flights: FlightLeg[];
  config?: TravelConfig;
}

export default function FlightsTab({ flights, config }: Props) {
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);

  if (flights.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">✈️</span>
        <p className="text-white font-medium mb-1">Flight recommendations are loading</p>
        <p className="text-gray-600 text-sm">If this persists, try regenerating your trip.</p>
      </div>
    );
  }

  const selected = selectedFlight !== null ? flights[selectedFlight] : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Your Flight Plan</h2>
        <p className="text-gray-500 text-sm">Tap any flight to see full details, airlines, and booking links.</p>
      </div>

      {/* Detail overlay */}
      {selected && (
        <div className="mb-6 animate-fade-up">
          <div className="rounded-2xl border border-white/10 bg-[#131B2E] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selected.type === 'international' ? '✈️' : '🛫'}</span>
                <div>
                  <h3 className="text-white font-bold text-lg">{selected.leg}</h3>
                  <p className="text-[#E6A817] font-semibold text-sm">{formatDateAU(selected.date)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedFlight(null)}
                className="text-gray-500 hover:text-white text-xl w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">×</button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="bg-[#0F1729] rounded-xl p-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Route</p>
                <p className="text-white font-mono font-bold">{selected.from_code} → {selected.to_code}</p>
              </div>
              <div className="bg-[#0F1729] rounded-xl p-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Duration</p>
                <p className="text-gray-300 font-medium">{selected.duration}</p>
              </div>
              <div className="bg-[#0F1729] rounded-xl p-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Stops</p>
                <p className="text-gray-300 font-medium">{selected.stops}</p>
              </div>
              <div className="bg-[#0F1729] rounded-xl p-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Price est.</p>
                <p className="text-[#2D936C] font-bold text-lg">{selected.price_estimate_aud}</p>
              </div>
            </div>

            {/* Airlines */}
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Recommended Airlines</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {selected.airlines.map((a) => (
                <div key={a} className="flex items-center gap-1.5 bg-[#0F1729] border border-white/5 rounded-xl px-3.5 py-2">
                  <span>✈️</span>
                  <span className="text-white text-sm font-medium">{a}</span>
                </div>
              ))}
            </div>

            {/* Tip */}
            {selected.tip && (
              <div className="bg-[#0077B6]/8 border border-[#0077B6]/15 rounded-xl p-4 mb-5">
                <p className="text-[#0077B6] text-sm"><span className="font-semibold">💡 Tip:</span> {selected.tip}</p>
              </div>
            )}

            {/* Booking buttons - real deep links */}
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Compare and Book</p>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const adults = config?.travellers || 2;
                const children = config?.ages?.filter(a => a < 18).length || 0;
                const links = getFlightLinks(selected.from_code, selected.to_code, selected.date, undefined, adults, children);
                return Object.entries(links).map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#E6A817]/15 to-[#E6A817]/5 border border-[#E6A817]/20 text-[#E6A817] hover:-translate-y-0.5 hover:shadow-lg transition-all inline-flex items-center gap-1">
                    {name} ↗
                  </a>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Flight cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {flights.map((f, i) => {
          const isIntl = f.type === 'international';
          const accent = isIntl ? '#FF6B35' : '#2D936C';
          const isSelected = selectedFlight === i;

          return (
            <div key={i}
              onClick={() => setSelectedFlight(isSelected ? null : i)}
              className={`group rounded-2xl p-4 border cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-white/20 bg-[#182036] ring-1 ring-white/10'
                  : 'border-white/8 bg-[#131B2E] hover:border-white/15 hover:bg-[#182036] hover:-translate-y-0.5 hover:shadow-lg'
              }`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{isIntl ? '✈️' : '🛫'}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: accent }}>
                    {isIntl ? 'INTL' : 'DOMESTIC'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[#2D936C] font-bold text-base">{f.price_estimate_aud}</p>
                  <p className="text-gray-600 text-[9px]">per person</p>
                </div>
              </div>

              {/* Route */}
              <h4 className="text-white font-bold text-sm mb-1 leading-snug">{f.leg}</h4>
              <p className="text-[#E6A817] text-xs font-semibold mb-1">{formatDateAU(f.date)}</p>
              <p className="text-gray-500 text-[10px] mb-3">
                {f.from_code} → {f.to_code} · {f.duration} · {f.stops}
              </p>

              {/* Airlines preview */}
              <div className="flex flex-wrap gap-1 mb-3">
                {f.airlines.slice(0, 2).map((a) => (
                  <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{a}</span>
                ))}
              </div>

              {/* Quick booking links */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap">
                {(() => {
                  const adults = config?.travellers || 2;
                  const children = config?.ages?.filter(a => a < 18).length || 0;
                  const links = getFlightLinks(f.from_code, f.to_code, f.date, undefined, adults, children);
                  return Object.entries(links).map(([name, url]) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[#E6A817]/10 text-[#E6A817] hover:bg-[#E6A817]/20 transition-colors">
                      {name} ↗
                    </a>
                  ));
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

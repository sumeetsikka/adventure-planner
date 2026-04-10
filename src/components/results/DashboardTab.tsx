import type { TravelConfig, GenerationResults, ResultsTab } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';

interface Props {
  config: TravelConfig;
  results: GenerationResults;
  onTabChange: (tab: ResultsTab) => void;
}

function parseCostMid(cost: string): number {
  const nums = cost.match(/[\d,]+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map((n) => parseInt(n.replace(/,/g, '')));
  return values.length === 1 ? values[0] : Math.round((values[0] + values[1]) / 2);
}

export default function DashboardTab({ config, results, onTabChange }: Props) {
  const totalDays = Math.round(
    (new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const perPersonBudget = results.budget.reduce((sum, b) => sum + parseCostMid(b.cost), 0);
  const groupBudget = perPersonBudget * config.travellers;

  const stats = [
    { icon: '✈️', label: 'Flights', value: results.flights.length, action: 'flights' as ResultsTab },
    { icon: '🏨', label: 'Hotels', value: results.hotels.length, action: 'hotels' as ResultsTab },
    { icon: '🚆', label: 'Transport', value: results.transport.length, action: 'transport' as ResultsTab },
    { icon: '📅', label: 'Days', value: results.itinerary.length, action: 'itinerary' as ResultsTab },
  ];

  return (
    <div>
      {/* Hero card */}
      <div className="rounded-2xl border border-white/10 bg-[#131B2E] p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          <span className="text-5xl">{config.country?.emoji || '🌍'}</span>
          <div>
            <h2 className="text-white font-bold text-2xl">{config.country?.name || 'Adventure'}</h2>
            <p className="text-gray-400 text-sm">
              {formatDateAU(config.departureDate)} to {formatDateAU(config.returnDate)} · {totalDays} days · {config.travellers} traveller{config.travellers > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Route preview */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {config.destinations.map((d, i) => (
            <div key={d.id} className="flex items-center gap-2">
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
                style={{ background: `${d.colour}0A`, color: d.colour, borderColor: `${d.colour}20` }}>
                {d.emoji} {d.name.split('(')[0].split('/')[0].trim()}
              </span>
              {i < config.destinations.length - 1 && <span className="text-gray-600 text-xs">→</span>}
            </div>
          ))}
        </div>

        {/* Budget summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0F1729] rounded-xl p-4">
            <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Per Person</p>
            <p className="text-[#2D936C] font-bold text-2xl">${perPersonBudget.toLocaleString()}</p>
          </div>
          <div className="bg-[#0F1729] rounded-xl p-4">
            <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">Group Total</p>
            <p className="text-[#E6A817] font-bold text-2xl">${groupBudget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <button key={s.label} onClick={() => onTabChange(s.action)}
            className="bg-[#131B2E] border border-white/8 rounded-2xl p-4 text-center hover:border-white/15 hover:bg-[#182036] hover:-translate-y-0.5 transition-all">
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button onClick={() => onTabChange('flights')}
          className="flex items-center gap-3 bg-[#131B2E] border border-white/8 rounded-2xl p-4 hover:border-[#FF6B35]/30 hover:bg-[#FF6B35]/5 transition-all text-left">
          <span className="text-2xl">✈️</span>
          <div>
            <p className="text-white font-semibold text-sm">Book Flights</p>
            <p className="text-gray-500 text-[10px]">{results.flights.length} flights to compare</p>
          </div>
        </button>
        <button onClick={() => onTabChange('hotels')}
          className="flex items-center gap-3 bg-[#131B2E] border border-white/8 rounded-2xl p-4 hover:border-[#E6A817]/30 hover:bg-[#E6A817]/5 transition-all text-left">
          <span className="text-2xl">🏨</span>
          <div>
            <p className="text-white font-semibold text-sm">Book Hotels</p>
            <p className="text-gray-500 text-[10px]">{results.hotels.reduce((s, h) => s + h.hotels.length, 0)} options across {results.hotels.length} stops</p>
          </div>
        </button>
        <button onClick={() => onTabChange('bookings')}
          className="flex items-center gap-3 bg-[#131B2E] border border-white/8 rounded-2xl p-4 hover:border-[#2D936C]/30 hover:bg-[#2D936C]/5 transition-all text-left">
          <span className="text-2xl">📝</span>
          <div>
            <p className="text-white font-semibold text-sm">Track Bookings</p>
            <p className="text-gray-500 text-[10px]">Tick off what you've booked</p>
          </div>
        </button>
      </div>
    </div>
  );
}

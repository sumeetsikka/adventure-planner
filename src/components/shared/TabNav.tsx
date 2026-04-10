import type { ResultsTab } from '../../types';

interface Props {
  active: ResultsTab;
  onChange: (tab: ResultsTab) => void;
}

const TABS: { key: ResultsTab; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'itinerary', label: 'Itinerary', icon: '📅' },
  { key: 'flights', label: 'Flights', icon: '✈️' },
  { key: 'hotels', label: 'Hotels', icon: '🏨' },
  { key: 'transport', label: 'Transport', icon: '🚆' },
  { key: 'bookings', label: 'Bookings', icon: '📝' },
  { key: 'map', label: 'Map', icon: '🗺️' },
  { key: 'budget', label: 'Budget', icon: '💰' },
  { key: 'packing', label: 'Packing', icon: '🧳' },
  { key: 'weather', label: 'Weather', icon: '🌤️' },
  { key: 'visa', label: 'Visa', icon: '🛂' },
  { key: 'currency', label: 'Currency', icon: '💱' },
  { key: 'nearby', label: 'Nearby', icon: '📍' },
  { key: 'checklist', label: 'Checklist', icon: '✅' },
  { key: 'photos', label: 'Photos', icon: '📸' },
  { key: 'tips', label: 'Tips', icon: '📋' },
];

export default function TabNav({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 max-w-3xl">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200
            ${
              active === tab.key
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85D26] text-white shadow-md shadow-orange-500/20'
                : 'bg-[#131B2E] border border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/15 hover:bg-[#182036]'
            }
          `}
        >
          <span className="text-xs">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

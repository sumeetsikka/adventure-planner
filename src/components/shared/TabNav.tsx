import { useState } from 'react';
import type { ResultsTab } from '../../types';

interface Props {
  active: ResultsTab;
  onChange: (tab: ResultsTab) => void;
}

interface TabGroup {
  label: string;
  tabs: { key: ResultsTab; label: string; icon: string }[];
}

const TAB_GROUPS: TabGroup[] = [
  {
    label: 'Plan',
    tabs: [
      { key: 'dashboard', label: 'Dashboard', icon: '📊' },
      { key: 'itinerary', label: 'Itinerary', icon: '📅' },
      { key: 'map', label: 'Map', icon: '🗺️' },
    ],
  },
  {
    label: 'Book',
    tabs: [
      { key: 'flights', label: 'Flights', icon: '✈️' },
      { key: 'hotels', label: 'Hotels', icon: '🏨' },
      { key: 'transport', label: 'Transport', icon: '🚆' },
      { key: 'bookings', label: 'Bookings', icon: '📝' },
    ],
  },
  {
    label: 'Prepare',
    tabs: [
      { key: 'budget', label: 'Budget', icon: '💰' },
      { key: 'packing', label: 'Packing', icon: '🧳' },
      { key: 'weather', label: 'Weather', icon: '🌤️' },
      { key: 'visa', label: 'Visa', icon: '🛂' },
      { key: 'currency', label: 'Currency', icon: '💱' },
      { key: 'checklist', label: 'Checklist', icon: '✅' },
    ],
  },
  {
    label: 'Explore',
    tabs: [
      { key: 'nearby', label: 'Nearby', icon: '📍' },
      { key: 'photos', label: 'Photos', icon: '📸' },
      { key: 'tips', label: 'Tips', icon: '📋' },
      { key: 'chat', label: 'Ask AI', icon: '💬' },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap(g => g.tabs);

export default function TabNav({ active, onChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeTab = ALL_TABS.find(t => t.key === active);

  return (
    <div className="w-full max-w-4xl">
      {/* Mobile: Current tab + dropdown */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between bg-[#131B2E] border border-white/10 rounded-xl px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <span>{activeTab?.icon}</span>
            <span className="text-white font-semibold text-sm">{activeTab?.label}</span>
          </div>
          <span className={`text-gray-500 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}>▾</span>
        </button>

        {mobileOpen && (
          <div className="mt-2 bg-[#131B2E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/40">
            {TAB_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-4 py-2 bg-white/[0.02]">
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{group.label}</span>
                </div>
                {group.tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { onChange(tab.key); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      active === tab.key
                        ? 'bg-[#FF6B35]/10 text-white'
                        : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span className="text-sm font-medium">{tab.label}</span>
                    {active === tab.key && <span className="ml-auto text-[#FF6B35] text-xs">●</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Grouped horizontal tabs */}
      <div className="hidden sm:block">
        <div className="flex flex-wrap justify-center gap-1.5">
          {ALL_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
                active === tab.key
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85D26] text-white shadow-md shadow-orange-500/20'
                  : 'bg-[#131B2E] border border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/15 hover:bg-[#182036]'
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

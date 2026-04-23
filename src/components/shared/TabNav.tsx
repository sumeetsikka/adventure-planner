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
      { key: 'dashboard', label: 'Dashboard', icon: '◉' },
      { key: 'itinerary', label: 'Itinerary', icon: '❦' },
      { key: 'map', label: 'Map', icon: '◎' },
    ],
  },
  {
    label: 'Book',
    tabs: [
      { key: 'flights', label: 'Flights', icon: '✈' },
      { key: 'hotels', label: 'Hotels', icon: '◱' },
      { key: 'transport', label: 'Transport', icon: '➞' },
      { key: 'bookings', label: 'Bookings', icon: '✓' },
    ],
  },
  {
    label: 'Prepare',
    tabs: [
      { key: 'budget', label: 'Budget', icon: '$' },
      { key: 'packing', label: 'Packing', icon: '◫' },
      { key: 'weather', label: 'Weather', icon: '☀' },
      { key: 'visa', label: 'Visa', icon: '⌘' },
      { key: 'currency', label: 'Currency', icon: '¤' },
      { key: 'checklist', label: 'Checklist', icon: '☑' },
    ],
  },
  {
    label: 'Explore',
    tabs: [
      { key: 'nearby', label: 'Nearby', icon: '✦' },
      { key: 'photos', label: 'Photos', icon: '❐' },
      { key: 'tips', label: 'Tips', icon: '§' },
      { key: 'chat', label: 'Ask AI', icon: '✦' },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap(g => g.tabs);

export default function TabNav({ active, onChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeTab = ALL_TABS.find(t => t.key === active);
  const activeGroup = TAB_GROUPS.find(g => g.tabs.some(t => t.key === active));

  return (
    <div className="w-full">
      {/* Mobile: Current tab + dropdown */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between bg-[var(--ink-2)] border border-[var(--line)] rounded-full px-5 py-3 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-[var(--gold)]">{activeTab?.icon}</span>
            <span className="font-display text-lg text-[var(--cream)]">{activeTab?.label}</span>
            {activeGroup && <span className="eyebrow text-[var(--text-dim)]">{activeGroup.label}</span>}
          </div>
          <span className={`text-[var(--text-dim)] transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`}>▾</span>
        </button>

        {mobileOpen && (
          <div className="mt-2 bg-[var(--ink-2)] border border-[var(--line-strong)] rounded-2xl overflow-hidden shadow-2xl">
            {TAB_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-5 py-2 bg-[var(--ink-3)]">
                  <span className="eyebrow text-[var(--text-dim)]">{group.label}</span>
                </div>
                {group.tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { onChange(tab.key); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                      active === tab.key
                        ? 'bg-[var(--gold)]/10 text-[var(--cream)]'
                        : 'text-[var(--text-muted)] hover:bg-[var(--ink-3)] hover:text-[var(--cream)]'
                    }`}
                  >
                    <span className="text-base text-[var(--gold)] w-5">{tab.icon}</span>
                    <span className="text-sm font-light">{tab.label}</span>
                    {active === tab.key && <span className="ml-auto text-[var(--gold)] text-xs">●</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Editorial tab rail */}
      <div className="hidden sm:block">
        <div className="space-y-3">
          {TAB_GROUPS.map((group) => (
            <div key={group.label} className="flex items-center gap-4">
              <span className="eyebrow text-[var(--text-dim)] w-16 shrink-0">{group.label}</span>
              <div className="flex flex-wrap gap-1.5">
                {group.tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] tracking-wide whitespace-nowrap transition-all ${
                      active === tab.key
                        ? 'bg-[var(--cream)] text-[var(--ink)] font-medium'
                        : 'text-[var(--text-muted)] border border-[var(--line)] hover:border-[var(--line-strong)] hover:text-[var(--cream)]'
                    }`}
                  >
                    <span className="text-xs">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

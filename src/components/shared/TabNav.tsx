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
      { key: 'events', label: 'Events', icon: '❀' },
    ],
  },
  {
    label: 'Explore',
    tabs: [
      { key: 'taste', label: 'Taste', icon: '◐' },
      { key: 'do', label: 'Do', icon: '✦' },
      { key: 'nearby', label: 'Nearby', icon: '✦' },
      { key: 'photos', label: 'Photos', icon: '❐' },
      { key: 'tips', label: 'Tips', icon: '§' },
      { key: 'chat', label: 'Ask AI', icon: '✦' },
      { key: 'journal', label: 'Journal', icon: '❦' },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap(g => g.tabs);

export default function TabNav({ active, onChange }: Props) {
  const activeTab = ALL_TABS.find(t => t.key === active);
  const activeGroup = TAB_GROUPS.find(g => g.tabs.some(t => t.key === active));

  return (
    <div className="w-full">
      {/* Mobile: just the "you are here" breadcrumb (MobileBottomNav handles nav) */}
      <div className="sm:hidden">
        <div className="flex items-center gap-3 px-5 py-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-full">
          <span className="text-[var(--gold)] text-sm">{activeTab?.icon}</span>
          <span className="font-display text-base text-[var(--cream)]">{activeTab?.label}</span>
          {activeGroup && <span className="eyebrow text-[var(--text-dim)] ml-auto">{activeGroup.label}</span>}
        </div>
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

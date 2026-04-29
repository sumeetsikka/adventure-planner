import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ResultsTab } from '../../types';

/**
 * Mobile-only fixed bottom navigation.
 *
 * Shows the 4 most-used tabs in a thumb-reach bar plus a "More" sheet that
 * opens the full grouped list. Hidden at sm: and up — desktop continues to
 * use the editorial rail in <TabNav>.
 *
 * Designed to coexist with TabNav: TabNav renders a slim "current tab"
 * pill on mobile (kept for context); this bottom bar is the actual nav.
 */

interface Props {
  active: ResultsTab;
  onChange: (tab: ResultsTab) => void;
}

interface NavItem {
  key: ResultsTab;
  label: string;
  icon: string;
}

const PRIMARY: NavItem[] = [
  { key: 'dashboard', label: 'Today', icon: '◉' },
  { key: 'itinerary', label: 'Plan', icon: '❦' },
  { key: 'map', label: 'Map', icon: '◎' },
  { key: 'bookings', label: 'Book', icon: '✓' },
];

const SHEET_GROUPS: Array<{ label: string; tabs: NavItem[] }> = [
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
      { key: 'nearby', label: 'Nearby', icon: '✦' },
      { key: 'photos', label: 'Photos', icon: '❐' },
      { key: 'tips', label: 'Tips', icon: '§' },
      { key: 'chat', label: 'Ask AI', icon: '✦' },
      { key: 'journal', label: 'Journal', icon: '❦' },
    ],
  },
];

export default function MobileBottomNav({ active, onChange }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSelect = (key: ResultsTab) => {
    onChange(key);
    setSheetOpen(false);
  };

  return (
    <>
      {/* Bottom bar */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 print:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Primary"
      >
        <div className="bg-[var(--ink-2)]/95 backdrop-blur-xl border-t border-[var(--line-strong)]">
          <div className="grid grid-cols-5 px-1 py-1">
            {PRIMARY.map((item) => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleSelect(item.key)}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${
                    isActive ? 'text-[var(--gold)]' : 'text-[var(--text-muted)] hover:text-[var(--cream)]'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span className="text-[10px] tracking-wider uppercase">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setSheetOpen(true)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${
                sheetOpen ? 'text-[var(--gold)]' : 'text-[var(--text-muted)] hover:text-[var(--cream)]'
              }`}
              aria-label="More"
            >
              <span className="text-lg leading-none">≡</span>
              <span className="text-[10px] tracking-wider uppercase">More</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm print:hidden"
              onClick={() => setSheetOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="sm:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[var(--ink-2)] border-t border-[var(--line-strong)] print:hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
              role="dialog"
              aria-label="All sections"
            >
              <div className="sticky top-0 bg-[var(--ink-2)] pt-3 pb-2 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-[var(--line-strong)]" />
              </div>
              <div className="px-5 pb-2 flex items-center justify-between">
                <span className="eyebrow">All sections</span>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--cream)] text-2xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="px-2 pb-6 space-y-4">
                {SHEET_GROUPS.map((group) => (
                  <section key={group.label} className="px-3">
                    <p className="eyebrow mb-3 text-[var(--text-dim)]">{group.label}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {group.tabs.map((tab) => {
                        const isActive = active === tab.key;
                        return (
                          <button
                            key={tab.key}
                            onClick={() => handleSelect(tab.key)}
                            className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all border ${
                              isActive
                                ? 'bg-[var(--gold)]/10 border-[var(--gold)]/40 text-[var(--cream)]'
                                : 'bg-[var(--ink-3)] border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)]'
                            }`}
                          >
                            <span className={`text-lg leading-none ${isActive ? 'text-[var(--gold)]' : ''}`}>{tab.icon}</span>
                            <span className="text-[11px] tracking-wide">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

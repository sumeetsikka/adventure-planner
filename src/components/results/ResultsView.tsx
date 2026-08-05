import { useState, useCallback, lazy, Suspense } from 'react';
import type { ResultsTab, TravelConfig, GenerationResults, ItineraryDay, DestinationActivities, DestinationRestaurants } from '../../types';
import { formatDateAU, addDaysISO } from '../../lib/dateUtils';
import { openEmailWithTrip } from '../../lib/emailTrip';
import { searchFlights, searchHotels, generateBudget, generateTips, generatePacking, generateWeather, generateVisa, generateCurrency, generateNearby, generateTransport } from '../../lib/api';
import TabNav from '../shared/TabNav';
import MobileBottomNav from '../shared/MobileBottomNav';
import ErrorBoundary from '../shared/ErrorBoundary';
import { useToast } from '../shared/Toast';
import DashboardTab from './DashboardTab';
import { encodeTripToUrl, shareOrCopy } from '../../lib/tripUrl';

// Lazy-load every other tab so the initial bundle stays small.
// Dashboard is eager because it's the default landing tab.
const FlightsTab = lazy(() => import('./FlightsTab'));
const HotelsTab = lazy(() => import('./HotelsTab'));
const ItineraryTab = lazy(() => import('./ItineraryTab'));
const BudgetTab = lazy(() => import('./BudgetTab'));
const TipsTab = lazy(() => import('./TipsTab'));
const PackingTab = lazy(() => import('./PackingTab'));
const WeatherTab = lazy(() => import('./WeatherTab'));
const VisaTab = lazy(() => import('./VisaTab'));
const CurrencyTab = lazy(() => import('./CurrencyTab'));
const NearbyTab = lazy(() => import('./NearbyTab'));
const ChecklistTab = lazy(() => import('./ChecklistTab'));
const PhotosTab = lazy(() => import('./PhotosTab'));
const TransportTab = lazy(() => import('./TransportTab'));
const BookingTrackerTab = lazy(() => import('./BookingTrackerTab'));
const RouteMapTab = lazy(() => import('./RouteMapTab'));
const ChatTab = lazy(() => import('./ChatTab'));
const WalletTab = lazy(() => import('./WalletTab'));
const EventsTab = lazy(() => import('./EventsTab'));
const JournalTab = lazy(() => import('./JournalTab'));
const TasteTab = lazy(() => import('./TasteTab'));
const DoTab = lazy(() => import('./DoTab'));
const PrepareTab = lazy(() => import('./PrepareTab'));

function TabFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border border-[var(--text-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
    </div>
  );
}

// --- Undo support -----------------------------------------------------------
// Every plan edit flows through onUpdateResults, so we detect a *removal* by
// counting the removable items in just the keys that changed. Several shapes
// group items by destination, so removing one shrinks an INNER array without
// changing the top-level length — those need a deep count, or the removal
// registers as "nothing changed" and no undo is offered.
function itemCount(key: keyof GenerationResults, value: GenerationResults[keyof GenerationResults] | undefined): number {
  if (!Array.isArray(value)) return 0;
  switch (key) {
    case 'itinerary':
      return (value as ItineraryDay[]).reduce(
        (n, d) => n + (d.activities?.length || 0) + (d.timeline?.length || 0), 0);
    case 'activities':
      return (value as DestinationActivities[]).reduce((n, g) => n + (g.activities?.length || 0), 0);
    case 'restaurants':
      return (value as DestinationRestaurants[]).reduce((n, g) => n + (g.restaurants?.length || 0), 0);
    default:
      return value.length;
  }
}

function removedItemCount(prev: GenerationResults, partial: Partial<GenerationResults>): number {
  let before = 0, after = 0;
  for (const key of Object.keys(partial) as (keyof GenerationResults)[]) {
    before += itemCount(key, prev[key]);
    after += itemCount(key, partial[key]);
  }
  return before - after;
}

/** Type-safe copy of the named keys — the previous values to restore on undo. */
function pickKeys<K extends keyof GenerationResults>(
  obj: GenerationResults, keys: K[],
): Pick<GenerationResults, K> {
  const out = {} as Pick<GenerationResults, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

interface Props {
  config: TravelConfig;
  results: GenerationResults;
  onStartOver: () => void;
  onUpdateResults: (results: Partial<GenerationResults>) => void;
  /** Per-section generation progress. Results open as soon as the itinerary is
   *  ready, so a section with no data yet is usually still in flight rather than
   *  failed — this is what tells those two states apart. Absent (e.g. a trip
   *  loaded from storage) means nothing is generating. */
  progress?: Partial<Record<string, boolean>>;
}

function generateICS(results: GenerationResults, config: TravelConfig): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AdventurePlanner//EN'];
  for (const day of results.itinerary) {
    const dateStr = addDaysISO(config.departureDate, day.day - 1).replace(/-/g, '');
    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    lines.push(`SUMMARY:Day ${day.day}: ${day.title}`);
    lines.push(`DESCRIPTION:${(day.activities || []).join('\\n')}`);
    lines.push(`LOCATION:${day.location}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Shown while a section is still being generated. Since results now open as soon
 *  as the itinerary is ready, most tabs are legitimately mid-flight on arrival —
 *  offering "Retry" there would be wrong and would fire a duplicate LLM call. */
function SectionPending({ label }: { label: string }) {
  return (
    <div className="text-center py-16" role="status" aria-live="polite">
      <div className="w-6 h-6 mx-auto mb-5 border border-[var(--text-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
      <p className="text-[var(--cream)] font-medium mb-2">Still writing your {label}…</p>
      <p className="text-[var(--text-muted)] text-sm">The rest of your plan is ready — this section will appear here shortly.</p>
    </div>
  );
}

function RetryButton({ label, onRetry, pending }: { label: string; onRetry: () => Promise<void>; pending?: boolean }) {
  const [retrying, setRetrying] = useState(false);
  const handleClick = async () => {
    setRetrying(true);
    try { await onRetry(); } finally { setRetrying(false); }
  };
  if (pending) return <SectionPending label={label} />;
  return (
    <div className="text-center py-16">
      <span className="text-5xl block mb-4">{label === 'flights' ? '✈️' : label === 'hotels' ? '🏨' : label === 'transport' ? '🚆' : label === 'tips' ? '📋' : label === 'packing' ? '🧳' : label === 'weather' ? '🌤️' : label === 'visa' ? '🛂' : label === 'currency' ? '💱' : label === 'nearby' ? '📍' : '🔄'}</span>
      <p className="text-[var(--cream)] font-medium mb-2">Data not available yet</p>
      <p className="text-[var(--text-muted)] text-sm mb-6">The AI service may have been busy. Click to try again.</p>
      <button onClick={handleClick} disabled={retrying}
        className="px-6 py-3 rounded-xl font-semibold text-white bg-[var(--terracotta)] hover:shadow-lg transition-all disabled:opacity-50">
        {retrying ? 'Generating...' : 'Retry'}
      </button>
    </div>
  );
}

export default function ResultsView({ config, results, onStartOver, onUpdateResults, progress }: Props) {
  // A section is "pending" only while a generation run is actually underway.
  const isPending = (key: string) => progress ? progress[key] === false : false;
  const [activeTab, setActiveTab] = useState<ResultsTab>('dashboard');
  const [pdfBusy, setPdfBusy] = useState(false);
  const toast = useToast();

  // Undo-aware wrapper around every plan edit. When an update removes items
  // (remove a stop, a restaurant, an activity, a chat-driven deletion), it
  // snapshots the prior values of the changed keys and offers a one-tap Undo —
  // previously every ✕ mutated the plan instantly with no way back.
  const handleUpdate = useCallback((partial: Partial<GenerationResults>) => {
    const removed = removedItemCount(results, partial);
    if (removed <= 0) { onUpdateResults(partial); return; }
    const snapshot = pickKeys(results, Object.keys(partial) as (keyof GenerationResults)[]);
    onUpdateResults(partial);
    toast(
      removed === 1 ? 'Removed' : `Removed ${removed} items`,
      'default',
      { label: 'Undo', onClick: () => onUpdateResults(snapshot) },
    );
  }, [results, onUpdateResults, toast]);

  const totalDays = Math.round(
    (new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleCalendarExport = () => {
    const ics = generateICS(results, config);
    downloadFile(ics, `${config.country?.name || 'trip'}-itinerary.ics`, 'text/calendar');
    toast('Calendar file downloaded', 'success');
  };

  return (
    <div className="min-h-screen relative print:bg-white pb-20 sm:pb-0">
      <div className="relative max-w-5xl mx-auto px-6 py-10 print:p-0">
        {/* Header */}
        <div className="mb-10 print:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 print:hidden">
            <button onClick={onStartOver} className="eyebrow text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors self-start">
              ← Start Over
            </button>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button onClick={async () => {
                  const url = encodeTripToUrl(config);
                  const result = await shareOrCopy({
                    title: `${config.country?.name || 'My'} adventure`,
                    text: `Check out my ${config.country?.name || ''} trip itinerary, planned with Adventure Planner.`,
                    url,
                  });
                  if (result === 'cancelled') return;
                  toast(result === 'shared' ? 'Shared!' : 'Link copied to clipboard', 'success');
                }}
                className="text-[11px] tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3.5 py-1.5 transition-all">
                Share
              </button>
              <button onClick={() => { openEmailWithTrip(config, results); toast('Opening your email client…'); }}
                className="text-[11px] tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3.5 py-1.5 transition-all">
                Email
              </button>
              <button onClick={handleCalendarExport}
                className="text-[11px] tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3.5 py-1.5 transition-all">
                Calendar
              </button>
              <button
                disabled={pdfBusy}
                onClick={async () => {
                  setPdfBusy(true);
                  toast('Generating your PDF…');
                  try {
                    const { generateTripPdf } = await import('../../lib/tripPdf');
                    const blob = await generateTripPdf(config, results);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${config.country?.name || 'trip'}-adventure-planner.pdf`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast('PDF saved', 'success');
                  } catch {
                    toast('PDF failed — try again', 'error');
                  } finally {
                    setPdfBusy(false);
                  }
                }}
                className="text-[11px] tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] hover:border-[var(--line-strong)] rounded-full px-3.5 py-1.5 transition-all disabled:opacity-50">
                {pdfBusy ? 'PDF…' : 'PDF'}
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-5 print:hidden">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-gentle-pulse" />
              <span className="eyebrow">Your journey · ready</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl text-[var(--cream)] mb-4 print:text-black">
              {config.country?.name || 'Your'}<br />
              <em className="italic text-shimmer">adventure.</em>
            </h1>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[var(--text-muted)] text-sm print:text-[var(--text-dim)] font-light">
              <span>{config.travellers} traveller{config.travellers > 1 ? 's' : ''}</span>
              <span className="text-[var(--text-dim)]">·</span>
              <span>{formatDateAU(config.departureDate)} → {formatDateAU(config.returnDate)}</span>
              <span className="text-[var(--text-dim)]">·</span>
              <span>{totalDays} days</span>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 mt-5 print:hidden">
              {config.destinations.map((d) => (
                <span key={d.id} className="text-[10px] font-light tracking-wider px-3 py-1 rounded-full border"
                  style={{ background: `${d.colour}10`, color: 'var(--cream)', borderColor: `${d.colour}30` }}>
                  {d.emoji} {d.name.split('(')[0].split('/')[0].trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10 print:hidden">
          <TabNav active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="animate-fade-up">
          {activeTab === 'prepare' && (
            <PrepareTab config={config} visa={results.visa} />
          )}
          {activeTab === 'dashboard' && (
            <DashboardTab config={config} results={results} onTabChange={setActiveTab} />
          )}
          <ErrorBoundary key={activeTab} label={activeTab}>
          <Suspense fallback={<TabFallback />}>
          {activeTab === 'itinerary' && (
            <ItineraryTab itinerary={results.itinerary} config={config} hotels={results.hotels}
              flights={results.flights} transport={results.transport} weather={results.weather}
              onUpdate={(itinerary) => handleUpdate({ itinerary })} />
          )}
          {activeTab === 'flights' && (results.flights.length > 0
            ? <FlightsTab flights={results.flights} config={config} />
            : <RetryButton label="flights" pending={isPending('flights')} onRetry={async () => { const d = await searchFlights(config); onUpdateResults({ flights: d }); }} />
          )}
          {activeTab === 'hotels' && (results.hotels.length > 0
            ? <HotelsTab hotels={results.hotels} destinations={config.destinations} config={config} onUpdate={(hotels) => handleUpdate({ hotels })} />
            : <RetryButton label="hotels" pending={isPending('hotels')} onRetry={async () => { const d = await searchHotels(config); onUpdateResults({ hotels: d }); }} />
          )}
          {activeTab === 'transport' && (results.transport.length > 0
            ? <TransportTab transport={results.transport} />
            : <RetryButton label="transport" pending={isPending('transport')} onRetry={async () => { const d = await generateTransport(config); onUpdateResults({ transport: d }); }} />
          )}
          {activeTab === 'bookings' && (
            <BookingTrackerTab config={config} results={results} />
          )}
          {activeTab === 'map' && (
            <RouteMapTab config={config} results={results} />
          )}
          {activeTab === 'budget' && (results.budget.length > 0
            ? <BudgetTab budget={results.budget} config={config} flights={results.flights} transport={results.transport} hotels={results.hotels} itinerary={results.itinerary} onUpdate={(budget) => handleUpdate({ budget })} />
            : <RetryButton label="budget" pending={isPending('budget')} onRetry={async () => { const d = await generateBudget(config); onUpdateResults({ budget: d }); }} />
          )}
          {activeTab === 'tips' && (results.tips.length > 0
            ? <TipsTab tips={results.tips} />
            : <RetryButton label="tips" pending={isPending('tips')} onRetry={async () => { const d = await generateTips(config); onUpdateResults({ tips: d }); }} />
          )}
          {activeTab === 'packing' && (results.packing.length > 0
            ? <PackingTab packing={results.packing} />
            : <RetryButton label="packing" pending={isPending('packing')} onRetry={async () => { const d = await generatePacking(config); onUpdateResults({ packing: d }); }} />
          )}
          {activeTab === 'weather' && (results.weather.length > 0
            ? <WeatherTab weather={results.weather} />
            : <RetryButton label="weather" pending={isPending('weather')} onRetry={async () => { const d = await generateWeather(config); onUpdateResults({ weather: d }); }} />
          )}
          {activeTab === 'visa' && (results.visa
            ? <VisaTab visa={results.visa} travellers={config.travellers} departureDate={config.departureDate} countryId={config.country?.id} />
            : <RetryButton label="visa" pending={isPending('visa')} onRetry={async () => { const d = await generateVisa(config); onUpdateResults({ visa: d }); }} />
          )}
          {activeTab === 'currency' && (results.currency
            ? <CurrencyTab currency={results.currency} country={config.country?.name} />
            : <RetryButton label="currency" pending={isPending('currency')} onRetry={async () => { const d = await generateCurrency(config); onUpdateResults({ currency: d }); }} />
          )}
          {activeTab === 'nearby' && (results.nearby.length > 0
            ? <NearbyTab nearby={results.nearby} destinations={config.destinations} config={config} itinerary={results.itinerary} />
            : <RetryButton label="nearby" pending={isPending('nearby')} onRetry={async () => { const d = await generateNearby(config); onUpdateResults({ nearby: d }); }} />
          )}
          {activeTab === 'checklist' && <ChecklistTab config={config} />}
          {activeTab === 'wallet' && <WalletTab config={config} />}
          {activeTab === 'photos' && <PhotosTab destinations={config.destinations} />}
          {activeTab === 'chat' && <ChatTab config={config} results={results} onUpdateResults={handleUpdate} />}
          {activeTab === 'events' && <EventsTab config={config} />}
          {activeTab === 'journal' && <JournalTab config={config} results={results} />}
          {activeTab === 'taste' && (results.restaurants && results.restaurants.length > 0
            ? <TasteTab restaurants={results.restaurants} config={config} itinerary={results.itinerary} onUpdate={(restaurants) => handleUpdate({ restaurants })} onUpdateItinerary={(itinerary) => handleUpdate({ itinerary })} />
            : <RetryButton label="restaurants" pending={isPending('restaurants')} onRetry={async () => { const d = await import('../../lib/api').then(m => m.generateRestaurants(config)); onUpdateResults({ restaurants: d }); }} />
          )}
          {activeTab === 'do' && (results.activities && results.activities.length > 0
            ? <DoTab activities={results.activities} config={config} itinerary={results.itinerary} onUpdate={(activities) => handleUpdate({ activities })} onUpdateItinerary={(itinerary) => handleUpdate({ itinerary })} />
            : <RetryButton label="activities" pending={isPending('activities')} onRetry={async () => { const d = await import('../../lib/api').then(m => m.generateActivities(config)); onUpdateResults({ activities: d }); }} />
          )}
          </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      <MobileBottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

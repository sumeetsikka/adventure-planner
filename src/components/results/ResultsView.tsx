import { useState } from 'react';
import type { ResultsTab, TravelConfig, GenerationResults } from '../../types';
import { formatDateAU, addDaysISO } from '../../lib/dateUtils';
import { openEmailWithTrip } from '../../lib/emailTrip';
import { searchFlights, searchHotels, generateBudget, generateTips, generatePacking, generateWeather, generateVisa, generateCurrency, generateNearby, generateTransport } from '../../lib/api';
import TabNav from '../shared/TabNav';
import FlightsTab from './FlightsTab';
import HotelsTab from './HotelsTab';
import ItineraryTab from './ItineraryTab';
import BudgetTab from './BudgetTab';
import TipsTab from './TipsTab';
import PackingTab from './PackingTab';
import WeatherTab from './WeatherTab';
import VisaTab from './VisaTab';
import CurrencyTab from './CurrencyTab';
import NearbyTab from './NearbyTab';
import ChecklistTab from './ChecklistTab';
import PhotosTab from './PhotosTab';
import TransportTab from './TransportTab';
import DashboardTab from './DashboardTab';
import BookingTrackerTab from './BookingTrackerTab';
import RouteMapTab from './RouteMapTab';
import { encodeTripToUrl, copyToClipboard } from '../../lib/tripUrl';

interface Props {
  config: TravelConfig;
  results: GenerationResults;
  onStartOver: () => void;
  onUpdateResults: (results: Partial<GenerationResults>) => void;
}

function generateICS(results: GenerationResults, config: TravelConfig): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AdventurePlanner//EN'];
  for (const day of results.itinerary) {
    const dateStr = addDaysISO(config.departureDate, day.day - 1).replace(/-/g, '');
    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    lines.push(`SUMMARY:Day ${day.day}: ${day.title}`);
    lines.push(`DESCRIPTION:${day.activities.join('\\n')}`);
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

function RetryButton({ label, onRetry }: { label: string; onRetry: () => Promise<void> }) {
  const [retrying, setRetrying] = useState(false);
  const handleClick = async () => {
    setRetrying(true);
    try { await onRetry(); } finally { setRetrying(false); }
  };
  return (
    <div className="text-center py-16">
      <span className="text-5xl block mb-4">{label === 'flights' ? '✈️' : label === 'hotels' ? '🏨' : label === 'transport' ? '🚆' : label === 'tips' ? '📋' : label === 'packing' ? '🧳' : label === 'weather' ? '🌤️' : label === 'visa' ? '🛂' : label === 'currency' ? '💱' : label === 'nearby' ? '📍' : '🔄'}</span>
      <p className="text-white font-medium mb-2">Data not available yet</p>
      <p className="text-gray-500 text-sm mb-6">The AI service may have been busy. Click to try again.</p>
      <button onClick={handleClick} disabled={retrying}
        className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#E85D26] hover:shadow-lg transition-all disabled:opacity-50">
        {retrying ? 'Generating...' : 'Retry'}
      </button>
    </div>
  );
}

export default function ResultsView({ config, results, onStartOver, onUpdateResults }: Props) {
  const [activeTab, setActiveTab] = useState<ResultsTab>('dashboard');
  const [shareMsg, setShareMsg] = useState('');

  const totalDays = Math.round(
    (new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleCalendarExport = () => {
    const ics = generateICS(results, config);
    downloadFile(ics, `${config.country?.name || 'trip'}-itinerary.ics`, 'text/calendar');
  };

  return (
    <div className="min-h-screen relative print:bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden print:hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#FF6B35]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#0077B6]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="flex items-center justify-between mb-6 print:hidden">
            <div />
            <div className="flex gap-2">
              <button onClick={async () => {
                  const url = encodeTripToUrl(config);
                  await copyToClipboard(url);
                  setShareMsg('Link copied!');
                  setTimeout(() => setShareMsg(''), 2000);
                }}
                className="text-xs text-gray-500 hover:text-white glass rounded-lg px-3 py-1.5 hover:bg-white/8 transition-all">
                {shareMsg || '🔗 Share'}
              </button>
              <button onClick={() => openEmailWithTrip(config, results)}
                className="text-xs text-gray-500 hover:text-white glass rounded-lg px-3 py-1.5 hover:bg-white/8 transition-all">
                ✉️ Email
              </button>
              <button onClick={handleCalendarExport}
                className="text-xs text-gray-500 hover:text-white glass rounded-lg px-3 py-1.5 hover:bg-white/8 transition-all">
                📅 Calendar
              </button>
              <button onClick={() => window.print()}
                className="text-xs text-gray-500 hover:text-white glass rounded-lg px-3 py-1.5 hover:bg-white/8 transition-all">
                📄 PDF
              </button>
              <button onClick={onStartOver}
                className="text-xs text-gray-500 hover:text-white glass rounded-lg px-3 py-1.5 hover:bg-white/8 transition-all">
                ← Start Over
              </button>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-4 py-1 mb-4 print:hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D936C]" />
            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Trip Ready</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 print:text-black">
            Your {config.country?.name || ''} Adventure
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-400 text-sm print:text-gray-600">
            <span>{config.travellers} traveller{config.travellers > 1 ? 's' : ''}</span>
            <span className="text-gray-600">·</span>
            <span>{formatDateAU(config.departureDate)} to {formatDateAU(config.returnDate)}</span>
            <span className="text-gray-600">·</span>
            <span>{totalDays} days</span>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 print:hidden">
            {config.destinations.map((d) => (
              <span key={d.id} className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
                style={{ background: `${d.colour}0A`, color: d.colour, borderColor: `${d.colour}20` }}>
                {d.emoji} {d.name.split('(')[0].split('/')[0].trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 print:hidden">
          <TabNav active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="animate-fade-up">
          {activeTab === 'dashboard' && (
            <DashboardTab config={config} results={results} onTabChange={setActiveTab} />
          )}
          {activeTab === 'itinerary' && (
            <ItineraryTab itinerary={results.itinerary} config={config} hotels={results.hotels}
              onUpdate={(itinerary) => onUpdateResults({ itinerary })} />
          )}
          {activeTab === 'flights' && (results.flights.length > 0
            ? <FlightsTab flights={results.flights} config={config} />
            : <RetryButton label="flights" onRetry={async () => { const d = await searchFlights(config); onUpdateResults({ flights: d }); }} />
          )}
          {activeTab === 'hotels' && (results.hotels.length > 0
            ? <HotelsTab hotels={results.hotels} destinations={config.destinations} config={config} />
            : <RetryButton label="hotels" onRetry={async () => { const d = await searchHotels(config); onUpdateResults({ hotels: d }); }} />
          )}
          {activeTab === 'transport' && (results.transport.length > 0
            ? <TransportTab transport={results.transport} />
            : <RetryButton label="transport" onRetry={async () => { const d = await generateTransport(config); onUpdateResults({ transport: d }); }} />
          )}
          {activeTab === 'bookings' && (
            <BookingTrackerTab config={config} results={results} />
          )}
          {activeTab === 'map' && (
            <RouteMapTab config={config} results={results} />
          )}
          {activeTab === 'budget' && (results.budget.length > 0
            ? <BudgetTab budget={results.budget} config={config} onUpdate={(budget) => onUpdateResults({ budget })} />
            : <RetryButton label="budget" onRetry={async () => { const d = await generateBudget(config); onUpdateResults({ budget: d }); }} />
          )}
          {activeTab === 'tips' && (results.tips.length > 0
            ? <TipsTab tips={results.tips} />
            : <RetryButton label="tips" onRetry={async () => { const d = await generateTips(config); onUpdateResults({ tips: d }); }} />
          )}
          {activeTab === 'packing' && (results.packing.length > 0
            ? <PackingTab packing={results.packing} />
            : <RetryButton label="packing" onRetry={async () => { const d = await generatePacking(config); onUpdateResults({ packing: d }); }} />
          )}
          {activeTab === 'weather' && (results.weather.length > 0
            ? <WeatherTab weather={results.weather} />
            : <RetryButton label="weather" onRetry={async () => { const d = await generateWeather(config); onUpdateResults({ weather: d }); }} />
          )}
          {activeTab === 'visa' && (results.visa
            ? <VisaTab visa={results.visa} />
            : <RetryButton label="visa" onRetry={async () => { const d = await generateVisa(config); onUpdateResults({ visa: d }); }} />
          )}
          {activeTab === 'currency' && (results.currency
            ? <CurrencyTab currency={results.currency} />
            : <RetryButton label="currency" onRetry={async () => { const d = await generateCurrency(config); onUpdateResults({ currency: d }); }} />
          )}
          {activeTab === 'nearby' && (results.nearby.length > 0
            ? <NearbyTab nearby={results.nearby} destinations={config.destinations} />
            : <RetryButton label="nearby" onRetry={async () => { const d = await generateNearby(config); onUpdateResults({ nearby: d }); }} />
          )}
          {activeTab === 'checklist' && <ChecklistTab config={config} />}
          {activeTab === 'photos' && <PhotosTab destinations={config.destinations} />}
        </div>
      </div>
    </div>
  );
}

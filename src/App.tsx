import { useState, useCallback, useEffect, useRef } from 'react';
import type { Country, Destination, VibeOption, TravelConfig, GenerationResults, AppView, WizardStep } from './types';
import { searchFlights, searchHotels, generateItinerary, generateBudget, generateTips, generateDestinations, generatePacking, generateWeather, generateVisa, generateCurrency, generateNearby, generateTransport } from './lib/api';
import { getDestinationsForCountry } from './data/destinations';
import CountryPicker from './components/wizard/CountryPicker';
import DestinationPicker from './components/wizard/DestinationPicker';
import TravelDetails from './components/wizard/TravelDetails';
import LoadingScreen from './components/wizard/LoadingScreen';
import ResultsView from './components/results/ResultsView';
import ThemeToggle from './components/shared/ThemeToggle';
import { decodeTripFromUrl } from './lib/tripUrl';
import { countries } from './data/countries';

const EMPTY_RESULTS: GenerationResults = {
  flights: [], hotels: [], itinerary: [], budget: [], tips: [],
  packing: [], weather: [], visa: null, currency: null, nearby: [], transport: [],
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<AppView>('country');
  const [step, setStep] = useState<WizardStep>(1);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check for shared trip URL on mount
  const sharedTripLoaded = useRef(false);
  useEffect(() => {
    if (sharedTripLoaded.current) return;
    const trip = decodeTripFromUrl();
    if (!trip) return;
    sharedTripLoaded.current = true;

    // Find the country
    const country = countries.find(c => c.id === trip.c);
    if (!country) return;

    // Load destinations
    const dests = getDestinationsForCountry(country.id);
    if (!dests) return;

    // Match destination IDs
    const selectedDests = trip.d.map(id => dests.find(d => d.id === id)).filter(Boolean) as typeof dests;
    if (selectedDests.length === 0) return;

    // Populate state and trigger generation
    setSelectedCountry(country);
    setCountryDestinations(dests);
    setSelectedDests(selectedDests);
    setDepartureDate(trip.dd);
    setReturnDate(trip.rd);
    setTravellers(trip.t);
    setAges(trip.a);
    setVibes(trip.v as any);

    // Clear the URL param without reload
    window.history.replaceState({}, '', window.location.pathname);

    // Auto-generate after a tick
    setTimeout(() => {
      setView('wizard');
      setStep(2);
    }, 100);
  }, []);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryDestinations, setCountryDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [selectedDests, setSelectedDests] = useState<Destination[]>([]);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travellers, setTravellers] = useState(2);
  const [ages, setAges] = useState<number[]>([30, 30]);
  const [vibes, setVibes] = useState<VibeOption[]>(['adventure', 'foodie']);

  const [progress, setProgress] = useState({
    route: false, flights: false, hotels: false, itinerary: false, budget: false, tips: false,
    packing: false, weather: false, visa: false, currency: false, nearby: false, transport: false,
  });
  const [results, setResults] = useState<GenerationResults>({ ...EMPTY_RESULTS });

  const handleCountrySelect = async (country: Country) => {
    setSelectedCountry(country);
    const prebuilt = getDestinationsForCountry(country.id);
    if (prebuilt) {
      setCountryDestinations(prebuilt);
      setView('wizard');
      return;
    }
    setLoadingDestinations(true);
    setView('wizard');
    try {
      const generated = await generateDestinations(country);
      setCountryDestinations(generated);
    } catch (err) {
      console.error('Failed to generate destinations:', err);
      setCountryDestinations([]);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const buildConfig = (): TravelConfig => ({
    country: selectedCountry!,
    destinations: selectedDests,
    departureDate, returnDate, travellers, ages, vibes,
  });

  const handleGenerate = useCallback(async () => {
    const config = buildConfig();
    setView('loading');
    setProgress({ route: false, flights: false, hotels: false, itinerary: false, budget: false, tips: false, packing: false, weather: false, visa: false, currency: false, nearby: false, transport: false });
    setResults({ ...EMPTY_RESULTS });

    await new Promise((r) => setTimeout(r, 500));
    setProgress((p) => ({ ...p, route: true }));

    const stagger = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // Batch 1: core content
    const p1 = generateItinerary(config)
      .then((d) => { setResults((r) => ({ ...r, itinerary: d })); setProgress((p) => ({ ...p, itinerary: true })); })
      .catch(() => setProgress((p) => ({ ...p, itinerary: true })));

    await stagger(800);

    const p2 = searchFlights(config)
      .then((d) => { setResults((r) => ({ ...r, flights: d })); setProgress((p) => ({ ...p, flights: true })); })
      .catch(() => setProgress((p) => ({ ...p, flights: true })));

    await stagger(800);

    const p3 = searchHotels(config)
      .then((d) => { setResults((r) => ({ ...r, hotels: d })); setProgress((p) => ({ ...p, hotels: true })); })
      .catch(() => setProgress((p) => ({ ...p, hotels: true })));

    await stagger(800);

    const p4 = generateBudget(config)
      .then((d) => { setResults((r) => ({ ...r, budget: d })); setProgress((p) => ({ ...p, budget: true })); })
      .catch(() => setProgress((p) => ({ ...p, budget: true })));

    await stagger(800);

    const p5 = generateTips(config)
      .then((d) => { setResults((r) => ({ ...r, tips: d })); setProgress((p) => ({ ...p, tips: true })); })
      .catch(() => setProgress((p) => ({ ...p, tips: true })));

    await stagger(800);

    // Batch 2: new features
    const p6 = generatePacking(config)
      .then((d) => { setResults((r) => ({ ...r, packing: d })); setProgress((p) => ({ ...p, packing: true })); })
      .catch(() => setProgress((p) => ({ ...p, packing: true })));

    await stagger(800);

    const p7 = generateWeather(config)
      .then((d) => { setResults((r) => ({ ...r, weather: d })); setProgress((p) => ({ ...p, weather: true })); })
      .catch(() => setProgress((p) => ({ ...p, weather: true })));

    await stagger(800);

    const p8 = generateVisa(config)
      .then((d) => { setResults((r) => ({ ...r, visa: d })); setProgress((p) => ({ ...p, visa: true })); })
      .catch(() => setProgress((p) => ({ ...p, visa: true })));

    await stagger(800);

    const p9 = generateCurrency(config)
      .then((d) => { setResults((r) => ({ ...r, currency: d })); setProgress((p) => ({ ...p, currency: true })); })
      .catch(() => setProgress((p) => ({ ...p, currency: true })));

    await stagger(800);

    const p10 = generateNearby(config)
      .then((d) => { setResults((r) => ({ ...r, nearby: d })); setProgress((p) => ({ ...p, nearby: true })); })
      .catch(() => setProgress((p) => ({ ...p, nearby: true })));

    await stagger(800);

    const p11 = generateTransport(config)
      .then((d) => { setResults((r) => ({ ...r, transport: d })); setProgress((p) => ({ ...p, transport: true })); })
      .catch(() => setProgress((p) => ({ ...p, transport: true })));

    await Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11]);
    setView('results');
  }, [selectedDests, departureDate, returnDate, travellers, ages, vibes, selectedCountry]);

  const handleStartOver = () => {
    setSelectedCountry(null);
    setCountryDestinations([]);
    setSelectedDests([]);
    setDepartureDate('');
    setReturnDate('');
    setTravellers(2);
    setAges([30, 30]);
    setVibes(['adventure', 'foodie']);
    setResults({ ...EMPTY_RESULTS });
    setProgress({ route: false, flights: false, hotels: false, itinerary: false, budget: false, tips: false, packing: false, weather: false, visa: false, currency: false, nearby: false, transport: false });
    setStep(1);
    setView('country');
  };

  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setCountryDestinations([]);
    setSelectedDests([]);
    setStep(1);
    setView('country');
  };

  const themeToggle = <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />;
  const bg = 'bg-[var(--ink)] grain';

  if (view === 'country') {
    return <div className={`min-h-screen ${bg}`}>{themeToggle}<CountryPicker onSelect={handleCountrySelect} /></div>;
  }

  if (view === 'loading') {
    return <div className={`min-h-screen ${bg}`}>{themeToggle}<LoadingScreen destinations={selectedDests.map((d) => d.name)} progress={progress} /></div>;
  }

  if (view === 'results') {
    const config = buildConfig();
    return <div className={`min-h-screen ${bg}`}>{themeToggle}<ResultsView config={config} results={results} onStartOver={handleStartOver} onUpdateResults={(partial) => setResults((r) => ({ ...r, ...partial }))} /></div>;
  }

  return (
    <div className={`min-h-screen ${bg}`}>
      {themeToggle}
      {step === 1 && (
        loadingDestinations ? (
          <div className="max-w-4xl mx-auto px-4 pt-20 text-center">
            <div className="text-5xl mb-4 animate-bounce">{selectedCountry?.emoji || '🌍'}</div>
            <h2 className="text-white text-2xl font-bold mb-2">Discovering {selectedCountry?.name}...</h2>
            <p className="text-gray-500 text-sm">Generating destinations using AI.</p>
            <div className="mt-6 w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <DestinationPicker selected={selectedDests} onSelect={setSelectedDests} onNext={() => setStep(2)}
            country={selectedCountry!} destinations={countryDestinations} onBackToCountries={handleBackToCountries}
            onAddDestinations={(newDests) => setCountryDestinations((prev) => [...prev, ...newDests])} />
        )
      )}
      {step === 2 && (
        <TravelDetails destinations={selectedDests} departureDate={departureDate} returnDate={returnDate}
          travellers={travellers} ages={ages} vibes={vibes}
          onUpdate={(d) => { setDepartureDate(d.departureDate); setReturnDate(d.returnDate); setTravellers(d.travellers); setAges(d.ages); setVibes(d.vibes); }}
          onBack={() => setStep(1)} onGenerate={handleGenerate} />
      )}
    </div>
  );
}

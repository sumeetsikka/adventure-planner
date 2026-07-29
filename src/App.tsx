import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Country, Destination, VibeOption, TravelConfig, GenerationResults, AppView, WizardStep, TravellerProfile, TripMode } from './types';
import { searchFlights, searchHotels, generateItinerary, generateBudget, generateTips, generateDestinations, generatePacking, generateWeather, generateVisa, generateCurrency, generateNearby, generateTransport, generateRestaurants, generateActivities } from './lib/api';
import { loadDestinationsForCountry } from './data/destinations';
import CountryPicker from './components/wizard/CountryPicker';
import DestinationPicker from './components/wizard/DestinationPicker';
import TravelDetails from './components/wizard/TravelDetails';
import LoadingScreen from './components/wizard/LoadingScreen';
import ResultsView from './components/results/ResultsView';
import ThemeToggle from './components/shared/ThemeToggle';
import InstallPrompt from './components/shared/InstallPrompt';
import OnboardingTour from './components/shared/OnboardingTour';
import { ToastProvider, useToast } from './components/shared/Toast';
import MyTrips from './components/wizard/MyTrips';
import Inspiration from './components/wizard/Inspiration';
import Wishlist from './components/wizard/Wishlist';
import { decodeTripFromUrl } from './lib/tripUrl';
import { countries } from './data/countries';
import {
  saveTrip,
  getTrip,
  getActiveTripId,
  setActiveTripId,
  newTripId,
  listTrips,
  STORAGE_FULL_EVENT,
  type SavedTrip,
} from './lib/tripStore';

const EMPTY_RESULTS: GenerationResults = {
  flights: [], hotels: [], itinerary: [], budget: [], tips: [],
  packing: [], weather: [], visa: null, currency: null, nearby: [], transport: [],
  restaurants: [], activities: [],
};

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

function AppInner() {
  const toast = useToast();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  // Always land on the country picker — a fresh "start a new trip" entry.
  // Saved trips are one tap away via the "My trips" button in the header.
  const [view, setView] = useState<AppView>('country');
  const [step, setStep] = useState<WizardStep>(1);
  const [tripsVersion, setTripsVersion] = useState(0); // bump to force MyTrips re-render

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Browser history integration. Without this, all navigation is React state and
  // the Android system back gesture closes the PWA instead of going back a view.
  const historyReady = useRef(false);
  useEffect(() => {
    // The loading screen is transient — backing into a half-finished generation
    // isn't a state the user can return to, so it gets no history entry.
    if (view === 'loading') return;
    const entry = { apView: view, apStep: step };
    if (!historyReady.current) {
      historyReady.current = true;
      window.history.replaceState(entry, '');
      return;
    }
    // A popstate-driven change already matches the current entry — re-pushing
    // it here would trap the user (back would land on the same view forever).
    const cur = window.history.state as { apView?: string; apStep?: number } | null;
    if (cur && cur.apView === view && cur.apStep === step) return;
    window.history.pushState(entry, '');
  }, [view, step]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state as { apView?: AppView; apStep?: WizardStep } | null;
      if (s?.apView) {
        setView(s.apView);
        if (typeof s.apStep === 'number') setStep(s.apStep);
      } else {
        setView('country');
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Device storage is full — the trip did NOT save. Tell the user, because the
  // alternative is silently losing their work.
  useEffect(() => {
    let lastWarned = 0;
    const onFull = () => {
      // Autosave can fire repeatedly; don't stack identical toasts.
      if (Date.now() - lastWarned < 10_000) return;
      lastWarned = Date.now();
      toast('Device storage is full — this trip did not save. Delete an old trip or some journal photos.', 'error');
    };
    window.addEventListener(STORAGE_FULL_EVENT, onFull);
    return () => window.removeEventListener(STORAGE_FULL_EVENT, onFull);
  }, [toast]);

  // Restore the most recent trip on mount (unless a shared URL trip is incoming)
  const restoreAttempted = useRef(false);
  useEffect(() => {
    if (restoreAttempted.current) return;
    restoreAttempted.current = true;
    if (decodeTripFromUrl()) return; // shared URL takes priority — handled below
    const id = getActiveTripId();
    if (!id) return;
    const trip = getTrip(id);
    if (!trip) return;
    setSelectedCountry(trip.config.country);
    // Use the trip's saved destinations immediately, then upgrade to the full
    // curated list once its chunk loads. The landing view is My Trips, not the
    // picker, so the async upgrade is never visibly late.
    setCountryDestinations(trip.config.destinations);
    loadDestinationsForCountry(trip.config.country.id).then((full) => {
      if (full) setCountryDestinations(full);
    });
    setSelectedDests(trip.config.destinations);
    setDepartureDate(trip.config.departureDate);
    setReturnDate(trip.config.returnDate);
    setTravellers(trip.config.travellers);
    setAges(trip.config.ages);
    setVibes(trip.config.vibes);
    if (trip.config.origin) setOrigin(trip.config.origin);
    if (trip.config.homeCurrency) setHomeCurrency(trip.config.homeCurrency);
    setBudgetPerPerson(trip.config.budgetPerPerson);
    setTravellerProfiles(trip.config.travellerProfiles);
    setTripMode(trip.config.tripMode);
    setResults(trip.results);
    // NOTE: we deliberately do NOT jump straight into the last trip's results.
    // The landing view is the "My Trips" gallery (set in useState initialiser)
    // so a returning visitor sees all their trips and chooses one — rather than
    // being dumped back into whatever trip they last opened.
  }, []);

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

    // The shared link carries only destination IDs, so we must resolve the
    // country's data (now an async chunk) before we can match them.
    (async () => {
    const dests = await loadDestinationsForCountry(country.id);
    if (!dests) return;

    // Match destination IDs
    const selectedDests = trip.d.map(id => dests.find(d => d.id === id)).filter(Boolean) as typeof dests;
    if (selectedDests.length === 0) return;

    // Populate state from the shared link
    setSelectedCountry(country);
    setCountryDestinations(dests);
    setSelectedDests(selectedDests);
    setDepartureDate(trip.dd);
    setReturnDate(trip.rd);
    setTravellers(trip.t);
    setAges(trip.a);
    setVibes(trip.v as VibeOption[]);

    // Clear the URL param without reload
    window.history.replaceState({}, '', window.location.pathname);

    // Land on the details step with the shared trip pre-filled — the recipient
    // reviews the dates/travellers and taps generate (results aren't encoded in
    // the URL, so they must be regenerated). TravelDetails reads the dates from
    // its props, so the shared dates carry through.
    setTimeout(() => {
      setView('wizard');
      setStep(2);
    }, 100);
    })();
  }, []);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryDestinations, setCountryDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [selectedDests, setSelectedDests] = useState<Destination[]>([]);
  // Stable identity for the LoadingScreen prop — otherwise a fresh array on
  // every `progress` re-render restarts its typewriter effect mid-word.
  const selectedDestNames = useMemo(() => selectedDests.map((d) => d.name), [selectedDests]);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travellers, setTravellers] = useState(2);
  const [ages, setAges] = useState<number[]>([30, 30]);
  const [vibes, setVibes] = useState<VibeOption[]>(['adventure', 'foodie']);
  const [origin, setOrigin] = useState<string>('MEL');
  const [homeCurrency, setHomeCurrency] = useState<string>('AUD');
  const [budgetPerPerson, setBudgetPerPerson] = useState<number | undefined>(undefined);
  const [travellerProfiles, setTravellerProfiles] = useState<TravellerProfile[] | undefined>(undefined);
  const [tripMode, setTripMode] = useState<TripMode | undefined>(undefined);

  const [progress, setProgress] = useState({
    route: false, flights: false, hotels: false, itinerary: false, budget: false, tips: false,
    packing: false, weather: false, visa: false, currency: false, nearby: false, transport: false, restaurants: false, activities: false,
  });
  const [results, setResults] = useState<GenerationResults>({ ...EMPTY_RESULTS });

  // Auto-save the current trip whenever the config or results change.
  // Only save if there's actually a trip in progress (country selected and
  // either we're past the wizard or we have meaningful data).
  useEffect(() => {
    if (!selectedCountry) return;
    const config: TravelConfig = {
      country: selectedCountry,
      destinations: selectedDests,
      departureDate, returnDate, travellers, ages, vibes,
      origin, homeCurrency, budgetPerPerson, travellerProfiles, tripMode,
    };
    const hasMeaningfulData =
      selectedDests.length > 0 ||
      results.itinerary.length > 0 ||
      results.flights.length > 0;
    if (!hasMeaningfulData) return;
    saveTrip({ config, results });
    setTripsVersion((v) => v + 1);
  }, [selectedCountry, selectedDests, departureDate, returnDate, travellers, ages, vibes, origin, homeCurrency, budgetPerPerson, travellerProfiles, tripMode, results]);

  const loadTrip = (trip: SavedTrip) => {
    setActiveTripId(trip.id);
    setSelectedCountry(trip.config.country);
    // Saved destinations render immediately; the full curated list upgrades in
    // when its chunk arrives (see the restore effect above for the rationale).
    setCountryDestinations(trip.config.destinations);
    loadDestinationsForCountry(trip.config.country.id).then((full) => {
      if (full) setCountryDestinations(full);
    });
    setSelectedDests(trip.config.destinations);
    setDepartureDate(trip.config.departureDate);
    setReturnDate(trip.config.returnDate);
    setTravellers(trip.config.travellers);
    setAges(trip.config.ages);
    setVibes(trip.config.vibes);
    if (trip.config.origin) setOrigin(trip.config.origin);
    if (trip.config.homeCurrency) setHomeCurrency(trip.config.homeCurrency);
    setBudgetPerPerson(trip.config.budgetPerPerson);
    setTravellerProfiles(trip.config.travellerProfiles);
    setTripMode(trip.config.tripMode);
    setResults(trip.results);
    const hasResults = trip.results.itinerary.length > 0 || trip.results.flights.length > 0;
    setView(hasResults ? 'results' : 'wizard');
    setStep(hasResults ? 3 : 2);
  };

  const newTrip = () => {
    newTripId();
    setSelectedCountry(null);
    setCountryDestinations([]);
    setSelectedDests([]);
    setDepartureDate('');
    setReturnDate('');
    setTravellers(2);
    setAges([30, 30]);
    setVibes(['adventure', 'foodie']);
    setBudgetPerPerson(undefined);
    setTravellerProfiles(undefined);
    setTripMode(undefined);
    setResults({ ...EMPTY_RESULTS });
    setStep(1);
    setView('country');
  };

  const handleCountrySelect = async (country: Country) => {
    // Starting a country selection always begins a FRESH trip. Without this
    // reset, picking a country after "Start Over" would carry the previous
    // trip's destinations/results into the auto-save effect, which (with no
    // active trip id) mints a corrupt new trip mixing old data with the new
    // country. Clear the working state and claim a fresh trip id.
    newTripId();
    setSelectedDests([]);
    setResults({ ...EMPTY_RESULTS });
    setTravellerProfiles(undefined);
    setTripMode(undefined);
    setStep(1);
    setSelectedCountry(country);
    // Country data is now a per-country chunk. Show the wizard's loading state
    // while it fetches (usually a few ms) so the picker doesn't render empty.
    setLoadingDestinations(true);
    setView('wizard');
    try {
      const prebuilt = await loadDestinationsForCountry(country.id);
      if (prebuilt) {
        setCountryDestinations(prebuilt);
        return;
      }
      // Not a country we ship — generate destinations via the LLM.
      const generated = await generateDestinations(country);
      setCountryDestinations(generated);
    } catch (err) {
      console.error('Failed to load destinations:', err);
      setCountryDestinations([]);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const buildConfig = (): TravelConfig => ({
    country: selectedCountry!,
    destinations: selectedDests,
    departureDate, returnDate, travellers, ages, vibes,
    origin, homeCurrency, budgetPerPerson, travellerProfiles, tripMode,
  });

  const handleGenerate = useCallback(async (data?: {
    departureDate: string;
    returnDate: string;
    travellers: number;
    ages: number[];
    vibes: VibeOption[];
    origin?: string;
    homeCurrency?: string;
    budgetPerPerson?: number;
    travellerProfiles?: TravellerProfile[];
    tripMode?: TripMode;
  }) => {
    // IMPORTANT: build the config from `data` (the fresh values handed over
    // by TravelDetails) when present — NOT from component state. TravelDetails
    // calls onUpdate() then onGenerate() in the same click; the setState from
    // onUpdate has not flushed yet, so reading state here would use the stale
    // (often empty) previous dates. `data` carries the user's actual choices.
    const config: TravelConfig = {
      country: selectedCountry!,
      destinations: selectedDests,
      departureDate: data?.departureDate ?? departureDate,
      returnDate: data?.returnDate ?? returnDate,
      travellers: data?.travellers ?? travellers,
      ages: data?.ages ?? ages,
      vibes: data?.vibes ?? vibes,
      origin: data?.origin ?? origin,
      homeCurrency: data?.homeCurrency ?? homeCurrency,
      budgetPerPerson: data ? data.budgetPerPerson : budgetPerPerson,
      travellerProfiles: data ? data.travellerProfiles : travellerProfiles,
      tripMode: data ? data.tripMode : tripMode,
    };
    setView('loading');
    setProgress({ route: false, flights: false, hotels: false, itinerary: false, budget: false, tips: false, packing: false, weather: false, visa: false, currency: false, nearby: false, transport: false, restaurants: false, activities: false });
    setResults({ ...EMPTY_RESULTS });

    await new Promise((r) => setTimeout(r, 500));
    setProgress((p) => ({ ...p, route: true }));

    const stagger = (ms: number) => new Promise((r) => setTimeout(r, ms));
    // Requests are spaced out so 13 simultaneous calls don't trip the free-tier
    // rate limits (Groq is 30 RPM). 800ms each added ~9.6s of dead time to every
    // generation; 250ms keeps the spacing but gives most of that back.
    const STAGGER_MS = 250;

    // Steps that fail are recorded here rather than being silently marked done —
    // otherwise a total outage looks identical to a successful generation.
    const failed: string[] = [];

    // Batch 1: core content
    const p1 = generateItinerary(config)
      .then((d) => { setResults((r) => ({ ...r, itinerary: d })); setProgress((p) => ({ ...p, itinerary: true })); })
      .catch(() => { failed.push('itinerary'); setProgress((p) => ({ ...p, itinerary: true })); });

    await stagger(STAGGER_MS);

    const p2 = searchFlights(config)
      .then((d) => { setResults((r) => ({ ...r, flights: d })); setProgress((p) => ({ ...p, flights: true })); })
      .catch(() => { failed.push('flights'); setProgress((p) => ({ ...p, flights: true })); });

    await stagger(STAGGER_MS);

    const p3 = searchHotels(config)
      .then((d) => { setResults((r) => ({ ...r, hotels: d })); setProgress((p) => ({ ...p, hotels: true })); })
      .catch(() => { failed.push('hotels'); setProgress((p) => ({ ...p, hotels: true })); });

    await stagger(STAGGER_MS);

    const p4 = generateBudget(config)
      .then((d) => { setResults((r) => ({ ...r, budget: d })); setProgress((p) => ({ ...p, budget: true })); })
      .catch(() => { failed.push('budget'); setProgress((p) => ({ ...p, budget: true })); });

    await stagger(STAGGER_MS);

    const p5 = generateTips(config)
      .then((d) => { setResults((r) => ({ ...r, tips: d })); setProgress((p) => ({ ...p, tips: true })); })
      .catch(() => { failed.push('tips'); setProgress((p) => ({ ...p, tips: true })); });

    await stagger(STAGGER_MS);

    // Batch 2: new features
    const p6 = generatePacking(config)
      .then((d) => { setResults((r) => ({ ...r, packing: d })); setProgress((p) => ({ ...p, packing: true })); })
      .catch(() => { failed.push('packing'); setProgress((p) => ({ ...p, packing: true })); });

    await stagger(STAGGER_MS);

    const p7 = generateWeather(config)
      .then((d) => { setResults((r) => ({ ...r, weather: d })); setProgress((p) => ({ ...p, weather: true })); })
      .catch(() => { failed.push('weather'); setProgress((p) => ({ ...p, weather: true })); });

    await stagger(STAGGER_MS);

    const p8 = generateVisa(config)
      .then((d) => { setResults((r) => ({ ...r, visa: d })); setProgress((p) => ({ ...p, visa: true })); })
      .catch(() => { failed.push('visa'); setProgress((p) => ({ ...p, visa: true })); });

    await stagger(STAGGER_MS);

    const p9 = generateCurrency(config)
      .then((d) => { setResults((r) => ({ ...r, currency: d })); setProgress((p) => ({ ...p, currency: true })); })
      .catch(() => { failed.push('currency'); setProgress((p) => ({ ...p, currency: true })); });

    await stagger(STAGGER_MS);

    const p10 = generateNearby(config)
      .then((d) => { setResults((r) => ({ ...r, nearby: d })); setProgress((p) => ({ ...p, nearby: true })); })
      .catch(() => { failed.push('nearby'); setProgress((p) => ({ ...p, nearby: true })); });

    await stagger(STAGGER_MS);

    const p11 = generateTransport(config)
      .then((d) => { setResults((r) => ({ ...r, transport: d })); setProgress((p) => ({ ...p, transport: true })); })
      .catch(() => { failed.push('transport'); setProgress((p) => ({ ...p, transport: true })); });

    await stagger(STAGGER_MS);

    const p12 = generateRestaurants(config)
      .then((d) => { setResults((r) => ({ ...r, restaurants: d })); setProgress((p) => ({ ...p, restaurants: true })); })
      .catch(() => { failed.push('restaurants'); setProgress((p) => ({ ...p, restaurants: true })); });

    await stagger(STAGGER_MS);

    const p13 = generateActivities(config)
      .then((d) => { setResults((r) => ({ ...r, activities: d })); setProgress((p) => ({ ...p, activities: true })); })
      .catch(() => { failed.push('activities'); setProgress((p) => ({ ...p, activities: true })); });

    const tasks = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13];
    await Promise.all(tasks);

    // Every section failed — almost always a missing LLM key or no connection.
    // Navigating to results here would present a fully-chromed but entirely
    // empty trip, making total failure look exactly like success.
    if (failed.length === tasks.length) {
      setView('wizard');
      toast("Couldn't reach the planner. Check your connection and try again.", 'error');
      return;
    }
    if (failed.length > 0) {
      toast(`${failed.length} section${failed.length > 1 ? 's' : ''} couldn't be generated.`, 'error');
    }
    setView('results');
  }, [selectedDests, departureDate, returnDate, travellers, ages, vibes, selectedCountry, origin, homeCurrency, budgetPerPerson, travellerProfiles, tripMode, toast]);

  const handleStartOver = () => {
    // "Start Over" now means "go to My Trips" rather than wiping state.
    // Trip persists in localStorage and will appear in the gallery.
    setActiveTripId(null);
    setProgress({ route: false, flights: false, hotels: false, itinerary: false, budget: false, tips: false, packing: false, weather: false, visa: false, currency: false, nearby: false, transport: false, restaurants: false, activities: false });
    setView(listTrips().length > 0 ? 'mytrips' : 'country');
  };

  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setCountryDestinations([]);
    setSelectedDests([]);
    setStep(1);
    setView('country');
  };

  const themeToggle = (
    <>
      <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <InstallPrompt />
      <OnboardingTour />
    </>
  );
  const bg = 'bg-[var(--ink)] grain';

  if (view === 'mytrips') {
    return (
      <div className={`min-h-screen ${bg}`}>{themeToggle}
        <MyTrips
          key={tripsVersion}
          onLoad={loadTrip}
          onNew={newTrip}
          onInspire={() => setView('inspire')}
          onWishlist={() => setView('wishlist')}
          onBack={() => setView('country')}
        />
      </div>
    );
  }

  if (view === 'inspire') {
    return (
      <div className={`min-h-screen ${bg}`}>{themeToggle}
        <Inspiration
          onSelectCountry={handleCountrySelect}
          onClose={() => setView('country')}
        />
      </div>
    );
  }

  if (view === 'wishlist') {
    return (
      <div className={`min-h-screen ${bg}`}>{themeToggle}
        <Wishlist
          onPlanTrip={handleCountrySelect}
          onBack={() => setView('country')}
        />
      </div>
    );
  }

  if (view === 'country') {
    return (
      <div className={`min-h-screen ${bg}`}>{themeToggle}
        <CountryPicker
          onSelect={handleCountrySelect}
          onInspire={() => setView('inspire')}
          onWishlist={() => setView('wishlist')}
          onMyTrips={() => setView('mytrips')}
          savedTripCount={listTrips().length}
        />
      </div>
    );
  }

  if (view === 'loading') {
    return <div className={`min-h-screen ${bg}`}>{themeToggle}<LoadingScreen destinations={selectedDestNames} progress={progress} /></div>;
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
          <div className="max-w-4xl mx-auto px-4 pt-32 text-center">
            <div className="text-5xl mb-6">{selectedCountry?.emoji || '🌍'}</div>
            <p className="eyebrow mb-3">Discovering</p>
            <h2 className="font-display text-5xl text-[var(--cream)] mb-4 italic">{selectedCountry?.name}…</h2>
            <p className="text-[var(--text-muted)] text-sm font-light">Generating destinations using AI.</p>
            <div className="mt-8 w-8 h-8 border border-[var(--text-dim)] border-t-[var(--gold)] rounded-full animate-spin mx-auto" />
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
          origin={origin} homeCurrency={homeCurrency} budgetPerPerson={budgetPerPerson}
          travellerProfiles={travellerProfiles} tripMode={tripMode}
          onUpdate={(d) => {
            setDepartureDate(d.departureDate);
            setReturnDate(d.returnDate);
            setTravellers(d.travellers);
            setAges(d.ages);
            setVibes(d.vibes);
            if (d.origin) setOrigin(d.origin);
            if (d.homeCurrency) setHomeCurrency(d.homeCurrency);
            setBudgetPerPerson(d.budgetPerPerson);
            setTravellerProfiles(d.travellerProfiles);
            setTripMode(d.tripMode);
          }}
          onBack={() => setStep(1)} onGenerate={handleGenerate} />
      )}
    </div>
  );
}

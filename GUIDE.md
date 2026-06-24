# Adventure Planner — User & Admin Guide

> **Living document.** Maintained alongside the code. When adding/changing a feature,
> the entry in this file must change too — see § 14 *Self-maintenance protocol*.

**Last updated:** 2026-05-27 (live data — real Google ratings/reviews/open-now/♿ on cards, key-optional with graceful fallback)
**App version:** post-WOW build-out (Phases 1–12 shipped: per-traveller profiles, all-ages modes, hour-by-hour itinerary, pre-trip readiness, live-mode dashboard, cultural depth, price tracking, budget realism, memories recap, group splits, surprise-me inspiration, i18n scaffold) + QA hardening.

---

## Table of contents

**User**
1. [Getting started](#1-getting-started)
2. [The wizard — building a trip](#2-the-wizard--building-a-trip)
3. [The Results view](#3-the-results-view--all-21-tabs)
4. [My Trips library](#4-my-trips-library)
5. [Sharing & export](#5-sharing--export)
6. [Live mode (during the trip)](#6-live-mode-during-the-trip)
7. [After the trip](#7-after-the-trip)
8. [Settings & preferences](#8-settings--preferences)

**Admin**
9. [Local development](#9-admin--local-development)
10. [Deployment (Vercel)](#10-admin--deployment-vercel)
11. [Data, prompts & content](#11-admin--data-prompts--content)
12. [Monitoring & maintenance](#12-admin--monitoring--maintenance)

**Reference**
13. [Glossary](#13-glossary)
14. [Self-maintenance protocol](#14-self-maintenance-protocol)
15. [Changelog](#15-changelog)

---

## 1. Getting started

| 👤 As a Traveller | 🛠️ As an Admin |
|---|---|
| Open the deployed app URL (the public Vercel domain). On first launch a 4-step onboarding tour explains the flow — tap *Begin* to walk through it, or *Skip*. | Verify the deployment is live: `vercel ls` → most recent deployment shows `Ready`. Public URL = first `Production` entry. Run `vercel inspect <url>` for build details. |
| The app works offline — install it as a PWA from your browser's *Add to home screen* prompt and it survives no-signal moments mid-trip. | Service worker (`public/sw.js`) is network-only for HTML (always fresh) and cache-first for hashed assets. To force every client to refresh, bump the `__BUILD_VERSION__` in the SW (handled automatically by the Vite plugin). |
| All your trips, wishlist, journal entries, and readiness checklists are saved on your device only. Clear browser data = lose everything. There is no account. | No backend database. All persistence is `localStorage` per browser. If you ever add a sync backend, the keys to migrate are: `adventure-planner:trips`, `adventure-planner:active-trip`, `adventure-planner:wishlist`, `adventure-planner:readiness:<tripId>`, `adventure-planner:price-watch`, `adventure-planner:onboarded`, `adventure-planner:install-dismissed`, `adventure-planner:lang`. |

---

## 2. The wizard — building a trip

The wizard has three steps: **Country → Destinations → Details → Generate**.

### 2.1 Pick a country

| 👤 Traveller | 🛠️ Admin |
|---|---|
| 29 prebuilt countries grouped by region. Tap any card to start. **Search** by name in the top input, or open the **★ Wishlist** sheet to plan a saved one. | Country data lives in `src/data/countries.ts`. To add a country: append a `Country` object (`id`, `name`, `emoji`, `colour`, `tagline`, `origin`, `currency`, `prebuilt: true`), then add its `id` to the appropriate region in `src/components/wizard/CountryPicker.tsx → REGIONS`. |
| **★ on a card** = save to wishlist (still on this device only). Star fills coral when saved. | Wishlist is `src/lib/wishlist.ts` — localStorage `adventure-planner:wishlist`. |
| **✦ Inspire me** opens a discovery panel: filter by vibe, month, and budget; or hit **🎲 Surprise me — pick one** to skip the decision. | `src/components/wizard/Inspiration.tsx`. `SUGGESTIONS` array drives the filtering. Add entries here to bias the discovery engine toward new countries/vibes. |
| **+ Custom country** at the bottom of the picker lets you type *any* country name. The AI will build a trip from scratch. | Custom countries set `prebuilt: false`. Destinations are generated on-demand via `generateDestinations()` — costs an LLM call. |

### 2.2 Pick destinations

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Each country shows a curated list of destinations. Tap **Add to trip** on as many as you want — they re-order automatically into an optimal route. **Know more** opens a detailed synopsis (Wikipedia + AI). | Prebuilt destinations: `src/data/destinations.ts`. Each `Destination` has `id`, `name`, `emoji`, `colour`, `airport` (IATA), `region`, `brief`, `tags`, `recommendedDays: [min, max]`. The order in the array determines wizard order; routing logic in `src/lib/routePlanner.ts` reorders for shortest path. |
| Tap **← All Countries** to step back. | `onBackToCountries` in `App.tsx` triggers `handleBackToCountries()` which clears destinations and steps to the country picker. |

### 2.3 Travel details

| 👤 Traveller | 🛠️ Admin |
|---|---|
| **Origin airport** — search by city/IATA/country. Default = MEL (Melbourne). Used for flight deep-links. | `src/lib/originAirports.ts` defines available airports. Default in `DEFAULT_ORIGIN`. |
| **Home currency** — affects how budget figures are displayed; live FX via ECB. | `src/lib/fx.ts` fetches and caches rates. ECB endpoint, falls back to AUD if unreachable. |
| **Trip length** — accept the AI's recommended days or **Customise** with the +/− stepper. | `recommendedDays` = midpoint of each destination's `recommendedDays` range. |
| **When do you leave?** — date picker. The return date is auto-calculated from trip length. | `TravelDetails.tsx` honours incoming `departureDate`/`returnDate` props for shared links and saved-trip re-edits. |
| **Travellers** — count + per-person row with **name, age, Details** expander showing **Diet / Mobility / Interests** chips. *Diet:* vegetarian, vegan, halal, kosher, gluten-free, dairy-free, pescatarian, nut/shellfish allergy. *Mobility:* wheelchair, limited-walking, no-stairs, stroller, vision/hearing-impaired. *Interests:* food, culture, nature, history, shopping, nightlife, sports, art, family-fun, wellness, photography, live-music. | `TravellerProfile` in `src/types/index.ts`. The wizard's `Details ▾` expander writes into the per-traveller profiles array. Empty profiles (no extras filled in) are dropped before submitting to the API to keep prompts lean. |
| **Trip mode** — auto-detected: *Family* when anyone < 13, *Senior* when oldest ≥ 65, *Accessibility* when any mobility need is selected, otherwise *Standard*. Tap any tile to override. | `deriveTripMode()` (frontend: `TravelDetails.tsx`, mirrored on backend: `api/[route].ts`). The mode injects a strong directive into LLM prompts via `modeDirective()`. |
| **Your budget** — optional. Per-person amount in AUD; total auto-calculated. AI aims for ±20% of target. | `budgetPerPerson` flows through the config. `budgetHint()` in `api/[route].ts` appends a budget directive to itinerary/flights/hotels/budget prompts. |
| **Your vibes** — multi-select chips (adventure, beach, culture, foodie, nature, etc.). Drives the activity mix. | `VibeOption` in `src/types/index.ts`. New vibes need entries in `TravelDetails.tsx → VIBES` and the LLM system prompts. |
| Hit **Craft my journey →** to generate. Takes ~30–60 s (7 LLM calls staggered + provider failover). | `handleGenerate()` in `App.tsx` accepts a `data` override so it doesn't race the wizard's setState — that bug is fixed but worth remembering when adding new wizard fields. |

---

## 3. The Results view — all 21 tabs

Results are split into 4 groups in the nav.

| 👤 Traveller | 🛠️ Admin |
|---|---|
| **Plan** — `Dashboard`, `Itinerary`, `Map`. **Book** — `Flights`, `Hotels`, `Transport`, `Bookings`. **Prepare** — `🎯 Ready`, `Budget`, `Packing`, `Weather`, `Visa`, `Currency`, `Checklist`, `Events`. **Explore** — `Taste`, `Do`, `Nearby`, `Photos`, `Tips`, `Chat`, `Journal`. | Each tab is a lazy-loaded component in `src/components/results/`. Tab routing in `ResultsView.tsx`. Tab group structure in `src/components/shared/TabNav.tsx` (desktop) and `MobileBottomNav.tsx` (mobile). |

### 3.1 Dashboard

| 👤 Traveller | 🛠️ Admin |
|---|---|
| **State banner** at top adapts to where you are in the trip lifecycle: *Pre-trip* shows a countdown + checklist CTA; *In-trip* shows today's stop + distance/ETA + weather; *Post-trip* shows a "welcome back" prompt to open the journal. | `DashboardTab.tsx`. State derived from `daysSinceDeparture` vs `totalDays`. The today-panel uses `useGeolocation()` (only when trip is underway — no permission prompt for future trips) and `geocodeDestination()` (cached). |
| Editorial hero image, then 4 quick stats (Days / Flights / Hotels / Transfers) — each is a button to its tab. | Hero is `getCountryHero()` from `src/lib/imagery.ts` (Wikipedia main image, falls back to picsum). |
| **🆘 Emergency card** at the bottom: tap-to-call police / ambulance / fire / tourist-police numbers for your destination, plus a "Find your embassy" link. Ships in the app bundle, so it works offline. Numbers carry a "verify locally" caveat. | `src/lib/emergency.ts` — static `EMERGENCY` map keyed by country id (all 29 prebuilt countries; unknown countries fall back to GSM-universal 112). `EmergencyCard` component in `DashboardTab.tsx`; calls via `telUrl()`. Update the dataset when adding countries. |

### 3.2 Itinerary — the stitched day-by-day plan

| 👤 Traveller | 🛠️ Admin |
|---|---|
| **This is the heart of the app.** Every day is a card on a continuous timeline showing — in order — what actually happens that day: ✈️ flights you take, 🧳 hotels you check out of, 🚆 transfers, 🏨 hotels you check in to, the day's activities, and a 🛏️ "Overnight: [hotel]" footer (or 🏠 "Fly home" on the last day). The dates and stays are pulled from your real flights/hotels, so it reads like a plan, not a list. | The stitching lives in `src/lib/planStitch.ts` — `buildDayPlans(config, itinerary, flights, hotels, transport)` joins everything on the date axis (each day's date = `departureDate + (day-1)`; flights match by `f.date`, hotels by `check_in`/`check_out`, "overnight" by `isDateInStay`). `dayMoves(plan)` produces the ordered fly/checkout/transport/checkin chips. Rendered by `StitchedDayCard` in `ItineraryTab.tsx`. |
| Each card shows a teaser of the first 3 activities. **Tap a day** to expand the full hour-by-hour timeline (`11:30 Flight → 21:00 Bun cha dinner`) with walking times between stops. | `ItineraryDay.timeline: TimelineEvent[]` (optional). If the LLM omits it, the card shows the bullet `activities` instead. The expand still uses the existing selected-day detail panel + `TimelineRow`. |
| **If it rains / With kids / Mobility** banners surface when the day has a `rainy_backup`, `kids_tip`, or `accessibility_note`. | Optional fields on `ItineraryDay`. The LLM emits these when the trip mode and traveller profiles warrant it (family-mode → kids_tip; accessibility-mode → accessibility_note). |
| **Reorder** + **Regenerate** at the top to nudge the AI for a different plan. | `ItineraryTab.tsx → regenerate()` calls `generateItinerary(config)` and replaces the array. Selection state resets. |
| **Editable days.** Expand a day → **"↻ Redo this day"** regenerates just that day (keeps its date/location, avoids repeating what was there); **✕** on any timeline stop (or bullet activity) removes it. Edits persist and re-stitch like everywhere else. | `regenerateDay()` → `/api/regenerateDay` (`handleRegenerateDay`) returns one fresh `ItineraryDay`; the client swaps it in keeping `day`/`location`. `removeTimelineStop()` / `removeActivity()` filter via `onUpdate`. The ✕ lives inside `TimelineRow` (its own `<li>`) — do NOT wrap `TimelineRow` in another `<li>` (nested `<li>` is invalid HTML; this was caught & fixed). |
| **🗺️ Map this day** opens the day's stops as a walking route in Google/Apple Maps. | `dayRouteUrl(stops)` in `src/lib/deepLinks.ts` builds a multi-waypoint Google directions URL (origin/destination/waypoints, `travelmode=walking`); Apple Maps lacks multi-stop so iOS routes to the last stop. Stops = timeline events excluding `travel`/`rest`, each suffixed with the city. Only shows when the day has a timeline. |

> 🔗 **Date plumbing (how the stitch stays consistent).** The backend already stamps real dates: `computeSchedule` (in `server/lib/dateSchedule.ts`) derives a date-per-destination, then `fixFlightDates`/`fixHotelDates` overwrite whatever the LLM guessed with those exact dates. So flights, hotels, transport and itinerary all agree on dates by construction. `tripDayNumber(departureDate, date)` (in `dateUtils.ts`) converts any date back to a "Day N" label used across the Flights and Hotels tabs.

### 3.3 Map

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Leaflet map showing the trip route with hotel pins. Coral connecting line marks travel order. | `RouteMapTab.tsx`. Uses OSM `light_all` tiles (matches the light theme). Markers via Leaflet defaults. |

### 3.4 Flights

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Each leg shows a **Day N badge** + the full date (🗓️ Wed 1 Jul) tying it to the itinerary, plus price, duration, stops, CO₂ estimate, airlines, and **Skyscanner / Google Flights / Webjet** deep-links pre-filled with your dates and travellers. | `getFlightLinks()` in `src/lib/bookingLinks.ts`. Day badge via `tripDayNumber()`; date label via `formatDayLabel()` (both in `dateUtils.ts`). CO₂ via `flightCO2kg()` in `src/lib/carbon.ts`. |
| **🔔 Track price** toggles a watch on this flight. Saved across sessions. | `priceWatch.ts` lib — localStorage `adventure-planner:price-watch`. UI in `FlightsTab.tsx → WatchToggle`. The actual price-monitoring backend isn't built yet — this captures intent only. |

### 3.5 Hotels

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Photo banner per destination shows the **stay range as Day N–M** + full dates (🗓️ Wed 1 Jul → Sat 4 Jul), matching exactly when the itinerary has you in that city. Tap to expand. Recommended hotels show stars, area, style, price range, amenities, "best for" tag, and **Booking.com / Agoda / Hotels.com** links pre-filled with your dates. | `HotelsTab.tsx`. Day range via `tripDayNumber()`, date labels via `formatDayLabel()`. The destination banner is a `<div role="button">` (not a `<button>`) because `PlaceActions` renders `<a>` tags inside — anchors-inside-buttons is invalid HTML. |
| **✏️ Editable plan.** Tap **"Make this my pick"** on any hotel to set it as your choice — this instantly re-stitches the whole trip: the Itinerary's "Overnight: …", the per-day budget, and the PDF all read the recommended hotel, so they update together. Tap **"＋ More options in [city]"** to fetch 3 fresh alternatives for just that city (same dates, no repeats) and append them to choose from. | Editing is gated on the `onUpdate` prop (passed from `ResultsView`). `makePick()` flips the `recommended` flag and calls `onUpdate` → `onUpdateResults({ hotels })` → auto-saves. `fetchMore()` calls `generateHotelAlternatives()` (`src/lib/api.ts`) → `/api/hotelAlternatives` (`handleHotelAlternatives` in `api/[route].ts`), which re-runs the hotels prompt for ONE destination with an `exclude` list, dedupes, and returns ≤3 `HotelRec`. The re-stitch is automatic because `planStitch.buildDayPlans` derives "where you sleep" from the recommended hotel. |

### 3.6 Transport, Bookings tracker

| 👤 Traveller | 🛠️ Admin |
|---|---|
| **Transport** = intercity legs (trains, buses, ferries, cars) with operators, durations, prices, booking sites. **Bookings** = paste a flight/hotel/activity confirmation email and the AI parses it into a tracker. Each line confirms or mismatches against the AI plan. | `parseBookingEmail()` in `src/lib/api.ts` → `api/[route].ts → handleParseBooking`. Confidence levels: high/medium/low. |

### 3.7 Budget

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Two big totals (per-person + group). **Show in** lets you switch display currency (ECB live FX). **Budget target panel** (when you set one) shows estimated vs target with a ±20% tolerance band + Within/Over/Under badge. **Where it goes** = stacked bar with each category's % share. **In context** compares to country average. **Footprint** = trip CO₂. **Quick split** at the bottom = bill-splitter for restaurant/taxi receipts (groups only). | `BudgetTab.tsx`. Budget breakdown comes from the LLM; FX live from ECB; CO₂ from `src/lib/carbon.ts`; benchmarks hard-coded in `BudgetTab.tsx → benchmarks`. Quick-split widget is `BillSplit` at the bottom of the file. |
| **💸 Spend tracker** — log ACTUAL expenses as you travel: amount + category + optional note + who paid. Shows a running total vs the estimate (green under / coral over progress bar), a per-expense list with ✕, and — for groups — an even-split **settle-up** ("Sam owes Alex $50"). Saves on this device, per trip. | `src/lib/expenses.ts` (localStorage `adventure-planner:expenses:<tripId>`; `addExpense`/`removeExpense`/`totalSpent`/`settleUp` greedy creditor-debtor matching). UI is `SpendTracker` in `BudgetTab.tsx`; payer names come from `travellerProfiles[i].name` or "Traveller N". Amounts are home-currency, group-level. |

### 3.8 Packing, Weather, Visa, Currency, Checklist, Events

| 👤 Traveller | 🛠️ Admin |
|---|---|
| **Packing** — grouped list with check-off (saves locally). **Weather** — per-destination averages + multi-day forecast when available. **Visa** — requirements for AU passport holders, cost, processing time, application link, passport-validity-by date, group cost. **Currency** — live FX, converter, common phrases (greetings, food, emergencies), tipping culture, cash vs card. **Checklist** — pre-departure todos (deprecated — superseded by 🎯 Ready, but still in the nav). **Events** — public holidays + festivals during your dates. | Open-Meteo (`api/[route].ts → handleWeather`) for forecast; falls back to historical year-ago data when the trip is >180 days out. Phrases pack from `src/lib/phrases.ts`. Events from `src/lib/events.ts`. |

### 3.9 🎯 Ready — Pre-trip readiness

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Countdown to departure + a checklist sorted into Documents / Money / Logistics / Health / House. Each item has a deadline (T-90, T-60, T-45 … T-1) and an urgency badge (Soon / Overdue). Tap to tick off — completion saves on this device. **Open link ↗** appears for items with an associated URL (visa application, etc.). | `src/lib/readiness.ts` defines the 12-item template; relevance flags filter (no visa = no visa item; no driving = no IDP). Visa item auto-extracts a URL from the LLM's `how_to_apply` text. Per-trip state in localStorage `adventure-planner:readiness:<tripId>`. |
| Tab auto-hides after the trip ends — replaced with a "welcome back, open the journal" screen. | `PrepareTab.tsx` checks `daysUntilDeparture(...) < -1`. |

### 3.9b 🪪 Wallet — travel document vault

| 👤 Traveller | 🛠️ Admin |
|---|---|
| One offline place for the documents you scramble for at check-in: **passport** (number + expiry), **travel insurance** (policy + 24h emergency line), **frequent-flyer** numbers, **booking confirmations / PNRs**, and free **notes**. Add/reveal/remove each. Sensitive values (passport, insurance) show **masked** (`••••4821`) by default with a per-item Show/Hide. A **passport-expiry check** warns when validity is under 6 months past your return date (many countries refuse entry). | New `src/lib/travelWallet.ts` (localStorage `adventure-planner:wallet:<tripId>`; `addWalletItem`/`removeWalletItem`/`maskValue`/`passportExpiryWarning`). UI is `WalletTab.tsx` in the **Prepare** nav group. **Privacy: device-only — never sent to any server or the LLM; the UI states this plainly.** Don't add server sync without revisiting that promise. |

### 3.10 Taste, Do, Nearby, Photos, Tips

| 👤 Traveller | 🛠️ Admin |
|---|---|
| **Taste** — restaurants per destination with dietary filter chips; **editable** — ✕ to remove a restaurant, and "＋ More places to eat in [city]" to fetch fresh spots for that stop. **Do** — activities by category (Culture/Nature/Adventure/Family); **editable** — ✕ to remove an activity you don't want, and "＋ More things to do in [city]" to fetch fresh ideas for that stop. **Both tabs:** every card has **⭐ Reviews** (real ratings on Google/TripAdvisor, one tap) and **＋ Plan** — pick a day and the place lands in that day's hour-by-hour timeline (restaurants slot in at 19:00 dinner, activities at 14:00; days you're in that city are highlighted coral). The pool→plan loop. **Nearby** — day-trip suggestions from each main destination. **Photos** — Wikipedia gallery of each destination. **Tips** — 12-15 destination-specific tips covering tipping, dress codes, photography etiquette, body language, queue norms, food, transport, health, scams. | `handleTips` uses the enriched TIPS_SYSTEM prompt. Photos from `useWikiImage`. **Do editing:** `DoTab` takes an `onUpdate` prop (wired in `ResultsView` → `onUpdateResults({ activities })`); `removeActivity()` filters by name, `fetchMore()` calls `generateActivityAlternatives()` → `/api/activityAlternatives` (`handleActivityAlternatives`, reusing the module-scope `ACTIVITIES_SYSTEM` prompt with an `exclude` list). Same edit pattern as Hotels. **＋ Plan:** shared `AddToDay` picker (`src/components/shared/AddToDay.tsx`) + `addStopToDay()` (`src/lib/planEdit.ts`) — inserts a `TimelineEvent` sorted by time, or appends to `activities` on no-timeline days; wired via `onUpdateItinerary` → `onUpdateResults({ itinerary })`. **⭐ Reviews:** `reviewsUrl()` in `deepLinks.ts` (Google search deep-link — real crowd ratings without a ratings API). |

### 3.11 Chat

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Free-form AI concierge that knows your trip context (country, destinations). Ask "best place to see sunset in Hoi An?" or "is Uber safe in Hanoi?" **The concierge can also EDIT your plan in plain language** — "remove the War Museum in Hanoi", "show me more places to eat", "swap my Hanoi hotel for the Sofitel", "find me other hotel options". It confirms what it changed, and the edit flows through to every tab + the PDF. | Two routes: plain Q&A uses `handleChat`; when ChatTab is wired with `results` + `onUpdateResults` (the editable mode), it routes through **`/api/chatAction`** (`handleChatAction`) — an **intent parser** that's given a compact plan inventory and returns `{answer, action}` where `action` is a whitelisted `ChatAction` (`remove_activity` / `remove_restaurant` / `more_*` / `pick_hotel` / `none`). **The LLM only classifies intent; the client applies the change** via the same `onUpdateResults` plumbing + `*Alternatives` endpoints as the Hotels/Do/Taste tabs — the model never mutates the saved trip. Defensive: unknown action kinds fall back to `none`. |

### 3.12 Journal

| 👤 Traveller | 🛠️ Admin |
|---|---|
| One section per itinerary day with photo upload + note field. Recap card at the top shows live stats (Days captured / Photos / Places / Days total). Everything saves on this device. | `JournalTab.tsx`. Photos are stored as data URLs in localStorage — large libraries can hit quota. The error toast surfaces when that happens. |

---

## 4. My Trips library

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Tap **My trips** (top right) to see every trip on this device. Cards show country, dates, days, stops, status (`Drafting` / `Ready`), updated-time. **Travel stats strip** under the header totals your journeys: trips, countries, days away, flight legs (Polarsteps-style). | `MyTrips.tsx`. Sorted by `updatedAt` desc. Capped at 30 saved trips (`tripStore.saveTrip`). Stats computed inline from `listTrips()` — unique country ids, summed day-counts, flight-leg counts. |
| **Tap a card** to open the trip. **✎** to rename (Enter to save, Esc to cancel). **×** then **Delete** to delete — two-tap confirm avoids accidental deletes and the ghost-click bug native dialogs caused. | Delete state stored in localStorage; the active-trip pointer is cleared on delete. The ✎/× wrapper has `stopPropagation` plus each button stops its own bubbling. |
| **+ New trip** clears state and returns to the country picker. **★ Wishlist** opens saved-country list. **✦ Inspire me** opens discovery. | `newTrip()` in `App.tsx` resets ALL working state (selectedCountry, selectedDests, dates, ages, vibes, budget, profiles, mode, results) and calls `newTripId()`. |

---

## 5. Sharing & export

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Top of results: **Share / Email / Calendar / PDF**. **Share** = a self-contained URL (the trip config encoded in the query string); the recipient lands on the Travel Details step pre-filled and just taps generate. **Email** = formatted email body. **Calendar** = `.ics` download. **PDF** = a print-ready, day-by-day stitched plan (the same flights/hotels/transfers-woven-into-each-day view as the Itinerary tab, plus day-tagged flight/hotel reference pages and a per-day spend chart). | URL encode/decode in `src/lib/tripUrl.ts` — UTF-8-safe base64 (works with emoji/accented country names). Email body assembled in `src/lib/emailTrip.ts`. ICS in `src/lib/calendarExport.ts` (search for `.ics`). PDF via `@react-pdf/renderer` in `src/lib/tripPdf.tsx` — built off `planStitch.buildDayPlans`. **Uses built-in Helvetica (no remote webfonts) so the export can't break on a CDN failure.** |
| The shared URL contains config only (no booking data), so the recipient regenerates — but the dates, destinations, travellers, vibes are preserved. | Encoded fields in `MinimalTripConfig` in `tripUrl.ts`. Results are NOT shared (results are LLM-generated and would be inconsistent between recipients anyway). |

---

## 6. Live mode (during the trip)

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Once `today` falls between `departureDate` and `returnDate`, the Dashboard switches to live mode automatically. The today-panel shows your current city, today's plan, weather right now, and (if you grant location) distance + ETA to your next stop. | `DashboardTab.tsx → tripUnderway`. Geolocation is requested ONLY when the trip is underway — `useGeolocation(tripUnderway)` short-circuits otherwise. |
| Grant location when prompted to see distance/ETA. If you refuse, everything else still works. | Geo state: `pending` / `granted` / `denied`. Distance uses Haversine in `src/lib/geocode.ts → distanceKm`. ETA assumes ~30 km/h average — adjust in DashboardTab if needed. |
| Offline behaviour: HTML loads from network (or the offline-fallback page); hashed JS/CSS load from cache. Trip data is in localStorage, so the app works fully offline once loaded. | `public/sw.js`. The offline fallback page is light-themed (matches the current design). |

---

## 7. After the trip

| 👤 Traveller | 🛠️ Admin |
|---|---|
| Dashboard shows a "Welcome back" banner with a CTA to the Journal. 🎯 Ready hides. | Detected by `daysSinceDeparture >= totalDays`. |
| In the Journal you'll see a Recap card with stats (days captured, photos, places, total days). Add final memories then download/share when ready. | The trip stays editable forever — there's no auto-archive. |

---

## 8. Settings & preferences

| 👤 Traveller | 🛠️ Admin |
|---|---|
| **Theme toggle** (🌙 / ☀) at top right. Light theme is default. | `ThemeToggle.tsx` writes `data-theme="dark"` on `<html>` and toggles state. CSS tokens swap via `[data-theme="dark"]` in `src/index.css`. |
| **Language** — English only today; scaffold ready for Spanish, Japanese, Mandarin, French, German. | `src/lib/i18n.ts`. To enable a language: populate its block in `STRINGS`, add it to `AVAILABLE_LANGUAGES`, and the user picker (once built) will surface it. |
| **Install as app** — your browser will offer this. iOS Safari: Share → Add to Home Screen. Android Chrome: Install icon in URL bar. | PWA manifest in `public/manifest.webmanifest`. Install prompt UX in `InstallPrompt.tsx` (`adventure-planner:install-dismissed` localStorage flag). |

---

## 9. Admin — Local development

### Setup

```bash
git clone <repo>
cd Holiday-Planner
npm install
cp .env.example .env       # then fill in API keys (see below)
npm run dev                # http://localhost:5199 (port set in .claude/launch.json)
```

### Required environment variables

The app fans out to 7 LLM providers in failover order. **At least one must be set** for generation to work:

| Variable | Provider | Get a key |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini | https://aistudio.google.com/apikey |
| `OPENAI_API_KEY` | OpenAI | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Anthropic | https://console.anthropic.com/settings/keys |
| `OPENROUTER_API_KEY` | OpenRouter (DeepSeek, Llama) | https://openrouter.ai/keys |
| `GROQ_API_KEY` | Groq (fast Llama) | https://console.groq.com/keys |
| `TOGETHER_API_KEY` | Together AI | https://api.together.xyz/settings/api-keys |
| `OLLAMA_API_KEY` | Self-hosted Ollama (if applicable) | local |

Failover order is defined in `server/lib/gemini.ts` (the file is named for the original primary; it now orchestrates all providers). Order chosen for cost + speed; tune as needed.

> ⚠️ **API keys must never be committed.** `.env` is git-ignored. If a key is ever pasted in a chat/PR/issue, rotate it immediately — assume it's compromised.

### Useful scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR (port 5199). |
| `npm run build` | `tsc -b && vite build`. Used by Vercel. |
| `npm run preview` | Serve the built `dist/` locally. |
| `npx tsc -b` | Type-check only. |
| `npx eslint src/` | Lint the frontend. |

### Auto-commit & guard rails

A debounced auto-commit hook (`.claude/scripts/auto-commit.sh`) commits clean intermediate states every 30 s, only after `tsc -b` succeeds. Don't bypass it for ad-hoc changes; if you need to commit during a known-broken intermediate state, do it explicitly with a clear message.

---

## 10. Admin — Deployment (Vercel)

| Step | Command / Action |
|---|---|
| Link the repo (first time) | `vercel link` from the project root. |
| Push to deploy | `git push` → Vercel builds preview deployments per branch and a production deployment on `main`. |
| Set environment variables | `vercel env add OPENAI_API_KEY production`, repeat per provider. Or use the Vercel dashboard. After adding a key, redeploy. |
| Force production deploy | `vercel deploy --prod`. |
| Roll back | `vercel rollback <deployment-url>` or via the dashboard. |
| Inspect logs | `vercel logs <deployment-url>` for build + runtime logs. |
| Domains | `vercel domains add example.com` then point DNS as instructed. |

**Build command:** `tsc -b && vite build` (in `package.json`). **Output:** `dist/`.

**Functions:** the single catch-all `api/[route].ts` handles every API route (`/api/itinerary`, `/api/regenerateDay`, `/api/flights`, `/api/hotels`, `/api/hotelAlternatives`, `/api/budget`, `/api/tips`, `/api/packing`, `/api/weather`, `/api/visa`, `/api/currency`, `/api/nearby`, `/api/transport`, `/api/destinations`, `/api/chat`, `/api/chatAction`, `/api/restaurants`, `/api/restaurantAlternatives`, `/api/activities`, `/api/activityAlternatives`, `/api/parseBooking`, `/api/destinationInfo`). Runs on Vercel Functions (Fluid Compute, Node.js 24, 300 s timeout). Active-CPU pricing — chunked streaming reduces wait time but doesn't free CPU.

> 💡 Vercel AI Gateway lets you point at multiple providers via `provider/model` strings with built-in fallback & observability. Worth migrating to when you have time — it'd shrink `server/lib/gemini.ts` significantly. See the Vercel AI SDK skill.

---

## 11. Admin — Data, prompts & content

| File | What it controls |
|---|---|
| `src/data/countries.ts` | The 29 prebuilt countries. Add a new one: append `Country` object; add `id` to the right region in `CountryPicker.tsx → REGIONS`. |
| `src/data/destinations.ts` | Curated destinations per country. Each `Destination` needs `id`, `airport` (IATA), `recommendedDays`. Order matters for default routing. |
| `src/lib/originAirports.ts` | Airports the traveller can pick as their origin. Used for flight deep-links. |
| `src/lib/phrases.ts` | The "Essential phrases" pack used by the Currency tab. Add languages by adding entries to the phrase map. |
| `server/lib/prompts.ts` | All LLM system prompts. The most-tweaked one is `ITINERARY_SYSTEM` — the hour-by-hour timeline contract lives here. |
| `api/[route].ts` | Route handlers. `personalisationHint()`, `budgetHint()`, `modeDirective()`, `profilesHint()` are appended to user messages to shape generation. `ORIGIN_CITY_BY_IATA` maps the user's chosen origin IATA to a city name for the prompts (so itinerary/flights actually use the chosen origin instead of hard-coding Melbourne). Add new origin airports here if you extend `originAirports.ts`. |
| `server/lib/dateSchedule.ts` | The destination-by-destination schedule logic (`computeSchedule`, `fixFlightDates`, `fixHotelDates`). Adjust if you change trip-length semantics. |
| `src/lib/i18n.ts` | i18n scaffold. To add a language: fill its block in `STRINGS`, add to `AVAILABLE_LANGUAGES`. |
| `src/lib/readiness.ts` | The pre-trip readiness checklist (now includes an eSIM/connectivity item, T−7, linking to Airalo). Add an item: append to `buildReadinessItems()` with a `daysBefore` deadline + extend `ReadinessItemId`. |
| `src/lib/expenses.ts` | Trip spend tracker storage + math (`addExpense`, `totalSpent`, `settleUp`). localStorage per trip. |
| `src/lib/travelWallet.ts` | Travel-document vault storage + `maskValue` + `passportExpiryWarning`. localStorage per trip, **device-only — never transmitted**. |
| `src/lib/emergency.ts` | Offline emergency-numbers dataset per country + `embassySearchUrl()`. Keep in sync when adding countries. |
| `src/lib/planEdit.ts` | Pure itinerary transforms — `addStopToDay()` powers the "＋ Plan" pool→plan loop. |
| `src/lib/priceWatch.ts` | Watch-list lib. Wire new "Track" buttons by importing `{ isWatched, toggleWatch, *WatchId }`. |
| `src/lib/planStitch.ts` | The plan-stitching layer. `buildDayPlans()` joins flights/hotels/transport/itinerary by date; `dayMoves()` builds the per-day move chips. Use this anywhere you need "what happens on day N". |
| `src/lib/dateUtils.ts` | Date helpers. `tripDayNumber()`, `formatDayLabel()`, `isDateInStay()`, `parseLocalDate()` (timezone-safe). Use these instead of raw `new Date('YYYY-MM-DD')` (which parses as UTC and can be a day off). |
| `src/lib/deepLinks.ts` | Map/navigation/ride/phone deep-links. `dayRouteUrl(stops)` = multi-stop walking route; `mapsUrl`/`directionsUrl` = single place. iOS → Apple Maps, else Google. |
| `src/components/shared/EstimateBadge.tsx` | Trust-layer markers. `EstimateBadge` (inline pill) + `EstimateNote` (tab footnote) — surface that figures are AI estimates, not live quotes. Add to any new estimate-heavy surface. |

### How to safely update a prompt

1. Edit `server/lib/prompts.ts`.
2. `npx tsc -b` — must pass.
3. Test locally: trigger a generation that exercises the changed prompt.
4. Pay attention to the JSON shape. The corresponding type in `src/types/index.ts` must match. If you add a field, mark it optional (`field?:`) so existing saved trips don't break.
5. Re-run the type check.

### How to add a results tab

1. Create `src/components/results/<Name>Tab.tsx` (lazy default-export).
2. Add the key to `ResultsTab` in `src/types/index.ts`.
3. Lazy-import in `ResultsView.tsx` and add the `{activeTab === '<key>' && ...}` block.
4. Add nav entries in `TabNav.tsx` (desktop) AND `MobileBottomNav.tsx` (mobile sheet) with a key/label/icon.
5. If the tab needs new generated data, add to: `GenerationResults` (types), `api.ts` (frontend caller), `api/[route].ts` (handler + prompt in `prompts.ts`).

---

## 12. Admin — Monitoring & maintenance

| What | Where |
|---|---|
| Production errors | Vercel dashboard → Logs → filter by function name. Top-level handler error returns a sanitised message; full error is in the server log. |
| Health of LLM providers | The retry order tries each provider in turn. If a provider is consistently failing, comment it out in `server/lib/gemini.ts` or rotate to a backup. |
| Build break | `npm run build` locally. `tsc -b` first to isolate type errors from Vite errors. |
| Vercel CLI version | `vercel --version` — keep within one major of `vercel@latest`. `npm i -g vercel@latest` to upgrade. |
| Service worker version | Updated automatically by the Vite plugin; deploy = new version. To force every client to refresh, deploy any change. |
| Lint warnings backlog | `api/` and `server/` have 67 pre-existing `any` warnings — pre-existing, not in the build pipeline, low priority. `src/` is kept clean. |

### Common ops

- **Rotate a leaked key.** Revoke in the provider dashboard. Generate a fresh key. Update via `vercel env rm <KEY> production && vercel env add <KEY> production`. Redeploy.
- **Add a new country.** See § 11.
- **Force-update all clients.** Push any change to main; SW is network-only for HTML so clients pick it up on next page load.
- **Clear a user's local trips remotely.** Not possible — there's no backend. The user can do it via browser settings → site data → clear.

---

## 13. Glossary

| Term | Meaning |
|---|---|
| **Trip mode** | One of `standard` / `family` / `senior` / `accessibility`. Auto-derived from traveller profiles unless overridden. Reshapes LLM prompts. |
| **TravellerProfile** | Per-person details: age, optional name, dietary tags, mobility tags, interests. Drives personalised AI generation. |
| **TimelineEvent** | A single time-slotted entry inside an `ItineraryDay` (time, duration, type, location, optional tip, travel-from-prev). |
| **Active trip** | The trip whose data is currently loaded into App state. Pointer = `adventure-planner:active-trip` in localStorage. |
| **Watch item** | A flight or hotel the user has flagged to track. Stored locally; no backend monitoring yet. |
| **PWA** | Progressive Web App. Installable from supported browsers. Works offline once cached. |
| **Personalisation hint** | The concatenated `modeDirective` + `profilesHint` string appended to LLM prompts. |

---

## 14. Self-maintenance protocol

> **Read this before/after any code change.** This document is part of the codebase — keep it as current as the code.

### Triggers (update this guide when)

| Trigger | What to update |
|---|---|
| Add/remove a feature or tab | § 3 (Results view) + § 15 Changelog. |
| Add a new wizard field | § 2 + the corresponding admin row noting the data flow. |
| Change a localStorage key | § 1 (Admin column — the migration-keys list). |
| Add/change an LLM prompt | § 11 (How to safely update a prompt). |
| Add a country / destination | § 11 (Data files). |
| Add a language to i18n | § 8 + § 11 (Settings + Data files). |
| Add a new API route | § 10 (Functions list) + § 11 (How to add a results tab). |
| Bump dependencies that affect deployment | § 10 (Deployment). |
| Change build/lint pipeline | § 9 (Local development) + § 10. |
| Fix a critical bug | § 15 Changelog. |
| Change file paths referenced above | Search for the old path here, update everywhere. |

### How to update

1. Make your code change.
2. Open `GUIDE.md`.
3. Update the relevant row(s) and the `Last updated` date at the top.
4. Add a one-line entry to § 15 Changelog with date + brief description.
5. Commit both together — same commit as the code change. This way `git blame` on the doc points to why it changed.

### Auto-update note for AI assistants

Future sessions: when you edit code that maps to a section here, also update `GUIDE.md` in the same change. This file is the single source of truth for "what does this app do and how do I run it" — drift here = drift everywhere.

---

## 15. Changelog

> Add newest entries at the top. Date format: YYYY-MM-DD.

### 2026-05-27 — Travel wallet (offline document vault)
Closed the last universal gap vs TripIt / Wanderlog / Google Travel that needs no API key: a place to keep your travel documents.
- New **Wallet** tab (`WalletTab.tsx` + `src/lib/travelWallet.ts`) — store passports (number + expiry), insurance (policy + emergency line), frequent-flyer & confirmation/PNR codes, and notes. Per-trip localStorage.
- Sensitive values **masked by default** (`••••4821`) with per-item Show/Hide; **passport-expiry warning** vs the trip's return date (flags <6 months validity / already expired).
- **Privacy by design:** device-only, never sent to a server or the LLM — the UI says so. Added `'wallet'` to `ResultsTab`, lazy-loaded in `ResultsView`, placed in the Prepare nav group (desktop + mobile).
- Verified end-to-end at runtime: add passport → masked → expiry "Under 6 months" risk fired → Show reveals full → remove clears it. tsc/eslint/build clean, console clean.

### 2026-05-27 — Global-benchmark build (6 features from top travel apps)
Benchmarked against TripIt, Wanderlog, TravelSpend/Splitwise, Polarsteps, TripAdvisor, PackPoint; built the gaps that need no external API keys:
- **💸 Spend tracker** (`expenses.ts` + `SpendTracker` in BudgetTab) — log actual expenses with category/note/payer, actual-vs-estimate progress bar, per-trip persistence, and group **settle-up** via greedy creditor-debtor matching. (TravelSpend/Splitwise gap.)
- **＋ Plan — the pool→plan loop** (`planEdit.ts` `addStopToDay` + shared `AddToDay` picker) — every Taste/Do card can be added to a chosen day; inserts into the hour-by-hour timeline time-sorted (19:00 dinner / 14:00 activity defaults, signature-dish tip carried), in-destination days highlighted. (Wanderlog gap.)
- **🆘 Emergency card** (`emergency.ts` + `EmergencyCard` in Dashboard) — offline tap-to-call police/ambulance/fire/tourist-police for all 29 countries (112 fallback) + embassy search link. (TripIt-Pro-style safety gap.)
- **⭐ Reviews links** (`reviewsUrl()` in deepLinks) on every hotel/restaurant/activity card — real crowd ratings via Google/TripAdvisor without a ratings API. (TripAdvisor trust gap.)
- **Travel stats strip** in My Trips — trips / countries / days away / flight legs. (Polarsteps gap.)
- **📶 eSIM readiness item** (T−7, Airalo link) in the Ready checklist. (Modern-connectivity gap.)
All verified at runtime: expense add→persist→settle-up ("Sam owes Alex $50"), plan-to-day inserted "19:00 Bun Cha Huong Lien" sorted into Day 1's timeline, Vietnam SOS numbers tel:113/115/114, stats strip, eSIM item + airalo link. tsc/eslint/build clean.

### 2026-05-27 — Editable itinerary days + Tier-1 (maps, trust)
- **Editable itinerary days:** "↻ Redo this day" regenerates a single day (new `/api/regenerateDay` → `handleRegenerateDay`, keeps date/location, avoids repeats); ✕ removes individual timeline stops / bullet activities. New `regenerateDay()` API client.
- **Per-day maps:** "🗺️ Map this day" on each timeline day opens its stops as a walking route in Google/Apple Maps (`dayRouteUrl` in `deepLinks.ts`).
- **Trust layer:** new `src/components/shared/EstimateBadge.tsx` (`EstimateBadge` pill + `EstimateNote` footnote). Flights & Hotels tabs now carry an honest "AI-generated estimates, not live quotes — confirm before booking" note; flight price labels read "per person · est." (Budget already had its own footnote.)
- **Bug caught & fixed in this pass:** wrapping `TimelineRow` (which renders its own `<li>`) in another `<li>` produced invalid nested-`<li>` HTML — moved the remove ✕ inside `TimelineRow`. Verified `nestedLi: 0` in the live DOM.

### 2026-05-27 — Editable plan, part 4: Chat-that-acts
- **The Chat concierge can now edit the plan in plain language.** "Remove the War Museum in Hanoi", "show me more places to eat", "swap my Hanoi hotel for the Sofitel", "find more hotel options" — it confirms the change and it flows through to every tab + the PDF.
- Architecture: new `ChatAction` type + `/api/chatAction` route (`handleChatAction`) acts as an **intent parser** — given a compact plan inventory (destinations + the names in each hotel/activity/restaurant list), it returns `{answer, action}` with a whitelisted action kind. **The LLM only classifies; the client applies** the change via the same `onUpdateResults` plumbing + `*Alternatives` endpoints built in parts 1–3, so the model never mutates the saved trip and every edit stays consistent.
- ChatTab gained `results` + `onUpdateResults` props (wired in `ResultsView`); falls back to plain `/api/chat` Q&A when not in editable mode. Action-aware intro copy + suggestion chips when editing is available.
- Verified locally: client `applyAction` transforms correct (remove drops item; pick flips recommended), `canAct` wiring renders the action UI. The `/api/chatAction` round-trip itself only runs on the deployed Vercel app (dev server doesn't host `/api/*` — all routes 502 locally, a known environment fact).

### 2026-05-27 — Editable plan, part 3: Restaurants (Taste tab)
- **Taste tab is now editable** (same pattern as Do): ✕ removes a restaurant; "＋ More places to eat in [city]" fetches fresh spots for one destination (with an `exclude` list) and appends them.
- New backend route `/api/restaurantAlternatives` (`handleRestaurantAlternatives`); `RESTAURANTS_SYSTEM` hoisted to module scope to share between full-generate and single-destination handlers. New API client `generateRestaurantAlternatives()`. `TasteTab` gained an `onUpdate` prop (wired in `ResultsView` → `onUpdateResults({ restaurants })`).
- Verified end-to-end at runtime (remove drops from state + persistence + DOM). **The editable "remove + more options" trio (Hotels pick / Do / Taste) is now complete.**

### 2026-05-27 — Editable plan, part 2: Activities (Do tab)
- **Do tab is now editable** (same pattern as Hotels): ✕ on any activity card removes it; "＋ More things to do in [city]" fetches fresh ideas for one destination (with an `exclude` list so nothing repeats) and appends them.
- New backend route `/api/activityAlternatives` (`handleActivityAlternatives`); the `ACTIVITIES_SYSTEM` prompt was lifted to module scope so both the full-generate and single-destination handlers share it. New API client `generateActivityAlternatives()`. `DoTab` gained an `onUpdate` prop (wired in `ResultsView` → `onUpdateResults({ activities })`, auto-saves).
- Verified end-to-end at runtime: removing an activity drops it from state + persistence + DOM; remove-button count updates.

### 2026-05-27 — Editable plan, part 1: Hotels
- The plan is no longer read-only. **Hotels tab is now editable:** "Make this my pick" sets the recommended hotel for a destination, and because `planStitch.buildDayPlans` derives "where you sleep" from the recommended hotel, the change **re-stitches the whole trip** — Itinerary "Overnight", per-day budget, and PDF all update together (verified end-to-end at runtime: re-pick → Itinerary overnight flips).
- "＋ More options in [city]" fetches 3 fresh alternatives for a single destination (same dates, with an `exclude` list so nothing repeats) and appends them.
- New backend route `/api/hotelAlternatives` (`handleHotelAlternatives`) + API client `generateHotelAlternatives()`. HotelsTab gained an `onUpdate` prop (wired in `ResultsView` to `onUpdateResults({ hotels })`, which auto-saves).
- This is the first slice of the broader "editable / conversational plan" direction (swap activities, cheaper/closer/higher-rated alternatives, chat-that-acts) — hotels first because the re-stitch payoff is biggest.

### 2026-05-27 — Stitched PDF export (5 of 5 stitch follow-ons done)
- **`tripPdf.tsx` fully rebuilt.** The PDF is now a day-by-day stitched plan matching the app: the centrepiece "Day by day" pages render one card per day with the ordered move chips (Fly / Check out / Transfer / Check in), the hour-by-hour timeline or activity bullets, rainy/kids/mobility notes, an estimated per-day spend, and an "Overnight: [hotel]" / "Fly home" footer — built from the same `buildDayPlans`/`dayMoves`/`perDayCosts` helpers as the app.
- **Booking-reference pages are now day-tagged:** Flights show a "Day N" chip + weekday date per leg; Hotels show "Day N–M" + the full date range. Budget page gained a per-day spend bar chart.
- **Theme flip:** PDF moved from the old dark/Fraunces-serif editorial look to the light, modern app theme (white pages, Helvetica, coral accent). **Removed the remote webfont registration** (it was 404-ing and could break the whole export) in favour of the built-in Helvetica — the export now has no network dependency for fonts and can't fail that way.
- Verified at runtime: `generateTripPdf()` produces a valid ~117 KB `application/pdf` with a fully-populated stitched trip.

### 2026-05-27 — Stitch follow-ons (4 of 5 shipped)
- **Dashboard "Trip at a glance" rail** — a horizontal, scannable strip of the stitched days (day number, weekday, title, move icons, overnight), each tapping through to the Itinerary. Built in `DashboardTab.tsx` off `buildDayPlans` + `dayMoves`.
- **Inline mismatch warnings on day cards** — the conflict engine's findings (e.g. "transport X→Y has no matching itinerary day") now render directly on the relevant `StitchedDayCard` in the Itinerary, not just in the top summary panel. `ItineraryTab.tsx` passes `dayConflicts` filtered by day.
- **Per-day budget** — new "Day by day · what each day costs" section in `BudgetTab.tsx`, derived from `perDayCosts()` in `planStitch.ts`: flights land on their departure day, hotel cost is split across nights (per person), and food/activities/local-transport are spread evenly. `ResultsView` now passes `flights`/`transport`/`hotels`/`itinerary` to `BudgetTab`.
- **Day-anchored Taste / Do / Nearby** — each destination header in those three tabs now carries a "🗓️ Days N–M" chip showing when you're actually there, so the suggestions read as part of the plan. New `src/components/shared/DayRangeChip.tsx` + `destinationDayRanges`/`dayRangeForDestination` in `planStitch.ts`. `ResultsView` passes `config` + `itinerary` to `TasteTab`/`DoTab`/`NearbyTab`.
- New `planStitch.ts` helpers: `destinationDayRanges`, `dayRangeForDestination`, `perDayCosts`.
- **Task 5/5 (stitched-PDF rewrite) — now done, see the entry above this one.**

### 2026-05-27 — Stitched plan (everything joined on dates)
- New `src/lib/planStitch.ts` — `buildDayPlans()` joins flights / hotels / transport / itinerary on the date axis; `dayMoves()` produces the ordered fly→checkout→transport→checkin chips per day.
- Rebuilt the **Itinerary tab** from a collapsible location-grouped list into a continuous day-by-day narrative (`StitchedDayCard`): each day shows its real flights, hotel check-in/out, transfers, activity teaser, and an "Overnight: [hotel]" / "Fly home" footer. Tap still expands the hour-by-hour timeline.
- **Flights tab** now shows a "Day N" badge + full weekday date (🗓️ Wed 1 Jul) on each leg, tying it to the itinerary.
- **Hotels tab** now shows the stay as "Day N–M" + full date range (🗓️ Wed 1 Jul → Sat 4 Jul), matching when the itinerary has you in that city.
- New date helpers in `dateUtils.ts`: `parseLocalDate`, `formatDayLabel`, `formatDateFull`, `weekdayShort`, `isDateInStay`, `tripDayNumber` (all timezone-safe local-date parsing).

### 2026-05-27 — QA round 3 (post-WOW hardening)
- Fixed `PrepareTab` nested `<a>` inside `<button>` — checklist rows now use `<div role="button" tabIndex={0}>` with keyboard handler, so the deep-link anchor is valid HTML.
- Fixed `DashboardTab` NaN edge case — when `config.departureDate` or `returnDate` are missing/invalid, the component now renders "Dates pending" instead of "Invalid Date → Invalid Date · NaN days", and the state banner is suppressed.
- Fixed `handleItinerary` + `handleFlights` + `handleBudget` hard-coding "Melbourne" — they now use the user's chosen `config.origin`. New `originCity()` / `originCode()` helpers in `api/[route].ts` resolve common IATA codes (MEL/SYD/BNE/PER/ADL/OOL/CBR/HBA/CNS/DRW/AKL/SIN/HKG/NRT/LHR/LAX) to city names; unknown codes fall through as the IATA code itself.
- Fixed `flightWatchId` case-sensitivity — `SYD` and `syd` now produce the same watch-list id, so the same flight isn't tracked twice across regenerations.
- Fixed `computeEndTime` midnight overflow — events that finish past midnight now display "01:30 +1d" instead of misleadingly showing "01:30" same-day.
- Aligned `PrepareTab`'s "post-trip" boundary with `DashboardTab` — both now use `tripLengthDays`-based logic so the tab disappears the day after the trip ends, not earlier.
- Cleaned up dead JPY branch in `BudgetTab.formatMoney`.

### 2026-05-27 — WOW build-out (12 phases)
- Per-traveller profiles: dietary / mobility / interests / name per person. Drives personalised LLM generation.
- Trip modes: standard / family / senior / accessibility. Auto-detected, user-overridable.
- Hour-by-hour itinerary: `TimelineEvent` schema with time/duration/type/tip/travel-from-prev. Rainy-backup / kids-tip / accessibility-note per day.
- New `🎯 Ready` tab: pre-trip readiness countdown with 12-item checklist sorted by deadline.
- Live-mode dashboard: pre/in/post-trip state banners.
- Tips prompt enriched: 12-15 tips, mandatory cultural depth (tipping, dress codes, photography, body language).
- Flight price tracking: `🔔 Track price` toggle backed by a localStorage watch list.
- Budget realism: "Where it goes" stacked-bar spend viz.
- Journal recap stats card.
- Group bill split widget in Budget tab.
- Inspiration: `🎲 Surprise me — pick one` CTA.
- i18n scaffold: `src/lib/i18n.ts` with `t(key)` lookup, persistence, language-change event.

### 2026-05-27 — Composite QA round 2
- Fixed VisaTab/CurrencyTab/WeatherTab unguarded `.length` and `.toLowerCase` crashes on partial LLM data.
- Fixed HotelsTab destination accordion nested-interactive (button containing anchors).
- Fixed BudgetTab divide-by-zero on zero-day comparisons.
- Fixed CurrencyTab FxSparkline divide-by-zero on missing baseline rate.
- Fixed `tripUrl.ts` `btoa` Unicode crash (UTF-8-safe encoder now).
- Fixed `tripPdf.tsx` crashes on missing destination / non-numeric stars.
- Fixed ResultsView not passing travellers/departureDate to VisaTab.
- Sanitised the top-level API error response so internal details no longer leak to clients.
- Hardened API handlers with `safeConfig()` coercion against malformed payloads.
- Added missing `VISA_SYSTEM` import — Visa tab was throwing 500s in production.

### 2026-05-27 — Composite QA round 1
- Light-theme redesign across the app.
- Resolved cascade-layer padding bug (custom `* { margin:0; padding:0 }` overriding Tailwind utilities).
- Per-traveller budget feature (per-person target with ±20% UI status panel).
- Fixed stale-closure date bug (TravelDetails → generate now passes data explicitly).
- Trip delete uses in-app two-step confirm (no native dialog ghost-click).
- TravelDetails honours `departureDate`/`returnDate` props (saved trips & shared links).
- CountryPicker rebuilt: light-theme Airbnb-style with `motion.div role="button"` (fixed nested-button hydration errors).
- MyTrips Escape cancels rename + blur-commit guard.

---

*End of guide. Found something out of date? See § 14.*

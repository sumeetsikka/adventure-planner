/**
 * Magazine-quality PDF export for the Holiday Planner trip.
 *
 * Generates a multi-page editorial-style PDF using @react-pdf/renderer:
 *   - Cover page with hero photograph and serif typography
 *   - At-a-glance route + stats spread
 *   - Day-by-day itinerary
 *   - Hotels, flights, budget, restaurants, activities, and a practical page
 *
 * Exported as a single async function — call from a click handler.
 */

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  pdf,
} from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import type { TravelConfig, GenerationResults } from '../types';
import { formatDateAU, addDaysISO } from './dateUtils';
import { getCountryHero, getDestinationPhoto } from './imagery';

/* ------------------------------------------------------------------ */
/* Fonts                                                              */
/* ------------------------------------------------------------------ */

// Register Fraunces (serif display). Google Fonts gstatic URLs serve
// .ttf files that @react-pdf can consume directly.
Font.register({
  family: 'Fraunces',
  fonts: [
    {
      // Fraunces 400 regular
      src: 'https://fonts.gstatic.com/s/fraunces/v32/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk.ttf',
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {
      // Fraunces 700 bold
      src: 'https://fonts.gstatic.com/s/fraunces/v32/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea9-uemAk.ttf',
      fontWeight: 700,
      fontStyle: 'normal',
    },
    {
      // Fraunces 400 italic
      src: 'https://fonts.gstatic.com/s/fraunces/v32/6NUu8FyLNQOQZAnv9ZwNqvUry7HhcdR6eUKxJ7t6.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
  ],
});

// Reasonable system-sans fallback for body. Helvetica is built-in.
const SANS = 'Helvetica';

/* ------------------------------------------------------------------ */
/* Palette                                                            */
/* ------------------------------------------------------------------ */

const INK = '#0A0806';
const CREAM = '#F5EDE0';
const CREAM_DIM = '#C9BCA8';
const GOLD = '#D4A574';
const TERRACOTTA = '#C65D3B';
const LINE = '#3A322A';

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  page: {
    backgroundColor: INK,
    color: CREAM,
    fontFamily: SANS,
    fontSize: 10,
    padding: 48,
  },
  coverPage: {
    backgroundColor: INK,
    color: CREAM,
    fontFamily: SANS,
    padding: 0,
  },
  coverImage: {
    width: '100%',
    height: '62%',
    objectFit: 'cover',
  },
  coverFallback: {
    width: '100%',
    height: '62%',
    backgroundColor: TERRACOTTA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverEmoji: {
    fontSize: 140,
    color: CREAM,
  },
  coverBody: {
    padding: 48,
    paddingTop: 36,
  },
  eyebrow: {
    fontFamily: SANS,
    fontSize: 8,
    letterSpacing: 3,
    color: GOLD,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  display: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 56,
    color: CREAM,
    lineHeight: 1.05,
    marginBottom: 4,
  },
  displayItalic: {
    fontFamily: 'Fraunces',
    fontStyle: 'italic',
    fontWeight: 400,
    color: GOLD,
  },
  coverMeta: {
    marginTop: 20,
    color: CREAM_DIM,
    fontSize: 10,
    fontFamily: SANS,
    letterSpacing: 0.5,
  },
  credit: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    fontFamily: SANS,
    fontSize: 7,
    letterSpacing: 3,
    color: GOLD,
    textTransform: 'uppercase',
  },
  h1: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 32,
    color: CREAM,
    marginBottom: 8,
    lineHeight: 1.1,
  },
  h2: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 20,
    color: CREAM,
    marginBottom: 8,
  },
  italic: {
    fontFamily: 'Fraunces',
    fontStyle: 'italic',
    color: GOLD,
  },
  body: {
    fontFamily: SANS,
    fontSize: 10,
    lineHeight: 1.55,
    color: CREAM,
  },
  bodyDim: {
    fontFamily: SANS,
    fontSize: 10,
    lineHeight: 1.55,
    color: CREAM_DIM,
  },
  rule: {
    borderBottomWidth: 0.6,
    borderBottomColor: LINE,
    marginVertical: 14,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 28,
  },
  col: {
    flex: 1,
  },
  statBox: {
    borderWidth: 0.6,
    borderColor: LINE,
    borderRadius: 4,
    padding: 14,
    marginBottom: 10,
  },
  statValue: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 26,
    color: GOLD,
  },
  statLabel: {
    fontFamily: SANS,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: CREAM_DIM,
    marginTop: 4,
  },
  routeItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  routeNum: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 16,
    color: GOLD,
    width: 30,
  },
  routeText: {
    fontFamily: 'Fraunces',
    fontSize: 14,
    color: CREAM,
    flex: 1,
    paddingTop: 1,
  },
  routeNote: {
    fontFamily: SANS,
    fontSize: 8,
    color: CREAM_DIM,
    marginTop: 1,
  },
  dayCard: {
    marginBottom: 22,
    paddingBottom: 16,
    borderBottomWidth: 0.6,
    borderBottomColor: LINE,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dayNumber: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 42,
    color: GOLD,
    marginRight: 16,
    lineHeight: 1,
  },
  dayMetaWrap: {
    flex: 1,
    paddingTop: 4,
  },
  dayDate: {
    fontFamily: SANS,
    fontSize: 7,
    letterSpacing: 2,
    color: CREAM_DIM,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dayLocation: {
    fontFamily: SANS,
    fontSize: 9,
    color: GOLD,
    marginBottom: 4,
  },
  dayTitle: {
    fontFamily: 'Fraunces',
    fontStyle: 'italic',
    fontSize: 18,
    color: CREAM,
  },
  activityRow: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 58,
  },
  activityNum: {
    fontFamily: 'Fraunces',
    fontSize: 9,
    color: GOLD,
    width: 18,
  },
  activityText: {
    fontFamily: SANS,
    fontSize: 9.5,
    color: CREAM,
    flex: 1,
    lineHeight: 1.45,
  },
  hotelCallout: {
    marginTop: 10,
    marginLeft: 58,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: GOLD,
    backgroundColor: '#13100C',
  },
  hotelCalloutLabel: {
    fontFamily: SANS,
    fontSize: 7,
    letterSpacing: 2,
    color: GOLD,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  hotelCalloutName: {
    fontFamily: 'Fraunces',
    fontSize: 11,
    color: CREAM,
  },
  hotelEntry: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.4,
    borderBottomColor: LINE,
  },
  hotelDates: {
    fontFamily: SANS,
    fontSize: 7,
    letterSpacing: 2,
    color: GOLD,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  hotelName: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 14,
    color: CREAM,
    marginBottom: 2,
  },
  hotelArea: {
    fontFamily: SANS,
    fontStyle: 'italic',
    fontSize: 9,
    color: CREAM_DIM,
    marginBottom: 5,
  },
  hotelWhy: {
    fontFamily: SANS,
    fontSize: 9,
    color: CREAM,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  hotelPrice: {
    fontFamily: 'Fraunces',
    fontSize: 10,
    color: GOLD,
  },
  flightRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    borderBottomWidth: 0.4,
    borderBottomColor: LINE,
  },
  flightFromTo: {
    fontFamily: 'Fraunces',
    fontSize: 13,
    color: CREAM,
    flex: 2,
  },
  flightDate: {
    fontFamily: SANS,
    fontSize: 8,
    color: CREAM_DIM,
    flex: 1,
  },
  flightAirline: {
    fontFamily: SANS,
    fontSize: 8,
    color: CREAM,
    flex: 1.4,
  },
  flightDuration: {
    fontFamily: SANS,
    fontSize: 8,
    color: CREAM_DIM,
    flex: 1,
  },
  flightPrice: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 11,
    color: GOLD,
    flex: 1,
    textAlign: 'right',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 0.4,
    borderBottomColor: LINE,
  },
  budgetCat: {
    fontFamily: 'Fraunces',
    fontSize: 12,
    color: CREAM,
  },
  budgetCost: {
    fontFamily: 'Fraunces',
    fontSize: 12,
    color: GOLD,
  },
  budgetTotalBlock: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: GOLD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  budgetTotalNum: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 38,
    color: GOLD,
  },
  restaurantRow: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: LINE,
  },
  restaurantName: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 12,
    color: CREAM,
  },
  restaurantMeta: {
    fontFamily: SANS,
    fontSize: 8,
    color: CREAM_DIM,
    marginTop: 1,
  },
  restaurantDish: {
    fontFamily: SANS,
    fontStyle: 'italic',
    fontSize: 9,
    color: GOLD,
    marginTop: 2,
  },
  activityCard: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: LINE,
  },
  activityName: {
    fontFamily: 'Fraunces',
    fontWeight: 700,
    fontSize: 12,
    color: CREAM,
  },
  activityCategory: {
    fontFamily: SANS,
    fontSize: 7,
    letterSpacing: 2,
    color: GOLD,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  activityMeta: {
    fontFamily: SANS,
    fontSize: 8,
    color: CREAM_DIM,
    marginTop: 2,
  },
  pageNum: {
    position: 'absolute',
    bottom: 24,
    right: 48,
    fontFamily: SANS,
    fontSize: 7,
    color: CREAM_DIM,
    letterSpacing: 2,
  },
  pageRunningHead: {
    position: 'absolute',
    top: 22,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  runningHeadText: {
    fontFamily: SANS,
    fontSize: 7,
    color: CREAM_DIM,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  visaRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 0.3,
    borderBottomColor: LINE,
  },
  visaLabel: {
    fontFamily: SANS,
    fontSize: 8,
    letterSpacing: 2,
    color: CREAM_DIM,
    textTransform: 'uppercase',
    width: 110,
  },
  visaValue: {
    fontFamily: SANS,
    fontSize: 10,
    color: CREAM,
    flex: 1,
  },
});

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function priceToNumber(v: string | undefined): number {
  if (!v) return 0;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function sumBudget(budget: { category: string; cost: string }[]): number {
  return budget.reduce((acc, b) => acc + priceToNumber(b.cost), 0);
}

function RunningHead({ left, right }: { left: string; right: string }) {
  return (
    <View style={styles.pageRunningHead} fixed>
      <Text style={styles.runningHeadText}>{left}</Text>
      <Text style={styles.runningHeadText}>{right}</Text>
    </View>
  );
}

function PageNum() {
  return (
    <Text
      style={styles.pageNum}
      render={({ pageNumber }) => `${String(pageNumber).padStart(2, '0')}`}
      fixed
    />
  );
}

/* ------------------------------------------------------------------ */
/* Page components                                                    */
/* ------------------------------------------------------------------ */

interface CoverProps {
  config: TravelConfig;
  totalDays: number;
  tripIdShort: string;
  heroUrl: string | null;
}

function CoverPage({ config, totalDays, tripIdShort, heroUrl }: CoverProps) {
  return (
    <Page size="A4" style={styles.coverPage}>
      {heroUrl ? (
        // @react-pdf accepts a string src — cross-origin is fine here.
        <Image src={heroUrl} style={styles.coverImage} />
      ) : (
        <View style={styles.coverFallback}>
          <Text style={styles.coverEmoji}>{config.country?.emoji || ''}</Text>
        </View>
      )}
      <View style={styles.coverBody}>
        <Text style={styles.eyebrow}>An Editorial Itinerary</Text>
        <Text style={styles.display}>
          {config.country?.name || 'Your'}
        </Text>
        <Text style={[styles.display, styles.displayItalic]}>adventure.</Text>
        <Text style={styles.coverMeta}>
          {formatDateAU(config.departureDate)}  —  {formatDateAU(config.returnDate)}
        </Text>
        <Text style={styles.coverMeta}>
          {config.travellers} traveller{config.travellers > 1 ? 's' : ''}  ·  {totalDays} days
        </Text>
      </View>
      <Text style={styles.credit}>
        Adventure Planner  ·  Issue No. {tripIdShort}
      </Text>
    </Page>
  );
}

function AtAGlancePage({
  config,
  results,
  totalDays,
}: {
  config: TravelConfig;
  results: GenerationResults;
  totalDays: number;
}) {
  const perPerson = sumBudget(results.budget);
  const group = perPerson * (config.travellers || 1);

  return (
    <Page size="A4" style={styles.page}>
      <RunningHead left="At a glance" right={config.country?.name || ''} />
      <View style={{ marginTop: 24 }}>
        <Text style={styles.eyebrow}>Chapter One</Text>
        <Text style={styles.h1}>
          The trip <Text style={styles.italic}>at a glance.</Text>
        </Text>
        <View style={styles.rule} />
      </View>

      <View style={styles.twoCol}>
        <View style={styles.col}>
          <Text style={styles.eyebrow}>Route</Text>
          {config.destinations.map((d, i) => (
            <View key={d.id} style={styles.routeItem}>
              <Text style={styles.routeNum}>{String(i + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.routeText}>
                  {d.name.split('(')[0].split('/')[0].trim()}
                </Text>
                {d.region ? <Text style={styles.routeNote}>{d.region}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.col}>
          <Text style={styles.eyebrow}>By the numbers</Text>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalDays}</Text>
            <Text style={styles.statLabel}>Total days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{results.flights?.length || 0}</Text>
            <Text style={styles.statLabel}>Flight legs</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{results.hotels?.length || 0}</Text>
            <Text style={styles.statLabel}>Hotel stops</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>${Math.round(perPerson).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Per person AUD</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>${Math.round(group).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Group total AUD</Text>
          </View>
        </View>
      </View>

      <PageNum />
    </Page>
  );
}

function ItineraryPages({
  config,
  results,
}: {
  config: TravelConfig;
  results: GenerationResults;
}) {
  if (!results.itinerary || results.itinerary.length === 0) return null;

  const hotelByDest = new Map(
    (results.hotels || []).map((h) => [h.destination.toLowerCase(), h])
  );

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="The itinerary" right={config.country?.name || ''} />
      <View style={{ marginTop: 24 }}>
        <Text style={styles.eyebrow}>Chapter Two</Text>
        <Text style={styles.h1}>
          Day <Text style={styles.italic}>by day.</Text>
        </Text>
        <View style={styles.rule} />
      </View>

      {results.itinerary.map((day) => {
        const date = addDaysISO(config.departureDate, day.day - 1);
        const hotel = hotelByDest.get((day.location || '').toLowerCase());
        const firstHotel = hotel?.hotels?.[0];
        return (
          <View key={day.day} style={styles.dayCard} wrap={false}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayNumber}>{String(day.day).padStart(2, '0')}</Text>
              <View style={styles.dayMetaWrap}>
                <Text style={styles.dayDate}>{formatDateAU(date)}</Text>
                <Text style={styles.dayLocation}>{day.location}</Text>
                <Text style={styles.dayTitle}>{day.title}</Text>
              </View>
            </View>
            {(day.activities || []).map((a, i) => (
              <View key={i} style={styles.activityRow}>
                <Text style={styles.activityNum}>{i + 1}.</Text>
                <Text style={styles.activityText}>{a}</Text>
              </View>
            ))}
            {firstHotel ? (
              <View style={styles.hotelCallout}>
                <Text style={styles.hotelCalloutLabel}>Tonight you stay at</Text>
                <Text style={styles.hotelCalloutName}>
                  {firstHotel.name} <Text style={styles.bodyDim}>— {firstHotel.area}</Text>
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}

      <PageNum />
    </Page>
  );
}

function HotelsPage({
  config,
  results,
}: {
  config: TravelConfig;
  results: GenerationResults;
}) {
  if (!results.hotels || results.hotels.length === 0) return null;

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Where you sleep" right={config.country?.name || ''} />
      <View style={{ marginTop: 24 }}>
        <Text style={styles.eyebrow}>Chapter Three</Text>
        <Text style={styles.h1}>
          Where you <Text style={styles.italic}>sleep.</Text>
        </Text>
        <View style={styles.rule} />
      </View>

      {results.hotels.map((destBlock, di) => {
        const pick = destBlock.hotels?.find((h) => h.recommended) || destBlock.hotels?.[0];
        if (!pick) return null;
        return (
          <View key={di} style={styles.hotelEntry} wrap={false}>
            <Text style={styles.hotelDates}>
              {formatDateAU(destBlock.check_in)} → {formatDateAU(destBlock.check_out)}  ·  {destBlock.nights} night{destBlock.nights > 1 ? 's' : ''}  ·  {destBlock.destination}
            </Text>
            <Text style={styles.hotelName}>{pick.name}</Text>
            <Text style={styles.hotelArea}>
              {pick.area} · {pick.style} · {'★'.repeat(Math.max(0, Math.round(pick.stars)))}
            </Text>
            <Text style={styles.hotelWhy}>{pick.why}</Text>
            <Text style={styles.hotelPrice}>{pick.price_per_night_aud} / night</Text>
          </View>
        );
      })}

      <PageNum />
    </Page>
  );
}

function FlightsPage({
  config,
  results,
}: {
  config: TravelConfig;
  results: GenerationResults;
}) {
  if (!results.flights || results.flights.length === 0) return null;

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="In transit" right={config.country?.name || ''} />
      <View style={{ marginTop: 24 }}>
        <Text style={styles.eyebrow}>Chapter Four</Text>
        <Text style={styles.h1}>
          In <Text style={styles.italic}>transit.</Text>
        </Text>
        <View style={styles.rule} />
      </View>

      <View style={{ flexDirection: 'row', paddingBottom: 6, borderBottomWidth: 0.6, borderBottomColor: LINE }}>
        <Text style={[styles.runningHeadText, { flex: 2 }]}>Route</Text>
        <Text style={[styles.runningHeadText, { flex: 1 }]}>Date</Text>
        <Text style={[styles.runningHeadText, { flex: 1.4 }]}>Airline</Text>
        <Text style={[styles.runningHeadText, { flex: 1 }]}>Duration</Text>
        <Text style={[styles.runningHeadText, { flex: 1, textAlign: 'right' }]}>Price</Text>
      </View>

      {results.flights.map((f, i) => (
        <View key={i} style={styles.flightRow} wrap={false}>
          <Text style={styles.flightFromTo}>
            {f.from_code} → {f.to_code}
          </Text>
          <Text style={styles.flightDate}>{formatDateAU(f.date)}</Text>
          <Text style={styles.flightAirline}>{(f.airlines || []).join(', ') || '—'}</Text>
          <Text style={styles.flightDuration}>{f.duration}</Text>
          <Text style={styles.flightPrice}>{f.price_estimate_aud}</Text>
        </View>
      ))}

      <PageNum />
    </Page>
  );
}

function BudgetPage({
  config,
  results,
}: {
  config: TravelConfig;
  results: GenerationResults;
}) {
  if (!results.budget || results.budget.length === 0) return null;
  const perPerson = sumBudget(results.budget);
  const group = perPerson * (config.travellers || 1);

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="The numbers" right={config.country?.name || ''} />
      <View style={{ marginTop: 24 }}>
        <Text style={styles.eyebrow}>Chapter Five</Text>
        <Text style={styles.h1}>
          The <Text style={styles.italic}>numbers.</Text>
        </Text>
        <View style={styles.rule} />
      </View>

      {results.budget.map((b, i) => (
        <View key={i} style={styles.budgetRow} wrap={false}>
          <Text style={styles.budgetCat}>{b.category}</Text>
          <Text style={styles.budgetCost}>{b.cost}</Text>
        </View>
      ))}

      <View style={styles.budgetTotalBlock}>
        <View>
          <Text style={styles.eyebrow}>Per person · AUD</Text>
          <Text style={styles.budgetTotalNum}>${Math.round(perPerson).toLocaleString()}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.eyebrow}>Group total</Text>
          <Text style={[styles.budgetTotalNum, { color: TERRACOTTA }]}>
            ${Math.round(group).toLocaleString()}
          </Text>
        </View>
      </View>

      <PageNum />
    </Page>
  );
}

function RestaurantsPage({
  config,
  results,
}: {
  config: TravelConfig;
  results: GenerationResults;
}) {
  if (!results.restaurants || results.restaurants.length === 0) return null;
  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="The table" right={config.country?.name || ''} />
      <View style={{ marginTop: 24 }}>
        <Text style={styles.eyebrow}>Chapter Six</Text>
        <Text style={styles.h1}>
          At the <Text style={styles.italic}>table.</Text>
        </Text>
        <View style={styles.rule} />
      </View>

      {results.restaurants.map((destBlock, di) => (
        <View key={di} style={{ marginBottom: 14 }} wrap={false}>
          <Text style={[styles.h2, { marginTop: 6 }]}>{destBlock.destination}</Text>
          {(destBlock.restaurants || []).slice(0, 5).map((r, i) => (
            <View key={i} style={styles.restaurantRow}>
              <Text style={styles.restaurantName}>{r.name}  <Text style={[styles.bodyDim, { fontSize: 9 }]}>{r.price_tier}</Text></Text>
              <Text style={styles.restaurantMeta}>{r.cuisine} · {r.neighbourhood}</Text>
              {r.signature_dish ? <Text style={styles.restaurantDish}>“{r.signature_dish}”</Text> : null}
            </View>
          ))}
        </View>
      ))}

      <PageNum />
    </Page>
  );
}

function ActivitiesPage({
  config,
  results,
}: {
  config: TravelConfig;
  results: GenerationResults;
}) {
  if (!results.activities || results.activities.length === 0) return null;
  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Things to do" right={config.country?.name || ''} />
      <View style={{ marginTop: 24 }}>
        <Text style={styles.eyebrow}>Chapter Seven</Text>
        <Text style={styles.h1}>
          Things to <Text style={styles.italic}>do.</Text>
        </Text>
        <View style={styles.rule} />
      </View>

      {results.activities.map((destBlock, di) => (
        <View key={di} style={{ marginBottom: 14 }} wrap={false}>
          <Text style={[styles.h2, { marginTop: 6 }]}>{destBlock.destination}</Text>
          {(destBlock.activities || []).map((a, i) => (
            <View key={i} style={styles.activityCard}>
              <Text style={styles.activityName}>{a.name}</Text>
              <Text style={styles.activityCategory}>{a.category}</Text>
              <Text style={styles.activityMeta}>{a.duration} · {a.price_estimate_aud}{a.difficulty ? ` · ${a.difficulty}` : ''}</Text>
            </View>
          ))}
        </View>
      ))}

      <PageNum />
    </Page>
  );
}

function PracticalPage({
  config,
  results,
}: {
  config: TravelConfig;
  results: GenerationResults;
}) {
  const hasVisa = !!results.visa;
  const hasCurrency = !!results.currency;
  if (!hasVisa && !hasCurrency) return null;

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Practical" right={config.country?.name || ''} />
      <View style={{ marginTop: 24 }}>
        <Text style={styles.eyebrow}>Final chapter</Text>
        <Text style={styles.h1}>
          The <Text style={styles.italic}>practical.</Text>
        </Text>
        <View style={styles.rule} />
      </View>

      {hasVisa && results.visa ? (
        <View style={{ marginBottom: 22 }}>
          <Text style={[styles.h2, { marginBottom: 12 }]}>Visa</Text>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>Required</Text>
            <Text style={styles.visaValue}>{results.visa.visa_required ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>Type</Text>
            <Text style={styles.visaValue}>{results.visa.visa_type}</Text>
          </View>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>Max stay</Text>
            <Text style={styles.visaValue}>{results.visa.max_stay}</Text>
          </View>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>Cost</Text>
            <Text style={styles.visaValue}>{results.visa.cost_aud}</Text>
          </View>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>Processing</Text>
            <Text style={styles.visaValue}>{results.visa.processing_time}</Text>
          </View>
        </View>
      ) : null}

      {hasCurrency && results.currency ? (
        <View style={{ marginBottom: 22 }}>
          <Text style={[styles.h2, { marginBottom: 12 }]}>Currency</Text>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>Local currency</Text>
            <Text style={styles.visaValue}>
              {results.currency.currency_name} ({results.currency.currency_code}, {results.currency.symbol})
            </Text>
          </View>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>1 AUD =</Text>
            <Text style={styles.visaValue}>
              {results.currency.rate_to_aud} {results.currency.currency_code}
            </Text>
          </View>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>Tipping</Text>
            <Text style={styles.visaValue}>{results.currency.tipping_culture}</Text>
          </View>
          <View style={styles.visaRow}>
            <Text style={styles.visaLabel}>Cash vs card</Text>
            <Text style={styles.visaValue}>{results.currency.cash_vs_card}</Text>
          </View>
        </View>
      ) : null}

      <Text style={[styles.bodyDim, { textAlign: 'center', marginTop: 32, fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: GOLD }]}>
        Bon Voyage  ·  {config.country?.name || ''}
      </Text>

      <PageNum />
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Image loading w/ fallback                                          */
/* ------------------------------------------------------------------ */

/**
 * Try to load the hero image as a data URL so @react-pdf can embed it
 * without re-fetching at render time. Returns null on failure — the
 * caller renders a coloured gradient fallback with the country emoji.
 */
async function loadHeroDataUrl(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(t);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Build the magazine PDF and return a Blob ready to download.
 */
export async function generateTripPdf(
  config: TravelConfig,
  results: GenerationResults
): Promise<Blob> {
  // Use the country name as the trip ID surrogate — it's deterministic
  // for the issue number on the cover. Fall back to a short hash of the
  // destination IDs so two trips to the same country still differ.
  const seed =
    (config.country?.id || config.country?.name || '') +
    '|' +
    config.destinations.map((d) => d.id).join(',');
  const tripIdShort = seed.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'TRIP';

  const totalDays = Math.max(
    1,
    Math.round(
      (new Date(config.returnDate).getTime() -
        new Date(config.departureDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // Pre-fetch the hero into a data URL so the PDF render is offline-safe.
  const heroUrlRemote = config.country?.name
    ? getCountryHero(config.country.name, 1600, 1100)
    : '';
  const heroUrl = heroUrlRemote ? await loadHeroDataUrl(heroUrlRemote) : null;

  // Also try a destination photo as a backup — not currently used in
  // layout but reserved for future cards. Kept side-effect-free.
  void getDestinationPhoto;

  const doc: ReactElement = (
    <Document
      title={`${config.country?.name || 'Trip'} — Adventure Planner`}
      author="Adventure Planner"
      subject="Magazine itinerary"
    >
      <CoverPage
        config={config}
        totalDays={totalDays}
        tripIdShort={tripIdShort}
        heroUrl={heroUrl}
      />
      <AtAGlancePage config={config} results={results} totalDays={totalDays} />
      <ItineraryPages config={config} results={results} />
      <HotelsPage config={config} results={results} />
      <FlightsPage config={config} results={results} />
      <BudgetPage config={config} results={results} />
      <RestaurantsPage config={config} results={results} />
      <ActivitiesPage config={config} results={results} />
      <PracticalPage config={config} results={results} />
    </Document>
  );

  // pdf() returns an instance; toBlob() resolves to the final Blob.
  // The cast keeps TS happy when react-pdf's typings think this is a
  // node-only doc element.
  const instance = pdf(doc as unknown as Parameters<typeof pdf>[0]);
  return await instance.toBlob();
}

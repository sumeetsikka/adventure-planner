/* eslint-disable react-refresh/only-export-components */
/**
 * Trip PDF export — a clean, modern, STITCHED day-by-day plan.
 *
 * The centrepiece is the day-by-day itinerary: each day shows, in order, the
 * flights you take, hotels you check in/out of, transfers, the things you do,
 * an estimated per-day spend, and where you sleep that night — built from the
 * same `planStitch` join the app uses, so the PDF reads as one plan rather than
 * disconnected lists. Booking-reference pages (flights, hotels) follow, each
 * tagged with the matching trip-day so nothing is "random and dateless".
 *
 * Light, modern theme to match the app. Exported as a single async function —
 * call from a click handler.
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
import { formatDateAU, formatDayLabel, tripDayNumber } from './dateUtils';
import { buildDayPlans, dayMoves, perDayCosts, type DayPlan, type DayMove } from './planStitch';
import { getCountryHero, getDestinationPhoto } from './imagery';

/* ------------------------------------------------------------------ */
/* Fonts                                                              */
/* ------------------------------------------------------------------ */

// Use the built-in Helvetica family. It needs no network fetch, so the export
// can never fail because a webfont CDN 404s or is offline (a real bug we hit
// trying to register remote Inter .ttf files). Helvetica is a clean modern
// sans that reads well on the light theme; bold weights come for free.
const SANS = 'Helvetica';

// Disable hyphenation so words don't break mid-flow.
Font.registerHyphenationCallback((word) => [word]);

/* ------------------------------------------------------------------ */
/* Palette — light, modern (mirrors the app's CSS tokens)              */
/* ------------------------------------------------------------------ */

const INK = '#1B1B1B';        // primary text
const MUTED = '#6A6A6E';
const DIM = '#9B9B9F';
const PAPER = '#FFFFFF';
const SOFT = '#F6F6F7';       // subtle section bg
const SOFT2 = '#EFEFF1';
const TERRACOTTA = '#F15B4B';
const GOLD = '#B57C1C';
const SAGE = '#1F8A70';
const LINE = '#E6E6E9';

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: SANS,
    fontSize: 10,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 46,
  },
  coverPage: {
    backgroundColor: PAPER,
    color: INK,
    fontFamily: SANS,
    padding: 0,
  },
  coverImage: { width: '100%', height: '58%', objectFit: 'cover' },
  coverFallback: {
    width: '100%', height: '58%', backgroundColor: TERRACOTTA,
    alignItems: 'center', justifyContent: 'center',
  },
  coverEmoji: { fontSize: 130, color: PAPER },
  coverBody: { padding: 46, paddingTop: 34 },
  eyebrow: {
    fontFamily: SANS, fontWeight: 600, fontSize: 8, letterSpacing: 2.5,
    color: TERRACOTTA, textTransform: 'uppercase', marginBottom: 12,
  },
  display: {
    fontFamily: SANS, fontWeight: 700, fontSize: 46, color: INK,
    lineHeight: 1.05, letterSpacing: -1,
  },
  displayAccent: { color: TERRACOTTA },
  coverMeta: { marginTop: 18, color: MUTED, fontSize: 11, fontFamily: SANS },
  credit: {
    position: 'absolute', bottom: 30, left: 46, right: 46,
    fontFamily: SANS, fontWeight: 600, fontSize: 7, letterSpacing: 2.5,
    color: DIM, textTransform: 'uppercase',
  },
  /* The printed plan travels with the user, so the estimate caveat has to be on
     it — the in-app disclosure never makes it into the bag. */
  coverDisclaimer: {
    position: 'absolute', bottom: 48, left: 46, right: 46,
    fontFamily: SANS, fontSize: 7.5, lineHeight: 1.5, color: DIM,
  },
  h1: {
    fontFamily: SANS, fontWeight: 700, fontSize: 28, color: INK,
    marginBottom: 6, lineHeight: 1.1, letterSpacing: -0.6,
  },
  h1Accent: { color: TERRACOTTA },
  h2: { fontFamily: SANS, fontWeight: 700, fontSize: 17, color: INK, marginBottom: 8 },
  body: { fontFamily: SANS, fontSize: 10, lineHeight: 1.55, color: INK },
  bodyDim: { fontFamily: SANS, fontSize: 10, lineHeight: 1.55, color: MUTED },
  rule: { borderBottomWidth: 1, borderBottomColor: LINE, marginVertical: 12 },
  twoCol: { flexDirection: 'row', gap: 24 },
  col: { flex: 1 },

  statBox: {
    backgroundColor: SOFT, borderRadius: 8, padding: 14, marginBottom: 9,
  },
  statValue: { fontFamily: SANS, fontWeight: 700, fontSize: 24, color: INK },
  statLabel: {
    fontFamily: SANS, fontWeight: 600, fontSize: 7, letterSpacing: 1.5,
    textTransform: 'uppercase', color: DIM, marginTop: 4,
  },

  routeItem: { flexDirection: 'row', marginBottom: 9, alignItems: 'baseline' },
  routeNum: { fontFamily: SANS, fontWeight: 700, fontSize: 14, color: TERRACOTTA, width: 26 },
  routeText: { fontFamily: SANS, fontWeight: 500, fontSize: 13, color: INK, flex: 1 },
  routeNote: { fontFamily: SANS, fontSize: 8, color: DIM, marginTop: 1 },

  /* Stitched day card */
  dayCard: {
    marginBottom: 16, padding: 14,
    backgroundColor: PAPER, borderWidth: 1, borderColor: LINE, borderRadius: 10,
  },
  dayHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  dayBadge: {
    backgroundColor: SOFT2, borderRadius: 8, width: 42, height: 42,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  dayBadgeNum: { fontFamily: SANS, fontWeight: 700, fontSize: 17, color: TERRACOTTA, lineHeight: 1 },
  dayBadgeLbl: { fontFamily: SANS, fontWeight: 600, fontSize: 6, letterSpacing: 1, color: DIM, textTransform: 'uppercase', marginTop: 1 },
  dayHeaderMid: { flex: 1, paddingTop: 2 },
  dayDate: { fontFamily: SANS, fontWeight: 600, fontSize: 7.5, letterSpacing: 1.2, color: DIM, textTransform: 'uppercase', marginBottom: 2 },
  dayTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 14, color: INK, lineHeight: 1.15 },
  dayCost: { fontFamily: SANS, fontWeight: 700, fontSize: 12, color: GOLD, textAlign: 'right' },
  dayCostLbl: { fontFamily: SANS, fontWeight: 600, fontSize: 6, letterSpacing: 1, color: DIM, textTransform: 'uppercase', textAlign: 'right', marginTop: 1 },

  /* Move chips (fly / check-out / transfer / check-in) */
  moveRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  moveTag: {
    fontFamily: SANS, fontWeight: 700, fontSize: 6.5, letterSpacing: 1,
    color: PAPER, textTransform: 'uppercase',
    borderRadius: 3, paddingVertical: 2, paddingHorizontal: 4,
    marginRight: 7, marginTop: 1, width: 48, textAlign: 'center',
  },
  moveText: { fontFamily: SANS, fontWeight: 500, fontSize: 9.5, color: INK, flex: 1, lineHeight: 1.35 },
  moveSub: { fontFamily: SANS, fontSize: 8, color: MUTED, marginTop: 0.5 },

  /* Activity / timeline rows */
  actSectionLabel: {
    fontFamily: SANS, fontWeight: 600, fontSize: 7, letterSpacing: 1.5,
    color: DIM, textTransform: 'uppercase', marginTop: 8, marginBottom: 4,
  },
  actRow: { flexDirection: 'row', marginBottom: 3 },
  actTime: { fontFamily: SANS, fontWeight: 600, fontSize: 8.5, color: TERRACOTTA, width: 34 },
  actBullet: { fontFamily: SANS, fontWeight: 700, fontSize: 9, color: TERRACOTTA, width: 12 },
  actText: { fontFamily: SANS, fontSize: 9.5, color: INK, flex: 1, lineHeight: 1.4 },

  /* Day notes (rainy / kids / mobility) */
  noteBox: { marginTop: 7, borderRadius: 6, padding: 7, flexDirection: 'row' },
  noteLabel: { fontFamily: SANS, fontWeight: 700, fontSize: 7, letterSpacing: 0.8, textTransform: 'uppercase', width: 56 },
  noteText: { fontFamily: SANS, fontSize: 8.5, color: INK, flex: 1, lineHeight: 1.4 },

  /* Overnight footer */
  tonightRow: {
    marginTop: 9, paddingTop: 8, borderTopWidth: 1, borderTopColor: LINE,
    flexDirection: 'row', alignItems: 'center',
  },
  tonightLbl: { fontFamily: SANS, fontWeight: 600, fontSize: 7, letterSpacing: 1.2, color: DIM, textTransform: 'uppercase', marginRight: 6 },
  tonightText: { fontFamily: SANS, fontWeight: 500, fontSize: 9.5, color: INK },

  /* Booking-reference tables */
  refDayTag: {
    fontFamily: SANS, fontWeight: 700, fontSize: 7, letterSpacing: 0.5,
    color: TERRACOTTA, backgroundColor: '#FCEBE9', borderRadius: 4,
    paddingVertical: 2, paddingHorizontal: 5, marginRight: 8,
  },
  hotelEntry: { marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: LINE },
  hotelDateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  hotelDates: { fontFamily: SANS, fontWeight: 600, fontSize: 8, letterSpacing: 0.5, color: MUTED },
  hotelName: { fontFamily: SANS, fontWeight: 700, fontSize: 13, color: INK, marginBottom: 2 },
  hotelArea: { fontFamily: SANS, fontSize: 9, color: MUTED, marginBottom: 4 },
  hotelWhy: { fontFamily: SANS, fontSize: 9, color: INK, lineHeight: 1.5, marginBottom: 3 },
  hotelPrice: { fontFamily: SANS, fontWeight: 700, fontSize: 10, color: GOLD },

  flightCard: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: LINE,
  },
  flightRoute: { fontFamily: SANS, fontWeight: 700, fontSize: 12, color: INK, flex: 2 },
  flightMeta: { fontFamily: SANS, fontSize: 8, color: MUTED, flex: 1.6 },
  flightPrice: { fontFamily: SANS, fontWeight: 700, fontSize: 11, color: GOLD, flex: 1, textAlign: 'right' },

  budgetRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: LINE,
  },
  budgetCat: { fontFamily: SANS, fontWeight: 500, fontSize: 11, color: INK },
  budgetCost: { fontFamily: SANS, fontWeight: 700, fontSize: 11, color: GOLD },
  budgetTotalBlock: {
    marginTop: 20, paddingTop: 16, borderTopWidth: 2, borderTopColor: TERRACOTTA,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  budgetTotalNum: { fontFamily: SANS, fontWeight: 700, fontSize: 32, color: INK },

  restaurantRow: { marginBottom: 9, paddingBottom: 7, borderBottomWidth: 1, borderBottomColor: LINE },
  restaurantName: { fontFamily: SANS, fontWeight: 700, fontSize: 11, color: INK },
  restaurantMeta: { fontFamily: SANS, fontSize: 8, color: MUTED, marginTop: 1 },
  restaurantDish: { fontFamily: SANS, fontSize: 9, color: GOLD, marginTop: 2 },

  activityCard: { marginBottom: 9, paddingBottom: 7, borderBottomWidth: 1, borderBottomColor: LINE },
  activityName: { fontFamily: SANS, fontWeight: 700, fontSize: 11, color: INK },
  activityCategory: { fontFamily: SANS, fontWeight: 600, fontSize: 7, letterSpacing: 1.5, color: TERRACOTTA, textTransform: 'uppercase', marginTop: 2 },
  activityMeta: { fontFamily: SANS, fontSize: 8, color: MUTED, marginTop: 2 },

  pageNum: { position: 'absolute', bottom: 24, right: 46, fontFamily: SANS, fontSize: 7, color: DIM, letterSpacing: 1.5 },
  pageRunningHead: { position: 'absolute', top: 24, left: 46, right: 46, flexDirection: 'row', justifyContent: 'space-between' },
  runningHeadText: { fontFamily: SANS, fontWeight: 600, fontSize: 7, color: DIM, letterSpacing: 1.5, textTransform: 'uppercase' },

  visaRow: { flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: LINE },
  visaLabel: { fontFamily: SANS, fontWeight: 600, fontSize: 8, letterSpacing: 1, color: DIM, textTransform: 'uppercase', width: 110 },
  visaValue: { fontFamily: SANS, fontSize: 10, color: INK, flex: 1 },
});

/* ------------------------------------------------------------------ */
/* Move tag styling per kind                                          */
/* ------------------------------------------------------------------ */

const MOVE_TAG: Record<DayMove['kind'], { label: string; bg: string }> = {
  flight: { label: 'Fly', bg: TERRACOTTA },
  checkout: { label: 'Check out', bg: DIM },
  transport: { label: 'Transfer', bg: GOLD },
  checkin: { label: 'Check in', bg: SAGE },
};

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

function money(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
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
    <Text style={styles.pageNum} render={({ pageNumber }) => `${String(pageNumber).padStart(2, '0')}`} fixed />
  );
}

/* ------------------------------------------------------------------ */
/* Cover                                                              */
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
        <Image src={heroUrl} style={styles.coverImage} />
      ) : (
        <View style={styles.coverFallback}>
          <Text style={styles.coverEmoji}>{config.country?.emoji || ''}</Text>
        </View>
      )}
      <View style={styles.coverBody}>
        <Text style={styles.eyebrow}>Your trip, day by day</Text>
        <Text style={styles.display}>
          {config.country?.name || 'Your'} <Text style={styles.displayAccent}>adventure.</Text>
        </Text>
        <Text style={styles.coverMeta}>
          {formatDateAU(config.departureDate)}  —  {formatDateAU(config.returnDate)}
        </Text>
        <Text style={styles.coverMeta}>
          {config.travellers} traveller{config.travellers > 1 ? 's' : ''}  ·  {totalDays} days
        </Text>
      </View>
      <Text style={styles.coverDisclaimer}>
        Prices, times and availability in this plan are AI-generated estimates to help you plan,
        not live quotes. Confirm details on the booking site before you book, and check visa and
        entry rules with the official government source for your passport.
      </Text>
      <Text style={styles.credit}>Adventure Planner  ·  {tripIdShort}</Text>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* At a glance                                                        */
/* ------------------------------------------------------------------ */

function AtAGlancePage({
  config, results, totalDays,
}: { config: TravelConfig; results: GenerationResults; totalDays: number }) {
  const perPerson = sumBudget(results.budget);
  const group = perPerson * (config.travellers || 1);

  return (
    <Page size="A4" style={styles.page}>
      <RunningHead left="At a glance" right={config.country?.name || ''} />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.eyebrow}>Overview</Text>
        <Text style={styles.h1}>The trip <Text style={styles.h1Accent}>at a glance.</Text></Text>
        <View style={styles.rule} />
      </View>

      <View style={styles.twoCol}>
        <View style={styles.col}>
          <Text style={styles.eyebrow}>Route</Text>
          {config.destinations.map((d, i) => (
            <View key={d.id} style={styles.routeItem}>
              <Text style={styles.routeNum}>{String(i + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.routeText}>{(d.name || '').split('(')[0].split('/')[0].trim()}</Text>
                {d.region ? <Text style={styles.routeNote}>{d.region}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.col}>
          <Text style={styles.eyebrow}>By the numbers</Text>
          <View style={styles.statBox}><Text style={styles.statValue}>{totalDays}</Text><Text style={styles.statLabel}>Total days</Text></View>
          <View style={styles.statBox}><Text style={styles.statValue}>{results.flights?.length || 0}</Text><Text style={styles.statLabel}>Flight legs</Text></View>
          <View style={styles.statBox}><Text style={styles.statValue}>{results.hotels?.length || 0}</Text><Text style={styles.statLabel}>Hotel stops</Text></View>
          <View style={styles.statBox}><Text style={styles.statValue}>{money(perPerson)}</Text><Text style={styles.statLabel}>Per person AUD</Text></View>
          <View style={styles.statBox}><Text style={styles.statValue}>{money(group)}</Text><Text style={styles.statLabel}>Group total AUD</Text></View>
        </View>
      </View>

      <PageNum />
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* THE STITCHED ITINERARY — the centrepiece                            */
/* ------------------------------------------------------------------ */

function StitchedItineraryPages({
  config, plans, dayCostByDay,
}: {
  config: TravelConfig;
  plans: DayPlan[];
  dayCostByDay: Map<number, number>;
}) {
  if (plans.length === 0) return null;

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Day by day" right={config.country?.name || ''} />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.eyebrow}>The plan</Text>
        <Text style={styles.h1}>Day <Text style={styles.h1Accent}>by day.</Text></Text>
        <Text style={styles.bodyDim}>
          Everything in order — flights, stays, transfers and what to do, stitched together.
        </Text>
        <View style={styles.rule} />
      </View>

      {plans.map((plan) => {
        const day = plan.itineraryDay;
        const moves = dayMoves(plan);
        const title = day?.title || (plan.isLastDay ? 'Departure day' : plan.isFirstDay ? 'Arrival day' : `Day ${plan.day}`);
        const location = day?.location || plan.checkIns[0]?.dest.destination || plan.stayingTonight?.dest.destination || '';
        const cost = dayCostByDay.get(plan.day) ?? 0;

        // Timeline (preferred) or bullet activities.
        const timeline = day?.timeline && day.timeline.length > 0 ? day.timeline : null;
        const activities = !timeline ? (day?.activities || []) : [];

        // Tonight.
        let tonight: string | null = null;
        if (plan.isLastDay && plan.flights.some((f) => f.type === 'international')) tonight = 'Fly home — trip complete';
        else if (plan.stayingTonight?.pick) tonight = `Overnight: ${plan.stayingTonight.pick.name}`;
        else if (plan.stayingTonight) tonight = `Overnight in ${plan.stayingTonight.dest.destination}`;

        return (
          <View key={plan.day} style={styles.dayCard} wrap={false}>
            {/* Header */}
            <View style={styles.dayHeaderRow}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeNum}>{plan.day}</Text>
                <Text style={styles.dayBadgeLbl}>Day</Text>
              </View>
              <View style={styles.dayHeaderMid}>
                <Text style={styles.dayDate}>{formatDayLabel(plan.date)}{location ? `  ·  ${location}` : ''}</Text>
                <Text style={styles.dayTitle}>{title}</Text>
              </View>
              {cost > 0 ? (
                <View>
                  <Text style={styles.dayCost}>{money(cost)}</Text>
                  <Text style={styles.dayCostLbl}>est. pp</Text>
                </View>
              ) : null}
            </View>

            {/* Stitched moves */}
            {moves.map((m, i) => {
              const tag = MOVE_TAG[m.kind];
              return (
                <View key={i} style={styles.moveRow}>
                  <Text style={[styles.moveTag, { backgroundColor: tag.bg }]}>{tag.label}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.moveText}>{m.text}</Text>
                    {m.sub ? <Text style={styles.moveSub}>{m.sub}</Text> : null}
                  </View>
                </View>
              );
            })}

            {/* Plan — timeline or activities */}
            {timeline ? (
              <>
                <Text style={styles.actSectionLabel}>Hour by hour</Text>
                {timeline.map((ev, i) => (
                  <View key={i} style={styles.actRow}>
                    <Text style={styles.actTime}>{ev.time}</Text>
                    <Text style={styles.actText}>
                      {ev.title}{ev.location ? ` — ${ev.location}` : ''}
                    </Text>
                  </View>
                ))}
              </>
            ) : activities.length > 0 ? (
              <>
                <Text style={styles.actSectionLabel}>What you'll do</Text>
                {activities.map((a, i) => (
                  <View key={i} style={styles.actRow}>
                    <Text style={styles.actBullet}>›</Text>
                    <Text style={styles.actText}>{a}</Text>
                  </View>
                ))}
              </>
            ) : null}

            {/* Day notes */}
            {day?.rainy_backup ? (
              <View style={[styles.noteBox, { backgroundColor: '#EAF5F1' }]}>
                <Text style={[styles.noteLabel, { color: SAGE }]}>If it rains</Text>
                <Text style={styles.noteText}>{day.rainy_backup}</Text>
              </View>
            ) : null}
            {day?.kids_tip ? (
              <View style={[styles.noteBox, { backgroundColor: '#FCEBE9' }]}>
                <Text style={[styles.noteLabel, { color: TERRACOTTA }]}>With kids</Text>
                <Text style={styles.noteText}>{day.kids_tip}</Text>
              </View>
            ) : null}
            {day?.accessibility_note ? (
              <View style={[styles.noteBox, { backgroundColor: '#F6EFDF' }]}>
                <Text style={[styles.noteLabel, { color: GOLD }]}>Mobility</Text>
                <Text style={styles.noteText}>{day.accessibility_note}</Text>
              </View>
            ) : null}

            {/* Tonight */}
            {tonight ? (
              <View style={styles.tonightRow}>
                <Text style={styles.tonightLbl}>Tonight</Text>
                <Text style={styles.tonightText}>{tonight}</Text>
              </View>
            ) : null}
          </View>
        );
      })}

      <PageNum />
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Booking reference — flights (day-tagged)                            */
/* ------------------------------------------------------------------ */

function FlightsPage({ config, results }: { config: TravelConfig; results: GenerationResults }) {
  if (!results.flights || results.flights.length === 0) return null;

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Flights" right={config.country?.name || ''} />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.eyebrow}>Booking reference</Text>
        <Text style={styles.h1}>Your <Text style={styles.h1Accent}>flights.</Text></Text>
        <View style={styles.rule} />
      </View>

      {results.flights.map((f, i) => {
        const dn = config.departureDate ? tripDayNumber(config.departureDate, f.date) : null;
        return (
          <View key={i} style={styles.flightCard} wrap={false}>
            {dn ? <Text style={styles.refDayTag}>Day {dn}</Text> : null}
            <Text style={styles.flightRoute}>{f.from_code} → {f.to_code}</Text>
            <Text style={styles.flightMeta}>
              {formatDayLabel(f.date)}{'\n'}{(f.airlines || []).join(', ') || '—'} · {f.duration}
            </Text>
            <Text style={styles.flightPrice}>{f.price_estimate_aud}</Text>
          </View>
        );
      })}

      <PageNum />
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Booking reference — hotels (day-range-tagged)                       */
/* ------------------------------------------------------------------ */

function HotelsPage({ config, results }: { config: TravelConfig; results: GenerationResults }) {
  if (!results.hotels || results.hotels.length === 0) return null;

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Hotels" right={config.country?.name || ''} />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.eyebrow}>Booking reference</Text>
        <Text style={styles.h1}>Where you <Text style={styles.h1Accent}>sleep.</Text></Text>
        <View style={styles.rule} />
      </View>

      {results.hotels.map((destBlock, di) => {
        const pick = destBlock.hotels?.find((h) => h.recommended) || destBlock.hotels?.[0];
        if (!pick) return null;
        const inDay = config.departureDate ? tripDayNumber(config.departureDate, destBlock.check_in) : null;
        const outDay = config.departureDate ? tripDayNumber(config.departureDate, destBlock.check_out) : null;
        return (
          <View key={di} style={styles.hotelEntry} wrap={false}>
            <View style={styles.hotelDateRow}>
              {inDay && outDay ? <Text style={styles.refDayTag}>Day {inDay}–{outDay}</Text> : null}
              <Text style={styles.hotelDates}>
                {formatDayLabel(destBlock.check_in)} → {formatDayLabel(destBlock.check_out)}  ·  {destBlock.nights} night{destBlock.nights > 1 ? 's' : ''}  ·  {destBlock.destination}
              </Text>
            </View>
            <Text style={styles.hotelName}>{pick.name}</Text>
            <Text style={styles.hotelArea}>
              {pick.area} · {pick.style} · {'★'.repeat(Math.max(0, Math.min(5, Math.round(Number(pick.stars) || 0))))}
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

/* ------------------------------------------------------------------ */
/* Budget — with per-day breakdown                                    */
/* ------------------------------------------------------------------ */

function BudgetPage({
  config, results, perDay,
}: {
  config: TravelConfig;
  results: GenerationResults;
  perDay: { day: number; date: string; total: number }[];
}) {
  if (!results.budget || results.budget.length === 0) return null;
  const perPerson = sumBudget(results.budget);
  const group = perPerson * (config.travellers || 1);
  const hasPerDay = perDay.some((d) => d.total > 0);
  const maxDay = hasPerDay ? Math.max(...perDay.map((d) => d.total)) : 0;

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Budget" right={config.country?.name || ''} />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.eyebrow}>The numbers</Text>
        <Text style={styles.h1}>The <Text style={styles.h1Accent}>budget.</Text></Text>
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
          <Text style={styles.budgetTotalNum}>{money(perPerson)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.eyebrow}>Group total</Text>
          <Text style={[styles.budgetTotalNum, { color: TERRACOTTA }]}>{money(group)}</Text>
        </View>
      </View>

      {hasPerDay ? (
        <View style={{ marginTop: 24 }} wrap={false}>
          <Text style={styles.eyebrow}>Day by day · per person</Text>
          {perDay.map((d) => (
            <View key={d.day} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontFamily: SANS, fontWeight: 600, fontSize: 8, color: INK, width: 44 }}>Day {d.day}</Text>
              <View style={{ flex: 1, height: 8, backgroundColor: SOFT2, borderRadius: 4, marginRight: 8 }}>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: '#F8B5AD', width: `${maxDay > 0 ? Math.round((d.total / maxDay) * 100) : 0}%` }} />
              </View>
              <Text style={{ fontFamily: SANS, fontWeight: 700, fontSize: 9, color: GOLD, width: 44, textAlign: 'right' }}>{money(d.total)}</Text>
            </View>
          ))}
          <Text style={[styles.bodyDim, { fontSize: 7.5, marginTop: 6 }]}>
            Flights land on their departure day; hotel cost split across nights (per person); food, activities & local transport spread evenly.
          </Text>
        </View>
      ) : null}

      <PageNum />
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Restaurants / Activities / Practical                               */
/* ------------------------------------------------------------------ */

function RestaurantsPage({ config, results }: { config: TravelConfig; results: GenerationResults }) {
  if (!results.restaurants || results.restaurants.length === 0) return null;
  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="The table" right={config.country?.name || ''} />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.eyebrow}>Where to eat</Text>
        <Text style={styles.h1}>At the <Text style={styles.h1Accent}>table.</Text></Text>
        <View style={styles.rule} />
      </View>

      {results.restaurants.map((destBlock, di) => (
        <View key={di} style={{ marginBottom: 14 }} wrap={false}>
          <Text style={[styles.h2, { marginTop: 6 }]}>{destBlock.destination}</Text>
          {(destBlock.restaurants || []).slice(0, 5).map((r, i) => (
            <View key={i} style={styles.restaurantRow}>
              <Text style={styles.restaurantName}>{r.name}  <Text style={{ fontFamily: SANS, fontSize: 9, color: MUTED }}>{r.price_tier}</Text></Text>
              <Text style={styles.restaurantMeta}>{r.cuisine} · {r.neighbourhood}</Text>
              {r.signature_dish ? <Text style={styles.restaurantDish}>{r.signature_dish}</Text> : null}
            </View>
          ))}
        </View>
      ))}

      <PageNum />
    </Page>
  );
}

function ActivitiesPage({ config, results }: { config: TravelConfig; results: GenerationResults }) {
  if (!results.activities || results.activities.length === 0) return null;
  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Things to do" right={config.country?.name || ''} />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.eyebrow}>Experiences</Text>
        <Text style={styles.h1}>Things to <Text style={styles.h1Accent}>do.</Text></Text>
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

function PracticalPage({ config, results }: { config: TravelConfig; results: GenerationResults }) {
  const hasVisa = !!results.visa;
  const hasCurrency = !!results.currency;
  if (!hasVisa && !hasCurrency) return null;

  return (
    <Page size="A4" style={styles.page} wrap>
      <RunningHead left="Practical" right={config.country?.name || ''} />
      <View style={{ marginTop: 8 }}>
        <Text style={styles.eyebrow}>Good to know</Text>
        <Text style={styles.h1}>The <Text style={styles.h1Accent}>practical.</Text></Text>
        <View style={styles.rule} />
      </View>

      {hasVisa && results.visa ? (
        <View style={{ marginBottom: 22 }}>
          <Text style={[styles.h2, { marginBottom: 12 }]}>Visa</Text>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>Required</Text><Text style={styles.visaValue}>{results.visa.visa_required ? 'Yes' : 'No'}</Text></View>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>Type</Text><Text style={styles.visaValue}>{results.visa.visa_type}</Text></View>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>Max stay</Text><Text style={styles.visaValue}>{results.visa.max_stay}</Text></View>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>Cost</Text><Text style={styles.visaValue}>{results.visa.cost_aud}</Text></View>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>Processing</Text><Text style={styles.visaValue}>{results.visa.processing_time}</Text></View>
        </View>
      ) : null}

      {hasCurrency && results.currency ? (
        <View style={{ marginBottom: 22 }}>
          <Text style={[styles.h2, { marginBottom: 12 }]}>Currency</Text>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>Local currency</Text><Text style={styles.visaValue}>{results.currency.currency_name} ({results.currency.currency_code}, {results.currency.symbol})</Text></View>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>1 AUD =</Text><Text style={styles.visaValue}>{results.currency.rate_to_aud} {results.currency.currency_code}</Text></View>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>Tipping</Text><Text style={styles.visaValue}>{results.currency.tipping_culture}</Text></View>
          <View style={styles.visaRow}><Text style={styles.visaLabel}>Cash vs card</Text><Text style={styles.visaValue}>{results.currency.cash_vs_card}</Text></View>
        </View>
      ) : null}

      <Text style={[styles.eyebrow, { textAlign: 'center', marginTop: 32, color: TERRACOTTA }]}>
        Bon voyage  ·  {config.country?.name || ''}
      </Text>

      <PageNum />
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Image loading w/ fallback                                          */
/* ------------------------------------------------------------------ */

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

export async function generateTripPdf(
  config: TravelConfig,
  results: GenerationResults
): Promise<Blob> {
  const seed =
    (config.country?.id || config.country?.name || '') + '|' +
    config.destinations.map((d) => d.id).join(',');
  const tripIdShort = seed.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'TRIP';

  const totalDays = Math.max(
    1,
    Math.round(
      (new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  // Build the stitched plan + per-day costs once.
  const plans = buildDayPlans(config, results.itinerary || [], results.flights || [], results.hotels || [], results.transport || []);
  const perDay = perDayCosts(plans, results.flights || [], results.budget || [], config.travellers || 1);
  const dayCostByDay = new Map(perDay.map((d) => [d.day, d.total]));

  const heroUrlRemote = config.country?.name ? getCountryHero(config.country.name, 1600, 1100) : '';
  const heroUrl = heroUrlRemote ? await loadHeroDataUrl(heroUrlRemote) : null;
  void getDestinationPhoto;

  const doc: ReactElement = (
    <Document
      title={`${config.country?.name || 'Trip'} — Adventure Planner`}
      author="Adventure Planner"
      subject="Day-by-day itinerary"
    >
      <CoverPage config={config} totalDays={totalDays} tripIdShort={tripIdShort} heroUrl={heroUrl} />
      <AtAGlancePage config={config} results={results} totalDays={totalDays} />
      <StitchedItineraryPages config={config} plans={plans} dayCostByDay={dayCostByDay} />
      <FlightsPage config={config} results={results} />
      <HotelsPage config={config} results={results} />
      <BudgetPage config={config} results={results} perDay={perDay} />
      <RestaurantsPage config={config} results={results} />
      <ActivitiesPage config={config} results={results} />
      <PracticalPage config={config} results={results} />
    </Document>
  );

  const instance = pdf(doc as unknown as Parameters<typeof pdf>[0]);
  return await instance.toBlob();
}

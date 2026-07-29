// AUTO-GENERATED counts of destinations per country (one per country file).
// The heavy Destination[] arrays load on demand (see destinations.ts); this
// lightweight map stays eager so the country picker can show '17 places'
// without pulling in ~6,000 lines of destination prose on first paint.
// Regenerate: for f in src/data/countries/*.ts; do id=basename; count grep -c recommendedDays.
export const destinationCounts: Record<string, number> = {
  austria: 12,
  belgium: 11,
  cambodia: 10,
  croatia: 14,
  egypt: 13,
  fiji: 10,
  france: 16,
  germany: 14,
  greece: 16,
  iceland: 12,
  indonesia: 16,
  italy: 18,
  japan: 18,
  maldives: 8,
  mauritius: 10,
  mexico: 16,
  morocco: 14,
  netherlands: 11,
  newzealand: 17,
  norway: 12,
  peru: 14,
  philippines: 13,
  portugal: 14,
  spain: 16,
  sweden: 12,
  switzerland: 13,
  thailand: 15,
  turkey: 16,
  vietnam: 22,
};

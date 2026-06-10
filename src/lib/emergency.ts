/**
 * Emergency numbers per country — the SOS card data.
 *
 * Static, offline-first by design: when someone needs an ambulance they may
 * have no data connection, so this ships in the bundle rather than being
 * fetched. Numbers are the widely-published national emergency lines; the UI
 * carries a "verify locally" caveat because these do occasionally change.
 *
 * Keyed by the country ids in `src/data/countries.ts`. `general` is the single
 * all-services number where one exists (e.g. 112 across the EU); otherwise the
 * per-service numbers are listed. 112 works on GSM networks in most of the
 * world even without a SIM, so it's also the fallback for unknown countries.
 */

export interface EmergencyNumbers {
  general?: string;
  police?: string;
  ambulance?: string;
  fire?: string;
  touristPolice?: string;
  note?: string;
}

const EMERGENCY: Record<string, EmergencyNumbers> = {
  vietnam:     { police: '113', ambulance: '115', fire: '114' },
  thailand:    { police: '191', ambulance: '1669', fire: '199', touristPolice: '1155' },
  japan:       { police: '110', ambulance: '119', fire: '119' },
  indonesia:   { general: '112', police: '110', ambulance: '118' },
  philippines: { general: '911' },
  cambodia:    { police: '117', ambulance: '119', fire: '118' },
  italy:       { general: '112' },
  france:      { general: '112', police: '17', ambulance: '15', fire: '18' },
  spain:       { general: '112' },
  portugal:    { general: '112' },
  greece:      { general: '112', touristPolice: '171' },
  switzerland: { general: '112', police: '117', ambulance: '144', fire: '118' },
  germany:     { general: '112', police: '110' },
  netherlands: { general: '112' },
  belgium:     { general: '112' },
  austria:     { general: '112', police: '133', ambulance: '144', fire: '122' },
  norway:      { police: '112', ambulance: '113', fire: '110' },
  sweden:      { general: '112' },
  croatia:     { general: '112' },
  iceland:     { general: '112' },
  morocco:     { police: '19', ambulance: '15', fire: '15' },
  egypt:       { police: '122', ambulance: '123', fire: '180' },
  turkey:      { general: '112' },
  mauritius:   { police: '999', ambulance: '114', fire: '995' },
  peru:        { police: '105', ambulance: '106' },
  mexico:      { general: '911' },
  newzealand:  { general: '111' },
  fiji:        { general: '911' },
  maldives:    { police: '119', ambulance: '102', fire: '118' },
};

/** Numbers for a country id; falls back to GSM-universal 112 with a note. */
export function getEmergencyNumbers(countryId: string | undefined): EmergencyNumbers {
  if (countryId && EMERGENCY[countryId]) return EMERGENCY[countryId];
  return { general: '112', note: '112 connects to emergency services on GSM networks in most countries.' };
}

/** Google search deep-link to the traveller's nearest embassy/consulate. */
export function embassySearchUrl(countryName: string, homeCountry = 'Australian'): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${homeCountry} embassy or consulate in ${countryName}`)}`;
}

/**
 * Native-app deep-link helpers.
 *
 * Uses universal-link URLs that browsers automatically resolve into the native
 * app on the matching platform (iOS opens Apple Maps for `maps.apple.com`,
 * Android opens Google Maps for the universal Google Maps URL, both fall back
 * to a web view if the app isn't installed).
 */

function ua(): string {
  if (typeof navigator === 'undefined') return '';
  return navigator.userAgent;
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(ua());
}

export function isAndroid(): boolean {
  return /Android/.test(ua());
}

/**
 * Best-fit Maps URL for the current platform.
 * iOS → Apple Maps universal link (opens Apple Maps app)
 * Everywhere else → Google Maps universal search URL.
 */
export function mapsUrl(query: string): string {
  const q = encodeURIComponent(query);
  if (isIOS()) return `https://maps.apple.com/?q=${q}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/**
 * "Directions to" URL — opens the native app pre-routed.
 * From = current location, To = destination.
 */
export function directionsUrl(destination: string): string {
  const d = encodeURIComponent(destination);
  if (isIOS()) return `https://maps.apple.com/?daddr=${d}&dirflg=d`;
  return `https://www.google.com/maps/dir/?api=1&destination=${d}`;
}

/** Uber universal link — pickup at current location, drop at destination. */
export function uberUrl(destination: string): string {
  const d = encodeURIComponent(destination);
  return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${d}`;
}

/** Lyft universal link. */
export function lyftUrl(destination: string): string {
  const d = encodeURIComponent(destination);
  return `https://ride.lyft.com/ridetype?id=lyft&destination[address]=${d}`;
}

/** Generic ride-hailing URL — Uber's universal link works almost everywhere. */
export function rideUrl(destination: string): string {
  return uberUrl(destination);
}

/** Telephone deep-link with safe encoding. */
export function telUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/**
 * Multi-stop walking-route URL for one day's stops, opened in Google/Apple Maps.
 * `stops` are place names (each suffixed with the city for disambiguation by the
 * caller). Returns null if fewer than 2 mappable stops. Google's dir API takes
 * an origin, destination and `waypoints`; Apple Maps lacks multi-stop, so on iOS
 * we fall back to a search for the first stop.
 */
export function dayRouteUrl(stops: string[]): string | null {
  const clean = stops.map((s) => (s || '').trim()).filter(Boolean);
  if (clean.length < 1) return null;
  if (clean.length === 1) return mapsUrl(clean[0]);
  if (isIOS()) {
    // Apple Maps has no multi-waypoint URL scheme — route to the last stop.
    return `https://maps.apple.com/?daddr=${encodeURIComponent(clean[clean.length - 1])}&dirflg=w`;
  }
  const origin = encodeURIComponent(clean[0]);
  const destination = encodeURIComponent(clean[clean.length - 1]);
  const waypoints = clean.slice(1, -1).map((s) => encodeURIComponent(s)).join('|');
  let url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=${origin}&destination=${destination}`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  return url;
}

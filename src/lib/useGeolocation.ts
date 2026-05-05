import { useEffect, useState } from 'react';

/**
 * Read-only geolocation hook.
 *
 * - Returns `{ status, lat, lng, accuracy, error }`.
 * - Asks the user once for permission. If denied, status becomes 'denied'.
 * - Re-queries on `enabled` toggle (lets the consumer hold permission until
 *   they're sure they want it — e.g. only on the active Today panel).
 * - Never blocks rendering: status starts at 'idle' and progresses through
 *   'requesting' → 'granted' | 'denied' | 'unavailable'.
 */

export type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export interface GeoPosition {
  status: GeoStatus;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  error: string | null;
}

const initial: GeoPosition = {
  status: 'idle',
  lat: null,
  lng: null,
  accuracy: null,
  error: null,
};

export function useGeolocation(enabled: boolean): GeoPosition {
  const [pos, setPos] = useState<GeoPosition>(initial);

  useEffect(() => {
    if (!enabled) {
      setPos(initial);
      return;
    }
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setPos({ ...initial, status: 'unavailable', error: 'Geolocation not supported' });
      return;
    }

    let cancelled = false;
    setPos((p) => ({ ...p, status: 'requesting' }));

    navigator.geolocation.getCurrentPosition(
      (geo) => {
        if (cancelled) return;
        setPos({
          status: 'granted',
          lat: geo.coords.latitude,
          lng: geo.coords.longitude,
          accuracy: geo.coords.accuracy,
          error: null,
        });
      },
      (err) => {
        if (cancelled) return;
        const status: GeoStatus = err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable';
        setPos({ status, lat: null, lng: null, accuracy: null, error: err.message });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 }
    );

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return pos;
}

/** Haversine distance in km between two lat/lng pairs. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // earth radius km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

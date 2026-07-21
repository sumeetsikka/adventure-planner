/**
 * useState that survives a tab switch.
 *
 * `ResultsView` conditionally renders each tab and keys its ErrorBoundary on the
 * active tab, so every tab unmounts when you navigate away. Anything held in
 * plain `useState` is therefore erased — which silently broke the three tabs
 * whose entire job is remembering things: Packing checkboxes, the Bookings
 * tracker, and Chat history.
 *
 * Storage is per-trip (the caller passes the trip id into the key) and every
 * access is guarded: a `null` key disables persistence entirely, corrupt JSON
 * falls back to the initial value, and a full disk raises the same
 * STORAGE_FULL_EVENT the trip store uses so the user gets one consistent warning.
 */
import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { STORAGE_FULL_EVENT } from './tripStore';

function isQuotaError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED' || err.code === 22)
  );
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    if (isQuotaError(err)) {
      try { window.dispatchEvent(new CustomEvent(STORAGE_FULL_EVENT)); } catch { /* non-browser */ }
    }
  }
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Persisted state. Pass `key: null` to opt out (e.g. no active trip yet), in
 * which case this behaves exactly like `useState`.
 */
export function usePersistentState<T>(
  key: string | null,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => (key ? read(key, initial) : initial));

  // Skip the write triggered by the initial render — it would just rewrite what
  // we only moments ago read back out of storage.
  const hydrated = useRef(false);
  useEffect(() => {
    if (!key) return;
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    write(key, value);
  }, [key, value]);

  return [value, setValue];
}

/**
 * Persisted `Set<string>` — Sets don't survive JSON, so this stores an array and
 * rehydrates. Used for the Packing and Bookings checkboxes.
 */
export function usePersistentSet(
  key: string | null,
): [Set<string>, (updater: (prev: Set<string>) => Set<string>) => void] {
  const [items, setItems] = usePersistentState<string[]>(key, []);
  const set = new Set(items);
  const update = (updater: (prev: Set<string>) => Set<string>) => {
    setItems((prev) => [...updater(new Set(prev))]);
  };
  return [set, update];
}

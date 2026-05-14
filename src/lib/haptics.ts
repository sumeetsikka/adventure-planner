/**
 * Tiny haptic-feedback helper.
 *
 * `navigator.vibrate` works on Android Chrome/Firefox; iOS Safari ignores it
 * (no-op, no error). Calls are intentionally short — this is for tick/select
 * micro-confirmation, not alerts.
 */

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/** A light tap — use on checkbox tick, chip select, card tap. */
export function tapHaptic(): void {
  if (canVibrate()) navigator.vibrate(8);
}

/** A slightly firmer confirm — use on save, share, complete. */
export function confirmHaptic(): void {
  if (canVibrate()) navigator.vibrate([12, 30, 12]);
}

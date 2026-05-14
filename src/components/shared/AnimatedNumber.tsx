import { useEffect, useRef, useState } from 'react';

/**
 * Counts up to `value` with an ease-out curve when it mounts or when the
 * value changes. Pure rAF, no dependency. Renders a <span>.
 *
 * `format` lets the caller localise / add separators; defaults to integer
 * with thousands separators.
 */

interface Props {
  value: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Format the displayed (interpolated) number. */
  format?: (n: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString();

// ease-out cubic
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function AnimatedNumber({ value, duration = 900, format = defaultFormat, className, prefix, suffix }: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) {
      // Nothing to animate — snap. This is the rAF-lifecycle pattern.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(to);
      return;
    }
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOut(t);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Snap the "from" baseline to the latest target so an interrupted
      // animation resumes correctly from where it visually was.
      fromRef.current = value;
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{format(display)}{suffix}
    </span>
  );
}

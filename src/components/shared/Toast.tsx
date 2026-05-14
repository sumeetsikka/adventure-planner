import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Lightweight toast system.
 *
 * Wrap the app (or a subtree) in <ToastProvider>, then call `useToast()` from
 * any descendant: `const toast = useToast(); toast('Link copied!')`.
 *
 * Toasts auto-dismiss after 2.4s, stack bottom-centre, and respect the
 * mobile safe-area inset. Editorial styling — warm ink card, gold accent.
 */

type ToastTone = 'default' | 'success' | 'error';
interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

type ToastFn = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ToastFn | null>(null);

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  // Fallback no-op so components don't crash if used outside a provider.
  return ctx ?? (() => {});
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const push = useCallback<ToastFn>((message, tone = 'default') => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="fixed left-0 right-0 bottom-0 z-[250] flex flex-col items-center gap-2 px-4 pointer-events-none print:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-auto surface-card rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-2xl backdrop-blur-md border border-[var(--line-strong)]"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background:
                    t.tone === 'error' ? 'var(--terracotta)'
                    : t.tone === 'success' ? 'var(--sage)'
                    : 'var(--gold)',
                }}
              />
              <span className="text-[var(--cream)] text-[13px] font-light tracking-wide">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

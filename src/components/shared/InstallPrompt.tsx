import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Add-to-Home-Screen prompt.
 *
 * Listens for `beforeinstallprompt` (Chrome/Edge/Android) and renders a
 * dismissible card with an "Install" button. Once dismissed or installed the
 * card never reappears (decision stored in localStorage).
 *
 * On iOS Safari there's no `beforeinstallprompt`; we detect iOS once and
 * render a tap-target with the share→add-to-home-screen instructions instead.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'adventure-planner:install-dismissed';

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS sets navigator.standalone; Android/desktop use the display-mode media query
  const nav = navigator as { standalone?: boolean };
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    if (dismissed) return;
    if (isStandalone()) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // iOS doesn't fire beforeinstallprompt; show our hint after a short delay
    if (isIOS()) {
      const t = setTimeout(() => setShowIOSHint(true), 8000);
      return () => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        clearTimeout(t);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, [dismissed]);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIOSHint(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') dismiss();
    setDeferredPrompt(null);
  };

  const visible = !dismissed && (deferredPrompt !== null || showIOSHint);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[100] surface-card rounded-2xl p-4 sm:p-5 border border-[var(--gold)]/30 backdrop-blur-md"
          style={{
            paddingBottom: `calc(1rem + env(safe-area-inset-bottom, 0px))`,
            background: 'linear-gradient(135deg, rgba(26, 23, 19, 0.95), rgba(18, 16, 13, 0.95))',
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">✦</span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg text-[var(--cream)] leading-tight mb-1">
                Install Adventure Planner
              </p>
              {deferredPrompt ? (
                <p className="text-[var(--text-muted)] text-xs font-light leading-relaxed">
                  Add it to your home screen for full-screen, offline-ready access to your trips.
                </p>
              ) : (
                <p className="text-[var(--text-muted)] text-xs font-light leading-relaxed">
                  Tap <span className="inline-block px-1.5 py-0.5 rounded bg-[var(--ink-3)] text-[var(--cream)]">Share <span aria-hidden>↑</span></span> then "Add to Home Screen" to install.
                </p>
              )}
              <div className="flex items-center gap-2 mt-3">
                {deferredPrompt && (
                  <button
                    onClick={install}
                    className="px-4 py-1.5 rounded-full bg-[var(--cream)] text-[var(--ink)] text-xs font-medium hover:bg-[var(--paper)] transition-colors"
                  >
                    Install
                  </button>
                )}
                <button
                  onClick={dismiss}
                  className="px-4 py-1.5 rounded-full text-xs text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="text-[var(--text-dim)] hover:text-[var(--cream)] transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

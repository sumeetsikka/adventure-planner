import { useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';

/**
 * Full-screen image lightbox with swipe + keyboard navigation.
 *
 * - Click backdrop or × button to close
 * - Tap left/right arrows OR swipe horizontally to navigate
 * - Esc / ←  / → keyboard shortcuts
 * - Locks body scroll while open
 * - Caption + position counter rendered below the image
 */

export interface LightboxImage {
  src: string;
  caption?: string;
  alt?: string;
}

interface Props {
  images: LightboxImage[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Lightbox({ images, index, onIndexChange, onClose }: Props) {
  const current = images[index];

  // Keyboard nav + body-scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndexChange((index + 1) % images.length);
      else if (e.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [index, images.length, onIndexChange, onClose]);

  const next = () => onIndexChange((index + 1) % images.length);
  const prev = () => onIndexChange((index - 1 + images.length) % images.length);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const SWIPE_THRESHOLD = 80;
    if (info.offset.x > SWIPE_THRESHOLD) prev();
    else if (info.offset.x < -SWIPE_THRESHOLD) next();
  };

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 print:hidden"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        {/* Close */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--ink-2)]/80 backdrop-blur border border-[var(--line-strong)] text-[var(--cream)] text-2xl leading-none flex items-center justify-center hover:bg-[var(--ink-2)] transition-colors z-10"
        >
          ×
        </button>

        {/* Counter */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <span className="eyebrow text-[var(--text-muted)] bg-[var(--ink-2)]/60 backdrop-blur px-3 py-1.5 rounded-full">
            {index + 1} / {images.length}
          </span>
        </div>

        {/* Image */}
        <motion.div
          key={current.src}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="relative max-w-full max-h-[80vh] flex items-center justify-center"
          drag={images.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={current.src}
            alt={current.alt ?? current.caption ?? ''}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
            draggable={false}
          />
        </motion.div>

        {/* Caption */}
        {current.caption && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
            className="mt-6 max-w-2xl text-center font-display-soft italic text-[var(--cream)] text-base sm:text-lg px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {current.caption}
          </motion.p>
        )}

        {/* Prev / Next — desktop only; mobile uses swipe */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[var(--ink-2)]/80 backdrop-blur border border-[var(--line-strong)] text-[var(--cream)] text-xl items-center justify-center hover:bg-[var(--ink-2)] transition-colors"
            >
              ←
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[var(--ink-2)]/80 backdrop-blur border border-[var(--line-strong)] text-[var(--cream)] text-xl items-center justify-center hover:bg-[var(--ink-2)] transition-colors"
            >
              →
            </button>

            {/* Mobile swipe hint (first 3 seconds) */}
            <motion.p
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 2 }}
              className="sm:hidden absolute bottom-4 text-[var(--text-dim)] text-[11px] tracking-wider uppercase"
              onClick={(e) => e.stopPropagation()}
            >
              swipe ↔
            </motion.p>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

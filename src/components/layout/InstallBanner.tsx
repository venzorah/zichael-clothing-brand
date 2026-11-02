import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { useInstall } from '../../contexts/InstallContext';
import { usePersistentState } from '../../hooks/usePersistentState';
import { LOGO_URL } from '../../data/products';

// Subtle, one-time install suggestion on mobile. Never blocks browsing and
// stays dismissed once closed.
export function InstallBanner() {
  const { canInstall, requestInstall } = useInstall();
  const [dismissed, setDismissed] = usePersistentState('hoz.installDismissed', false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 30000);
    return () => window.clearTimeout(t);
  }, []);

  const visible = canInstall && !dismissed && ready;

  return (
    <AnimatePresence>
      {visible &&
      <motion.aside
        aria-label="Install suggestion"
        className="fixed inset-x-3 bottom-[84px] z-30 flex items-center gap-3 border border-line bg-surface p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] lg:hidden"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
        
          <img src={LOGO_URL} alt="" className="h-10 w-10 shrink-0 bg-white object-contain p-1" />
          <p className="min-w-0 flex-1 text-[13px] leading-snug text-body">Add HOZ to your home screen for faster browsing.</p>
          <button
          type="button"
          onClick={() => {
            requestInstall();
            setDismissed(true);
          }}
          className="shrink-0 bg-ink px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-bg">
          
            Install
          </button>
          <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss" className="shrink-0 p-1 text-muted">
            <XIcon className="h-4 w-4" />
          </button>
        </motion.aside>
      }
    </AnimatePresence>);

}
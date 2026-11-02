import React, { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusSquareIcon, ShareIcon, XIcon } from 'lucide-react';
import { injectPwaMeta, isIOS, isStandalone } from '../utils/pwa';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed';}>;
}

interface InstallValue {
  canInstall: boolean;
  requestInstall: () => void;
}

const InstallContext = createContext<InstallValue | null>(null);

export function InstallProvider({ children }: {children: React.ReactNode;}) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const ios = typeof navigator !== 'undefined' && isIOS();

  useEffect(() => {
    injectPwaMeta();
    setInstalled(isStandalone());
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const requestInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      return;
    }
    setSheetOpen(true);
  };

  return (
    <InstallContext.Provider value={{ canInstall: !installed, requestInstall }}>
      {children}
      <AnimatePresence>
        {sheetOpen &&
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setSheetOpen(false)}>
          
            <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            className="pb-safe w-full max-w-md bg-surface p-7 sm:p-8"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}>
            
              <div className="flex items-start justify-between">
                <h2 id="install-title" className="font-display text-3xl text-ink">
                  Install the HOZ app
                </h2>
                <button type="button" onClick={() => setSheetOpen(false)} aria-label="Close" className="-mr-2 p-2 text-muted hover:text-ink">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-[15px] text-muted">Shop collections, track custom requests and reservations from your home screen. Installing is optional.</p>
              {ios ?
            <ol className="mt-6 space-y-4 text-[15px] text-body">
                  <li className="flex items-center gap-3">
                    <ShareIcon className="h-5 w-5 shrink-0 text-gold-ink" /> Tap the Share button in Safari
                  </li>
                  <li className="flex items-center gap-3">
                    <PlusSquareIcon className="h-5 w-5 shrink-0 text-gold-ink" /> Choose “Add to Home Screen”
                  </li>
                </ol> :

            <p className="mt-6 text-[15px] text-body">
                  Open your browser menu and choose <strong className="text-ink">Install app</strong> or <strong className="text-ink">Add to Home screen</strong>.
                </p>
            }
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </InstallContext.Provider>);

}

export function useInstall(): InstallValue {
  const ctx = useContext(InstallContext);
  if (!ctx) throw new Error('useInstall must be used inside InstallProvider');
  return ctx;
}
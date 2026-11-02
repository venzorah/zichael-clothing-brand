import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DownloadIcon, MenuIcon, MoonIcon, SearchIcon, ShoppingBagIcon, SunIcon, UserIcon, XIcon } from 'lucide-react';
import { useInstall } from '../../contexts/InstallContext';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Logo } from '../Logo';
import { SearchOverlay } from './SearchOverlay';

const secondaryLinks = [
{ to: '/custom-order', label: 'Custom Order' },
{ to: '/showrooms', label: 'Showrooms' }];


export function Header() {
  const { cartCount, lastCollection, content } = useStore();
  const { theme, toggleTheme } = useTheme();
  const { canInstall, requestInstall } = useInstall();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const activeGender = location.pathname.startsWith('/men') ? 'MEN' : location.pathname.startsWith('/women') ? 'WOMEN' : lastCollection;

  const collectionLink = (to: string, label: string) =>
  <NavLink
    to={to}
    className={({ isActive }) =>
    `relative py-2 text-[12px] font-medium uppercase tracking-[0.2em] transition-colors duration-150 ${
    isActive ? 'text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold' : 'text-muted hover:text-ink'}`

    }>
    
      {label}
    </NavLink>;


  const iconBtn = 'grid h-10 w-10 place-items-center text-ink transition-colors duration-150 hover:text-gold-ink';

  return (
    <>
      {content.announcement.trim() &&
      <div className="hidden bg-luxe py-2 text-center text-[11px] uppercase tracking-[0.2em] text-[#F5F0E6] lg:block">{content.announcement}</div>
      }
      <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-site grid-cols-[1fr_auto_1fr] items-center px-4 lg:h-20 lg:px-10">
          <div className="flex items-center gap-8">
            <button type="button" className={`${iconBtn} -ml-2 lg:hidden`} onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <nav className="hidden items-center gap-8 lg:flex" aria-label="Collections">
              {collectionLink('/women', 'Women')}
              {collectionLink('/men', 'Men')}
              {secondaryLinks.map((l) =>
              <React.Fragment key={l.to}>{collectionLink(l.to, l.label)}</React.Fragment>
              )}
            </nav>
          </div>

          <Link to="/" aria-label="House of Zichael home" className="flex flex-col items-center">
            <Logo className="h-8 lg:h-10" />
          </Link>

          <div className="flex items-center justify-end">
            <button type="button" className={iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search">
              <SearchIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button type="button" className={`${iconBtn} hidden sm:grid`} onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {theme === 'light' ? <MoonIcon className="h-5 w-5" strokeWidth={1.5} /> : <SunIcon className="h-5 w-5" strokeWidth={1.5} />}
            </button>
            <Link to="/account" className={`${iconBtn} hidden lg:grid`} aria-label="Account">
              <UserIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className={`${iconBtn} relative -mr-2`} aria-label={`Shopping bag, ${cartCount} items`}>
              <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.5} />
              {cartCount > 0 &&
              <span className="absolute right-0.5 top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-luxe">
                  {cartCount}
                </span>
              }
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && <SearchOverlay initialGender={activeGender} onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen &&
        <motion.div className="fixed inset-0 z-[60] bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setMenuOpen(false)}>
            <motion.nav
            aria-label="Main menu"
            className="flex h-full w-[86%] max-w-sm flex-col bg-bg px-6 pb-8 pt-5"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}>
            
              <div className="flex items-center justify-between">
                <Logo className="h-8" />
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-2 text-ink">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-10 space-y-1">
                {[
              { to: '/women', label: 'Women' },
              { to: '/men', label: 'Men' }].
              map((l) =>
              <Link key={l.to} to={l.to} className="block py-2 font-display text-4xl text-ink">
                    {l.label}
                  </Link>
              )}
              </div>
              <div className="mt-8 space-y-4 border-t border-line pt-6 text-[13px] uppercase tracking-[0.18em]">
                {[...secondaryLinks, { to: '/track', label: 'Track a Request' }, { to: '/account', label: 'My Account' }, { to: '/about', label: 'Our House' }, { to: '/contact', label: 'Contact' }].map((l) =>
              <Link key={l.to} to={l.to} className="block text-body hover:text-gold-ink">
                    {l.label}
                  </Link>
              )}
              </div>
              <div className="mt-auto space-y-3 border-t border-line pt-6">
                <button type="button" onClick={toggleTheme} className="flex w-full items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-body">
                  {theme === 'light' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </button>
                {canInstall &&
              <button type="button" onClick={requestInstall} className="flex w-full items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-body">
                    <DownloadIcon className="h-4 w-4" /> Install app
                  </button>
              }
              </div>
            </motion.nav>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}
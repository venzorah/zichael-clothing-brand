import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, LayoutGridIcon, ScissorsIcon, ShoppingBagIcon, UserIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';

export function MobileNav() {
  const { cartCount, lastCollection } = useStore();
  const { pathname } = useLocation();
  const collectionPath = `/${lastCollection === 'MEN' ? 'men' : 'women'}`;

  const items = [
  { to: '/', label: 'Home', icon: HomeIcon, active: pathname === '/' },
  { to: collectionPath, label: 'Collections', icon: LayoutGridIcon, active: pathname.startsWith('/men') || pathname.startsWith('/women') || pathname.startsWith('/product') },
  { to: '/custom-order', label: 'Custom', icon: ScissorsIcon, active: pathname.startsWith('/custom-order') },
  { to: '/cart', label: 'Bag', icon: ShoppingBagIcon, active: pathname.startsWith('/cart') || pathname.startsWith('/checkout'), badge: cartCount },
  { to: '/account', label: 'Account', icon: UserIcon, active: pathname.startsWith('/account') }];


  return (
    <nav aria-label="App navigation" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, active, badge }) =>
        <li key={label}>
            <NavLink
            to={to}
            aria-current={active ? 'page' : undefined}
            className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-[0.12em] transition-colors duration-150 ${
            active ? 'text-ink' : 'text-muted'}`
            }>
            
              {active && <span className="absolute top-0 h-0.5 w-6 bg-gold" aria-hidden="true" />}
              <span className="relative">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                {badge ?
              <span className="absolute -right-2 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-gold px-1 text-[9px] font-semibold text-luxe">{badge}</span> :
              null}
              </span>
              {label}
            </NavLink>
          </li>
        )}
      </ul>
    </nav>);

}
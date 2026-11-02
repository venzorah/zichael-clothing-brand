import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BuildingIcon, CalendarCheckIcon, ExternalLinkIcon, FileTextIcon, LayoutDashboardIcon, TagsIcon, LogOutIcon, MenuIcon, MoonIcon, PackageIcon, ReceiptIcon, ScissorsIcon, SunIcon, XIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Logo } from '../Logo';

interface AdminShellProps {
  name: string;
  onSignOut: () => void;
  children: React.ReactNode;
}

export function AdminShell({ name, onSignOut, children }: AdminShellProps) {
  const { requests, reservations, orders } = useStore();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboardIcon, end: true },
  { to: '/admin/products', label: 'Products', icon: PackageIcon },
  { to: '/admin/categories', label: 'Categories', icon: TagsIcon },
  { to: '/admin/content', label: 'Website content', icon: FileTextIcon },
  { to: '/admin/requests', label: 'Custom requests', icon: ScissorsIcon, badge: requests.filter((r) => r.status === 'New Request').length },
  { to: '/admin/orders', label: 'Orders & payments', icon: ReceiptIcon, badge: orders.filter((o) => o.paymentStatus === 'AWAITING_PAYMENT').length },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheckIcon, badge: reservations.filter((r) => r.status === 'Pending Confirmation').length },
  { to: '/admin/offices', label: 'Offices', icon: BuildingIcon }];


  const sidebar =
  <div className="flex h-full flex-col bg-luxe text-[#F5F0E6]">
      <div className="flex items-center justify-between px-6 py-6">
        <Logo className="h-8" onDark />
        <button className="p-1 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
        {nav.map(({ to, label, icon: Icon, end, badge }) =>
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors duration-150 ${isActive ? 'bg-white/10 text-white' : 'text-[#F5F0E6]/65 hover:text-white'}`
        }>
        
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            <span className="flex-1">{label}</span>
            {badge ? <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-[#D4AF37] px-1.5 text-[11px] font-semibold text-luxe">{badge}</span> : null}
          </NavLink>
      )}
      </nav>
      <div className="space-y-1 border-t border-white/10 px-3 py-4 text-[14px]">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 text-[#F5F0E6]/65 hover:text-white">
          <ExternalLinkIcon className="h-4 w-4" strokeWidth={1.5} /> View storefront
        </Link>
        <button onClick={toggleTheme} className="flex w-full items-center gap-3 px-3 py-2 text-[#F5F0E6]/65 hover:text-white">
          {theme === 'light' ? <MoonIcon className="h-4 w-4" strokeWidth={1.5} /> : <SunIcon className="h-4 w-4" strokeWidth={1.5} />}
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
        <button onClick={onSignOut} className="flex w-full items-center gap-3 px-3 py-2 text-[#F5F0E6]/65 hover:text-white">
          <LogOutIcon className="h-4 w-4" strokeWidth={1.5} /> Sign out
        </button>
      </div>
    </div>;


  return (
    <div className="flex min-h-screen w-full bg-bg">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>
      {open &&
      <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-64" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      }
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg/95 px-5 backdrop-blur lg:px-10">
          <button className="-ml-2 p-2 text-ink lg:hidden" onClick={() => setOpen(true)} aria-label="Open admin menu">
            <MenuIcon className="h-5 w-5" />
          </button>
          <p className="text-[12px] uppercase tracking-[0.18em] text-muted">House of Zichael · Admin</p>
          <p className="text-[14px] text-ink">{name}</p>
        </header>
        <main className="px-5 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>);

}
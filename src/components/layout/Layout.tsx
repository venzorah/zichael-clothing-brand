import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { InstallBanner } from './InstallBanner';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>
      <MobileNav />
      <InstallBanner />
    </div>);

}
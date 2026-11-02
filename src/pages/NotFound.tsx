import React from 'react';
import { Link } from 'react-router-dom';
import { buttonClass } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-28 text-center">
      <p className="font-display text-8xl text-gold-ink">404</p>
      <h1 className="mt-4 font-display text-4xl text-ink">This page has left the showroom.</h1>
      <p className="mt-3 text-[15px] text-muted">It may have moved or is no longer available.</p>
      <div className="mt-10 flex justify-center gap-3">
        <Link to="/women" className={buttonClass('primary')}>
          Women
        </Link>
        <Link to="/men" className={buttonClass('outline')}>
          Men
        </Link>
      </div>
    </div>);

}
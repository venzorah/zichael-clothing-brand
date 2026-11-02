import React from 'react';
import { LOGO_URL } from '../data/products';

interface LogoProps {
  className?: string;
  onDark?: boolean;
}

export function Logo({ className = 'h-9', onDark = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center rounded-sm ${onDark ? 'bg-[#F5F0E6] px-2 py-1' : 'dark:bg-[#F5F0E6] dark:px-2 dark:py-1'}`}>
      <img src={LOGO_URL} alt="House of Zichael" className={`w-auto mix-blend-multiply ${className}`} />
    </span>);

}
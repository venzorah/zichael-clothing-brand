import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'light';
type Size = 'md' | 'sm' | 'lg';

const base =
'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium uppercase tracking-[0.18em] transition-[background-color,color,border-color,transform,opacity] duration-150 ease-luxe active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-bg hover:bg-ink/85',
  gold: 'bg-gold text-luxe hover:bg-[#C6A22F]',
  outline: 'border border-ink/70 text-ink hover:bg-ink hover:text-bg',
  ghost: 'text-ink hover:text-gold-ink',
  light: 'bg-white text-luxe hover:bg-[#F5F0E6]'
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[11px]',
  md: 'h-12 px-7 text-[12px]',
  lg: 'h-14 px-9 text-[12px]'
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra?: string): string {
  return twMerge(base, variants[variant], sizes[size], extra);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />;
}

interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ variant = 'primary', size = 'md', className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, typeof className === 'string' ? className : undefined)} {...rest} />;
}
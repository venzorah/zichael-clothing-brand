import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { Logo } from '../Logo';

const houseLinks = [
{ to: '/about', label: 'About the House' },
{ to: '/contact', label: 'Contact Us' },
{ to: '/faq', label: 'FAQs' },
{ to: '/shipping-returns', label: 'Shipping & Returns' },
{ to: '/privacy', label: 'Privacy Policy' },
{ to: '/terms', label: 'Terms & Conditions' }];


const serviceLinks = [
{ to: '/custom-order', label: 'Request Custom Design' },
{ to: '/showrooms', label: 'Visit a Showroom' },
{ to: '/track', label: 'Track a Request' },
{ to: '/account', label: 'My Account' }];


export function Footer() {
  const [email, setEmail] = useState('');
  const { categories: allCategories, content } = useStore();
  const categories = allCategories.filter((c) => c.active !== false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Welcome to the House. Please check your inbox to confirm your subscription.');
    setEmail('');
  };

  const col = (title: string, links: {to: string;label: string;}[]) =>
  <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) =>
      <li key={l.to + l.label}>
            <Link to={l.to} className="text-[14px] text-[#F5F0E6]/75 transition-colors duration-150 hover:text-white">
              {l.label}
            </Link>
          </li>
      )}
      </ul>
    </div>;


  return (
    <footer className="bg-luxe text-[#F5F0E6]">
      <div className="mx-auto max-w-site px-5 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <h2 className="font-display text-4xl leading-tight text-white lg:text-5xl">{content.footer.newsletterHeading}</h2>
            <p className="mt-3 max-w-md text-[15px] text-[#F5F0E6]/70">{content.footer.newsletterBody}</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full border-b border-white/40 focus-within:border-[#D4AF37]">
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="h-14 w-full bg-transparent text-[15px] text-white placeholder:text-white/40 focus:outline-none" />
            
            <button type="submit" className="shrink-0 px-2 text-[12px] font-medium uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white">
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo className="h-10" onDark />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-[#F5F0E6]/65">{content.footer.tagline}</p>
            <div className="mt-6 space-y-2">
              {[content.social.womenHandle, content.social.menHandle].
              filter(Boolean).
              map((handle) => ({ handle, url: `https://www.instagram.com/${handle}` })).
              map((s) =>
              <a key={s.handle} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[14px] text-[#F5F0E6]/75 hover:text-white">
                  <InstagramIcon className="h-4 w-4" strokeWidth={1.5} /> @{s.handle}
                </a>
              )}
            </div>
          </div>
          {col('Women', categories.filter((c) => c.gender === 'WOMEN').map((c) => ({ to: `/women/${c.slug}`, label: c.name })))}
          {col('Men', categories.filter((c) => c.gender === 'MEN').map((c) => ({ to: `/men/${c.slug}`, label: c.name })))}
          {col('Services', serviceLinks)}
          {col('The House', houseLinks)}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-[12px] text-[#F5F0E6]/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} House of Zichael. All rights reserved.</p>
          <p>Secure payments by Paystack · Prices in NGN</p>
        </div>
      </div>
    </footer>);

}
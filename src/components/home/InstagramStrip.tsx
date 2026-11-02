import React from 'react';
import { InstagramIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Gender } from '../../types/catalog';

export function InstagramStrip() {
  const { content, products } = useStore();
  const accounts: {handle: string;label: string;gender: Gender;}[] = [
  { handle: content.social.womenHandle, label: content.hero.women.house, gender: 'WOMEN' },
  { handle: content.social.menHandle, label: content.hero.men.house, gender: 'MEN' }].
  filter((a) => a.handle.trim()) as {handle: string;label: string;gender: Gender;}[];

  if (accounts.length === 0) return null;

  return (
    <section className="border-t border-line py-20 lg:py-24" aria-labelledby="social-heading">
      <div className="mx-auto max-w-site px-5 lg:px-10">
        <h2 id="social-heading" className="text-center font-display text-4xl text-ink lg:text-5xl">
          Follow the House
        </h2>
        <div className={`mt-10 grid gap-10 lg:gap-8 ${accounts.length > 1 ? 'lg:grid-cols-2' : ''}`}>
          {accounts.map((a) => {
            const images = products.
            filter((p) => p.published && p.gender === a.gender).
            flatMap((p) => p.images.map((i) => i.src)).
            slice(0, 3);
            return (
              <a key={a.handle} href={`https://www.instagram.com/${a.handle}`} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="grid grid-cols-3 gap-2">
                  {images.map((src) =>
                  <div key={src} className="relative aspect-square overflow-hidden bg-ivory">
                      <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90" />
                    </div>
                  )}
                </div>
                <p className="mt-4 flex items-center justify-center gap-2 text-[13px] uppercase tracking-[0.18em] text-ink">
                  <InstagramIcon className="h-4 w-4" strokeWidth={1.5} /> @{a.handle}
                  <span className="normal-case tracking-normal text-muted">· {a.label}</span>
                </p>
              </a>);

          })}
        </div>
      </div>
    </section>);

}
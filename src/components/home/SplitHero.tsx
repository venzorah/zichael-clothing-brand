import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Gender } from '../../types/catalog';

export function SplitHero() {
  const { setLastCollection, content } = useStore();
  const panels: {gender: Gender;to: string;position: string;alt: string;}[] = [
  { gender: 'WOMEN', to: '/women', position: 'object-[50%_25%]', alt: 'Zichael Woman collection' },
  { gender: 'MEN', to: '/men', position: 'object-[50%_45%]', alt: 'Zichael Men collection' }];


  return (
    <section aria-label="Choose a collection" className="grid h-[calc(100svh-128px)] max-h-[900px] min-h-[440px] grid-cols-2 lg:h-[calc(100vh-112px)]">
      {panels.map((p) => {
        const c = p.gender === 'WOMEN' ? content.hero.women : content.hero.men;
        return (
          <Link key={p.gender} to={p.to} onClick={() => setLastCollection(p.gender)} className="group relative flex overflow-hidden bg-luxe" aria-label={`${c.cta} — ${c.subtitle}`}>
            <img src={c.image} alt={p.alt} className={`absolute inset-0 h-full w-full object-cover ${p.position} transition-transform duration-300 ease-luxe group-hover:scale-[1.03]`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" aria-hidden="true" />
            <div className="relative mt-auto w-full px-4 pb-8 text-white sm:px-8 lg:px-14 lg:pb-16">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#E6C860] sm:text-[11px]">{c.house}</p>
              <h2 className="mt-2 font-display text-[44px] uppercase leading-none tracking-[0.06em] sm:text-7xl lg:text-[104px]">{c.title}</h2>
              <p className="mt-3 max-w-xs text-[13px] leading-snug text-white/85 sm:text-[15px]">{c.subtitle}</p>
              <span className="mt-5 inline-flex items-center border-b border-[#D4AF37] pb-1 text-[10px] font-medium uppercase tracking-[0.2em] sm:text-[12px] lg:mt-8">{c.cta}</span>
            </div>
          </Link>);

      })}
    </section>);

}
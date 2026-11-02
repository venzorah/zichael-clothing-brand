import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { buttonClass } from '../ui/Button';

const steps = [
{ title: 'Share your idea', body: 'Describe the occasion and upload photos, sketches or fabric references.' },
{ title: 'Receive a quotation', body: 'Our stylists review your request and send an itemised quote.' },
{ title: 'Fitting & production', body: 'Approve, pay securely, and we cut to your exact measurements.' },
{ title: 'Delivery or collection', body: 'We deliver nationwide or prepare it at your chosen showroom.' }];


export function CustomPromo() {
  const { content } = useStore();
  const c = content.custom;
  return (
    <section className="bg-luxe text-[#F5F0E6]" aria-labelledby="custom-heading">
      <div className="mx-auto grid max-w-site lg:grid-cols-2">
        <div className="relative aspect-[4/5] lg:aspect-auto">
          <img src={c.image} alt="Zichael atelier craftsmanship" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="px-5 py-16 lg:px-20 lg:py-28">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#D4AF37]">{c.eyebrow}</p>
          <h2 id="custom-heading" className="mt-3 font-display text-5xl leading-[1.02] text-white lg:text-6xl">
            {c.heading}
            <br />
            <span className="italic text-[#E6C860]">{c.highlight}</span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#F5F0E6]/70">{c.body}</p>
          <ol className="mt-10 space-y-6">
            {steps.map((s, i) =>
            <li key={s.title} className="grid grid-cols-[40px_1fr] gap-4 border-t border-white/10 pt-5">
                <span className="font-display text-2xl text-[#D4AF37]">{i + 1}</span>
                <div>
                  <h3 className="text-[15px] font-medium text-white">{s.title}</h3>
                  <p className="mt-1 text-[14px] text-[#F5F0E6]/65">{s.body}</p>
                </div>
              </li>
            )}
          </ol>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/custom-order" className={buttonClass('gold', 'lg')}>
              Request custom design
            </Link>
            <Link to="/track" className={buttonClass('ghost', 'lg', 'px-0 text-[#F5F0E6] hover:text-[#D4AF37]')}>
              Track a request
            </Link>
          </div>
        </div>
      </div>
    </section>);

}
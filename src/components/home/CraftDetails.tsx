import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../SectionHeading';

const details = [
{
  src: "/House_of_Zichael_Male_(1).jpg",
  alt: 'Powder-blue inset placket with grey piping',
  title: 'The Lumen placket',
  note: 'Inset panel, hand-turned piping',
  to: '/product/navy-lumen-kaftan'
},
{
  src: "/789e2a18-ebe9-45bc-b359-f6adea4256d2.jpg",
  alt: 'Gold beadwork on an emerald bodice',
  title: 'Amara beadwork',
  note: 'Hand-set glass beads',
  to: '/product/amara-emerald-mermaid-gown'
},
{
  src: "/House_of_Zichael_Male_(7).jpg",
  alt: 'Emerald and citrine saddle stitching on a black back panel',
  title: 'Triple-run stitching',
  note: 'Obsidian Wave, back panel',
  to: '/product/obsidian-wave-senator'
},
{
  src: "/House_of_Zichael_Male_(5).jpg",
  alt: 'Engraved Zichael hardware loop on a black kaftan',
  title: 'Signature hardware',
  note: 'Engraved, polished by hand',
  to: '/product/onyx-split-kaftan'
}];


export function CraftDetails() {
  return (
    <section className="mx-auto max-w-site px-5 py-20 lg:px-10 lg:py-28" aria-labelledby="details-heading">
      <SectionHeading id="details-heading" eyebrow="Featured designs" title="It’s in the details." />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6">
        {details.map((d, i) =>
        <Link key={d.title} to={d.to} className={`group flex flex-col ${i === 0 ? 'col-span-2 lg:row-span-2' : i === 1 ? 'lg:col-span-2' : ''}`}>
            <div className={`relative overflow-hidden bg-ivory ${i === 0 ? 'aspect-[4/5]' : i === 1 ? 'aspect-[4/5] lg:aspect-[2/1]' : 'aspect-[4/5]'} lg:flex-1`}>
              <img src={d.src} alt={d.alt} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-luxe group-hover:scale-[1.03] ${i === 1 ? 'object-[50%_35%]' : ''}`} />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ink">{d.title}</h3>
              <p className="hidden text-[12px] text-muted sm:block">{d.note}</p>
            </div>
          </Link>
        )}
      </div>
    </section>);

}
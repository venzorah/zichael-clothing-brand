import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Gender } from '../../types/catalog';
import { ProductCard } from '../ProductCard';
import { SectionHeading } from '../SectionHeading';

interface FeaturedCollectionProps {
  gender: Gender;
  eyebrow: string;
  title: string;
  leadImage: string;
  leadAlt: string;
  leadCaption: string;
  reverse?: boolean;
}

export function FeaturedCollection({ gender, eyebrow, title, leadImage, leadAlt, leadCaption, reverse }: FeaturedCollectionProps) {
  const { products } = useStore();
  const path = gender === 'MEN' ? '/men' : '/women';
  const items = products.
  filter((p) => p.published && p.gender === gender).
  sort((a, b) => Number(b.featured) - Number(a.featured)).
  slice(0, 4);

  return (
    <section className="mx-auto max-w-site px-5 py-20 lg:px-10 lg:py-28" aria-labelledby={`featured-${gender}`}>
      <SectionHeading id={`featured-${gender}`} eyebrow={eyebrow} title={title} action={{ to: path, label: 'View collection' }} />
      <div className={`mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <Link to={path} className="group relative block aspect-[4/5] overflow-hidden bg-ivory lg:col-span-5 lg:aspect-auto">
          <img src={leadImage} alt={leadAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-luxe group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
          <p className="absolute bottom-6 left-6 right-6 font-display text-3xl italic text-white lg:text-4xl">{leadCaption}</p>
        </Link>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:col-span-7 lg:gap-x-8">
          {items.map((p) =>
          <ProductCard key={p.id} product={p} />
          )}
        </div>
      </div>
      <Link to={path} className="mt-10 inline-block border-b border-ink pb-1 text-[12px] font-medium uppercase tracking-[0.18em] text-ink sm:hidden">
        View collection
      </Link>
    </section>);

}
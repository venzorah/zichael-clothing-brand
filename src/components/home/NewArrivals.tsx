import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Gender } from '../../types/catalog';
import { ProductCard } from '../ProductCard';

export function NewArrivals() {
  const { products, lastCollection } = useStore();
  const [gender, setGender] = useState<Gender>(lastCollection);
  const items = products.
  filter((p) => p.published && p.newArrival && p.gender === gender).
  sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <section className="border-y border-line bg-ivory py-20 lg:py-28" aria-labelledby="new-arrivals">
      <div className="mx-auto max-w-site px-5 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-ink">Just arrived</p>
            <h2 id="new-arrivals" className="mt-2 font-display text-4xl text-ink lg:text-5xl">
              New Arrivals
            </h2>
          </div>
          <div role="tablist" aria-label="Collection" className="flex border border-line bg-surface p-1">
            {(['WOMEN', 'MEN'] as Gender[]).map((g) =>
            <button
              key={g}
              role="tab"
              aria-selected={gender === g}
              onClick={() => setGender(g)}
              className={`h-9 px-5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-150 ${
              gender === g ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`
              }>
              
                {g === 'WOMEN' ? 'Women' : 'Men'}
              </button>
            )}
          </div>
        </div>
        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0">
          {items.map((p) =>
          <div key={p.id} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
              <ProductCard product={p} />
            </div>
          )}
        </div>
      </div>
    </section>);

}
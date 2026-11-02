import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { Gender } from '../types/catalog';
import { SortKey, useCollectionFilters, emptyFilters } from '../hooks/useCollectionFilters';
import { ProductCard } from '../components/ProductCard';
import { FilterDrawer } from '../components/collection/FilterDrawer';
import { Button } from '../components/ui/Button';

interface CollectionProps {
  gender: Gender;
}

const meta: Record<Gender, {house: string;title: string;intro: string;image: string;switchTo: string;switchLabel: string;}> = {
  WOMEN: {
    house: 'Zichael Woman',
    title: 'The Women’s Collection',
    intro: 'Gowns, occasion and corporate pieces — sculpted, embellished and finished by hand.',
    image: "/9869bcac-bd4a-4fb3-ab3d-ee2ab44b5811.jpg",
    switchTo: '/men',
    switchLabel: 'Shop Men'
  },
  MEN: {
    house: 'Zichael Men',
    title: 'The Men’s Collection',
    intro: 'Kaftans, senator wear and ceremonial pieces with signature plackets and hand embroidery.',
    image: "/House_of_Zichael_Male_(9).jpg",
    switchTo: '/women',
    switchLabel: 'Shop Women'
  }
};

export function Collection({ gender }: CollectionProps) {
  const { category } = useParams();
  const { products, setLastCollection, categories } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { query, setQuery, sort, setSort, filters, setFilters, options, results, activeCount } = useCollectionFilters(products, gender, category);
  const cats = categories.filter((c) => c.gender === gender && c.active !== false);
  const activeCat = cats.find((c) => c.slug === category);
  const m = meta[gender];
  const base = gender === 'MEN' ? '/men' : '/women';

  useEffect(() => {
    setLastCollection(gender);
    document.title = `${activeCat ? `${activeCat.name} — ` : ''}${m.house} | House of Zichael`;
  }, [gender, activeCat, m.house, setLastCollection]);

  return (
    <>
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto grid max-w-site items-stretch lg:grid-cols-[1fr_440px]">
          <div className="px-5 py-12 lg:px-10 lg:py-16">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-ink">{m.house}</p>
            <h1 className="mt-3 font-display text-5xl leading-none text-ink lg:text-7xl">{activeCat ? activeCat.name : m.title}</h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">{activeCat ? activeCat.description : m.intro}</p>
            <Link to={m.switchTo} className="mt-6 inline-block border-b border-ink/60 pb-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink hover:border-gold hover:text-gold-ink">
              {m.switchLabel}
            </Link>
          </div>
          <div className="relative hidden lg:block">
            <img src={m.image} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-line bg-bg/95 backdrop-blur lg:top-20">
        <div className="mx-auto flex max-w-site items-center gap-4 px-5 lg:px-10">
          <nav aria-label="Categories" className="no-scrollbar -mb-px flex flex-1 gap-6 overflow-x-auto">
            {[{ slug: '', name: 'All' }, ...cats].map((c) => {
              const active = (c.slug || undefined) === category;
              return (
                <Link
                  key={c.slug || 'all'}
                  to={c.slug ? `${base}/${c.slug}` : base}
                  aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap border-b py-4 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors duration-150 ${
                  active ? 'border-gold text-ink' : 'border-transparent text-muted hover:text-ink'}`
                  }>
                  
                  {c.name}
                </Link>);

            })}
          </nav>
          <label className="relative hidden md:block">
            <span className="sr-only">Search this collection</span>
            <SearchIcon className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${gender === 'MEN' ? 'men' : 'women'}`}
              className="h-10 w-44 border-b border-line bg-transparent pl-6 text-[14px] text-ink placeholder:text-muted focus:border-ink focus:outline-none" />
            
          </label>
          <label className="hidden sm:block">
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-10 bg-transparent text-[12px] uppercase tracking-[0.12em] text-ink focus:outline-none">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
          <button type="button" onClick={() => setDrawerOpen(true)} className="flex shrink-0 items-center gap-2 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-ink">
            <SlidersHorizontalIcon className="h-4 w-4" strokeWidth={1.5} />
            Filter{activeCount > 0 && <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-gold px-1 text-[10px] text-luxe">{activeCount}</span>}
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-site px-5 py-10 lg:px-10 lg:py-14" aria-label="Products">
        <div className="mb-8 flex items-center justify-between gap-4 md:hidden">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${gender === 'MEN' ? 'men' : 'women'}`}
            aria-label="Search this collection"
            className="h-11 flex-1 border border-line bg-surface px-4 text-[14px] text-ink placeholder:text-muted focus:border-ink focus:outline-none" />
          
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort by" className="h-11 border border-line bg-surface px-2 text-[13px] text-ink sm:hidden">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
        <p className="mb-8 text-[13px] text-muted">
          {results.length} {results.length === 1 ? 'piece' : 'pieces'}
        </p>
        {results.length > 0 ?
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {results.map((p) =>
          <ProductCard key={p.id} product={p} />
          )}
          </div> :

        <div className="mx-auto max-w-md py-20 text-center">
            <h2 className="font-display text-3xl text-ink">Nothing matches just yet.</h2>
            <p className="mt-3 text-[15px] text-muted">Try clearing a filter — or let our atelier create exactly what you have in mind.</p>
            <div className="mt-8 flex justify-center gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setFilters(emptyFilters);
                setQuery('');
              }}>
              
                Clear filters
              </Button>
              <Link to="/custom-order" className="inline-flex h-12 items-center bg-ink px-7 text-[12px] font-medium uppercase tracking-[0.18em] text-bg">
                Request custom
              </Link>
            </div>
          </div>
        }
      </section>

      <AnimatePresence>
        {drawerOpen &&
        <FilterDrawer
          filters={filters}
          onChange={setFilters}
          sizes={options.sizes}
          colours={options.colours}
          resultCount={results.length}
          onClose={() => setDrawerOpen(false)} />

        }
      </AnimatePresence>
    </>);

}
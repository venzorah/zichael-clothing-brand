import { useMemo, useState } from 'react';
import { Gender, Product } from '../types/catalog';
import { effectivePrice } from '../utils/format';

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';
export type PriceBand = 'all' | 'under-150' | '150-250' | 'over-250';
export type Availability = 'all' | 'ready' | 'made-to-order';

export interface Filters {
  sizes: string[];
  colours: string[];
  price: PriceBand;
  availability: Availability;
  featuredOnly: boolean;
  newOnly: boolean;
}

export const emptyFilters: Filters = { sizes: [], colours: [], price: 'all', availability: 'all', featuredOnly: false, newOnly: false };

export const priceBands: {value: PriceBand;label: string;test: (n: number) => boolean;}[] = [
{ value: 'all', label: 'Any price', test: () => true },
{ value: 'under-150', label: 'Under ₦150,000', test: (n) => n < 150000 },
{ value: '150-250', label: '₦150,000 – ₦250,000', test: (n) => n >= 150000 && n <= 250000 },
{ value: 'over-250', label: 'Over ₦250,000', test: (n) => n > 250000 }];


export function useCollectionFilters(allProducts: Product[], gender: Gender, category?: string) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  // Strict collection separation: only published products of this gender ever enter the pipeline.
  const base = useMemo(() => allProducts.filter((p) => p.published && p.gender === gender), [allProducts, gender]);

  const options = useMemo(() => {
    const sizes = Array.from(new Set(base.flatMap((p) => p.sizes)));
    const colours = Array.from(new Map(base.flatMap((p) => p.colours).map((c) => [c.name, c])).values());
    return { sizes, colours };
  }, [base]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const band = priceBands.find((b) => b.value === filters.price)!;
    const list = base.filter((p) => {
      if (category && p.category !== category) return false;
      if (q && !`${p.name} ${p.description} ${p.fabric}`.toLowerCase().includes(q)) return false;
      if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s))) return false;
      if (filters.colours.length && !p.colours.some((c) => filters.colours.includes(c.name))) return false;
      if (filters.price !== 'all' && (!p.showPrice || p.price <= 0 || !band.test(effectivePrice(p)))) return false;
      if (filters.availability === 'ready' && !(p.stock === 'IN_STOCK' || p.stock === 'LOW_STOCK')) return false;
      if (filters.availability === 'made-to-order' && p.stock !== 'MADE_TO_ORDER') return false;
      if (filters.featuredOnly && !p.featured) return false;
      if (filters.newOnly && !p.newArrival) return false;
      return true;
    });
    const priced = (p: Product) => p.showPrice && p.price > 0 ? effectivePrice(p) : null;
    return [...list].sort((a, b) => {
      if (sort === 'newest') return b.createdAt.localeCompare(a.createdAt);
      if (sort === 'featured') return Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt);
      const pa = priced(a);
      const pb = priced(b);
      if (pa === null) return 1;
      if (pb === null) return -1;
      return sort === 'price-asc' ? pa - pb : pb - pa;
    });
  }, [base, category, query, filters, sort]);

  const activeCount =
  filters.sizes.length +
  filters.colours.length + (
  filters.price !== 'all' ? 1 : 0) + (
  filters.availability !== 'all' ? 1 : 0) + (
  filters.featuredOnly ? 1 : 0) + (
  filters.newOnly ? 1 : 0);

  return { query, setQuery, sort, setSort, filters, setFilters, options, results, activeCount, total: base.length };
}
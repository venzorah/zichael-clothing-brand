import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon, XIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Gender } from '../../types/catalog';
import { PriceTag } from '../PriceTag';

interface SearchOverlayProps {
  initialGender: Gender;
  onClose: () => void;
}

export function SearchOverlay({ initialGender, onClose }: SearchOverlayProps) {
  const { products, categories } = useStore();
  const [gender, setGender] = useState<Gender>(initialGender);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
      p.published &&
      p.gender === gender && (
      !q || `${p.name} ${p.description} ${p.fabric} ${categories.find((c) => c.slug === p.category)?.name}`.toLowerCase().includes(q))
    );
  }, [products, categories, gender, query]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}>
      
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search collection"
        className="max-h-[85vh] overflow-y-auto bg-surface"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}>
        
        <div className="mx-auto max-w-site px-5 py-6 lg:px-10 lg:py-8">
          <div className="flex items-center gap-4 border-b border-ink pb-3">
            <SearchIcon className="h-5 w-5 shrink-0 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${gender === 'WOMEN' ? 'Zichael Woman' : 'Zichael Men'}`}
              className="w-full bg-transparent font-display text-2xl text-ink placeholder:text-muted/60 focus:outline-none lg:text-3xl"
              aria-label="Search products" />
            
            <button type="button" onClick={onClose} aria-label="Close search" className="p-1 text-muted hover:text-ink">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-6" role="tablist" aria-label="Collection">
            {(['WOMEN', 'MEN'] as Gender[]).map((g) =>
            <button
              key={g}
              role="tab"
              aria-selected={gender === g}
              onClick={() => setGender(g)}
              className={`pb-1 text-[12px] uppercase tracking-[0.18em] transition-colors duration-150 ${
              gender === g ? 'border-b border-gold text-ink' : 'text-muted hover:text-ink'}`
              }>
              
                {g === 'WOMEN' ? 'Women' : 'Men'}
              </button>
            )}
          </div>
          <ul className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) =>
            <li key={p.id}>
                <Link to={`/product/${p.slug}`} onClick={onClose} className="flex items-center gap-4 p-1 hover:bg-ivory">
                  <img src={p.images[0].src} alt="" className="h-20 w-16 shrink-0 object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate font-display text-xl text-ink">{p.name}</span>
                    <PriceTag product={p} />
                  </span>
                </Link>
              </li>
            )}
          </ul>
          {results.length === 0 && <p className="mt-6 text-[15px] text-muted">No pieces match “{query}” in this collection.</p>}
        </div>
      </motion.div>
    </motion.div>);

}
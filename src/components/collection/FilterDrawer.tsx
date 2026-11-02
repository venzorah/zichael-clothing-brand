import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { ProductColour } from '../../types/catalog';
import { Availability, emptyFilters, Filters, priceBands } from '../../hooks/useCollectionFilters';
import { Button } from '../ui/Button';

interface FilterDrawerProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  sizes: string[];
  colours: ProductColour[];
  resultCount: number;
  onClose: () => void;
}

const toggle = (list: string[], v: string) => list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

export function FilterDrawer({ filters, onChange, sizes, colours, resultCount, onClose }: FilterDrawerProps) {
  const group = (title: string, children: React.ReactNode) =>
  <fieldset className="border-b border-line py-6">
      <legend className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-ink">{title}</legend>
      {children}
    </fieldset>;


  const chip = (active: boolean) =>
  `h-10 min-w-[56px] border px-3 text-[13px] transition-colors duration-150 ${active ? 'border-ink bg-ink text-bg' : 'border-line text-body hover:border-ink'}`;

  return (
    <motion.div className="fixed inset-0 z-[60] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="pb-safe ml-auto flex h-full w-full max-w-md flex-col bg-bg"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-3xl text-ink">Filter</h2>
          <button type="button" onClick={onClose} aria-label="Close filters" className="p-2 text-muted hover:text-ink">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {group(
            'Size',
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) =>
              <button key={s} type="button" aria-pressed={filters.sizes.includes(s)} onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, s) })} className={chip(filters.sizes.includes(s))}>
                  {s}
                </button>
              )}
            </div>
          )}
          {group(
            'Colour',
            <div className="flex flex-wrap gap-2">
              {colours.map((c) =>
              <button
                key={c.name}
                type="button"
                aria-pressed={filters.colours.includes(c.name)}
                onClick={() => onChange({ ...filters, colours: toggle(filters.colours, c.name) })}
                className={`${chip(filters.colours.includes(c.name))} inline-flex items-center gap-2`}>
                
                  <span className="h-3.5 w-3.5 rounded-full border border-black/15" style={{ background: c.hex }} aria-hidden="true" />
                  {c.name}
                </button>
              )}
            </div>
          )}
          {group(
            'Price',
            <div className="space-y-3">
              {priceBands.map((b) =>
              <label key={b.value} className="flex cursor-pointer items-center gap-3 text-[14px] text-body">
                  <input type="radio" name="price" checked={filters.price === b.value} onChange={() => onChange({ ...filters, price: b.value })} className="h-4 w-4 accent-[#D4AF37]" />
                  {b.label}
                </label>
              )}
              <p className="text-[12px] text-muted">Pieces priced on request are hidden when a price range is selected.</p>
            </div>
          )}
          {group(
            'Availability',
            <div className="space-y-3">
              {(
              [
              ['all', 'All pieces'],
              ['ready', 'Ready to wear'],
              ['made-to-order', 'Made to order']] as
              [Availability, string][]).
              map(([v, l]) =>
              <label key={v} className="flex cursor-pointer items-center gap-3 text-[14px] text-body">
                  <input type="radio" name="availability" checked={filters.availability === v} onChange={() => onChange({ ...filters, availability: v })} className="h-4 w-4 accent-[#D4AF37]" />
                  {l}
                </label>
              )}
            </div>
          )}
          {group(
            'Highlights',
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-[14px] text-body">
                <input type="checkbox" checked={filters.featuredOnly} onChange={(e) => onChange({ ...filters, featuredOnly: e.target.checked })} className="h-4 w-4 accent-[#D4AF37]" />
                Featured designs
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-[14px] text-body">
                <input type="checkbox" checked={filters.newOnly} onChange={(e) => onChange({ ...filters, newOnly: e.target.checked })} className="h-4 w-4 accent-[#D4AF37]" />
                New arrivals
              </label>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-line p-5">
          <Button variant="outline" onClick={() => onChange(emptyFilters)}>
            Clear all
          </Button>
          <Button onClick={onClose}>Show {resultCount}</Button>
        </div>
      </motion.aside>
    </motion.div>);

}
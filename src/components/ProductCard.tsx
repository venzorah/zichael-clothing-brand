import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { Product } from '../types/catalog';
import { PriceTag } from './PriceTag';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { saved, toggleSaved, categories } = useStore();
  const isSaved = saved.includes(product.id);
  const category = categories.find((c) => c.slug === product.category);
  const [primary, secondary] = product.images;
  const onSale = product.showPrice && product.salePrice && product.salePrice < product.price;

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-ivory">
          <img
            src={primary.src}
            alt={primary.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-luxe group-hover:scale-[1.02]" />
          
          {secondary &&
          <img
            src={secondary.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-luxe group-hover:opacity-100" />

          }
          {(product.newArrival || onSale) &&
          <span className="absolute left-3 top-3 bg-white/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-luxe">
              {onSale ? 'Sale' : 'New'}
            </span>
          }
        </Link>
        <button
          type="button"
          onClick={() => toggleSaved(product.id)}
          aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          aria-pressed={isSaved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-luxe transition-transform duration-150 ease-luxe active:scale-90">
          
          <HeartIcon className={`h-4 w-4 ${isSaved ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} strokeWidth={1.5} />
        </button>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{category?.name}</p>
        <h3 className="mt-1.5 font-display text-[22px] leading-tight text-ink">
          <Link to={`/product/${product.slug}`} className="hover:text-gold-ink">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto pt-2">
          <PriceTag product={product} />
        </div>
      </div>
    </article>);

}
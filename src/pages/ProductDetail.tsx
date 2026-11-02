import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, HeartIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { stockLabel } from '../utils/format';
import { ProductGallery } from '../components/product/ProductGallery';
import { PurchasePanel } from '../components/product/PurchasePanel';
import { ReservationDialog } from '../components/product/ReservationDialog';
import { PriceTag } from '../components/PriceTag';
import { ProductCard } from '../components/ProductCard';
import { NotFound } from './NotFound';

export function ProductDetail() {
  const { slug } = useParams();
  const { products, setLastCollection, saved, toggleSaved, categories } = useStore();
  const product = products.find((p) => p.slug === slug && p.published);
  const [colour, setColour] = useState('');
  const [size, setSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [reserving, setReserving] = useState(false);
  const sizeRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    if (!product) return;
    setLastCollection(product.gender);
    setColour(product.colours[0]?.name ?? '');
    setSize('');
    document.title = product.seoTitle?.trim() || `${product.name} | ${product.gender === 'MEN' ? 'Zichael Men' : 'Zichael Woman'}`;
    const meta = document.querySelector('meta[name="description"]') ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'description' }));
    meta.setAttribute('content', product.seoDescription?.trim() || product.description.slice(0, 155));
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return <NotFound />;

  const category = categories.find((c) => c.slug === product.category);
  const base = product.gender === 'MEN' ? '/men' : '/women';
  const isSaved = saved.includes(product.id);
  // Related products never cross collections.
  const related = products.
  filter((p) => p.published && p.gender === product.gender && p.id !== product.id).
  sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).
  slice(0, 4);

  const details = [
  { title: 'Description', body: product.description },
  { title: 'Fabric & care', body: `${product.fabric}. Dry clean only. Store on a broad-shouldered hanger away from direct sunlight.` },
  { title: 'Production & delivery', body: `Production time: ${product.productionDays}. Delivery across Nigeria in 2–7 working days after completion, or collect from a showroom.` }];


  return (
    <>
      <div className="mx-auto max-w-site px-5 pb-20 pt-6 lg:px-10 lg:pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-[12px] uppercase tracking-[0.14em] text-muted">
          <Link to={base} className="hover:text-ink">
            {product.gender === 'MEN' ? 'Men' : 'Women'}
          </Link>
          <span className="mx-2">/</span>
          <Link to={`${base}/${product.category}`} className="hover:text-ink">
            {category?.name}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <ProductGallery images={product.images} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-4xl leading-[1.05] text-ink lg:text-5xl">{product.name}</h1>
              <button
                type="button"
                onClick={() => toggleSaved(product.id)}
                aria-pressed={isSaved}
                aria-label={isSaved ? 'Remove from saved' : 'Save piece'}
                className="mt-1 grid h-11 w-11 shrink-0 place-items-center border border-line text-ink transition-colors duration-150 hover:border-ink">
                
                <HeartIcon className={`h-5 w-5 ${isSaved ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} strokeWidth={1.5} />
              </button>
            </div>
            <div className="mt-4">
              <PriceTag product={product} size="lg" />
            </div>
            <p className="mt-3 flex items-center gap-3 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${product.stock === 'OUT_OF_STOCK' ? 'bg-red-600' : product.stock === 'MADE_TO_ORDER' ? 'bg-gold' : 'bg-emerald-600'}`} aria-hidden="true" />
                {stockLabel[product.stock]}
              </span>
              <span aria-hidden="true">·</span>
              <span>{product.sku}</span>
            </p>

            <fieldset className="mt-8">
              <legend className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
                Colour <span className="ml-1 normal-case tracking-normal text-muted">{colour}</span>
              </legend>
              <div className="mt-3 flex gap-3">
                {product.colours.map((c) =>
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColour(c.name)}
                  aria-pressed={colour === c.name}
                  aria-label={c.name}
                  className={`h-9 w-9 rounded-full border border-black/15 ring-offset-2 ring-offset-bg transition-shadow duration-150 ${colour === c.name ? 'ring-1 ring-ink' : ''}`}
                  style={{ background: c.hex }} />

                )}
              </div>
            </fieldset>

            <fieldset ref={sizeRef} className="mt-7">
              <legend className="flex w-full items-baseline justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
                <span>Size</span>
                <Link to={`/custom-order?product=${product.slug}&gender=${product.gender}`} className="normal-case tracking-normal text-muted underline-offset-4 hover:text-ink hover:underline">
                  Need a bespoke fit?
                </Link>
              </legend>
              <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
                {product.sizes.map((s) =>
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  className={`h-11 border text-[13px] transition-colors duration-150 ${size === s ? 'border-ink bg-ink text-bg' : 'border-line text-body hover:border-ink'}`}>
                  
                    {s}
                  </button>
                )}
              </div>
              {sizeError &&
              <p role="alert" className="mt-2 text-[13px] text-red-700 dark:text-red-400">
                  Please select a size.
                </p>
              }
            </fieldset>

            <div className="mt-8">
              <PurchasePanel
                key={product.id}
                product={product}
                size={size}
                colour={colour}
                onNeedSize={() => {
                  setSizeError(true);
                  sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                onReserve={() => setReserving(true)} />
              
            </div>

            <div className="mt-10 border-t border-line">
              {details.map((d, i) =>
              <details key={d.title} open={i === 0} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-ink [&::-webkit-details-marker]:hidden">
                    {d.title}
                    <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.5} />
                  </summary>
                  <p className="pb-5 text-[15px] leading-relaxed text-body">{d.body}</p>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 &&
      <section className="border-t border-line bg-ivory py-16 lg:py-24" aria-labelledby="related-heading">
          <div className="mx-auto max-w-site px-5 lg:px-10">
            <h2 id="related-heading" className="font-display text-4xl text-ink">
              You may also like
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {related.map((p) =>
            <ProductCard key={p.id} product={p} />
            )}
            </div>
          </div>
        </section>
      }

      <AnimatePresence>{reserving && <ReservationDialog product={product} defaultSize={size} defaultColour={colour} onClose={() => setReserving(false)} />}</AnimatePresence>
    </>);

}
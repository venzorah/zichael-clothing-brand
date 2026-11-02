import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { Gender, Product, StockStatus } from '../../types/catalog';
import { slugify } from '../../utils/images';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { Toggle } from '../ui/Toggle';
import { AdminSection, AdminText } from './AdminInputs';
import { ProductImagesEditor } from './ProductImagesEditor';

const SIZE_PRESETS: Record<Gender, string[]> = {
  MEN: ['S', 'M', 'L', 'XL', 'XXL'],
  WOMEN: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16']
};

const STOCK: {value: StockStatus;label: string;}[] = [
{ value: 'IN_STOCK', label: 'In stock' },
{ value: 'LOW_STOCK', label: 'Low stock' },
{ value: 'MADE_TO_ORDER', label: 'Made to order' },
{ value: 'OUT_OF_STOCK', label: 'Out of stock' }];


const blankProduct = (gender: Gender): Product => ({
  id: `p-${Date.now().toString(36)}`,
  slug: '',
  sku: '',
  name: '',
  gender,
  category: '',
  description: '',
  images: [],
  sizes: SIZE_PRESETS[gender],
  colours: [],
  fabric: '',
  productionDays: '7–10 working days',
  stock: 'MADE_TO_ORDER',
  featured: false,
  newArrival: true,
  published: false,
  showPrice: false,
  price: 0,
  currency: 'NGN',
  purchaseOptions: { online: false, office: true, custom: true },
  createdAt: new Date().toISOString().slice(0, 10)
});

export function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, saveProduct, deleteProduct } = useStore();
  const existing = products.find((p) => p.id === id);
  const isNew = !existing;
  const [p, setP] = useState<Product>(() => existing ?? blankProduct('MEN'));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [sizeDraft, setSizeDraft] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof Product,>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const cats = useMemo(() => categories.filter((c) => c.gender === p.gender), [categories, p.gender]);

  if (id && id !== 'new' && !existing) {
    return (
      <div>
        <p className="text-muted">This product no longer exists.</p>
        <Link to="/admin/products" className="mt-4 inline-block text-gold-ink underline">
          Back to products
        </Link>
      </div>);

  }

  const setGender = (g: Gender) => {
    if (g === p.gender) return;
    setP((x) => ({ ...x, gender: g, category: '', sizes: SIZE_PRESETS[g] }));
  };

  const addSize = () => {
    const s = sizeDraft.trim();
    if (s && !p.sizes.includes(s)) set('sizes', [...p.sizes, s]);
    setSizeDraft('');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (p.name.trim().length < 2) e.name = 'Enter a product name.';
    if (!p.slug.trim()) e.slug = 'Enter a URL slug.';else
    if (products.some((x) => x.slug === p.slug && x.id !== p.id)) e.slug = 'Another product already uses this URL.';
    if (!p.sku.trim()) e.sku = 'Enter a SKU.';else
    if (products.some((x) => x.sku.toLowerCase() === p.sku.trim().toLowerCase() && x.id !== p.id)) e.sku = 'This SKU is already in use.';
    if (!p.category) e.category = 'Choose a category.';
    if (p.description.trim().length < 20) e.description = 'Write at least 20 characters.';
    if (p.images.length === 0) e.images = 'Add at least one image.';
    if (p.sizes.length === 0) e.sizes = 'Add at least one size.';
    if (p.colours.some((c) => !c.name.trim())) e.colours = 'Every colour needs a name.';
    if (p.showPrice && p.price <= 0) e.price = 'Enter a selling price to show it.';
    if (p.salePrice && p.salePrice >= p.price) e.salePrice = 'Sale price must be lower than the selling price.';
    if (p.purchaseOptions.online && (!p.showPrice || p.price <= 0)) e.online = 'Online checkout needs a visible price.';
    if (!p.purchaseOptions.online && !p.purchaseOptions.office && !p.purchaseOptions.custom) e.online = 'Enable at least one purchasing option.';
    return e;
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    saveProduct({ ...p, name: p.name.trim(), sku: p.sku.trim().toUpperCase(), salePrice: p.salePrice || undefined });
    toast.success(isNew ? 'Product created' : 'Product saved');
    navigate('/admin/products');
  };

  const remove = () => {
    if (!window.confirm(`Delete “${p.name}” permanently? It will be removed from the storefront, bags and saved lists.`)) return;
    deleteProduct(p.id);
    toast.success('Product deleted');
    navigate('/admin/products');
  };

  const err = (k: string) =>
  errors[k] ?
  <p role="alert" className="text-[13px] text-red-700 sm:col-span-2 dark:text-red-400">
        {errors[k]}
      </p> :
  null;

  return (
    <form onSubmit={save} noValidate>
      <div className="sticky top-0 z-10 -mx-5 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-bg/95 px-5 py-4 backdrop-blur lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" aria-label="Back to products" className="grid h-9 w-9 place-items-center text-muted hover:text-ink">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-3xl text-ink">{isNew ? 'New product' : p.name || 'Edit product'}</h1>
        </div>
        <div className="flex gap-2">
          {!isNew && p.published &&
          <Link to={`/product/${existing!.slug}`} target="_blank" className="hidden h-10 items-center px-4 text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink sm:inline-flex">
              View live
            </Link>
          }
          <Button type="submit" size="sm">
            {isNew ? 'Create product' : 'Save changes'}
          </Button>
        </div>
      </div>

      <AdminSection title="Basics" description="Collection is mandatory — a product only ever appears in its own storefront.">
        <Field label="Collection" htmlFor="pe-gender" className="sm:col-span-2">
          <div id="pe-gender" role="radiogroup" className="grid max-w-sm grid-cols-2 border border-line p-1">
            {(['WOMEN', 'MEN'] as Gender[]).map((g) =>
            <button
              key={g}
              type="button"
              role="radio"
              aria-checked={p.gender === g}
              onClick={() => setGender(g)}
              className={`h-10 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-150 ${p.gender === g ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}>
              
                {g === 'WOMEN' ? 'Zichael Woman' : 'Zichael Men'}
              </button>
            )}
          </div>
        </Field>
        <Field label="Product name" htmlFor="pe-name" error={errors.name}>
          <input
            id="pe-name"
            value={p.name}
            onChange={(e) => setP((x) => ({ ...x, name: e.target.value, slug: slugTouched ? x.slug : slugify(e.target.value) }))}
            className={inputClass} />
          
        </Field>
        <Field label="SKU" htmlFor="pe-sku" error={errors.sku}>
          <input id="pe-sku" value={p.sku} onChange={(e) => set('sku', e.target.value)} placeholder={p.gender === 'MEN' ? 'HOZ-M-KFT-010' : 'HOZ-W-GWN-010'} className={inputClass} />
        </Field>
        <Field label="URL slug" htmlFor="pe-slug" error={errors.slug} hint={`/product/${p.slug || '…'}`}>
          <input
            id="pe-slug"
            value={p.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', slugify(e.target.value));
            }}
            className={inputClass} />
          
        </Field>
        <Field label="Category" htmlFor="pe-cat" error={errors.category}>
          <select id="pe-cat" value={p.category} onChange={(e) => set('category', e.target.value)} className={inputClass}>
            <option value="">Select a category</option>
            {cats.map((c) =>
            <option key={c.slug} value={c.slug}>
                {c.name}
                {c.active === false ? ' (inactive)' : ''}
              </option>
            )}
          </select>
        </Field>
        <AdminText id="pe-desc" label="Description" multiline rows={5} value={p.description} onChange={(v) => set('description', v)} className="sm:col-span-2" />
        {err('description')}
        <AdminText id="pe-fabric" label="Fabric" value={p.fabric} onChange={(v) => set('fabric', v)} placeholder="Premium cashmere-blend suiting" className="sm:col-span-2" />
      </AdminSection>

      <AdminSection title="Gallery" description="Drag order with the arrows. The first image is the cover; the rest appear in the product gallery.">
        <ProductImagesEditor images={p.images} productName={p.name} onChange={(v) => set('images', v)} />
        {err('images')}
      </AdminSection>

      <AdminSection title="Variations" description="Sizes and colours customers choose from.">
        <div className="sm:col-span-2">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink">Sizes</p>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((s) =>
            <span key={s} className="inline-flex h-9 items-center gap-1.5 border border-line pl-3 pr-1.5 text-[14px] text-ink">
                {s}
                <button type="button" onClick={() => set('sizes', p.sizes.filter((x) => x !== s))} aria-label={`Remove size ${s}`} className="grid h-6 w-6 place-items-center text-muted hover:text-ink">
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            <div className="flex">
              <input
                value={sizeDraft}
                onChange={(e) => setSizeDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSize();
                  }
                }}
                placeholder="Add size"
                aria-label="New size"
                className="h-9 w-28 border border-line bg-surface px-3 text-[14px] text-ink focus:border-ink focus:outline-none" />
              
              <button type="button" onClick={addSize} aria-label="Add size" className="grid h-9 w-9 place-items-center bg-ink text-bg">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          {errors.sizes && <p className="mt-2 text-[13px] text-red-700 dark:text-red-400">{errors.sizes}</p>}
        </div>
        <div className="sm:col-span-2">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink">Colours</p>
          <ul className="space-y-2">
            {p.colours.map((c, i) =>
            <li key={i} className="flex items-center gap-2">
                <input
                type="color"
                value={c.hex}
                onChange={(e) => set('colours', p.colours.map((x, j) => j === i ? { ...x, hex: e.target.value } : x))}
                aria-label={`Swatch for ${c.name || 'colour'}`}
                className="h-10 w-12 cursor-pointer border border-line bg-surface p-1" />
              
                <input
                value={c.name}
                onChange={(e) => set('colours', p.colours.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                placeholder="Colour name"
                aria-label="Colour name"
                className="h-10 flex-1 border border-line bg-surface px-3 text-[14px] text-ink focus:border-ink focus:outline-none sm:max-w-xs" />
              
                <button type="button" onClick={() => set('colours', p.colours.filter((_, j) => j !== i))} aria-label="Remove colour" className="grid h-10 w-10 place-items-center text-muted hover:text-ink">
                  <XIcon className="h-4 w-4" />
                </button>
              </li>
            )}
          </ul>
          <button type="button" onClick={() => set('colours', [...p.colours, { name: '', hex: '#111111' }])} className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-gold-ink hover:underline">
            <PlusIcon className="h-3.5 w-3.5" /> Add colour
          </button>
          {errors.colours && <p className="mt-2 text-[13px] text-red-700 dark:text-red-400">{errors.colours}</p>}
        </div>
      </AdminSection>

      <AdminSection title="Pricing" description="Hidden prices are never shown, and zero is never displayed as a price.">
        <Field label="Selling price (NGN)" htmlFor="pe-price" error={errors.price}>
          <input id="pe-price" type="number" min={0} value={p.price || ''} onChange={(e) => set('price', Math.max(0, Number(e.target.value) || 0))} className={inputClass} />
        </Field>
        <Field label="Sale price (NGN)" htmlFor="pe-sale" optional error={errors.salePrice}>
          <input id="pe-sale" type="number" min={0} value={p.salePrice ?? ''} onChange={(e) => set('salePrice', Number(e.target.value) || undefined)} className={inputClass} />
        </Field>
        <ToggleRow
          label="Show price on the website"
          hint="When off, customers see “Price on request” and online checkout is disabled."
          checked={p.showPrice}
          onChange={(v) => setP((x) => ({ ...x, showPrice: v, purchaseOptions: { ...x.purchaseOptions, online: v ? x.purchaseOptions.online : false } }))} />
        
      </AdminSection>

      <AdminSection title="Purchasing options" description="Choose how customers can acquire this piece.">
        <ToggleRow label="Buy online" hint="Add to bag and pay online." checked={p.purchaseOptions.online} onChange={(v) => set('purchaseOptions', { ...p.purchaseOptions, online: v })} />
        <ToggleRow label="Visit our office" hint="Reserve for a showroom visit." checked={p.purchaseOptions.office} onChange={(v) => set('purchaseOptions', { ...p.purchaseOptions, office: v })} />
        <ToggleRow label="Request custom design" hint="Commission a made-to-measure version." checked={p.purchaseOptions.custom} onChange={(v) => set('purchaseOptions', { ...p.purchaseOptions, custom: v })} />
        {err('online')}
      </AdminSection>

      <AdminSection title="Availability">
        <Field label="Stock status" htmlFor="pe-stock">
          <select id="pe-stock" value={p.stock} onChange={(e) => set('stock', e.target.value as StockStatus)} className={inputClass}>
            {STOCK.map((s) =>
            <option key={s.value} value={s.value}>
                {s.label}
              </option>
            )}
          </select>
        </Field>
        <AdminText id="pe-prod" label="Production duration" value={p.productionDays} onChange={(v) => set('productionDays', v)} placeholder="7–10 working days" />
      </AdminSection>

      <AdminSection title="Visibility">
        <ToggleRow label="Published" hint="Visible in the storefront." checked={p.published} onChange={(v) => set('published', v)} />
        <ToggleRow label="Featured" hint="Shown on the homepage and first in sorting." checked={p.featured} onChange={(v) => set('featured', v)} />
        <ToggleRow label="New arrival" hint="Appears in New Arrivals." checked={p.newArrival} onChange={(v) => set('newArrival', v)} />
      </AdminSection>

      <AdminSection title="SEO" description="Optional. Defaults to the product name and description.">
        <AdminText id="pe-seo-t" label="Meta title" optional value={p.seoTitle ?? ''} onChange={(v) => set('seoTitle', v)} className="sm:col-span-2" />
        <AdminText id="pe-seo-d" label="Meta description" optional multiline rows={3} value={p.seoDescription ?? ''} onChange={(v) => set('seoDescription', v)} className="sm:col-span-2" />
      </AdminSection>

      {!isNew &&
      <div className="mt-4 flex justify-end border-t border-line pt-8">
          <Button type="button" variant="ghost" onClick={remove} className="text-red-700 hover:text-red-800 dark:text-red-400">
            Delete product
          </Button>
        </div>
      }
    </form>);

}

function ToggleRow({ label, hint, checked, onChange }: {label: string;hint?: string;checked: boolean;onChange: (v: boolean) => void;}) {
  return (
    <div className="flex items-start justify-between gap-4 border border-line p-4">
      <div>
        <p className="text-[14px] text-ink">{label}</p>
        {hint && <p className="mt-0.5 text-[12px] text-muted">{hint}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>);

}
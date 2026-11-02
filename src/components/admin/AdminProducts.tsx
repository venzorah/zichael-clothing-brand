import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CopyIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { Gender, Product } from '../../types/catalog';
import { formatPrice } from '../../utils/format';
import { buttonClass } from '../ui/Button';
import { Toggle } from '../ui/Toggle';

export function AdminProducts() {
  const { products, categories, updateProduct, saveProduct, deleteProduct } = useStore();
  const navigate = useNavigate();
  const [gender, setGender] = useState<Gender | 'ALL'>('ALL');
  const [q, setQ] = useState('');

  const list = products.filter((p) => (gender === 'ALL' || p.gender === gender) && `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase()));

  const duplicate = (p: Product) => {
    const stamp = Date.now().toString(36);
    const copy: Product = { ...p, id: `p-${stamp}`, name: `${p.name} (copy)`, slug: `${p.slug}-copy-${stamp.slice(-4)}`, sku: `${p.sku}-C${stamp.slice(-3).toUpperCase()}`, published: false, featured: false, createdAt: new Date().toISOString().slice(0, 10) };
    saveProduct(copy);
    toast.success('Duplicated as an unpublished draft');
    navigate(`/admin/products/${copy.id}`);
  };

  const remove = (p: Product) => {
    if (!window.confirm(`Delete “${p.name}” permanently?`)) return;
    deleteProduct(p.id);
    toast.success('Product deleted');
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Products</h1>
          <p className="mt-1 text-[14px] text-muted">
            {products.length} products · {products.filter((p) => p.published).length} published. Changes publish to the storefront immediately.
          </p>
        </div>
        <Link to="/admin/products/new" className={buttonClass('primary', 'sm')}>
          <PlusIcon className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or SKU" aria-label="Search products" className="h-10 w-64 border border-line bg-surface px-3 text-[14px] text-ink focus:border-ink focus:outline-none" />
        <div className="flex border border-line p-0.5" role="tablist">
          {(['ALL', 'WOMEN', 'MEN'] as const).map((g) =>
          <button key={g} role="tab" aria-selected={gender === g} onClick={() => setGender(g)} className={`h-9 px-4 text-[11px] uppercase tracking-[0.14em] ${gender === g ? 'bg-ink text-bg' : 'text-muted'}`}>
              {g === 'ALL' ? 'All' : g === 'WOMEN' ? 'Women' : 'Men'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-line">
        <table className="w-full min-w-[900px] text-[14px]">
          <thead className="bg-ivory text-left text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Collection</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Buying options</th>
              <th className="px-4 py-3 text-center font-medium">Featured</th>
              <th className="px-4 py-3 text-center font-medium">Published</th>
              <th className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.length === 0 &&
            <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No products match.
                </td>
              </tr>
            }
            {list.map((p) =>
            <tr key={p.id} className="align-middle">
                <td className="px-4 py-3">
                  <Link to={`/admin/products/${p.id}`} className="group flex items-center gap-3">
                    {p.images[0] ? <img src={p.images[0].src} alt="" className="h-14 w-11 object-cover" /> : <div className="h-14 w-11 bg-ivory" />}
                    <div>
                      <p className="text-ink group-hover:text-gold-ink">{p.name}</p>
                      <p className="text-[12px] text-muted">
                        {p.sku} · {categories.find((c) => c.slug === p.category)?.name ?? 'No category'} · {p.images.length} image{p.images.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-ivory px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-ink">{p.gender === 'MEN' ? 'Men' : 'Women'}</span>
                </td>
                <td className="px-4 py-3">
                  {p.price > 0 ?
                <>
                      <p className="text-ink">{formatPrice(p.salePrice ?? p.price)}</p>
                      <p className="text-[12px] text-muted">{p.showPrice ? 'Visible' : 'Hidden'}</p>
                    </> :

                <p className="text-muted">On request</p>
                }
                </td>
                <td className="px-4 py-3 text-[13px] text-body">
                  {[p.purchaseOptions.online && 'Online', p.purchaseOptions.office && 'Office', p.purchaseOptions.custom && 'Custom'].filter(Boolean).join(' · ') || '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <Toggle checked={p.featured} onChange={(v) => updateProduct(p.id, { featured: v })} label={`Feature ${p.name}`} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Toggle checked={p.published} onChange={(v) => updateProduct(p.id, { published: v })} label={`Publish ${p.name}`} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link to={`/admin/products/${p.id}`} aria-label={`Edit ${p.name}`} className="grid h-8 w-8 place-items-center text-muted hover:text-ink">
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button onClick={() => duplicate(p)} aria-label={`Duplicate ${p.name}`} className="grid h-8 w-8 place-items-center text-muted hover:text-ink">
                      <CopyIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p)} aria-label={`Delete ${p.name}`} className="grid h-8 w-8 place-items-center text-muted hover:text-red-600">
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}
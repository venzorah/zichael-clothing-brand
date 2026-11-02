import React, { useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { Category, Gender } from '../../types/catalog';
import { slugify } from '../../utils/images';
import { Button } from '../ui/Button';
import { Field, inputClass, textareaClass } from '../ui/Field';
import { Toggle } from '../ui/Toggle';

export function AdminCategories() {
  const { categories, products, saveCategory, deleteCategory } = useStore();
  const [editing, setEditing] = useState<{cat: Category;isNew: boolean;} | null>(null);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const { cat, isNew } = editing;
    if (cat.name.trim().length < 2) return toast.error('Enter a category name.');
    const slug = isNew ? slugify(cat.name) : cat.slug;
    if (isNew && categories.some((c) => c.slug === slug)) return toast.error('A category with this name already exists.');
    saveCategory({ ...cat, slug, name: cat.name.trim(), description: cat.description.trim() });
    toast.success('Category saved');
    setEditing(null);
  };

  const remove = (c: Category) => {
    const count = products.filter((p) => p.category === c.slug).length;
    if (count) return toast.error(`Move or delete the ${count} product${count > 1 ? 's' : ''} in “${c.name}” first, or deactivate it.`);
    if (!window.confirm(`Delete “${c.name}”?`)) return;
    deleteCategory(c.slug);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Categories</h1>
          <p className="mt-1 text-[14px] text-muted">Each category belongs to one collection. Inactive categories are hidden from the storefront.</p>
        </div>
        <Button size="sm" onClick={() => setEditing({ cat: { slug: '', name: '', gender: 'WOMEN', description: '', active: true }, isNew: true })}>
          New category
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {(['WOMEN', 'MEN'] as Gender[]).map((g) =>
        <section key={g}>
            <h2 className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink">{g === 'WOMEN' ? 'Zichael Woman' : 'Zichael Men'}</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {categories.
            filter((c) => c.gender === g).
            map((c) =>
            <li key={c.slug} className="flex items-start gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xl text-ink">{c.name}</p>
                      <p className="text-[13px] text-muted">
                        /{g === 'WOMEN' ? 'women' : 'men'}/{c.slug} · {products.filter((p) => p.category === c.slug).length} products
                      </p>
                      <p className="mt-1 text-[13px] text-body">{c.description}</p>
                    </div>
                    <Toggle checked={c.active !== false} onChange={(v) => saveCategory({ ...c, active: v })} label={`${c.name} active`} />
                    <button onClick={() => setEditing({ cat: c, isNew: false })} className="text-[13px] text-gold-ink hover:underline">
                      Edit
                    </button>
                    <button onClick={() => remove(c)} className="text-[13px] text-muted hover:text-red-600">
                      Delete
                    </button>
                  </li>
            )}
            </ul>
          </section>
        )}
      </div>

      {editing &&
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto bg-bg p-6 lg:p-8" aria-label="Category details">
            <h2 className="font-display text-3xl text-ink">{editing.isNew ? 'New category' : 'Edit category'}</h2>
            <div className="mt-6 space-y-5">
              <Field label="Collection" htmlFor="c-gender" hint={editing.isNew ? undefined : 'Collection cannot change after creation.'}>
                <select id="c-gender" disabled={!editing.isNew} value={editing.cat.gender} onChange={(e) => setEditing({ ...editing, cat: { ...editing.cat, gender: e.target.value as Gender } })} className={inputClass}>
                  <option value="WOMEN">Zichael Woman</option>
                  <option value="MEN">Zichael Men</option>
                </select>
              </Field>
              <Field label="Name" htmlFor="c-name">
                <input id="c-name" value={editing.cat.name} onChange={(e) => setEditing({ ...editing, cat: { ...editing.cat, name: e.target.value } })} className={inputClass} />
              </Field>
              <Field label="Description" htmlFor="c-desc">
                <textarea id="c-desc" value={editing.cat.description} onChange={(e) => setEditing({ ...editing, cat: { ...editing.cat, description: e.target.value } })} className={`${textareaClass} min-h-[120px]`} />
              </Field>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      }
    </div>);

}
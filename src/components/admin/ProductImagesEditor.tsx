import React, { useRef, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, StarIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ProductImage } from '../../types/catalog';
import { readImageFile } from '../../utils/images';
import { inputClass } from '../ui/Field';

interface ProductImagesEditorProps {
  images: ProductImage[];
  productName: string;
  onChange: (images: ProductImage[]) => void;
}

export function ProductImagesEditor({ images, productName, onChange }: ProductImagesEditorProps) {
  const [url, setUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const add = (src: string) => onChange([...images, { src, alt: `${productName || 'Product'} — view ${images.length + 1}` }]);

  const addUrl = () => {
    if (!/^https?:\/\/\S+$/.test(url.trim())) {
      toast.error('Enter a full image URL starting with https://');
      return;
    }
    add(url.trim());
    setUrl('');
  };

  const upload = async (files: FileList | null) => {
    if (!files) return;
    const added: ProductImage[] = [];
    for (const file of Array.from(files)) {
      try {
        const src = await readImageFile(file);
        added.push({ src, alt: `${productName || 'Product'} — ${file.name.replace(/\.[^.]+$/, '')}` });
      } catch (e) {
        toast.error(`${file.name}: ${(e as Error).message}`);
      }
    }
    if (added.length) onChange([...images, ...added]);
  };

  return (
    <div className="sm:col-span-2">
      {images.length === 0 && <p className="mb-4 border border-dashed border-line p-6 text-center text-[14px] text-muted">Add at least one image. The first image is the cover shown in collections.</p>}
      <ul className="space-y-3">
        {images.map((img, i) =>
        <li key={`${img.src.slice(0, 60)}-${i}`} className="flex items-center gap-3 border border-line p-2">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory">
              <img src={img.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              {i === 0 && <span className="absolute inset-x-0 bottom-0 bg-gold py-0.5 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-luxe">Cover</span>}
            </div>
            <label className="min-w-0 flex-1 text-[11px] uppercase tracking-[0.14em] text-muted">
              Alt text
              <input
              value={img.alt}
              onChange={(e) => onChange(images.map((x, j) => j === i ? { ...x, alt: e.target.value } : x))}
              className={`${inputClass} mt-1 h-10 normal-case tracking-normal`} />
            
            </label>
            <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
              {i !== 0 &&
            <button type="button" onClick={() => move(i, 0)} aria-label="Set as cover" title="Set as cover" className="grid h-8 w-8 place-items-center text-muted hover:text-gold-ink">
                  <StarIcon className="h-4 w-4" />
                </button>
            }
              <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up" className="grid h-8 w-8 place-items-center text-muted hover:text-ink disabled:opacity-30">
                <ArrowUpIcon className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(i, i + 1)} disabled={i === images.length - 1} aria-label="Move down" className="grid h-8 w-8 place-items-center text-muted hover:text-ink disabled:opacity-30">
                <ArrowDownIcon className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))} aria-label="Remove image" className="grid h-8 w-8 place-items-center text-muted hover:text-red-600">
                <Trash2Icon className="h-4 w-4" />
              </button>
            </div>
          </li>
        )}
      </ul>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Paste image URL (Cloudinary, CDN…)"
          aria-label="Image URL"
          className={`${inputClass} flex-1`} />
        
        <button type="button" onClick={addUrl} className="inline-flex h-12 items-center justify-center gap-2 border border-ink/70 px-5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink hover:bg-ink hover:text-bg">
          <PlusIcon className="h-4 w-4" /> Add URL
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex h-12 items-center justify-center gap-2 bg-ink px-5 text-[11px] font-medium uppercase tracking-[0.16em] text-bg">
          <UploadIcon className="h-4 w-4" /> Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            upload(e.target.files);
            e.target.value = '';
          }} />
        
      </div>
    </div>);

}
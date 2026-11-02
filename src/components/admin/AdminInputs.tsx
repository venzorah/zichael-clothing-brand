import React, { useRef } from 'react';
import { ImageIcon, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { readImageFile } from '../../utils/images';
import { Field, inputClass, textareaClass } from '../ui/Field';

interface AdminTextProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  placeholder?: string;
  className?: string;
  optional?: boolean;
}

export function AdminText({ id, label, value, onChange, multiline, rows = 4, hint, placeholder, className, optional }: AdminTextProps) {
  return (
    <Field label={label} htmlFor={id} hint={hint} optional={optional} className={className}>
      {multiline ?
      <textarea id={id} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${textareaClass} min-h-0`} /> :

      <input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      }
    </Field>);

}

interface AdminImageFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function AdminImageField({ id, label, value, onChange, className }: AdminImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    try {
      onChange(await readImageFile(file));
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Field label={label} htmlFor={id} className={className}>
      <div className="flex gap-3">
        <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-line bg-ivory">
          {value ? <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <ImageIcon className="absolute inset-0 m-auto h-5 w-5 text-muted" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input id={id} value={value.startsWith('data:') ? 'Uploaded image' : value} readOnly={value.startsWith('data:')} placeholder="https://…" onChange={(e) => onChange(e.target.value)} className={inputClass} />
          <div className="flex gap-3 text-[12px]">
            <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 text-gold-ink hover:underline">
              <UploadIcon className="h-3.5 w-3.5" /> Upload image
            </button>
            {value.startsWith('data:') &&
            <button type="button" onClick={() => onChange('')} className="text-muted hover:text-ink">
                Use a URL instead
              </button>
            }
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              upload(e.target.files?.[0]);
              e.target.value = '';
            }} />
          
        </div>
      </div>
    </Field>);

}

export function AdminSection({ title, description, children }: {title: string;description?: string;children: React.ReactNode;}) {
  return (
    <section className="grid gap-6 border-t border-line py-8 first:border-t-0 first:pt-0 lg:grid-cols-[240px_1fr] lg:gap-10">
      <div>
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>);

}
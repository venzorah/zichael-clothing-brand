import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FileTextIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { ACCEPTED_TYPES, MAX_FILE_BYTES, MAX_FILES } from '../../hooks/useCustomOrderForm';
import { formatBytes } from '../../utils/format';

interface ReferenceUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function ReferenceUploader({ files, onChange }: ReferenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);

  const previews = useMemo(() => files.map((f) => f.type.startsWith('image/') ? URL.createObjectURL(f) : null), [files]);
  useEffect(() => () => previews.forEach((p) => p && URL.revokeObjectURL(p)), [previews]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const problems: string[] = [];
    const accepted: File[] = [];
    Array.from(list).forEach((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) problems.push(`${f.name} — unsupported file type`);else
      if (f.size > MAX_FILE_BYTES) problems.push(`${f.name} — larger than 10 MB`);else
      if (files.some((x) => x.name === f.name && x.size === f.size)) problems.push(`${f.name} — already added`);else
      accepted.push(f);
    });
    const room = MAX_FILES - files.length;
    if (accepted.length > room) problems.push(`Only ${MAX_FILES} files can be attached.`);
    setRejected(problems);
    onChange([...files, ...accepted.slice(0, Math.max(0, room))]);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-12 text-center transition-colors duration-150 ${
        dragging ? 'border-gold bg-gold-soft' : 'border-muted/50 bg-ivory hover:border-ink'}`
        }>
        
        <UploadCloudIcon className="h-8 w-8 text-gold-ink" strokeWidth={1.25} />
        <p className="mt-4 text-[15px] text-ink">Drop files here or tap to browse</p>
        <p className="mt-1 text-[13px] text-muted">JPG, PNG, WEBP or PDF · up to 10 MB each · max {MAX_FILES} files</p>
        <input ref={inputRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" className="sr-only" onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }} />
      </div>

      {rejected.length > 0 &&
      <ul role="alert" className="mt-3 space-y-1 text-[13px] text-red-700 dark:text-red-400">
          {rejected.map((r) =>
        <li key={r}>{r}</li>
        )}
        </ul>
      }

      {files.length > 0 &&
      <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {files.map((f, i) =>
        <li key={f.name + f.size} className="relative">
              <div className="relative aspect-square overflow-hidden border border-line bg-ivory">
                {previews[i] ?
            <img src={previews[i]!} alt={f.name} className="absolute inset-0 h-full w-full object-cover" /> :

            <div className="flex h-full flex-col items-center justify-center p-2 text-muted">
                    <FileTextIcon className="h-7 w-7" strokeWidth={1.25} />
                    <span className="mt-1 text-[11px]">PDF</span>
                  </div>
            }
              </div>
              <p className="mt-1.5 truncate text-[12px] text-body">{f.name}</p>
              <p className="text-[11px] text-muted">{formatBytes(f.size)}</p>
              <button
            type="button"
            onClick={() => onChange(files.filter((_, x) => x !== i))}
            aria-label={`Remove ${f.name}`}
            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-luxe">
            
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </li>
        )}
        </ul>
      }
      <p className="mt-5 text-[13px] text-muted">Your references are stored privately and only viewed by our design team.</p>
    </div>);

}
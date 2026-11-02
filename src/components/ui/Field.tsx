import React from 'react';

export const inputClass =
'w-full h-12 bg-surface border border-line px-4 text-[15px] text-ink placeholder:text-muted/70 transition-colors duration-150 focus:border-ink focus:outline-none';

export const textareaClass =
'w-full min-h-[120px] bg-surface border border-line px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 transition-colors duration-150 focus:border-ink focus:outline-none';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, error, hint, optional, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
        <span>{label}</span>
        {optional && <span className="normal-case tracking-normal text-muted">Optional</span>}
      </label>
      {children}
      {error ?
      <p role="alert" className="mt-1.5 text-[13px] text-red-700 dark:text-red-400">
          {error}
        </p> :
      hint ?
      <p className="mt-1.5 text-[13px] text-muted">{hint}</p> :
      null}
    </div>);

}
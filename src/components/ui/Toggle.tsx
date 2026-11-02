import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 ${checked ? 'bg-gold' : 'bg-line'}`}>
      
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ease-luxe ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>);

}
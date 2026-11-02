import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  action?: {to: string;label: string;};
  id?: string;
}

export function SectionHeading({ eyebrow, title, action, id }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        {eyebrow && <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-ink">{eyebrow}</p>}
        <h2 id={id} className="mt-2 font-display text-4xl leading-[1.05] text-ink lg:text-5xl">
          {title}
        </h2>
      </div>
      {action &&
      <Link to={action.to} className="group hidden shrink-0 items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-ink sm:inline-flex">
          {action.label}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-luxe group-hover:translate-x-0.5" strokeWidth={1.5} />
        </Link>
      }
    </div>);

}
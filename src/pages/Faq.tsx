import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

export function Faq() {
  const { content } = useStore();

  useEffect(() => {
    document.title = 'FAQs | House of Zichael';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
      <h1 className="font-display text-5xl text-ink lg:text-6xl">Frequently asked</h1>
      <div className="mt-12 border-t border-line">
        {content.faqs.map((f, i) =>
        <details key={i} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-2xl text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <PlusIcon className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-45" strokeWidth={1.5} />
            </summary>
            <p className="whitespace-pre-line pb-6 text-[16px] leading-relaxed text-body">{f.a}</p>
          </details>
        )}
      </div>
      <p className="mt-10 text-[15px] text-muted">
        Still have a question?{' '}
        <Link to="/contact" className="text-ink underline underline-offset-4">
          Contact us
        </Link>
        .
      </p>
    </div>);

}
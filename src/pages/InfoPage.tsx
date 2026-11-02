import React, { useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { InfoPageSlug } from '../types/content';
import { NotFound } from './NotFound';

interface InfoPageProps {
  slug: InfoPageSlug;
}

export function InfoPage({ slug }: InfoPageProps) {
  const { content } = useStore();
  const page = content.pages[slug];

  useEffect(() => {
    if (page) document.title = `${page.title} | House of Zichael`;
  }, [page]);

  if (!page) return <NotFound />;

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
      <h1 className="font-display text-5xl leading-tight text-ink lg:text-6xl">{page.title}</h1>
      <p className="mt-6 whitespace-pre-line text-[18px] leading-relaxed text-body">{page.intro}</p>
      <div className="mt-14 space-y-10">
        {page.sections.map((s, i) =>
        <section key={i} className="grid gap-3 border-t border-line pt-8 md:grid-cols-[220px_1fr] md:gap-10">
            <h2 className="font-display text-2xl text-ink">{s.heading}</h2>
            <p className="whitespace-pre-line text-[16px] leading-relaxed text-body">{s.body}</p>
          </section>
        )}
      </div>
    </article>);

}
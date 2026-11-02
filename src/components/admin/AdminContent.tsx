import React, { useEffect, useState } from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { INFO_PAGE_SLUGS, InfoPageSlug, SiteContent } from '../../types/content';
import { Button } from '../ui/Button';
import { AdminImageField, AdminSection, AdminText } from './AdminInputs';

type Tab = 'homepage' | 'pages' | 'faqs' | 'global';

const TABS: {id: Tab;label: string;}[] = [
{ id: 'homepage', label: 'Homepage' },
{ id: 'pages', label: 'Pages' },
{ id: 'faqs', label: 'FAQs' },
{ id: 'global', label: 'Banner & footer' }];


const PAGE_LABELS: Record<InfoPageSlug, string> = {
  about: 'About Us',
  'shipping-returns': 'Shipping & Returns',
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions'
};

export function AdminContent() {
  const { content, saveContent, resetContent } = useStore();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [tab, setTab] = useState<Tab>('homepage');
  const [page, setPage] = useState<InfoPageSlug>('about');
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  useEffect(() => setDraft(content), [content]);

  const patch = <K extends keyof SiteContent,>(k: K, v: Partial<SiteContent[K]>) => setDraft((d) => ({ ...d, [k]: { ...(d[k] as object), ...v } }));

  const save = () => {
    try {
      saveContent(draft);
      toast.success('Website updated');
    } catch {
      toast.error('Could not save — uploaded images may be too large. Use hosted image URLs instead.');
    }
  };

  const pg = draft.pages[page];
  const setPg = (v: Partial<typeof pg>) => setDraft((d) => ({ ...d, pages: { ...d.pages, [page]: { ...d.pages[page], ...v } } }));

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-5 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-bg/95 px-5 py-4 backdrop-blur lg:-mx-10 lg:px-10">
        <div>
          <h1 className="font-display text-3xl text-ink">Website content</h1>
          <p className="text-[13px] text-muted">{dirty ? 'Unsaved changes' : 'All changes are live'}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (window.confirm('Restore all website content to the original defaults?')) {
                resetContent();
                toast.success('Content restored');
              }
            }}>
            
            Restore defaults
          </Button>
          <Button size="sm" variant="outline" disabled={!dirty} onClick={() => setDraft(content)}>
            Discard
          </Button>
          <Button size="sm" disabled={!dirty} onClick={save}>
            Publish changes
          </Button>
        </div>
      </div>

      <nav aria-label="Content sections" className="no-scrollbar mt-6 flex gap-6 overflow-x-auto border-b border-line">
        {TABS.map((t) =>
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          aria-current={tab === t.id}
          className={`-mb-px shrink-0 border-b-2 py-3 text-[13px] uppercase tracking-[0.14em] transition-colors duration-150 ${tab === t.id ? 'border-gold text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
          
            {t.label}
          </button>
        )}
      </nav>

      <div className="mt-8">
        {tab === 'homepage' &&
        <>
            {(['women', 'men'] as const).map((g) =>
          <AdminSection key={g} title={`Hero — ${g === 'women' ? 'Women' : 'Men'} panel`} description="The first thing visitors see. Links to the collection.">
                <AdminText id={`h-${g}-house`} label="Label" value={draft.hero[g].house} onChange={(v) => patch('hero', { [g]: { ...draft.hero[g], house: v } })} />
                <AdminText id={`h-${g}-title`} label="Heading" value={draft.hero[g].title} onChange={(v) => patch('hero', { [g]: { ...draft.hero[g], title: v } })} />
                <AdminText id={`h-${g}-sub`} label="Supporting text" value={draft.hero[g].subtitle} onChange={(v) => patch('hero', { [g]: { ...draft.hero[g], subtitle: v } })} />
                <AdminText id={`h-${g}-cta`} label="Button text" value={draft.hero[g].cta} onChange={(v) => patch('hero', { [g]: { ...draft.hero[g], cta: v } })} />
                <AdminImageField id={`h-${g}-img`} label="Image" value={draft.hero[g].image} onChange={(v) => patch('hero', { [g]: { ...draft.hero[g], image: v } })} className="sm:col-span-2" />
              </AdminSection>
          )}
            <AdminSection title="Brand introduction">
              <AdminText id="i-h" label="Heading" value={draft.intro.heading} onChange={(v) => patch('intro', { heading: v })} />
              <AdminText id="i-hl" label="Highlighted words" value={draft.intro.highlight} onChange={(v) => patch('intro', { highlight: v })} />
              <AdminText id="i-b" label="Body" multiline value={draft.intro.body} onChange={(v) => patch('intro', { body: v })} className="sm:col-span-2" />
            </AdminSection>
            {(['women', 'men'] as const).map((g) =>
          <AdminSection key={g} title={`Featured ${g === 'women' ? 'Women' : 'Men'}`} description="Products shown here are the ones marked Featured.">
                <AdminText id={`f-${g}-t`} label="Section title" value={draft.featured[g].title} onChange={(v) => patch('featured', { [g]: { ...draft.featured[g], title: v } })} />
                <AdminText id={`f-${g}-c`} label="Lead image caption" value={draft.featured[g].leadCaption} onChange={(v) => patch('featured', { [g]: { ...draft.featured[g], leadCaption: v } })} />
                <AdminImageField id={`f-${g}-i`} label="Lead image" value={draft.featured[g].leadImage} onChange={(v) => patch('featured', { [g]: { ...draft.featured[g], leadImage: v } })} className="sm:col-span-2" />
              </AdminSection>
          )}
            <AdminSection title="Custom clothing promotion">
              <AdminText id="c-e" label="Label" value={draft.custom.eyebrow} onChange={(v) => patch('custom', { eyebrow: v })} />
              <AdminText id="c-h" label="Heading" value={draft.custom.heading} onChange={(v) => patch('custom', { heading: v })} />
              <AdminText id="c-hl" label="Highlighted line" value={draft.custom.highlight} onChange={(v) => patch('custom', { highlight: v })} className="sm:col-span-2" />
              <AdminText id="c-b" label="Body" multiline value={draft.custom.body} onChange={(v) => patch('custom', { body: v })} className="sm:col-span-2" />
              <AdminImageField id="c-i" label="Image" value={draft.custom.image} onChange={(v) => patch('custom', { image: v })} className="sm:col-span-2" />
            </AdminSection>
            <AdminSection title="Showrooms section" description="Showroom addresses come from Offices.">
              <AdminText id="s-e" label="Label" value={draft.showroom.eyebrow} onChange={(v) => patch('showroom', { eyebrow: v })} />
              <AdminText id="s-h" label="Heading" value={draft.showroom.heading} onChange={(v) => patch('showroom', { heading: v })} />
              <AdminText id="s-b" label="Body" multiline value={draft.showroom.body} onChange={(v) => patch('showroom', { body: v })} className="sm:col-span-2" />
              <AdminImageField id="s-i" label="Image" value={draft.showroom.image} onChange={(v) => patch('showroom', { image: v })} className="sm:col-span-2" />
            </AdminSection>
            <AdminSection title="Brand story">
              <AdminText id="st-q" label="Quote" multiline value={draft.story.quote} onChange={(v) => patch('story', { quote: v })} className="sm:col-span-2" />
              <AdminText id="st-a" label="Attribution" value={draft.story.attribution} onChange={(v) => patch('story', { attribution: v })} className="sm:col-span-2" />
            </AdminSection>
            <AdminSection title="Instagram" description="Handles without the @. Leave blank to hide.">
              <AdminText id="ig-w" label="Women account" value={draft.social.womenHandle} onChange={(v) => patch('social', { womenHandle: v.replace(/^@/, '').trim() })} />
              <AdminText id="ig-m" label="Men account" value={draft.social.menHandle} onChange={(v) => patch('social', { menHandle: v.replace(/^@/, '').trim() })} />
            </AdminSection>
          </>
        }

        {tab === 'pages' &&
        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
            <ul className="flex gap-2 overflow-x-auto lg:flex-col">
              {INFO_PAGE_SLUGS.map((s) =>
            <li key={s}>
                  <button onClick={() => setPage(s)} className={`w-full whitespace-nowrap px-3 py-2 text-left text-[14px] ${page === s ? 'bg-ivory text-ink' : 'text-muted hover:text-ink'}`}>
                    {PAGE_LABELS[s]}
                  </button>
                </li>
            )}
            </ul>
            <div className="space-y-5">
              <AdminText id="pg-t" label="Page title" value={pg.title} onChange={(v) => setPg({ title: v })} />
              <AdminText id="pg-i" label="Introduction" multiline value={pg.intro} onChange={(v) => setPg({ intro: v })} />
              {pg.sections.map((s, i) =>
            <div key={i} className="space-y-3 border border-line p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Section {i + 1}</p>
                    <button onClick={() => setPg({ sections: pg.sections.filter((_, j) => j !== i) })} aria-label="Remove section" className="text-muted hover:text-red-600">
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                  <AdminText id={`pg-${i}-h`} label="Heading" value={s.heading} onChange={(v) => setPg({ sections: pg.sections.map((x, j) => j === i ? { ...x, heading: v } : x) })} />
                  <AdminText id={`pg-${i}-b`} label="Body" multiline value={s.body} onChange={(v) => setPg({ sections: pg.sections.map((x, j) => j === i ? { ...x, body: v } : x) })} />
                </div>
            )}
              <button onClick={() => setPg({ sections: [...pg.sections, { heading: '', body: '' }] })} className="inline-flex items-center gap-1.5 text-[13px] text-gold-ink hover:underline">
                <PlusIcon className="h-3.5 w-3.5" /> Add section
              </button>
            </div>
          </div>
        }

        {tab === 'faqs' &&
        <div className="max-w-3xl space-y-4">
            {draft.faqs.map((f, i) =>
          <div key={i} className="space-y-3 border border-line p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Question {i + 1}</p>
                  <button onClick={() => setDraft((d) => ({ ...d, faqs: d.faqs.filter((_, j) => j !== i) }))} aria-label="Remove question" className="text-muted hover:text-red-600">
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </div>
                <AdminText id={`fq-${i}-q`} label="Question" value={f.q} onChange={(v) => setDraft((d) => ({ ...d, faqs: d.faqs.map((x, j) => j === i ? { ...x, q: v } : x) }))} />
                <AdminText id={`fq-${i}-a`} label="Answer" multiline value={f.a} onChange={(v) => setDraft((d) => ({ ...d, faqs: d.faqs.map((x, j) => j === i ? { ...x, a: v } : x) }))} />
              </div>
          )}
            <button onClick={() => setDraft((d) => ({ ...d, faqs: [...d.faqs, { q: '', a: '' }] }))} className="inline-flex items-center gap-1.5 text-[13px] text-gold-ink hover:underline">
              <PlusIcon className="h-3.5 w-3.5" /> Add question
            </button>
          </div>
        }

        {tab === 'global' &&
        <>
            <AdminSection title="Announcement bar" description="Shown above the header on desktop. Leave blank to hide.">
              <AdminText id="g-a" label="Message" value={draft.announcement} onChange={(v) => setDraft((d) => ({ ...d, announcement: v }))} className="sm:col-span-2" />
            </AdminSection>
            <AdminSection title="Footer & newsletter">
              <AdminText id="g-t" label="Footer tagline" value={draft.footer.tagline} onChange={(v) => patch('footer', { tagline: v })} className="sm:col-span-2" />
              <AdminText id="g-nh" label="Newsletter heading" value={draft.footer.newsletterHeading} onChange={(v) => patch('footer', { newsletterHeading: v })} />
              <AdminText id="g-nb" label="Newsletter text" value={draft.footer.newsletterBody} onChange={(v) => patch('footer', { newsletterBody: v })} />
            </AdminSection>
          </>
        }
      </div>
    </div>);

}
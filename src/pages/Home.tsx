import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { SplitHero } from '../components/home/SplitHero';
import { FeaturedCollection } from '../components/home/FeaturedCollection';
import { NewArrivals } from '../components/home/NewArrivals';
import { CraftDetails } from '../components/home/CraftDetails';
import { CustomPromo } from '../components/home/CustomPromo';
import { ShowroomTeaser } from '../components/home/ShowroomTeaser';
import { InstagramStrip } from '../components/home/InstagramStrip';

export function Home() {
  const { content } = useStore();

  useEffect(() => {
    document.title = 'House of Zichael — Luxury Bespoke Fashion for Men & Women';
  }, []);

  return (
    <>
      <SplitHero />

      <section className="mx-auto max-w-site px-5 py-20 lg:px-10 lg:py-32" aria-label="About House of Zichael">
        <div className="grid gap-8 lg:grid-cols-12">
          <h1 className="font-display text-[40px] leading-[1.05] text-ink lg:col-span-8 lg:text-7xl">
            {content.intro.heading} <span className="italic text-gold-ink">{content.intro.highlight}</span>
          </h1>
          <div className="lg:col-span-4 lg:pt-4">
            <p className="text-[16px] leading-relaxed text-muted">{content.intro.body}</p>
            <Link to="/about" className="mt-6 inline-block border-b border-ink pb-1 text-[12px] font-medium uppercase tracking-[0.18em] text-ink hover:border-gold hover:text-gold-ink">
              Our story
            </Link>
          </div>
        </div>
      </section>

      <FeaturedCollection
        gender="WOMEN"
        eyebrow={content.hero.women.house}
        title={content.featured.women.title}
        leadImage={content.featured.women.leadImage}
        leadAlt={content.featured.women.leadCaption}
        leadCaption={content.featured.women.leadCaption} />
      

      <FeaturedCollection
        gender="MEN"
        eyebrow={content.hero.men.house}
        title={content.featured.men.title}
        leadImage={content.featured.men.leadImage}
        leadAlt={content.featured.men.leadCaption}
        leadCaption={content.featured.men.leadCaption}
        reverse />
      

      <NewArrivals />
      <CraftDetails />
      <CustomPromo />
      <ShowroomTeaser />

      <section className="bg-ivory py-20 lg:py-28" aria-label="Our story">
        <figure className="mx-auto max-w-3xl px-5 text-center">
          <blockquote className="font-display text-3xl leading-snug text-ink lg:text-[44px]">“{content.story.quote}”</blockquote>
          <figcaption className="mt-8 text-[11px] uppercase tracking-[0.22em] text-gold-ink">{content.story.attribution}</figcaption>
        </figure>
      </section>

      <InstagramStrip />
    </>);

}
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { directionsUrl } from '../../utils/format';
import { buttonClass } from '../ui/Button';

export function ShowroomTeaser() {
  const { offices, content } = useStore();
  const s = content.showroom;
  const active = offices.filter((o) => o.active);

  return (
    <section className="mx-auto max-w-site px-5 py-20 lg:px-10 lg:py-28" aria-labelledby="showroom-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="relative aspect-[16/10] overflow-hidden bg-ivory lg:col-span-7 lg:aspect-auto lg:min-h-[520px]">
          <img src={s.image} alt="Inside a House of Zichael showroom" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col lg:col-span-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-ink">{s.eyebrow}</p>
          <h2 id="showroom-heading" className="mt-2 font-display text-4xl leading-[1.05] text-ink lg:text-5xl">
            {s.heading}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{s.body}</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {active.map((o) =>
            <li key={o.id} className="flex items-start justify-between gap-4 py-5">
                <div>
                  <h3 className="font-display text-2xl text-ink">{o.city}</h3>
                  <p className="mt-1 text-[14px] text-muted">{o.address}</p>
                  <p className="mt-1 text-[13px] text-muted">
                    {o.hours[0]?.label} · {o.hours[0]?.hours}
                  </p>
                </div>
                <a
                href={directionsUrl(o.lat, o.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink hover:text-gold-ink">
                
                  Directions <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </a>
              </li>
            )}
          </ul>
          <Link to="/showrooms" className={buttonClass('outline', 'md', 'mt-8 self-start')}>
            View all showrooms
          </Link>
        </div>
      </div>
    </section>);

}
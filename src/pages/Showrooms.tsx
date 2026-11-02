import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageCircleIcon, NavigationIcon, PhoneIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { directionsUrl } from '../utils/format';
import { OfficeMap } from '../components/showroom/OfficeMap';
import { ReservationDialog } from '../components/product/ReservationDialog';
import { Button } from '../components/ui/Button';

export function Showrooms() {
  const { offices } = useStore();
  const active = offices.filter((o) => o.active);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reserveOffice, setReserveOffice] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Showrooms & Directions | House of Zichael';
  }, []);

  const link = 'inline-flex h-10 items-center gap-2 border border-line px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-150 hover:border-ink';

  return (
    <>
      <div className="mx-auto max-w-site px-5 pt-12 lg:px-10 lg:pt-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-ink">Visit our offices</p>
        <h1 className="mt-2 font-display text-5xl text-ink lg:text-6xl">Showrooms</h1>
        <p className="mt-3 max-w-xl text-[15px] text-muted">Buy in person, be fitted, consult a stylist or collect your order. Reserve a visit and we’ll prepare for you.</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-site lg:grid-cols-[480px_1fr] lg:px-10 lg:pb-16">
        <div className="order-2 px-5 pb-12 pt-8 lg:order-1 lg:px-0 lg:pr-10 lg:pt-0">
          {active.length === 0 && <p className="text-muted">No showrooms are open right now. Please check back soon.</p>}
          <ul className="space-y-6">
            {active.map((o) =>
            <li key={o.id}>
                <article
                onClick={() => setSelectedId(o.id)}
                className={`cursor-pointer border p-5 transition-colors duration-150 ${selectedId === o.id ? 'border-ink' : 'border-line hover:border-muted'}`}>
                
                  <div className="flex gap-5">
                    <img src={o.image} alt={`${o.name} interior`} className="h-28 w-24 shrink-0 object-cover" />
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gold-ink">{o.city}</p>
                      <h2 className="mt-1 font-display text-2xl leading-tight text-ink">{o.name}</h2>
                      <p className="mt-1 text-[14px] text-muted">
                        {o.address}, {o.city}, {o.state}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-5 grid grid-cols-[110px_1fr] gap-y-1.5 text-[14px]">
                    {o.hours.map((h) =>
                  <React.Fragment key={h.label}>
                        <dt className="text-muted">{h.label}</dt>
                        <dd className="text-ink">{h.hours}</dd>
                      </React.Fragment>
                  )}
                  </dl>
                  <p className="mt-4 text-[13px] text-muted">{o.services.join(' · ')}</p>
                  <div className="mt-5 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    <a href={directionsUrl(o.lat, o.lng)} target="_blank" rel="noopener noreferrer" className={link}>
                      <NavigationIcon className="h-3.5 w-3.5" /> Directions
                    </a>
                    <a href={`tel:${o.phone.replace(/\s/g, '')}`} className={link}>
                      <PhoneIcon className="h-3.5 w-3.5" /> Call
                    </a>
                    <a href={`https://wa.me/${o.whatsapp}`} target="_blank" rel="noopener noreferrer" className={link}>
                      <MessageCircleIcon className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                    <Button size="sm" className="ml-auto" onClick={() => setReserveOffice(o.id)}>
                      Reserve visit
                    </Button>
                  </div>
                </article>
              </li>
            )}
          </ul>
        </div>
        <div className="order-1 h-[340px] lg:order-2 lg:sticky lg:top-28 lg:h-[calc(100vh-160px)]">
          <OfficeMap offices={active} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      <AnimatePresence>{reserveOffice && <ReservationDialog defaultOfficeId={reserveOffice} onClose={() => setReserveOffice(null)} />}</AnimatePresence>
    </>);

}
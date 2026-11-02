import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { formatDate, formatPrice } from '../utils/format';
import { AuthForms } from '../components/account/AuthForms';
import { ProductCard } from '../components/ProductCard';
import { QuotationView } from '../components/custom/QuotationView';
import { StatusTimeline } from '../components/StatusTimeline';
import { Button } from '../components/ui/Button';

type Tab = 'orders' | 'requests' | 'reservations' | 'saved' | 'profile';

const paymentLabel = { AWAITING_PAYMENT: 'Awaiting payment', PAID: 'Paid', FAILED: 'Payment failed' };

export function Account() {
  const { user, signOut, orders, requests, reservations, saved, products, offices } = useStore();
  const [tab, setTab] = useState<Tab>('orders');
  const [openRef, setOpenRef] = useState<string | null>(null);

  if (!user) return <AuthForms />;

  const email = user.email.toLowerCase();
  const myOrders = orders.filter((o) => o.customer.email.toLowerCase() === email);
  const myRequests = requests.filter((r) => r.contact.email.toLowerCase() === email);
  const myReservations = reservations.filter((r) => r.email.toLowerCase() === email);
  const savedProducts = products.filter((p) => saved.includes(p.id) && p.published);

  const tabs: {id: Tab;label: string;count?: number;}[] = [
  { id: 'orders', label: 'Orders', count: myOrders.length },
  { id: 'requests', label: 'Custom requests', count: myRequests.length },
  { id: 'reservations', label: 'Reservations', count: myReservations.length },
  { id: 'saved', label: 'Saved', count: savedProducts.length },
  { id: 'profile', label: 'Profile' }];


  const empty = (text: string, to: string, cta: string) =>
  <div className="border border-dashed border-line px-6 py-14 text-center">
      <p className="text-[15px] text-muted">{text}</p>
      <Link to={to} className="mt-4 inline-block border-b border-ink text-[12px] uppercase tracking-[0.16em] text-ink">
        {cta}
      </Link>
    </div>;


  const badge = (t: string) => <span className="inline-block bg-ivory px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-ink">{t}</span>;

  return (
    <div className="mx-auto max-w-site px-5 py-12 lg:px-10 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-ink">My account</p>
          <h1 className="mt-2 font-display text-5xl text-ink">Welcome, {user.name.split(' ')[0]}</h1>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Account sections" className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto border-b border-line px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:border-b-0 lg:px-0">
          {tabs.map((t) =>
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={`flex items-center justify-between gap-3 whitespace-nowrap border-b-2 py-3 text-left text-[13px] uppercase tracking-[0.14em] transition-colors duration-150 lg:border-b-0 lg:border-l-2 lg:pl-4 ${
            tab === t.id ? 'border-gold text-ink' : 'border-transparent text-muted hover:text-ink'}`
            }>
            
              {t.label}
              {t.count !== undefined && <span className="text-[12px] text-muted">{t.count}</span>}
            </button>
          )}
        </nav>

        <section>
          {tab === 'orders' && (
          myOrders.length === 0 ?
          empty('You haven’t placed an order yet.', '/', 'Start shopping') :

          <ul className="divide-y divide-line border-y border-line">
                {myOrders.map((o) =>
            <li key={o.ref}>
                    <Link to={`/order/${o.ref}`} className="flex flex-wrap items-center gap-4 py-5 hover:bg-ivory/60">
                      <div className="flex -space-x-3">
                        {o.items.slice(0, 3).map((i) =>
                  <img key={i.key} src={i.image} alt="" className="h-16 w-12 border-2 border-bg object-cover" />
                  )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[14px] text-ink">{o.ref}</p>
                        <p className="text-[13px] text-muted">
                          {formatDate(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      {badge(paymentLabel[o.paymentStatus])}
                      {badge(o.fulfilment)}
                      <p className="w-28 text-right text-[15px] text-ink">{formatPrice(o.total)}</p>
                    </Link>
                  </li>
            )}
              </ul>)
          }

          {tab === 'requests' && (
          myRequests.length === 0 ?
          empty('No custom requests yet.', '/custom-order', 'Request a custom design') :

          <ul className="space-y-4">
                {myRequests.map((r) =>
            <li key={r.ref} className="border border-line">
                    <button onClick={() => setOpenRef(openRef === r.ref ? null : r.ref)} aria-expanded={openRef === r.ref} className="flex w-full flex-wrap items-center gap-4 p-5 text-left">
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-2xl text-ink">{r.clothingType}</p>
                        <p className="text-[13px] text-muted">
                          {r.ref} · {formatDate(r.createdAt)}
                        </p>
                      </div>
                      {r.quotation?.sentAt && !r.quotation.response && <span className="bg-gold px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-luxe">Quotation ready</span>}
                      {badge(r.status)}
                    </button>
                    {openRef === r.ref &&
              <div className="grid gap-8 border-t border-line p-5 lg:grid-cols-2">
                        <StatusTimeline history={r.history} />
                        <QuotationView request={r} />
                      </div>
              }
                  </li>
            )}
              </ul>)
          }

          {tab === 'reservations' && (
          myReservations.length === 0 ?
          empty('No showroom reservations yet.', '/showrooms', 'Find a showroom') :

          <ul className="divide-y divide-line border-y border-line">
                {myReservations.map((r) => {
              const p = products.find((x) => x.id === r.productId);
              return (
                <li key={r.ref} className="flex flex-wrap items-center gap-4 py-5">
                      {p && <img src={p.images[0].src} alt="" className="h-16 w-12 object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] text-ink">{p ? p.name : 'Showroom consultation'}</p>
                        <p className="text-[13px] text-muted">
                          {offices.find((o) => o.id === r.officeId)?.name} · {formatDate(r.date)} at {r.time}
                        </p>
                        <p className="font-mono text-[12px] text-muted">{r.ref}</p>
                      </div>
                      {badge(r.status)}
                    </li>);

            })}
              </ul>)
          }

          {tab === 'saved' && (
          savedProducts.length === 0 ?
          empty('Tap the heart on any piece to save it here.', '/', 'Explore collections') :

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-8">
                {savedProducts.map((p) =>
            <ProductCard key={p.id} product={p} />
            )}
              </div>)
          }

          {tab === 'profile' &&
          <dl className="grid max-w-lg grid-cols-[120px_1fr] gap-y-4 text-[15px]">
              <dt className="text-muted">Name</dt>
              <dd className="text-ink">{user.name}</dd>
              <dt className="text-muted">Email</dt>
              <dd className="text-ink">{user.email}</dd>
              <dt className="text-muted">Phone</dt>
              <dd className="text-ink">{user.phone || '—'}</dd>
            </dl>
          }
        </section>
      </div>
    </div>);

}
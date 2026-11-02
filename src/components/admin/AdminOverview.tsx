import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { formatDateTime, formatPrice } from '../../utils/format';

export function AdminOverview() {
  const { products, orders, requests, reservations, offices } = useStore();
  const paid = orders.filter((o) => o.paymentStatus === 'PAID');
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const awaiting = orders.filter((o) => o.paymentStatus === 'AWAITING_PAYMENT');
  const men = products.filter((p) => p.gender === 'MEN').length;
  const women = products.filter((p) => p.gender === 'WOMEN').length;
  const newRequests = requests.filter((r) => r.status === 'New Request');
  const pendingQuotes = requests.filter((r) => r.status === 'Quotation Sent' || r.status === 'Awaiting Approval');
  const pendingRes = reservations.filter((r) => r.status === 'Pending Confirmation');
  const customers = new Set([...orders.map((o) => o.customer.email), ...requests.map((r) => r.contact.email), ...reservations.map((r) => r.email)].map((e) => e.toLowerCase())).size;

  const activity = [
  ...orders.map((o) => ({ at: o.createdAt, text: `Order ${o.ref} placed by ${o.customer.name}`, to: '/admin/orders' })),
  ...requests.flatMap((r) => r.history.map((h) => ({ at: h.at, text: `${r.ref} · ${h.status}`, to: '/admin/requests' }))),
  ...reservations.flatMap((r) => r.history.map((h) => ({ at: h.at, text: `Reservation ${r.ref} · ${h.status}`, to: '/admin/reservations' })))].

  sort((a, b) => b.at.localeCompare(a.at)).
  slice(0, 8);

  const attention = [
  { label: 'New custom requests', count: newRequests.length, to: '/admin/requests' },
  { label: 'Reservations awaiting confirmation', count: pendingRes.length, to: '/admin/reservations' },
  { label: 'Orders awaiting payment verification', count: awaiting.length, to: '/admin/orders' },
  { label: 'Quotations awaiting customer response', count: pendingQuotes.length, to: '/admin/requests' }];


  const branch = offices.map((o) => ({ name: o.name, count: reservations.filter((r) => r.officeId === o.id).length }));

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">Overview</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="bg-luxe p-8 text-[#F5F0E6]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]">Verified revenue</p>
          <p className="mt-3 font-display text-6xl text-white">{formatPrice(revenue)}</p>
          <p className="mt-2 text-[14px] text-[#F5F0E6]/60">
            From {paid.length} paid order{paid.length === 1 ? '' : 's'} · {orders.length} total · {customers} customer{customers === 1 ? '' : 's'}
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <dt className="text-[12px] text-[#F5F0E6]/60">Products</dt>
              <dd className="mt-1 text-2xl text-white">{products.length}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-[#F5F0E6]/60">Women</dt>
              <dd className="mt-1 text-2xl text-white">{women}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-[#F5F0E6]/60">Men</dt>
              <dd className="mt-1 text-2xl text-white">{men}</dd>
            </div>
          </dl>
        </section>

        <section className="border border-line p-6">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink">Needs attention</h2>
          <ul className="mt-4 divide-y divide-line">
            {attention.map((a) =>
            <li key={a.label}>
                <Link to={a.to} className="flex items-center justify-between py-3.5 text-[14px] text-body hover:text-ink">
                  {a.label}
                  <span className={`text-lg ${a.count ? 'font-medium text-gold-ink' : 'text-muted'}`}>{a.count}</span>
                </Link>
              </li>
            )}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="border border-line p-6">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink">Recent activity</h2>
          {activity.length === 0 ?
          <p className="mt-4 text-[14px] text-muted">Activity from orders, requests and reservations will appear here.</p> :

          <ul className="mt-4 space-y-3">
              {activity.map((a, i) =>
            <li key={i} className="flex items-baseline justify-between gap-4 text-[14px]">
                  <Link to={a.to} className="truncate text-body hover:text-ink">
                    {a.text}
                  </Link>
                  <span className="shrink-0 text-[12px] text-muted">{formatDateTime(a.at)}</span>
                </li>
            )}
            </ul>
          }
        </section>
        <section className="border border-line p-6">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink">Reservations by branch</h2>
          <ul className="mt-5 space-y-4">
            {branch.map((b) => {
              const max = Math.max(1, ...branch.map((x) => x.count));
              return (
                <li key={b.name}>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-body">{b.name}</span>
                    <span className="text-ink">{b.count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-line">
                    <div className="h-full bg-gold" style={{ width: `${b.count / max * 100}%` }} />
                  </div>
                </li>);

            })}
          </ul>
        </section>
      </div>
    </div>);

}
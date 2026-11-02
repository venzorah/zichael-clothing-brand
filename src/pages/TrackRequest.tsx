import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { formatDate } from '../utils/format';
import { Button } from '../components/ui/Button';
import { Field, inputClass } from '../components/ui/Field';
import { StatusTimeline } from '../components/StatusTimeline';
import { QuotationView } from '../components/custom/QuotationView';

export function TrackRequest() {
  const [params] = useSearchParams();
  const { requests, reservations, orders, offices } = useStore();
  const [ref, setRef] = useState(params.get('ref') ?? '');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState<{ref: string;email: string;} | null>(null);

  const key = searched?.ref.trim().toUpperCase() ?? '';
  const mail = searched?.email.trim().toLowerCase() ?? '';
  // Reference + matching email are both required so no one can view another customer's details.
  const request = searched ? requests.find((r) => r.ref === key && r.contact.email.toLowerCase() === mail) : undefined;
  const reservation = searched ? reservations.find((r) => r.ref === key && r.email.toLowerCase() === mail) : undefined;
  const order = searched ? orders.find((o) => o.ref === key && o.customer.email.toLowerCase() === mail) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:py-20">
      <h1 className="font-display text-5xl text-ink">Track a request</h1>
      <p className="mt-3 text-[15px] text-muted">Enter your reference and the email you used. Works for custom requests, reservations and orders.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearched({ ref, email });
        }}
        className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        
        <Field label="Reference" htmlFor="t-ref">
          <input id="t-ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="HOZ-CR-…" className={`${inputClass} uppercase`} required />
        </Field>
        <Field label="Email" htmlFor="t-email">
          <input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        </Field>
        <Button type="submit">Track</Button>
      </form>

      {searched && !request && !reservation && !order &&
      <p role="status" className="mt-10 border-l-2 border-gold bg-ivory p-4 text-[15px] text-body">
          We couldn’t find a match. Check the reference and email, or{' '}
          <Link to="/contact" className="underline underline-offset-4">
            contact us
          </Link>
          .
        </p>
      }

      {request &&
      <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold-ink">Custom request</p>
            <h2 className="mt-2 font-display text-3xl text-ink">{request.clothingType}</h2>
            <p className="mt-1 text-[14px] text-muted">
              {request.gender === 'MEN' ? 'Zichael Men' : 'Zichael Woman'} · submitted {formatDate(request.createdAt)}
            </p>
            <div className="mt-8">
              <StatusTimeline history={request.history} />
            </div>
          </div>
          <QuotationView request={request} />
        </section>
      }

      {reservation &&
      <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold-ink">Showroom reservation</p>
          <h2 className="mt-2 font-display text-3xl text-ink">{offices.find((o) => o.id === reservation.officeId)?.name}</h2>
          <p className="mt-1 text-[14px] text-muted">
            {formatDate(reservation.date)} at {reservation.time}
          </p>
          <div className="mt-8">
            <StatusTimeline history={reservation.history} />
          </div>
        </section>
      }

      {order &&
      <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold-ink">Order</p>
          <h2 className="mt-2 font-display text-3xl text-ink">{order.fulfilment}</h2>
          <Link to={`/order/${order.ref}`} className="mt-4 inline-block border-b border-ink text-[12px] uppercase tracking-[0.16em] text-ink">
            View order details
          </Link>
        </section>
      }
    </div>);

}
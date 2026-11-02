import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { buttonClass } from '../components/ui/Button';

const nextSteps = [
'A stylist reviews your request and references — usually within 1–2 working days.',
'We contact you if anything needs clarifying, then prepare an itemised quotation.',
'Accept the quotation and pay securely to begin production.'];


export function CustomOrderSuccess() {
  const { ref } = useParams();
  const { requests } = useStore();
  const req = requests.find((r) => r.ref === ref);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 lg:py-24">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-soft text-gold-ink">
        <CheckIcon className="h-6 w-6" />
      </span>
      <h1 className="mt-6 font-display text-5xl leading-tight text-ink">Your request is with our atelier.</h1>
      <p className="mt-4 text-[16px] leading-relaxed text-body">
        Thank you{req ? `, ${req.contact.fullName.split(' ')[0]}` : ''}. Keep your request number to track progress.
      </p>
      <div className="mt-8 border border-line bg-ivory p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Request number</p>
        <p className="mt-2 font-mono text-2xl tracking-wider text-ink">{ref}</p>
        {req && <p className="mt-3 text-[14px] text-muted">A confirmation will be sent to {req.contact.email}.</p>}
      </div>
      <h2 className="mt-12 text-[12px] font-medium uppercase tracking-[0.18em] text-ink">What happens next</h2>
      <ol className="mt-5 space-y-4">
        {nextSteps.map((s, i) =>
        <li key={s} className="grid grid-cols-[28px_1fr] gap-3 text-[15px] text-body">
            <span className="font-display text-xl text-gold-ink">{i + 1}</span>
            {s}
          </li>
        )}
      </ol>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link to={`/track?ref=${ref}`} className={buttonClass('primary')}>
          Track this request
        </Link>
        <Link to="/" className={buttonClass('outline')}>
          Back to home
        </Link>
      </div>
    </div>);

}
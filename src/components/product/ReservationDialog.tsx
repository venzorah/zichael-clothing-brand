import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon, XIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { Product } from '../../types/catalog';
import { makeReference } from '../../utils/format';
import { Button } from '../ui/Button';
import { Field, inputClass, textareaClass } from '../ui/Field';

interface ReservationDialogProps {
  product?: Product;
  defaultSize?: string;
  defaultColour?: string;
  defaultOfficeId?: string;
  onClose: () => void;
}

const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export function ReservationDialog({ product, defaultSize, defaultColour, defaultOfficeId, onClose }: ReservationDialogProps) {
  const { offices, products, createReservation, user } = useStore();
  const activeOffices = offices.filter((o) => o.active);
  const [productId, setProductId] = useState(product?.id ?? '');
  const selected = useMemo(() => products.find((p) => p.id === productId), [products, productId]);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    officeId: defaultOfficeId ?? activeOffices[0]?.id ?? '',
    date: '',
    time: '',
    size: defaultSize ?? '',
    colour: defaultColour ?? '',
    qty: 1,
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doneRef, setDoneRef] = useState<string | null>(null);
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const set = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email.';
    if (form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Please enter a valid phone number.';
    if (!form.officeId) errs.officeId = 'Choose a showroom.';
    if (!form.date) errs.date = 'Choose a visit date.';
    if (!form.time) errs.time = 'Choose a time.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const ref = makeReference('RSV');
    createReservation({
      ref,
      createdAt: new Date().toISOString(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      productId: productId || undefined,
      size: form.size,
      colour: form.colour,
      qty: form.qty,
      officeId: form.officeId,
      date: form.date,
      time: form.time,
      notes: form.notes.trim(),
      status: 'Pending Confirmation',
      history: [{ status: 'Pending Confirmation', at: new Date().toISOString() }]
    });
    setDoneRef(ref);
  };

  const office = activeOffices.find((o) => o.id === form.officeId);

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reserve-title"
        className="pb-safe max-h-[92vh] w-full max-w-xl overflow-y-auto bg-bg"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}>
        
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg px-6 py-5">
          <h2 id="reserve-title" className="font-display text-3xl text-ink">
            {doneRef ? 'Reservation requested' : 'Reserve for a visit'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 text-muted hover:text-ink">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {doneRef ?
        <div className="px-6 py-8">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-soft text-gold-ink">
              <CheckIcon className="h-6 w-6" />
            </span>
            <p className="mt-5 text-[15px] leading-relaxed text-body">
              Your request has been sent to <strong className="text-ink">{office?.name}</strong>. Reference:
            </p>
            <p className="mt-2 font-mono text-xl tracking-wider text-ink">{doneRef}</p>
            <div className="mt-6 border-l-2 border-gold bg-ivory p-4 text-[14px] leading-relaxed text-body">
              Status: <strong className="text-ink">Pending confirmation.</strong> The showroom will check availability and confirm by email or phone. Your piece is not held until it is confirmed.
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={onClose}>Done</Button>
              <Link to="/account" className="inline-flex h-12 items-center border border-ink/70 px-7 text-[12px] font-medium uppercase tracking-[0.18em] text-ink">
                View in account
              </Link>
            </div>
          </div> :

        <form onSubmit={submit} noValidate className="grid gap-5 px-6 py-6 sm:grid-cols-2">
            {!product &&
          <Field label="Piece" htmlFor="r-product" optional className="sm:col-span-2">
                <select id="r-product" value={productId} onChange={(e) => setProductId(e.target.value)} className={inputClass}>
                  <option value="">General visit / consultation</option>
                  <optgroup label="Women">
                    {products.filter((p) => p.published && p.gender === 'WOMEN').map((p) =>
                <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                )}
                  </optgroup>
                  <optgroup label="Men">
                    {products.filter((p) => p.published && p.gender === 'MEN').map((p) =>
                <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                )}
                  </optgroup>
                </select>
              </Field>
          }
            {product &&
          <div className="flex items-center gap-4 sm:col-span-2">
                <img src={product.images[0].src} alt="" className="h-20 w-16 object-cover" />
                <div>
                  <p className="font-display text-xl text-ink">{product.name}</p>
                  <p className="text-[13px] text-muted">{product.sku}</p>
                </div>
              </div>
          }
            {selected &&
          <>
                <Field label="Size" htmlFor="r-size">
                  <select id="r-size" value={form.size} onChange={(e) => set('size', e.target.value)} className={inputClass}>
                    <option value="">To be measured</option>
                    {selected.sizes.map((s) =>
                <option key={s}>{s}</option>
                )}
                  </select>
                </Field>
                <Field label="Colour" htmlFor="r-colour">
                  <select id="r-colour" value={form.colour} onChange={(e) => set('colour', e.target.value)} className={inputClass}>
                    <option value="">Undecided</option>
                    {selected.colours.map((c) =>
                <option key={c.name}>{c.name}</option>
                )}
                  </select>
                </Field>
              </>
          }
            <Field label="Showroom" htmlFor="r-office" error={errors.officeId} className="sm:col-span-2">
              <select id="r-office" value={form.officeId} onChange={(e) => set('officeId', e.target.value)} className={inputClass}>
                {activeOffices.map((o) =>
              <option key={o.id} value={o.id}>
                    {o.name} — {o.city}
                  </option>
              )}
              </select>
            </Field>
            <Field label="Visit date" htmlFor="r-date" error={errors.date}>
              <input id="r-date" type="date" min={minDate} value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Preferred time" htmlFor="r-time" error={errors.time}>
              <select id="r-time" value={form.time} onChange={(e) => set('time', e.target.value)} className={inputClass}>
                <option value="">Select</option>
                {TIMES.map((t) =>
              <option key={t}>{t}</option>
              )}
              </select>
            </Field>
            <Field label="Full name" htmlFor="r-name" error={errors.name} className="sm:col-span-2">
              <input id="r-name" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" className={inputClass} />
            </Field>
            <Field label="Email" htmlFor="r-email" error={errors.email}>
              <input id="r-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" className={inputClass} />
            </Field>
            <Field label="Phone" htmlFor="r-phone" error={errors.phone}>
              <input id="r-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" className={inputClass} />
            </Field>
            <Field label="Notes" htmlFor="r-notes" optional className="sm:col-span-2">
              <textarea id="r-notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} className={`${textareaClass} min-h-[88px]`} placeholder="Occasion, fitting needs, who you’re bringing…" />
            </Field>
            <p className="text-[13px] leading-relaxed text-muted sm:col-span-2">A reservation is a request. The showroom confirms availability before your visit.</p>
            <Button type="submit" className="sm:col-span-2">
              Request reservation
            </Button>
          </form>
        }
      </motion.div>
    </motion.div>);

}
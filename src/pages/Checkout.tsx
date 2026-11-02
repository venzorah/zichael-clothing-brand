import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { nigerianStates, shippingMethods } from '../data/checkout';
import { usePersistentState } from '../hooks/usePersistentState';
import { formatPrice, makeReference } from '../utils/format';
import { discountAmount, priceCart } from '../utils/pricing';
import { OrderSummary } from '../components/OrderSummary';
import { Button, buttonClass } from '../components/ui/Button';
import { Field, inputClass } from '../components/ui/Field';

type Provider = 'Paystack' | 'Flutterwave';

export function Checkout() {
  const { cart, products, offices, user, placeOrder, clearCart } = useStore();
  const navigate = useNavigate();
  const [code, setCode] = usePersistentState('hoz.discount', '');
  const { lines, subtotal } = priceCart(cart, products);
  const discount = discountAmount(code, subtotal);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    line1: '',
    city: '',
    state: 'Lagos',
    method: 'standard',
    officeId: offices.find((o) => o.active)?.id ?? ''
  });
  const [provider, setProvider] = useState<Provider>('Paystack');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const method = shippingMethods.find((m) => m.id === form.method)!;
  const total = subtotal - discount + method.fee;
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const purchasable = lines.filter((l) => l.available);
  if (purchasable.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <h1 className="font-display text-4xl text-ink">Nothing to check out.</h1>
        <Link to="/cart" className={buttonClass('primary', 'md', 'mt-8')}>
          Back to bag
        </Link>
      </div>);

  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Enter a valid phone number.';
    if (form.method !== 'pickup') {
      if (form.line1.trim().length < 5) errs.line1 = 'Enter your street address.';
      if (form.city.trim().length < 2) errs.city = 'Enter your city.';
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const office = offices.find((o) => o.id === form.officeId);
    const ref = makeReference('ORD');
    placeOrder({
      ref,
      createdAt: new Date().toISOString(),
      customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
      address: form.method === 'pickup' && office ? { line1: `Collect: ${office.name}`, city: office.city, state: office.state } : { line1: form.line1.trim(), city: form.city.trim(), state: form.state },
      shippingMethod: method.label,
      shippingFee: method.fee,
      discount,
      subtotal,
      total,
      items: purchasable.map((l) => ({ ...l.item, name: l.product!.name, unitPrice: l.unit, image: l.product!.images[0].src })),
      paymentProvider: provider,
      paymentStatus: 'AWAITING_PAYMENT',
      fulfilment: 'Processing'
    });
    clearCart();
    setCode('');
    navigate(`/order/${ref}`);
  };

  const sectionTitle = (n: number, t: string) =>
  <h2 className="flex items-baseline gap-3 font-display text-3xl text-ink">
      <span className="text-xl text-gold-ink">{n}</span>
      {t}
    </h2>;


  return (
    <div className="mx-auto max-w-site px-5 py-12 lg:px-10 lg:py-16">
      <h1 className="font-display text-5xl text-ink">Checkout</h1>
      {!user &&
      <p className="mt-3 text-[14px] text-muted">
          Checking out as a guest.{' '}
          <Link to="/account" className="text-ink underline underline-offset-4">
            Sign in
          </Link>{' '}
          to track orders in your account.
        </p>
      }
      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px]">
        <div className="space-y-12">
          <section className="space-y-5">
            {sectionTitle(1, 'Contact')}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="c-name" error={errors.name} className="sm:col-span-2">
                <input id="c-name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Email" htmlFor="c-email" error={errors.email}>
                <input id="c-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Phone" htmlFor="c-phone" error={errors.phone}>
                <input id="c-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
              </Field>
            </div>
          </section>

          <section className="space-y-5">
            {sectionTitle(2, 'Delivery')}
            <div className="space-y-3" role="radiogroup" aria-label="Delivery method">
              {shippingMethods.map((m) =>
              <label key={m.id} className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors duration-150 ${form.method === m.id ? 'border-ink' : 'border-line hover:border-muted'}`}>
                  <input type="radio" name="method" checked={form.method === m.id} onChange={() => set('method', m.id)} className="h-4 w-4 accent-[#D4AF37]" />
                  <span className="flex-1">
                    <span className="block text-[15px] text-ink">{m.label}</span>
                    <span className="block text-[13px] text-muted">{m.detail}</span>
                  </span>
                  <span className="text-[15px] text-ink">{m.fee === 0 ? 'Free' : formatPrice(m.fee)}</span>
                </label>
              )}
            </div>
            {form.method === 'pickup' ?
            <Field label="Showroom" htmlFor="c-office">
                <select id="c-office" value={form.officeId} onChange={(e) => set('officeId', e.target.value)} className={inputClass}>
                  {offices.filter((o) => o.active && o.services.includes('Collections')).map((o) =>
                <option key={o.id} value={o.id}>
                      {o.name} — {o.address}, {o.city}
                    </option>
                )}
                </select>
              </Field> :

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Street address" htmlFor="c-line1" error={errors.line1} className="sm:col-span-2">
                  <input id="c-line1" autoComplete="street-address" value={form.line1} onChange={(e) => set('line1', e.target.value)} className={inputClass} />
                </Field>
                <Field label="City" htmlFor="c-city" error={errors.city}>
                  <input id="c-city" autoComplete="address-level2" value={form.city} onChange={(e) => set('city', e.target.value)} className={inputClass} />
                </Field>
                <Field label="State" htmlFor="c-state">
                  <select id="c-state" value={form.state} onChange={(e) => set('state', e.target.value)} className={inputClass}>
                    {nigerianStates.map((s) =>
                  <option key={s}>{s}</option>
                  )}
                  </select>
                </Field>
              </div>
            }
          </section>

          <section className="space-y-5">
            {sectionTitle(3, 'Payment')}
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment provider">
              {(
              [
              ['Paystack', 'Cards, bank transfer, USSD'],
              ['Flutterwave', 'Cards, mobile money, transfer']] as
              [Provider, string][]).
              map(([p, d]) =>
              <label key={p} className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors duration-150 ${provider === p ? 'border-ink' : 'border-line hover:border-muted'}`}>
                  <input type="radio" name="provider" checked={provider === p} onChange={() => setProvider(p)} className="h-4 w-4 accent-[#D4AF37]" />
                  <span>
                    <span className="block text-[15px] text-ink">{p}</span>
                    <span className="block text-[13px] text-muted">{d}</span>
                  </span>
                </label>
              )}
            </div>
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
              <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              You’ll complete payment on {provider}’s secure page. Your order is confirmed only after {provider} verifies the payment with our server.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary subtotal={subtotal} discount={discount} shipping={method.fee}>
            <ul className="mt-6 space-y-4 border-t border-line pt-6">
              {purchasable.map((l) =>
              <li key={l.item.key} className="flex gap-3">
                  <img src={l.product!.images[0].src} alt="" className="h-16 w-12 object-cover" />
                  <div className="min-w-0 flex-1 text-[14px]">
                    <p className="truncate text-ink">{l.product!.name}</p>
                    <p className="text-muted">
                      {l.item.size} · {l.item.colour} · ×{l.item.qty}
                    </p>
                  </div>
                  <p className="text-[14px] text-ink">{formatPrice(l.total)}</p>
                </li>
              )}
            </ul>
            <Button type="submit" variant="primary" size="lg" className="mt-6 w-full">
              Pay {formatPrice(total)}
            </Button>
          </OrderSummary>
        </aside>
      </form>
    </div>);

}
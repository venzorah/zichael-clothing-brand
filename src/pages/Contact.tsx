import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '../contexts/StoreContext';
import { Button } from '../components/ui/Button';
import { Field, inputClass, textareaClass } from '../components/ui/Field';

export function Contact() {
  const { offices } = useStore();
  const [form, setForm] = useState({ name: '', email: '', topic: 'General enquiry', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    document.title = 'Contact Us | House of Zichael';
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (form.message.trim().length < 10) errs.message = 'Please write a little more.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    toast.success('Message sent. We reply within one working day.');
    setForm({ name: '', email: '', topic: 'General enquiry', message: '' });
  };

  return (
    <div className="mx-auto grid max-w-site gap-16 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-24">
      <div>
        <h1 className="font-display text-5xl text-ink lg:text-6xl">Contact us</h1>
        <p className="mt-4 max-w-md text-[15px] text-muted">Questions about a piece, an order or a commission — our team is here.</p>
        <ul className="mt-12 space-y-8">
          {offices.filter((o) => o.active).map((o) =>
          <li key={o.id} className="border-t border-line pt-6">
              <h2 className="font-display text-2xl text-ink">{o.name}</h2>
              <p className="mt-1 text-[14px] text-muted">
                {o.address}, {o.city}
              </p>
              <p className="mt-3 text-[14px] text-body">
                <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="hover:text-gold-ink">
                  {o.phone}
                </a>
                <span className="mx-2 text-muted">·</span>
                <a href={`mailto:${o.email}`} className="hover:text-gold-ink">
                  {o.email}
                </a>
              </p>
            </li>
          )}
        </ul>
      </div>
      <form onSubmit={submit} noValidate className="space-y-5 bg-ivory p-6 lg:p-10">
        <Field label="Name" htmlFor="ct-name" error={errors.name}>
          <input id="ct-name" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="ct-email" error={errors.email}>
          <input id="ct-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" className={inputClass} />
        </Field>
        <Field label="Topic" htmlFor="ct-topic">
          <select id="ct-topic" value={form.topic} onChange={(e) => set('topic', e.target.value)} className={inputClass}>
            <option>General enquiry</option>
            <option>An existing order</option>
            <option>Custom design</option>
            <option>Showroom visit</option>
            <option>Press & partnerships</option>
          </select>
        </Field>
        <Field label="Message" htmlFor="ct-msg" error={errors.message}>
          <textarea id="ct-msg" value={form.message} onChange={(e) => set('message', e.target.value)} className={`${textareaClass} min-h-[180px]`} />
        </Field>
        <Button type="submit" size="lg" className="w-full">
          Send message
        </Button>
      </form>
    </div>);

}
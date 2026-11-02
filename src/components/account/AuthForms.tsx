import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

export function AuthForms() {
  const { signIn } = useStore();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (form.password.length < 8) errs.password = 'At least 8 characters.';
    if (mode === 'register') {
      if (form.name.trim().length < 2) errs.name = 'Enter your full name.';
      if (form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Enter a valid phone number.';
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const name = mode === 'register' ? form.name.trim() : form.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    signIn({ name, email: form.email.trim().toLowerCase(), phone: form.phone.trim() });
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16 lg:py-24">
      <h1 className="font-display text-5xl text-ink">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
      <p className="mt-3 text-[15px] text-muted">Track orders, custom requests, quotations and showroom reservations in one place.</p>
      <div role="tablist" className="mt-8 grid grid-cols-2 border border-line p-1">
        {(['signin', 'register'] as const).map((m) =>
        <button
          key={m}
          role="tab"
          aria-selected={mode === m}
          onClick={() => {
            setMode(m);
            setErrors({});
          }}
          className={`h-10 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-150 ${mode === m ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}>
          
            {m === 'signin' ? 'Sign in' : 'Register'}
          </button>
        )}
      </div>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        {mode === 'register' &&
        <Field label="Full name" htmlFor="a-name" error={errors.name}>
            <input id="a-name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
          </Field>
        }
        <Field label="Email" htmlFor="a-email" error={errors.email}>
          <input id="a-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
        </Field>
        {mode === 'register' &&
        <Field label="Phone" htmlFor="a-phone" error={errors.phone}>
            <input id="a-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
          </Field>
        }
        <Field label="Password" htmlFor="a-pass" error={errors.password}>
          <input id="a-pass" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={form.password} onChange={(e) => set('password', e.target.value)} className={inputClass} />
        </Field>
        <Button type="submit" size="lg" className="w-full">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-center text-[13px] text-muted">An account is never required to browse or buy.</p>
    </div>);

}
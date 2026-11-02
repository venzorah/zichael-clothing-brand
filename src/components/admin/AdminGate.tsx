import React, { useState } from 'react';
import { Logo } from '../Logo';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

export interface AdminAccount {
  name: string;
  email: string;
  hash: string;
}

interface AdminGateProps {
  account: AdminAccount | null;
  onSetup: (a: AdminAccount) => void;
  onLogin: (email: string) => void;
}

export async function hashPassword(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).
  map((b) => b.toString(16).padStart(2, '0')).
  join('');
}

export function AdminGate({ account, onSetup, onLogin }: AdminGateProps) {
  const setup = !account;
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const email = form.email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email.');
    if (setup) {
      if (form.name.trim().length < 2) return setError('Enter your name.');
      if (form.password.length < 12) return setError('Use at least 12 characters for the Super Administrator password.');
      if (form.password !== form.confirm) return setError('Passwords do not match.');
      onSetup({ name: form.name.trim(), email, hash: await hashPassword(form.password) });
      onLogin(email);
      return;
    }
    if (email !== account!.email || (await hashPassword(form.password)) !== account!.hash) return setError('Incorrect email or password.');
    onLogin(email);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ivory px-5 py-12">
      <div className="w-full max-w-md bg-surface p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] lg:p-10">
        <Logo className="h-10" />
        <h1 className="mt-8 font-display text-4xl text-ink">{setup ? 'Set up the Super Administrator' : 'Admin sign in'}</h1>
        <p className="mt-2 text-[14px] text-muted">
          {setup ? 'First-time setup. This account will manage staff, products, orders and showrooms. No default credentials exist.' : 'Authorised House of Zichael staff only.'}
        </p>
        <form onSubmit={submit} noValidate className="mt-8 space-y-5">
          {setup &&
          <Field label="Full name" htmlFor="ad-name">
              <input id="ad-name" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
            </Field>
          }
          <Field label="Email" htmlFor="ad-email">
            <input id="ad-email" type="email" autoComplete="username" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Password" htmlFor="ad-pass">
            <input id="ad-pass" type="password" autoComplete={setup ? 'new-password' : 'current-password'} value={form.password} onChange={(e) => set('password', e.target.value)} className={inputClass} />
          </Field>
          {setup &&
          <Field label="Confirm password" htmlFor="ad-confirm">
              <input id="ad-confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} className={inputClass} />
            </Field>
          }
          {error &&
          <p role="alert" className="text-[13px] text-red-700 dark:text-red-400">
              {error}
            </p>
          }
          <Button type="submit" size="lg" className="w-full">
            {setup ? 'Create & continue' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>);

}
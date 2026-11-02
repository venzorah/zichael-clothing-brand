import React, { useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { Office, OfficeService } from '../../types/catalog';
import { Button } from '../ui/Button';
import { Field, inputClass, textareaClass } from '../ui/Field';
import { Toggle } from '../ui/Toggle';

const SERVICES: OfficeService[] = ['Purchases', 'Fittings', 'Consultations', 'Collections'];

const blank = (): Office => ({
  id: `off-${Date.now().toString(36)}`,
  name: '',
  address: '',
  city: '',
  state: '',
  country: 'Nigeria',
  lat: 0,
  lng: 0,
  phone: '',
  whatsapp: '',
  email: '',
  hours: [{ label: 'Mon – Fri', hours: '9:00 – 18:00' }],
  services: ['Purchases', 'Fittings'],
  image: '',
  active: true
});

export function AdminOffices() {
  const { offices, saveOffice } = useStore();
  const [editing, setEditing] = useState<Office | null>(null);
  const [hoursText, setHoursText] = useState('');

  const startEdit = (o: Office) => {
    setEditing(o);
    setHoursText(o.hours.map((h) => `${h.label} | ${h.hours}`).join('\n'));
  };

  const set = <K extends keyof Office,>(k: K, v: Office[K]) => setEditing((e) => e ? { ...e, [k]: v } : e);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.name.trim() || !editing.address.trim() || !editing.city.trim()) return toast.error('Name, address and city are required.');
    if (editing.lat < -90 || editing.lat > 90 || editing.lng < -180 || editing.lng > 180 || editing.lat === 0 && editing.lng === 0)
    return toast.error('Enter the verified latitude and longitude for this office.');
    const hours = hoursText.
    split('\n').
    map((l) => l.split('|').map((s) => s.trim())).
    filter(([a, b]) => a && b).
    map(([label, hours]) => ({ label, hours }));
    saveOffice({ ...editing, hours });
    toast.success('Office saved');
    setEditing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Offices</h1>
          <p className="mt-1 text-[14px] text-muted">Active offices appear on the Showrooms map, checkout collection and reservation forms.</p>
        </div>
        <Button onClick={() => startEdit(blank())}>Add office</Button>
      </div>

      <ul className="mt-8 grid gap-4 lg:grid-cols-2">
        {offices.map((o) =>
        <li key={o.id} className="flex gap-4 border border-line p-4">
            {o.image ? <img src={o.image} alt="" className="h-24 w-20 shrink-0 object-cover" /> : <div className="h-24 w-20 shrink-0 bg-ivory" />}
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl text-ink">{o.name}</p>
              <p className="text-[13px] text-muted">
                {o.address}, {o.city}, {o.state}
              </p>
              <p className="mt-1 font-mono text-[12px] text-muted">
                {o.lat.toFixed(4)}, {o.lng.toFixed(4)}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <label className="flex items-center gap-2 text-[13px] text-body">
                  <Toggle checked={o.active} onChange={(v) => saveOffice({ ...o, active: v })} label={`${o.name} active`} />
                  {o.active ? 'Active' : 'Inactive'}
                </label>
                <button onClick={() => startEdit(o)} className="text-[13px] text-gold-ink underline-offset-4 hover:underline">
                  Edit
                </button>
              </div>
            </div>
          </li>
        )}
      </ul>

      {editing &&
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto bg-bg p-6 lg:p-8" aria-label="Office details">
            <h2 className="font-display text-3xl text-ink">{offices.some((o) => o.id === editing.id) ? 'Edit office' : 'New office'}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Office name" htmlFor="o-name" className="sm:col-span-2">
                <input id="o-name" value={editing.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Street address" htmlFor="o-addr" className="sm:col-span-2">
                <input id="o-addr" value={editing.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
              </Field>
              <Field label="City" htmlFor="o-city">
                <input id="o-city" value={editing.city} onChange={(e) => set('city', e.target.value)} className={inputClass} />
              </Field>
              <Field label="State" htmlFor="o-state">
                <input id="o-state" value={editing.state} onChange={(e) => set('state', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Latitude" htmlFor="o-lat">
                <input id="o-lat" type="number" step="any" value={editing.lat || ''} onChange={(e) => set('lat', Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Longitude" htmlFor="o-lng">
                <input id="o-lng" type="number" step="any" value={editing.lng || ''} onChange={(e) => set('lng', Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Phone" htmlFor="o-phone">
                <input id="o-phone" value={editing.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
              </Field>
              <Field label="WhatsApp (digits)" htmlFor="o-wa">
                <input id="o-wa" value={editing.whatsapp} onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, ''))} className={inputClass} />
              </Field>
              <Field label="Email" htmlFor="o-email" className="sm:col-span-2">
                <input id="o-email" type="email" value={editing.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Photo URL" htmlFor="o-img" hint="Uploaded office photographs are hosted on Cloudinary." className="sm:col-span-2">
                <input id="o-img" value={editing.image} onChange={(e) => set('image', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Opening hours" htmlFor="o-hours" hint="One per line: Days | Hours" className="sm:col-span-2">
                <textarea id="o-hours" value={hoursText} onChange={(e) => setHoursText(e.target.value)} className={`${textareaClass} min-h-[96px]`} />
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink">Services</legend>
                <div className="flex flex-wrap gap-4">
                  {SERVICES.map((s) =>
                <label key={s} className="flex items-center gap-2 text-[14px] text-body">
                      <input
                    type="checkbox"
                    checked={editing.services.includes(s)}
                    onChange={(e) => set('services', e.target.checked ? [...editing.services, s] : editing.services.filter((x) => x !== s))}
                    className="h-4 w-4 accent-[#D4AF37]" />
                  
                      {s}
                    </label>
                )}
                </div>
              </fieldset>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit">Save office</Button>
            </div>
          </form>
        </div>
      }
    </div>);

}
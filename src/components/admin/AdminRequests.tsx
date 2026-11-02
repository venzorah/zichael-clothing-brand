import React, { useState } from 'react';
import { FileIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { staffRoles } from '../../data/staff';
import { Gender } from '../../types/catalog';
import { REQUEST_STATUSES, RequestStatus } from '../../types/commerce';
import { formatBytes, formatDate, formatDateTime } from '../../utils/format';
import { StatusTimeline } from '../StatusTimeline';
import { Button } from '../ui/Button';
import { QuotationBuilder } from './QuotationBuilder';

const select = 'h-10 border border-line bg-surface px-3 text-[14px] text-ink focus:border-ink focus:outline-none';

export function AdminRequests() {
  const { requests, updateRequest, products } = useStore();
  const [q, setQ] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [status, setStatus] = useState<RequestStatus | ''>('');
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const list = requests.filter(
    (r) =>
    (!gender || r.gender === gender) && (
    !status || r.status === status) &&
    `${r.ref} ${r.contact.fullName} ${r.contact.email}`.toLowerCase().includes(q.toLowerCase())
  );
  const r = requests.find((x) => x.ref === selected);
  const basedOn = r?.basedOn ? products.find((p) => p.id === r.basedOn) : undefined;

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">Custom requests</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customer or request no." aria-label="Search requests" className={`${select} w-64`} />
        <select value={gender} onChange={(e) => setGender(e.target.value as Gender | '')} aria-label="Filter by collection" className={select}>
          <option value="">All collections</option>
          <option value="WOMEN">Women</option>
          <option value="MEN">Men</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as RequestStatus | '')} aria-label="Filter by status" className={select}>
          <option value="">All statuses</option>
          {REQUEST_STATUSES.map((s) =>
          <option key={s}>{s}</option>
          )}
        </select>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <ul className="max-h-[75vh] divide-y divide-line overflow-y-auto border border-line">
          {list.length === 0 && <li className="p-6 text-[14px] text-muted">No requests match. New submissions from the custom design form appear here.</li>}
          {list.map((x) =>
          <li key={x.ref}>
              <button onClick={() => setSelected(x.ref)} className={`w-full p-4 text-left transition-colors duration-150 ${selected === x.ref ? 'bg-ivory' : 'hover:bg-ivory/60'}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-[15px] text-ink">{x.contact.fullName}</p>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-muted">{x.gender === 'MEN' ? 'Men' : 'Women'}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-muted">
                  {x.clothingType} · {formatDate(x.createdAt)}
                </p>
                <p className={`mt-2 inline-block px-2 py-0.5 text-[11px] ${x.status === 'New Request' ? 'bg-gold text-luxe' : 'bg-ivory text-ink'}`}>{x.status}</p>
              </button>
            </li>
          )}
        </ul>

        {r ?
        <article className="space-y-8 border border-line p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[13px] text-muted">{r.ref}</p>
                <h2 className="mt-1 font-display text-3xl text-ink">
                  {r.clothingType} for {r.contact.fullName}
                </h2>
                <p className="mt-1 text-[14px] text-muted">
                  {r.contact.email} · {r.contact.phone}
                  {r.contact.whatsapp ? ` · WhatsApp ${r.contact.whatsapp}` : ''} · prefers {r.contact.preferredContact}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select value={r.status} onChange={(e) => updateRequest(r.ref, { status: e.target.value as RequestStatus })} aria-label="Status" className={select}>
                  {REQUEST_STATUSES.map((s) =>
                <option key={s}>{s}</option>
                )}
                </select>
                <select value={r.assignee ?? ''} onChange={(e) => updateRequest(r.ref, { assignee: e.target.value || undefined })} aria-label="Assign to" className={select}>
                  <option value="">Unassigned</option>
                  {staffRoles.map((s) =>
                <option key={s}>{s}</option>
                )}
                </select>
              </div>
            </div>

            <dl className="grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-[160px_1fr]">
              {(
            [
            ['Description', r.description],
            ['Based on', basedOn ? `${basedOn.name} (${basedOn.sku})` : '—'],
            ['Occasion', r.occasion || '—'],
            ['Fabric / colour', `${r.fabric || '—'} / ${r.colour || '—'}`],
            ['Size', r.size || '—'],
            ['Measurements', r.measurements || 'To be taken at fitting'],
            ['Quantity', String(r.quantity)],
            ['Needed by', r.completionDate ? formatDate(r.completionDate) : 'Flexible'],
            ['Budget', r.budget || 'Not given'],
            ['Instructions', r.instructions || '—']] as
            [string, string][]).
            map(([k, v]) =>
            <React.Fragment key={k}>
                  <dt className="text-muted">{k}</dt>
                  <dd className="whitespace-pre-line text-ink">{v}</dd>
                </React.Fragment>
            )}
            </dl>

            <section>
              <h3 className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink">Reference files ({r.files.length})</h3>
              {r.files.length === 0 ?
            <p className="mt-2 text-[14px] text-muted">No files uploaded.</p> :

            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {r.files.map((f) =>
              <li key={f.name} className="flex items-center gap-3 border border-line p-3 text-[13px]">
                      <FileIcon className="h-4 w-4 shrink-0 text-gold-ink" />
                      <span className="min-w-0 flex-1 truncate text-ink">{f.name}</span>
                      <span className="text-muted">{formatBytes(f.size)}</span>
                    </li>
              )}
                </ul>
            }
              <p className="mt-2 text-[12px] text-muted">Files are stored privately and opened through expiring links.</p>
            </section>

            <section>
              <h3 className="mb-3 text-[12px] font-medium uppercase tracking-[0.16em] text-ink">Quotation</h3>
              <QuotationBuilder key={r.ref} request={r} />
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
              <section>
                <h3 className="mb-4 text-[12px] font-medium uppercase tracking-[0.16em] text-ink">Status history</h3>
                <StatusTimeline history={r.history} />
              </section>
              <section>
                <h3 className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink">Internal notes</h3>
                <ul className="mt-3 space-y-3">
                  {r.notes.map((n) =>
                <li key={n.at} className="bg-ivory p-3 text-[14px] text-body">
                      {n.text}
                      <p className="mt-1 text-[12px] text-muted">{formatDateTime(n.at)}</p>
                    </li>
                )}
                </ul>
                <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!note.trim()) return;
                  updateRequest(r.ref, { notes: [...r.notes, { text: note.trim(), at: new Date().toISOString() }] });
                  setNote('');
                }}
                className="mt-3 flex gap-2">
                
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the team" aria-label="Internal note" className={`${select} flex-1`} />
                  <Button type="submit" size="sm">
                    Add
                  </Button>
                </form>
              </section>
            </div>
          </article> :

        <div className="hidden place-items-center border border-dashed border-line p-10 text-[14px] text-muted xl:grid">Select a request to review it.</div>
        }
      </div>
    </div>);

}
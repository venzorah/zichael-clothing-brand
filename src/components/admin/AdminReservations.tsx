import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { RESERVATION_STATUSES, ReservationStatus } from '../../types/commerce';
import { formatDate } from '../../utils/format';

const select = 'h-10 border border-line bg-surface px-3 text-[14px] text-ink focus:border-ink focus:outline-none';

export function AdminReservations() {
  const { reservations, updateReservation, offices, products } = useStore();
  const [office, setOffice] = useState('');
  const list = reservations.filter((r) => !office || r.officeId === office);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Reservations</h1>
          <p className="mt-1 text-[14px] text-muted">Confirm only after verifying stock at the branch. Customers are notified on every status change.</p>
        </div>
        <select value={office} onChange={(e) => setOffice(e.target.value)} aria-label="Filter by branch" className={select}>
          <option value="">All branches</option>
          {offices.map((o) =>
          <option key={o.id} value={o.id}>
              {o.name}
            </option>
          )}
        </select>
      </div>
      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full min-w-[900px] text-[14px]">
          <thead className="bg-ivory text-left text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Piece</th>
              <th className="px-4 py-3 font-medium">Branch & visit</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.length === 0 &&
            <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No reservations yet.
                </td>
              </tr>
            }
            {list.map((r) => {
              const p = products.find((x) => x.id === r.productId);
              return (
                <tr key={r.ref}>
                  <td className="px-4 py-3 font-mono text-[13px] text-ink">{r.ref}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{r.name}</p>
                    <p className="text-[12px] text-muted">
                      {r.phone} · {r.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{p ? p.name : 'Consultation'}</p>
                    {p &&
                    <p className="text-[12px] text-muted">
                        {r.size || 'Size TBC'} · {r.colour || 'Colour TBC'} · ×{r.qty}
                      </p>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{offices.find((o) => o.id === r.officeId)?.name}</p>
                    <p className="text-[12px] text-muted">
                      {formatDate(r.date)} · {r.time}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <select value={r.status} onChange={(e) => updateReservation(r.ref, { status: e.target.value as ReservationStatus })} aria-label={`Status for ${r.ref}`} className={select}>
                      {RESERVATION_STATUSES.map((s) =>
                      <option key={s}>{s}</option>
                      )}
                    </select>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

}
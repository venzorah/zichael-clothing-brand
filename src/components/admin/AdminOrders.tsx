import React from 'react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { FulfilmentStatus, PaymentStatus } from '../../types/commerce';
import { formatDate, formatPrice } from '../../utils/format';

const select = 'h-9 border border-line bg-surface px-2 text-[13px] text-ink focus:border-ink focus:outline-none';
const fulfilment: FulfilmentStatus[] = ['Processing', 'In Production', 'Shipped', 'Ready for Pickup', 'Delivered', 'Cancelled'];
const payment: {value: PaymentStatus;label: string;}[] = [
{ value: 'AWAITING_PAYMENT', label: 'Awaiting payment' },
{ value: 'PAID', label: 'Paid (verified)' },
{ value: 'FAILED', label: 'Failed' }];


export function AdminOrders() {
  const { orders, updateOrder } = useStore();

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">Orders & payments</h1>
      <p className="mt-1 max-w-2xl text-[14px] text-muted">
        Payment status is set automatically by the Paystack/Flutterwave webhook once the backend is connected. Only record a payment manually after confirming it in the provider dashboard.
      </p>
      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full min-w-[960px] text-[14px]">
          <thead className="bg-ivory text-left text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Delivery</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Fulfilment</th>
              <th className="px-4 py-3 font-medium">Tracking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.length === 0 &&
            <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No orders yet.
                </td>
              </tr>
            }
            {orders.map((o) =>
            <tr key={o.ref}>
                <td className="px-4 py-3">
                  <p className="font-mono text-[13px] text-ink">{o.ref}</p>
                  <p className="text-[12px] text-muted">
                    {formatDate(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? 's' : ''}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-ink">{o.customer.name}</p>
                  <p className="text-[12px] text-muted">{o.customer.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-ink">{o.shippingMethod}</p>
                  <p className="text-[12px] text-muted">{[o.address.line1, o.address.city, o.address.state].filter(Boolean).join(', ')}</p>
                </td>
                <td className="px-4 py-3 text-right text-ink">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                  value={o.paymentStatus}
                  aria-label={`Payment status for ${o.ref}`}
                  onChange={(e) => {
                    const v = e.target.value as PaymentStatus;
                    if (v === 'PAID' && !window.confirm(`Confirm you have verified ${formatPrice(o.total)} for ${o.ref} in the ${o.paymentProvider} dashboard?`)) return;
                    updateOrder(o.ref, { paymentStatus: v });
                    toast.success('Payment status updated');
                  }}
                  className={select}>
                  
                    {payment.map((p) =>
                  <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                  )}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select value={o.fulfilment} onChange={(e) => updateOrder(o.ref, { fulfilment: e.target.value as FulfilmentStatus })} aria-label={`Fulfilment for ${o.ref}`} className={select}>
                    {fulfilment.map((f) =>
                  <option key={f}>{f}</option>
                  )}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                  defaultValue={o.trackingNumber ?? ''}
                  placeholder="Add number"
                  aria-label={`Tracking number for ${o.ref}`}
                  onBlur={(e) => e.target.value !== (o.trackingNumber ?? '') && updateOrder(o.ref, { trackingNumber: e.target.value.trim() || undefined })}
                  className={`${select} w-32`} />
                
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}
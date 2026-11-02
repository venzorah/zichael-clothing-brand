import React from 'react';
import { formatPrice } from '../utils/format';
import { vatIncluded } from '../utils/pricing';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number | null;
  children?: React.ReactNode;
}

export function OrderSummary({ subtotal, discount, shipping, children }: OrderSummaryProps) {
  const total = subtotal - discount + (shipping ?? 0);
  const row = (label: string, value: string, muted = false) =>
  <div className="flex justify-between text-[15px]">
      <dt className={muted ? 'text-muted' : 'text-body'}>{label}</dt>
      <dd className={muted ? 'text-muted' : 'text-ink'}>{value}</dd>
    </div>;

  return (
    <div className="bg-ivory p-6 lg:p-8">
      <h2 className="font-display text-3xl text-ink">Summary</h2>
      <dl className="mt-6 space-y-3">
        {row('Subtotal', formatPrice(subtotal))}
        {discount > 0 && row('Discount', `− ${formatPrice(discount)}`)}
        {row('Delivery', shipping === null ? 'Calculated at checkout' : shipping === 0 ? 'Free' : formatPrice(shipping), shipping === null)}
      </dl>
      <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
        <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink">Total</span>
        <span className="text-2xl font-medium text-ink">{formatPrice(total)}</span>
      </div>
      <p className="mt-1 text-right text-[12px] text-muted">Includes VAT of {formatPrice(vatIncluded(total))}</p>
      {children}
    </div>);

}
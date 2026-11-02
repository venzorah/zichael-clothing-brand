import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckIcon, ClockIcon, XIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { formatDate, formatPrice } from '../utils/format';
import { buttonClass } from '../components/ui/Button';

export function OrderStatus() {
  const { ref } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.ref === ref);

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <h1 className="font-display text-4xl text-ink">Order not found</h1>
        <p className="mt-3 text-muted">Check the reference in your confirmation email.</p>
        <Link to="/track" className={buttonClass('primary', 'md', 'mt-8')}>
          Track by reference
        </Link>
      </div>);

  }

  const state = {
    AWAITING_PAYMENT: {
      icon: ClockIcon,
      title: 'Awaiting payment verification',
      body: `We’ve recorded your order. It will be confirmed as soon as ${order.paymentProvider} verifies your payment — you’ll receive an email at ${order.customer.email}.`,
      tone: 'bg-gold-soft text-gold-ink'
    },
    PAID: { icon: CheckIcon, title: 'Payment verified — thank you', body: 'Your order is confirmed and with our atelier. We’ll email you at each stage.', tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    FAILED: { icon: XIcon, title: 'Payment was not completed', body: 'No money has been taken. You can return to your bag and try again, or contact us for help.', tone: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' }
  }[order.paymentStatus];
  const Icon = state.icon;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:py-20">
      <span className={`grid h-14 w-14 place-items-center rounded-full ${state.tone}`}>
        <Icon className="h-6 w-6" />
      </span>
      <h1 className="mt-6 font-display text-5xl leading-tight text-ink">{state.title}</h1>
      <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-body">{state.body}</p>
      <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-4">
        {[
        ['Order', order.ref],
        ['Placed', formatDate(order.createdAt)],
        ['Delivery', order.shippingMethod],
        ['Fulfilment', order.fulfilment]].
        map(([k, v]) =>
        <div key={k}>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">{k}</dt>
            <dd className="mt-1 break-words text-[14px] text-ink">{v}</dd>
          </div>
        )}
      </dl>
      <ul className="divide-y divide-line">
        {order.items.map((i) =>
        <li key={i.key} className="flex items-center gap-4 py-4">
            <img src={i.image} alt="" className="h-20 w-16 object-cover" />
            <div className="flex-1">
              <p className="font-display text-xl text-ink">{i.name}</p>
              <p className="text-[13px] text-muted">
                {i.size} · {i.colour} · ×{i.qty}
              </p>
            </div>
            <p className="text-[15px] text-ink">{formatPrice(i.unitPrice * i.qty)}</p>
          </li>
        )}
      </ul>
      <div className="flex justify-between border-t border-line pt-5 text-[16px]">
        <span className="text-muted">Total ({order.shippingFee === 0 ? 'free delivery' : `incl. ${formatPrice(order.shippingFee)} delivery`})</span>
        <span className="font-medium text-ink">{formatPrice(order.total)}</span>
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/account" className={buttonClass('primary')}>
          View my orders
        </Link>
        <Link to={order.paymentStatus === 'FAILED' ? '/cart' : '/'} className={buttonClass('outline')}>
          {order.paymentStatus === 'FAILED' ? 'Return to bag' : 'Continue shopping'}
        </Link>
      </div>
    </div>);

}
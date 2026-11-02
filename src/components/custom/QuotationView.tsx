import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { CustomRequest } from '../../types/commerce';
import { formatDate, formatPrice, makeReference } from '../../utils/format';
import { Button } from '../ui/Button';

interface QuotationViewProps {
  request: CustomRequest;
}

export function QuotationView({ request }: QuotationViewProps) {
  const { updateRequest, placeOrder, orders } = useStore();
  const navigate = useNavigate();
  const q = request.quotation;
  if (!q || !q.sentAt) return null;
  const expired = new Date(q.validUntil) < new Date();
  const existingOrder = orders.find((o) => o.items.some((i) => i.productId === `quote:${request.ref}`));

  const accept = () => {
    updateRequest(request.ref, { quotation: { ...q, response: 'Accepted' }, status: 'Approved' }, 'Customer accepted quotation');
    const ref = makeReference('ORD');
    placeOrder({
      ref,
      createdAt: new Date().toISOString(),
      customer: { name: request.contact.fullName, email: request.contact.email, phone: request.contact.phone },
      address: { line1: 'To be confirmed with stylist', city: '', state: '' },
      shippingMethod: 'Bespoke delivery',
      shippingFee: q.delivery,
      discount: q.discount,
      subtotal: q.total - q.delivery + q.discount,
      total: q.total,
      items: [{ key: request.ref, productId: `quote:${request.ref}`, size: request.size || 'Bespoke', colour: request.colour || '—', qty: 1, name: `Custom ${request.clothingType} (${request.ref})`, unitPrice: q.total - q.delivery + q.discount, image: "/House_of_Zichael_Male_(14).jpg" }],
      paymentProvider: 'Paystack',
      paymentStatus: 'AWAITING_PAYMENT',
      fulfilment: 'In Production'
    });
    navigate(`/order/${ref}`);
  };

  return (
    <section className="border border-gold/60 bg-surface p-6" aria-label="Quotation">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl text-ink">Your quotation</h3>
        <p className="text-[12px] text-muted">Valid until {formatDate(q.validUntil)}</p>
      </div>
      <table className="mt-5 w-full text-[14px]">
        <tbody className="divide-y divide-line">
          {q.lines.map((l, i) =>
          <tr key={i}>
              <td className="py-2.5 pr-3 text-body">
                {l.description} <span className="text-muted">× {l.qty}</span>
              </td>
              <td className="py-2.5 text-right text-ink">{formatPrice(l.qty * l.unitPrice)}</td>
            </tr>
          )}
          {q.fabricCost > 0 &&
          <tr>
              <td className="py-2.5 text-body">Fabric</td>
              <td className="py-2.5 text-right text-ink">{formatPrice(q.fabricCost)}</td>
            </tr>
          }
          {q.customisationFee > 0 &&
          <tr>
              <td className="py-2.5 text-body">Customisation</td>
              <td className="py-2.5 text-right text-ink">{formatPrice(q.customisationFee)}</td>
            </tr>
          }
          <tr>
            <td className="py-2.5 text-body">Delivery</td>
            <td className="py-2.5 text-right text-ink">{q.delivery ? formatPrice(q.delivery) : 'Free'}</td>
          </tr>
          {q.discount > 0 &&
          <tr>
              <td className="py-2.5 text-body">Discount</td>
              <td className="py-2.5 text-right text-ink">− {formatPrice(q.discount)}</td>
            </tr>
          }
        </tbody>
      </table>
      <div className="mt-3 flex items-baseline justify-between border-t border-ink pt-3">
        <span className="text-[12px] uppercase tracking-[0.16em] text-ink">Total</span>
        <span className="text-xl font-medium text-ink">{formatPrice(q.total)}</span>
      </div>
      {q.conditions && <p className="mt-4 text-[13px] leading-relaxed text-muted">{q.conditions}</p>}

      {q.response ?
      <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-body">
          You {q.response === 'Accepted' ? 'accepted' : q.response === 'Rejected' ? 'declined' : 'asked about'} this quotation.
          {q.response === 'Accepted' && existingOrder && existingOrder.paymentStatus !== 'PAID' &&
        <Button size="sm" onClick={() => navigate(`/order/${existingOrder.ref}`)}>
              View payment status
            </Button>
        }
        </div> :
      expired ?
      <p className="mt-6 text-[14px] text-red-700 dark:text-red-400">This quotation has expired. Contact us for an updated quote.</p> :

      <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="gold" onClick={accept}>
            Accept & pay
          </Button>
          <Button
          variant="outline"
          onClick={() => {
            updateRequest(request.ref, { quotation: { ...q, response: 'Clarification requested' }, status: 'Awaiting Clarification' }, 'Customer requested clarification');
            toast.success('Our stylist will contact you shortly.');
          }}>
          
            Ask a question
          </Button>
          <Button
          variant="ghost"
          onClick={() => {
            updateRequest(request.ref, { quotation: { ...q, response: 'Rejected' }, status: 'Under Review' }, 'Customer declined quotation');
            toast('Quotation declined. We’ll be in touch with alternatives.');
          }}>
          
            Decline
          </Button>
        </div>
      }
    </section>);

}
import React, { useState } from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { CustomRequest, QuotationLine } from '../../types/commerce';
import { formatPrice } from '../../utils/format';
import { Button } from '../ui/Button';

interface QuotationBuilderProps {
  request: CustomRequest;
}

const num = 'h-9 w-full border border-line bg-surface px-2 text-[14px] text-ink focus:border-ink focus:outline-none';

export function QuotationBuilder({ request }: QuotationBuilderProps) {
  const { updateRequest } = useStore();
  const existing = request.quotation;
  const [lines, setLines] = useState<QuotationLine[]>(existing?.lines ?? [{ description: `${request.clothingType} — bespoke`, qty: request.quantity, unitPrice: 0 }]);
  const [fees, setFees] = useState({
    fabricCost: existing?.fabricCost ?? 0,
    customisationFee: existing?.customisationFee ?? 0,
    delivery: existing?.delivery ?? 0,
    discount: existing?.discount ?? 0
  });
  const [validDays, setValidDays] = useState(14);
  const [conditions, setConditions] = useState(existing?.conditions ?? '70% deposit to begin production; balance due before delivery. One complimentary fitting included.');

  const itemsTotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const total = Math.max(0, itemsTotal + fees.fabricCost + fees.customisationFee + fees.delivery - fees.discount);
  const locked = !!existing?.sentAt;

  const save = (send: boolean) => {
    if (total <= 0 || lines.some((l) => !l.description.trim() || l.qty < 1)) {
      toast.error('Complete every line and enter a total above zero.');
      return;
    }
    const quotation = {
      lines,
      ...fees,
      total,
      validUntil: new Date(Date.now() + validDays * 86400000).toISOString(),
      conditions,
      sentAt: send ? new Date().toISOString() : undefined
    };
    updateRequest(request.ref, { quotation, status: send ? 'Quotation Sent' : 'Quotation Prepared' }, send ? `Quotation ${formatPrice(total)} sent` : 'Quotation drafted');
    toast.success(send ? `Quotation sent to ${request.contact.email}` : 'Quotation saved as draft');
  };

  if (locked) {
    return (
      <div className="border border-line p-5 text-[14px]">
        <p className="text-ink">
          Quotation of <strong>{formatPrice(existing!.total)}</strong> sent.
        </p>
        <p className="mt-1 text-muted">Customer response: {existing!.response ?? 'Awaiting response'}</p>
      </div>);

  }

  return (
    <div className="space-y-4 border border-line p-5">
      <div className="space-y-2">
        {lines.map((l, i) =>
        <div key={i} className="grid grid-cols-[1fr_60px_110px_32px] gap-2">
            <input aria-label="Description" value={l.description} onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} className={num} />
            <input aria-label="Quantity" type="number" min={1} value={l.qty} onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))} className={num} />
            <input aria-label="Unit price" type="number" min={0} value={l.unitPrice || ''} placeholder="Unit ₦" onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, unitPrice: Number(e.target.value) } : x))} className={num} />
            <button type="button" onClick={() => setLines(lines.filter((_, j) => j !== i))} disabled={lines.length === 1} aria-label="Remove line" className="grid place-items-center text-muted hover:text-ink disabled:opacity-30">
              <Trash2Icon className="h-4 w-4" />
            </button>
          </div>
        )}
        <button type="button" onClick={() => setLines([...lines, { description: '', qty: 1, unitPrice: 0 }])} className="inline-flex items-center gap-1 text-[13px] text-gold-ink">
          <PlusIcon className="h-3.5 w-3.5" /> Add line
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
        [
        ['fabricCost', 'Fabric'],
        ['customisationFee', 'Customisation'],
        ['delivery', 'Delivery'],
        ['discount', 'Discount']] as
        [keyof typeof fees, string][]).
        map(([k, l]) =>
        <label key={k} className="text-[12px] text-muted">
            {l}
            <input type="number" min={0} value={fees[k] || ''} onChange={(e) => setFees({ ...fees, [k]: Number(e.target.value) })} className={`${num} mt-1`} />
          </label>
        )}
      </div>
      <div className="grid grid-cols-[120px_1fr] gap-3">
        <label className="text-[12px] text-muted">
          Valid (days)
          <input type="number" min={1} value={validDays} onChange={(e) => setValidDays(Number(e.target.value))} className={`${num} mt-1`} />
        </label>
        <label className="text-[12px] text-muted">
          Conditions
          <input value={conditions} onChange={(e) => setConditions(e.target.value)} className={`${num} mt-1`} />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-[14px] text-muted">
          Total <span className="ml-2 text-xl font-medium text-ink">{formatPrice(total)}</span>
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => save(false)}>
            Save draft
          </Button>
          <Button size="sm" variant="gold" onClick={() => save(true)}>
            Send to customer
          </Button>
        </div>
      </div>
    </div>);

}
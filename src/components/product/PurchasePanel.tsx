import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';
import { Product } from '../../types/catalog';
import { isPurchasableOnline } from '../../utils/format';
import { Button, buttonClass } from '../ui/Button';

type Mode = 'online' | 'office' | 'custom';

interface PurchasePanelProps {
  product: Product;
  size: string;
  colour: string;
  onNeedSize: () => void;
  onReserve: () => void;
}

export function PurchasePanel({ product, size, colour, onNeedSize, onReserve }: PurchasePanelProps) {
  const { addToCart, offices } = useStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const online = isPurchasableOnline(product);
  const modes: {id: Mode;label: string;}[] = [
  ...(online ? [{ id: 'online' as Mode, label: 'Buy online' }] : []),
  ...(product.purchaseOptions.office ? [{ id: 'office' as Mode, label: 'Visit showroom' }] : []),
  ...(product.purchaseOptions.custom ? [{ id: 'custom' as Mode, label: 'Custom design' }] : [])];

  const [mode, setMode] = useState<Mode>(modes[0]?.id ?? 'custom');
  const visitOffices = offices.filter((o) => o.active && (o.services.includes('Purchases') || o.services.includes('Fittings')));

  const add = (checkout: boolean) => {
    if (!size) {
      onNeedSize();
      return;
    }
    addToCart({ productId: product.id, size, colour, qty });
    if (checkout) navigate('/checkout');else
    toast.success(`${product.name} added to your bag`, { action: { label: 'View bag', onClick: () => navigate('/cart') } });
  };

  if (modes.length === 0) {
    return <p className="border border-line p-5 text-[14px] text-muted">This piece is currently unavailable. Contact us for similar designs.</p>;
  }

  return (
    <div>
      {modes.length > 1 &&
      <div role="tablist" aria-label="How would you like to buy?" className="grid border border-line p-1" style={{ gridTemplateColumns: `repeat(${modes.length}, 1fr)` }}>
          {modes.map((m) =>
        <button
          key={m.id}
          role="tab"
          aria-selected={mode === m.id}
          onClick={() => setMode(m.id)}
          className={`h-10 whitespace-nowrap px-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-150 ${mode === m.id ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}>
          
              {m.label}
            </button>
        )}
        </div>
      }

      <div className="mt-5" role="tabpanel">
        {mode === 'online' &&
        <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-12 items-center border border-line">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="grid h-full w-11 place-items-center text-ink">
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-[15px] text-ink" aria-live="polite">
                  {qty}
                </span>
                <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity" className="grid h-full w-11 place-items-center text-ink">
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <Button className="flex-1" onClick={() => add(false)}>
                Add to bag
              </Button>
            </div>
            <Button variant="gold" className="w-full" onClick={() => add(true)}>
              Buy now
            </Button>
          </div>
        }

        {mode === 'office' &&
        <div>
            <p className="text-[15px] leading-relaxed text-body">
              {product.showPrice ? 'See it, try it on and buy in person.' : 'This piece is priced individually.'} Reserve a visit and the showroom will prepare it for you.
            </p>
            <ul className="mt-4 space-y-1.5 text-[14px] text-muted">
              {visitOffices.map((o) =>
            <li key={o.id}>
                  {o.name} · {o.city}
                </li>
            )}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={onReserve} className="flex-1">
                Reserve for a visit
              </Button>
              <Link to="/showrooms" className={buttonClass('outline', 'md')}>
                Showrooms
              </Link>
            </div>
          </div>
        }

        {mode === 'custom' &&
        <div>
            <p className="text-[15px] leading-relaxed text-body">Commission this design in your measurements, fabric or colour — or use it as the starting point for something new. You’ll receive a quotation before anything is made.</p>
            <Link to={`/custom-order?product=${product.slug}&gender=${product.gender}`} className={buttonClass('primary', 'md', 'mt-5 w-full')}>
              Request this design
            </Link>
          </div>
        }
      </div>
    </div>);

}
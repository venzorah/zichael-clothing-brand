import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { discountCodes } from '../data/checkout';
import { usePersistentState } from '../hooks/usePersistentState';
import { formatPrice } from '../utils/format';
import { discountAmount, priceCart } from '../utils/pricing';
import { OrderSummary } from '../components/OrderSummary';
import { buttonClass } from '../components/ui/Button';

export function Cart() {
  const { cart, products, updateQty, removeFromCart } = useStore();
  const [code, setCode] = usePersistentState('hoz.discount', '');
  const [codeInput, setCodeInput] = useState(code);
  const [codeError, setCodeError] = useState('');
  const { lines, subtotal } = priceCart(cart, products);
  const discount = discountAmount(code, subtotal);
  const hasUnavailable = lines.some((l) => !l.available);

  const applyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const c = codeInput.trim().toUpperCase();
    if (!discountCodes[c]) {
      setCodeError('This code is not valid.');
      return;
    }
    setCodeError('');
    setCode(c);
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <h1 className="font-display text-5xl text-ink">Your bag is empty.</h1>
        <p className="mt-4 text-[15px] text-muted">Discover pieces from our two houses.</p>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/women" className={buttonClass('primary')}>
            Shop Women
          </Link>
          <Link to="/men" className={buttonClass('outline')}>
            Shop Men
          </Link>
        </div>
      </div>);

  }

  return (
    <div className="mx-auto max-w-site px-5 py-12 lg:px-10 lg:py-16">
      <h1 className="font-display text-5xl text-ink">Shopping bag</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map(({ item, product, unit, total, available }) =>
          <li key={item.key} className="flex gap-5 py-6">
              {product &&
            <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-ivory sm:w-32">
                  <img src={product.images[0].src} alt={product.images[0].alt} className="absolute inset-0 h-full w-full object-cover" />
                </Link>
            }
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{product?.gender === 'MEN' ? 'Zichael Men' : 'Zichael Woman'}</p>
                    <h2 className="mt-1 font-display text-2xl leading-tight text-ink">{product ? <Link to={`/product/${product.slug}`}>{product.name}</Link> : 'Unavailable item'}</h2>
                    <p className="mt-1 text-[14px] text-muted">
                      {item.size} · {item.colour}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.key)} aria-label="Remove item" className="-mr-2 p-2 text-muted hover:text-ink">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
                {available ?
              <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex h-10 items-center border border-line">
                      <button type="button" onClick={() => updateQty(item.key, item.qty - 1)} aria-label="Decrease quantity" className="grid h-full w-10 place-items-center text-ink">
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-[14px] text-ink">{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.key, item.qty + 1)} aria-label="Increase quantity" className="grid h-full w-10 place-items-center text-ink">
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[16px] font-medium text-ink">{formatPrice(total)}</p>
                      {item.qty > 1 && <p className="text-[12px] text-muted">{formatPrice(unit)} each</p>}
                    </div>
                  </div> :

              <p className="mt-auto pt-4 text-[14px] text-red-700 dark:text-red-400">No longer available to buy online. Please remove it or reserve it at a showroom.</p>
              }
              </div>
            </li>
          )}
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary subtotal={subtotal} discount={discount} shipping={null}>
            <form onSubmit={applyCode} className="mt-6 border-t border-line pt-6">
              <label htmlFor="code" className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
                Discount code
              </label>
              <div className="mt-2 flex">
                <input
                  id="code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="h-11 min-w-0 flex-1 border border-line bg-surface px-3 text-[14px] uppercase text-ink focus:border-ink focus:outline-none" />
                
                <button type="submit" className="h-11 border border-l-0 border-ink bg-ink px-4 text-[11px] font-medium uppercase tracking-[0.16em] text-bg">
                  Apply
                </button>
              </div>
              {codeError && <p className="mt-2 text-[13px] text-red-700 dark:text-red-400">{codeError}</p>}
              {code && !codeError &&
              <p className="mt-2 flex items-center justify-between text-[13px] text-gold-ink">
                  {discountCodes[code]?.label}
                  <button
                  type="button"
                  onClick={() => {
                    setCode('');
                    setCodeInput('');
                  }}
                  className="text-muted underline">
                  
                    Remove
                  </button>
                </p>
              }
            </form>
            <Link
              to="/checkout"
              aria-disabled={hasUnavailable}
              className={buttonClass('primary', 'lg', `mt-6 w-full ${hasUnavailable ? 'pointer-events-none opacity-40' : ''}`)}>
              
              Checkout
            </Link>
            <p className="mt-3 text-center text-[12px] text-muted">Guest checkout available · Secure payment by Paystack</p>
          </OrderSummary>
        </aside>
      </div>
    </div>);

}
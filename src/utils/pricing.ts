import { discountCodes } from '../data/checkout';
import { Product } from '../types/catalog';
import { CartItem } from '../types/commerce';
import { effectivePrice, isPurchasableOnline } from './format';

export interface PricedLine {
  item: CartItem;
  product?: Product;
  unit: number;
  total: number;
  available: boolean;
}

export function priceCart(cart: CartItem[], products: Product[]): {lines: PricedLine[];subtotal: number;} {
  const lines = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const available = !!product && product.published && isPurchasableOnline(product);
    const unit = available && product ? effectivePrice(product) : 0;
    return { item, product, unit, total: unit * item.qty, available };
  });
  return { lines, subtotal: lines.reduce((s, l) => s + l.total, 0) };
}

export function discountAmount(code: string, subtotal: number): number {
  const d = discountCodes[code.trim().toUpperCase()];
  return d ? Math.round(subtotal * d.rate) : 0;
}

export const VAT_RATE = 0.075;

export function vatIncluded(total: number): number {
  return Math.round(total - total / (1 + VAT_RATE));
}
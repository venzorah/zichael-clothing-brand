import { Product } from '../types/catalog';

export function formatPrice(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function effectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}

export function isPurchasableOnline(product: Product): boolean {
  return product.showPrice && product.price > 0 && product.purchaseOptions.online && product.stock !== 'OUT_OF_STOCK';
}

export function makeReference(prefix: string): string {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HOZ-${prefix}-${ymd}-${rand}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const stockLabel: Record<Product['stock'], string> = {
  IN_STOCK: 'In stock',
  LOW_STOCK: 'Few pieces left',
  MADE_TO_ORDER: 'Made to order',
  OUT_OF_STOCK: 'Sold out'
};

export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
import React from 'react';
import { Product } from '../types/catalog';
import { formatPrice } from '../utils/format';

interface PriceTagProps {
  product: Product;
  size?: 'sm' | 'lg';
}

export function PriceTag({ product, size = 'sm' }: PriceTagProps) {
  const text = size === 'lg' ? 'text-2xl' : 'text-[15px]';
  if (!product.showPrice || product.price <= 0) {
    return <span className={`${size === 'lg' ? 'text-lg' : 'text-[14px]'} italic text-muted`}>Price on request</span>;
  }
  if (product.salePrice && product.salePrice < product.price) {
    return (
      <span className="flex items-baseline gap-2.5">
        <span className={`${text} font-medium text-ink`}>{formatPrice(product.salePrice, product.currency)}</span>
        <span className="text-[13px] text-muted line-through">{formatPrice(product.price, product.currency)}</span>
      </span>);

  }
  return <span className={`${text} font-medium text-ink`}>{formatPrice(product.price, product.currency)}</span>;
}
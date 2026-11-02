export type Gender = 'MEN' | 'WOMEN';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'MADE_TO_ORDER' | 'OUT_OF_STOCK';

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductColour {
  name: string;
  hex: string;
}

export interface PurchaseOptions {
  online: boolean;
  office: boolean;
  custom: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  gender: Gender;
  category: string;
  description: string;
  images: ProductImage[];
  sizes: string[];
  colours: ProductColour[];
  fabric: string;
  productionDays: string;
  stock: StockStatus;
  featured: boolean;
  newArrival: boolean;
  published: boolean;
  showPrice: boolean;
  price: number;
  salePrice?: number;
  currency: 'NGN';
  purchaseOptions: PurchaseOptions;
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  slug: string;
  name: string;
  gender: Gender;
  description: string;
  active?: boolean;
}

export interface OpeningHours {
  label: string;
  hours: string;
}

export type OfficeService = 'Purchases' | 'Fittings' | 'Consultations' | 'Collections';

export interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp: string;
  email: string;
  hours: OpeningHours[];
  services: OfficeService[];
  image: string;
  active: boolean;
}
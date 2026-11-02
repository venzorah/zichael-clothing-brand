import { Gender } from './catalog';

export interface CartItem {
  key: string;
  productId: string;
  size: string;
  colour: string;
  qty: number;
}

export interface OrderLine extends CartItem {
  name: string;
  unitPrice: number;
  image: string;
}

export type PaymentStatus = 'AWAITING_PAYMENT' | 'PAID' | 'FAILED';
export type FulfilmentStatus = 'Processing' | 'In Production' | 'Shipped' | 'Ready for Pickup' | 'Delivered' | 'Cancelled';

export interface Order {
  ref: string;
  createdAt: string;
  customer: {name: string;email: string;phone: string;};
  address: {line1: string;city: string;state: string;};
  shippingMethod: string;
  shippingFee: number;
  discount: number;
  subtotal: number;
  total: number;
  items: OrderLine[];
  paymentProvider: 'Paystack' | 'Flutterwave';
  paymentStatus: PaymentStatus;
  fulfilment: FulfilmentStatus;
  trackingNumber?: string;
}

export const REQUEST_STATUSES = [
'New Request',
'Under Review',
'Awaiting Clarification',
'Quotation Prepared',
'Quotation Sent',
'Awaiting Approval',
'Approved',
'In Production',
'Quality Check',
'Ready for Delivery',
'Completed',
'Cancelled'] as
const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface StatusEvent {
  status: string;
  at: string;
  note?: string;
}

export interface UploadedReference {
  name: string;
  size: number;
  type: string;
}

export interface QuotationLine {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Quotation {
  lines: QuotationLine[];
  fabricCost: number;
  customisationFee: number;
  delivery: number;
  discount: number;
  total: number;
  validUntil: string;
  conditions: string;
  sentAt?: string;
  response?: 'Accepted' | 'Rejected' | 'Clarification requested';
}

export interface CustomRequest {
  ref: string;
  createdAt: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp: string;
    preferredContact: string;
  };
  gender: Gender;
  clothingType: string;
  description: string;
  occasion: string;
  fabric: string;
  colour: string;
  size: string;
  measurements: string;
  quantity: number;
  completionDate: string;
  budget: string;
  instructions: string;
  basedOn?: string;
  files: UploadedReference[];
  status: RequestStatus;
  history: StatusEvent[];
  notes: {text: string;at: string;}[];
  assignee?: string;
  quotation?: Quotation;
}

export const RESERVATION_STATUSES = [
'Pending Confirmation',
'Confirmed',
'Ready for Collection',
'Completed',
'Cancelled',
'Expired'] as
const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export interface Reservation {
  ref: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  productId?: string;
  size: string;
  colour: string;
  qty: number;
  officeId: string;
  date: string;
  time: string;
  notes: string;
  status: ReservationStatus;
  history: StatusEvent[];
}

export interface CustomerUser {
  name: string;
  email: string;
  phone: string;
}
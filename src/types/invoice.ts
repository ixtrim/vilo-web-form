// src/types/invoice.ts
import { Timestamp } from 'firebase/firestore';

export interface Invoice {
  id: string;
  number: string;
  case: string;
  created: Timestamp;
  due_date: Timestamp;
  status: number;
  client_id: string;
  sales_taxes: number;
  subtotal_amount: number;
  total_amount: number;
  total_discount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientAvatar: string;
  caseTitle: string;
  invoiceItems: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  item: string;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
}

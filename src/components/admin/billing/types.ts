export type PaymentTerm = "monthly" | "annual";
export type PaymentMethod = "card" | "invoice" | "trial";
export type PaymentStatus = "paid" | "pending" | "failed";

export interface BillingProfile {
  id: number;
  clientId: number;
  clientName: string;
  modules: string[];
  seats: number;
  paymentTerm: PaymentTerm;
  paymentMethod: PaymentMethod;
  nextBillingDate: string;
  status: "active" | "suspended" | "trial";
  paymentRequestSentAt?: string;
}

export interface Invoice {
  id: number;
  clientId: number;
  date: string;
  amount: string;
  status: PaymentStatus;
  invoiceNumber: string;
}


import { useState } from "react";
import { InvoiceTable } from "@/components/admin/billing/InvoiceTable";
import { Invoice } from "@/components/admin/billing/types";

const InvoiceHistory = () => {
  // Sample data - in a real app this would come from an API
  const [invoices] = useState<Invoice[]>([
    {
      id: 1,
      clientId: 1,
      date: "2025-04-19",
      amount: "$500.00",
      status: "paid",
      invoiceNumber: "INV-2025-001"
    },
    {
      id: 2,
      clientId: 1,
      date: "2025-03-19",
      amount: "$500.00",
      status: "paid",
      invoiceNumber: "INV-2025-002"
    },
    {
      id: 3,
      clientId: 1,
      date: "2025-02-19",
      amount: "$500.00",
      status: "pending",
      invoiceNumber: "INV-2025-003"
    }
  ]);

  const transactions = invoices.map(invoice => ({
    id: invoice.id,
    company: "Your Company",
    amount: invoice.amount,
    date: invoice.date,
    status: invoice.status,
    invoice: invoice.invoiceNumber
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoice History</h1>
        <p className="text-muted-foreground">
          View and download your past invoices
        </p>
      </div>
      <InvoiceTable transactions={transactions} />
    </div>
  );
};

export default InvoiceHistory;

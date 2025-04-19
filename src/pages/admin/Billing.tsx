
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, Filter, Building, Plus } from "lucide-react";
import { ClientSetupForm } from "@/components/admin/billing/ClientSetupForm";
import { InvoiceTable } from "@/components/admin/billing/InvoiceTable";
import { BillingProfileList } from "@/components/admin/billing/BillingProfileList";

const Billing = () => {
  const [showClientSetup, setShowClientSetup] = useState(false);
  
  // Mock data for billing
  const transactions = [
    {
      id: 1,
      company: "Acme Corp",
      amount: "$1,500",
      date: "2025-04-15",
      status: "paid",
      invoice: "#INV-001",
    },
    {
      id: 2,
      company: "TechGiant Inc",
      amount: "$2,200",
      date: "2025-04-14",
      status: "paid",
      invoice: "#INV-002",
    },
    {
      id: 3,
      company: "StartUp Ltd",
      amount: "$800",
      date: "2025-04-13",
      status: "pending",
      invoice: "#INV-003",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">
            Manage billing and subscription details
          </p>
        </div>
        <Button 
          onClick={() => setShowClientSetup(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> New Client Setup
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue (MTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,500.00</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              3 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              $1,200.00 total pending
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="clients">Client Billing Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
              <InvoiceTable transactions={transactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Billing Profiles</CardTitle>
              <CardDescription>
                Active billing profiles and subscription status for all clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillingProfileList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showClientSetup && (
        <ClientSetupForm 
          onClose={() => setShowClientSetup(false)}
          onSubmit={() => setShowClientSetup(false)}
        />
      )}
    </div>
  );
};

export default Billing;

import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight, 
  Building, 
  Package, 
  Users,
  Clock,
  Mail
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ReminderDialogState {
  isOpen: boolean;
  company: string;
  emails: string[];
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [reminderDialog, setReminderDialog] = useState<ReminderDialogState>({
    isOpen: false,
    company: "",
    emails: [],
  });
  const [newEmail, setNewEmail] = useState("");

  const [stats] = useState({
    companies: 48,
    modules: 74,
    users: 312,
  });

  const [activityLogs] = useState([
    { id: 1, action: "New company added", entity: "Acme Corp", user: "John Admin", time: "2 hours ago" },
    { id: 2, action: "Module access updated", entity: "TechGiant Inc", user: "Admin User", time: "4 hours ago" },
    { id: 3, action: "User suspended", entity: "Sarah Smith", user: "System Admin", time: "Yesterday" },
    { id: 4, action: "New module purchased", entity: "Small Business LLC", user: "John Admin", time: "Yesterday" },
    { id: 5, action: "Company status changed", entity: "Old Corp", user: "System", time: "2 days ago" },
  ]);

  const [moduleStats] = useState([
    { name: "Labour Planning", count: 42, color: "bg-blue-500" },
    { name: "Real Estate IQ", count: 31, color: "bg-green-500" },
    { name: "Divorce IQ", count: 18, color: "bg-purple-500" },
    { name: "Module 4", count: 12, color: "bg-yellow-500" },
    { name: "Module 5", count: 8, color: "bg-red-500" },
  ]);

  const [outstandingInvoices] = useState([
    { 
      id: 1, 
      company: "TechGiant Inc", 
      dueDate: "2025-04-25", 
      amount: "$2,500",
      status: "overdue"
    },
    { 
      id: 2, 
      company: "Small Business LLC", 
      dueDate: "2025-04-30", 
      amount: "$1,800",
      status: "pending"
    },
    { 
      id: 3, 
      company: "Acme Corp", 
      dueDate: "2025-05-05", 
      amount: "$3,200",
      status: "pending"
    }
  ]);

  const handleGenerateReminder = (companyName: string) => {
    setReminderDialog({
      isOpen: true,
      company: companyName,
      emails: ["finance@" + companyName.toLowerCase().replace(/\s+/g, '') + ".com"],
    });
  };

  const handleAddEmail = () => {
    if (newEmail && !reminderDialog.emails.includes(newEmail)) {
      setReminderDialog({
        ...reminderDialog,
        emails: [...reminderDialog.emails, newEmail],
      });
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setReminderDialog({
      ...reminderDialog,
      emails: reminderDialog.emails.filter(email => email !== emailToRemove),
    });
  };

  const handleSendReminder = () => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${reminderDialog.company}`,
    });
    setReminderDialog({ isOpen: false, company: "", emails: [] });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your SaaS platform metrics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/companies" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Companies
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.companies}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/modules" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Modules in Use
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.modules}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +4% from last month
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/users" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +18% from last month
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Updated layout for Modules and Invoices */}
      <div className="grid grid-cols-3 gap-6">
        {/* Module Popularity - Now 1/3 width */}
        <Card>
          <CardHeader>
            <CardTitle>Modules Purchased</CardTitle>
            <CardDescription>
              Distribution of module usage across companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleStats.map((module) => (
                <div key={module.name} className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{module.name}</span>
                      <span className="text-sm text-muted-foreground">{module.count} companies</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className={`${module.color} h-2.5 rounded-full`}
                        style={{ width: `${(module.count / stats.companies) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Invoices - Now 2/3 width */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Outstanding Invoices</CardTitle>
            <CardDescription>
              Pending and overdue payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstandingInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.company}</TableCell>
                    <TableCell>
                      <span className={invoice.status === 'overdue' ? 'text-red-500' : ''}>
                        {invoice.dueDate}
                      </span>
                    </TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerateReminder(invoice.company)}
                      >
                        Generate Reminder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader className="flex justify-between items-start">
          <div>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Recent system activities and changes
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{log.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reminder Dialog */}
      <Dialog open={reminderDialog.isOpen} onOpenChange={(isOpen) => !isOpen && setReminderDialog(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Reminder</DialogTitle>
            <DialogDescription>
              Send payment reminder to {reminderDialog.company}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              {reminderDialog.emails.map((email) => (
                <div key={email} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="flex-1">{email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(email)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                type="email"
              />
              <Button onClick={handleAddEmail} variant="secondary">Add</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderDialog({ isOpen: false, company: "", emails: [] })}>
              Cancel
            </Button>
            <Button onClick={handleSendReminder}>
              Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

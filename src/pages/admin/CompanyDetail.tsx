import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Building, 
  Users, 
  Package, 
  Mail,
  Calendar,
  PlusCircle,
  Info,
  CheckCircle,
  XCircle,
  UserRound
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CompanyDetail = () => {
  const { companyId } = useParams();
  
  // Mock data for the selected company
  const [company] = useState({
    id: Number(companyId),
    name: "Acme Corporation",
    industry: "Manufacturing",
    dateOnboarded: "January 15, 2025",
    status: "active",
    contactEmail: "admin@acmecorp.com",
    contactPhone: "555-123-4567",
    address: "123 Main St, Business City, 12345",
    notes: "Key enterprise customer with multiple locations",
    accountManager: "John Doe",
    modules: [
      { id: 1, name: "Labour Planning", active: true },
      { id: 2, name: "Real Estate IQ", active: true },
      { id: 3, name: "Divorce IQ", active: true },
      { id: 4, name: "Module 4", active: false },
      { id: 5, name: "Module 5", active: false },
    ],
    users: [
      { id: 1, name: "John Smith", email: "john@acmecorp.com", role: "Admin", status: "active" },
      { id: 2, name: "Sarah Johnson", email: "sarah@acmecorp.com", role: "Manager", status: "active" },
      { id: 3, name: "Mike Williams", email: "mike@acmecorp.com", role: "User", status: "pending" },
      { id: 4, name: "Lisa Brown", email: "lisa@acmecorp.com", role: "User", status: "suspended" },
    ]
  });

  const [modules, setModules] = useState(company.modules);

  const handleModuleToggle = (moduleId: number) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, active: !module.active } 
        : module
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Link to="/admin/companies" className="flex items-center hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Companies
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Building className="h-8 w-8 mr-3 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <div className="flex items-center gap-2">
              <Badge>{company.industry}</Badge>
              {company.status === "active" ? (
                <Badge className="bg-green-600">Active</Badge>
              ) : (
                <Badge variant="destructive">Suspended</Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">Edit Company</Button>
          {company.status === "active" ? (
            <Button variant="destructive">Suspend Company</Button>
          ) : (
            <Button variant="default">Activate Company</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="font-medium">{company.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Manager:</span>
                    <span className="font-medium flex items-center gap-1">
                      <UserRound className="h-3 w-3" />
                      {company.accountManager}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Onboarded:</span>
                    <span className="font-medium">{company.dateOnboarded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{company.contactEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{company.contactPhone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                  Module Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Modules:</span>
                    <span className="font-medium">{modules.filter(m => m.active).length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {modules.filter(m => m.active).map((module) => (
                      <Badge key={module.id} variant="outline" className="text-xs">
                        {module.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  User Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Users:</span>
                    <span className="font-medium">{company.users.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Users:</span>
                    <span className="font-medium">
                      {company.users.filter(u => u.status === "active").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="font-medium">
                      {company.users.filter(u => u.status === "pending").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Company details and notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Address</h4>
                  <p className="text-muted-foreground">{company.address}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Notes</h4>
                  <p className="text-muted-foreground">{company.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Management</CardTitle>
              <CardDescription>
                Manage which modules are available to this company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`module-${module.id}`} 
                        checked={module.active} 
                        onCheckedChange={() => handleModuleToggle(module.id)}
                      />
                      <label htmlFor={`module-${module.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {module.name}
                      </label>
                    </div>
                    {module.active ? (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <XCircle className="h-3 w-3 mr-1" /> Inactive
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage company users and their access
                </CardDescription>
              </div>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Invite User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {company.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" && (
                          <Badge className="bg-green-600">Active</Badge>
                        )}
                        {user.status === "pending" && (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        {user.status === "suspended" && (
                          <Badge variant="destructive">Suspended</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;

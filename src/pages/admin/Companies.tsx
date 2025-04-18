
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  MoreHorizontal, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Companies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for companies
  const [companies] = useState([
    { 
      id: 1, 
      name: "Acme Corporation", 
      industry: "Manufacturing", 
      dateOnboarded: "Jan 15, 2025", 
      modules: ["Labour Planning", "Real Estate IQ", "Divorce IQ"], 
      status: "active" 
    },
    { 
      id: 2, 
      name: "TechGiant Inc", 
      industry: "Technology", 
      dateOnboarded: "Feb 3, 2025", 
      modules: ["Labour Planning", "Real Estate IQ"], 
      status: "active" 
    },
    { 
      id: 3, 
      name: "Small Business LLC", 
      industry: "Retail", 
      dateOnboarded: "Dec 10, 2024", 
      modules: ["Labour Planning"], 
      status: "active" 
    },
    { 
      id: 4, 
      name: "Enterprise Solutions", 
      industry: "Consulting", 
      dateOnboarded: "Mar 22, 2025", 
      modules: ["Real Estate IQ", "Module 4", "Module 5"], 
      status: "active" 
    },
    { 
      id: 5, 
      name: "Old Corp", 
      industry: "Finance", 
      dateOnboarded: "Nov 5, 2024", 
      modules: ["Divorce IQ"], 
      status: "suspended" 
    },
  ]);

  const handleManageCompany = (companyId: number) => {
    navigate(`/admin/companies/${companyId}`);
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">
            Manage all companies using your platform
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Company
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
          <CardDescription>
            View and manage client companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Date Onboarded</TableHead>
                  <TableHead>Active Modules</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Building className="h-10 w-10 mx-auto text-muted-foreground/30" />
                      <p className="mt-2 text-muted-foreground">No companies found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          {company.name}
                        </div>
                      </TableCell>
                      <TableCell>{company.industry}</TableCell>
                      <TableCell>{company.dateOnboarded}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {company.modules.map((module, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.status === "active" ? (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" /> Suspended
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleManageCompany(company.id)}>
                              Manage
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            {company.status === "active" ? (
                              <DropdownMenuItem className="text-destructive">
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                Activate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;

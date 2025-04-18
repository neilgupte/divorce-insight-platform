
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyTable } from "@/components/admin/companies/CompanyTable";
import { CompanySearch } from "@/components/admin/companies/CompanySearch";
import { Company } from "@/components/admin/companies/types";

const Companies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for companies
  const [companies] = useState<Company[]>([
    {
      id: 1,
      name: "Acme Corporation",
      industry: "Manufacturing",
      dateOnboarded: "Jan 15, 2025",
      modules: ["Labour Planning", "Real Estate IQ", "Divorce IQ"],
      status: "active",
    },
    {
      id: 2,
      name: "TechGiant Inc",
      industry: "Technology",
      dateOnboarded: "Feb 3, 2025",
      modules: ["Labour Planning", "Real Estate IQ"],
      status: "active",
    },
    {
      id: 3,
      name: "Small Business LLC",
      industry: "Retail",
      dateOnboarded: "Dec 10, 2024",
      modules: ["Labour Planning"],
      status: "active",
    },
    {
      id: 4,
      name: "Enterprise Solutions",
      industry: "Consulting",
      dateOnboarded: "Mar 22, 2025",
      modules: ["Real Estate IQ", "Module 4", "Module 5"],
      status: "active",
    },
    {
      id: 5,
      name: "Old Corp",
      industry: "Finance",
      dateOnboarded: "Nov 5, 2024",
      modules: ["Divorce IQ"],
      status: "suspended",
    },
  ]);

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
        <Button 
          className="flex items-center gap-2" 
          onClick={() => navigate('/admin/companies/new')}
        >
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
          <CompanySearch 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <CompanyTable companies={filteredCompanies} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;

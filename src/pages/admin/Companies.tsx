
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyTable } from "@/components/admin/companies/CompanyTable";
import { CompanySearch } from "@/components/admin/companies/CompanySearch";
import { getCompanies } from "@/services/companyService";
import { useToast } from "@/hooks/use-toast";

const Companies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: companies = [], isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  // Handle error state separately
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load companies. Please try again later.",
    });
  }

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
          <CompanyTable 
            companies={filteredCompanies} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;

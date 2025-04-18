
import { Building, MoreHorizontal, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Company } from "./types";

interface CompanyTableProps {
  companies: Company[];
  isLoading?: boolean;
}

export const CompanyTable = ({ companies, isLoading }: CompanyTableProps) => {
  const navigate = useNavigate();

  const handleManageCompany = (companyId: number) => {
    navigate(`/admin/companies/${companyId}`);
  };

  if (isLoading) {
    return (
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
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Loading companies...</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
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
          {companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Building className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="mt-2 text-muted-foreground">No companies found</p>
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
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
  );
};


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const industries = [
  "Technology",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Finance",
  "Education",
  "Other",
];

const modules = [
  { id: "labour-planning", name: "Labour Planning" },
  { id: "real-estate-iq", name: "Real Estate IQ" },
  { id: "divorce-iq", name: "TBD Corp" },
  { id: "module-4", name: "Module 4" },
  { id: "module-5", name: "Module 5" },
];

const AddCompany = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Company added successfully",
      description: "The new company has been added to the platform",
    });
    navigate("/admin/companies");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Company</h1>
          <p className="text-muted-foreground">
            Create a new company account and assign modules
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" placeholder="Enter company name" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Email Domain (Optional)</Label>
                <Input
                  id="domain"
                  placeholder="company.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Available Modules</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={module.id}
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={(checked) => {
                        setSelectedModules(
                          checked
                            ? [...selectedModules, module.id]
                            : selectedModules.filter((id) => id !== module.id)
                        );
                      }}
                    />
                    <Label htmlFor={module.id}>{module.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/companies")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Company</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCompany;

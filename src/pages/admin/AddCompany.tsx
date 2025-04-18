
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CompanyProfileForm } from "@/components/admin/companies/CompanyProfileForm";
import { ModulesPaymentForm } from "@/components/admin/companies/ModulesPaymentForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const AddCompany = () => {
  const [step, setStep] = useState(1);
  const [companyData, setCompanyData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProfileSubmit = (data: any) => {
    setCompanyData(data);
    if (data.status === "active") {
      setStep(2);
    } else {
      // If status is "lead", save and redirect
      handleSaveCompany(data);
    }
  };

  const handleModulesPaymentSubmit = (data: any) => {
    const finalData = {
      ...companyData,
      ...data,
    };
    handleSaveCompany(finalData);
  };

  const handleSaveCompany = (data: any) => {
    // Here you would typically save to your backend
    console.log("Saving company:", data);
    
    toast({
      title: "Company saved successfully",
      description: "The new company has been added to the platform",
    });
    
    navigate("/admin/companies");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Add New Company</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/companies">Companies</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New Company {step === 2 ? "- Modules & Payment" : "- Profile"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Company Details" : "Modules & Payment"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <CompanyProfileForm onSubmit={handleProfileSubmit} />
          ) : (
            <ModulesPaymentForm
              onSubmit={handleModulesPaymentSubmit}
              onBack={() => setStep(1)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCompany;

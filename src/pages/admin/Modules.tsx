
import { useState } from "react";
import { 
  Package, 
  FileEdit, 
  Users, 
  Building, 
  Archive, 
  Check
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ModuleCard = ({ 
  name, 
  description, 
  icon: Icon, 
  color, 
  companies, 
  users, 
  pricing 
}: { 
  name: string, 
  description: string, 
  icon: any, 
  color: string, 
  companies: number, 
  users: number,
  pricing: string
}) => {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1 w-full ${color}`}></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <div className={`p-2 rounded-md ${color} bg-opacity-15 mr-2`}>
              <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            {name}
          </CardTitle>
          <Button variant="ghost" size="icon">
            <FileEdit className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Companies:</span>
            </div>
            <Badge variant="outline">{companies}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Users:</span>
            </div>
            <Badge variant="outline">{users}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Archive className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pricing:</span>
            </div>
            <span className="text-sm font-medium">{pricing}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-1">
            <span>Adoption Rate</span>
            <span>{Math.round((companies / 48) * 100)}%</span>
          </div>
          <Progress value={(companies / 48) * 100} className="h-1.5" />
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button variant="outline" size="sm" className="flex-1">View Details</Button>
          <Button variant="outline" size="sm" className="flex-1">Documentation</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Modules = () => {
  // Mock data for modules
  const [modules] = useState([
    {
      id: 1,
      name: "Labour Planning",
      description: "Workforce management and scheduling optimization",
      icon: Users,
      color: "bg-blue-500",
      companies: 42,
      users: 156,
      pricing: "$499/month"
    },
    {
      id: 2,
      name: "Real Estate IQ",
      description: "AI-powered real estate analysis and valuation",
      icon: Building,
      color: "bg-green-500",
      companies: 31,
      users: 98,
      pricing: "$699/month"
    },
    {
      id: 3,
      name: "Divorce IQ",
      description: "Intelligent divorce insights platform",
      icon: Archive,
      color: "bg-purple-500",
      companies: 18,
      users: 42,
      pricing: "$599/month"
    },
    {
      id: 4,
      name: "Module 4",
      description: "Additional functionality module",
      icon: Package,
      color: "bg-yellow-500",
      companies: 12,
      users: 28,
      pricing: "$399/month"
    },
    {
      id: 5,
      name: "Module 5",
      description: "Advanced analytics and reporting",
      icon: Check,
      color: "bg-red-500",
      companies: 8,
      users: 15,
      pricing: "$799/month"
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
          <p className="text-muted-foreground">
            Manage your product modules and their settings
          </p>
        </div>
        <Button>Add New Module</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.id} {...module} />
        ))}
      </div>
    </div>
  );
};

export default Modules;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Download, Trash } from "lucide-react";
import LabourPotentialFunnel from "./funnel/LabourPotentialFunnel";

// Mock data for the dashboard
const mockAnalyses = [
  {
    id: "1",
    location: "San Francisco, CA 94103",
    role: "Pharmacist",
    supplyRisk: "green",
    lastChecked: "2025-03-15"
  },
  {
    id: "2",
    location: "Chicago, IL 60611",
    role: "Technician",
    supplyRisk: "amber",
    lastChecked: "2025-03-20"
  },
  {
    id: "3",
    location: "New York, NY 10001",
    role: "Pharmacist",
    supplyRisk: "red",
    lastChecked: "2025-04-01"
  },
  {
    id: "4",
    location: "Miami, FL 33130",
    role: "Technician",
    supplyRisk: "green",
    lastChecked: "2025-04-10"
  },
  {
    id: "5",
    location: "Denver, CO 80202",
    role: "Pharmacist",
    supplyRisk: "amber",
    lastChecked: "2025-04-15"
  }
];

interface LabourDashboardProps {
  onNewAnalysis?: () => void;
}

const LabourDashboard = ({ onNewAnalysis }: LabourDashboardProps) => {
  const handleNewAnalysis = () => {
    if (onNewAnalysis) {
      onNewAnalysis();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Labour Availability Dashboard</h1>
        <Button onClick={handleNewAnalysis} className="gap-2">
          <Plus className="h-4 w-4" />
          Analyse New Location
        </Button>
      </div>

      {/* Add the Labour Potential Funnel component here */}
      <LabourPotentialFunnel />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Location Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Supply Risk</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnalyses.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell>{analysis.location}</TableCell>
                  <TableCell>{analysis.role}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        analysis.supplyRisk === "green" ? "outline" : 
                        analysis.supplyRisk === "amber" ? "secondary" : 
                        "destructive"
                      }
                    >
                      {analysis.supplyRisk === "green" ? "Low Risk" :
                       analysis.supplyRisk === "amber" ? "Medium Risk" : 
                       "High Risk"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(analysis.lastChecked).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabourDashboard;

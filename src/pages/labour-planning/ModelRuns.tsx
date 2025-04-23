
import { useState } from "react";
import { 
  Calendar, 
  Search, 
  Download, 
  Eye, 
  ChevronDown,
  FileText,
  Clock,
  Building,
  BarChart
} from "lucide-react";
import { format } from "date-fns";
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
import { useNavigate } from "react-router-dom";

interface ModelRun {
  id: string;
  modelName: string;
  location: string;
  runDate: Date;
  runBy: string;
  status: "success" | "error" | "inProgress";
  resultSummary: {
    pharmacistHours: number;
    technicianHours: number;
    totalHours: number;
    fteEstimate: number;
  };
}

const ModelRuns = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data for model runs
  const [modelRuns] = useState<ModelRun[]>([
    {
      id: "run-001",
      modelName: "Downtown Pharmacy Q2",
      location: "Downtown Store",
      runDate: new Date(2025, 3, 20), // April 20, 2025
      runBy: "John Admin",
      status: "success",
      resultSummary: {
        pharmacistHours: 120,
        technicianHours: 280,
        totalHours: 400,
        fteEstimate: 10.5
      }
    },
    {
      id: "run-002",
      modelName: "Westside Location Optimization",
      location: "Westside Location",
      runDate: new Date(2025, 3, 18), // April 18, 2025
      runBy: "Jane Manager",
      status: "success",
      resultSummary: {
        pharmacistHours: 110,
        technicianHours: 260,
        totalHours: 370,
        fteEstimate: 9.75
      }
    },
    {
      id: "run-003",
      modelName: "Downtown Pharmacy Q1",
      location: "Downtown Store",
      runDate: new Date(2025, 0, 15), // Jan 15, 2025
      runBy: "John Admin",
      status: "success",
      resultSummary: {
        pharmacistHours: 115,
        technicianHours: 270,
        totalHours: 385,
        fteEstimate: 10.0
      }
    },
    {
      id: "run-004",
      modelName: "North Mall New Store",
      location: "North Mall",
      runDate: new Date(2025, 3, 10), // April 10, 2025
      runBy: "Jane Manager",
      status: "error",
      resultSummary: {
        pharmacistHours: 0,
        technicianHours: 0,
        totalHours: 0,
        fteEstimate: 0
      }
    },
    {
      id: "run-005",
      modelName: "Eastside Clinic Weekly",
      location: "Eastside Clinic",
      runDate: new Date(2025, 3, 15), // April 15, 2025
      runBy: "Sarah Analyst",
      status: "success",
      resultSummary: {
        pharmacistHours: 95,
        technicianHours: 220,
        totalHours: 315,
        fteEstimate: 8.0
      }
    },
    {
      id: "run-006",
      modelName: "Central Pharmacy Monthly",
      location: "Central Pharmacy",
      runDate: new Date(2025, 3, 1), // April 1, 2025
      runBy: "Sarah Analyst",
      status: "success",
      resultSummary: {
        pharmacistHours: 130,
        technicianHours: 310,
        totalHours: 440,
        fteEstimate: 11.25
      }
    },
    {
      id: "run-007",
      modelName: "Downtown Evening Analysis",
      location: "Downtown Store",
      runDate: new Date(2025, 3, 22), // April 22, 2025
      runBy: "John Admin",
      status: "inProgress",
      resultSummary: {
        pharmacistHours: 0,
        technicianHours: 0,
        totalHours: 0,
        fteEstimate: 0
      }
    }
  ]);

  // Filter model runs based on search term
  const filteredRuns = modelRuns.filter(run => 
    run.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    run.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group runs by month for the filter
  const months = [...new Set(modelRuns.map(run => 
    format(run.runDate, 'MMMM yyyy')
  ))];

  // Function to handle viewing a model run
  const handleViewRun = (runId: string) => {
    navigate(`/labour-planning/model-runs/${runId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Model Runs</h1>
          <p className="text-muted-foreground">
            View history and results of your labour model runs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Model Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelRuns.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Successful Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {modelRuns.filter(run => run.status === "success").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Most Recent Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">
              {format(new Date(Math.max(...modelRuns.map(run => run.runDate.getTime()))), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Weekly Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                modelRuns
                  .filter(run => run.status === "success")
                  .reduce((sum, run) => sum + run.resultSummary.totalHours, 0) / 
                modelRuns.filter(run => run.status === "success").length
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Run History</CardTitle>
          <CardDescription>
            View and analyze all previous labour model runs
          </CardDescription>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                className="pl-10" 
                placeholder="Search by model or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Filter by Date
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setSearchTerm("")}>
                    All Dates
                  </DropdownMenuItem>
                  <DropdownMenuContent className="DropdownMenuSeparator" />
                  {months.map(month => (
                    <DropdownMenuItem key={month} onSelect={() => setSearchTerm(month)}>
                      {month}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRuns.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No model runs found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search filters"
                  : "No model runs have been recorded yet"}
              </p>
              <Button className="mt-4" onClick={() => navigate('/labour-planning/create')}>
                Create New Model
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Location
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Run Date
                      </div>
                    </TableHead>
                    <TableHead>Run By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Total Hours
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <BarChart className="mr-2 h-4 w-4" />
                        FTE Estimate
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium">{run.modelName}</TableCell>
                      <TableCell>{run.location}</TableCell>
                      <TableCell>{format(run.runDate, 'MMM d, yyyy')}</TableCell>
                      <TableCell>{run.runBy}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            run.status === "success" ? "bg-green-100 text-green-800" :
                            run.status === "error" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {run.status === "success" ? "Success" : 
                           run.status === "error" ? "Error" : "In Progress"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {run.status === "success" ? run.resultSummary.totalHours : "-"}
                      </TableCell>
                      <TableCell>
                        {run.status === "success" ? run.resultSummary.fteEstimate : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {run.status === "success" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => handleViewRun(run.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {run.status === "inProgress" && (
                            <Badge variant="outline">Processing</Badge>
                          )}
                          {run.status === "error" && (
                            <Badge variant="outline" className="text-red-500">Failed</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelRuns;

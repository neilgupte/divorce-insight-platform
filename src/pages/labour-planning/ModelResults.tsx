
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Download, 
  ArrowLeft, 
  Send,
  ChevronDown,
  Clock,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Sample data for a successful model run
const modelRunData = {
  id: "run-001",
  modelName: "Downtown Pharmacy Q2",
  location: "Downtown Store",
  runDate: "April 20, 2025",
  runBy: "John Admin",
  status: "success",
  inputs: {
    storeHours: "Mon-Fri: 9am-9pm, Sat-Sun: 10am-6pm",
    dataRangeStart: "January 1, 2025",
    dataRangeEnd: "March 31, 2025",
    forecastPeriod: "April 1 - June 30, 2025"
  },
  results: {
    summary: {
      pharmacistHours: 120,
      technicianHours: 280,
      totalHours: 400,
      fteEstimate: {
        pharmacists: 3.0,
        technicians: 7.0,
        total: 10.0
      }
    },
    dailyBreakdown: [
      { day: "Monday", pharmacistHours: 18, technicianHours: 42, totalHours: 60, peakCoverage: "12pm-2pm" },
      { day: "Tuesday", pharmacistHours: 17, technicianHours: 40, totalHours: 57, peakCoverage: "1pm-3pm" },
      { day: "Wednesday", pharmacistHours: 19, technicianHours: 44, totalHours: 63, peakCoverage: "11am-1pm" },
      { day: "Thursday", pharmacistHours: 18, technicianHours: 42, totalHours: 60, peakCoverage: "12pm-2pm" },
      { day: "Friday", pharmacistHours: 20, technicianHours: 46, totalHours: 66, peakCoverage: "2pm-4pm" },
      { day: "Saturday", pharmacistHours: 16, technicianHours: 38, totalHours: 54, peakCoverage: "11am-1pm" },
      { day: "Sunday", pharmacistHours: 12, technicianHours: 28, totalHours: 40, peakCoverage: "12pm-2pm" }
    ],
    taskAllocation: [
      { task: "Prescription Filling", hours: 160, percentage: 40 },
      { task: "Patient Consultation", hours: 80, percentage: 20 },
      { task: "Inventory Management", hours: 60, percentage: 15 },
      { task: "Phone Calls", hours: 40, percentage: 10 },
      { task: "Training", hours: 30, percentage: 7.5 },
      { task: "Documentation", hours: 30, percentage: 7.5 }
    ],
    hourlyDistribution: [
      { time: "9am", pharmacist: 1, technician: 2 },
      { time: "10am", pharmacist: 1, technician: 3 },
      { time: "11am", pharmacist: 2, technician: 4 },
      { time: "12pm", pharmacist: 2, technician: 5 },
      { time: "1pm", pharmacist: 2, technician: 5 },
      { time: "2pm", pharmacist: 2, technician: 4 },
      { time: "3pm", pharmacist: 1, technician: 4 },
      { time: "4pm", pharmacist: 1, technician: 3 },
      { time: "5pm", pharmacist: 1, technician: 3 },
      { time: "6pm", pharmacist: 1, technician: 2 },
      { time: "7pm", pharmacist: 1, technician: 1 },
      { time: "8pm", pharmacist: 1, technician: 1 }
    ]
  }
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ModelResults = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");

  // In a real application, you would fetch the data based on the runId
  // const { data: modelRun, isLoading } = useQuery(['model-run', runId], () => fetchModelRun(runId));

  const handleExport = (format: string) => {
    toast({
      title: `Exporting as ${format}`,
      description: "Your export will be ready shortly."
    });
  };

  const handleSendToScheduler = () => {
    toast({
      title: "Sent to Scheduler",
      description: "Model results have been sent to the scheduling module."
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/labour-planning/model-runs')} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{modelRunData.modelName}</h1>
          </div>
          <p className="text-muted-foreground ml-8">
            Model results for {modelRunData.location} | Run on {modelRunData.runDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4 mr-1" />
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleExport("PDF")}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport("CSV")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport("Excel")}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleSendToScheduler}>
            <Send className="h-4 w-4 mr-2" />
            Send to Scheduler
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="breakdown">Daily Breakdown</TabsTrigger>
          <TabsTrigger value="inputs">Model Inputs</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  Pharmacist Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {modelRunData.results.summary.pharmacistHours}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {modelRunData.results.summary.fteEstimate.pharmacists} FTE
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  Technician Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {modelRunData.results.summary.technicianHours}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {modelRunData.results.summary.fteEstimate.technicians} FTE
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  Total Weekly Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {modelRunData.results.summary.totalHours}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {modelRunData.results.summary.fteEstimate.total} FTE
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Role Hours</CardTitle>
                <CardDescription>
                  Weekly hours distribution by role and day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={modelRunData.results.dailyBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pharmacistHours" name="Pharmacist Hours" fill="#0088FE" />
                    <Bar dataKey="technicianHours" name="Technician Hours" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Time Distribution</CardTitle>
                <CardDescription>
                  Hours allocated across different tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelRunData.results.taskAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="hours"
                      nameKey="task"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {modelRunData.results.taskAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} hours`, props.payload.task]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily Coverage Pattern</CardTitle>
                <CardDescription>
                  Hourly staffing distribution throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={modelRunData.results.hourlyDistribution}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pharmacist" name="Pharmacists" stroke="#0088FE" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="technician" name="Technicians" stroke="#00C49F" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Labour Breakdown</CardTitle>
              <CardDescription>
                Detailed hours and coverage by day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Pharmacist Hours</TableHead>
                    <TableHead>Technician Hours</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Peak Coverage Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelRunData.results.dailyBreakdown.map((day) => (
                    <TableRow key={day.day}>
                      <TableCell className="font-medium">{day.day}</TableCell>
                      <TableCell>{day.pharmacistHours}</TableCell>
                      <TableCell>{day.technicianHours}</TableCell>
                      <TableCell>{day.totalHours}</TableCell>
                      <TableCell>{day.peakCoverage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Task Allocation</CardTitle>
              <CardDescription>
                Distribution of hours across different tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Percentage of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelRunData.results.taskAllocation.map((task) => (
                    <TableRow key={task.task}>
                      <TableCell className="font-medium">{task.task}</TableCell>
                      <TableCell>{task.hours}</TableCell>
                      <TableCell>{task.percentage}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell>{modelRunData.results.summary.totalHours}</TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inputs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Input parameters used for this model run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Store Information</h3>
                    <div className="rounded-md border p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{modelRunData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Store Hours:</span>
                        <span>{modelRunData.inputs.storeHours}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Data Parameters</h3>
                    <div className="rounded-md border p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Historical Range:</span>
                        <span>{modelRunData.inputs.dataRangeStart} to {modelRunData.inputs.dataRangeEnd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Forecast Period:</span>
                        <span>{modelRunData.inputs.forecastPeriod}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Task Configuration</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead>Average Duration</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Prescription Filling</TableCell>
                          <TableCell>5 mins</TableCell>
                          <TableCell>Technician</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Patient Consultation</TableCell>
                          <TableCell>10 mins</TableCell>
                          <TableCell>Pharmacist</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Inventory Management</TableCell>
                          <TableCell>15 mins</TableCell>
                          <TableCell>Both (30/70)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Phone Calls</TableCell>
                          <TableCell>3 mins</TableCell>
                          <TableCell>Both (40/60)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Output Configuration</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time Range:</span>
                          <span>Weekly (7-day view)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Output Type:</span>
                          <span>Hours with FTE Estimate</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min. Pharmacists:</span>
                          <span>1 during all open hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prioritize Peak Hours:</span>
                          <span>Yes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelResults;

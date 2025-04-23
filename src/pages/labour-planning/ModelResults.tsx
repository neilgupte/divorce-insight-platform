
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, BarChart, Clock, Users, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ModelResults = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  
  // Mock data for the model run
  const [modelRun] = useState({
    id: runId,
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
    },
    hoursByDay: {
      monday: { pharmacist: 18, technician: 42 },
      tuesday: { pharmacist: 20, technician: 48 },
      wednesday: { pharmacist: 22, technician: 50 },
      thursday: { pharmacist: 20, technician: 46 },
      friday: { pharmacist: 24, technician: 52 },
      saturday: { pharmacist: 16, technician: 32 },
      sunday: { pharmacist: 0, technician: 10 }
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-muted-foreground" 
          onClick={() => navigate('/labour-planning/model-runs')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Model Runs
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{modelRun.modelName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>Model Run #{runId}</Badge>
            <Badge variant="outline" className="text-green-600">
              Success
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Results
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelRun.location}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelRun.resultSummary.totalHours}</div>
            <p className="text-xs text-muted-foreground">Weekly requirement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              FTE Estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelRun.resultSummary.fteEstimate}</div>
            <p className="text-xs text-muted-foreground">Recommended staffing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              Pharmacist/Tech Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((modelRun.resultSummary.pharmacistHours / modelRun.resultSummary.totalHours) * 100)}% / {Math.round((modelRun.resultSummary.technicianHours / modelRun.resultSummary.totalHours) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Role distribution</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results">Results Summary</TabsTrigger>
          <TabsTrigger value="breakdown">Daily Breakdown</TabsTrigger>
          <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Labour Hours Summary</CardTitle>
              <CardDescription>
                Breakdown of required hours by role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Pharmacist</h3>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${(modelRun.resultSummary.pharmacistHours / modelRun.resultSummary.totalHours) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>{modelRun.resultSummary.pharmacistHours} hours</span>
                    <span>{Math.round((modelRun.resultSummary.pharmacistHours / modelRun.resultSummary.totalHours) * 100)}%</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Pharmacy Technician</h3>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${(modelRun.resultSummary.technicianHours / modelRun.resultSummary.totalHours) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>{modelRun.resultSummary.technicianHours} hours</span>
                    <span>{Math.round((modelRun.resultSummary.technicianHours / modelRun.resultSummary.totalHours) * 100)}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">FTE Breakdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="text-sm font-medium mb-1">Pharmacist FTEs</h4>
                        <div className="text-2xl font-bold">
                          {(modelRun.resultSummary.pharmacistHours / 40).toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground">Based on 40hr work week</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="text-sm font-medium mb-1">Technician FTEs</h4>
                        <div className="text-2xl font-bold">
                          {(modelRun.resultSummary.technicianHours / 40).toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground">Based on 40hr work week</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Daily Hours Breakdown</CardTitle>
              <CardDescription>
                Hours required by day and role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(modelRun.hoursByDay).map(([day, hours]) => (
                  <div key={day}>
                    <h3 className="font-medium capitalize mb-2">{day}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Pharmacist</span>
                          <span>{hours.pharmacist} hours</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full"
                            style={{ width: `${(hours.pharmacist / (hours.pharmacist + hours.technician)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Technician</span>
                          <span>{hours.technician} hours</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${(hours.technician / (hours.pharmacist + hours.technician)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assumptions">
          <Card>
            <CardHeader>
              <CardTitle>Model Assumptions</CardTitle>
              <CardDescription>
                Key parameters used for this labour model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Task Durations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Prescription Filling: 5 minutes</li>
                    <li>Patient Consultation: 10 minutes</li>
                    <li>Medication Review: 15 minutes</li>
                    <li>Inventory Management: 30 minutes per day</li>
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Constraints</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Minimum 1 pharmacist on duty at all times when open</li>
                    <li>Maximum 12-hour shifts</li>
                    <li>State-required pharmacist:technician ratio maintained</li>
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Volume Forecasts</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Average 150 prescriptions per day</li>
                    <li>25 patient consultations per day</li>
                    <li>10 medication reviews per week</li>
                  </ul>
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

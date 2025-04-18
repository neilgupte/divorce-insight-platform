
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UsersIcon, 
  BarChartIcon, 
  AlertTriangle, 
  TrendingUpIcon, 
  PlusIcon,
  ClockIcon,
  BuildingIcon,
  CalendarIcon
} from "lucide-react";
import AddLocationDialog from "@/components/labour-planning/AddLocationDialog";

const LabourPlanningDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Labour Planning Dashboard</h1>
          <p className="text-muted-foreground">
            Workforce optimization and resource allocation insights
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Workload Estimation Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Workload Estimation
                </CardTitle>
                <CardDescription>Predicted volume by location and time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Downtown Store</p>
                      <div className="h-2 w-full bg-gray-100 rounded-full mt-1">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">890 items</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Westside Location</p>
                      <div className="h-2 w-full bg-gray-100 rounded-full mt-1">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">720 items</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">North Mall</p>
                      <div className="h-2 w-full bg-gray-100 rounded-full mt-1">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">510 items</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>Last updated: Today, 10:45 AM</span>
                </div>
              </CardContent>
            </Card>

            {/* Labour Recommendations Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <UsersIcon className="h-5 w-5 mr-2 text-green-500" />
                  Labour Recommendations
                </CardTitle>
                <CardDescription>Staffing needs by role and shift</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="font-medium text-sm">Morning Shift (6AM-2PM)</p>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>Cashiers</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>Floor Staff</span>
                      <span className="font-medium">6</span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>Supervisor</span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="font-medium text-sm">Evening Shift (2PM-10PM)</p>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>Cashiers</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>Floor Staff</span>
                      <span className="font-medium">7</span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>Supervisor</span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-xs text-muted-foreground">
                  <UsersIcon className="h-3 w-3 mr-1" />
                  <span>Based on historical patterns</span>
                </div>
              </CardContent>
            </Card>

            {/* Labour Gaps Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Labour Gaps
                </CardTitle>
                <CardDescription>Under- or over-staffed areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-2 border-l-4 border-red-400 bg-red-50 rounded-r-md">
                    <p className="font-medium text-sm">Downtown Store</p>
                    <p className="text-sm text-red-700">Understaffed by 3 cashiers on Sat-Sun</p>
                  </div>
                  
                  <div className="p-2 border-l-4 border-amber-400 bg-amber-50 rounded-r-md">
                    <p className="font-medium text-sm">Westside Location</p>
                    <p className="text-sm text-amber-700">Potential shortage during lunch rush (12-2PM)</p>
                  </div>
                  
                  <div className="p-2 border-l-4 border-blue-400 bg-blue-50 rounded-r-md">
                    <p className="font-medium text-sm">North Mall</p>
                    <p className="text-sm text-blue-700">Overstaffed by 2 floor staff on weekday mornings</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-xs text-muted-foreground">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>For next 7 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <TrendingUpIcon className="h-5 w-5 mr-2 text-purple-500" />
                  Key Metrics
                </CardTitle>
                <CardDescription>Performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Forecast Accuracy</span>
                    <span className="text-sm font-medium text-green-600">92%</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hours Variance</span>
                    <span className="text-sm font-medium text-amber-600">+4.2%</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Labour Cost %</span>
                    <span className="text-sm font-medium">23.7%</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Productivity</span>
                    <span className="text-sm font-medium text-green-600">108%</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-xs text-muted-foreground">
                  <BarChartIcon className="h-3 w-3 mr-1" />
                  <span>YTD metrics</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Labour Planning Data</CardTitle>
              <CardDescription>
                Raw data and historical trends for workforce planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Data visualization and analysis tools will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>
                Configure your labour planning dashboard preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings controls will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Locations Section */}
      {activeTab === "overview" && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Locations</h2>
            <Button onClick={() => setShowAddLocationDialog(true)} className="flex items-center">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New Location
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Downtown Store</CardTitle>
                <CardDescription>Restaurant • Central Region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Square Footage:</span>
                  <span>4,500 sq ft</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">POS Systems:</span>
                  <span>8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hours:</span>
                  <span>7AM - 11PM</span>
                </div>
                <Button variant="outline" className="w-full mt-4">View Details</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Westside Location</CardTitle>
                <CardDescription>Warehouse • Western Region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Square Footage:</span>
                  <span>12,800 sq ft</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">POS Systems:</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hours:</span>
                  <span>6AM - 8PM</span>
                </div>
                <Button variant="outline" className="w-full mt-4">View Details</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">North Mall</CardTitle>
                <CardDescription>Restaurant • Northern Region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Square Footage:</span>
                  <span>3,200 sq ft</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">POS Systems:</span>
                  <span>6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hours:</span>
                  <span>9AM - 9PM</span>
                </div>
                <Button variant="outline" className="w-full mt-4">View Details</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add Location Dialog */}
      <AddLocationDialog open={showAddLocationDialog} onOpenChange={setShowAddLocationDialog} />
    </div>
  );
};

export default LabourPlanningDashboard;

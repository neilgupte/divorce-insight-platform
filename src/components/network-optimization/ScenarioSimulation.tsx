
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { Play, Save, RefreshCw, Download, Settings, Grid, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Sample data for charts
const simulationResults = [
  { month: 'Jan', baseline: 4000, optimized: 3400, optimal: 3000 },
  { month: 'Feb', baseline: 4200, optimized: 3600, optimal: 3200 },
  { month: 'Mar', baseline: 3800, optimized: 3200, optimal: 2800 },
  { month: 'Apr', baseline: 4400, optimized: 3700, optimal: 3100 },
  { month: 'May', baseline: 4600, optimized: 3900, optimal: 3300 },
  { month: 'Jun', baseline: 4100, optimized: 3500, optimal: 3000 },
];

const facilityBreakdown = [
  { name: 'Labor Cost', value: 42 },
  { name: 'Facility Cost', value: 28 },
  { name: 'Transportation', value: 18 },
  { name: 'Inventory', value: 12 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ScenarioSimulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("setup");
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "running" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runSimulation = () => {
    setActiveTab("results");
    setSimulationStatus("running");
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulationStatus("completed");
          toast({
            title: "Simulation Complete",
            description: "Optimization scenario analysis has finished. View the results or export a report.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  const saveScenario = () => {
    toast({
      title: "Scenario Saved",
      description: "Your optimization scenario has been saved for future reference.",
    });
  };

  const exportResults = () => {
    toast({
      title: "Export Started",
      description: "Your results are being exported. Download will start shortly.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your results have been exported successfully.",
      });
    }, 1500);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scenario Simulation</h1>
          <p className="text-muted-foreground">Create and run network optimization scenarios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveScenario}>
            <Save className="mr-2 h-4 w-4" />
            Save Scenario
          </Button>
          <Button variant="outline" onClick={exportResults} disabled={simulationStatus !== "completed"}>
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
          <Button onClick={runSimulation} disabled={simulationStatus === "running"}>
            <Play className="mr-2 h-4 w-4" />
            Run Simulation
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="setup">Scenario Setup</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="results" disabled={simulationStatus === "idle"}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Configuration</CardTitle>
                <CardDescription>Define your network optimization scenario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input id="scenario-name" placeholder="Enter scenario name" defaultValue="Q2 Network Optimization" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scenario-description">Description</Label>
                  <Input id="scenario-description" placeholder="Describe your scenario" defaultValue="Optimize network based on Q2 demand forecasts" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scenario-type">Optimization Type</Label>
                  <Select defaultValue="cost">
                    <SelectTrigger>
                      <SelectValue placeholder="Select optimization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cost">Cost Minimization</SelectItem>
                      <SelectItem value="service">Service Level Optimization</SelectItem>
                      <SelectItem value="resilience">Network Resilience</SelectItem>
                      <SelectItem value="balanced">Balanced Approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time-horizon">Time Horizon</Label>
                  <Select defaultValue="6months">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="12months">12 Months</SelectItem>
                      <SelectItem value="24months">24 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Optimization Parameters</CardTitle>
                <CardDescription>Set the key parameters for optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Cost Importance</Label>
                    <span className="text-sm text-muted-foreground">70%</span>
                  </div>
                  <Slider defaultValue={[70]} max={100} step={5} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Service Level Importance</Label>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <Slider defaultValue={[60]} max={100} step={5} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Risk Tolerance</Label>
                    <span className="text-sm text-muted-foreground">40%</span>
                  </div>
                  <Slider defaultValue={[40]} max={100} step={5} />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="allow-new-facilities" defaultChecked />
                    <Label htmlFor="allow-new-facilities">Allow New Facilities</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="allow-closures" />
                    <Label htmlFor="allow-closures">Allow Closures</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="optimize-inventory" defaultChecked />
                    <Label htmlFor="optimize-inventory">Optimize Inventory</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="optimize-transport" defaultChecked />
                    <Label htmlFor="optimize-transport">Optimize Transport</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Facility Selection</CardTitle>
                <CardDescription>Select facilities to include in this simulation</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-3 bg-muted/50 text-sm font-medium">
                  <div>Name</div>
                  <div>Type</div>
                  <div>Location</div>
                  <div>Workers</div>
                  <div>Utilization</div>
                  <div className="text-right">Include</div>
                </div>
                {[
                  { name: "Downtown Distribution Center", type: "Distribution", location: "San Francisco, CA", workers: 145, utilization: 91, included: true },
                  { name: "Eastside Fulfillment", type: "Fulfillment", location: "Oakland, CA", workers: 78, utilization: 77, included: true },
                  { name: "South Bay Storage", type: "Storage", location: "San Jose, CA", workers: 92, utilization: 89, included: true },
                  { name: "North County Logistics", type: "Logistics", location: "Novato, CA", workers: 112, utilization: 100, included: true },
                  { name: "Central Valley Distribution", type: "Distribution", location: "Stockton, CA", workers: 65, utilization: 68, included: false },
                ].map((facility, i) => (
                  <div key={i} className="grid grid-cols-6 p-3 border-t items-center text-sm">
                    <div className="font-medium">{facility.name}</div>
                    <div>{facility.type}</div>
                    <div>{facility.location}</div>
                    <div>{facility.workers}</div>
                    <div>
                      <Badge variant={facility.utilization > 90 ? "default" : facility.utilization > 75 ? "secondary" : "outline"}>
                        {facility.utilization}%
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Switch checked={facility.included} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="constraints" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Level Constraints</CardTitle>
                <CardDescription>Define minimum service levels for the network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Minimum Order Fulfillment Rate</Label>
                    <span className="text-sm text-muted-foreground">95%</span>
                  </div>
                  <Slider defaultValue={[95]} max={100} step={1} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Maximum Delivery Time (hours)</Label>
                    <span className="text-sm text-muted-foreground">24</span>
                  </div>
                  <Slider defaultValue={[24]} min={1} max={72} step={1} />
                </div>
                
                <div className="space-y-2">
                  <Label>Customer Coverage Map</Label>
                  <div className="h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    <Grid className="h-5 w-5 mr-2" /> Coverage Map Placeholder
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost Constraints</CardTitle>
                <CardDescription>Set budget and cost limits for optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-budget">Maximum Budget (quarterly)</Label>
                  <Input id="max-budget" type="number" defaultValue="1500000" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-facility-cost">Maximum Facility Cost</Label>
                  <Input id="max-facility-cost" type="number" defaultValue="400000" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-transportation">Maximum Transportation Cost</Label>
                  <Input id="max-transportation" type="number" defaultValue="350000" />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="allow-budget-exceed" />
                  <Label htmlFor="allow-budget-exceed">Allow exceeding budget for critical improvements</Label>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Labor and Capacity Constraints</CardTitle>
              <CardDescription>Set workforce and capacity limitations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max-headcount">Maximum Total Headcount</Label>
                  <Input id="max-headcount" type="number" defaultValue="600" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-new-hires">Maximum New Hires</Label>
                  <Input id="max-new-hires" type="number" defaultValue="50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-layoffs">Maximum Layoffs</Label>
                  <Input id="max-layoffs" type="number" defaultValue="20" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-retention">Minimum Retention Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input id="min-retention" type="number" defaultValue="85" />
                    <span className="text-sm">%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-overtime">Maximum Overtime</Label>
                  <div className="flex items-center gap-2">
                    <Input id="max-overtime" type="number" defaultValue="20" />
                    <span className="text-sm">%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-utilization">Minimum Utilization</Label>
                  <div className="flex items-center gap-2">
                    <Input id="min-utilization" type="number" defaultValue="70" />
                    <span className="text-sm">%</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex flex-col space-y-4">
                <Label>Facility Types to Consider</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Distribution Center", "Fulfillment Center", "Storage Facility", "Cross-Dock", "Regional Hub", "Local Depot"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Switch id={`type-${type.toLowerCase().replace(/\s/g, '-')}`} defaultChecked />
                      <Label htmlFor={`type-${type.toLowerCase().replace(/\s/g, '-')}`}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          {simulationStatus === "running" ? (
            <Card>
              <CardHeader>
                <CardTitle>Running Simulation</CardTitle>
                <CardDescription>Please wait while we run the network optimization simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">{progress}% Complete</p>
                
                <div className="bg-muted/50 rounded-md p-4">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm">Computing optimal network configuration...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Cost Reduction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">18.4%</div>
                    <p className="text-xs text-muted-foreground">vs. current network</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Service Level Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">+7.2%</div>
                    <p className="text-xs text-muted-foreground">delivery performance</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Facilities Changed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">3</div>
                    <p className="text-xs text-muted-foreground">2 relocated, 1 added</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Implementation Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">4.5</div>
                    <p className="text-xs text-muted-foreground">estimated months</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Comparison</CardTitle>
                    <CardDescription>Comparing baseline vs optimized network costs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={simulationResults} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="baseline" stroke="#8884d8" name="Current Network" />
                        <Line type="monotone" dataKey="optimized" stroke="#82ca9d" name="Optimized Network" />
                        <Line type="monotone" dataKey="optimal" stroke="#ff7300" name="Theoretical Optimal" strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                    <CardDescription>Cost distribution in optimized network</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <div className="flex">
                        <div className="w-1/2">
                          <PieChart width={250} height={250}>
                            <Pie
                              data={facilityBreakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={3}
                              dataKey="value"
                              label
                            >
                              {facilityBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </div>
                        <div className="w-1/2 flex flex-col justify-center">
                          {facilityBreakdown.map((entry, index) => (
                            <div key={`legend-${index}`} className="flex items-center mb-2">
                              <div
                                className="w-3 h-3 mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-sm">{entry.name}: {entry.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recommended Actions</CardTitle>
                    <CardDescription>Implementation plan for network optimization</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Adjust Plan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Phase 1: Immediate Actions (Month 1-2)</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Relocate South Bay Storage facility to Fremont (Est. Savings: $120k/year)</li>
                        <li>Optimize transportation routes between North County and Downtown (Est. Savings: $85k/year)</li>
                        <li>Right-size workforce at Eastside Fulfillment (-12 positions)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Phase 2: Medium Term (Month 3-4)</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Establish new cross-dock facility in Sacramento (Est. Cost: $450k, ROI: 14 months)</li>
                        <li>Upgrade technology systems at Downtown Distribution Center</li>
                        <li>Implement integrated inventory management across all facilities</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Phase 3: Long Term (Month 5+)</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Consolidate supplier relationships for Northern California region</li>
                        <li>Implement labor sharing program between nearby facilities</li>
                        <li>Evaluate acquisition of Central Valley Distribution based on growth projections</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScenarioSimulation;


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

const NetworkSettings = () => {
  const { toast } = useToast();
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your network optimization settings have been updated.",
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Settings</h1>
        <p className="text-muted-foreground">
          Configure your network optimization parameters and preferences
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic network optimization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh">Auto-refresh data</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically update network data every 4 hours
                    </p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Enable notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when network metrics change significantly
                    </p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-insights">AI-powered insights</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate machine learning recommendations for network optimization
                    </p>
                  </div>
                  <Switch id="ai-insights" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">Mapbox API Key</Label>
                <Input id="api-key" type="password" placeholder="Enter your Mapbox API key" />
                <p className="text-xs text-muted-foreground">
                  Required for interactive mapping features
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Integration</CardTitle>
              <CardDescription>Connect to external data sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="hr-integration">HR System Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Import workforce data from HR management system
                    </p>
                  </div>
                  <Switch id="hr-integration" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="census-data">Census Data Import</Label>
                    <p className="text-sm text-muted-foreground">
                      Use public census data for population density analysis
                    </p>
                  </div>
                  <Switch id="census-data" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="traffic-data">Traffic API Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Use real-time traffic data for commute time calculations
                    </p>
                  </div>
                  <Switch id="traffic-data" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Parameters</CardTitle>
              <CardDescription>Configure optimization algorithm settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Commute Time Weighting</Label>
                    <span className="text-sm">65%</span>
                  </div>
                  <Slider defaultValue={[65]} max={100} step={5} />
                  <p className="text-xs text-muted-foreground mt-1">
                    How much importance to place on commute time in optimization calculations
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Labor Pool Importance</Label>
                    <span className="text-sm">80%</span>
                  </div>
                  <Slider defaultValue={[80]} max={100} step={5} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Importance of available labor pool in facility location decisions
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Operational Cost Factor</Label>
                    <span className="text-sm">70%</span>
                  </div>
                  <Slider defaultValue={[70]} max={100} step={5} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Weight given to operational costs in optimization models
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-commute">Maximum Commute (mins)</Label>
                  <Input id="max-commute" type="number" defaultValue="45" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-labor">Minimum Labor Pool</Label>
                  <Input id="min-labor" type="number" defaultValue="1000" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Simulation Settings</CardTitle>
              <CardDescription>Configure scenario simulation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="advanced-mode">Advanced Simulation Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable more detailed simulation options
                  </p>
                </div>
                <Switch id="advanced-mode" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sim-iterations">Simulation Iterations</Label>
                  <Input id="sim-iterations" type="number" defaultValue="500" />
                  <p className="text-xs text-muted-foreground">
                    Higher values increase accuracy but take longer
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confidence">Confidence Threshold (%)</Label>
                  <Input id="confidence" type="number" defaultValue="95" />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level for predictions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Map Display Settings</CardTitle>
              <CardDescription>Configure how map data is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cluster-markers">Cluster Facility Markers</Label>
                    <p className="text-sm text-muted-foreground">
                      Group nearby facilities on the map when zoomed out
                    </p>
                  </div>
                  <Switch id="cluster-markers" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-labels">Show Facility Labels</Label>
                    <p className="text-sm text-muted-foreground">
                      Display facility names directly on the map
                    </p>
                  </div>
                  <Switch id="show-labels" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="3d-buildings">Show 3D Buildings</Label>
                    <p className="text-sm text-muted-foreground">
                      Display buildings in 3D on the map
                    </p>
                  </div>
                  <Switch id="3d-buildings" />
                </div>
              </div>
              
              <div>
                <Label>Default Map Style</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button variant="outline" className="justify-start">Light</Button>
                  <Button variant="outline" className="justify-start">Dark</Button>
                  <Button variant="outline" className="justify-start">Satellite</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Display Settings</CardTitle>
              <CardDescription>Configure how data is presented</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Default Table View</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start">Compact</Button>
                    <Button variant="default" className="justify-start">Standard</Button>
                    <Button variant="outline" className="justify-start">Detailed</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh-table">Auto-refresh Tables</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically update table data when filters change
                    </p>
                  </div>
                  <Switch id="auto-refresh-table" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="save-filters">Save Filter Settings</Label>
                    <p className="text-sm text-muted-foreground">
                      Remember your filter preferences between sessions
                    </p>
                  </div>
                  <Switch id="save-filters" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
};

export default NetworkSettings;

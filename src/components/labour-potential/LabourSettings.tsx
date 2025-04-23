
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const LabourSettings = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: "Pharmacist", active: true },
    { id: 2, name: "Technician", active: true },
    { id: 3, name: "Store Manager", active: false }
  ]);

  const [riskThresholds, setRiskThresholds] = useState({
    green: 80,
    amber: 100
  });

  const handleThresholdChange = (thresholds: number[]) => {
    setRiskThresholds({
      green: thresholds[0],
      amber: thresholds[1]
    });
  };

  const toggleRoleActive = (id: number) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, active: !role.active } : role
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="roles" className="mb-8">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="risk">Risk Thresholds</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Role Management</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>
                        <Badge variant={role.active ? "default" : "outline"}>
                          {role.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleRoleActive(role.id)}
                          >
                            {role.active ? "Disable" : "Enable"}
                          </Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border rounded-md p-4 mt-6">
                <h3 className="font-medium mb-3">User Role Permissions</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div></div>
                    <Label className="text-center text-sm">View</Label>
                    <Label className="text-center text-sm">Edit</Label>
                    <Label className="text-center text-sm">Admin</Label>
                  </div>
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label>Dashboard Access</Label>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label>Run Analysis</Label>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label>Generate Reports</Label>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label>Manage Settings</Label>
                    <div className="flex justify-center">
                      <Switch checked={false} />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={false} />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={true} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Threshold Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="mb-6 block">
                    Set thresholds for supply vs. demand risk indicators
                  </Label>
                  
                  <div className="mb-10">
                    <Slider
                      defaultValue={[riskThresholds.green, riskThresholds.amber]}
                      max={120}
                      min={0}
                      step={5}
                      onValueChange={handleThresholdChange}
                    />
                    
                    <div className="flex justify-between mt-2">
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                          Green: &lt;{riskThresholds.green}%
                        </Badge>
                        <p className="text-xs mt-1">Low Risk</p>
                      </div>
                      
                      <div className="text-center">
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                          Amber: {riskThresholds.green}–{riskThresholds.amber}%
                        </Badge>
                        <p className="text-xs mt-1">Medium Risk</p>
                      </div>
                      
                      <div className="text-center">
                        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
                          Red: &gt;{riskThresholds.amber}%
                        </Badge>
                        <p className="text-xs mt-1">High Risk</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md bg-muted/30">
                    <h4 className="font-medium mb-2">Risk Level Calculation</h4>
                    <p className="text-sm">
                      Risk levels are calculated as: <strong>(Demand ÷ Supply) × 100%</strong>
                    </p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Green: Demand is less than {riskThresholds.green}% of available supply</li>
                      <li>• Amber: Demand is between {riskThresholds.green}% and {riskThresholds.amber}% of supply</li>
                      <li>• Red: Demand exceeds {riskThresholds.amber}% of available supply</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bls-api">Bureau of Labor Statistics API Key</Label>
                <Input id="bls-api" type="password" value="••••••••••••••••" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin-api">LinkedIn Workforce API Key</Label>
                <Input id="linkedin-api" type="password" value="••••••••••••••••" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maps-api">Maps API Key</Label>
                <Input id="maps-api" type="password" value="••••••••••••••••" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model1-connection">Labour Planning Model Connection</Label>
                <Select defaultValue="enabled">
                  <SelectTrigger id="model1-connection">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled - Auto Sync</SelectItem>
                    <SelectItem value="manual">Enabled - Manual Sync</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to Model 1 to automatically import labour demand data
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline">Test Connections</Button>
                <Button>Save API Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabourSettings;

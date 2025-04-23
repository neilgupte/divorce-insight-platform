
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, Plus, GitMerge, SlidersHorizontal, Save } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TaskMapping = () => {
  const navigate = useNavigate();
  
  // Sample data for the task mapping
  const [tasks] = useState([
    { 
      id: 1, 
      name: "Prescription Filling", 
      type: "Core", 
      roleSplit: { pharmacist: 30, technician: 70 }, 
      configurable: true 
    },
    { 
      id: 2, 
      name: "Patient Consultation", 
      type: "Core", 
      roleSplit: { pharmacist: 100, technician: 0 }, 
      configurable: false 
    },
    { 
      id: 3, 
      name: "Medication Review", 
      type: "Core", 
      roleSplit: { pharmacist: 100, technician: 0 }, 
      configurable: false 
    },
    { 
      id: 4, 
      name: "Inventory Management", 
      type: "Support", 
      roleSplit: { pharmacist: 20, technician: 80 }, 
      configurable: true 
    },
    { 
      id: 5, 
      name: "Order Entry", 
      type: "Support", 
      roleSplit: { pharmacist: 10, technician: 90 }, 
      configurable: true 
    },
    { 
      id: 6, 
      name: "Administrative Work", 
      type: "Support", 
      roleSplit: { pharmacist: 50, technician: 50 }, 
      configurable: true 
    }
  ]);

  // Sample data for task templates
  const [templates] = useState([
    { id: 1, name: "Standard Pharmacy", tasks: 12, lastUpdated: "2025-03-15" },
    { id: 2, name: "High-Volume Pharmacy", tasks: 15, lastUpdated: "2025-02-28" },
    { id: 3, name: "Hospital Pharmacy", tasks: 18, lastUpdated: "2025-01-10" },
    { id: 4, name: "Clinic Setting", tasks: 10, lastUpdated: "2025-04-01" }
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-muted-foreground" 
          onClick={() => navigate('/labour-planning')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Mapping</h1>
          <p className="text-muted-foreground">
            Configure tasks and role assignments for labour models
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Task
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Template
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Task Library</TabsTrigger>
          <TabsTrigger value="templates">Task Templates</TabsTrigger>
          <TabsTrigger value="settings">Mapping Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Library</CardTitle>
              <CardDescription>
                Manage all available tasks and their role assignments
              </CardDescription>
              <div className="mt-2 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-8" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Pharmacist %</TableHead>
                    <TableHead>Technician %</TableHead>
                    <TableHead>Configurable</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.type === "Core" 
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                          {task.type}
                        </span>
                      </TableCell>
                      <TableCell>{task.roleSplit.pharmacist}%</TableCell>
                      <TableCell>{task.roleSplit.technician}%</TableCell>
                      <TableCell>
                        {task.configurable ? (
                          <Checkbox checked disabled />
                        ) : (
                          <span className="text-sm text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Templates</CardTitle>
              <CardDescription>
                Pre-configured task sets for different pharmacy environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium mb-1">{template.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <GitMerge className="h-3 w-3 mr-1" />
                            <span>{template.tasks} tasks</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Last updated: {template.lastUpdated}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Use</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="border-dashed">
                  <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[120px]">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Create New Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapping Settings</CardTitle>
              <CardDescription>
                Configure global settings for task mapping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enforce-splits" />
                    <Label htmlFor="enforce-splits">Enforce role splits across all models</Label>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    When enabled, tasks will use the same role splits in all models
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allow-override" checked />
                    <Label htmlFor="allow-override">Allow model-specific overrides</Label>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    When enabled, individual models can override the default task configurations
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> Default Role Allocations
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="default-prescription">Default Prescription Processing Split</Label>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>
                          <Label className="text-xs">Pharmacist %</Label>
                          <Input id="default-prescription-pharm" type="number" value="30" />
                        </div>
                        <div>
                          <Label className="text-xs">Technician %</Label>
                          <Input id="default-prescription-tech" type="number" value="70" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="default-admin">Default Administrative Work Split</Label>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>
                          <Label className="text-xs">Pharmacist %</Label>
                          <Input id="default-admin-pharm" type="number" value="50" />
                        </div>
                        <div>
                          <Label className="text-xs">Technician %</Label>
                          <Input id="default-admin-tech" type="number" value="50" />
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

export default TaskMapping;

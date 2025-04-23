
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash, FileDownload, FileUp, HelpCircle, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Task {
  id?: string;
  name: string;
  duration: number;
  role: string;
  roleSplit: number;
  notes: string;
}

interface TaskConfigurationProps {
  data: {
    tasks: Task[];
    allowPharmTechTasks: boolean;
  };
  updateData: (data: Partial<TaskConfigurationProps["data"]>) => void;
}

const TaskConfigurationForm = ({ data, updateData }: TaskConfigurationProps) => {
  const { toast } = useToast();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleAllowPharmTechTasks = () => {
    updateData({
      allowPharmTechTasks: !data.allowPharmTechTasks
    });
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask({ ...task });
    setIsEditing(true);
    setTaskDialogOpen(true);
  };

  const handleAddTask = () => {
    setCurrentTask({
      name: "",
      duration: 5,
      role: "Technician",
      roleSplit: 100,
      notes: ""
    });
    setIsEditing(false);
    setTaskDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string | undefined) => {
    if (!taskId) return;
    
    const updatedTasks = data.tasks.filter(task => task.id !== taskId);
    updateData({ tasks: updatedTasks });
    
    toast({
      title: "Task deleted",
      description: "The task has been deleted from your configuration."
    });
  };

  const handleSaveTask = () => {
    if (!currentTask) return;
    
    let updatedTasks = [...data.tasks];
    
    if (isEditing && currentTask.id) {
      // Update existing task
      updatedTasks = updatedTasks.map(task => 
        task.id === currentTask.id ? currentTask : task
      );
    } else {
      // Add new task
      updatedTasks.push({
        ...currentTask,
        id: Math.random().toString(36).substring(2, 9)  // Generate a random ID
      });
    }
    
    updateData({ tasks: updatedTasks });
    setTaskDialogOpen(false);
    
    toast({
      title: isEditing ? "Task updated" : "Task added",
      description: `Task "${currentTask.name}" has been ${isEditing ? "updated" : "added"} successfully.`
    });
  };

  const handleLoadTemplate = () => {
    const templateTasks: Task[] = [
      { id: "t1", name: "Prescription Filling", duration: 5, role: "Technician", roleSplit: 100, notes: "" },
      { id: "t2", name: "Patient Consultation", duration: 10, role: "Pharmacist", roleSplit: 100, notes: "" },
      { id: "t3", name: "Inventory Management", duration: 15, role: "Both", roleSplit: 30, notes: "30% pharmacist, 70% technician" },
      { id: "t4", name: "Phone Calls", duration: 3, role: "Both", roleSplit: 40, notes: "40% pharmacist, 60% technician" },
      { id: "t5", name: "Medication Review", duration: 20, role: "Pharmacist", roleSplit: 100, notes: "" },
      { id: "t6", name: "Data Entry", duration: 4, role: "Technician", roleSplit: 100, notes: "" }
    ];
    
    updateData({ tasks: templateTasks });
    
    toast({
      title: "Template loaded",
      description: "Standard task template has been loaded successfully."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Configuration</CardTitle>
        <CardDescription>
          Define the tasks that need to be performed at the location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tasks</h3>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleLoadTemplate}>
              <FileUp className="mr-2 h-4 w-4" />
              Load Standard Template
            </Button>
            <Button onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </div>
        </div>

        {data.tasks.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              No tasks defined yet. Add tasks or load a standard template.
            </p>
          </div>
        ) : (
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Duration (mins)</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Role Split</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>{task.duration}</TableCell>
                    <TableCell>{task.role}</TableCell>
                    <TableCell>
                      {task.role === "Both" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${task.roleSplit}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {task.roleSplit}% / {100 - task.roleSplit}%
                          </span>
                        </div>
                      ) : (
                        <span>100%</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{task.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-4 border-t">
          <Switch 
            id="allowPharmTechTasks" 
            checked={data.allowPharmTechTasks}
            onCheckedChange={handleToggleAllowPharmTechTasks}
          />
          <div className="flex items-center">
            <Label htmlFor="allowPharmTechTasks">
              Allow Pharmacists to perform Technician tasks
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80">
                    When enabled, pharmacists can perform technician tasks when necessary, 
                    affecting how the model allocates workload during peak times.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>

      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the task details below." : "Enter the details for the new task."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input 
                id="taskName" 
                value={currentTask?.name || ""} 
                onChange={(e) => setCurrentTask(prev => prev ? { ...prev, name: e.target.value } : null)} 
                placeholder="Enter task name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                value={currentTask?.duration || 0} 
                onChange={(e) => setCurrentTask(prev => prev ? { ...prev, duration: parseInt(e.target.value) || 0 } : null)} 
                min={1}
                max={120}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={currentTask?.role || "Technician"} 
                onValueChange={(value) => setCurrentTask(prev => prev ? { ...prev, role: value } : null)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Both">Both (Split)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {currentTask?.role === "Both" && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Role Split (% Pharmacist)</Label>
                  <span className="text-sm">{currentTask?.roleSplit || 50}%</span>
                </div>
                <Slider
                  value={[currentTask?.roleSplit || 50]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(values) => 
                    setCurrentTask(prev => prev ? { ...prev, roleSplit: values[0] } : null)
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0% Pharmacist</span>
                  <span>100% Pharmacist</span>
                </div>
                <div className="text-center text-sm mt-2">
                  <span>{currentTask?.roleSplit || 50}% Pharmacist / {100 - (currentTask?.roleSplit || 50)}% Technician</span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={currentTask?.notes || ""} 
                onChange={(e) => setCurrentTask(prev => prev ? { ...prev, notes: e.target.value } : null)} 
                placeholder="Enter any additional notes"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              {isEditing ? "Update Task" : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskConfigurationForm;

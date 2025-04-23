
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TaskDialog from "./TaskDialog";
import TaskList from "./TaskList";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

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
      updatedTasks = updatedTasks.map(task => 
        task.id === currentTask.id ? currentTask : task
      );
    } else {
      updatedTasks.push({
        ...currentTask,
        id: Math.random().toString(36).substring(2, 9)
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
              <Upload className="mr-2 h-4 w-4" />
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
          <TaskList
            tasks={data.tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
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

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        currentTask={currentTask}
        isEditing={isEditing}
        onSave={handleSaveTask}
        onTaskChange={setCurrentTask}
      />
    </Card>
  );
};

export default TaskConfigurationForm;

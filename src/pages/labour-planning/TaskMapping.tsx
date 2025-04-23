
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Download, 
  Upload,
  Search,
  Clock,
  Users,
  FileText,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  name: string;
  duration: number;
  role: string;
  template: string;
  tags: string[];
}

const TaskMapping = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Prescription Filling", duration: 5, role: "Technician", template: "Pharmacy Standard", tags: ["pharmacy", "core"] },
    { id: "2", name: "Patient Consultation", duration: 10, role: "Pharmacist", template: "Pharmacy Standard", tags: ["pharmacy", "customer"] },
    { id: "3", name: "Inventory Management", duration: 15, role: "Both", template: "Pharmacy Standard", tags: ["pharmacy", "inventory"] },
    { id: "4", name: "Phone Calls", duration: 3, role: "Both", template: "Pharmacy Standard", tags: ["pharmacy", "communication"] },
    { id: "5", name: "Ordering", duration: 20, role: "Pharmacist", template: "Inventory", tags: ["inventory", "admin"] },
    { id: "6", name: "Cleaning", duration: 30, role: "Technician", template: "Maintenance", tags: ["maintenance"] },
    { id: "7", name: "Training", duration: 60, role: "Both", template: "HR", tags: ["development", "hr"] },
    { id: "8", name: "Documentation", duration: 15, role: "Pharmacist", template: "Admin", tags: ["admin", "compliance"] }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const templates = ["Pharmacy Standard", "Inventory", "Maintenance", "HR", "Admin"];
  const roles = ["Pharmacist", "Technician", "Both"];

  const handleEditTask = (task: Task) => {
    setCurrentTask({ ...task });
    setIsEditing(true);
    setTaskDialogOpen(true);
  };

  const handleAddTask = () => {
    setCurrentTask({
      id: "",
      name: "",
      duration: 5,
      role: "Technician",
      template: "Pharmacy Standard",
      tags: []
    });
    setIsEditing(false);
    setTaskDialogOpen(true);
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      
      toast({
        title: "Task deleted",
        description: "The task has been removed from the library."
      });
    }
  };

  const handleSaveTask = () => {
    if (!currentTask || !currentTask.name) return;
    
    let updatedTasks = [...tasks];
    const taskToSave: Task = {
      ...currentTask,
      id: currentTask.id || Math.random().toString(36).substr(2, 9)
    };
    
    if (isEditing) {
      updatedTasks = updatedTasks.map(task => 
        task.id === taskToSave.id ? taskToSave : task
      );
    } else {
      updatedTasks.push(taskToSave);
    }
    
    setTasks(updatedTasks);
    setTaskDialogOpen(false);
    
    toast({
      title: isEditing ? "Task updated" : "Task added",
      description: `Task "${taskToSave.name}" has been ${isEditing ? "updated" : "added"} to the library.`
    });
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTemplate = selectedTemplate === "all" || task.template === selectedTemplate;
    const matchesRole = selectedRole === "all" || task.role === selectedRole;
    
    return matchesSearch && matchesTemplate && matchesRole;
  });

  // Add a tag to the current task
  const [newTag, setNewTag] = useState("");
  
  const handleAddTag = () => {
    if (!newTag.trim() || !currentTask) return;
    
    const tag = newTag.trim().toLowerCase();
    if (!currentTask.tags.includes(tag)) {
      setCurrentTask({
        ...currentTask,
        tags: [...currentTask.tags, tag]
      });
    }
    
    setNewTag("");
  };
  
  const handleRemoveTag = (tag: string) => {
    if (!currentTask) return;
    
    setCurrentTask({
      ...currentTask,
      tags: currentTask.tags.filter(t => t !== tag)
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Mapping</h1>
          <p className="text-muted-foreground">
            Manage global task templates for labour planning models
          </p>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Library</CardTitle>
          <CardDescription>
            Browse and manage standardized tasks for labour models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  className="pl-10" 
                  placeholder="Search tasks or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:w-1/2">
              <div>
                <Label htmlFor="template-filter" className="mb-1 block">Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="template-filter">
                    <SelectValue placeholder="Filter by template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    {templates.map(template => (
                      <SelectItem key={template} value={template}>{template}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="role-filter" className="mb-1 block">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role-filter">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedTemplate !== "all" || selectedRole !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Create your first task to get started"}
              </p>
              <Button className="mt-4" onClick={handleAddTask}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Duration
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Role
                      </div>
                    </TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.duration} mins</TableCell>
                      <TableCell>{task.role}</TableCell>
                      <TableCell>{task.template}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(task.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </p>
          </div>
          <Button variant="outline" onClick={() => {}}>
            <Upload className="mr-2 h-4 w-4" />
            Import Tasks
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update task details below." : "Create a new task for the task library."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select 
                  value={currentTask?.template || "Pharmacy Standard"} 
                  onValueChange={(value) => setCurrentTask(prev => prev ? { ...prev, template: value } : null)}
                >
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template} value={template}>{template}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {currentTask?.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0" 
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a tag" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag}>Add</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tags help organize and find tasks more easily
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete this task from the library. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskMapping;

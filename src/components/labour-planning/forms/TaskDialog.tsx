
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Task {
  id?: string;
  name: string;
  duration: number;
  role: string;
  roleSplit: number;
  notes: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: Task | null;
  isEditing: boolean;
  onSave: () => void;
  onTaskChange: (task: Task | null) => void;
}

const TaskDialog = ({ 
  open, 
  onOpenChange, 
  currentTask, 
  isEditing, 
  onSave, 
  onTaskChange 
}: TaskDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onTaskChange(currentTask ? { ...currentTask, name: e.target.value } : null)} 
              placeholder="Enter task name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input 
              id="duration" 
              type="number" 
              value={currentTask?.duration || 0} 
              onChange={(e) => onTaskChange(currentTask ? { ...currentTask, duration: parseInt(e.target.value) || 0 } : null)} 
              min={1}
              max={120}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={currentTask?.role || "Technician"} 
              onValueChange={(value) => onTaskChange(currentTask ? { ...currentTask, role: value } : null)}
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
                  onTaskChange(currentTask ? { ...currentTask, roleSplit: values[0] } : null)
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
              onChange={(e) => onTaskChange(currentTask ? { ...currentTask, notes: e.target.value } : null)} 
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "Update Task" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;

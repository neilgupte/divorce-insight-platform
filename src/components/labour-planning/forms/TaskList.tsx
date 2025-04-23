
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

interface Task {
  id?: string;
  name: string;
  duration: number;
  role: string;
  roleSplit: number;
  notes: string;
}

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string | undefined) => void;
}

const TaskList = ({ tasks, onEditTask, onDeleteTask }: TaskListProps) => {
  return (
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
          {tasks.map((task) => (
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
                  <Button variant="ghost" size="icon" onClick={() => onEditTask(task)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;

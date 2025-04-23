
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Task {
  id?: string;
  name: string;
  duration: number;
  role: string;
  roleSplit: number;
  notes: string;
}

interface WorkVolumeProps {
  data: {
    volumeData: {
      prescriptions?: number[];
      calls?: number[];
      consultations?: number[];
      [key: string]: number[] | undefined;
    };
  };
  tasks: Task[];
  updateData: (data: Partial<WorkVolumeProps["data"]>) => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkVolumeForm = ({ data, tasks, updateData }: WorkVolumeProps) => {
  const [isOpen, setIsOpen] = useState({} as Record<string, boolean>);

  // Initialize volumeData for each task type if it doesn't exist
  const volumeData = { ...data.volumeData };
  const taskTypes = [...new Set(tasks.map(task => task.name))];

  taskTypes.forEach(taskType => {
    if (!volumeData[taskType.toLowerCase().replace(/\s+/g, '_')]) {
      // Generate some random data if none exists
      volumeData[taskType.toLowerCase().replace(/\s+/g, '_')] = Array(7).fill(0).map(() => 
        Math.floor(Math.random() * 50) + 10
      );
    }
  });

  const updateVolumeData = (taskType: string, day: number, value: number) => {
    const key = taskType.toLowerCase().replace(/\s+/g, '_');
    const newData = { ...volumeData };
    
    if (!newData[key]) {
      newData[key] = Array(7).fill(0);
    }
    
    const newValues = [...(newData[key] || [])];
    newValues[day] = value;
    newData[key] = newValues;
    
    updateData({ volumeData: newData });
  };

  const toggleSection = (taskType: string) => {
    setIsOpen(prev => ({
      ...prev,
      [taskType]: !prev[taskType]
    }));
  };

  // Format data for the charts
  const chartData = daysOfWeek.map((day, index) => {
    let dataPoint: { name: string; [key: string]: string | number } = { name: day };
    
    taskTypes.forEach(taskType => {
      const key = taskType.toLowerCase().replace(/\s+/g, '_');
      dataPoint[taskType] = volumeData[key]?.[index] || 0;
    });
    
    return dataPoint;
  });

  // Generate random colors for each task type
  const colors = taskTypes.map(() => 
    `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Volume Forecast</CardTitle>
        <CardDescription>
          Review and adjust the forecasted work volumes for each task
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Weekly Volume Forecast</h3>
          <div className="h-[300px] border rounded-md p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {taskTypes.map((taskType, index) => (
                  <Line 
                    key={taskType}
                    type="monotone" 
                    dataKey={taskType} 
                    stroke={colors[index % colors.length]} 
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Task Volume Detail</h3>
          {taskTypes.map((taskType) => (
            <Collapsible 
              key={taskType}
              open={isOpen[taskType]} 
              onOpenChange={() => toggleSection(taskType)}
              className="mb-4 border rounded-md"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between p-4 rounded-none">
                  <span className="font-medium">{taskType}</span>
                  {isOpen[taskType] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Volume</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daysOfWeek.map((day, index) => {
                        const key = taskType.toLowerCase().replace(/\s+/g, '_');
                        const value = volumeData[key]?.[index] || 0;
                        
                        return (
                          <TableRow key={`${taskType}-${day}`}>
                            <TableCell>{day}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={value}
                                onChange={(e) => updateVolumeData(taskType, index, parseInt(e.target.value) || 0)}
                                min={0}
                                className="w-24"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkVolumeForm;

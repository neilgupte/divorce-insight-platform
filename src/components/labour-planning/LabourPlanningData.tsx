
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const LabourPlanningData = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-6 pt-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Labour Data</CardTitle>
              <CardDescription>Historical and projected labour data for all locations.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button>Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Forecasted Hours</TableHead>
                <TableHead>Actual Hours</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labourData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.location}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.forecastedHours}</TableCell>
                  <TableCell>{row.actualHours}</TableCell>
                  <TableCell className={cn(
                    row.variance > 0 ? "text-red-500" : "text-green-500"
                  )}>
                    {row.variance > 0 ? `+${row.variance}%` : `${row.variance}%`}
                  </TableCell>
                  <TableCell>${row.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Sample data
const labourData = [
  {
    location: "Downtown",
    department: "Kitchen",
    date: "2025-04-15",
    forecastedHours: 120,
    actualHours: 126,
    variance: 5,
    cost: 2340.50,
  },
  {
    location: "Downtown",
    department: "Service",
    date: "2025-04-15",
    forecastedHours: 160,
    actualHours: 158,
    variance: -1.25,
    cost: 2850.75,
  },
  {
    location: "Westside",
    department: "Kitchen",
    date: "2025-04-15",
    forecastedHours: 80,
    actualHours: 83,
    variance: 3.75,
    cost: 1660.00,
  },
  {
    location: "Westside",
    department: "Service",
    date: "2025-04-15",
    forecastedHours: 120,
    actualHours: 115,
    variance: -4.17,
    cost: 2070.00,
  },
  {
    location: "Airport",
    department: "Kitchen",
    date: "2025-04-15",
    forecastedHours: 100,
    actualHours: 104,
    variance: 4.00,
    cost: 2080.00,
  },
  {
    location: "Airport",
    department: "Service",
    date: "2025-04-15",
    forecastedHours: 140,
    actualHours: 142,
    variance: 1.43,
    cost: 2556.00,
  },
];

export default LabourPlanningData;

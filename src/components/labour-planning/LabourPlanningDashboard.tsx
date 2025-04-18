
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, AlertTriangle, BarChart2 } from "lucide-react";

const LabourPlanningDashboard = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4">
      {/* Workload Estimation Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-medium">Workload Estimation</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Downtown Location</p>
                <p className="font-medium">342 items/hr</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-primary/10">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Westside Branch</p>
                <p className="font-medium">286 items/hr</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-primary/10">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '65%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Airport Terminal</p>
                <p className="font-medium">428 items/hr</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-primary/10">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '95%' }} />
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Peak hours: 11:00 - 14:00</p>
          </div>
        </CardContent>
      </Card>

      {/* Labour Recommendations Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-medium">Labour Recommendations</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Line Cooks</p>
                <p className="text-xs text-muted-foreground">Morning shift</p>
              </div>
              <p className="font-medium">4</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Servers</p>
                <p className="text-xs text-muted-foreground">Morning shift</p>
              </div>
              <p className="font-medium">6</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Line Cooks</p>
                <p className="text-xs text-muted-foreground">Evening shift</p>
              </div>
              <p className="font-medium">5</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Servers</p>
                <p className="text-xs text-muted-foreground">Evening shift</p>
              </div>
              <p className="font-medium">8</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Labour Gaps Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-medium">Labour Gaps</CardTitle>
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-500">Understaffed</p>
                <p className="text-xs text-muted-foreground">Downtown - Friday evening</p>
                <div className="flex items-center gap-1">
                  <p className="text-xs">Servers:</p>
                  <p className="text-xs text-red-500">-2</p>
                </div>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-500">At risk</p>
                <p className="text-xs text-muted-foreground">Westside - Saturday brunch</p>
                <div className="flex items-center gap-1">
                  <p className="text-xs">Line cooks:</p>
                  <p className="text-xs text-amber-500">-1</p>
                </div>
              </div>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-500">Overstaffed</p>
                <p className="text-xs text-muted-foreground">Airport - Monday morning</p>
                <div className="flex items-center gap-1">
                  <p className="text-xs">Barista:</p>
                  <p className="text-xs text-blue-500">+1</p>
                </div>
              </div>
              <AlertTriangle className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-medium">Key Metrics</CardTitle>
            <BarChart2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
              <p className="text-sm font-medium">92%</p>
            </div>
            <div className="h-1.5 w-full rounded-full bg-primary/10">
              <div className="h-1.5 rounded-full bg-primary" style={{ width: '92%' }} />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Hours Variance</p>
              <p className="text-sm font-medium">3.4%</p>
            </div>
            <div className="h-1.5 w-full rounded-full bg-primary/10">
              <div className="h-1.5 rounded-full bg-primary" style={{ width: '34%' }} />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Labour Cost %</p>
              <p className="text-sm font-medium">28.5%</p>
            </div>
            <div className="h-1.5 w-full rounded-full bg-primary/10">
              <div className="h-1.5 rounded-full bg-primary" style={{ width: '28.5%' }} />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Productivity Index</p>
              <p className="text-sm font-medium">108</p>
            </div>
            <div className="h-1.5 w-full rounded-full bg-primary/10">
              <div className="h-1.5 rounded-full bg-green-500" style={{ width: '100%' }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabourPlanningDashboard;

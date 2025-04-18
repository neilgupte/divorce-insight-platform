
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const SystemLogs = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">
          View and analyze system logs and events
        </p>
      </div>

      <Card className="flex items-center justify-center h-[400px]">
        <CardContent className="text-center p-6">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h2 className="text-xl font-medium mt-4">System Logs</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            This section is currently under development. Soon you'll be able to view and analyze detailed system logs and events across your platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogs;

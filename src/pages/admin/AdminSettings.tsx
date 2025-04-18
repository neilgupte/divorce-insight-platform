
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your platform settings and preferences
        </p>
      </div>

      <Card className="flex items-center justify-center h-[400px]">
        <CardContent className="text-center p-6">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h2 className="text-xl font-medium mt-4">Platform Settings</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            This section is currently under development. Soon you'll be able to configure all platform settings and preferences here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

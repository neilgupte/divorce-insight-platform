
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const LabourPlanningSettings = () => {
  return (
    <div className="grid gap-6 pt-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Forecast Settings</CardTitle>
          <CardDescription>Configure how the system forecasts labour requirements.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lookback">Historical Lookback Period (days)</Label>
            <Input type="number" id="lookback" defaultValue="90" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horizon">Forecast Horizon (days)</Label>
            <Input type="number" id="horizon" defaultValue="14" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="seasonal">Seasonal Adjustments</Label>
              <p className="text-xs text-muted-foreground">Adjust for seasonal patterns</p>
            </div>
            <Switch id="seasonal" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="events">Special Events</Label>
              <p className="text-xs text-muted-foreground">Include special event data</p>
            </div>
            <Switch id="events" defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Labour Rules</CardTitle>
          <CardDescription>Set rules for scheduling and labour allocation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="min-shift">Minimum Shift Duration (hours)</Label>
            <Input type="number" id="min-shift" defaultValue="4" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-shift">Maximum Shift Duration (hours)</Label>
            <Input type="number" id="max-shift" defaultValue="8" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="break-threshold">Break Threshold (hours)</Label>
            <Input type="number" id="break-threshold" defaultValue="5" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="overtime">Overtime Optimization</Label>
              <p className="text-xs text-muted-foreground">Minimize overtime costs</p>
            </div>
            <Switch id="overtime" defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LabourPlanningSettings;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface OutputConfigurationProps {
  data: {
    timeRange: string;
    outputType: string;
    constraints: {
      minPharmacist: number;
      [key: string]: any;
    };
  };
  updateData: (data: Partial<OutputConfigurationProps["data"]>) => void;
}

const OutputConfigurationForm = ({ data, updateData }: OutputConfigurationProps) => {
  const handleTimeRangeChange = (value: string) => {
    updateData({ timeRange: value });
  };

  const handleOutputTypeChange = (value: string) => {
    updateData({ outputType: value });
  };

  const handleMinPharmacistChange = (values: number[]) => {
    updateData({
      constraints: {
        ...data.constraints,
        minPharmacist: values[0]
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Output Configuration</CardTitle>
        <CardDescription>
          Configure how your labour model results should be presented
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base">Time Range</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select the time period for which to generate the labour model
            </p>
            <RadioGroup
              value={data.timeRange}
              onValueChange={handleTimeRangeChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="font-normal">Weekly (7-day view)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="font-normal">Monthly (4-week view)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-base">Output Type</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose how to represent the labour requirements
            </p>
            <RadioGroup
              value={data.outputType}
              onValueChange={handleOutputTypeChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hoursOnly" id="hours-only" />
                <Label htmlFor="hours-only" className="font-normal">Hours Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hoursWithFte" id="hours-fte" />
                <Label htmlFor="hours-fte" className="font-normal">Hours with FTE Estimate</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-base">Role Constraints</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Set minimum staffing requirements
            </p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Minimum Pharmacists during open hours</Label>
                  <span className="text-sm">{data.constraints.minPharmacist}</span>
                </div>
                <Slider
                  value={[data.constraints.minPharmacist]}
                  min={1}
                  max={3}
                  step={1}
                  onValueChange={handleMinPharmacistChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="overlap" />
                  <Label htmlFor="overlap">
                    Ensure overlap during shift changes
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="peak-staffing" />
                  <Label htmlFor="peak-staffing">
                    Prioritize staffing during peak hours
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          {data.outputType === "hoursWithFte" && (
            <div className="pt-4 border-t">
              <Label className="text-base">FTE Calculation Settings</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Configure how FTE estimates are calculated
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full-time-hours">Full-time weekly hours</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="full-time-hours" 
                      type="number" 
                      defaultValue={40} 
                      className="w-24" 
                    />
                    <span>hours</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rounding">Round FTE to</Label>
                  <Select defaultValue="0.1">
                    <SelectTrigger id="rounding">
                      <SelectValue placeholder="Select rounding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.01">0.01 (e.g., 1.23)</SelectItem>
                      <SelectItem value="0.1">0.1 (e.g., 1.2)</SelectItem>
                      <SelectItem value="0.25">0.25 (e.g., 1.25)</SelectItem>
                      <SelectItem value="0.5">0.5 (e.g., 1.5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutputConfigurationForm;

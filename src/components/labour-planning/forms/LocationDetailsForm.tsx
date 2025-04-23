
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePickerInput } from "@/components/labour-planning/TimePickerInput";

interface LocationDetailsProps {
  data: {
    storeName: string;
    storeId: string;
    region: string;
    storeType: string;
    operationalHours: Record<string, { open: string; close: string }>;
    notes: string;
  };
  updateData: (data: Partial<LocationDetailsProps["data"]>) => void;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const LocationDetailsForm = ({ data, updateData }: LocationDetailsProps) => {
  const [hours, setHours] = useState<Record<string, { open: string; close: string }>>(
    data.operationalHours || 
    days.reduce((acc, day) => {
      acc[day] = { open: "09:00", close: "17:00" };
      return acc;
    }, {} as Record<string, { open: string; close: string }>)
  );

  const handleHoursChange = (day: string, type: "open" | "close", value: string) => {
    const updatedHours = {
      ...hours,
      [day]: {
        ...hours[day],
        [type]: value
      }
    };
    setHours(updatedHours);
    updateData({ operationalHours: updatedHours });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Details</CardTitle>
        <CardDescription>
          Enter the basic information about the store location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input 
              id="storeName" 
              value={data.storeName} 
              onChange={(e) => updateData({ storeName: e.target.value })} 
              placeholder="Enter store name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeId">Store ID</Label>
            <Input 
              id="storeId" 
              value={data.storeId} 
              onChange={(e) => updateData({ storeId: e.target.value })} 
              placeholder="Enter store ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="region">Region / State</Label>
            <Input 
              id="region" 
              value={data.region} 
              onChange={(e) => updateData({ region: e.target.value })} 
              placeholder="Enter region or state"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeType">Store Type</Label>
            <Select 
              value={data.storeType} 
              onValueChange={(value) => updateData({ storeType: value })}
            >
              <SelectTrigger id="storeType">
                <SelectValue placeholder="Select store type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New Store</SelectItem>
                <SelectItem value="Existing">Existing Store</SelectItem>
                <SelectItem value="Optimising">Optimising Store</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Store Operational Hours</Label>
          <div className="space-y-3">
            {days.map((day) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium">{day}</div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${day.toLowerCase()}-open`} className="w-12">Open:</Label>
                  <TimePickerInput
                    id={`${day.toLowerCase()}-open`}
                    value={hours[day]?.open || "09:00"}
                    onChange={(value) => handleHoursChange(day, "open", value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${day.toLowerCase()}-close`} className="w-12">Close:</Label>
                  <TimePickerInput
                    id={`${day.toLowerCase()}-close`}
                    value={hours[day]?.close || "17:00"}
                    onChange={(value) => handleHoursChange(day, "close", value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            value={data.notes} 
            onChange={(e) => updateData({ notes: e.target.value })} 
            placeholder="Enter any additional information about this location"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationDetailsForm;

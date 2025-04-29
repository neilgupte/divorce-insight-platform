
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, ChevronLeft, Plus, Minus } from "lucide-react";
import NetworkMap from "./NetworkMap";

interface Facility {
  id: string;
  name: string;
  type: string;
  workers: number;
  neededWorkers: number;
  utilisation: number;
  attrition: number;
  commuteTime: number;
  lat: number;
  lng: number;
  marginalValue: number;
  laborPoolIndex: number;
}

interface FullscreenMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (facility: Facility) => void;
}

const FullscreenMapDialog: React.FC<FullscreenMapDialogProps> = ({
  open,
  onOpenChange,
  facilities,
  selectedFacility,
  onSelectFacility,
}) => {
  const [maxRadius, setMaxRadius] = useState<number>(30);
  const [minUtilization, setMinUtilization] = useState<number>(0);
  const [openPositions, setOpenPositions] = useState<number>(100);
  const [visibleFacilities, setVisibleFacilities] = useState<string[]>(
    facilities.map((f) => f.id)
  );
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState<string[]>([
    "Distribution",
    "Fulfillment",
    "Storage",
    "Logistics",
  ]);
  
  const facilityTypes = useMemo(() => {
    const types = new Set<string>();
    facilities.forEach(facility => {
      types.add(facility.type);
    });
    return Array.from(types);
  }, [facilities]);

  // Reset visible facilities when dialog opens
  useEffect(() => {
    if (open) {
      setVisibleFacilities(facilities.map((f) => f.id));
    }
  }, [open, facilities]);

  const toggleFacilityVisibility = (id: string) => {
    setVisibleFacilities((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const toggleFacilityType = (type: string) => {
    setSelectedFacilityTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter(
      (f) => 
        visibleFacilities.includes(f.id) && 
        selectedFacilityTypes.includes(f.type) &&
        f.utilisation * 100 >= minUtilization
    );
  }, [facilities, visibleFacilities, selectedFacilityTypes, minUtilization]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              Full-Screen Map
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-4 h-[80vh]">
          {/* Left sidebar with filters */}
          <div className="col-span-1 border-r p-5 overflow-y-auto">
            <div className="space-y-6">
              {/* Radius filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Max Radius (mi)</h3>
                  <span className="text-sm">{maxRadius}</span>
                </div>
                <Slider
                  value={[maxRadius]}
                  min={5}
                  max={50}
                  step={1}
                  onValueChange={(value) => setMaxRadius(value[0])}
                />
              </div>

              {/* Utilization filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Util ≥</h3>
                  <span className="text-sm">{minUtilization}%</span>
                </div>
                <Slider
                  value={[minUtilization]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setMinUtilization(value[0])}
                />
              </div>

              {/* Open positions filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Open ≤</h3>
                  <span className="text-sm">{openPositions}</span>
                </div>
                <Slider
                  value={[openPositions]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setOpenPositions(value[0])}
                />
              </div>

              {/* Show Facilities */}
              <div>
                <h3 className="font-medium mb-2">Show Facilities</h3>
                <div className="space-y-1.5">
                  {facilities.map((facility) => (
                    <div key={facility.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`fullscreen-facility-${facility.id}`}
                        checked={visibleFacilities.includes(facility.id)}
                        onCheckedChange={() => toggleFacilityVisibility(facility.id)}
                      />
                      <label
                        htmlFor={`fullscreen-facility-${facility.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {facility.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facility Types */}
              <div>
                <h3 className="font-medium mb-2">Facility Types</h3>
                <div className="flex flex-wrap gap-2">
                  {facilityTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedFacilityTypes.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFacilityType(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Map info */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredFacilities.length} of {facilities.length} facilities
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredFacilities.reduce((sum, f) => sum + f.workers, 0)} workers total
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredFacilities.reduce((sum, f) => sum + f.neededWorkers, 0)} open positions
                </p>
              </div>
            </div>
          </div>

          {/* Map container */}
          <div className="col-span-3 relative">
            <NetworkMap
              facilities={filteredFacilities}
              layers={{ commuteRadii: true }}
              maxRadius={maxRadius}
              selectedFacility={selectedFacility}
              onSelectFacility={onSelectFacility}
              fullscreen={true}
            />
            
            {/* Zoom controls */}
            <div className="absolute top-4 right-4 bg-white rounded-md shadow-md">
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <div className="h-px bg-gray-200" />
              <Button variant="ghost" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Selected facility info */}
            {selectedFacility && (
              <div className="absolute bottom-4 left-4 bg-white p-4 rounded-md shadow-md max-w-xs">
                <h3 className="font-medium">{selectedFacility.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedFacility.type}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Workers</p>
                    <p className="font-medium">{selectedFacility.workers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <p className="font-medium">{Math.round(selectedFacility.utilisation * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Open Positions</p>
                    <p className="font-medium">{selectedFacility.neededWorkers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Commute</p>
                    <p className="font-medium">{selectedFacility.commuteTime} mins</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => onSelectFacility(null)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenMapDialog;

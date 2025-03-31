
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { US_STATES } from "@/data/mockData";
import { MapFilters } from "../types";

interface FiltersPanelProps {
  filters: MapFilters;
  selectedState: string | null;
  selectedView: string | null;
  updateFilter: <K extends keyof MapFilters, S extends keyof MapFilters[K]>(
    category: K,
    setting: S,
    value: MapFilters[K][S]
  ) => void;
  onStateChange: (state: string | null) => void;
  onDeleteView: (viewId: string) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  selectedState,
  selectedView,
  updateFilter,
  onStateChange,
  onDeleteView,
}) => {
  return (
    <div className="w-64 border-r p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Location</h3>
          <Select 
            value={selectedState || "All States"} 
            onValueChange={(val) => {
              const state = val === "All States" ? null : val;
              onStateChange(state);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All States">All States</SelectItem>
              {US_STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Filters</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="divorce-enabled" 
                  checked={filters.divorceRate.enabled}
                  onCheckedChange={(checked) => 
                    updateFilter("divorceRate", "enabled", !!checked)
                  }
                />
                <Label htmlFor="divorce-enabled">Divorce Rate</Label>
              </div>
              <span className="text-sm font-medium">
                {filters.divorceRate.min}%+
              </span>
            </div>
            <Slider 
              value={[filters.divorceRate.min]} 
              min={0}
              max={10}
              step={0.1}
              disabled={!filters.divorceRate.enabled}
              onValueChange={(value) => 
                updateFilter("divorceRate", "min", value[0])
              }
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="networth-enabled" 
                  checked={filters.netWorth.enabled}
                  onCheckedChange={(checked) => 
                    updateFilter("netWorth", "enabled", !!checked)
                  }
                />
                <Label htmlFor="networth-enabled">Avg. Net Worth</Label>
              </div>
              <span className="text-sm font-medium">
                ${filters.netWorth.min}M - ${filters.netWorth.max}M
              </span>
            </div>
            <Slider 
              value={[filters.netWorth.min, filters.netWorth.max]} 
              min={1}
              max={100}
              step={1}
              disabled={!filters.netWorth.enabled}
              onValueChange={(value) => {
                updateFilter("netWorth", "min", value[0]);
                updateFilter("netWorth", "max", value[1]);
              }}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="luxury-enabled" 
                  checked={filters.luxuryDensity.enabled}
                  onCheckedChange={(checked) => 
                    updateFilter("luxuryDensity", "enabled", !!checked)
                  }
                />
                <Label htmlFor="luxury-enabled">Luxury Density</Label>
              </div>
              <span className="text-sm font-medium">
                {filters.luxuryDensity.min}+/km²
              </span>
            </div>
            <Slider 
              value={[filters.luxuryDensity.min]} 
              min={0}
              max={20}
              step={0.5}
              disabled={!filters.luxuryDensity.enabled}
              onValueChange={(value) => 
                updateFilter("luxuryDensity", "min", value[0])
              }
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="multi-property-enabled" 
                  checked={filters.multiProperty.enabled}
                  onCheckedChange={(checked) => 
                    updateFilter("multiProperty", "enabled", !!checked)
                  }
                />
                <Label htmlFor="multi-property-enabled">Multi-Property</Label>
              </div>
              <span className="text-sm font-medium">
                {filters.multiProperty.min}%+
              </span>
            </div>
            <Slider 
              value={[filters.multiProperty.min]} 
              min={0}
              max={100}
              step={5}
              disabled={!filters.multiProperty.enabled}
              onValueChange={(value) => 
                updateFilter("multiProperty", "min", value[0])
              }
            />
          </div>
        </div>
        
        {selectedView && (
          <Button 
            variant="destructive" 
            className="mt-4 w-full"
            onClick={() => onDeleteView(selectedView)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete This View
          </Button>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;

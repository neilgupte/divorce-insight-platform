
import React from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface MapFilterSidebarProps {
  expanded: boolean;
  onToggle: () => void;
  selectedState: string;
  selectedCity: string;
  divorceRateThreshold: number;
  netWorthRange: [number, number];
  urbanicity: string;
  viewMode: 'opportunity' | 'tam';
  usStates: string[];
  availableCities: string[];
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onDivorceRateChange: (value: number) => void;
  onNetWorthRangeChange: (range: [number, number]) => void;
  onUrbanicityChange: (value: string) => void;
  onViewModeChange: (mode: 'opportunity' | 'tam') => void;
}

const MapFilterSidebar: React.FC<MapFilterSidebarProps> = ({
  expanded,
  onToggle,
  selectedState,
  selectedCity,
  divorceRateThreshold,
  netWorthRange,
  urbanicity,
  viewMode,
  usStates,
  availableCities,
  onStateChange,
  onCityChange,
  onDivorceRateChange,
  onNetWorthRangeChange,
  onUrbanicityChange,
  onViewModeChange,
}) => {
  return (
    <div 
      className={`border-r border-border h-full bg-card transition-all duration-300 flex flex-col ${
        expanded ? 'w-64' : 'w-10'
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b">
        {expanded && (
          <div className="font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Map Filters
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={onToggle} 
          aria-label={expanded ? "Collapse filter panel" : "Expand filter panel"}
        >
          {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      {expanded && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm">State</Label>
            <Select value={selectedState} onValueChange={onStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All States">All States</SelectItem>
                {usStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">City</Label>
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Divorce Rate Threshold</Label>
              <span className="text-xs font-medium">{divorceRateThreshold}%+</span>
            </div>
            <Slider
              value={[divorceRateThreshold]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={([value]) => onDivorceRateChange(value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Net Worth Range</Label>
              <span className="text-xs font-medium">${netWorthRange[0]}M-${netWorthRange[1]}M</span>
            </div>
            <Slider
              value={netWorthRange}
              min={1}
              max={50}
              step={1}
              onValueChange={(values) => onNetWorthRangeChange(values as [number, number])}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Urbanicity</Label>
            <Select value={urbanicity} onValueChange={onUrbanicityChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Urban">Urban</SelectItem>
                <SelectItem value="Suburban">Suburban</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">View Mode</Label>
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && onViewModeChange(value as 'opportunity' | 'tam')}
              className="justify-start"
            >
              <ToggleGroupItem value="opportunity" aria-label="View by opportunity">
                Opportunity
              </ToggleGroupItem>
              <ToggleGroupItem value="tam" aria-label="View by TAM">
                TAM
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapFilterSidebar;

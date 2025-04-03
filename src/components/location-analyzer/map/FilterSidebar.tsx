
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Filter, Map, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// List of US states with abbreviations
const US_STATES = [
  { name: "Alabama", abbr: "AL" },
  { name: "Alaska", abbr: "AK" },
  { name: "Arizona", abbr: "AZ" },
  { name: "Arkansas", abbr: "AR" },
  { name: "California", abbr: "CA" },
  { name: "Colorado", abbr: "CO" },
  { name: "Connecticut", abbr: "CT" },
  { name: "Delaware", abbr: "DE" },
  { name: "Florida", abbr: "FL" },
  { name: "Georgia", abbr: "GA" },
  { name: "Hawaii", abbr: "HI" },
  { name: "Idaho", abbr: "ID" },
  { name: "Illinois", abbr: "IL" },
  { name: "Indiana", abbr: "IN" },
  { name: "Iowa", abbr: "IA" },
  { name: "Kansas", abbr: "KS" },
  { name: "Kentucky", abbr: "KY" },
  { name: "Louisiana", abbr: "LA" },
  { name: "Maine", abbr: "ME" },
  { name: "Maryland", abbr: "MD" },
  { name: "Massachusetts", abbr: "MA" },
  { name: "Michigan", abbr: "MI" },
  { name: "Minnesota", abbr: "MN" },
  { name: "Mississippi", abbr: "MS" },
  { name: "Missouri", abbr: "MO" },
  { name: "Montana", abbr: "MT" },
  { name: "Nebraska", abbr: "NE" },
  { name: "Nevada", abbr: "NV" },
  { name: "New Hampshire", abbr: "NH" },
  { name: "New Jersey", abbr: "NJ" },
  { name: "New Mexico", abbr: "NM" },
  { name: "New York", abbr: "NY" },
  { name: "North Carolina", abbr: "NC" },
  { name: "North Dakota", abbr: "ND" },
  { name: "Ohio", abbr: "OH" },
  { name: "Oklahoma", abbr: "OK" },
  { name: "Oregon", abbr: "OR" },
  { name: "Pennsylvania", abbr: "PA" },
  { name: "Rhode Island", abbr: "RI" },
  { name: "South Carolina", abbr: "SC" },
  { name: "South Dakota", abbr: "SD" },
  { name: "Tennessee", abbr: "TN" },
  { name: "Texas", abbr: "TX" },
  { name: "Utah", abbr: "UT" },
  { name: "Vermont", abbr: "VT" },
  { name: "Virginia", abbr: "VA" },
  { name: "Washington", abbr: "WA" },
  { name: "West Virginia", abbr: "WV" },
  { name: "Wisconsin", abbr: "WI" },
  { name: "Wyoming", abbr: "WY" }
];

interface FilterSidebarProps {
  selectedState: string;
  onStateChange: (state: string) => void;
  urbanicityFilter: 'All' | 'Urban' | 'Suburban' | 'Rural';
  onUrbanicityFilterChange: (value: 'All' | 'Urban' | 'Suburban' | 'Rural') => void;
  opportunityFilter: 'All' | 'Low' | 'Medium' | 'High';
  onOpportunityFilterChange: (value: 'All' | 'Low' | 'Medium' | 'High') => void;
  netWorthRange: [number, number];
  onNetWorthRangeChange: (value: [number, number]) => void;
  divorceRateThreshold: number;
  onDivorceRateThresholdChange: (value: number) => void;
  hideExistingOffices: boolean;
  onHideExistingOfficesChange: (value: boolean) => void;
  onToggleSidebar: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedState,
  onStateChange,
  urbanicityFilter,
  onUrbanicityFilterChange,
  opportunityFilter,
  onOpportunityFilterChange,
  netWorthRange,
  onNetWorthRangeChange,
  divorceRateThreshold,
  onDivorceRateThresholdChange,
  hideExistingOffices,
  onHideExistingOfficesChange,
  onToggleSidebar
}) => {
  const resetFilters = () => {
    onUrbanicityFilterChange('All');
    onOpportunityFilterChange('All');
    onNetWorthRangeChange([0.5, 25]);
    onDivorceRateThresholdChange(0);
    onHideExistingOfficesChange(false);
  };

  const handleOpportunityChange = (value: string) => {
    if (value) {
      onOpportunityFilterChange(value as 'All' | 'Low' | 'Medium' | 'High');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background/95 border-r">
      <div className="sticky top-0 z-10 bg-background/95 border-b p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Map Filters
        </h3>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSidebar}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Collapse sidebar</span>
        </Button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-auto">
        <div className="space-y-2">
          <Label htmlFor="state-select">Select State</Label>
          <Select 
            value={selectedState} 
            onValueChange={onStateChange}
          >
            <SelectTrigger id="state-select">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.abbr} value={state.abbr}>
                  {state.name} ({state.abbr})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Opportunity Size</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup 
              type="single" 
              value={opportunityFilter} 
              onValueChange={handleOpportunityChange} 
              className="justify-start"
            >
              <ToggleGroupItem value="Low" className="text-xs">Low (&lt;$1M)</ToggleGroupItem>
              <ToggleGroupItem value="Medium" className="text-xs">Medium ($1M-$10M)</ToggleGroupItem>
              <ToggleGroupItem value="High" className="text-xs">High ($10M+)</ToggleGroupItem>
              <ToggleGroupItem value="All" className="text-xs">All</ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label htmlFor="urbanicity-filter">Urbanicity Type</Label>
          <Select 
            value={urbanicityFilter} 
            onValueChange={(value) => onUrbanicityFilterChange(value as 'All' | 'Urban' | 'Suburban' | 'Rural')}
          >
            <SelectTrigger id="urbanicity-filter">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Areas</SelectItem>
              <SelectItem value="Urban">Urban</SelectItem>
              <SelectItem value="Suburban">Suburban</SelectItem>
              <SelectItem value="Rural">Rural</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Net Worth Range</Label>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(netWorthRange[0])}M - {formatCurrency(netWorthRange[1])}M
              </span>
            </div>
            <Slider
              value={netWorthRange}
              min={0.5}
              max={25}
              step={0.5}
              onValueChange={(value: number[]) => onNetWorthRangeChange(value as [number, number])}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Divorce Rate Threshold</Label>
              <span className="text-xs text-muted-foreground">{divorceRateThreshold}%+</span>
            </div>
            <Slider
              value={[divorceRateThreshold]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={(value) => onDivorceRateThresholdChange(value[0])}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="office-filter"
            checked={hideExistingOffices}
            onCheckedChange={onHideExistingOfficesChange}
          />
          <Label htmlFor="office-filter">Hide ZIPs with existing offices</Label>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-4 flex gap-2"
          onClick={resetFilters}
        >
          <RefreshCw className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;

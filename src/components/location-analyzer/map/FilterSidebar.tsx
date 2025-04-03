
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Filter, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// List of US states with abbreviations
const US_STATES = [
  { name: "All States", abbr: "ALL" },
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
  showExistingOffices: boolean;
  onShowExistingOfficesChange: (value: boolean) => void;
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
  showExistingOffices,
  onShowExistingOfficesChange,
  onToggleSidebar
}) => {
  const resetFilters = () => {
    onStateChange("All States");
    onUrbanicityFilterChange('All');
    onOpportunityFilterChange('All');
    onNetWorthRangeChange([0.5, 25]);
    onDivorceRateThresholdChange(0);
    onShowExistingOfficesChange(true);
  };

  const handleOpportunityChange = (value: string) => {
    if (value) {
      onOpportunityFilterChange(value as 'All' | 'Low' | 'Medium' | 'High');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0b1321] border-r w-[66%] text-white">
      <div className="sticky top-0 z-10 bg-[#0b1321] border-b border-gray-800 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Map Filters
        </h3>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSidebar}
          className="h-8 w-8 text-white hover:bg-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Collapse sidebar</span>
        </Button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-auto">
        <div className="space-y-2">
          <Label htmlFor="state-select" className="text-white text-sm font-medium">Select State</Label>
          <Select 
            value={selectedState} 
            onValueChange={onStateChange}
          >
            <SelectTrigger id="state-select" className="bg-[#141f2d] border-gray-700 text-white">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent className="bg-[#141f2d] border-gray-700 text-white">
              {US_STATES.map((state) => (
                <SelectItem key={state.abbr} value={state.name} className="hover:bg-gray-700">
                  {state.name} {state.abbr !== "ALL" ? `(${state.abbr})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-[#141f2d] p-4 rounded-md border border-gray-800">
          <h4 className="text-white text-sm font-medium mb-3">Opportunity Size</h4>
          <div className="grid grid-cols-3 gap-1">
            <div className={`text-center py-2 px-1 rounded text-xs ${opportunityFilter === 'Low' ? 'bg-blue-800' : 'bg-[#1c2737]'} cursor-pointer`} 
                 onClick={() => handleOpportunityChange('Low')}>
              Low<br/>(&lt;$1M)
            </div>
            <div className={`text-center py-2 px-1 rounded text-xs ${opportunityFilter === 'Medium' ? 'bg-blue-800' : 'bg-[#1c2737]'} cursor-pointer`}
                 onClick={() => handleOpportunityChange('Medium')}>
              Medium<br/>($1M-$10M)
            </div>
            <div className={`text-center py-2 px-1 rounded text-xs ${opportunityFilter === 'High' ? 'bg-blue-800' : 'bg-[#1c2737]'} cursor-pointer`}
                 onClick={() => handleOpportunityChange('High')}>
              High<br/>($10M+)
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="urbanicity-filter" className="text-white text-sm font-medium">Urbanicity Type</Label>
          <Select 
            value={urbanicityFilter} 
            onValueChange={(value) => onUrbanicityFilterChange(value as 'All' | 'Urban' | 'Suburban' | 'Rural')}
          >
            <SelectTrigger id="urbanicity-filter" className="bg-[#141f2d] border-gray-700 text-white">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent className="bg-[#141f2d] border-gray-700 text-white">
              <SelectItem value="All" className="hover:bg-gray-700">All Areas</SelectItem>
              <SelectItem value="Urban" className="hover:bg-gray-700">Urban</SelectItem>
              <SelectItem value="Suburban" className="hover:bg-gray-700">Suburban</SelectItem>
              <SelectItem value="Rural" className="hover:bg-gray-700">Rural</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-white text-sm font-medium">Net Worth Range</Label>
              <span className="text-xs text-gray-400">
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
              <Label className="text-white text-sm font-medium">Divorce Rate Threshold</Label>
              <span className="text-xs text-gray-400">{divorceRateThreshold}%+</span>
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
            checked={showExistingOffices}
            onCheckedChange={onShowExistingOfficesChange}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label htmlFor="office-filter" className="text-white text-sm font-medium">Show existing offices</Label>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-4 flex gap-2 bg-[#141f2d] border-gray-700 text-white hover:bg-gray-700"
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

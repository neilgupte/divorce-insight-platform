import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FilterBarProps {
  urbanicityFilter: 'Urban' | 'Suburban' | 'Rural' | 'All';
  setUrbanicityFilter: (value: 'Urban' | 'Suburban' | 'Rural' | 'All') => void;
  opportunityFilter: 'Low' | 'Medium' | 'High' | 'All';
  setOpportunityFilter: (value: 'Low' | 'Medium' | 'High' | 'All') => void;
  netWorthRange: [number, number];
  setNetWorthRange: (value: [number, number]) => void;
  divorceRateThreshold: number;
  setDivorceRateThreshold: (value: number) => void;
  showExistingOffices: boolean;
  setShowExistingOffices: (value: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  urbanicityFilter,
  setUrbanicityFilter,
  opportunityFilter,
  setOpportunityFilter,
  netWorthRange,
  setNetWorthRange,
  divorceRateThreshold,
  setDivorceRateThreshold,
  showExistingOffices,
  setShowExistingOffices
}) => {
  // Format value for net worth range display
  const formatNetWorth = (value: number) => {
    return `$${value}M`;
  };

  // Format value for divorce rate display
  const formatDivorceRate = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="px-6 py-4 border-b bg-white/90 dark:bg-gray-800/90 flex flex-wrap items-center gap-6">
      {/* Urbanicity Filter */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <Label htmlFor="urbanicity-filter" className="text-xs font-medium">
          Urbanicity Type
        </Label>
        <Select 
          value={urbanicityFilter} 
          onValueChange={(value) => setUrbanicityFilter(value as any)}
        >
          <SelectTrigger id="urbanicity-filter" className="h-9">
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
      
      {/* Opportunity Size Filter */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <Label htmlFor="opportunity-filter" className="text-xs font-medium">
          Opportunity Size
        </Label>
        <Select 
          value={opportunityFilter} 
          onValueChange={(value) => setOpportunityFilter(value as any)}
        >
          <SelectTrigger id="opportunity-filter" className="h-9">
            <SelectValue placeholder="All Opportunities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Opportunities</SelectItem>
            <SelectItem value="Low">Low ($0-5M)</SelectItem>
            <SelectItem value="Medium">Medium ($5-10M)</SelectItem>
            <SelectItem value="High">High ($10M+)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Net Worth Range Slider with two handles */}
      <div className="flex flex-col gap-1 min-w-[260px]">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-medium">Net Worth Range</Label>
          <span className="text-xs text-muted-foreground">
            {formatNetWorth(netWorthRange[0])} - {formatNetWorth(netWorthRange[1])}
          </span>
        </div>
        <Slider
          value={[netWorthRange[0], netWorthRange[1]]}
          min={1}
          max={50}
          step={1}
          onValueChange={(value) => setNetWorthRange([value[0], value[1]])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>$1M</span>
          <span>$25M</span>
          <span>$50M+</span>
        </div>
      </div>
      
      {/* Divorce Rate Threshold */}
      <div className="flex flex-col gap-1 min-w-[200px]">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-medium">Divorce Rate Threshold</Label>
          <span className="text-xs text-muted-foreground">
            Min {formatDivorceRate(divorceRateThreshold)}
          </span>
        </div>
        <Slider
          value={[divorceRateThreshold]}
          min={0}
          max={10}
          step={0.1}
          onValueChange={(value) => setDivorceRateThreshold(value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>5%</span>
          <span>10%+</span>
        </div>
      </div>
      
      {/* Existing Office Location Toggle */}
      <div className="flex flex-col gap-1 min-w-[180px]">
        <Label htmlFor="show-offices" className="text-xs font-medium">Existing office location</Label>
        <div className="flex items-center space-x-2 bg-secondary/20 p-2 rounded-md">
          <Switch 
            id="show-offices" 
            checked={showExistingOffices}
            onCheckedChange={setShowExistingOffices}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label htmlFor="show-offices" className="text-sm font-medium">
            {showExistingOffices ? "Yes" : "No"}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

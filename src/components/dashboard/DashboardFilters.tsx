
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardFiltersProps {
  selectedState: string;
  selectedCity: string;
  selectedNetWorth: string;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onNetWorthChange: (value: string) => void;
  availableCities: string[];
  usStates: string[];
  netWorthBrackets: string[];
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  selectedState,
  selectedCity,
  selectedNetWorth,
  onStateChange,
  onCityChange,
  onNetWorthChange,
  availableCities,
  usStates,
  netWorthBrackets,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Select value={selectedState} onValueChange={onStateChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select State" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All States">All States</SelectItem>
          {usStates.map(state => (
            <SelectItem key={state} value={state}>{state}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent>
          {availableCities.map(city => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedNetWorth} onValueChange={onNetWorthChange}>
        <SelectTrigger>
          <SelectValue placeholder="Net Worth Bracket" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Brackets</SelectItem>
          {netWorthBrackets.map(bracket => (
            <SelectItem key={bracket} value={bracket}>{bracket}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DashboardFilters;

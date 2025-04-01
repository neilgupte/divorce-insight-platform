
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardFiltersProps {
  selectedState: string;
  selectedCity: string;
  netWorthRange: [number, number];
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onNetWorthChange: (value: [number, number]) => void;
  availableCities: string[];
  usStates: string[];
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  selectedState,
  selectedCity,
  netWorthRange,
  onStateChange,
  onCityChange,
  onNetWorthChange,
  availableCities,
  usStates,
}) => {
  const [stateSearchValue, setStateSearchValue] = useState("");
  const [citySearchValue, setCitySearchValue] = useState("");
  const [filteredStates, setFilteredStates] = useState<string[]>(usStates);
  const [filteredCities, setFilteredCities] = useState<string[]>(availableCities);
  
  // Format net worth values
  const formatNetWorth = (value: number) => {
    return value >= 50 ? "$50M+" : `$${value}M`;
  };

  // Filter states based on search input
  useEffect(() => {
    if (stateSearchValue) {
      const filtered = usStates.filter(state => 
        state.toLowerCase().includes(stateSearchValue.toLowerCase())
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates(usStates);
    }
  }, [stateSearchValue, usStates]);
  
  // Filter cities based on search input and update when availableCities changes
  useEffect(() => {
    setFilteredCities(availableCities);
    
    if (citySearchValue) {
      const filtered = availableCities.filter(city => 
        city.toLowerCase().includes(citySearchValue.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citySearchValue, availableCities]);
  
  // Reset search when selections change
  useEffect(() => {
    setStateSearchValue("");
    setCitySearchValue("");
  }, [selectedState, selectedCity]);

  // Reset city selection when state changes
  useEffect(() => {
    // If state changes, reset city to "All Cities"
    if (selectedCity !== "All Cities") {
      onCityChange("All Cities");
    }
  }, [selectedState]);

  return (
    <div className="mb-6 space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* State Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="state-select" className="text-sm font-medium">
            State
          </Label>
          <div className="relative">
            <Select 
              value={selectedState} 
              onValueChange={onStateChange}
            >
              <SelectTrigger id="state-select" className="w-full">
                <SelectValue placeholder="All States" />
                {selectedState !== "All States" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-8 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStateChange("All States");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </SelectTrigger>
              <SelectContent>
                <div className="flex items-center border-b p-2">
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search states..."
                    value={stateSearchValue}
                    onChange={(e) => setStateSearchValue(e.target.value)}
                    className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <SelectItem value="All States">All States</SelectItem>
                {filteredStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
                {filteredStates.length === 0 && (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No states found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* City Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="city-select" className="text-sm font-medium">
            City
          </Label>
          <div className="relative">
            <Select 
              value={selectedCity} 
              onValueChange={onCityChange}
              disabled={selectedState === "All States"}
            >
              <SelectTrigger id="city-select" className="w-full">
                <SelectValue 
                  placeholder={selectedState === "All States" ? "Select a state first" : "All Cities"} 
                />
                {selectedCity !== "All Cities" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-8 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCityChange("All Cities");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </SelectTrigger>
              <SelectContent>
                {selectedState !== "All States" ? (
                  <>
                    <div className="flex items-center border-b p-2">
                      <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search cities..."
                        value={citySearchValue}
                        onChange={(e) => setCitySearchValue(e.target.value)}
                        className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <SelectItem value="All Cities">All Cities</SelectItem>
                    {filteredCities.length > 0 ? (
                      filteredCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        No cities available for this state
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Select a state first
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Net Worth Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="net-worth-range" className="text-sm font-medium">
              Net Worth Bracket
            </Label>
            {(netWorthRange[0] > 1 || netWorthRange[1] < 50) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onNetWorthChange([1, 50])}
              >
                Reset to All
              </Button>
            )}
          </div>
          <div className="px-2">
            <Slider
              id="net-worth-range"
              value={netWorthRange}
              min={1}
              max={50}
              step={1}
              onValueChange={onNetWorthChange}
              className="py-4"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">{formatNetWorth(netWorthRange[0])}</span>
            <span className="text-muted-foreground">–</span>
            <span className="font-medium">{formatNetWorth(netWorthRange[1])}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>$1M</span>
            <span>$5M</span>
            <span>$10M</span>
            <span>$20M</span>
            <span>$50M+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;


import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Map } from "lucide-react";

interface MapFilterPanelProps {
  opportunityFilter: 'Low' | 'Medium' | 'High' | 'All';
  setOpportunityFilter: (value: 'Low' | 'Medium' | 'High' | 'All') => void;
  urbanicityFilter: 'Urban' | 'Suburban' | 'Rural' | 'All';
  setUrbanicityFilter: (value: 'Urban' | 'Suburban' | 'Rural' | 'All') => void;
  netWorthRange: [number, number];
  setNetWorthRange: (value: [number, number]) => void;
  divorceRateThreshold: number;
  setDivorceRateThreshold: (value: number) => void;
  showExistingOffices: boolean;
  setShowExistingOffices: (value: boolean) => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const MapFilterPanel: React.FC<MapFilterPanelProps> = ({
  opportunityFilter,
  setOpportunityFilter,
  urbanicityFilter,
  setUrbanicityFilter,
  netWorthRange,
  setNetWorthRange,
  divorceRateThreshold,
  setDivorceRateThreshold,
  showExistingOffices,
  setShowExistingOffices,
  isCollapsed = false,
  toggleCollapse
}) => {
  const handleOpportunityChange = (value: string) => {
    if (value) {
      setOpportunityFilter(value as 'Low' | 'Medium' | 'High' | 'All');
    }
  };

  return (
    <div className={`h-full flex flex-col border-r bg-background/95 shadow-md ${isCollapsed ? 'w-16' : 'w-full md:w-80'} transition-all duration-300 overflow-auto`}>
      <div className="sticky top-0 z-10 bg-background/95 border-b p-4 flex items-center justify-between">
        {!isCollapsed && (
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Map Filters
          </h3>
        )}
        {isCollapsed && <Filter className="h-5 w-5 mx-auto" />}
        
        {toggleCollapse && (
          <button 
            onClick={toggleCollapse}
            className="rounded-full p-1.5 hover:bg-muted"
            aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
          >
            <Map className="h-4 w-4" />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6 flex-1">
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
                <ToggleGroupItem value="Low" className="text-xs">Low</ToggleGroupItem>
                <ToggleGroupItem value="Medium" className="text-xs">Medium</ToggleGroupItem>
                <ToggleGroupItem value="High" className="text-xs">High</ToggleGroupItem>
                <ToggleGroupItem value="All" className="text-xs">All</ToggleGroupItem>
              </ToggleGroup>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="urbanicity-filter">Urbanicity Type</Label>
            <Select 
              value={urbanicityFilter} 
              onValueChange={(value) => setUrbanicityFilter(value as 'Urban' | 'Suburban' | 'Rural' | 'All')}
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
        </div>
      )}
    </div>
  );
};

export default MapFilterPanel;

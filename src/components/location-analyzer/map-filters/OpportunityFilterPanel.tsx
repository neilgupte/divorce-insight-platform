
import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter, BarChart3, Building, MapPin } from "lucide-react";

interface OpportunityFilterPanelProps {
  opportunityFilter: 'Low' | 'Medium' | 'High' | 'All';
  setOpportunityFilter: (value: 'Low' | 'Medium' | 'High' | 'All') => void;
  urbanicityFilter: 'Urban' | 'Suburban' | 'Rural' | 'All';
  setUrbanicityFilter: (value: 'Urban' | 'Suburban' | 'Rural' | 'All') => void;
}

const OpportunityFilterPanel: React.FC<OpportunityFilterPanelProps> = ({
  opportunityFilter,
  setOpportunityFilter,
  urbanicityFilter,
  setUrbanicityFilter
}) => {
  return (
    <div className="p-4 space-y-6 w-full">
      <div className="flex items-center border-b pb-4 mb-4">
        <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Filter ZIP Codes</h3>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
            Opportunity Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup 
            type="single" 
            value={opportunityFilter} 
            onValueChange={(value) => {
              if (value) setOpportunityFilter(value as 'Low' | 'Medium' | 'High' | 'All');
            }} 
            className="justify-start gap-1"
          >
            <ToggleGroupItem value="Low" className="text-xs rounded-md">Low</ToggleGroupItem>
            <ToggleGroupItem value="Medium" className="text-xs rounded-md">Medium</ToggleGroupItem>
            <ToggleGroupItem value="High" className="text-xs rounded-md">High</ToggleGroupItem>
            <ToggleGroupItem value="All" className="text-xs rounded-md">All</ToggleGroupItem>
          </ToggleGroup>
          <div className="mt-3 text-xs text-muted-foreground">
            <span className="block">Low: &lt; $10M</span>
            <span className="block">Medium: $10M-$50M</span>
            <span className="block">High: &gt; $50M</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <Label htmlFor="urbanicity-filter" className="flex items-center text-sm font-medium">
          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
          Urbanicity Type
        </Label>
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
  );
};

export default OpportunityFilterPanel;

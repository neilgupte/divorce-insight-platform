
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, InfoIcon } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface MapSearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  activeFilters: string[];
  filters?: any;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  activeFilters,
  filters
}) => {
  return (
    <div className="mb-4 flex gap-2">
      <Input
        type="text"
        placeholder="Search for a location..."
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <Button onClick={onSearch}>
        <Search className="h-4 w-4" />
      </Button>
      
      {activeFilters.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <InfoIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 p-1">
                <p className="font-medium text-sm">Active Filters:</p>
                <ul className="text-xs">
                  {activeFilters.map(filter => (
                    <li key={filter}>
                      {filter === 'divorceRate' && `Divorce Rate: ≥ ${filters?.divorceRate?.min}%`}
                      {filter === 'netWorth' && `Net Worth: $${filters?.netWorth?.min}M - $${filters?.netWorth?.max}M`}
                      {filter === 'luxuryDensity' && `Luxury Density: ≥ ${filters?.luxuryDensity?.min}/km²`}
                      {filter === 'multiProperty' && `Multi-Property: ≥ ${filters?.multiProperty?.min}%`}
                    </li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default MapSearchBar;


import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapFilters } from "./utils/mapUtils";
import FiltersPanel from "./filters/FiltersPanel";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DummyMapOverlayProps {
  open: boolean;
  onClose: () => void;
  initialState: string | null;
  initialCity: string | null;
}

const DummyMapOverlay: React.FC<DummyMapOverlayProps> = ({
  open,
  onClose,
  initialState,
  initialCity,
}) => {
  const [selectedState, setSelectedState] = useState<string | null>(initialState);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    state: selectedState,
    divorceRate: {
      enabled: true,
      min: 3.0,
    },
    netWorth: {
      enabled: true,
      min: 5,
      max: 50,
    },
    luxuryDensity: {
      enabled: false,
      min: 2,
    },
    multiProperty: {
      enabled: false,
      min: 1,
    },
  });

  // Update filters when state changes
  const handleStateChange = (state: string | null) => {
    setSelectedState(state);
    setFilters({ ...filters, state });
  };

  // Update specific filter setting
  const updateFilter = <K extends keyof MapFilters, S extends keyof MapFilters[K]>(
    category: K,
    setting: S,
    value: MapFilters[K][S]
  ) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [setting]: value,
      },
    });
  };

  const handleDeleteView = (viewId: string) => {
    setSelectedView(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex p-0 gap-0 overflow-hidden">
        <FiltersPanel
          filters={filters}
          selectedState={selectedState}
          selectedView={selectedView}
          updateFilter={updateFilter}
          onStateChange={handleStateChange}
          onDeleteView={handleDeleteView}
        />
        
        <div className="flex-1 p-4 flex flex-col h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {selectedState || "United States"} High-Net-Worth Divorce Heatmap
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative flex-1 rounded-md overflow-hidden border">
            {/* Map Image */}
            <img 
              src="/lovable-uploads/d50e0d7a-b4c6-4703-ad4d-0819c90db94e.png" 
              alt="USA Map with Hotspots" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Hotspots */}
            <div className="absolute inset-0">
              {/* San Francisco */}
              <div className="absolute left-[12%] top-[40%] cursor-pointer group">
                <div className="w-8 h-8 bg-blue-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                  <div className="font-semibold">San Francisco</div>
                  <div className="text-sm">Divorce Rate: 4.2%</div>
                  <div className="text-sm">Avg. Net Worth: $35.6M</div>
                </div>
              </div>
              
              {/* New York */}
              <div className="absolute left-[78%] top-[32%] cursor-pointer group">
                <div className="w-8 h-8 bg-red-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
                <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                  <div className="font-semibold">New York</div>
                  <div className="text-sm">Divorce Rate: 5.2%</div>
                  <div className="text-sm">Avg. Net Worth: $18.5M</div>
                </div>
              </div>
              
              {/* Miami */}
              <div className="absolute left-[78%] top-[76%] cursor-pointer group">
                <div className="w-8 h-8 bg-orange-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                </div>
                <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                  <div className="font-semibold">Miami</div>
                  <div className="text-sm">Divorce Rate: 7.2%</div>
                  <div className="text-sm">Avg. Net Worth: $28.4M</div>
                </div>
              </div>
              
              {/* Chicago */}
              <div className="absolute left-[60%] top-[30%] cursor-pointer group">
                <div className="w-8 h-8 bg-green-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                  <div className="font-semibold">Chicago</div>
                  <div className="text-sm">Divorce Rate: 4.8%</div>
                  <div className="text-sm">Avg. Net Worth: $12.4M</div>
                </div>
              </div>
              
              {/* Phoenix */}
              <div className="absolute left-[22%] top-[52%] cursor-pointer group">
                <div className="w-8 h-8 bg-yellow-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                  <div className="font-semibold">Phoenix</div>
                  <div className="text-sm">Divorce Rate: 6.3%</div>
                  <div className="text-sm">Avg. Net Worth: $10.5M</div>
                </div>
              </div>
              
              {/* LA */}
              <div className="absolute left-[15%] top-[52%] cursor-pointer group">
                <div className="w-8 h-8 bg-blue-500/40 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10 w-48">
                  <div className="font-semibold">Los Angeles</div>
                  <div className="text-sm">Divorce Rate: 6.1%</div>
                  <div className="text-sm">Avg. Net Worth: $22.7M</div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-md shadow">
              <div className="text-sm font-medium mb-1">Divorce Rate</div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs">Low</span>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DummyMapOverlay;

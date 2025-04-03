
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import InteractiveStateMap from "./map/InteractiveStateMap";
import FilterSidebar from "./map/FilterSidebar";
import ZIPDetailPanel from "./map/ZIPDetailPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { getStateAbbreviation } from "@/lib/zipUtils";

export interface ZIPCodeDetail {
  zipCode: string;
  county: string;
  state: string;
  opportunity: number;
  urbanicity: 'Urban' | 'Suburban' | 'Rural';
  netWorth: number;
  divorceRate: number;
  hasOffice: boolean;
}

interface StateMapsOverlayProps {
  open: boolean;
  onClose: () => void;
  initialState?: string;
}

const StateMapsOverlay: React.FC<StateMapsOverlayProps> = ({ 
  open, 
  onClose,
  initialState = "CA" 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedZIPDetail, setSelectedZIPDetail] = useState<ZIPCodeDetail | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Get initial state name from abbreviation
  const getStateNameFromAbbreviation = (abbr: string): string => {
    // Create a reverse mapping of state abbreviations to names
    const stateMap: Record<string, string> = {};
    Object.entries({
      Alabama: "AL",
      Alaska: "AK",
      Arizona: "AZ",
      Arkansas: "AR",
      California: "CA",
      Colorado: "CO",
      Connecticut: "CT",
      Delaware: "DE",
      Florida: "FL",
      Georgia: "GA",
      Hawaii: "HI",
      Idaho: "ID",
      Illinois: "IL",
      Indiana: "IN",
      Iowa: "IA",
      Kansas: "KS",
      Kentucky: "KY",
      Louisiana: "LA",
      Maine: "ME",
      Maryland: "MD",
      Massachusetts: "MA",
      Michigan: "MI",
      Minnesota: "MN",
      Mississippi: "MS",
      Missouri: "MO",
      Montana: "MT",
      Nebraska: "NE",
      Nevada: "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      Ohio: "OH",
      Oklahoma: "OK",
      Oregon: "OR",
      Pennsylvania: "PA",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      Tennessee: "TN",
      Texas: "TX",
      Utah: "UT",
      Vermont: "VT",
      Virginia: "VA",
      Washington: "WA",
      "West Virginia": "WV",
      Wisconsin: "WI",
      Wyoming: "WY",
    }).forEach(([name, abbreviation]) => {
      stateMap[abbreviation] = name;
    });
    
    return stateMap[abbr] || "California";
  };
  
  const [selectedState, setSelectedState] = useState<string>(getStateNameFromAbbreviation(initialState));
  
  // Filter states
  const [urbanicityFilter, setUrbanicityFilter] = useState<'All' | 'Urban' | 'Suburban' | 'Rural'>('All');
  const [opportunityFilter, setOpportunityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [netWorthRange, setNetWorthRange] = useState<[number, number]>([0.5, 25]); // $500k to $25M
  const [divorceRateThreshold, setDivorceRateThreshold] = useState<number>(0); // 0% to 100%
  const [hideExistingOffices, setHideExistingOffices] = useState<boolean>(false);

  // Handle ZIP selection
  const handleZIPSelect = (detail: ZIPCodeDetail) => {
    setSelectedZIPDetail(detail);
  };

  // Handle ZIP panel close
  const handleZIPDetailClose = () => {
    setSelectedZIPDetail(null);
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle state change
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    setSelectedZIPDetail(null); // Clear any selected ZIP details
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()} modal>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">ZIP Code Opportunity Map</DialogTitle>
            <DialogDescription>
              Explore ZIP-level opportunity data by state and apply filters
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {!sidebarCollapsed && (
              <>
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <FilterSidebar
                    selectedState={selectedState}
                    onStateChange={handleStateChange}
                    urbanicityFilter={urbanicityFilter}
                    onUrbanicityFilterChange={setUrbanicityFilter}
                    opportunityFilter={opportunityFilter}
                    onOpportunityFilterChange={setOpportunityFilter}
                    netWorthRange={netWorthRange}
                    onNetWorthRangeChange={setNetWorthRange}
                    divorceRateThreshold={divorceRateThreshold}
                    onDivorceRateThresholdChange={setDivorceRateThreshold}
                    hideExistingOffices={hideExistingOffices}
                    onHideExistingOfficesChange={setHideExistingOffices}
                    onToggleSidebar={toggleSidebar}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            
            <ResizablePanel defaultSize={sidebarCollapsed ? 100 : 80}>
              <div className="relative h-full">
                {loading && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Loading map data...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md text-center">
                      <p className="text-sm font-medium">{error}</p>
                      <button 
                        className="mt-2 text-xs underline"
                        onClick={() => setError(null)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
                
                <InteractiveStateMap
                  selectedState={selectedState}
                  onZIPSelect={handleZIPSelect}
                  setLoading={setLoading}
                  setError={setError}
                  toggleSidebar={toggleSidebar}
                  sidebarCollapsed={sidebarCollapsed}
                  filters={{
                    urbanicity: urbanicityFilter,
                    opportunity: opportunityFilter,
                    netWorthRange,
                    divorceRateThreshold,
                    hideExistingOffices
                  }}
                />
                
                {selectedZIPDetail && (
                  <ZIPDetailPanel
                    zipDetail={selectedZIPDetail}
                    onClose={handleZIPDetailClose}
                  />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StateMapsOverlay;

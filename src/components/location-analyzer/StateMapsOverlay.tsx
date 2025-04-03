
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
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedZIPDetail, setSelectedZIPDetail] = useState<ZIPCodeDetail | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
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
                    onStateChange={setSelectedState}
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

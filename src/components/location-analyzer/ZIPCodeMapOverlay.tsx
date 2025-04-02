import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ZIPCodeData, generateMockZIPData } from "@/lib/zipUtils";
import LeafletMap from "./LeafletMap";
import ZIPCodeDetailOverlay from "./ZIPCodeDetailOverlay";
import MapHeaderControls from "./map-controls/MapHeaderControls";
import MapFilterPanel from "./map-filters/MapFilterPanel";
import { useMediaQuery } from "@/hooks/use-media-query";
import 'leaflet/dist/leaflet.css';
import "@/styles/leaflet-fixes.css";

interface ZIPCodeMapOverlayProps {
  open: boolean;
  onClose: () => void;
  initialState?: string;
  initialCity?: string;
}

const ZIPCodeMapOverlay: React.FC<ZIPCodeMapOverlayProps> = ({
  open,
  onClose,
  initialState = "All States",
  initialCity = "All Cities"
}) => {
  const [opportunityFilter, setOpportunityFilter] = useState<'Low' | 'Medium' | 'High' | 'All'>('All');
  const [urbanicityFilter, setUrbanicityFilter] = useState<'Urban' | 'Suburban' | 'Rural' | 'All'>('All');
  const [netWorthRange, setNetWorthRange] = useState<[number, number]>([5, 50]);
  const [divorceRateThreshold, setDivorceRateThreshold] = useState<number>(3);
  const [showExistingOffices, setShowExistingOffices] = useState<boolean>(false);
  const [zipData, setZipData] = useState<ZIPCodeData[]>([]);
  const [selectedZipCode, setSelectedZipCode] = useState<ZIPCodeData | null>(null);
  const [filterPanelCollapsed, setFilterPanelCollapsed] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setFilterPanelCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    const mockData = generateMockZIPData(
      initialState,
      initialCity,
      urbanicityFilter,
      netWorthRange,
      divorceRateThreshold,
      3,
      50
    );
    setZipData(mockData);
  }, [initialState, initialCity, urbanicityFilter, netWorthRange, divorceRateThreshold]);

  const handleZipClick = (data: ZIPCodeData) => {
    setSelectedZipCode(data);
  };

  const handleCloseZipDetail = () => {
    setSelectedZipCode(null);
  };

  const toggleFilterPanel = () => {
    setFilterPanelCollapsed(!filterPanelCollapsed);
  };

  const officeLocations = [
    { city: "New York", position: [40.7128, -74.0060] as [number, number] },
    { city: "Los Angeles", position: [34.0522, -118.2437] as [number, number] },
    { city: "Chicago", position: [41.8781, -87.6298] as [number, number] },
    { city: "Miami", position: [25.7617, -80.1918] as [number, number] },
    { city: "San Francisco", position: [37.7749, -122.4194] as [number, number] }
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">ZIP Code Opportunity Map</DialogTitle>
            <DialogDescription>
              Explore ZIP-level opportunity data across the United States
            </DialogDescription>
          </div>
          
          <MapHeaderControls onClose={onClose} />
        </DialogHeader>
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <MapFilterPanel
              opportunityFilter={opportunityFilter}
              setOpportunityFilter={setOpportunityFilter}
              urbanicityFilter={urbanicityFilter}
              setUrbanicityFilter={setUrbanicityFilter}
              netWorthRange={netWorthRange}
              setNetWorthRange={setNetWorthRange}
              divorceRateThreshold={divorceRateThreshold}
              setDivorceRateThreshold={setDivorceRateThreshold}
              showExistingOffices={showExistingOffices}
              setShowExistingOffices={setShowExistingOffices}
              isCollapsed={filterPanelCollapsed}
              toggleCollapse={toggleFilterPanel}
            />
            
            <div className="flex-1 relative">
              <LeafletMap 
                zipData={zipData}
                onZipClick={handleZipClick}
                opportunityFilter={opportunityFilter}
                urbanicityFilter={urbanicityFilter}
                showOfficeLocations={showExistingOffices}
                officeLocations={officeLocations}
                fullscreen={true}
              />
              
              {selectedZipCode && (
                <ZIPCodeDetailOverlay
                  zipCodeData={selectedZipCode}
                  onClose={handleCloseZipDetail}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZIPCodeMapOverlay;

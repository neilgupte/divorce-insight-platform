
import React from "react";
import MapLegend from "./components/MapLegend";
import ExpandSidebarButton from "./components/ExpandSidebarButton";
import MapContainer from "./components/MapContainer";
import { useMapbox } from "./hooks/useMapbox";
import { ZIPCodeDetail } from "../StateMapsOverlay";
import "mapbox-gl/dist/mapbox-gl.css";

interface Filters {
  urbanicity: 'All' | 'Urban' | 'Suburban' | 'Rural';
  opportunity: 'All' | 'Low' | 'Medium' | 'High';
  netWorthRange: [number, number];
  divorceRateThreshold: number;
  showExistingOffices: boolean; // Changed from hideExistingOffices to showExistingOffices
}

interface InteractiveStateMapProps {
  selectedState: string;
  onZIPSelect: (detail: ZIPCodeDetail) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
  filters: Filters;
}

const InteractiveStateMap: React.FC<InteractiveStateMapProps> = ({
  selectedState,
  onZIPSelect,
  setLoading,
  setError,
  toggleSidebar,
  sidebarCollapsed,
  filters
}) => {
  const { mapContainer } = useMapbox({
    selectedState,
    onZIPSelect,
    setLoading,
    setError,
    filters
  });
  
  return (
    <div className="relative h-full w-full">
      {sidebarCollapsed && (
        <ExpandSidebarButton onClick={toggleSidebar} />
      )}
      
      <MapContainer mapRef={mapContainer} />
      <MapLegend />
    </div>
  );
};

export default InteractiveStateMap;

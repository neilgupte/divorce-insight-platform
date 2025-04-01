
import React, { useState } from "react";
import ZIPCodeHeatmap from "./ZIPCodeHeatmap";
import ZIPCodeTable from "./ZIPCodeTable";
import ZIPCodeDetailOverlay from "./ZIPCodeDetailOverlay";
import { ZIPCodeData } from "@/lib/zipUtils";

interface ZIPCodeAnalysisProps {
  selectedState: string;
  selectedCity: string;
  netWorthRange: [number, number];
  divorceRateThreshold: number;
  usStates: string[];
  availableCities: string[];
}

const ZIPCodeAnalysis: React.FC<ZIPCodeAnalysisProps> = ({
  selectedState,
  selectedCity,
  netWorthRange,
  divorceRateThreshold,
  usStates,
  availableCities
}) => {
  const [heatmapExpanded, setHeatmapExpanded] = useState(false);
  const [tableExpanded, setTableExpanded] = useState(false);
  const [selectedZipCode, setSelectedZipCode] = useState<ZIPCodeData | null>(null);
  
  // Only one view can be expanded at a time
  const toggleHeatmapExpand = () => {
    setHeatmapExpanded(!heatmapExpanded);
    if (!heatmapExpanded) setTableExpanded(false);
  };
  
  const toggleTableExpand = () => {
    setTableExpanded(!tableExpanded);
    if (!tableExpanded) setHeatmapExpanded(false);
  };

  const handleZipCodeSelect = (zipData: ZIPCodeData) => {
    setSelectedZipCode(zipData);
  };

  const handleCloseOverlay = () => {
    setSelectedZipCode(null);
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">ZIP Code Opportunity Analysis</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ZIPCodeHeatmap
          selectedState={selectedState}
          selectedCity={selectedCity}
          netWorthRange={netWorthRange}
          divorceRateThreshold={divorceRateThreshold}
          expanded={heatmapExpanded}
          onToggleExpand={toggleHeatmapExpand}
          usStates={usStates}
          availableCities={availableCities}
          onZipCodeSelect={handleZipCodeSelect}
        />
        
        <ZIPCodeTable
          selectedState={selectedState}
          selectedCity={selectedCity}
          netWorthRange={netWorthRange}
          divorceRateThreshold={divorceRateThreshold}
          expanded={tableExpanded}
          onToggleExpand={toggleTableExpand}
          usStates={usStates}
          availableCities={availableCities}
          onZipCodeSelect={handleZipCodeSelect}
        />
      </div>

      {selectedZipCode && (
        <ZIPCodeDetailOverlay
          zipCodeData={selectedZipCode}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
};

export default ZIPCodeAnalysis;

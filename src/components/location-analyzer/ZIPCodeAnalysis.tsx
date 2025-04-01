
import React, { useState } from "react";
import ZIPCodeTable from "./ZIPCodeTable";
import ZIPCodeDetailOverlay from "./ZIPCodeDetailOverlay";
import ZIPOpportunitySummary from "./ZIPOpportunitySummary";
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
  const [tableExpanded, setTableExpanded] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [selectedZipCode, setSelectedZipCode] = useState<ZIPCodeData | null>(null);
  const [urbanicityFilter, setUrbanicityFilter] = useState<'Urban' | 'Suburban' | 'Rural' | 'All'>('All');
  const [opportunityFilter, setOpportunityFilter] = useState<'Low' | 'Medium' | 'High' | 'All'>('All');
  
  // Only one view can be expanded at a time
  const toggleTableExpand = () => {
    setTableExpanded(!tableExpanded);
    if (!tableExpanded) setSummaryExpanded(false);
  };
  
  const toggleSummaryExpand = () => {
    setSummaryExpanded(!summaryExpanded);
    if (!summaryExpanded) setTableExpanded(false);
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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table on the left (66% width) */}
        <div className="lg:col-span-8">
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
        
        {/* Summary card on the right (34% width) */}
        <div className="lg:col-span-4">
          <ZIPOpportunitySummary
            selectedState={selectedState}
            selectedCity={selectedCity}
            expanded={summaryExpanded}
            onToggleExpand={toggleSummaryExpand}
            netWorthRange={netWorthRange}
            divorceRateThreshold={divorceRateThreshold}
            urbanicityFilter={urbanicityFilter}
            opportunityFilter={opportunityFilter}
          />
        </div>
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

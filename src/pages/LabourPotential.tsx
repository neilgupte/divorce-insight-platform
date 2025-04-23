
import { useState } from "react";
import LabourSidebar from "@/components/labour-potential/LabourSidebar";
import LabourDashboard from "@/components/labour-potential/LabourDashboard";
import SearchLocation from "@/components/labour-potential/SearchLocation";
import SupplyDemandView from "@/components/labour-potential/SupplyDemandView";
import MarketReportGenerator from "@/components/labour-potential/MarketReportGenerator";
import LabourSettings from "@/components/labour-potential/LabourSettings";

type LabourView = "dashboard" | "search" | "supply-demand" | "reports" | "settings";

const LabourPotential = () => {
  const [activeView, setActiveView] = useState<LabourView>("dashboard");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // Handler for when a location analysis is run
  const handleRunAnalysis = (location: string) => {
    setSelectedLocation(location);
    setActiveView("supply-demand");
  };
  
  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)]">
      <LabourSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 overflow-auto">
        {activeView === "dashboard" && (
          <LabourDashboard onNewAnalysis={() => setActiveView("search")} />
        )}
        {activeView === "search" && (
          <SearchLocation onRunAnalysis={handleRunAnalysis} />
        )}
        {activeView === "supply-demand" && (
          <SupplyDemandView 
            location={selectedLocation} 
            onGenerateReport={() => setActiveView("reports")}
          />
        )}
        {activeView === "reports" && (
          <MarketReportGenerator location={selectedLocation} />
        )}
        {activeView === "settings" && (
          <LabourSettings />
        )}
      </div>
    </div>
  );
};

export default LabourPotential;

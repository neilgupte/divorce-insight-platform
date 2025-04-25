
import React from "react";
import { useLabourPotential } from "./LabourPotentialProvider";
import SearchLocation from "./SearchLocation";
import SupplyDemandView from "./SupplyDemandView";
import MarketReportGenerator from "./MarketReportGenerator";

interface LabourPotentialWrapperProps {
  component: "search" | "supply-demand" | "reports";
}

const LabourPotentialWrapper: React.FC<LabourPotentialWrapperProps> = ({ component }) => {
  const { location, setLocation, generateReport } = useLabourPotential();

  switch (component) {
    case "search":
      return <SearchLocation onRunAnalysis={setLocation} />;
    case "supply-demand":
      return <SupplyDemandView location={location} onGenerateReport={generateReport} />;
    case "reports":
      return <MarketReportGenerator location={location} />;
    default:
      return null;
  }
};

export default LabourPotentialWrapper;


import React from "react";
import LabourFunnel from "./LabourFunnel";
import LabourScore from "./LabourScore";
import FactorDrivers from "./FactorDrivers";

const LabourPotentialFunnel: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Labour Funnel - 40% width */}
        <div className="lg:col-span-5">
          <LabourFunnel />
        </div>
        
        {/* Labour Score - 60% width */}
        <div className="lg:col-span-7">
          <LabourScore location="San Francisco, CA" />
        </div>
      </div>
      
      {/* Factor Drivers - Full width */}
      <div>
        <FactorDrivers />
      </div>
    </div>
  );
};

export default LabourPotentialFunnel;

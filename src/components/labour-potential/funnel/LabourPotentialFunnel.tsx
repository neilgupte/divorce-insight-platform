
import React from "react";
import LabourFunnel from "./LabourFunnel";
import LabourScore from "./LabourScore";
import FactorDrivers from "./FactorDrivers";

const LabourPotentialFunnel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <LabourScore />
          <LabourFunnel />
        </div>
        <div className="col-span-3">
          <FactorDrivers />
        </div>
      </div>
    </div>
  );
};

export default LabourPotentialFunnel;

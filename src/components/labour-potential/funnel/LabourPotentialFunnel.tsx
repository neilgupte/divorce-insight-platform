
import React from "react";
import LabourFunnel from "./LabourFunnel";
import LabourScore from "./LabourScore";
import FactorDrivers from "./FactorDrivers";

const LabourPotentialFunnel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-4">
          <LabourFunnel />
        </div>
        <div className="col-span-6">
          <LabourScore />
          <div className="mt-6">
            <FactorDrivers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourPotentialFunnel;

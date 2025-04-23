import { Outlet } from "react-router-dom";

const LabourPotential = () => {
  return (
    <div className="flex-1 overflow-auto">
      <Outlet />
    </div>
  );
};

export default LabourPotential;

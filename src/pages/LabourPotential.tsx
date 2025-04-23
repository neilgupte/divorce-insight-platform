import LabourSidebar from "@/components/labour-potential/LabourSidebar";
import { Outlet } from "react-router-dom";

const LabourPotential = () => {
  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)]">
      <LabourSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default LabourPotential;

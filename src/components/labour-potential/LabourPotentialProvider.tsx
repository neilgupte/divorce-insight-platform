
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface LabourPotentialContextType {
  location: string | null;
  setLocation: (location: string) => void;
  generateReport: () => void;
}

interface LabourPotentialProviderProps {
  children?: ReactNode;
}

const LabourPotentialContext = createContext<LabourPotentialContextType | undefined>(undefined);

export const useLabourPotential = (): LabourPotentialContextType => {
  const context = useContext(LabourPotentialContext);
  if (!context) {
    throw new Error("useLabourPotential must be used within a LabourPotentialProvider");
  }
  return context;
};

export const LabourPotentialProvider: React.FC<LabourPotentialProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<string | null>(null);

  const handleRunAnalysis = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleGenerateReport = () => {
    console.log("Generating report for location:", location);
    // In a real app, this would do something more meaningful
  };

  return (
    <LabourPotentialContext.Provider 
      value={{
        location,
        setLocation: handleRunAnalysis,
        generateReport: handleGenerateReport
      }}
    >
      {children || <Outlet />}
    </LabourPotentialContext.Provider>
  );
};

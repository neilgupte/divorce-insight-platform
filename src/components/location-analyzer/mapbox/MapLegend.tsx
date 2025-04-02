
import React from "react";

const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md z-10">
      <h3 className="text-sm font-semibold mb-2">ZIP Code Data</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-2 bg-red-700 opacity-70"></div>
          <span className="text-xs">High Density</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-2 bg-red-500 opacity-70"></div>
          <span className="text-xs">Medium Density</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-2 bg-red-300 opacity-70"></div>
          <span className="text-xs">Low Density</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;

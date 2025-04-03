
import React from "react";

const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-background/90 p-2 rounded-md shadow-md">
      <div className="text-xs font-medium mb-1">Opportunity Level</div>
      <div className="flex gap-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span className="text-xs">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-700 rounded-sm"></div>
          <span className="text-xs">Med</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-900 rounded-sm"></div>
          <span className="text-xs">High</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;

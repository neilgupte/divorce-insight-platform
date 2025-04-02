
import React from "react";

interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  title?: string;
  items?: LegendItem[];
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const MapLegend: React.FC<MapLegendProps> = ({ 
  title = "ZIP Code Data",
  items = [
    { color: "bg-red-700", label: "High Density" },
    { color: "bg-red-500", label: "Medium Density" },
    { color: "bg-red-300", label: "Low Density" }
  ],
  position = "bottom-right"
}) => {
  // Map position classes
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4"
  };

  return (
    <div className={`absolute ${positionClasses[position]} bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md z-10`}>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-4 h-4 rounded-sm mr-2 ${item.color} opacity-70`}></div>
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;

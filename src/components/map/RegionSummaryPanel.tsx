
import React from 'react';
import { MapPin } from 'lucide-react';
import { RegionSummary } from './utils/mapUtils';

interface RegionSummaryPanelProps {
  regionSummary: RegionSummary;
}

const RegionSummaryPanel: React.FC<RegionSummaryPanelProps> = ({ regionSummary }) => {
  return (
    <div className="w-64 h-fit bg-card border rounded-md p-4 self-start">
      <div className="flex items-center mb-3">
        <MapPin className="h-4 w-4 mr-2 text-primary" />
        <h3 className="font-medium">{regionSummary.region}</h3>
      </div>
      <div className="space-y-2">
        {regionSummary.metrics.map((metric, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-sm text-muted-foreground">{metric.label}:</span>
            <span className="text-sm font-medium">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionSummaryPanel;

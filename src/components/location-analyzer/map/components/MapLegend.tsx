
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const MapLegend = () => {
  return (
    <Card className="absolute bottom-4 left-4 shadow-md z-10 w-auto">
      <CardContent className="p-3">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Opportunity Level</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#7f1d1d] rounded mr-2" />
              <span>High ($10M+)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#b91c1c] rounded mr-2" />
              <span>Medium ($1M-$10M)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ef4444] rounded mr-2" />
              <span>Low (&lt;$1M)</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-4 h-4 bg-[#3b82f6] rounded-full border-2 border-white mr-2" />
              <span>Existing Office</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLegend;

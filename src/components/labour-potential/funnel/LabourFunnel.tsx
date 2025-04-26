import React from "react";
import { Button } from "@/components/ui/button";

const LabourFunnel: React.FC<any> = (props) => {
  const { data, isLoading, error } = props;
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading funnel data...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading funnel data</div>;
  }
  
  if (!data) {
    return <div className="flex items-center justify-center h-full">No funnel data available</div>;
  }
  
  // Example funnel data visualization
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Labour Supply Funnel</h3>
        <Button size="sm" variant="outline" className="h-8">
          Export
        </Button>
      </div>
      
      <div className="space-y-2">
        {/* Funnel stages */}
        <div className="bg-primary/10 p-3 rounded-md">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Total Available Workforce</span>
            <span className="text-sm font-semibold">{data.totalWorkforce.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-primary/20 p-3 rounded-md ml-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Qualified Candidates</span>
            <span className="text-sm font-semibold">{data.qualifiedCandidates.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-primary/30 p-3 rounded-md ml-8">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Interested Candidates</span>
            <span className="text-sm font-semibold">{data.interestedCandidates.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-primary/40 p-3 rounded-md ml-12">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Available for Hire</span>
            <span className="text-sm font-semibold">{data.availableForHire.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-primary/50 p-3 rounded-md ml-16">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Likely to Accept Offer</span>
            <span className="text-sm font-semibold">{data.likelyToAccept.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <div className="text-xs text-muted-foreground">
          <p>Conversion rate from total to final stage: {data.conversionRate}%</p>
          <p>Industry average: {data.industryAverage}%</p>
        </div>
      </div>
    </div>
  );
};

export default LabourFunnel;

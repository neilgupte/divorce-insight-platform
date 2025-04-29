
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Brain, ChevronDown, Info, Settings, Zap } from "lucide-react";

interface Facility {
  id: string;
  name: string;
  workers: number;
  neededWorkers: number;
  marginalValue: number;
  utilisation: number;
  attrition: number;
  commuteTime: number;
  laborPoolIndex: number;
  type: string;
  lat: number;
  lng: number;
}

interface InsightsPanelProps {
  selectedFacility: Facility | null;
  facilities: Facility[];
  initialInsightType?: "network" | "facility" | "scenario";
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  selectedFacility, 
  facilities,
  initialInsightType = "general"
}) => {
  const [insightType, setInsightType] = useState(initialInsightType);
  const [scenarioType, setScenarioType] = useState("none");

  // Update insightType when initialInsightType prop changes
  useEffect(() => {
    setInsightType(initialInsightType);
  }, [initialInsightType]);

  const renderGlobalInsights = () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-full bg-amber-100">
          <Zap className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h4 className="font-medium text-sm">High Attrition in Urban Facilities</h4>
          <p className="text-sm text-muted-foreground">
            Urban facilities show 18% higher attrition rates compared to suburban locations. 
            Consider offering enhanced transportation benefits or flexible scheduling options.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-full bg-blue-100">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Workforce Gaps Analysis</h4>
          <p className="text-sm text-muted-foreground">
            Your network has a total shortage of {facilities.reduce((sum, f) => sum + f.neededWorkers, 0)} workers. 
            Central Valley Distribution has the largest gap with 30 open positions to fill.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-full bg-green-100">
          <Brain className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Optimization Opportunity</h4>
          <p className="text-sm text-muted-foreground">
            Shifting 15% of workload from Central Valley to South Bay Storage could reduce overall commute times 
            by 12% and increase network utilization efficiency by 7%.
          </p>
        </div>
      </div>
    </div>
  );

  const renderFacilityInsights = () => {
    if (!selectedFacility) {
      return (
        <div className="text-center p-6 text-muted-foreground">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Select a facility to view specific insights</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-blue-100">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{selectedFacility.name} Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {selectedFacility.name} is currently operating at {(selectedFacility.utilisation * 100).toFixed(0)}% utilization 
              with {selectedFacility.neededWorkers} open positions. The labor pool index of {selectedFacility.laborPoolIndex.toFixed(2)} 
              indicates {selectedFacility.laborPoolIndex > 0.7 ? "good" : "limited"} hiring potential.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-amber-100">
            <Zap className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Performance Metrics</h4>
            <p className="text-sm text-muted-foreground">
              Average commute time ({selectedFacility.commuteTime} minutes) is {
                selectedFacility.commuteTime > 30 ? "above" : "below"
              } network average. Attrition rate of {(selectedFacility.attrition * 100).toFixed(0)}% is {
                selectedFacility.attrition > 0.15 ? "concerning and above" : "within acceptable range of"
              } industry standards.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-green-100">
            <Brain className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Recommended Actions</h4>
            <p className="text-sm text-muted-foreground">
              {
                selectedFacility.neededWorkers > 20 
                  ? `Prioritize hiring at this location. Consider expanding recruitment radius and offering relocation incentives.` 
                : selectedFacility.attrition > 0.18
                  ? `Focus on retention strategies. Exit interviews indicate commute time is a primary factor in turnover.`
                : selectedFacility.utilisation > 0.95
                  ? `This facility is approaching capacity. Consider load balancing with nearby facilities.`
                : `Maintain current operations. This facility is performing within optimal parameters.`
              }
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderScenarioInsights = () => {
    if (scenarioType === "none") {
      return (
        <div className="text-center p-6 text-muted-foreground">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Select a scenario type to run a simulation</p>
        </div>
      );
    }

    let scenarioContent;
    
    switch(scenarioType) {
      case "closure":
        scenarioContent = (
          <div className="space-y-3">
            <p className="text-sm">
              If Central Valley Distribution were to close, the simulation predicts:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>30% increased workload at Eastside Fulfillment</li>
              <li>Average commute times would increase by 8.5 minutes network-wide</li>
              <li>Estimated 22% increase in attrition at neighboring facilities</li>
              <li>Labor cost increase of approximately 12% due to overtime requirements</li>
            </ul>
            <p className="text-sm font-medium mt-4">
              Recommendation: Closure not advised without establishing a new facility in the region.
            </p>
          </div>
        );
        break;
      case "expansion":
        scenarioContent = (
          <div className="space-y-3">
            <p className="text-sm">
              Expanding North County Logistics capacity by 40% would result in:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Reduced pressure on Downtown Distribution Center by 25%</li>
              <li>Potential reduction in average commute times by 4.2 minutes</li>
              <li>Estimated 7% decrease in overall network attrition rate</li>
              <li>15% improvement in network utilization balance</li>
            </ul>
            <p className="text-sm font-medium mt-4">
              Recommendation: Expansion appears beneficial. Consider phased approach starting with 20% capacity increase.
            </p>
          </div>
        );
        break;
      case "redistribution":
        scenarioContent = (
          <div className="space-y-3">
            <p className="text-sm">
              Redistributing workload to optimize commute times would:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Decrease average commute time by 6.3 minutes</li>
              <li>Reduce attrition rates by an estimated 9%</li>
              <li>Balance utilization rates within 8% across all facilities</li>
              <li>Save approximately $240,000 annually in hiring and training costs</li>
            </ul>
            <p className="text-sm font-medium mt-4">
              Recommendation: Implement redistribution plan with focus on South Bay and Central Valley facilities.
            </p>
          </div>
        );
        break;
      default:
        scenarioContent = <p>Select a scenario to analyze</p>;
    }
    
    return (
      <Card className="p-4 bg-muted/50">
        <h4 className="font-medium mb-3">Scenario Analysis Results</h4>
        {scenarioContent}
      </Card>
    );
  };

  // We've removed the buttons since they're now in the NetworkDashboard component
  return (
    <div className="space-y-4">
      {/* Show scenario selector only when scenario tab is selected */}
      {insightType === "scenario" && (
        <div className="flex items-center">
          <Select value={scenarioType} onValueChange={setScenarioType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a scenario...</SelectItem>
              <SelectItem value="closure">Facility Closure</SelectItem>
              <SelectItem value="expansion">Capacity Expansion</SelectItem>
              <SelectItem value="redistribution">Workload Redistribution</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Insights content based on selected type */}
      <div className="pt-2">
        {insightType === "network" && renderGlobalInsights()}
        {insightType === "facility" && renderFacilityInsights()}
        {insightType === "scenario" && renderScenarioInsights()}
      </div>
    </div>
  );
};

export default InsightsPanel;

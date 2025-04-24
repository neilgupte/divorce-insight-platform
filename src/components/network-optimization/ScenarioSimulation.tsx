
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronDown, 
  BarChart, 
  Building, 
  Network, 
  Search,
  BadgeDollarSign,
  Timer,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ScenarioSimulation = () => {
  const [scenarioType, setScenarioType] = useState("none");
  const [facility, setFacility] = useState("none");
  const [impactLevel, setImpactLevel] = useState([50]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<null | {
    workforceImpact: number;
    commuteTimes: number;
    operationalCosts: number;
    laborEfficiency: number;
  }>(null);
  
  const { toast } = useToast();

  const handleRunSimulation = () => {
    if (scenarioType === "none" || facility === "none") {
      toast({
        title: "Missing input",
        description: "Please select both a scenario type and facility.",
        variant: "destructive"
      });
      return;
    }
    
    setSimulationRunning(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      // Generate mock results based on inputs
      const impact = impactLevel[0] / 100;
      
      const results = {
        workforceImpact: scenarioType === "closure" ? -35 * impact : scenarioType === "expansion" ? 25 * impact : 5 * impact,
        commuteTimes: scenarioType === "closure" ? 8.5 * impact : scenarioType === "expansion" ? -4.2 * impact : -6.3 * impact,
        operationalCosts: scenarioType === "closure" ? 12 * impact : scenarioType === "expansion" ? 18 * impact : -7 * impact,
        laborEfficiency: scenarioType === "closure" ? -15 * impact : scenarioType === "expansion" ? 12 * impact : 9 * impact
      };
      
      setSimulationResults(results);
      setSimulationRunning(false);
      
      toast({
        title: "Simulation complete",
        description: `Impact analysis for ${scenarioType} scenario ready to view.`,
      });
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scenario Simulation</h1>
        <p className="text-muted-foreground">
          Model potential changes to your network and analyze their impact
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Configure Scenario</CardTitle>
            <CardDescription>Define the parameters for your simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Scenario Type</label>
              <Select value={scenarioType} onValueChange={setScenarioType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select scenario type...</SelectItem>
                  <SelectItem value="closure">Facility Closure</SelectItem>
                  <SelectItem value="expansion">Capacity Expansion</SelectItem>
                  <SelectItem value="redistribution">Workload Redistribution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Facility</label>
              <Select value={facility} onValueChange={setFacility}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select facility...</SelectItem>
                  <SelectItem value="downtown">Downtown Distribution Center</SelectItem>
                  <SelectItem value="eastside">Eastside Fulfillment</SelectItem>
                  <SelectItem value="southbay">South Bay Storage</SelectItem>
                  <SelectItem value="northcounty">North County Logistics</SelectItem>
                  <SelectItem value="centralvalley">Central Valley Distribution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Impact Level</label>
                <span className="text-sm">{impactLevel[0]}%</span>
              </div>
              <Slider 
                defaultValue={[50]} 
                max={100} 
                step={5}
                value={impactLevel}
                onValueChange={setImpactLevel}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Minimal Impact</span>
                <span>Maximum Impact</span>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleRunSimulation} 
                className="w-full"
                disabled={simulationRunning}
              >
                {simulationRunning ? "Running Simulation..." : "Run Simulation"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              {simulationResults 
                ? `Impact analysis for ${scenarioType} scenario at ${facility} facility` 
                : "Run a simulation to see results"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {simulationResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                      <CardTitle className="text-sm">Workforce Impact</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">
                        {simulationResults.workforceImpact > 0 ? "+" : ""}
                        {simulationResults.workforceImpact}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {simulationResults.workforceImpact > 0 
                          ? "Increase in workforce requirements" 
                          : "Reduction in workforce requirements"}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                      <CardTitle className="text-sm">Commute Times</CardTitle>
                      <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">
                        {simulationResults.commuteTimes > 0 ? "+" : ""}
                        {simulationResults.commuteTimes} mins
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Average change in commute time
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                      <CardTitle className="text-sm">Operational Costs</CardTitle>
                      <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">
                        {simulationResults.operationalCosts > 0 ? "+" : ""}
                        {simulationResults.operationalCosts}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {simulationResults.operationalCosts > 0 
                          ? "Increase in operational costs" 
                          : "Savings in operational costs"}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                      <CardTitle className="text-sm">Labor Efficiency</CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">
                        {simulationResults.laborEfficiency > 0 ? "+" : ""}
                        {simulationResults.laborEfficiency}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Change in overall labor efficiency
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Analysis Summary */}
                <Card className="bg-muted/40">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Analysis Summary</h4>
                    <p className="text-sm mb-3">
                      {scenarioType === "closure" 
                        ? `Closing the ${facility} facility would have significant workforce displacement with ${Math.abs(simulationResults.workforceImpact)}% reduction in positions. Average commute time increases by ${simulationResults.commuteTimes} minutes, potentially affecting employee retention.`
                        : scenarioType === "expansion"
                          ? `Expanding ${facility} facility capacity would create an estimated ${simulationResults.workforceImpact}% increase in workforce needs. This would reduce average commute times by ${Math.abs(simulationResults.commuteTimes)} minutes, though operational costs would increase by ${simulationResults.operationalCosts}%.`
                          : `Redistributing workload to ${facility} facility optimizes commute times by ${Math.abs(simulationResults.commuteTimes)} minutes and improves overall labor efficiency by ${simulationResults.laborEfficiency}%.`
                      }
                    </p>
                    <p className="text-sm font-medium">
                      Recommendation: {
                        simulationResults.laborEfficiency > 10
                          ? "Highly recommended to proceed with this change."
                          : simulationResults.laborEfficiency > 0
                            ? "Consider implementing with careful monitoring."
                            : "Not recommended based on negative efficiency impact."
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-center">
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Configure and run a simulation to see results</p>
                  <p className="text-sm mt-2">Results will appear here after processing</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioSimulation;

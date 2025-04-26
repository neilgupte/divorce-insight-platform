
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import DivorceRateChart from "@/components/dashboard2/DivorceRateChart";
import HouseholdsIncomeChart from "@/components/dashboard2/HouseholdsIncomeChart";
import OpportunityMap from "@/components/dashboard2/OpportunityMap";
import TopTamTable from "@/components/dashboard2/TopTamTable";
import { useDivorceData } from "@/hooks/useDivorceData";

const Dashboard2 = () => {
  const [selectedState, setSelectedState] = useState<string>("Florida");
  const [incomeRange, setIncomeRange] = useState<[number, number]>([50000, 500000]);
  const [scoreFilters, setScoreFilters] = useState({
    high: true,
    medium: true,
    low: true
  });
  
  const { isLoading, error, statesList } = useDivorceData(selectedState);

  const handleScoreFilterChange = (value: boolean, key: 'high' | 'medium' | 'low') => {
    setScoreFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">DivorceIQ Dashboard</h1>
      
      {/* Filters Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="state-name" className="mb-2 block">State Name</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger id="state-name" className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {statesList.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 md:col-span-1">
              <Label className="mb-2 block">Income Bracket Range</Label>
              <div className="pt-6 px-2">
                <Slider
                  value={incomeRange}
                  min={0}
                  max={1000000}
                  step={10000}
                  onValueChange={setIncomeRange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <div>${incomeRange[0].toLocaleString()}</div>
                  <div>${incomeRange[1].toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Composite Score</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="high-score" 
                    checked={scoreFilters.high} 
                    onCheckedChange={(checked) => 
                      handleScoreFilterChange(checked as boolean, 'high')
                    }
                  />
                  <Label htmlFor="high-score" className="cursor-pointer">High (15-20)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="medium-score" 
                    checked={scoreFilters.medium}
                    onCheckedChange={(checked) => 
                      handleScoreFilterChange(checked as boolean, 'medium')
                    }
                  />
                  <Label htmlFor="medium-score" className="cursor-pointer">Medium (8-14)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="low-score" 
                    checked={scoreFilters.low}
                    onCheckedChange={(checked) => 
                      handleScoreFilterChange(checked as boolean, 'low')
                    }
                  />
                  <Label htmlFor="low-score" className="cursor-pointer">Low (1-7)</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map and Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Opportunity Map (Based on AGI Score)</h3>
              <Button variant="outline" size="sm">
                <Expand className="h-4 w-4 mr-1" /> Expand Map
              </Button>
            </div>
            
            <div className="relative h-[400px] rounded-md overflow-hidden border">
              <OpportunityMap 
                selectedState={selectedState}
                scoreFilters={scoreFilters}
                incomeRange={incomeRange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Top TAM Table Column */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Top TAM {selectedState}</h3>
            <TopTamTable selectedState={selectedState} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Divorce Rate Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Divorce Rate {selectedState}</h3>
            <div className="h-[300px]">
              <DivorceRateChart selectedState={selectedState} />
            </div>
          </CardContent>
        </Card>

        {/* Households vs Income Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Households vs Income Level, {selectedState}</h3>
            <div className="h-[300px]">
              <HouseholdsIncomeChart selectedState={selectedState} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard2;

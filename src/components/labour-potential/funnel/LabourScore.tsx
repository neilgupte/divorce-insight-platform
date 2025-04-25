
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";

interface LabourScoreProps {
  location?: string;
}

const LabourScore: React.FC<LabourScoreProps> = ({ location = "Current Market" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentScore = 72;
  const projectedScore = 84;
  
  const factors = [
    { name: "Increased educational programs", impact: "+5" },
    { name: "Migration trends from nearby cities", impact: "+4" },
    { name: "New professional certification programs", impact: "+3" },
    { name: "Aging workforce in certain specialties", impact: "-2" },
    { name: "Competitive wage growth", impact: "+2" }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Labour Score: {location}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-muted-foreground">Current Score</div>
              <div className="font-bold text-2xl">{currentScore}/100</div>
            </div>
            <Progress value={currentScore} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-muted-foreground">Projected Score (Next 3-5 Years)</div>
              <div className="font-bold text-2xl text-green-600">{projectedScore}/100</div>
            </div>
            <Progress value={projectedScore} className="h-2 bg-gray-100 [&>div]:bg-green-500" />
          </div>
        </div>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-4 rounded-md">
              <span className="font-medium">Why?</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <ul className="space-y-2">
              {factors.map((factor, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{factor.name}</span>
                  <span className={factor.impact.startsWith("+") ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {factor.impact} points
                  </span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default LabourScore;

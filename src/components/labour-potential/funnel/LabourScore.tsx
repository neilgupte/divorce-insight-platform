import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
    { name: "Competitive wage growth", impact: "+2" },
    { name: "Market expansion", impact: "+3" },
    { name: "Technology adoption rate", impact: "+2" },
    { name: "Regional development plans", impact: "+4" }
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {/* Current Score */}
      <Card className="flex-1 min-w-[150px]">
        <CardContent className="pt-4 pb-2">
          <div className="text-xs text-muted-foreground mb-1">Current Score</div>
          <div className="text-xl font-bold">{currentScore}/100</div>
        </CardContent>
      </Card>

      {/* Projected Score */}
      <Card className="flex-1 min-w-[150px]">
        <CardContent className="pt-4 pb-2">
          <div className="text-xs text-muted-foreground mb-1">Projected Score (3-5 Years)</div>
          <div className="text-xl font-bold text-green-600">{projectedScore}/100</div>
        </CardContent>
      </Card>

      {/* Why Dropdown */}
      <Card className="flex-1 min-w-[200px]">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between p-4 text-xs font-medium">
              <span>Why?</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            {factors.length > 5 ? (
              <ScrollArea className="h-[150px] px-4 pb-2">
                <div className="space-y-2 text-xs">
                  {factors.map((factor, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{factor.name}</span>
                      <span className={factor.impact.startsWith("+") ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {factor.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="space-y-2 px-4 pb-2 text-xs">
                {factors.map((factor, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{factor.name}</span>
                    <span className={factor.impact.startsWith("+") ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {factor.impact}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default LabourScore;

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

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
    { name: "Market expansion", impact: "+3" }
  ];

  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Score Cards */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground mb-2">Current Score</div>
          <div className="text-3xl font-bold">{currentScore}/100</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground mb-2">
            Projected Score (3-5 Years)
          </div>
          <div className="text-3xl font-bold text-green-600">
            {projectedScore}/100
          </div>
        </CardContent>
      </Card>

      {/* WHY Section */}
      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex flex-col items-start text-left px-4 py-3 hover:bg-muted/20 rounded-md transition"
            >
              <div className="flex justify-between w-full items-center">
                <span className="text-sm font-semibold flex items-center gap-2">
                  🧠 Why?
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {factors.length} factor drivers impacting score
              </span>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            {factors.length > 5 ? (
              <ScrollArea className="h-[200px] px-4 pb-4">
                <div className="space-y-2">
                  {factors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{factor.name}</span>
                      <span
                        className={
                          factor.impact.startsWith("+")
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {factor.impact} points
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="space-y-2 px-4 pb-4">
                {factors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{factor.name}</span>
                    <span
                      className={
                        factor.impact.startsWith("+")
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {factor.impact} points
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

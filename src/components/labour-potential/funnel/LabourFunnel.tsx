import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FunnelStage from "./FunnelStage";
import { v4 as uuidv4 } from "uuid";

const LabourFunnel = () => {
  const [stages, setStages] = useState([
    {
      id: uuidv4(),
      name: "Total Hireable Market",
      value: 10000,
      description: "The total number of potential hires in the market",
      isPercentage: false,
      color: "#4F46E5"
    },
    {
      id: uuidv4(),
      name: "After Skill & Availability Cut",
      value: 25,
      description: "Reduction based on required skills and availability",
      isPercentage: true,
      color: "#7C3AED"
    },
    {
      id: uuidv4(),
      name: "After Experience/Wage Cut",
      value: 30,
      description: "Reduction after experience and wage requirements",
      isPercentage: true,
      color: "#9333EA"
    },
    {
      id: uuidv4(),
      name: "Final Readiness Pool",
      value: 20,
      description: "Final reduction based on readiness to hire",
      isPercentage: true,
      color: "#C026D3"
    }
  ]);

  const handleNameChange = (id: string, name: string) => {
    setStages(stages.map(stage => 
      stage.id === id ? { ...stage, name } : stage
    ));
  };

  const handleValueChange = (id: string, value: number) => {
    setStages(stages.map(stage => 
      stage.id === id ? { ...stage, value } : stage
    ));
  };

  const handleDescriptionChange = (id: string, description: string) => {
    setStages(stages.map(stage => 
      stage.id === id ? { ...stage, description } : stage
    ));
  };

  const handleToggleValueType = (id: string) => {
    setStages(stages.map(stage => {
      if (stage.id === id) {
        return { 
          ...stage, 
          isPercentage: !stage.isPercentage,
          // Convert the value appropriately when toggling
          value: stage.isPercentage ? 
            Math.round(stage.value * getPreviousValue(stages.indexOf(stage)) / 100) : 
            Math.round((stage.value / getPreviousValue(stages.indexOf(stage))) * 100)
        };
      }
      return stage;
    }));
  };

  const getPreviousValue = (index: number): number => {
    if (index === 0) return stages[0].value; // Base value
    
    const previousStage = stages[index - 1];
    const previousValue = getPreviousValue(index - 1);
    
    if (previousStage.isPercentage) {
      return Math.round(previousValue * (1 - previousStage.value / 100));
    } else {
      return previousValue - previousStage.value;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Labour Potential Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {stages.map((stage, index) => (
            <FunnelStage
              key={stage.id}
              id={stage.id}
              name={stage.name}
              value={stage.value}
              description={stage.description}
              previousValue={getPreviousValue(index)}
              isPercentage={stage.isPercentage}
              color={stage.color}
              onNameChange={handleNameChange}
              onValueChange={handleValueChange}
              onDescriptionChange={handleDescriptionChange}
              onToggleValueType={handleToggleValueType}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

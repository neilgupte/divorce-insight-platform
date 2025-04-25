
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  description: string;
  isPercentage: boolean;
  color: string;
}

const LabourFunnel = () => {
  const [stages, setStages] = useState<FunnelStage[]>([
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

  const addStage = () => {
    const newStage = {
      id: uuidv4(),
      name: "New Stage",
      value: 15,
      description: "New stage description",
      isPercentage: true,
      color: getRandomColor()
    };
    
    setStages([...stages, newStage]);
  };

  const getRandomColor = () => {
    const colors = ["#4F46E5", "#7C3AED", "#9333EA", "#C026D3", "#8B5CF6", "#6366F1"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const calculatePercentageWidth = (index: number) => {
    const totalStages = stages.length;
    // Start at 100% width and decrease by stage position
    const percentage = 100 - (index * (60 / totalStages));
    return `${Math.max(percentage, 40)}%`;
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(stages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setStages(items);
  };

  const getPreviousValue = (index: number): number => {
    if (index === 0) return stages[0].value;
    
    const previousStage = stages[index - 1];
    const previousValue = getPreviousValue(index - 1);
    
    if (previousStage.isPercentage) {
      return Math.round(previousValue * (1 - previousStage.value / 100));
    } else {
      return previousValue - previousStage.value;
    }
  };

  const getFinalValue = (stage: FunnelStage, index: number) => {
    const previousValue = getPreviousValue(index);
    
    if (stage.isPercentage) {
      return Math.round(previousValue * (1 - stage.value / 100));
    } else {
      return previousValue - stage.value;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Labour Potential Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="funnelStages">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {stages.map((stage, index) => {
                  const finalValue = getFinalValue(stage, index);
                  return (
                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative"
                          style={{
                            marginLeft: `${index * 5}%`,
                            width: calculatePercentageWidth(index),
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div
                            className="p-3 text-white rounded-md"
                            style={{ 
                              background: stage.color,
                              clipPath: "polygon(4% 0, 96% 0, 100% 100%, 0% 100%)",
                              minHeight: "60px"
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <div className="font-medium">{stage.name}</div>
                              <div className="font-bold">{finalValue.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <Button onClick={addStage} className="mt-4 w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Funnel Stage
        </Button>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

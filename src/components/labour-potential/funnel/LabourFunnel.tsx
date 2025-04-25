
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FunnelStage from "./FunnelStage";
import { v4 as uuidv4 } from "uuid";

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  description: string;
  isPercentage: boolean;
}

const LabourFunnel: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>([
    {
      id: uuidv4(),
      name: "Total Hireable Market",
      value: 10000,
      description: "The total number of potential hires in the market",
      isPercentage: false
    },
    {
      id: uuidv4(),
      name: "After Skill & Availability Cut",
      value: 25,
      description: "Reduction based on required skills and availability",
      isPercentage: true
    },
    {
      id: uuidv4(),
      name: "After Experience/Wage Alignment Cut",
      value: 30,
      description: "Reduction after aligning with experience and wage requirements",
      isPercentage: true
    },
    {
      id: uuidv4(),
      name: "After Final Readiness Cut",
      value: 20,
      description: "Final reduction based on readiness to hire",
      isPercentage: true
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

  const addStageAfter = (index: number) => {
    const newStages = [...stages];
    newStages.splice(index + 1, 0, {
      id: uuidv4(),
      name: "New Stage",
      value: 15,
      description: "Description for this stage",
      isPercentage: true
    });
    setStages(newStages);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // Don't allow dragging the initial stage (Total Hireable Market)
    if (result.source.index === 0) return;
    
    // Don't allow dropping to position 0
    if (result.destination.index === 0) return;

    const newStages = [...stages];
    const [removed] = newStages.splice(result.source.index, 1);
    newStages.splice(result.destination.index, 0, removed);
    
    setStages(newStages);
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

  const calculateFinalOutput = (): number => {
    let currentValue = stages[0].value;
    
    for (let i = 1; i < stages.length; i++) {
      const stage = stages[i];
      if (stage.isPercentage) {
        currentValue = Math.round(currentValue * (1 - stage.value / 100));
      } else {
        currentValue = currentValue - stage.value;
      }
    }
    
    return currentValue;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Labour Potential Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="funnel-stages">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {stages.map((stage, index) => (
                  <React.Fragment key={stage.id}>
                    <Draggable 
                      draggableId={stage.id} 
                      index={index}
                      isDragDisabled={index === 0} // First stage can't be dragged
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <FunnelStage
                            id={stage.id}
                            name={stage.name}
                            value={stage.value}
                            description={stage.description}
                            previousValue={getPreviousValue(index)}
                            isPercentage={stage.isPercentage}
                            onNameChange={handleNameChange}
                            onValueChange={handleValueChange}
                            onDescriptionChange={handleDescriptionChange}
                            onToggleValueType={handleToggleValueType}
                          />
                        </div>
                      )}
                    </Draggable>
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full h-8 w-8 p-0"
                        onClick={() => addStageAfter(index)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </React.Fragment>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">THMP – Total Hireable Market Population</div>
            <div className="text-2xl font-bold text-blue-600">{calculateFinalOutput().toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

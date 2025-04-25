import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus, Move, Trash } from "lucide-react"; // Using Trash icon
import { v4 as uuidv4 } from "uuid";

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  description: string;
  isPercentage: boolean;
  color: string;
  editing?: boolean;
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
      name: "Skill & Availability Cut",
      value: 25,
      description: "Reduction based on required skills and availability",
      isPercentage: true,
      color: "#7C3AED"
    },
    {
      id: uuidv4(),
      name: "Experience/Wage Cut",
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
    const newStage: FunnelStage = {
      id: uuidv4(),
      name: "New Stage",
      value: 15,
      description: "New stage description",
      isPercentage: true,
      color: getRandomColor(),
      editing: false
    };

    setStages([...stages, newStage]);
  };

  const toggleEdit = (id: string) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === id ? { ...stage, editing: !stage.editing } : stage
      )
    );
  };

  const deleteStage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this stage?")) {
      setStages((prev) => prev.filter((stage) => stage.id !== id));
    }
  };

  const getRandomColor = () => {
    const colors = ["#4F46E5", "#7C3AED", "#9333EA", "#C026D3", "#8B5CF6", "#6366F1"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const calculatePercentageWidth = (index: number) => {
    const totalStages = stages.length;
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
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Labour Potential Funnel</CardTitle>
        <Button onClick={addStage} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Stage
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="funnelStages">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3 flex flex-col items-center"
                >
                  {stages.map((stage, index) => {
                    const finalValue = getFinalValue(stage, index);
                    return (
                      <Draggable key={stage.id} draggableId={stage.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="relative"
                            style={{
                              width: calculatePercentageWidth(index),
                              transition: "all 0.2s ease"
                            }}
                          >
                            <div
                              className="p-3 text-white rounded-md flex items-center justify-between gap-2"
                              style={{
                                background: stage.color,
                                clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
                                minHeight: "60px"
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps}>
                                  <Move className="h-4 w-4 cursor-move" />
                                </div>

                                {stage.editing ? (
                                  <input
                                    className="text-xs text-black px-1 py-0.5 rounded w-28"
                                    value={stage.name}
                                    onChange={(e) =>
                                      setStages((prev) =>
                                        prev.map((s) =>
                                          s.id === stage.id
                                            ? { ...s, name: e.target.value }
                                            : s
                                        )
                                      )
                                    }
                                  />
                                ) : (
                                  <div
                                    className="text-xs font-medium cursor-pointer"
                                    onClick={() => toggleEdit(stage.id)}
                                  >
                                    {stage.name}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {stage.editing ? (
                                  <input
                                    type="number"
                                    className="text-xs text-black w-16 px-1 py-0.5 rounded"
                                    value={stage.value}
                                    onChange={(e) =>
                                      setStages((prev) =>
                                        prev.map((s) =>
                                          s.id === stage.id
                                            ? { ...s, value: Number(e.target.value) }
                                            : s
                                        )
                                      )
                                    }
                                  />
                                ) : (
                                  <div
                                    className="text-sm font-bold cursor-pointer"
                                    onClick={() => toggleEdit(stage.id)}
                                  >
                                    {stage.isPercentage
                                      ? `${stage.value}% (${finalValue.toLocaleString()})`
                                      : finalValue.toLocaleString()}
                                  </div>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => deleteStage(stage.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
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
        </div>

        <div className="mt-6 text-center">
          <div className="text-lg font-semibold">Total Hireable Market Population</div>
          <div className="text-3xl font-bold text-primary">
            {getPreviousValue(0).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

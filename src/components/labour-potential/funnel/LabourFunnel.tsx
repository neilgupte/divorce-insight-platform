import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move, Trash, Save, X, Pencil } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  description: string;
  isPercentage: boolean;
  color: string;
}

const LabourFunnel: React.FC = () => {
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState<number>(0);

  const addStage = () => {
    const newStage = {
      id: uuidv4(),
      name: "New Stage",
      value: 10,
      description: "Describe the stage",
      isPercentage: true,
      color: getRandomColor()
    };
    setStages([...stages, newStage]);
    startEditing(newStage.id, newStage.name, newStage.value);
  };

  const deleteStage = (id: string) => {
    setStages(stages.filter((stage) => stage.id !== id));
  };

  const startEditing = (id: string, name: string, value: number) => {
    setEditingId(id);
    setEditName(name);
    setEditValue(value);
  };

  const saveEditing = () => {
    if (!editingId) return;
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === editingId
          ? { ...stage, name: editName, value: editValue }
          : stage
      )
    );
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
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
    const updated = Array.from(stages);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setStages(updated);
  };

  // NEW: Cascade logic fix
  const getFinalValue = (index: number): number => {
    let value = stages[0].value;

    for (let i = 1; i <= index; i++) {
      const prev = stages[i - 1];
      if (prev.isPercentage) {
        value = Math.max(0, Math.round(value * (1 - prev.value / 100)));
      } else {
        value = Math.max(0, value - prev.value);
      }
    }

    return value;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Labour Potential Funnel</CardTitle>
        <Button onClick={addStage} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Stage
        </Button>
      </CardHeader>

      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="funnelStages">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 flex flex-col items-center">
                {stages.map((stage, index) => {
                  const finalValue = getFinalValue(index);
                  const isEditing = stage.id === editingId;

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
                            className="p-3 text-white rounded-md flex flex-col justify-between"
                            style={{
                              background: stage.color,
                              clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
                              minHeight: "60px"
                            }}
                          >
                            {isEditing ? (
                              <div className="bg-white text-black p-2 rounded shadow text-xs space-y-2">
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="text-xs"
                                />
                                <Input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(Number(e.target.value))}
                                  className="text-xs"
                                />
                                <div className="flex justify-end gap-2 pt-1">
                                  <Button size="xs" variant="outline" onClick={saveEditing}>
                                    <Save className="w-4 h-4 mr-1" /> Save
                                  </Button>
                                  <Button size="xs" variant="ghost" onClick={cancelEditing}>
                                    <X className="w-4 h-4 mr-1" /> Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps}>
                                    <Move className="h-4 w-4 cursor-move" />
                                  </div>
                                  <div className="text-xs font-medium">{stage.name}</div>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold">
                                  {stage.isPercentage
                                    ? `${stage.value}% (${finalValue.toLocaleString()})`
                                    : finalValue.toLocaleString()}
                                  <Button variant="ghost" size="icon" className="text-white opacity-75" onClick={() => startEditing(stage.id, stage.name, stage.value)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-white opacity-75" onClick={() => deleteStage(stage.id)}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
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

        <div className="mt-6 text-center">
          <div className="text-sm font-semibold">Total Hireable Market Population</div>
          <div className="text-3xl font-bold text-primary">{getFinalValue(0).toLocaleString()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

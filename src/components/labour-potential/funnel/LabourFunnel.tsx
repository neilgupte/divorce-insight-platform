import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Move, Trash, Save, X, Pencil, Lock, Unlock, Info } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  description: string;
  isPercentage: boolean;
  isLocked: boolean;
  color: string;
}

const LabourFunnel: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>([
    {
      id: uuidv4(),
      name: "Total Hireable Market",
      value: 10000,
      description: "Base market size",
      isPercentage: false,
      isLocked: true,
      color: "#4F46E5"
    },
    {
      id: uuidv4(),
      name: "Skill & Availability Cut",
      value: 25,
      description: "People meeting skill and availability requirements",
      isPercentage: true,
      isLocked: false,
      color: "#7C3AED"
    },
    {
      id: uuidv4(),
      name: "Experience/Wage Cut",
      value: 30,
      description: "Filtered by experience or wage expectations",
      isPercentage: true,
      isLocked: false,
      color: "#9333EA"
    },
    {
      id: uuidv4(),
      name: "Final Readiness Pool",
      value: 20,
      description: "Final filtered pool ready for hire",
      isPercentage: true,
      isLocked: false,
      color: "#C026D3"
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState<number>(0);
  const [editIsPercentage, setEditIsPercentage] = useState<boolean>(true);

  const addStage = () => {
    const newStage = {
      id: uuidv4(),
      name: "New Stage",
      value: 10,
      description: "Describe this stage",
      isPercentage: true,
      isLocked: false,
      color: getRandomColor()
    };
    setStages([...stages, newStage]);
    startEditing(newStage);
  };

  const startEditing = (stage: FunnelStage) => {
    if (stage.isLocked) return;
    setEditingId(stage.id);
    setEditName(stage.name);
    setEditValue(stage.value);
    setEditIsPercentage(stage.isPercentage);
  };

  const saveEditing = () => {
    if (!editingId) return;
    setStages((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? { ...s, name: editName, value: editValue, isPercentage: editIsPercentage }
          : s
      )
    );
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const deleteStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  const toggleLock = (id: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isLocked: !s.isLocked } : s))
    );
  };

  const getRandomColor = () => {
    const colors = ["#4F46E5", "#7C3AED", "#9333EA", "#C026D3", "#8B5CF6", "#6366F1"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const calculateWidth = (index: number) => {
    const total = stages.length;
    const percent = 100 - (index * (60 / total));
    return `${Math.max(percent, 40)}%`;
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = [...stages];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setStages(items);
  };

  const getCascadingValues = (): number[] => {
    const values: number[] = [];
    let currentValue = stages[0].value;
    values.push(currentValue);

    for (let i = 1; i < stages.length; i++) {
      const prevStage = stages[i - 1];
      if (prevStage.isPercentage) {
        currentValue = Math.round(currentValue * (1 - prevStage.value / 100));
      } else {
        currentValue = Math.max(0, currentValue - prevStage.value);
      }
      values.push(currentValue);
    }

    return values;
  };

  const cascadingValues = getCascadingValues();

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-2 flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Labour Potential Funnel</CardTitle>
          <Button onClick={addStage} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Stage
          </Button>
        </CardHeader>

        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="funnel">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col items-center space-y-3"
                >
                  {stages.map((stage, index) => {
                    const finalValue = cascadingValues[index];
                    const isEditing = editingId === stage.id;

                    return (
                      <Draggable key={stage.id} draggableId={stage.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="relative"
                            style={{
                              width: calculateWidth(index),
                              transition: "all 0.2s ease"
                            }}
                          >
                            <div
                              className="p-3 text-white rounded-md flex flex-col"
                              style={{
                                background: stage.color,
                                clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)"
                              }}
                            >
                              {isEditing ? (
                                <>
                                  <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="text-xs mb-2"
                                  />
                                  <div className="flex items-center gap-2 mb-2">
                                    <Input
                                      type="number"
                                      value={editValue}
                                      onChange={(e) => setEditValue(Number(e.target.value))}
                                      className="text-xs"
                                    />
                                    <Button
                                      size="xs"
                                      variant="ghost"
                                      onClick={() => setEditIsPercentage(!editIsPercentage)}
                                    >
                                      {editIsPercentage ? "%" : "#"}
                                    </Button>
                                  </div>
                                  <div className="flex justify-end gap-2 text-white">
                                    <Button size="xs" variant="outline" onClick={saveEditing}>
                                      <Save className="w-4 h-4 mr-1" /> Save
                                    </Button>
                                    <Button size="xs" variant="ghost" onClick={cancelEditing}>
                                      <X className="w-4 h-4 mr-1" /> Cancel
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-2 items-center">
                                    <div {...provided.dragHandleProps}>
                                      <Move className="h-4 w-4 cursor-move" />
                                    </div>
                                    <div className="text-xs font-medium">{stage.name}</div>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs font-bold">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span>
                                          {stage.isPercentage
                                            ? `${stage.value}% (${finalValue.toLocaleString()})`
                                            : `${stage.value} (${finalValue.toLocaleString()})`}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {stage.isPercentage
                                          ? "Percentage reduction"
                                          : "Fixed number reduction"}
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-white"
                                          onClick={() => toggleLock(stage.id)}
                                        >
                                          {stage.isLocked ? (
                                            <Lock className="w-4 h-4" />
                                          ) : (
                                            <Unlock className="w-4 h-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {stage.isLocked ? "Unlock to edit" : "Lock this stage"}
                                      </TooltipContent>
                                    </Tooltip>

                                    {!stage.isLocked && (
                                      <>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="text-white"
                                              onClick={() => startEditing(stage)}
                                            >
                                              <Pencil className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Edit stage</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="text-white"
                                              onClick={() => deleteStage(stage.id)}
                                            >
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Delete stage</TooltipContent>
                                        </Tooltip>
                                      </>
                                    )}
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
            <div className="text-3xl font-bold text-primary">
              {cascadingValues[0].toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default LabourFunnel;

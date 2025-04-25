import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  isPercentage: boolean;
  color: string;
}

const LabourFunnel: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>([
    {
      id: uuidv4(),
      name: "Total Hireable Market",
      value: 100000,
      isPercentage: false,
      color: "#6366F1"
    },
    {
      id: uuidv4(),
      name: "Experience/Wage Cut",
      value: 30,
      isPercentage: true,
      color: "#8B5CF6"
    },
    {
      id: uuidv4(),
      name: "Skill & Availability Cut",
      value: 10,
      isPercentage: true,
      color: "#A855F7"
    },
    {
      id: uuidv4(),
      name: "Final Readiness Pool",
      value: 10,
      isPercentage: true,
      color: "#D946EF"
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState(0);

  const addStage = () => {
    const newStage = {
      id: uuidv4(),
      name: "New Stage",
      value: 10,
      isPercentage: true,
      color: "#9333EA"
    };
    setStages([...stages, newStage]);
  };

  const deleteStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  const startEditing = (stage: FunnelStage) => {
    setEditingId(stage.id);
    setEditName(stage.name);
    setEditValue(stage.value);
  };

  const saveStage = () => {
    setStages((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? { ...s, name: editName, value: editValue }
          : s
      )
    );
    setEditingId(null);
  };

  const getCascadingValues = (): number[] => {
    const values: number[] = [];
    let current = stages[0].value;
    values.push(current);

    for (let i = 1; i < stages.length; i++) {
      const stage = stages[i];
      if (stage.isPercentage) {
        current = Math.round(current * (1 - stage.value / 100));
      } else {
        current = Math.max(0, current - stage.value);
      }
      values.push(current);
    }

    return values;
  };

  const cascadingValues = getCascadingValues();

  return (
    <Card>
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-base font-semibold">Labour Potential Funnel</CardTitle>
        <Button onClick={addStage} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Stage
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-0 border rounded overflow-hidden">
          <div className="flex flex-col border-r">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className={clsx("flex items-center justify-between px-3 py-2 text-sm border-b last:border-b-0", {
                  "bg-gray-100 font-medium": index === 0,
                  "bg-gray-50": index !== 0
                })}
              >
                {editingId === stage.id ? (
                  <div className="flex flex-col w-full gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      size={10}
                      className="text-xs"
                    />
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(Number(e.target.value))}
                      className="text-xs"
                    />
                    <div className="flex gap-1 justify-end">
                      <Button variant="outline" size="xs" onClick={saveStage}>
                        Save
                      </Button>
                      <Button variant="ghost" size="xs" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span>{stage.name}</span>
                    {index > 0 && (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEditing(stage)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteStage(stage.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div className="px-3 py-2 text-sm font-semibold bg-gray-300">
              Total Hireable Market Population
            </div>
          </div>

          <div className="flex flex-col">
            {stages.map((stage, index) => {
              const value = cascadingValues[index];
              return (
                <div
                  key={stage.id}
                  className="text-sm text-white font-bold px-4 py-2 text-right"
                  style={{
                    backgroundColor: stage.color,
                    clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)"
                  }}
                >
                  {value.toLocaleString()}{" "}
                  {stage.isPercentage ? `(${stage.value}%)` : ""}
                </div>
              );
            })}
            <div className="bg-black text-white text-right font-bold px-4 py-2">
              {cascadingValues[cascadingValues.length - 1].toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

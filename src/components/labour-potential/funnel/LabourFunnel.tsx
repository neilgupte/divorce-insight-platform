import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move, Trash, Pencil } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface FunnelStage {
  id: string;
  name: string;
  value: number;
  isPercentage: boolean;
  color: string;
}

const LabourFunnel: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>([
    { id: uuidv4(), name: "Total Hireable Market", value: 100000, isPercentage: false, color: "#6366F1" },
    { id: uuidv4(), name: "Experience/Wage Cut", value: 30, isPercentage: true, color: "#8B5CF6" },
    { id: uuidv4(), name: "Skill & Availability Cut", value: 10, isPercentage: true, color: "#C084FC" },
    { id: uuidv4(), name: "Final Readiness Pool", value: 10, isPercentage: true, color: "#E879F9" }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState<number>(0);
  const [editIsPercentage, setEditIsPercentage] = useState(true);

  const handleEdit = (stage: FunnelStage) => {
    setEditingId(stage.id);
    setEditName(stage.name);
    setEditValue(stage.value);
    setEditIsPercentage(stage.isPercentage);
  };

  const handleSave = () => {
    setStages(stages.map(s => s.id === editingId ? { ...s, name: editName, value: editValue, isPercentage: editIsPercentage } : s));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setStages(stages.filter(s => s.id !== id));
  };

  const handleAdd = () => {
    const newStage: FunnelStage = {
      id: uuidv4(),
      name: "New Stage",
      value: 10,
      isPercentage: true,
      color: "#D8B4FE"
    };
    setStages([...stages, newStage]);
  };

  const getFinalValues = () => {
    const values = [stages[0].value];
    for (let i = 1; i < stages.length; i++) {
      const prevValue = values[i - 1];
      const stage = stages[i];
      const reduced = stage.isPercentage ? prevValue * (1 - stage.value / 100) : prevValue - stage.value;
      values.push(Math.round(reduced));
    }
    return values;
  };

  const finalValues = getFinalValues();

  return (
    <Card>
      <CardHeader className="pb-2 flex justify-between items-center">
        <CardTitle className="text-sm font-semibold">Labour Potential Funnel</CardTitle>
        <Button size="sm" variant="outline" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add Stage
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_1fr] gap-x-2 text-xs">
        <div className="space-y-1">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className="flex items-center justify-between bg-gray-50 px-3 py-1 border-b"
            >
              {editingId === stage.id ? (
                <div className="flex flex-col gap-1 w-full">
                  <Input
                    className="text-xs"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <Input
                    className="text-xs"
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(Number(e.target.value))}
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="xs" onClick={handleSave}>Save</Button>
                    <Button size="xs" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <span>{stage.name}</span>
                  <div className="flex gap-2">
                    <Pencil
                      className="w-4 h-4 cursor-pointer text-muted-foreground"
                      onClick={() => handleEdit(stage)}
                    />
                    {index !== 0 && (
                      <Trash
                        className="w-4 h-4 cursor-pointer text-muted-foreground"
                        onClick={() => handleDelete(stage.id)}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="bg-gray-300 text-xs font-semibold px-3 py-2 border-t">
            Total Hireable Market Population
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className="w-full px-3 py-1 text-white text-right font-semibold"
              style={{
                background: stage.color,
                clipPath: "polygon(4% 0, 96% 0, 100% 100%, 0% 100%)"
              }}
            >
              {finalValues[index].toLocaleString()}{" "}
              {stage.isPercentage ? `(${stage.value}%)` : ""}
            </div>
          ))}
          <div className="bg-black text-white text-right w-full px-3 py-2 font-semibold text-sm">
            {finalValues[finalValues.length - 1].toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

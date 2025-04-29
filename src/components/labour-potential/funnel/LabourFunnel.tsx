// File: src/components/LabourFunnel.tsx

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FunnelChart,
  Funnel,
  LabelList,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Editable stage interface
interface FunnelStage {
  name: string;
  value: number;
  color: string;
}

const initialStages: FunnelStage[] = [
  { name: "Total Hireable Market", value: 100000, color: "#6366F1" },
  { name: "Experience/Wage Cut", value: 70000, color: "#8B5CF6" },
  { name: "Skill & Availability Cut", value: 63000, color: "#C084FC" },
  { name: "Final Readiness Pool", value: 56700, color: "#E879F9" },
];

const LabourFunnel: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>(initialStages);

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...stages];
    updated[index].name = newName;
    setStages(updated);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updated = [...stages];
    updated[index].value = parseInt(newValue) || 0;
    setStages(updated);
  };

  const getDropPercentage = (i: number): string => {
    const current = stages[i - 1]?.value;
    const next = stages[i]?.value;
    if (!current || !next) return "";
    const drop = ((current - next) / current) * 100;
    return `↓ ${drop.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Labour Potential Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString()}`, name]} />
              <Funnel
                dataKey="value"
                data={stages}
                isAnimationActive
                nameKey="name"
              >
                <LabelList
                  dataKey="name"
                  position="right"
                  content={({ index }) => (
                    <div className="text-black text-sm font-medium">
                      <div>{stages[index].name}</div>
                      {index > 0 && (
                        <div className="text-xs text-gray-500">
                          {getDropPercentage(index)}
                        </div>
                      )}
                    </div>
                  )}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Editable Inputs */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col gap-1">
              <Input
                value={stage.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="Stage Name"
              />
              <Input
                type="number"
                value={stage.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                placeholder="Value"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

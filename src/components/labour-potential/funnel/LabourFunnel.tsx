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

// Define a funnel stage
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Labour Potential Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                formatter={(value: number, name: string) => [`${value.toLocaleString()}`, name]}
              />
              <Funnel
                dataKey="value"
                data={stages}
                isAnimationActive
                nameKey="name"
              >
                {/* Funnel segment labels: names and % drop (SVG-safe) */}
                <LabelList
                  dataKey="name"
                  position="right"
                  formatter={(name, entry, index) => {
                    if (index === 0) return name;
                    const prev = stages[index - 1].value;
                    const curr = entry.value;
                    const drop = ((prev - curr) / prev) * 100;
                    return `${name}\n↓ ${drop.toFixed(1)}%`;
                  }}
                  style={{ fill: "#000", fontSize: 12 }}
                />
                {/* Funnel segment values inside each shape */}
                <LabelList
                  dataKey="value"
                  position="inside"
                  formatter={(val) => val.toLocaleString()}
                  style={{ fill: "#fff", fontSize: 12, fontWeight: 600 }}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Editable stage inputs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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

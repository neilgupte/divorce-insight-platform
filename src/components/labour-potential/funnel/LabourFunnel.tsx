
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  Tooltip,
  Surface,
  Symbols,
  Rectangle
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

// Calculate dimensions for the trapezoids
const calculateTrapezoids = (stages: FunnelStage[], width: number, height: number) => {
  const maxValue = Math.max(...stages.map(stage => stage.value));
  const stageHeight = height / stages.length;
  const widthRatio = width * 0.8; // Max width of the funnel
  
  return stages.map((stage, index) => {
    const upperRatio = index === 0 ? 1 : stages[index - 1].value / maxValue;
    const lowerRatio = stage.value / maxValue;
    const upperWidth = widthRatio * upperRatio;
    const lowerWidth = widthRatio * lowerRatio;
    const x = width / 2; // Center point
    const y = index * stageHeight;
    
    return {
      key: `trapezoid-${index}`,
      x,
      y,
      upperWidth,
      lowerWidth,
      height: stageHeight,
      fill: stage.color,
      stroke: "#fff",
      name: stage.name,
      value: stage.value,
      displayValue: stage.value.toLocaleString(),
      percentage: index === 0 ? 100 : (stage.value / stages[index - 1].value) * 100
    };
  });
};

// Custom Trapezoid component
const Trapezoid = (props: any) => {
  const { x, y, upperWidth, lowerWidth, height, fill, stroke } = props;
  
  // Calculate the points for the trapezoid
  const halfUpperWidth = upperWidth / 2;
  const halfLowerWidth = lowerWidth / 2;
  
  const points = [
    { x: x - halfUpperWidth, y },                  // Top left
    { x: x + halfUpperWidth, y },                  // Top right
    { x: x + halfLowerWidth, y: y + height },      // Bottom right
    { x: x - halfLowerWidth, y: y + height }       // Bottom left
  ];
  
  const pathData = `M ${points[0].x},${points[0].y} 
                    L ${points[1].x},${points[1].y} 
                    L ${points[2].x},${points[2].y} 
                    L ${points[3].x},${points[3].y} Z`;
  
  return (
    <path d={pathData} fill={fill} stroke={stroke} />
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length || !payload[0]?.payload) {
    return null;
  }

  const data = payload[0].payload;
  const percentText = data.percentage === 100 ? "" : `(${data.percentage.toFixed(1)}% of previous)`;

  return (
    <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
      <p className="font-semibold">{data.name}</p>
      <p>Value: {data.displayValue} {percentText}</p>
    </div>
  );
};

const LabourFunnel: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>(initialStages);
  const [chartWidth, setChartWidth] = useState(400);
  const [chartHeight, setChartHeight] = useState(320);

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

  // Calculate trapezoid data
  const trapezoids = calculateTrapezoids(stages, chartWidth, chartHeight);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Labour Potential Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Surface width={chartWidth} height={chartHeight}>
              <defs>
                <filter id="shadow" x="0" y="0" width="200%" height="200%">
                  <feOffset result="offOut" in="SourceGraphic" dx="2" dy="2" />
                  <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.3 0" />
                  <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2" />
                  <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                </filter>
              </defs>
              <g style={{ filter: "url(#shadow)" }}>
                {trapezoids.map((trapezoid, index) => (
                  <Trapezoid 
                    key={trapezoid.key}
                    x={trapezoid.x}
                    y={trapezoid.y}
                    upperWidth={trapezoid.upperWidth}
                    lowerWidth={trapezoid.lowerWidth}
                    height={trapezoid.height}
                    fill={trapezoid.fill}
                    stroke={"#fff"}
                    data-name={trapezoid.name}
                    data-value={trapezoid.value}
                    data-payload={JSON.stringify({
                      name: trapezoid.name,
                      value: trapezoid.value,
                      displayValue: trapezoid.displayValue,
                      percentage: trapezoid.percentage
                    })}
                  />
                ))}
              </g>
              
              {/* Add labels */}
              {trapezoids.map((trapezoid, index) => {
                // Label on the right
                const labelX = trapezoid.x + trapezoid.upperWidth / 2 + 10;
                const labelY = trapezoid.y + trapezoid.height / 2;
                const dropPercent = index === 0 ? "" : 
                  `↓ ${(100 - trapezoid.percentage).toFixed(1)}%`;
                
                // Value in the middle
                const valueX = trapezoid.x;
                const valueY = trapezoid.y + trapezoid.height / 2 + 5;
                
                return (
                  <g key={`label-${trapezoid.key}`}>
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="start"
                      fill="#000"
                      fontSize={12}
                    >
                      {trapezoid.name}
                      {index > 0 && (
                        <tspan x={labelX} dy="16" fontSize={11}>
                          {dropPercent}
                        </tspan>
                      )}
                    </text>
                    <text
                      x={valueX}
                      y={valueY}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={12}
                      fontWeight="600"
                    >
                      {trapezoid.displayValue}
                    </text>
                  </g>
                );
              })}
              
              {/* Custom tooltip area */}
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={false}
              />
              
              {/* The transparent overlay for tooltip triggering */}
              {trapezoids.map((trapezoid) => {
                const halfUpperWidth = trapezoid.upperWidth / 2;
                const halfLowerWidth = trapezoid.lowerWidth / 2;
                const width = Math.max(trapezoid.upperWidth, trapezoid.lowerWidth);
                
                return (
                  <Rectangle
                    key={`overlay-${trapezoid.key}`}
                    x={trapezoid.x - width / 2}
                    y={trapezoid.y}
                    width={width}
                    height={trapezoid.height}
                    fill="transparent"
                    className="recharts-tooltip-trigger"
                    data-value={trapezoid.value}
                    data-name={trapezoid.name}
                    data-displayvalue={trapezoid.displayValue}
                    data-percentage={trapezoid.percentage}
                  />
                );
              })}
            </Surface>
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


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  Trapezoid,
  Text,
  Rectangle,
  Line,
  Tooltip,
  TooltipProps,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

interface FunnelStageData {
  name: string;
  value: number;
  displayValue: string;
  color: string;
  percentage: number;
}

const LabourFunnel: React.FC = () => {
  const { toast } = useToast();

  // Initial data for the funnel
  const [stages] = useState<FunnelStageData[]>([
    {
      name: "Total Hireable Market",
      value: 100000,
      displayValue: "100,000",
      color: "#6366F1",
      percentage: 100
    },
    {
      name: "Experience/Wage Cut",
      value: 70000,
      displayValue: "70,000",
      color: "#8B5CF6",
      percentage: 70
    },
    {
      name: "Skill & Availability Cut",
      value: 63000,
      displayValue: "63,000",
      color: "#C084FC",
      percentage: 63
    },
    {
      name: "Final Readiness Pool",
      value: 56700,
      displayValue: "56,700",
      color: "#E879F9",
      percentage: 56.7
    }
  ]);

  // Calculate the heights and positions for the funnel segments
  const calculateFunnelShapes = () => {
    const height = 300; // Total height of the funnel
    const width = 400;  // Width of the funnel at the top
    const minWidth = 200; // Width of the funnel at the bottom
    
    const shapes = [];
    const stageHeight = height / stages.length;
    
    for (let i = 0; i < stages.length; i++) {
      const topWidth = width - ((width - minWidth) * (i / stages.length));
      const bottomWidth = width - ((width - minWidth) * ((i + 1) / stages.length));
      const y = i * stageHeight;
      
      // Calculate trapezoid points
      const points = [
        { x: (width - topWidth) / 2, y: y },
        { x: (width - topWidth) / 2 + topWidth, y: y },
        { x: (width - bottomWidth) / 2 + bottomWidth, y: y + stageHeight },
        { x: (width - bottomWidth) / 2, y: y + stageHeight }
      ];
      
      shapes.push({
        points,
        fill: stages[i].color,
        stroke: "#fff",
        name: stages[i].name,
        value: stages[i].value,
        displayValue: stages[i].displayValue,
        y: y + stageHeight / 2,
        labelX: width + 20,
        valueX: (width - bottomWidth) / 2 + bottomWidth / 2
      });
    }
    
    return shapes;
  };
  
  const funnelShapes = calculateFunnelShapes();
  
  // Custom tooltip for the funnel chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-md text-sm">
          <p className="font-medium">{data.name}</p>
          <p>{data.displayValue} ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Labour Potential Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              width={500}
              height={350}
              margin={{
                top: 20,
                right: 150, // Extra space for labels
                bottom: 20,
                left: 20,
              }}
            >
              {funnelShapes.map((shape, index) => (
                <Trapezoid
                  key={`trap-${index}`}
                  x={shape.points[0].x}
                  y={shape.points[0].y}
                  upperWidth={shape.points[1].x - shape.points[0].x}
                  lowerWidth={shape.points[2].x - shape.points[3].x}
                  height={shape.points[3].y - shape.points[0].y}
                  fill={shape.fill}
                  stroke="#fff"
                  dataKey="value"
                  name={shape.name}
                  payload={{
                    name: shape.name,
                    value: shape.value,
                    displayValue: shape.displayValue,
                    percentage: stages[index].percentage
                  }}
                />
              ))}
              
              {/* Labels on the right side */}
              {funnelShapes.map((shape, index) => (
                <Text
                  key={`label-${index}`}
                  x={shape.labelX}
                  y={shape.y}
                  textAnchor="start"
                  verticalAnchor="middle"
                  fontSize={12}
                  fontWeight={500}
                >
                  {shape.name}
                </Text>
              ))}
              
              {/* Value labels in the center of each segment */}
              {funnelShapes.map((shape, index) => (
                <Text
                  key={`value-${index}`}
                  x={shape.valueX}
                  y={shape.y}
                  textAnchor="middle"
                  verticalAnchor="middle"
                  fontSize={12}
                  fontWeight={600}
                  fill="#fff"
                >
                  {shape.displayValue}
                </Text>
              ))}
              
              <Tooltip content={<CustomTooltip />} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabourFunnel;

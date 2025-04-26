"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useDivorceRates } from "@/hooks/useDivorceRates";

interface DivorceRateChartProps {
  selectedState: string;
}

const DivorceRateChart: React.FC<DivorceRateChartProps> = ({ selectedState }) => {
  const { data, isLoading, error } = useDivorceRates(selectedState);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chart data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading chart data</div>;
  }

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full">No divorce rate data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis 
          dataKey="year"
          type="number"
          domain={[2020, 2023]}
          ticks={[2020, 2021, 2022, 2023]}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
        />
        <YAxis 
          tickFormatter={(value) => `${value}%`} 
          domain={[0, 15]} 
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
          tickMargin={5}
        />
        <Tooltip 
          formatter={(value: number) => [`${value}%`, '']}
          labelFormatter={(label) => `Year: ${label}`}
        />
        <Legend 
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ paddingTop: "10px" }}
        />
        <Line
          type="monotone"
          dataKey="avgState"
          name="State Average"
          stroke="#ec4899"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 4, strokeWidth: 2, fill: "white" }}
        />
        <Line
          type="monotone"
          dataKey="avgNational"
          name="National Average"
          stroke="#f97316"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 4, strokeWidth: 2, fill: "white" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DivorceRateChart;

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDivorceRates } from '@/hooks/useDivorceRates'; // ← make sure you're using the real hook

interface DivorceRateChartProps {
  selectedState: string;
}

const DivorceRateChart: React.FC<DivorceRateChartProps> = ({ selectedState }) => {
  const { data, isLoading, error } = useDivorceRates(selectedState);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading divorce rate data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading divorce rate data</div>;
  }

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full">No divorce rate data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="year" 
          domain={[2020, 2023]}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#ccc' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value) => `${value}%`}
          domain={[0, 10]}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#ccc' }}
          tickLine={false}
        />
        <Tooltip 
          formatter={(value: number) => `${value}%`} 
          labelFormatter={(label) => `Year: ${label}`} 
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          formatter={(value) => 
            value === 'avgState' ? 'State Average' : 'National Average'
          }
        />
        <Line 
          type="monotone" 
          dataKey="avgState" 
          stroke="#ec4899" // Pink
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, fill: "white" }}
          activeDot={{ r: 6 }}
          name="State Average"
        />
        <Line 
          type="monotone" 
          dataKey="avgNational" 
          stroke="#f97316" // Orange
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, fill: "white" }}
          activeDot={{ r: 6 }}
          name="National Average"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DivorceRateChart;

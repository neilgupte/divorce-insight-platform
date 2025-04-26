
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDivorceData } from '@/hooks/useDivorceData';

interface HouseholdsIncomeChartProps {
  selectedState: string;
}

const HouseholdsIncomeChart: React.FC<HouseholdsIncomeChartProps> = ({ selectedState }) => {
  const { data, isLoading, error } = useDivorceData(selectedState);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chart...</div>;
  }

  if (error || !data) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading chart</div>;
  }

  if (!data.householdsIncome || data.householdsIncome.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available for {selectedState}</div>;
  }

  const chartData = data.householdsIncome;

  // Format number to k or M format
  const formatNumberToKM = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    } else {
      return `$${value}`;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorHouseholds" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="income" 
          tickFormatter={(value) => formatNumberToKM(value)}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
        />
        <YAxis 
          tickFormatter={(value) => value.toLocaleString()}
          domain={[0, 'auto']}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString()} households`, "Households"]}
          labelFormatter={(label) => `Income Level: ${formatNumberToKM(Number(label))}`}
        />
        <Area 
          type="monotone" 
          dataKey="households" 
          stroke="#8884d8" 
          strokeWidth={2}  // Increased stroke width for better visibility
          fill="url(#colorHouseholds)" 
          name="Households" 
          dot={{ r: 2, strokeWidth: 2 }}  // Added dots to make the line more visible
          activeDot={{ r: 6 }}  // Larger dot when hovering
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HouseholdsIncomeChart;

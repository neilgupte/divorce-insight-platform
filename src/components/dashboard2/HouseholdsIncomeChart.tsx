
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDivorceData } from '@/hooks/useDivorceData';

interface HouseholdsIncomeChartProps {
  selectedState: string;
}

const HouseholdsIncomeChart: React.FC<HouseholdsIncomeChartProps> = ({ selectedState }) => {
  const { data, isLoading, error } = useDivorceData(selectedState);

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading chart...</div>;
  if (error || !data) return <div className="flex items-center justify-center h-full text-red-500">Error loading chart</div>;
  if (!data.householdsIncome || data.householdsIncome.length === 0) 
    return <div className="flex items-center justify-center h-full">No data available for {selectedState}</div>;

  const chartData = data.householdsIncome;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="income" 
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <YAxis tickFormatter={(value) => value.toLocaleString()} />
        <Tooltip 
          formatter={(value: number) => [value.toLocaleString(), "Households"]}
          labelFormatter={(value) => `$${Number(value).toLocaleString()} Income`}
        />
        <Area 
          type="monotone" 
          dataKey="households" 
          stroke="#8884d8" 
          fill="#8884d8" 
          name="Households" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HouseholdsIncomeChart;

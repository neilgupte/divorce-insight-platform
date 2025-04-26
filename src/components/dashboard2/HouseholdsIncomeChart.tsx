
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HouseholdsIncomeChartProps {
  selectedState: string;
}

const HouseholdsIncomeChart: React.FC<HouseholdsIncomeChartProps> = ({ selectedState }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['household_income', selectedState],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('income')
        .select('Income_bracket, Households, State')
        .eq('State', selectedState);

      if (error) {
        console.error('Error fetching household income data:', error);
        throw error;
      }
      
      return data;
    }
  });

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading chart...</div>;
  if (error || !data) return <div className="flex items-center justify-center h-full text-red-500">Error loading chart</div>;
  if (data.length === 0) return <div className="flex items-center justify-center h-full">No data available for {selectedState}</div>;

  // Sort the data by income bracket
  const chartData = data
    .filter(item => item.Households > 0) // Filter out zero household entries
    .map((item: any) => ({
      income: Number(item.Income_bracket),
      households: Number(item.Households)
    }))
    .sort((a, b) => a.income - b.income);

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

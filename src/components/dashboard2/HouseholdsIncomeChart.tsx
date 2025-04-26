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
        .from('household_income')
        .select('income_bracket, households, state')
        .eq('state', selectedState);

      if (error) {
        console.error('Error fetching household income data:', error);
        throw error;
      }
      return data;
    }
  });

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading chart...</div>;
  if (error || !data) return <div className="flex items-center justify-center h-full text-red-500">Error loading chart</div>;

  const chartData = data.map((item: any) => ({
    income: item.income_bracket,
    households: item.households
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="income" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="households" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HouseholdsIncomeChart;


import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useDivorceData } from '@/hooks/useDivorceData';

interface DivorceRateChartProps {
  selectedState: string;
}

const DivorceRateChart: React.FC<DivorceRateChartProps> = ({ selectedState }) => {
  const { data, isLoading, error } = useDivorceData(selectedState);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chart data...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading chart data</div>;
  }
  
  if (!data) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }
  
  // Prepare the data format for Recharts
  const chartData = data.divorceRates.stateAverage.map((stateItem: any, index: number) => {
    const nationalItem = data.divorceRates.nationalAverage[index];
    return {
      year: stateItem.year,
      stateAverage: stateItem.rate,
      nationalAverage: nationalItem.rate
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis 
          dataKey="year" 
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
        />
        <YAxis 
          tickFormatter={(value) => `${value}%`} 
          domain={['auto', 'auto']}
          tickCount={5}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
          tickMargin={5}
        />
        <Line 
          type="monotone" 
          dataKey="stateAverage" 
          stroke="#ec4899" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 4, strokeWidth: 2, fill: "white" }}
        />
        <Line 
          type="monotone" 
          dataKey="nationalAverage" 
          stroke="#f97316" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 4, strokeWidth: 2, fill: "white" }}
        />
        <Legend 
          verticalAlign="bottom"
          iconType="circle"
          formatter={(value) => {
            return value === 'stateAverage' ? 'State Average' : 'National Average';
          }}
          wrapperStyle={{ paddingTop: '10px' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DivorceRateChart;

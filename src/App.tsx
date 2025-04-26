
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";
import { Toaster } from "@/components/ui/toaster";

// Import Dashboard2 component
import Dashboard2 from "./pages/Dashboard2";

// Import NotFound component
import NotFound from "@/pages/NotFound";

// Fix the formatNumber function in HouseholdsIncomeChart.tsx
<lov-write file_path="src/components/dashboard2/HouseholdsIncomeChart.tsx">
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useDivorceData } from '@/hooks/useDivorceData';

interface HouseholdsIncomeChartProps {
  selectedState: string;
}

const HouseholdsIncomeChart: React.FC<HouseholdsIncomeChartProps> = ({ selectedState }) => {
  const { data, isLoading, error } = useDivorceData(selectedState);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chart data...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading chart data</div>;
  }
  
  if (!data || !data.householdsIncome) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data.householdsIncome}
        margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
      >
        <defs>
          <linearGradient id="householdGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis 
          dataKey="income" 
          tickFormatter={formatCurrency} 
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
          tick={{ fontSize: 10 }}
        />
        <YAxis 
          tickFormatter={formatNumber} 
          domain={[0, 'auto']}
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
          tickMargin={5}
          tick={{ fontSize: 10 }}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString()} households`, 'Number of Households']}
          labelFormatter={(label: number) => `Income Level: ${formatCurrency(label)}`}
        />
        <Area 
          type="monotone" 
          dataKey="households" 
          stroke="#8884d8" 
          fillOpacity={1} 
          fill="url(#householdGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HouseholdsIncomeChart;

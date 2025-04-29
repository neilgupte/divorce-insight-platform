import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
const HiringDashboard = () => {
  const [selectedMarket, setSelectedMarket] = useState("Seattle Metro Area");

  // Sample data for hiring levers
  const hiringLevers = [{
    lever: "Base wage increase",
    effectiveness: "High",
    cost: "High",
    partner: "None"
  }, {
    lever: "Fringe benefits",
    effectiveness: "Low",
    cost: "Medium",
    partner: "Insurance Partners"
  }, {
    lever: "Education/training",
    effectiveness: "Medium",
    cost: "Medium",
    partner: "Local Colleges"
  }, {
    lever: "Transport support",
    effectiveness: "Medium",
    cost: "Low",
    partner: "Transit Authority"
  }, {
    lever: "Referral drive",
    effectiveness: "High",
    cost: "Low",
    partner: "None"
  }, {
    lever: "Marketing campaign",
    effectiveness: "High",
    cost: "Medium",
    partner: "Any Partner"
  }, {
    lever: "Carpool scheme",
    effectiveness: "Low",
    cost: "Low",
    partner: "Transport"
  }];

  // Sample data for CPH chart
  const cphData = [{
    year: "2022",
    cph: 4200
  }, {
    year: "2023",
    cph: 3800
  }, {
    year: "2024",
    cph: 3500
  }];
  return <div className="p-6">
      <h1 className="text-3xl font-bold">Hiring Optimization Dashboard</h1>
      <p className="mt-2 text-muted-foreground mb-6">
        Optimize your hiring strategies for maximum effectiveness
      </p>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-700">
          <span className="font-bold">Note:</span> This page uses 1P data. [Confidential]
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Lever Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left font-medium">Hiring Lever</th>
                    <th className="h-10 px-4 text-left font-medium">Effectiveness</th>
                    <th className="h-10 px-4 text-left font-medium">Cost</th>
                    <th className="h-10 px-4 text-left font-medium">Best Partner</th>
                  </tr>
                </thead>
                <tbody>
                  {hiringLevers.map((lever, index) => <tr key={index} className="border-b">
                      <td className="p-3 text-sm">{lever.lever}</td>
                      <td className="p-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${lever.effectiveness === "High" ? "bg-green-100 text-green-800" : lever.effectiveness === "Medium" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>
                          {lever.effectiveness}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${lever.cost === "High" ? "bg-red-100 text-red-800" : lever.cost === "Medium" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}>
                          {lever.cost}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{lever.partner}</td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            
          </CardContent>
        </Card>
        
        {/* Right Panel - Market Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedMarket}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>For this market, combining education benefits led to a +26% improvement in hiring effectiveness last year.</li>
                <li>Base wage increases showed diminishing returns after the 12% threshold.</li>
                <li>Referral campaigns consistently outperform external marketing by 2:1 ROI.</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">CPH (Cost Per Hire) Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cphData}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cph" fill="#9b87f5" name="Cost Per Hire ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Sequencing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Least Costly</h4>
                  <ol className="list-decimal pl-5">
                    <li>Referral Drive</li>
                    <li>Education Benefit</li>
                    <li>Base Wage</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Least Impact</h4>
                  <ol className="list-decimal pl-5">
                    <li>Commute</li>
                    <li>Transport</li>
                    <li>Marketing</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default HiringDashboard;

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus, AlertTriangle, Info } from "lucide-react";

interface Insight {
  id: string;
  title: string;
  description: string;
  severity: string;
  trend: string;
}

interface AIInsightsCardProps {
  insights: Insight[];
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>
          Machine learning detected patterns and anomalies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {insights.map((insight) => (
            <div key={insight.id} className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center">
                <div className="mr-2">
                  {insight.severity === "high" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <h3 className="font-semibold">{insight.title}</h3>
                <div className="ml-auto">
                  <Badge variant={insight.trend === "increasing" ? "destructive" : "outline"}>
                    {insight.trend === "increasing" 
                      ? <ArrowUp className="mr-1 h-3 w-3 inline" /> 
                      : insight.trend === "decreasing" 
                        ? <ArrowDown className="mr-1 h-3 w-3 inline" /> 
                        : <Minus className="mr-1 h-3 w-3 inline" />}
                    {insight.trend}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;

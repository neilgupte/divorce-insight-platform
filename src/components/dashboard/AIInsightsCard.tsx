import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ArrowUpRight, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIInsight {
  id: string;
  text?: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: "trend" | "anomaly" | "opportunity";
  severity?: string;
  trend?: string;
}

interface AIInsightsCardProps {
  insights: AIInsight[];
  isLoading: boolean;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ 
  insights,
  isLoading
}) => {
  const getCategoryColor = (insight: AIInsight) => {
    const category = insight.category || 
      (insight.severity === "high" && insight.trend === "increasing" ? "anomaly" :
       insight.severity === "medium" && insight.trend === "increasing" ? "opportunity" : "trend");
    
    switch (category) {
      case "trend":
        return "bg-blue-500/10 text-blue-500";
      case "anomaly":
        return "bg-red-500/10 text-red-500";
      case "opportunity":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getInsightText = (insight: AIInsight) => {
    return insight.text || insight.description || "";
  };

  const getCategoryName = (insight: AIInsight) => {
    if (insight.category) {
      return insight.category.charAt(0).toUpperCase() + insight.category.slice(1);
    }
    
    if (insight.severity === "high" && insight.trend === "increasing") {
      return "Anomaly";
    } else if (insight.severity === "medium" && insight.trend === "increasing") {
      return "Opportunity";
    } else {
      return "Trend";
    }
  };
  
  const getTags = (insight: AIInsight) => {
    if (insight.tags && insight.tags.length > 0) {
      return insight.tags;
    }
    
    const generatedTags = [];
    if (insight.title && !insight.title.includes("Insight")) {
      generatedTags.push(insight.title.split(" ")[0]);
    }
    if (insight.severity) {
      generatedTags.push(insight.severity === "high" ? "Critical" : "Important");
    }
    if (insight.trend) {
      generatedTags.push(insight.trend.charAt(0).toUpperCase() + insight.trend.slice(1));
    }
    
    return generatedTags.length > 0 ? generatedTags : ["Insight"];
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium flex items-center">
          AI-Generated Insights
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">Automatically generated insights based on the current dataset and filters.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 border border-border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <Badge
                    variant="outline"
                    className={`${getCategoryColor(insight)} text-xs px-2 py-0 h-5`}
                  >
                    {getCategoryName(insight)}
                  </Badge>
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-sm">{getInsightText(insight)}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {getTags(insight).map((tag, idx) => (
                    <Badge key={`${insight.id}-tag-${idx}`} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;

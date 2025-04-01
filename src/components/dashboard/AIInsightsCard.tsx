
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
  text: string;
  tags: string[];
  category: "trend" | "anomaly" | "opportunity";
}

interface AIInsightsCardProps {
  insights: AIInsight[];
  isLoading: boolean;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ 
  insights,
  isLoading
}) => {
  const getCategoryColor = (category: AIInsight["category"]) => {
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
                    className={`${getCategoryColor(insight.category)} text-xs px-2 py-0 h-5`}
                  >
                    {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                  </Badge>
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-sm">{insight.text}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {insight.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
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

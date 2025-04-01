
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ArrowUpRight, Info, Plus, User, Printer, Download, Share, X, Tag, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface AIInsight {
  id: string;
  text?: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: "trend" | "anomaly" | "opportunity" | "risk";
  severity?: string;
  trend?: string;
  userGenerated?: boolean;
  createdAt?: string;
  createdBy?: string;
}

interface AIInsightsCardProps {
  insights: AIInsight[];
  isLoading: boolean;
  onAddInsight?: (prompt: string) => Promise<AIInsight | null>;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ 
  insights,
  isLoading,
  onAddInsight
}) => {
  const [activeInsight, setActiveInsight] = useState<AIInsight | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { toast } = useToast();

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
      case "risk":
        return "bg-orange-500/10 text-orange-500";
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

  const handleAddInsight = async () => {
    if (!prompt.trim() || !onAddInsight) return;
    
    setIsSubmitting(true);
    try {
      const newInsight = await onAddInsight(prompt);
      if (newInsight) {
        toast({
          title: "Insight Added",
          description: "Your custom insight has been generated and added to the panel.",
        });
        setPrompt("");
      }
    } catch (error) {
      toast({
        title: "Failed to Generate Insight",
        description: "There was an error generating your insight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    if (!activeInsight) return;
    
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your insight is being exported...",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${format.toUpperCase()} has been exported.`,
      });
    }, 1500);
  };

  const handleShare = () => {
    if (!activeInsight) return;
    
    // Simulate creating a shareable link
    const shareableLink = `https://app.example.com/insights/${activeInsight.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({
        title: "Link Copied",
        description: "Shareable link has been copied to clipboard.",
      });
    });
  };

  const handlePrint = () => {
    toast({
      title: "Preparing Print",
      description: "Opening print dialog...",
    });
    
    // In a real implementation, this would trigger a print-friendly view
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getFilteredInsights = () => {
    if (!activeFilter) return insights;
    return insights.filter(insight => {
      const category = getCategoryName(insight).toLowerCase();
      return category === activeFilter.toLowerCase();
    });
  };

  // Get unique categories for filtering
  const categories = Array.from(new Set(
    insights.map(insight => getCategoryName(insight).toLowerCase())
  ));

  return (
    <Card className="h-full flex flex-col">
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
        
        <div className="flex items-center space-x-2">
          {/* Filter Button */}
          {categories.length > 0 && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 ${activeFilter ? 'bg-primary/10' : ''}`}
                >
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter insights</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-56" align="end">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Filter by type</h4>
                  <div className="flex flex-wrap gap-1">
                    {categories.map((category) => (
                      <Badge 
                        key={category}
                        variant={activeFilter === category ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setActiveFilter(activeFilter === category ? null : category)}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Badge>
                    ))}
                    {activeFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-6 px-2"
                        onClick={() => setActiveFilter(null)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
          
          {/* Add Insight Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Insight
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate New Insight</DialogTitle>
                <DialogDescription>
                  Describe what insights you're looking for, and our AI will analyze the data to generate relevant information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="e.g., 'Show me asset protection trends in Florida' or 'Any anomalies in divorce filings over the last year?'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleAddInsight} 
                    disabled={isSubmitting || !prompt.trim()}
                  >
                    {isSubmitting ? "Generating..." : "Generate Insight"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow px-2 overflow-hidden">
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
            {getFilteredInsights().length === 0 ? (
              <div className="flex items-center justify-center h-full py-8">
                <p className="text-sm text-muted-foreground">No insights found. Try changing the filter or adding a new insight.</p>
              </div>
            ) : (
              getFilteredInsights().map((insight) => (
                <Sheet key={insight.id}>
                  <SheetTrigger asChild>
                    <div
                      className="p-3 border border-border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setActiveInsight(insight)}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <Badge
                          variant="outline"
                          className={`${getCategoryColor(insight)} text-xs px-2 py-0 h-5`}
                        >
                          {getCategoryName(insight)}
                        </Badge>
                        <div className="flex items-center">
                          {insight.userGenerated && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <User className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">User-generated insight</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <Lightbulb className="h-4 w-4 text-amber-400" />
                        </div>
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
                  </SheetTrigger>
                  
                  <SheetContent className="w-full sm:max-w-md overflow-auto">
                    <SheetHeader className="text-left">
                      <SheetTitle>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={`${getCategoryColor(insight)} text-xs px-2 py-0 h-5 mr-2`}
                            >
                              {getCategoryName(insight)}
                            </Badge>
                            {insight.title || "Insight Details"}
                          </div>
                          {insight.userGenerated && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              User-created
                            </Badge>
                          )}
                        </div>
                      </SheetTitle>
                      <SheetDescription>
                        {insight.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            Generated on {new Date(insight.createdAt).toLocaleDateString()} 
                            {insight.createdBy && ` by ${insight.createdBy}`}
                          </p>
                        )}
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-6 space-y-6">
                      <p className="text-sm">{getInsightText(insight)}</p>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Data Points:</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-muted/30 rounded-md">
                            <p className="text-xs text-muted-foreground">Asset Growth</p>
                            <p className="text-lg font-medium">+12.4%</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-md">
                            <p className="text-xs text-muted-foreground">Anomaly Score</p>
                            <p className="text-lg font-medium">0.87</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-md">
                            <p className="text-xs text-muted-foreground">Confidence</p>
                            <p className="text-lg font-medium">High</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-md">
                            <p className="text-xs text-muted-foreground">Trend Period</p>
                            <p className="text-lg font-medium">6 mo</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Related Tags:</h4>
                        <div className="flex flex-wrap gap-1">
                          {getTags(insight).map((tag, idx) => (
                            <Badge key={`detail-${insight.id}-tag-${idx}`} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Data Sources:</h4>
                        <ul className="text-sm space-y-1">
                          <li className="text-muted-foreground">• HNW Demographics Dataset (2023)</li>
                          <li className="text-muted-foreground">• Divorce Rate Trends (Q2 2023)</li>
                          <li className="text-muted-foreground">• Asset Protection Analysis</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-12 flex space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrint}>
                              <Printer className="h-4 w-4" />
                              <span className="sr-only">Print</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Print insight</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleExport('pdf')}>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Download as PDF</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Share insight</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </SheetContent>
                </Sheet>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;

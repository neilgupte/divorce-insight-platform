import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  REGIONAL_METRICS, 
  TOP_LUXURY_LOCATIONS, 
  AI_INSIGHTS, 
  US_STATES, 
  TOP_CITIES, 
  NET_WORTH_BRACKETS 
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { 
  DownloadIcon, 
  SaveIcon, 
  Share, 
  BookmarkIcon,
  Filter,
  X,
  Plus,
  MessageSquare,
  Map
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { normalizeAIInsights, generateAIInsight } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import AIChatbot from "@/components/common/AIChatbot";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import KPICards from "@/components/dashboard/KPICards";
import RegionalMetricsChart from "@/components/dashboard/RegionalMetricsChart";
import LuxuryLocationsCard from "@/components/dashboard/LuxuryLocationsCard";
import AIInsightsCard from "@/components/dashboard/AIInsightsCard";
import InteractiveMapCard from "@/components/dashboard/InteractiveMapCard";
import SnapshotDialog from "@/components/dashboard/SnapshotDialog";

interface DashboardSnapshot {
  id: string;
  name: string;
  date: Date;
  filters: {
    selectedState: string;
    selectedCity: string;
    netWorthRange: [number, number];
  };
}

interface LuxuryLocation {
  id: string;
  city: string;
  density: number;
  avgValue: string;
  highNetWorthRatio: number;
  trend: string;
  change: number;
}

interface CustomMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  description: string;
}

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [netWorthRange, setNetWorthRange] = useState<[number, number]>([1, 50]);
  const [isSnapshotDialogOpen, setIsSnapshotDialogOpen] = useState(false);
  const [savedSnapshots, setSavedSnapshots] = useState<DashboardSnapshot[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [insights, setInsights] = useState(normalizeAIInsights(AI_INSIGHTS));
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [customMetrics, setCustomMetrics] = useState<CustomMetric[]>([]);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const availableCities = selectedState !== "All States" && TOP_CITIES[selectedState] 
    ? TOP_CITIES[selectedState] 
    : ["All Cities"];

  useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedState, selectedCity, netWorthRange]);

  const filteredLuxuryLocations = TOP_LUXURY_LOCATIONS.filter(location => {
    if (selectedState !== "All States" && !location.city.includes(selectedState)) {
      return false;
    }
    
    if (selectedCity !== "All Cities" && !location.city.includes(selectedCity)) {
      return false;
    }
    
    const avgValueStr = location.avgValue.replace('$', '').replace('M', '');
    const avgNetWorthInMillions = parseFloat(avgValueStr);
    
    if (avgNetWorthInMillions < netWorthRange[0] || avgNetWorthInMillions > netWorthRange[1]) {
      return false;
    }
    
    return true;
  }).map(location => ({
    ...location,
    trend: location.highNetWorthRatio > 0.7 ? "up" as const : location.highNetWorthRatio > 0.6 ? "stable" as const : "down" as const,
    change: `${Math.round((location.highNetWorthRatio - 0.6) * 100)}%`
  }));

  const regionData = REGIONAL_METRICS
    .filter(item => {
      const netWorth = item.avgNetWorth / 1000000;
      return netWorth >= netWorthRange[0] && netWorth <= netWorthRange[1];
    })
    .map(item => ({
      name: item.region,
      netWorth: item.avgNetWorth / 1000000,
      divorceRate: item.divorceRate,
      luxuryDensity: item.luxuryDensity
    }));

  const getFilteredMetrics = useCallback(() => {
    const baseNetWorth = 14.2;
    const baseDivorceRate = 5.8;
    const baseLuxuryDensity = 6.2;
    const baseProtectionRate = 38;

    let stateMultiplier = 1.0;
    if (selectedState !== "All States") {
      const stateHash = selectedState.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      stateMultiplier = 0.85 + (stateHash % 30) / 100;
    }
    
    let netWorthMultiplier = 1.0;
    if (netWorthRange[0] > 10) {
      netWorthMultiplier = 1.15;
    } else if (netWorthRange[1] < 20) {
      netWorthMultiplier = 0.9;
    }
    
    return {
      netWorth: baseNetWorth * stateMultiplier * netWorthMultiplier,
      divorceRate: baseDivorceRate * (stateMultiplier * 0.9),
      luxuryDensity: baseLuxuryDensity * stateMultiplier * netWorthMultiplier,
      protectionRate: baseProtectionRate * (netWorthMultiplier * 0.95)
    };
  }, [selectedState, selectedCity, netWorthRange]);
  
  const metrics = getFilteredMetrics();

  const handleViewAllLocations = () => {
    navigate("/location", { state: { fromDashboard: true } });
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: `Your dashboard with current filters is being exported.`,
      duration: 3000,
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${format.toUpperCase()} has been exported and is ready for download.`,
        duration: 3000,
      });
    }, 2000);
  };

  const handleSaveSnapshot = (name: string) => {
    const newSnapshot: DashboardSnapshot = {
      id: Date.now().toString(),
      name,
      date: new Date(),
      filters: {
        selectedState,
        selectedCity,
        netWorthRange,
      }
    };
    
    setSavedSnapshots([...savedSnapshots, newSnapshot]);
    setIsSnapshotDialogOpen(false);
    
    toast({
      title: "Dashboard View Saved",
      description: `Your snapshot "${name}" has been saved.`,
      duration: 3000,
    });
  };

  const loadSnapshot = (snapshot: DashboardSnapshot) => {
    setSelectedState(snapshot.filters.selectedState);
    setSelectedCity(snapshot.filters.selectedCity);
    setNetWorthRange(snapshot.filters.netWorthRange);
    
    toast({
      title: "Snapshot Loaded",
      description: `Loaded "${snapshot.name}" snapshot.`,
      duration: 3000,
    });
  };
  
  const deleteSnapshot = (snapshotId: string) => {
    setSavedSnapshots(snapshots => snapshots.filter(s => s.id !== snapshotId));
    
    toast({
      title: "Snapshot Deleted",
      description: "The snapshot has been removed.",
      duration: 3000,
    });
  };

  const handleAddInsight = async (prompt: string) => {
    try {
      const currentFilters = {
        selectedState,
        selectedCity,
        netWorthRange
      };
      
      const newInsight = await generateAIInsight(prompt, currentFilters);
      const normalizedInsight = normalizeAIInsights([newInsight])[0];
      
      setInsights(prevInsights => [normalizedInsight, ...prevInsights]);
      return normalizedInsight;
    } catch (error) {
      console.error("Error generating insight:", error);
      return null;
    }
  };

  const handleAddCustomMetric = () => {
    setIsAIChatOpen(true);
  };

  const handleAIAction = (actionType: string, data: any) => {
    console.log("AI Action:", actionType, data);
    
    const newMetric: CustomMetric = {
      id: Date.now().toString(),
      title: "Custom AI Metric",
      value: "42%",
      change: 8.5,
      description: "AI-generated metric based on your parameters"
    };
    
    setCustomMetrics(prev => [...prev, newMetric]);
    setIsAIChatOpen(false);
    
    toast({
      title: "Custom Metric Added",
      description: "Your AI-generated metric has been added to the dashboard.",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of high-net-worth divorce metrics across the United States
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMapDialogOpen(true)}
          >
            <Map className="h-4 w-4 mr-2" />
            Map View
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSnapshotDialogOpen(true)}
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save View
          </Button>
          
          {savedSnapshots.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                  Saved Views
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Saved Snapshots</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {savedSnapshots.map((snapshot) => (
                  <DropdownMenuItem 
                    key={snapshot.id}
                    className="flex justify-between items-center"
                  >
                    <span 
                      className="cursor-pointer hover:text-primary mr-4"
                      onClick={() => loadSnapshot(snapshot)}
                    >
                      {snapshot.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSnapshot(snapshot.id);
                      }}
                    >
                      <span className="sr-only">Delete</span>
                      <X className="h-3 w-3" />
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <DashboardFilters 
        selectedState={selectedState}
        selectedCity={selectedCity}
        netWorthRange={netWorthRange}
        onStateChange={setSelectedState}
        onCityChange={setSelectedCity}
        onNetWorthChange={setNetWorthRange}
        availableCities={availableCities}
        usStates={US_STATES}
      />

      <KPICards 
        isLoading={isDataLoading}
        metrics={metrics}
      />
      
      {customMetrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {customMetrics.map(metric => (
            <Card key={metric.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                    <span className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        <div className="md:col-span-2">
          <RegionalMetricsChart regionData={regionData} isLoading={isDataLoading} />
        </div>

        <div className="md:col-span-1">
          <LuxuryLocationsCard 
            luxuryLocations={filteredLuxuryLocations.slice(0, 5)} 
            onViewAll={handleViewAllLocations}
            isLoading={isDataLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <AIInsightsCard 
            insights={insights}
            isLoading={isDataLoading}
            onAddInsight={handleAddInsight}
          />
        </div>
        
        <div className="md:col-span-2">
          <InteractiveMapCard 
            selectedState={selectedState !== "All States" ? selectedState : null} 
            selectedCity={selectedCity !== "All Cities" ? selectedCity : null}
          />
        </div>
      </div>
      
      <SnapshotDialog
        isOpen={isSnapshotDialogOpen}
        onClose={() => setIsSnapshotDialogOpen(false)}
        onSave={handleSaveSnapshot}
        currentFilters={{
          state: selectedState,
          city: selectedCity,
          netWorthRange: netWorthRange
        }}
      />
      
      <Dialog open={isAIChatOpen} onOpenChange={setIsAIChatOpen}>
        <DialogContent className="sm:max-w-[500px] h-[500px] p-0 flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>AI Metric Generator</DialogTitle>
            <DialogDescription>
              Describe what kind of custom metric you'd like to create
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <AIChatbot 
              initialMessage="I'm ready to help you create a custom metric for your dashboard. What type of data would you like to visualize? For example, divorce rates by age group, asset transfers over time, or something else?"
              title="Metric Creator"
              onAction={handleAIAction}
              availableActions={[
                {
                  name: "Divorce by Age Group",
                  description: "Show divorce rates segmented by age",
                  handler: () => {
                    console.log("Selected: Divorce by Age Group");
                  }
                },
                {
                  name: "Asset Transfers",
                  description: "Visualize asset transfers over time",
                  handler: () => {
                    console.log("Selected: Asset Transfers");
                  }
                }
              ]}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="max-w-full w-full h-[100vh] p-0 border-none bg-background/95 backdrop-blur-sm">
          <DialogHeader className="p-4 border-b bg-black/90 text-white">
            <DialogTitle className="text-xl">Interactive Tableau Map</DialogTitle>
            <DialogDescription className="text-white/80">
              Explore high-net-worth divorce trends across the U.S.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 h-[calc(100vh-70px)]">
            <tableau-viz
              id="tableauViz"
              src="https://public.tableau.com/views/DivorceIQ/Dashboard1"
              width="100%"
              height="100%"
              hide-tabs
              toolbar="bottom"
            ></tableau-viz>
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-transparent data-[state=open]:text-white">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

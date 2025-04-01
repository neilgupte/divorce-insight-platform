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
  X
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

// Import our components
import KPICards from "@/components/dashboard/KPICards";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import RegionalMetricsChart from "@/components/dashboard/RegionalMetricsChart";
import LuxuryLocationsCard from "@/components/dashboard/LuxuryLocationsCard";
import AIInsightsCard from "@/components/dashboard/AIInsightsCard";
import InteractiveMapCard from "@/components/dashboard/InteractiveMapCard";
import SnapshotDialog from "@/components/dashboard/SnapshotDialog";

// Define snapshot interface
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

// Define interfaces for our components
interface LuxuryLocation {
  id: string;
  city: string;
  density: number;
  avgValue: string;
  highNetWorthRatio: number;
  trend: string;
  change: number;
}

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [netWorthRange, setNetWorthRange] = useState<[number, number]>([1, 50]);
  const [isSnapshotDialogOpen, setIsSnapshotDialogOpen] = useState(false);
  const [savedSnapshots, setSavedSnapshots] = useState<DashboardSnapshot[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [insights, setInsights] = useState(normalizeAIInsights(AI_INSIGHTS));
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter cities based on selected state
  const availableCities = selectedState !== "All States" && TOP_CITIES[selectedState] 
    ? TOP_CITIES[selectedState] 
    : ["All Cities"];

  // Simulate data loading when filters change
  useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedState, selectedCity, netWorthRange]);

  // Filter data based on selections
  const filteredLuxuryLocations = TOP_LUXURY_LOCATIONS.filter(location => {
    // Filter by state
    if (selectedState !== "All States" && !location.city.includes(selectedState)) {
      return false;
    }
    
    // Filter by city
    if (selectedCity !== "All Cities" && !location.city.includes(selectedCity)) {
      return false;
    }
    
    // Convert the string average value to a number for filtering
    // Example: "$6.5M" -> 6.5 (in millions)
    const avgValueStr = location.avgValue.replace('$', '').replace('M', '');
    const avgNetWorthInMillions = parseFloat(avgValueStr);
    
    // Filter by net worth range
    if (avgNetWorthInMillions < netWorthRange[0] || avgNetWorthInMillions > netWorthRange[1]) {
      return false;
    }
    
    return true;
  });

  // Transform data for regional metrics chart
  const regionData = REGIONAL_METRICS
    .filter(item => {
      // Apply net worth filter to chart data
      const netWorth = item.avgNetWorth / 1000000; // Convert to millions
      return netWorth >= netWorthRange[0] && netWorth <= netWorthRange[1];
    })
    .map(item => ({
      name: item.region,
      netWorth: item.avgNetWorth / 1000000, // Convert to millions
      divorceRate: item.divorceRate,
      luxuryDensity: item.luxuryDensity
    }));

  // Calculate KPI metric changes based on filters
  const getFilteredMetrics = useCallback(() => {
    // This would normally fetch from a backend based on filters
    // For now we'll simulate variations based on the filters
    const baseNetWorth = 14.2;
    const baseDivorceRate = 5.8;
    const baseLuxuryDensity = 6.2;
    const baseProtectionRate = 38;

    // Adjust metrics based on state selection
    let stateMultiplier = 1.0;
    if (selectedState !== "All States") {
      // Simulate different values for different states
      const stateHash = selectedState.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      stateMultiplier = 0.85 + (stateHash % 30) / 100;
    }
    
    // Adjust metrics based on net worth range
    let netWorthMultiplier = 1.0;
    // Higher net worth ranges = higher metrics
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

  // Export current dashboard as PDF or CSV
  const handleExport = (format: 'pdf' | 'csv') => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: `Your dashboard with current filters is being exported.`,
      duration: 3000,
    });
    
    // In a real implementation, this would trigger a backend export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${format.toUpperCase()} has been exported and is ready for download.`,
        duration: 3000,
      });
    }, 2000);
  };

  // Save current view as a snapshot
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

  // Load a saved snapshot
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
  
  // Delete a saved snapshot
  const deleteSnapshot = (snapshotId: string) => {
    setSavedSnapshots(snapshots => snapshots.filter(s => s.id !== snapshotId));
    
    toast({
      title: "Snapshot Deleted",
      description: "The snapshot has been removed.",
      duration: 3000,
    });
  };

  // Handler for adding new AI insights
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
          {/* Export Options */}
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
          
          {/* Save View Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSnapshotDialogOpen(true)}
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save View
          </Button>
          
          {/* Saved Snapshots */}
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

      {/* Filters */}
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

      {/* KPI Cards */}
      <KPICards 
        isLoading={isDataLoading}
        metrics={metrics}
      />

      {/* Main content area - first row (66/33 split) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        {/* Regional Metrics (66%) */}
        <div className="md:col-span-2">
          <RegionalMetricsChart regionData={regionData} isLoading={isDataLoading} />
        </div>

        {/* Top Luxury Locations (33%) */}
        <div className="md:col-span-1">
          <LuxuryLocationsCard 
            luxuryLocations={filteredLuxuryLocations.slice(0, 5)} 
            onViewAll={handleViewAllLocations}
            isLoading={isDataLoading}
          />
        </div>
      </div>

      {/* Second row - AI Insights and Map (33/66 split) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* AI Insights (33%) */}
        <div className="md:col-span-1">
          <AIInsightsCard 
            insights={insights}
            isLoading={isDataLoading}
            onAddInsight={handleAddInsight}
          />
        </div>
        
        {/* Interactive Map Card (66%) */}
        <div className="md:col-span-2">
          <InteractiveMapCard 
            selectedState={selectedState !== "All States" ? selectedState : null} 
            selectedCity={selectedCity !== "All Cities" ? selectedCity : null}
          />
        </div>
      </div>
      
      {/* Snapshot Dialog */}
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
    </div>
  );
};

export default Dashboard;

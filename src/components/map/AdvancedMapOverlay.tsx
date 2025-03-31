import React, { useState, useEffect } from "react";
import { X, Save, FileDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { US_STATES } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/MapView";

interface AdvancedMapOverlayProps {
  open: boolean;
  onClose: () => void;
  initialState?: string | null;
  initialCity?: string | null;
}

interface SavedView {
  id: string;
  name: string;
  filters: MapFilters;
}

interface MapFilters {
  state: string | null;
  divorceRate: {
    enabled: boolean;
    min: number;
  };
  netWorth: {
    enabled: boolean;
    min: number;
    max: number;
  };
  luxuryDensity: {
    enabled: boolean;
    min: number;
  };
  multiProperty: {
    enabled: boolean;
    min: number;
  };
}

const AdvancedMapOverlay: React.FC<AdvancedMapOverlayProps> = ({
  open,
  onClose,
  initialState = null,
  initialCity = null,
}) => {
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState<string | null>(initialState);
  const [selectedCity, setSelectedCity] = useState<string | null>(initialCity);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [viewName, setViewName] = useState("");
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<MapFilters>({
    state: initialState,
    divorceRate: {
      enabled: true,
      min: 3.0,
    },
    netWorth: {
      enabled: true,
      min: 5,
      max: 50,
    },
    luxuryDensity: {
      enabled: true,
      min: 2,
    },
    multiProperty: {
      enabled: false,
      min: 20,
    },
  });

  useEffect(() => {
    const storedViews = localStorage.getItem("mapSavedViews");
    if (storedViews) {
      setSavedViews(JSON.parse(storedViews));
    }
  }, []);

  useEffect(() => {
    if (savedViews.length > 0) {
      localStorage.setItem("mapSavedViews", JSON.stringify(savedViews));
    }
  }, [savedViews]);

  const handleSaveView = () => {
    if (!viewName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your saved view",
        variant: "destructive",
      });
      return;
    }

    const newView: SavedView = {
      id: Date.now().toString(),
      name: viewName,
      filters: {
        state: filters.state,
        divorceRate: {
          enabled: filters.divorceRate.enabled,
          min: filters.divorceRate.min,
        },
        netWorth: {
          enabled: filters.netWorth.enabled,
          min: filters.netWorth.min,
          max: filters.netWorth.max,
        },
        luxuryDensity: {
          enabled: filters.luxuryDensity.enabled,
          min: filters.luxuryDensity.min,
        },
        multiProperty: {
          enabled: filters.multiProperty.enabled,
          min: filters.multiProperty.min,
        },
      },
    };

    setSavedViews([...savedViews, newView]);
    setIsSaveDialogOpen(false);
    setViewName("");

    toast({
      title: "View saved",
      description: `"${viewName}" has been saved to your views`,
    });
  };

  const handleLoadView = (viewId: string) => {
    const view = savedViews.find((v) => v.id === viewId);
    if (view) {
      setFilters(view.filters);
      setSelectedState(view.filters.state);
      setSelectedView(viewId);

      toast({
        title: "View loaded",
        description: `Loaded "${view.name}" view`,
      });
    }
  };

  const handleDeleteView = (viewId: string) => {
    const updatedViews = savedViews.filter((v) => v.id !== viewId);
    setSavedViews(updatedViews);
    if (selectedView === viewId) {
      setSelectedView(null);
    }

    toast({
      title: "View deleted",
      description: "The saved view has been deleted",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report generation started",
      description: "Your report is being generated based on the current view",
    });
    // In a real app, this would trigger a report generation process
  };

  const updateFilter = <K extends keyof MapFilters, S extends keyof MapFilters[K]>(
    category: K,
    setting: S,
    value: MapFilters[K][S]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <DialogTitle className="text-xl">Location Heatmap Analysis</DialogTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedView || ""} onValueChange={handleLoadView}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Saved views..." />
              </SelectTrigger>
              <SelectContent>
                {savedViews.map((view) => (
                  <SelectItem key={view.id} value={view.id}>
                    {view.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setIsSaveDialogOpen(true)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save View
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleGenerateReport}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="h-9 w-9 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex h-full">
          <div className="w-64 border-r p-4 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <Select 
                  value={selectedState || "All States"} 
                  onValueChange={(val) => {
                    const state = val === "All States" ? null : val;
                    setSelectedState(state);
                    setFilters(prev => ({ ...prev, state }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All States">All States</SelectItem>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Filters</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="divorce-enabled" 
                        checked={filters.divorceRate.enabled}
                        onCheckedChange={(checked) => 
                          updateFilter("divorceRate", "enabled", !!checked)
                        }
                      />
                      <Label htmlFor="divorce-enabled">Divorce Rate</Label>
                    </div>
                    <span className="text-sm font-medium">
                      {filters.divorceRate.min}%+
                    </span>
                  </div>
                  <Slider 
                    value={[filters.divorceRate.min]} 
                    min={0}
                    max={10}
                    step={0.1}
                    disabled={!filters.divorceRate.enabled}
                    onValueChange={(value) => 
                      updateFilter("divorceRate", "min", value[0])
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="networth-enabled" 
                        checked={filters.netWorth.enabled}
                        onCheckedChange={(checked) => 
                          updateFilter("netWorth", "enabled", !!checked)
                        }
                      />
                      <Label htmlFor="networth-enabled">Avg. Net Worth</Label>
                    </div>
                    <span className="text-sm font-medium">
                      ${filters.netWorth.min}M - ${filters.netWorth.max}M
                    </span>
                  </div>
                  <Slider 
                    value={[filters.netWorth.min, filters.netWorth.max]} 
                    min={1}
                    max={100}
                    step={1}
                    disabled={!filters.netWorth.enabled}
                    onValueChange={(value) => {
                      updateFilter("netWorth", "min", value[0]);
                      updateFilter("netWorth", "max", value[1]);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="luxury-enabled" 
                        checked={filters.luxuryDensity.enabled}
                        onCheckedChange={(checked) => 
                          updateFilter("luxuryDensity", "enabled", !!checked)
                        }
                      />
                      <Label htmlFor="luxury-enabled">Luxury Density</Label>
                    </div>
                    <span className="text-sm font-medium">
                      {filters.luxuryDensity.min}+/km²
                    </span>
                  </div>
                  <Slider 
                    value={[filters.luxuryDensity.min]} 
                    min={0}
                    max={20}
                    step={0.5}
                    disabled={!filters.luxuryDensity.enabled}
                    onValueChange={(value) => 
                      updateFilter("luxuryDensity", "min", value[0])
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="multi-property-enabled" 
                        checked={filters.multiProperty.enabled}
                        onCheckedChange={(checked) => 
                          updateFilter("multiProperty", "enabled", !!checked)
                        }
                      />
                      <Label htmlFor="multi-property-enabled">Multi-Property</Label>
                    </div>
                    <span className="text-sm font-medium">
                      {filters.multiProperty.min}%+
                    </span>
                  </div>
                  <Slider 
                    value={[filters.multiProperty.min]} 
                    min={0}
                    max={100}
                    step={5}
                    disabled={!filters.multiProperty.enabled}
                    onValueChange={(value) => 
                      updateFilter("multiProperty", "min", value[0])
                    }
                  />
                </div>
              </div>
              
              {selectedView && (
                <Button 
                  variant="destructive" 
                  className="mt-4 w-full"
                  onClick={() => handleDeleteView(selectedView)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete This View
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-2">
            <div className="h-full rounded-md overflow-hidden border">
              <MapView 
                state={selectedState} 
                city={selectedCity}
                filters={filters}
                fullscreen={true}
              />
            </div>
          </div>
        </div>
      </DialogContent>
      
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Current View</DialogTitle>
            <DialogDescription>
              Give your current map configuration a name to save it for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="view-name" className="mb-2 block">View Name</Label>
            <Input
              id="view-name"
              placeholder="e.g., High Net Worth - East Coast"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveView}>
              Save View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default AdvancedMapOverlay;

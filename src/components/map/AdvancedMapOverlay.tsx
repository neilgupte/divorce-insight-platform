
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/MapView";
import FiltersPanel from "./filters/FiltersPanel";
import MapHeader from "./header/MapHeader";
import SaveViewDialog from "./save-dialog/SaveViewDialog";
import { MapFilters, SavedView } from "./types";

interface AdvancedMapOverlayProps {
  open: boolean;
  onClose: () => void;
  initialState?: string | null;
  initialCity?: string | null;
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
      min: 1, // Updated to start at 1+
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

    // Create a new view object with manually copied filter values - without spread operator
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

    // Create a new array with the new view added - without using spread on the filters
    const updatedViews = [...savedViews, newView];
    setSavedViews(updatedViews);
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
      setFilters({
        state: view.filters.state,
        divorceRate: {
          enabled: view.filters.divorceRate.enabled,
          min: view.filters.divorceRate.min,
        },
        netWorth: {
          enabled: view.filters.netWorth.enabled,
          min: view.filters.netWorth.min,
          max: view.filters.netWorth.max,
        },
        luxuryDensity: {
          enabled: view.filters.luxuryDensity.enabled,
          min: view.filters.luxuryDensity.min,
        },
        multiProperty: {
          enabled: view.filters.multiProperty.enabled,
          min: view.filters.multiProperty.min,
        },
      });
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
    setFilters((prev) => {
      // Fixed: Don't use spread here, create a new object properly
      const newFilters: MapFilters = {
        state: prev.state,
        divorceRate: {...(prev.divorceRate || {})},
        netWorth: {...(prev.netWorth || {})},
        luxuryDensity: {...(prev.luxuryDensity || {})},
        multiProperty: {...(prev.multiProperty || {})}
      };
      
      // Now update the specific property
      if (newFilters[category]) {
        newFilters[category] = {...(prev[category] || {}), [setting]: value};
      }
      
      return newFilters;
    });
  };

  const handleStateChange = (state: string | null) => {
    setSelectedState(state);
    setFilters(prev => {
      // Fixed: Create a new object without using spread on potentially non-object types
      return {
        state: state,
        divorceRate: prev.divorceRate,
        netWorth: prev.netWorth,
        luxuryDensity: prev.luxuryDensity,
        multiProperty: prev.multiProperty
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <MapHeader 
          savedViews={savedViews}
          selectedView={selectedView}
          onSaveClick={() => setIsSaveDialogOpen(true)}
          onGenerateReport={handleGenerateReport}
          onClose={onClose}
          onLoadView={handleLoadView}
        />
        
        <div className="flex h-full">
          <FiltersPanel 
            filters={filters}
            selectedState={selectedState}
            selectedView={selectedView}
            updateFilter={updateFilter}
            onStateChange={handleStateChange}
            onDeleteView={handleDeleteView}
          />
          
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

        <SaveViewDialog 
          open={isSaveDialogOpen}
          viewName={viewName}
          onOpenChange={setIsSaveDialogOpen}
          onViewNameChange={setViewName}
          onSave={handleSaveView}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedMapOverlay;

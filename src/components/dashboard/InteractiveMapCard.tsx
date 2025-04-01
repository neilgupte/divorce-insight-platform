
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Download, 
  Maximize, 
  Printer, 
  Share2,
  Filter,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

interface InteractiveMapCardProps {
  selectedState: string | null;
  selectedCity: string | null;
}

interface FilterSettings {
  enabled: boolean;
  values: number[];
  min: number;
  max: number;
  step: number;
  unit: string;
}

interface FilterState {
  divorceRate: FilterSettings;
  netWorth: FilterSettings;
  luxuryDensity: FilterSettings;
  multiProperty: FilterSettings;
}

const InteractiveMapCard: React.FC<InteractiveMapCardProps> = ({ selectedState, selectedCity }) => {
  // States for managing map interaction
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    divorceRate: {
      enabled: false,
      values: [3],
      min: 0,
      max: 10,
      step: 0.1,
      unit: "%"
    },
    netWorth: {
      enabled: false,
      values: [5, 50],
      min: 1,
      max: 100,
      step: 1,
      unit: "M"
    },
    luxuryDensity: {
      enabled: false,
      values: [3],
      min: 0,
      max: 20,
      step: 0.5,
      unit: "/km²"
    },
    multiProperty: {
      enabled: false,
      values: [3],
      min: 1,
      max: 10,
      step: 1,
      unit: ""
    }
  });

  // Effect to simulate loading when filters change
  useEffect(() => {
    if (Object.values(filters).some(filter => filter.enabled)) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [filters]);

  // Handler for mouse down (start dragging)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  // Handler for mouse move (during dragging)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Calculate bounds to prevent dragging outside of visible area
      const containerWidth = mapContainerRef.current?.offsetWidth || 0;
      const containerHeight = mapContainerRef.current?.offsetHeight || 0;
      const maxX = containerWidth * (zoom - 1) / 2;
      const maxY = containerHeight * (zoom - 1) / 2;
      
      // Apply bounds
      const boundedX = Math.max(-maxX, Math.min(newX, maxX));
      const boundedY = Math.max(-maxY, Math.min(newY, maxY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  // Handler for mouse up (end dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handler for mouse leave (end dragging if mouse leaves the container)
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handler for zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
    // Reset position when zooming in from default zoom
    if (zoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Handler for zoom out
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      // Reset position if zooming out to default zoom
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  // Handler for resetting zoom and position
  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handler for wheel event (zoom with mouse wheel)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Scroll up - zoom in
      handleZoomIn();
    } else {
      // Scroll down - zoom out
      handleZoomOut();
    }
  };

  // Handler for toggling filter on/off
  const toggleFilter = (filterName: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: {
        ...prev[filterName],
        enabled: !prev[filterName].enabled
      }
    }));
  };

  // Handler for changing filter values
  const handleFilterValueChange = (filterName: keyof FilterState, values: number[]) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: {
        ...prev[filterName],
        values
      }
    }));
  };

  // Function to get overlay styles based on active filters
  const getOverlayStyles = () => {
    const styles: React.CSSProperties = {
      mixBlendMode: 'multiply',
      transition: 'background-color 0.5s ease-in-out'
    };
    
    // Combine backgrounds for active filters
    if (filters.divorceRate.enabled) {
      styles.background = styles.background 
        ? `${styles.background}, radial-gradient(circle, rgba(255,0,0,0.2) 0%, rgba(255,0,0,0) 70%)`
        : 'radial-gradient(circle, rgba(255,0,0,0.2) 0%, rgba(255,0,0,0) 70%)';
    }
    
    if (filters.netWorth.enabled) {
      styles.background = styles.background 
        ? `${styles.background}, radial-gradient(circle, rgba(0,0,255,0.2) 20%, rgba(0,0,255,0) 80%)`
        : 'radial-gradient(circle, rgba(0,0,255,0.2) 20%, rgba(0,0,255,0) 80%)';
    }
    
    if (filters.luxuryDensity.enabled) {
      styles.background = styles.background 
        ? `${styles.background}, radial-gradient(circle, rgba(128,0,128,0.2) 30%, rgba(128,0,128,0) 75%)`
        : 'radial-gradient(circle, rgba(128,0,128,0.2) 30%, rgba(128,0,128,0) 75%)';
    }
    
    if (filters.multiProperty.enabled) {
      styles.background = styles.background 
        ? `${styles.background}, radial-gradient(circle, rgba(0,128,0,0.2) 10%, rgba(0,128,0,0) 65%)`
        : 'radial-gradient(circle, rgba(0,128,0,0.2) 10%, rgba(0,128,0,0) 65%)';
    }
    
    return styles;
  };

  // Function to get pin position based on state
  const getStatePinPosition = (state: string): React.CSSProperties => {
    const positions: {[key: string]: {left: string, top: string}} = {
      "California": { left: "15%", top: "45%" },
      "New York": { left: "80%", top: "33%" },
      "Texas": { left: "45%", top: "65%" },
      "Florida": { left: "75%", top: "75%" },
      "Illinois": { left: "60%", top: "40%" },
      "Washington": { left: "15%", top: "20%" },
      "Massachusetts": { left: "85%", top: "28%" },
      "Arizona": { left: "30%", top: "55%" },
    };
    
    return positions[state] || { left: "50%", top: "50%" };
  };

  // Export map as image
  const handleExportImage = () => {
    const mapElement = document.querySelector(".map-container");
    
    if (!mapElement) {
      toast({
        title: "Export Failed",
        description: "Could not capture the map view.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Map Downloaded",
      description: "The map image has been downloaded to your device."
    });
  };

  // Print map
  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Opening print dialog for the current map view."
    });
    window.print();
  };

  // Share map
  const handleShare = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText("https://example.com/shared-map/abc123");
    
    toast({
      title: "Share Link Copied",
      description: "Shareable link has been copied to your clipboard."
    });
  };

  // Generate filter summary for tooltip
  const getFilterSummary = () => {
    const activeFilters = [];
    
    if (filters.divorceRate.enabled) {
      activeFilters.push(`Divorce Rate ≥ ${filters.divorceRate.values[0]}%`);
    }
    
    if (filters.netWorth.enabled) {
      activeFilters.push(`Net Worth $${filters.netWorth.values[0]}M-$${filters.netWorth.values[1]}M`);
    }
    
    if (filters.luxuryDensity.enabled) {
      activeFilters.push(`Luxury Density ≥ ${filters.luxuryDensity.values[0]}/km²`);
    }
    
    if (filters.multiProperty.enabled) {
      activeFilters.push(`Multi-Property ≥ ${filters.multiProperty.values[0]} properties`);
    }
    
    return activeFilters.length > 0 
      ? `Showing areas with ${activeFilters.join(' AND ')}`
      : 'No filters applied';
  };

  // The main map component that's shared between normal and fullscreen views
  const renderMap = (isFullscreen = false) => (
    <div 
      ref={mapContainerRef}
      className={`map-container h-[${isFullscreen ? '80vh' : '350px'}] rounded-md overflow-hidden cursor-grab active:cursor-grabbing`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      style={{ 
        position: "relative",
        touchAction: "none" // Disable browser handling of touch events
      }}
    >
      {/* Base Map Image */}
      <div 
        className="relative h-full w-full transition-transform duration-200 ease-out"
        style={{ 
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          transformOrigin: "center",
          willChange: "transform"
        }}
      >
        <img 
          src="/lovable-uploads/d50e0d7a-b4c6-4703-ad4d-0819c90db94e.png" 
          alt="USA Divorce Rate Map" 
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ 
            opacity: isLoading ? 0.7 : 1
          }}
          draggable="false"
        />
        
        {/* Filter-based Overlay */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={getOverlayStyles()}
        ></div>
        
        {/* Hotspots - only show if not loading and hotspots are enabled */}
        {showHotspots && !isLoading && (
          <div className="absolute inset-0">
            {/* New York */}
            <div className="absolute left-[78%] top-[32%]">
              <div className="w-6 h-6 bg-red-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Miami */}
            <div className="absolute left-[78%] top-[76%]">
              <div className="w-6 h-6 bg-orange-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Chicago */}
            <div className="absolute left-[60%] top-[30%]">
              <div className="w-6 h-6 bg-green-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            {/* San Francisco */}
            <div className="absolute left-[12%] top-[40%]">
              <div className="w-6 h-6 bg-blue-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Phoenix */}
            <div className="absolute left-[22%] top-[52%]">
              <div className="w-6 h-6 bg-yellow-500/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Selected state/city pin */}
            {selectedState && selectedState !== "All States" && (
              <div className="absolute" style={getStatePinPosition(selectedState)}>
                <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center border-2 border-blue-500 animate-pulse shadow-lg">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/80 px-2 py-0.5 rounded text-xs font-medium shadow-sm">
                  {selectedState}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Legend - fixed position at bottom */}
      <div className="absolute bottom-2 right-2 bg-white/80 p-1 rounded text-xs shadow-sm">
        <div className="flex items-center gap-1">
          <span>Low</span>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded"></div>
          <span>High</span>
        </div>
      </div>
      
      {/* Filter summary tooltip */}
      {Object.values(filters).some(f => f.enabled) && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-2 left-2 bg-white/80 p-1 rounded-full shadow-sm">
                <Filter className="h-4 w-4 text-primary" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p className="text-xs">{getFilterSummary()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5" /> 
            U.S. High-Net-Worth Divorce Heatmap
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              <span>{zoom.toFixed(1)}x</span>
            </Badge>
            <Button variant="outline" size="icon" onClick={() => setIsFullscreenOpen(true)}>
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleResetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Interactive map showing divorce rates by state
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          {/* Filter toggles */}
          <div className="flex items-center space-x-2">
            <Toggle 
              pressed={filters.divorceRate.enabled} 
              onPressedChange={() => toggleFilter('divorceRate')}
              className="bg-red-100 data-[state=on]:bg-red-200 data-[state=on]:text-red-700 h-7"
              size="sm"
            >
              Divorce Rate
            </Toggle>
            <Toggle 
              pressed={filters.netWorth.enabled} 
              onPressedChange={() => toggleFilter('netWorth')}
              className="bg-blue-100 data-[state=on]:bg-blue-200 data-[state=on]:text-blue-700 h-7"
              size="sm"
            >
              Net Worth
            </Toggle>
            <Toggle 
              pressed={filters.luxuryDensity.enabled} 
              onPressedChange={() => toggleFilter('luxuryDensity')}
              className="bg-purple-100 data-[state=on]:bg-purple-200 data-[state=on]:text-purple-700 h-7"
              size="sm"
            >
              Luxury
            </Toggle>
            <Toggle 
              pressed={filters.multiProperty.enabled} 
              onPressedChange={() => toggleFilter('multiProperty')}
              className="bg-green-100 data-[state=on]:bg-green-200 data-[state=on]:text-green-700 h-7"
              size="sm"
            >
              Multi-Property
            </Toggle>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-hotspots" 
              checked={showHotspots} 
              onCheckedChange={setShowHotspots} 
            />
            <Label htmlFor="show-hotspots">Hotspots</Label>
          </div>
        </div>
        
        {/* Active filter sliders */}
        <div className="space-y-3">
          {filters.divorceRate.enabled && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-red-600">Divorce Rate ≥ {filters.divorceRate.values[0]}{filters.divorceRate.unit}</Label>
              </div>
              <Slider 
                value={filters.divorceRate.values} 
                min={filters.divorceRate.min}
                max={filters.divorceRate.max}
                step={filters.divorceRate.step}
                onValueChange={(values) => handleFilterValueChange('divorceRate', values)}
                className="py-1"
              />
            </div>
          )}
          
          {filters.netWorth.enabled && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-blue-600">Net Worth ${filters.netWorth.values[0]}{filters.netWorth.unit}-${filters.netWorth.values[1]}{filters.netWorth.unit}</Label>
              </div>
              <Slider 
                value={filters.netWorth.values} 
                min={filters.netWorth.min}
                max={filters.netWorth.max}
                step={filters.netWorth.step}
                onValueChange={(values) => handleFilterValueChange('netWorth', values)}
                className="py-1"
              />
            </div>
          )}
          
          {filters.luxuryDensity.enabled && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-purple-600">Luxury Density ≥ {filters.luxuryDensity.values[0]}{filters.luxuryDensity.unit}</Label>
              </div>
              <Slider 
                value={filters.luxuryDensity.values} 
                min={filters.luxuryDensity.min}
                max={filters.luxuryDensity.max}
                step={filters.luxuryDensity.step}
                onValueChange={(values) => handleFilterValueChange('luxuryDensity', values)}
                className="py-1"
              />
            </div>
          )}
          
          {filters.multiProperty.enabled && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-green-600">Multi-Property ≥ {filters.multiProperty.values[0]} properties</Label>
              </div>
              <Slider 
                value={filters.multiProperty.values} 
                min={filters.multiProperty.min}
                max={filters.multiProperty.max}
                step={filters.multiProperty.step}
                onValueChange={(values) => handleFilterValueChange('multiProperty', values)}
                className="py-1"
              />
            </div>
          )}
        </div>
        
        {/* Map container */}
        {renderMap()}
      </CardContent>
      
      {/* Fullscreen dialog */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="bg-background border-b p-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center text-lg">
                <Map className="mr-2 h-5 w-5" /> 
                U.S. High-Net-Worth Divorce Heatmap
              </DialogTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="icon" onClick={() => setIsFullscreenOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogDescription className="mt-2">
              {getFilterSummary()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex flex-wrap justify-between gap-2 mb-4">
              {/* Filter toggles for fullscreen */}
              <div className="flex items-center flex-wrap gap-2">
                <Toggle 
                  pressed={filters.divorceRate.enabled} 
                  onPressedChange={() => toggleFilter('divorceRate')}
                  className="bg-red-100 data-[state=on]:bg-red-200 data-[state=on]:text-red-700"
                >
                  Divorce Rate
                </Toggle>
                <Toggle 
                  pressed={filters.netWorth.enabled} 
                  onPressedChange={() => toggleFilter('netWorth')}
                  className="bg-blue-100 data-[state=on]:bg-blue-200 data-[state=on]:text-blue-700"
                >
                  Net Worth
                </Toggle>
                <Toggle 
                  pressed={filters.luxuryDensity.enabled} 
                  onPressedChange={() => toggleFilter('luxuryDensity')}
                  className="bg-purple-100 data-[state=on]:bg-purple-200 data-[state=on]:text-purple-700"
                >
                  Luxury Density
                </Toggle>
                <Toggle 
                  pressed={filters.multiProperty.enabled} 
                  onPressedChange={() => toggleFilter('multiProperty')}
                  className="bg-green-100 data-[state=on]:bg-green-200 data-[state=on]:text-green-700"
                >
                  Multi-Property
                </Toggle>
                <div className="flex items-center ml-2">
                  <Switch 
                    id="fullscreen-hotspots" 
                    checked={showHotspots} 
                    onCheckedChange={setShowHotspots} 
                  />
                  <Label htmlFor="fullscreen-hotspots" className="ml-2">Show Hotspots</Label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>{zoom.toFixed(1)}x</span>
                </Badge>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleResetView}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Active filter sliders for fullscreen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {filters.divorceRate.enabled && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-red-600">Divorce Rate ≥ {filters.divorceRate.values[0]}{filters.divorceRate.unit}</Label>
                  </div>
                  <Slider 
                    value={filters.divorceRate.values} 
                    min={filters.divorceRate.min}
                    max={filters.divorceRate.max}
                    step={filters.divorceRate.step}
                    onValueChange={(values) => handleFilterValueChange('divorceRate', values)}
                  />
                </div>
              )}
              
              {filters.netWorth.enabled && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-blue-600">Net Worth ${filters.netWorth.values[0]}{filters.netWorth.unit}-${filters.netWorth.values[1]}{filters.netWorth.unit}</Label>
                  </div>
                  <Slider 
                    value={filters.netWorth.values} 
                    min={filters.netWorth.min}
                    max={filters.netWorth.max}
                    step={filters.netWorth.step}
                    onValueChange={(values) => handleFilterValueChange('netWorth', values)}
                  />
                </div>
              )}
              
              {filters.luxuryDensity.enabled && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-purple-600">Luxury Density ≥ {filters.luxuryDensity.values[0]}{filters.luxuryDensity.unit}</Label>
                  </div>
                  <Slider 
                    value={filters.luxuryDensity.values} 
                    min={filters.luxuryDensity.min}
                    max={filters.luxuryDensity.max}
                    step={filters.luxuryDensity.step}
                    onValueChange={(values) => handleFilterValueChange('luxuryDensity', values)}
                  />
                </div>
              )}
              
              {filters.multiProperty.enabled && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-green-600">Multi-Property ≥ {filters.multiProperty.values[0]} properties</Label>
                  </div>
                  <Slider 
                    value={filters.multiProperty.values} 
                    min={filters.multiProperty.min}
                    max={filters.multiProperty.max}
                    step={filters.multiProperty.step}
                    onValueChange={(values) => handleFilterValueChange('multiProperty', values)}
                  />
                </div>
              )}
            </div>
            
            {/* Fullscreen map */}
            <div className="flex-1">
              {renderMap(true)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InteractiveMapCard;

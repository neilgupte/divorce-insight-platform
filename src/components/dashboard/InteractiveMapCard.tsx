
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Map, MapPin, ZoomIn, ZoomOut, RotateCcw, Layers } from "lucide-react";

interface InteractiveMapCardProps {
  selectedState: string | null;
  selectedCity: string | null;
}

const InteractiveMapCard: React.FC<InteractiveMapCardProps> = ({ selectedState, selectedCity }) => {
  // States for managing map interaction
  const [activeOverlay, setActiveOverlay] = useState<string>("default");
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Effect to simulate loading when overlay changes
  useEffect(() => {
    if (activeOverlay !== "default") {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activeOverlay]);

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

  // Function to get overlay styles based on active overlay
  const getOverlayStyles = () => {
    switch (activeOverlay) {
      case "divorceRate":
        return "bg-red-500/20";
      case "netWorth":
        return "bg-blue-500/20";
      case "luxuryDensity":
        return "bg-purple-500/20";
      case "multiProperty":
        return "bg-green-500/20";
      case "combined":
        return "bg-gradient-to-br from-red-500/10 via-blue-500/10 to-green-500/10";
      default:
        return "bg-transparent";
    }
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
      <CardContent>
        <div className="mb-4">
          <Tabs 
            defaultValue="default" 
            value={activeOverlay}
            onValueChange={(value) => setActiveOverlay(value)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="default">Base Map</TabsTrigger>
              <TabsTrigger value="divorceRate">Divorce Rate</TabsTrigger>
              <TabsTrigger value="netWorth">Net Worth</TabsTrigger>
              <TabsTrigger value="luxuryDensity">Luxury</TabsTrigger>
              <TabsTrigger value="multiProperty">Multi-Property</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div 
          ref={mapContainerRef}
          className="h-[350px] rounded-md overflow-hidden cursor-grab active:cursor-grabbing"
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
            
            {/* Overlay based on selected filter */}
            <div 
              className={`absolute inset-0 transition-colors duration-500 mix-blend-multiply ${getOverlayStyles()}`}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMapCard;

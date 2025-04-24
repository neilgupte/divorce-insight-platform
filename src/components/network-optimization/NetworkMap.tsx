import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";

// Note: In a production app, you should store this in an environment variable
const MAPBOX_TOKEN = "pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrbDM1YnRwNzJiejUyd3IwcWx0MTNjOGgifQ.FCIBP8DzlTIYdglmeug9cQ";

interface Facility {
  id: string;
  name: string;
  workers: number;
  neededWorkers: number;
  marginalValue: number;
  utilisation: number;
  attrition: number;
  commuteTime: number;
  laborPoolIndex: number;
  type: string;
  lat: number;
  lng: number;
}

interface MapLayers {
  facilities: boolean;
  commuteRadii: boolean;
  populationDensity: boolean;
  laborHeatmap: boolean;
}

interface NetworkMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (facility: Facility) => void;
  layers: MapLayers;
}

const NetworkMap: React.FC<NetworkMapProps> = ({
  facilities,
  selectedFacility,
  onSelectFacility,
  layers
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const circles = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Mapbox map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      // Add labor heatmap layer
      if (map.current) {
        map.current.addSource("labor-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              // Sample heatmap data points - in a real app, this would be actual labor pool data
              { type: "Feature", properties: { intensity: 0.9 }, geometry: { type: "Point", coordinates: [-122.4194, 37.7749] } },
              { type: "Feature", properties: { intensity: 0.7 }, geometry: { type: "Point", coordinates: [-122.2712, 37.8044] } },
              { type: "Feature", properties: { intensity: 0.8 }, geometry: { type: "Point", coordinates: [-121.8863, 37.3382] } },
              { type: "Feature", properties: { intensity: 0.6 }, geometry: { type: "Point", coordinates: [-122.4569, 38.1499] } },
              { type: "Feature", properties: { intensity: 0.5 }, geometry: { type: "Point", coordinates: [-121.2908, 37.9577] } },
            ]
          }
        });

        map.current.addLayer({
          id: "labor-heatmap",
          type: "heatmap",
          source: "labor-data",
          paint: {
            "heatmap-weight": ["get", "intensity"],
            "heatmap-intensity": 1,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0, 0, 255, 0)",
              0.2, "rgba(0, 0, 255, 0.2)",
              0.4, "rgba(0, 255, 255, 0.4)",
              0.6, "rgba(0, 255, 0, 0.6)", 
              0.8, "rgba(255, 255, 0, 0.8)",
              1, "rgba(255, 0, 0, 1)"
            ],
            "heatmap-radius": 30,
            "heatmap-opacity": layers.laborHeatmap ? 0.7 : 0
          }
        });

        // Add population density layer (mock)
        map.current.addSource("population-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              // Mock population density data
              { 
                type: "Feature", 
                properties: {}, 
                geometry: { 
                  type: "Polygon", 
                  coordinates: [[
                    [-122.51, 37.77], [-122.42, 37.77], [-122.42, 37.72], [-122.51, 37.72], [-122.51, 37.77]
                  ]] 
                } 
              },
              { 
                type: "Feature", 
                properties: {}, 
                geometry: { 
                  type: "Polygon", 
                  coordinates: [[
                    [-122.42, 37.80], [-122.35, 37.80], [-122.35, 37.75], [-122.42, 37.75], [-122.42, 37.80]
                  ]] 
                } 
              }
            ]
          }
        });

        map.current.addLayer({
          id: "population-fill",
          type: "fill",
          source: "population-data",
          layout: {},
          paint: {
            "fill-color": "#4a90e2",
            "fill-opacity": layers.populationDensity ? 0.4 : 0
          }
        });
        
        map.current.addLayer({
          id: "population-outline",
          type: "line",
          source: "population-data",
          layout: {},
          paint: {
            "line-color": "#3579cc",
            "line-width": 2,
            "line-opacity": layers.populationDensity ? 0.8 : 0
          }
        });
      }
    });

    // Add facilities as markers
    facilities.forEach(facility => {
      addFacilityMarker(facility);
    });

    return () => {
      map.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update layer visibility based on props
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    try {
      // Update labor heatmap visibility
      if (map.current.getLayer("labor-heatmap")) {
        map.current.setPaintProperty(
          "labor-heatmap",
          "heatmap-opacity",
          layers.laborHeatmap ? 0.7 : 0
        );
      }

      // Update population density visibility
      if (map.current.getLayer("population-fill")) {
        map.current.setPaintProperty(
          "population-fill",
          "fill-opacity",
          layers.populationDensity ? 0.4 : 0
        );
        map.current.setPaintProperty(
          "population-outline",
          "line-opacity",
          layers.populationDensity ? 0.8 : 0
        );
      }

      // Update facility markers visibility
      Object.values(markers.current).forEach(marker => {
        marker.getElement().style.display = layers.facilities ? "block" : "none";
      });

      // Update commute radii visibility
      Object.keys(circles.current).forEach(facilityId => {
        const element = document.getElementById(`circle-${facilityId}`);
        if (element) {
          element.style.display = layers.commuteRadii ? "block" : "none";
        }
      });
    } catch (error) {
      console.error("Error updating map layers:", error);
    }
  }, [layers]);

  // Update selected facility marker
  useEffect(() => {
    Object.keys(markers.current).forEach(id => {
      const markerElement = markers.current[id].getElement();
      if (id === selectedFacility?.id) {
        markerElement.classList.add("selected-marker");
        markerElement.style.zIndex = "1";
      } else {
        markerElement.classList.remove("selected-marker");
        markerElement.style.zIndex = "0";
      }
    });

    if (selectedFacility && map.current) {
      map.current.flyTo({
        center: [selectedFacility.lng, selectedFacility.lat],
        zoom: 11,
        duration: 1000
      });
    }
  }, [selectedFacility]);

  // Add a single facility marker to the map
  const addFacilityMarker = (facility: Facility) => {
    if (!map.current) return;

    // Create custom marker element
    const el = document.createElement("div");
    el.className = "facility-marker";
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = getMarkerColor(facility.type);
    el.style.border = "2px solid #fff";
    el.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    el.style.cursor = "pointer";
    el.style.transition = "all 0.2s ease";

    // Create and add marker to map
    const marker = new mapboxgl.Marker(el)
      .setLngLat([facility.lng, facility.lat])
      .addTo(map.current);

    // Add popup with facility info
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25
    }).setHTML(`
      <div class="p-2">
        <h3 class="font-bold">${facility.name}</h3>
        <p class="text-sm">Workers: ${facility.workers}</p>
        <p class="text-sm">Needed: ${facility.neededWorkers}</p>
        <p class="text-sm">Type: ${facility.type}</p>
      </div>
    `);

    // Add hover events
    el.addEventListener("mouseenter", () => {
      marker.setPopup(popup);
      popup.addTo(map.current!);
    });

    el.addEventListener("mouseleave", () => {
      popup.remove();
    });

    // Add click event
    el.addEventListener("click", () => {
      onSelectFacility(facility);
    });

    markers.current[facility.id] = marker;
    
    // Add commute radius circle
    addCommuteRadius(facility);
  };

  // Add commute radius circle for a facility
  const addCommuteRadius = (facility: Facility) => {
    if (!map.current) return;
    
    // Create a circle element
    const radius = facility.commuteTime * 150; // Scale commute time to radius in meters
    
    const circleElement = document.createElement("div");
    circleElement.id = `circle-${facility.id}`;
    circleElement.className = "commute-radius";
    circleElement.style.position = "absolute";
    circleElement.style.borderRadius = "50%";
    circleElement.style.border = `2px solid ${getMarkerColor(facility.type)}`;
    circleElement.style.backgroundColor = `${getMarkerColor(facility.type)}33`; // Add transparency
    circleElement.style.width = `${radius}px`;
    circleElement.style.height = `${radius}px`;
    circleElement.style.transform = "translate(-50%, -50%)";
    circleElement.style.display = layers.commuteRadii ? "block" : "none";
    circleElement.style.zIndex = "-1";
    circleElement.style.pointerEvents = "none";

    // Add to map
    const circleMarker = new mapboxgl.Marker(circleElement)
      .setLngLat([facility.lng, facility.lat])
      .addTo(map.current);
    
    circles.current[facility.id] = circleMarker;
  };

  // Get color based on facility type
  const getMarkerColor = (type: string) => {
    switch (type) {
      case "Distribution": return "#4a90e2";
      case "Fulfillment": return "#50e3c2";
      case "Storage": return "#f5a623";
      case "Logistics": return "#bd10e0";
      default: return "#7ed321";
    }
  };

  const handleMapApiKeyInput = () => {
    const key = prompt("Please enter your Mapbox API key:");
    
    if (key && key.trim()) {
      // In a real app, you'd store this securely
      toast({
        title: "Map API key set",
        description: "Your Mapbox API key has been temporarily set for this session.",
      });
      // Reload the page to initialize the map with the new key
      window.location.reload();
    }
  };

  return (
    <div className="relative h-full w-full">
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center p-6">
            <h3 className="text-lg font-medium">Map API Key Required</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              A Mapbox API key is required to display the map.
            </p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={handleMapApiKeyInput}
            >
              Enter API Key
            </button>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default NetworkMap;

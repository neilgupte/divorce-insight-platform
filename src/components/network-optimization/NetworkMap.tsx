
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";

// Temporary token for development - in production this should come from env vars
const MAPBOX_TOKEN = "pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrbDM1YnRwNzJiejUyd3IwcWx0MTNjOGgifQ.FCIBP8DzlTIYdglmeug9cQ";

interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  type: string;
}

interface Facility {
  id: string;
  name: string;
  workers?: number;
  neededWorkers?: number;
  marginalValue?: number;
  utilisation?: number;
  attrition?: number;
  commuteTime?: number;
  laborPoolIndex?: number;
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
  facilities?: Facility[];
  selectedFacility?: Facility | null;
  onSelectFacility?: (facility: Facility) => void;
  layers?: MapLayers;
}

// Generate 20 hotspots with overlapping areas
const mockHotspots: Hotspot[] = [
  // Cluster 1 - 3 overlapping facilities in San Francisco area
  { id: "1", name: "SF Downtown Hub", lat: 37.7749, lng: -122.4194, radius: 2000, type: "Distribution" },
  { id: "2", name: "SF East Center", lat: 37.7790, lng: -122.4100, radius: 1800, type: "Fulfillment" },
  { id: "3", name: "SF South Facility", lat: 37.7700, lng: -122.4150, radius: 2200, type: "Storage" },
  
  // Cluster 2 - 3 overlapping facilities in Oakland area
  { id: "4", name: "Oakland Central", lat: 37.8044, lng: -122.2712, radius: 1900, type: "Logistics" },
  { id: "5", name: "Oakland North", lat: 37.8100, lng: -122.2650, radius: 2100, type: "Distribution" },
  { id: "6", name: "Oakland East", lat: 37.8000, lng: -122.2600, radius: 1700, type: "Storage" },
  
  // Cluster 3 - 2 overlapping facilities in San Jose
  { id: "7", name: "San Jose Main", lat: 37.3382, lng: -121.8863, radius: 2300, type: "Distribution" },
  { id: "8", name: "San Jose South", lat: 37.3300, lng: -121.8800, radius: 2000, type: "Fulfillment" },
  
  // Individual facilities spread across the Bay Area
  { id: "9", name: "Palo Alto Center", lat: 37.4419, lng: -122.1430, radius: 1500, type: "Fulfillment" },
  { id: "10", name: "Mountain View Hub", lat: 37.3861, lng: -122.0839, radius: 1800, type: "Storage" },
  { id: "11", name: "Berkeley Facility", lat: 37.8715, lng: -122.2730, radius: 1600, type: "Distribution" },
  { id: "12", name: "Richmond Point", lat: 37.9358, lng: -122.3478, radius: 1700, type: "Logistics" },
  { id: "13", name: "Fremont Center", lat: 37.5485, lng: -121.9886, radius: 1900, type: "Storage" },
  { id: "14", name: "Hayward Hub", lat: 37.6688, lng: -122.0808, radius: 2000, type: "Distribution" },
  { id: "15", name: "San Mateo Facility", lat: 37.5630, lng: -122.3255, radius: 1800, type: "Fulfillment" },
  { id: "16", name: "Redwood City Center", lat: 37.4852, lng: -122.2364, radius: 1700, type: "Storage" },
  { id: "17", name: "Daly City Hub", lat: 37.6879, lng: -122.4702, radius: 1600, type: "Distribution" },
  { id: "18", name: "South SF Point", lat: 37.6547, lng: -122.4077, radius: 1500, type: "Logistics" },
  { id: "19", name: "Alameda Facility", lat: 37.7652, lng: -122.2416, radius: 1700, type: "Storage" },
  { id: "20", name: "San Rafael Center", lat: 37.9735, lng: -122.5311, radius: 1800, type: "Distribution" },
];

const NetworkMap: React.FC<NetworkMapProps> = ({ 
  facilities = [], 
  selectedFacility = null, 
  onSelectFacility = () => {}, 
  layers = { facilities: true, commuteRadii: true, populationDensity: false, laborHeatmap: false } 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  
  // Use passed facilities if available, otherwise use mockHotspots
  const displayFacilities = facilities.length > 0 ? facilities : mockHotspots;

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-122.2712, 37.8044], // Center on Oakland
        zoom: 9
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        if (!map.current) return;

        // Add hotspots to the map
        displayFacilities.forEach((hotspot) => {
          // Add circle layer for the radius
          map.current?.addSource(`radius-${hotspot.id}`, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [hotspot.lng, hotspot.lat]
              }
            }
          });

          map.current?.addLayer({
            id: `radius-${hotspot.id}`,
            type: "circle",
            source: `radius-${hotspot.id}`,
            paint: {
              "circle-radius": {
                stops: [
                  [0, 0],
                  [20, hotspot.radius / 10] // Scale radius based on zoom level
                ]
              },
              "circle-color": "rgba(66, 135, 245, 0.15)",
              "circle-stroke-width": 1,
              "circle-stroke-color": "rgba(66, 135, 245, 0.3)"
            }
          });

          // Add marker for the facility
          const el = document.createElement("div");
          el.className = "facility-marker";
          el.style.width = "12px";
          el.style.height = "12px";
          el.style.backgroundColor = getFacilityColor(hotspot.type);
          el.style.border = "2px solid white";
          el.style.borderRadius = "50%";
          el.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
          el.style.cursor = "pointer";

          const marker = new mapboxgl.Marker(el)
            .setLngLat([hotspot.lng, hotspot.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-bold">${hotspot.name}</h3>
                    <p class="text-sm">Type: ${hotspot.type}</p>
                  </div>
                `)
            )
            .addTo(map.current);
            
          // Add click event to marker if onSelectFacility is provided
          if (onSelectFacility) {
            el.addEventListener('click', () => {
              onSelectFacility(hotspot as Facility);
            });
          }
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "Failed to load the map. Please check your connection and try again.",
        variant: "destructive"
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [toast, displayFacilities, onSelectFacility]);

  const getFacilityColor = (type: string) => {
    switch (type) {
      case "Distribution": return "#4a90e2";
      case "Fulfillment": return "#50e3c2";
      case "Storage": return "#f5a623";
      case "Logistics": return "#bd10e0";
      default: return "#7ed321";
    }
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default NetworkMap;

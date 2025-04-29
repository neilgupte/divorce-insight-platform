
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

// Mapbox API token
const MAPBOX_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOXBzbXI0eTFjdHoya3IwNng1ZTI4ZHoifQ.hgWIXnSx6HdRC67U2xhdxQ";

interface Facility {
  id: string;
  name: string;
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
  fullscreen?: boolean;
}

/**
 * Generate a GeoJSON polygon approximating a circle
 * @param center [lng, lat]
 * @param radiusMiles radius in miles
 */
const generateCircle = ([lng, lat]: [number, number], radiusMiles: number) => {
  const radiusMeters = radiusMiles * 1609.34;
  const points = 64;
  const coords: [number, number][] = [];
  const earth = 6378137;

  for (let i = 0; i <= points; i++) {
    const angle = (i * 360) / points;
    const dx = radiusMeters * Math.cos((angle * Math.PI) / 180);
    const dy = radiusMeters * Math.sin((angle * Math.PI) / 180);
    const deltaLat = dy / earth;
    const deltaLng = dx / (earth * Math.cos((Math.PI * lat) / 180));

    coords.push([
      lng + (deltaLng * 180) / Math.PI,
      lat + (deltaLat * 180) / Math.PI,
    ]);
  }

  return {
    type: "Feature" as const,
    geometry: {
      type: "Polygon" as const,
      coordinates: [coords],
    },
    properties: {} // Add empty properties object to satisfy the GeoJSON type
  };
};

const mockFacilities: Facility[] = [
  { id: "1", name: "Hub A", type: "Distribution", lat: 37.7749, lng: -122.4194 },
  { id: "2", name: "Hub B", type: "Fulfillment", lat: 37.8044, lng: -122.2712 },
  // ... more mocks as needed
];

const NetworkMap: React.FC<NetworkMapProps> = ({ 
  facilities = [],
  onSelectFacility = () => {},
  layers = { facilities: true, commuteRadii: true, populationDensity: false, laborHeatmap: false },
  fullscreen = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const circleLayerRefs = useRef<{[key: string]: boolean}>({});
  const mapLoaded = useRef<boolean>(false);
  const { toast } = useToast();
  const [maxRadius, setMaxRadius] = useState<number>(30);

  // Use real data if provided, else fallback to mock
  const displayFacilities = facilities.length > 0 ? facilities : mockFacilities;

  // Function to add or update circles on the map
  const updateCircles = (selectedFacility?: Facility | null) => {
    if (!map.current || !mapLoaded.current || !layers.commuteRadii) return;

    // Clear existing circle layers first
    Object.keys(circleLayerRefs.current).forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
      const sourceId = `src-${layerId}`;
      if (map.current?.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }
    });
    
    // Reset the refs
    circleLayerRefs.current = {};

    const facilitiesToShow = selectedFacility ? [selectedFacility] : displayFacilities;

    // Add circles for facilities
    facilitiesToShow.forEach((fac) => {
      // Add three concentric circles
      [10, 20, maxRadius].forEach((miles, idx) => {
        const layerId = `circle-${fac.id}-${miles}`;
        const sourceId = `src-${layerId}`;

        map.current!.addSource(sourceId, {
          type: "geojson",
          data: generateCircle([fac.lng, fac.lat], miles),
        });

        map.current!.addLayer({
          id: layerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "#4287f5",
            "fill-opacity": 0.1 * (idx + 1),
            "fill-outline-color": "#4287f5",
          },
        });

        // Track which layers we've added
        circleLayerRefs.current[layerId] = true;
      });
    });
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) {
      map.current.remove();
      map.current = null;
      mapLoaded.current = false;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-122.4194, 37.7749],
        zoom: 9,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Set loaded flag when map style is fully loaded
      map.current.on('style.load', () => {
        mapLoaded.current = true;
        
        // Now it's safe to add facilities and circles
        if (!map.current) return;
        
        // Add markers for facilities
        displayFacilities.forEach((fac) => {
          // Add facility marker
          const el = document.createElement("div");
          el.className = "facility-marker";
          el.style.width = "14px";
          el.style.height = "14px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = getFacilityColor(fac.type);
          el.style.border = "2px solid white";
          el.style.cursor = "pointer";

          const marker = new mapboxgl.Marker(el)
            .setLngLat([fac.lng, fac.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>${fac.name}</h3><p>Type: ${fac.type}</p>`
              )
            )
            .addTo(map.current!);

          el.addEventListener("click", () => onSelectFacility(fac));
        });

        // Add circles if enabled
        updateCircles();
      });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Error loading map", description: e.message, variant: "destructive" });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapLoaded.current = false;
      }
    };
  }, [displayFacilities]);

  // Update circles when commuteRadii layer setting changes or maxRadius changes
  useEffect(() => {
    // Only update circles if map is loaded and commuteRadii is enabled
    if (mapLoaded.current && layers.commuteRadii) {
      updateCircles();
    }
  }, [layers.commuteRadii, maxRadius]);

  // Render radius control slider if in fullscreen mode and commuteRadii is enabled
  const renderRadiusControl = () => {
    if (!layers.commuteRadii) return null;

    return (
      <div className={`absolute bottom-5 left-5 p-3 bg-white/90 rounded-md shadow-md z-10 ${fullscreen ? 'w-64' : 'w-48'}`}>
        <div className="mb-1 flex justify-between">
          <span className="text-sm font-medium">Max Radius (miles)</span>
          <span className="text-sm font-medium">{maxRadius}</span>
        </div>
        <Slider
          value={[maxRadius]}
          min={5}
          max={50}
          step={5}
          onValueChange={(value) => setMaxRadius(value[0])}
        />
      </div>
    );
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-md overflow-hidden" />
      {renderRadiusControl()}
    </div>
  );
};

function getFacilityColor(type: string) {
  switch (type) {
    case "Distribution": return "#4a90e2";
    case "Fulfillment":  return "#50e3c2";
    case "Storage":      return "#f5a623";
    case "Logistics":    return "#bd10e0";
    default:              return "#7ed321";
  }
}

export default NetworkMap;

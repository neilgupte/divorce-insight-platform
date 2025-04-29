
// src/components/network-optimization/NetworkMap.tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

const MAPBOX_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOXBzbXI0eTFjdHoya3IwNng1ZTI4ZHoifQ.hgWIXnSx6HdRC67U2xhdxQ";

interface Facility {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  workers?: number;
  neededWorkers?: number;
  marginalValue?: number;
  utilisation?: number;
  attrition?: number;
  commuteTime?: number;
  laborPoolIndex?: number;
}

interface NetworkMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (facility: Facility) => void;
  layers: { 
    facilities?: boolean; 
    commuteRadii?: boolean;
    populationDensity?: boolean;
    laborHeatmap?: boolean;
  };
  fullscreen?: boolean;
  maxRadius?: number;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({
  facilities = [],
  selectedFacility = null,
  layers = { commuteRadii: true },
  fullscreen = false,
  onSelectFacility,
  maxRadius = 30,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ id: string; marker: mapboxgl.Marker }[]>([]);
  const circleLayers = useRef<string[]>([]);
  const { toast } = useToast();

  // **1. Visible‐facilities state**
  const [visibleIds, setVisibleIds] = useState<string[]>(
    facilities.map((f) => f.id)
  );
  const toggleFacility = (id: string) =>
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // draw map + markers + circles
  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) map.current.remove();

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-122.4194, 37.7749],
      zoom: 9,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Wait for map to load style before adding sources and layers
    map.current.on("load", () => {
      // add all facility markers
      facilities.forEach((f) => {
        const el = document.createElement("div");
        el.className = "facility-marker";
        el.style.width = "12px";
        el.style.height = "12px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#4a90e2";
        el.style.cursor = "pointer";

        const m = new mapboxgl.Marker(el)
          .setLngLat([f.lng, f.lat])
          .setPopup(new mapboxgl.Popup().setText(f.name))
          .addTo(map.current!);

        el.addEventListener("click", () => onSelectFacility(f));
        markers.current.push({ id: f.id, marker: m });
      });

      updateCircles();
    });

    return () => {
      // Clean up markers and layers
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current = [];
      
      if (map.current) {
        circleLayers.current.forEach((id) => {
          if (map.current!.getLayer(id)) map.current!.removeLayer(id);
          if (map.current!.getSource(id)) map.current!.removeSource(id);
        });
        map.current.remove();
        map.current = null;
      }
      circleLayers.current = [];
    };
  }, [facilities, onSelectFacility]);

  // Update circles when layers or visibility changes
  const updateCircles = () => {
    if (!map.current || !map.current.loaded() || !map.current.isStyleLoaded()) {
      // If the map isn't ready yet, try again in a moment
      setTimeout(updateCircles, 100);
      return;
    }
    
    // Remove existing circle layers and sources first
    circleLayers.current.forEach(id => {
      if (map.current!.getLayer(id)) map.current!.removeLayer(id);
      if (map.current!.getSource(id)) map.current!.removeSource(id);
    });
    circleLayers.current = [];
    
    // Add new circles if commuteRadii layer is enabled
    if (layers.commuteRadii) {
      facilities.forEach((f) => {
        if (!visibleIds.includes(f.id)) return;
        
        [10, 20, maxRadius].forEach((mi, idx) => {
          const sid = `circle-${f.id}-${idx}-${Date.now()}`;  // Ensure unique ID
          const geo = generateCircle([f.lng, f.lat], mi);
          
          try {
            map.current!.addSource(sid, { type: "geojson", data: geo });
            map.current!.addLayer({
              id: sid,
              type: "fill",
              source: sid,
              paint: {
                "fill-color": "#4287f5",
                "fill-opacity": 0.1 * (idx + 1),
              },
            });
            circleLayers.current.push(sid);
          } catch (error) {
            console.error("Error adding circle:", error);
          }
        });
      });
    }
  };

  // Update circles when relevant props change
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      updateCircles();
    }
  }, [layers.commuteRadii, maxRadius, visibleIds]);

  // Update marker appearance when selection changes
  useEffect(() => {
    markers.current.forEach(({ id, marker }) => {
      const el = marker.getElement();
      if (selectedFacility && id === selectedFacility.id) {
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.backgroundColor = "#1a56db";
        el.style.zIndex = "10";
      } else {
        el.style.width = "12px";
        el.style.height = "12px";
        el.style.backgroundColor = "#4a90e2";
        el.style.zIndex = "1";
      }
    });
  }, [selectedFacility]);

  // **2. Render slider + filter panel together**
  const ControlPanel = () => (
    <div
      className={`absolute ${
        fullscreen ? "bottom-12 left-12" : "bottom-12 left-5"
      } p-4 bg-white/90 rounded shadow-lg z-10 w-64`}
    >
      {/* radius slider */}
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium">
          <span>Max Radius (mi)</span>
          <span>{maxRadius}</span>
        </div>
        <Slider
          value={[maxRadius]}
          min={5}
          max={50}
          step={5}
          onValueChange={(v) => console.log("Radius changed to", v[0])}
          disabled={true}
        />
      </div>

      {/* facility filter */}
      <div>
        <div className="text-sm font-medium mb-2">Show Facilities</div>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {facilities.map((f) => (
            <label
              key={f.id}
              className="flex items-center text-sm hover:bg-gray-100 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={visibleIds.includes(f.id)}
                onChange={() => toggleFacility(f.id)}
                className="form-checkbox h-4 w-4"
              />
              <span className="ml-2">{f.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded" />
      <ControlPanel />
    </div>
  );
};

// simple circle generator
function generateCircle(
  [lng, lat]: [number, number],
  miles: number
): GeoJSON.Feature<GeoJSON.Polygon> {
  const R = 6378137;
  const pts = 64;
  const coords: [number, number][] = [];
  const d = miles * 1609.34;
  for (let i = 0; i <= pts; i++) {
    const a = (i * 2 * Math.PI) / pts;
    const dx = d * Math.cos(a);
    const dy = d * Math.sin(a);
    const dLat = dy / R;
    const dLng = dx / (R * Math.cos((Math.PI * lat) / 180));
    coords.push([
      lng + (dLng * 180) / Math.PI,
      lat + (dLat * 180) / Math.PI,
    ]);
  }
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
    properties: {},
  };
}

export default NetworkMap;

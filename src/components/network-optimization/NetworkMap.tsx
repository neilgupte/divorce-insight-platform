
// src/components/network-optimization/NetworkMap.tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";

const MAPBOX_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOXBzbXI0eTFjdHoya3IwNng1ZTI4ZHoifQ.hgWIXnSx6HdRC67U2xhdxQ";

interface Facility {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
}

interface NetworkMapProps {
  facilities?: Facility[];
  layers?: { commuteRadii?: boolean; populationDensity?: boolean; laborHeatmap?: boolean };
  maxRadius?: number;
  fullscreen?: boolean;
  selectedFacility?: Facility | null;
  onSelectFacility?: (f: Facility) => void;
}

const NetworkMap: React.FC<NetworkMapProps> = ({
  facilities = [],
  layers = { commuteRadii: true },
  maxRadius = 30,
  fullscreen = false,
  selectedFacility = null,
  onSelectFacility = () => {},
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

      // draw radius circles
      if (layers.commuteRadii) {
        facilities.forEach((f) => {
          if (!visibleIds.includes(f.id)) return;
          [10, 20, maxRadius].forEach((mi, idx) => {
            const sid = `circle-${f.id}-${idx}-${Math.random().toString(36).substring(2, 9)}`;
            const geo = generateCircle([f.lng, f.lat], mi);
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
          });
        });
      }
    });

    return () => {
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current = [];
      circleLayers.current.forEach((id) => {
        map.current?.removeLayer(id);
        map.current?.removeSource(id);
      });
      circleLayers.current = [];
    };
  }, [facilities, layers.commuteRadii, maxRadius, visibleIds]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded" />
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

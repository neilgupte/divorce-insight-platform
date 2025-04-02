
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_ACCESS_TOKEN, addGeoJSONLayer, fetchGeoJSONData } from "./mapboxUtils";

interface MapboxMapProps {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ setLoading, setError }) => {
  const [geoJSONData, setGeoJSONData] = useState<any>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // California center coordinates
  const center: [number, number] = [-119.4179, 36.7783];
  const defaultZoom = 6;

  useEffect(() => {
    const loadGeoJSONData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchGeoJSONData();
        setGeoJSONData(data);
      } catch (err) {
        console.error("Error fetching GeoJSON:", err);
        setError("Failed to load ZIP code boundary data");
      } finally {
        setLoading(false);
      }
    };

    loadGeoJSONData();
  }, [setLoading, setError]);

  useEffect(() => {
    // Initialize map when container is ready
    if (mapContainer.current && !map.current) {
      // Set the Mapbox access token
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: center,
          zoom: defaultZoom,
          projection: 'mercator'
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "bottom-left");

        // Add the GeoJSON data to the map when it loads
        map.current.on("load", () => {
          if (map.current && geoJSONData) {
            addGeoJSONLayer(map.current, geoJSONData);
          }
        });
      } catch (error) {
        console.error("Error initializing Mapbox:", error);
        setError("Failed to initialize map. Please check your Mapbox token.");
      }
    }

    // When geoJSONData changes and map is already initialized
    if (map.current && geoJSONData && map.current.loaded()) {
      addGeoJSONLayer(map.current, geoJSONData);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [geoJSONData, setError]);

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default MapboxMap;

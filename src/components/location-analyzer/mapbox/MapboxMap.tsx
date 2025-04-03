
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { 
  addGeoJSONLayer, 
  fetchGeoJSONData,
  addMultipleGeoJSONLayers
} from "./mapboxUtils";
import { MAPBOX_ACCESS_TOKEN, GEOJSON_FILES } from "./mapConstants";
import StateSelector from "./StateSelector";

interface MapboxMapProps {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ setLoading, setError }) => {
  const [geoJSONData, setGeoJSONData] = useState<any>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(["06"]); // Default to California

  // United States center coordinates
  const center: [number, number] = [-98.5795, 39.8283];
  const defaultZoom = 3;

  useEffect(() => {
    const loadGeoJSONData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchGeoJSONData(selectedFiles[0]);
        setGeoJSONData(data);
      } catch (err) {
        console.error("Error fetching GeoJSON:", err);
        setError("Failed to load ZIP code boundary data");
      } finally {
        setLoading(false);
      }
    };

    loadGeoJSONData();
  }, [selectedFiles, setLoading, setError]);

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId) 
        : [...prev, fileId]
    );
  };

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
        map.current.on("load", async () => {
          if (map.current) {
            await addMultipleGeoJSONLayers(map.current, selectedFiles);
          }
        });
      } catch (error) {
        console.error("Error initializing Mapbox:", error);
        setError("Failed to initialize map. Please check your Mapbox token.");
      }
    }

    // When geoJSONData changes and map is already initialized
    if (map.current && geoJSONData && map.current.loaded()) {
      // Update GeoJSON layers when selected files change
      const updateLayers = async () => {
        if (map.current) {
          // First, remove existing layers
          for (const fileId of GEOJSON_FILES.map(f => f.id)) {
            const sourceId = `zip-boundaries-${fileId}`;
            const fillLayerId = `zip-boundaries-fill-${fileId}`;
            const lineLayerId = `zip-boundaries-line-${fileId}`;
            
            if (map.current.getLayer(fillLayerId)) {
              map.current.removeLayer(fillLayerId);
            }
            
            if (map.current.getLayer(lineLayerId)) {
              map.current.removeLayer(lineLayerId);
            }
            
            if (map.current.getSource(sourceId)) {
              map.current.removeSource(sourceId);
            }
          }
          
          // Then add new layers for selected files
          await addMultipleGeoJSONLayers(map.current, selectedFiles);
          
          // Fit bounds to the selected areas
          if (selectedFiles.length === 1) {
            // If only one state is selected, zoom to that state
            const bounds = new mapboxgl.LngLatBounds();
            const data = await fetchGeoJSONData(selectedFiles[0]);
            
            if (data && data.features) {
              for (const feature of data.features) {
                if (feature.geometry && feature.geometry.coordinates) {
                  const coords = feature.geometry.coordinates;
                  
                  // Handle different geometry types
                  if (feature.geometry.type === 'Polygon') {
                    for (const coord of coords[0]) {
                      bounds.extend([coord[0], coord[1]]);
                    }
                  } else if (feature.geometry.type === 'MultiPolygon') {
                    for (const polygon of coords) {
                      for (const ring of polygon) {
                        for (const coord of ring) {
                          bounds.extend([coord[0], coord[1]]);
                        }
                      }
                    }
                  }
                }
              }
              
              map.current.fitBounds(bounds, { padding: 50 });
            }
          } else if (selectedFiles.length > 1) {
            // If multiple states are selected, zoom to show all of them
            map.current.flyTo({
              center: center,
              zoom: 3,
              essential: true
            });
          }
        }
      };
      
      updateLayers();
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [geoJSONData, selectedFiles, setError]);

  return (
    <div className="flex flex-col h-full">
      <StateSelector 
        geoJSONFiles={GEOJSON_FILES}
        selectedFiles={selectedFiles}
        onToggleFile={toggleFileSelection}
      />
      <div ref={mapContainer} className="h-full w-full rounded-md overflow-hidden" />
    </div>
  );
};

export default MapboxMap;

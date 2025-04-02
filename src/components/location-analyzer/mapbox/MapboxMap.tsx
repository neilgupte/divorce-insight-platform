
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ setLoading, setError }) => {
  const [geoJSONData, setGeoJSONData] = useState<any>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // California center coordinates
  const center: [number, number] = [36.7783, -119.4179];
  const defaultZoom = 6;

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          "https://raw.githubusercontent.com/neilgupte/geojson-demo/main/zcta_06_styled_all.geojson"
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
        }
        
        const data = await response.json();
        setGeoJSONData(data);
      } catch (err) {
        console.error("Error fetching GeoJSON:", err);
        setError("Failed to load ZIP code boundary data");
      } finally {
        setLoading(false);
      }
    };

    fetchGeoJSON();
  }, [setLoading, setError]);

  useEffect(() => {
    // Initialize map when container is ready and token is set
    if (mapContainer.current && !map.current) {
      // Set the Mapbox access token
      mapboxgl.accessToken = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOHp6czZ1ZzBmNHcyanM4MnRkcHQ2dTUifQ.r4eSgGg09379mRWiUchnvg";
      
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

  const addGeoJSONLayer = (mapInstance: mapboxgl.Map, data: any) => {
    // Check if the source already exists
    if (mapInstance.getSource('zip-boundaries')) {
      return; // Source already exists, no need to add again
    }

    // Add the GeoJSON source
    mapInstance.addSource("zip-boundaries", {
      type: "geojson",
      data: data,
    });

    // Add the fill layer
    mapInstance.addLayer({
      id: "zip-boundaries-fill",
      type: "fill",
      source: "zip-boundaries",
      paint: {
        "fill-color": ["get", "fill"],
        "fill-opacity": 0.7,
      },
    });

    // Add a border layer
    mapInstance.addLayer({
      id: "zip-boundaries-line",
      type: "line",
      source: "zip-boundaries",
      paint: {
        "line-color": ["get", "stroke"],
        "line-width": 1,
      },
    });
    
    // Add popup on click
    mapInstance.on('click', 'zip-boundaries-fill', (e) => {
      if (e.features && e.features[0] && e.lngLat) {
        const feature = e.features[0];
        const zipCode = feature.properties.ZCTA5CE20;
        const county = feature.properties.COUNTYFP20 || "Unknown";
        
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <h3 class="text-sm font-bold">ZIP Code: ${zipCode}</h3>
            <p class="text-xs mt-1">County: ${county}</p>
          `)
          .addTo(mapInstance);
      }
    });
    
    // Change cursor on hover
    mapInstance.on('mouseenter', 'zip-boundaries-fill', () => {
      if (mapInstance) {
        mapInstance.getCanvas().style.cursor = 'pointer';
      }
    });
    
    mapInstance.on('mouseleave', 'zip-boundaries-fill', () => {
      if (mapInstance) {
        mapInstance.getCanvas().style.cursor = '';
      }
    });
  };

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default MapboxMap;

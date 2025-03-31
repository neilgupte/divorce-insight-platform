
import React, { useEffect, useRef, useState } from 'react';
import { getHeatmapData, getPointWeight, MapFilters, RegionSummary } from './utils/mapUtils';

interface GoogleMapInitializerProps {
  apiKey: string;
  mapRef: React.RefObject<HTMLDivElement>;
  state: string | null;
  city: string | null;
  filters?: MapFilters;
  fullscreen?: boolean;
  onMapLoaded: (loaded: boolean) => void;
  onActiveFiltersChange: (filters: string[]) => void;
  onRegionSummaryChange: (summary: RegionSummary | null) => void;
  onError?: (error: string) => void;
}

const GoogleMapInitializer: React.FC<GoogleMapInitializerProps> = ({
  apiKey,
  mapRef,
  state,
  city,
  filters,
  fullscreen = false,
  onMapLoaded,
  onActiveFiltersChange,
  onRegionSummaryChange,
  onError
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const callbackName = useRef<string>(`initMap${Date.now()}`);

  // Initialize map with filters
  const initializeMap = () => {
    try {
      if (!window.google || !mapRef.current) {
        console.warn("Google Maps or map container not available");
        return;
      }

      const defaultLocation = { lat: 39.8283, lng: -98.5795 }; // Center of US
      const zoomLevel = state ? 7 : 4;

      const mapOptions: google.maps.MapOptions = {
        center: defaultLocation,
        zoom: zoomLevel,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
      };

      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      // Initialize heatmap with filtered data
      updateHeatmap(newMap);

      // If state or city is provided, try to center the map on that location
      if (state || city) {
        const geocoder = new google.maps.Geocoder();
        const searchTerm = city ? `${city}, ${state}, USA` : `${state}, USA`;
        
        geocoder.geocode({ address: searchTerm }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            newMap.setCenter(results[0].geometry.location);
            newMap.setZoom(city ? 10 : 7);

            // Add a marker
            new google.maps.Marker({
              position: results[0].geometry.location,
              map: newMap,
              title: searchTerm,
              animation: google.maps.Animation.DROP,
            });
          } else {
            console.warn(`Geocoding failed for '${searchTerm}' with status: ${status}`);
          }
        });
      }

      // Add click handler for regions
      newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: event.latLng }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            // Find locality (city) and administrative_area_level_1 (state) components
            let locality = '';
            let adminArea = '';
            
            results[0].address_components.forEach(component => {
              if (component.types.includes('locality')) {
                locality = component.long_name;
              }
              if (component.types.includes('administrative_area_level_1')) {
                adminArea = component.long_name;
              }
            });
            
            // Find closest data point
            const heatmapData = getHeatmapData(filters);
            let closestPoint = null;
            let minDistance = Infinity;
            
            for (const point of heatmapData) {
              const distance = google.maps.geometry.spherical.computeDistanceBetween(
                event.latLng,
                new google.maps.LatLng(point.lat, point.lng)
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
              }
            }
            
            // Set region summary if we have data
            if (closestPoint) {
              const regionName = locality ? `${locality}, ${adminArea}` : adminArea;
              
              const summary: RegionSummary = {
                region: regionName,
                metrics: [
                  { label: 'Divorce Rate', value: `${closestPoint.divorceRate}%` },
                  { label: 'Avg. Net Worth', value: `$${closestPoint.netWorth}M` },
                  { label: 'Luxury Density', value: `${closestPoint.luxuryDensity}/km²` },
                  { label: 'Multi-Property', value: `${closestPoint.multiProperty}%` },
                ]
              };
              
              onRegionSummaryChange(summary);
              
              // Show an info window
              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div style="min-width: 200px; padding: 8px;">
                    <h3 style="margin-bottom: 8px; font-weight: bold;">${regionName}</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                      <div>Divorce Rate:</div><div>${closestPoint.divorceRate}%</div>
                      <div>Avg. Net Worth:</div><div>$${closestPoint.netWorth}M</div>
                      <div>Luxury Density:</div><div>${closestPoint.luxuryDensity}/km²</div>
                      <div>Multi-Property:</div><div>${closestPoint.multiProperty}%</div>
                    </div>
                  </div>
                `,
                position: event.latLng,
              });
              
              infoWindow.open(newMap);
            }
          }
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      if (onError) onError("Failed to initialize map");
    }
  };

  // Update heatmap based on filters
  const updateHeatmap = (mapInstance: google.maps.Map) => {
    try {
      if (!mapInstance) return;
      
      // Get filtered data points
      const filteredData = getHeatmapData(filters);
      
      // Determine active filters for coloring
      const activeFiltersList: string[] = [];
      if (filters?.divorceRate?.enabled) activeFiltersList.push('divorceRate');
      if (filters?.netWorth?.enabled) activeFiltersList.push('netWorth');
      if (filters?.luxuryDensity?.enabled) activeFiltersList.push('luxuryDensity');
      if (filters?.multiProperty?.enabled) activeFiltersList.push('multiProperty');
      onActiveFiltersChange(activeFiltersList);
      
      // Create the heatmap data
      const heatmapData = filteredData.map(point => {
        return {
          location: new google.maps.LatLng(point.lat, point.lng),
          weight: getPointWeight(point, activeFiltersList, filters)
        };
      });
      
      // Remove existing heatmap if it exists
      if (heatmap) {
        heatmap.setMap(null);
      }
      
      // Create new heatmap
      const newHeatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: mapInstance,
        radius: fullscreen ? 30 : 20,
        opacity: 0.7,
      });
      
      setHeatmap(newHeatmap);
    } catch (error) {
      console.error("Error updating heatmap:", error);
      if (onError) onError("Failed to update map visualization");
    }
  };

  const loadGoogleMapsScript = () => {
    try {
      // Skip if already loaded
      if (window.google && window.google.maps) {
        setScriptLoaded(true);
        onMapLoaded(true);
        initializeMap();
        return;
      }

      // Use a unique callback name to prevent conflicts
      const uniqueCallbackName = callbackName.current;
      
      // Define callback before creating script
      window[uniqueCallbackName] = () => {
        console.log("Google Maps script loaded successfully");
        setScriptLoaded(true);
        onMapLoaded(true);
        initializeMap();
      };

      // Create script element
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization,geometry&callback=${uniqueCallbackName}`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      // Handle script load errors
      googleMapsScript.onerror = () => {
        console.error("Failed to load Google Maps script");
        setScriptError("Failed to load Google Maps API");
        if (onError) onError("Failed to load Google Maps API. Check your API key.");
        
        // Clean up the callback to prevent memory leaks
        if (window[uniqueCallbackName]) {
          delete window[uniqueCallbackName];
        }
      };
      
      scriptRef.current = googleMapsScript;
      
      // Append script to document
      document.head.appendChild(googleMapsScript);
    } catch (error) {
      console.error("Error loading Google Maps script:", error);
      setScriptError("Failed to load Google Maps API");
      if (onError) onError("Error loading Google Maps script");
    }
  };

  useEffect(() => {
    // If we have an API key, load the map
    if (apiKey) {
      loadGoogleMapsScript();
    }

    // Cleanup function to prevent memory leaks and DOM errors
    return () => {
      // Clean up Google Maps API script if component unmounts
      if (scriptRef.current) {
        // Check if the script is still in the document before trying to remove it
        const script = document.querySelector(`script[src*="${apiKey}"]`);
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
      
      // Remove the global callback
      if (window[callbackName.current]) {
        delete window[callbackName.current];
      }
      
      // Clean up map instance
      if (map) {
        // Remove event listeners if any were added directly to the map
        google.maps.event.clearInstanceListeners(map);
        setMap(null);
      }
      
      if (heatmap) {
        heatmap.setMap(null);
        setHeatmap(null);
      }
    };
  }, [apiKey]);

  useEffect(() => {
    // When state, city or filters change, update the map
    if (map) {
      try {
        const geocoder = new google.maps.Geocoder();
        const searchTerm = city ? `${city}, ${state}, USA` : state ? `${state}, USA` : null;
        
        if (searchTerm) {
          geocoder.geocode({ address: searchTerm }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              map.setCenter(results[0].geometry.location);
              map.setZoom(city ? 10 : 7);
              
              // Clear existing markers
              map.data.forEach(feature => {
                map.data.remove(feature);
              });
              
              // Add a marker
              new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                title: searchTerm,
                animation: google.maps.Animation.DROP,
              });
            } else {
              console.warn(`Geocoding failed for '${searchTerm}' with status: ${status}`);
            }
          });
        } else {
          // Reset to default view
          map.setCenter({ lat: 39.8283, lng: -98.5795 });
          map.setZoom(4);
        }
        
        // Update heatmap with new filters
        updateHeatmap(map);
      } catch (error) {
        console.error("Error updating map:", error);
        if (onError) onError("Error updating map with new location");
      }
    }
  }, [state, city, filters, map]);

  // Show error message if script loading failed
  if (scriptError) {
    console.error("Google Maps script error:", scriptError);
    if (onError) onError(scriptError);
  }

  return null; // This is a logic-only component, no UI to render
};

export default GoogleMapInitializer;

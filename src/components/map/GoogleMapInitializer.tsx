
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
  onRegionSummaryChange
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Initialize map with filters
  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

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
  };

  // Update heatmap based on filters
  const updateHeatmap = (mapInstance: google.maps.Map) => {
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
  };

  const loadGoogleMapsScript = () => {
    // Skip if already loaded
    if (window.google && window.google.maps) {
      onMapLoaded(true);
      initializeMap();
      return;
    }

    // Clean up any existing script to prevent duplicate loads
    if (scriptRef.current) {
      document.head.removeChild(scriptRef.current);
      scriptRef.current = null;
    }

    // Create script element
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization,geometry&callback=initMap`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    scriptRef.current = googleMapsScript;

    // Define callback
    window.initMap = () => {
      onMapLoaded(true);
      initializeMap();
    };

    // Append script to document
    document.head.appendChild(googleMapsScript);
  };

  useEffect(() => {
    // If we have an API key, load the map
    if (apiKey) {
      loadGoogleMapsScript();
    }

    // Cleanup function to prevent memory leaks and DOM errors
    return () => {
      // Clean up Google Maps API script if component unmounts
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      
      // Remove the global callback
      if (window.initMap) {
        delete window.initMap;
      }
      
      // Clean up map instance
      if (map) {
        // Remove event listeners if any were added directly to the map
        // google.maps.event.clearInstanceListeners(map);
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
          }
        });
      } else {
        // Reset to default view
        map.setCenter({ lat: 39.8283, lng: -98.5795 });
        map.setZoom(4);
      }
      
      // Update heatmap with new filters
      updateHeatmap(map);
    }
  }, [state, city, filters, map]);

  return null; // This is a logic-only component, no UI to render
};

export default GoogleMapInitializer;


import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Add type declaration for window.initMap
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

interface MapFilters {
  state: string | null;
  divorceRate?: {
    enabled: boolean;
    min: number;
  };
  netWorth?: {
    enabled: boolean;
    min: number;
    max: number;
  };
  luxuryDensity?: {
    enabled: boolean;
    min: number;
  };
  multiProperty?: {
    enabled: boolean;
    min: number;
  };
}

interface MapViewProps {
  state: string | null;
  city: string | null;
  filters?: MapFilters;
  fullscreen?: boolean;
}

const MapView = ({ state, city, filters, fullscreen = false }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKey, setApiKey] = useState<string>('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [regionSummary, setRegionSummary] = useState<{
    region: string;
    metrics: {label: string; value: string}[];
  } | null>(null);

  // Mock data for heatmap - in a real app, this would come from your API
  const getHeatmapData = () => {
    // Base data points
    const basePoints = [
      { lat: 40.7128, lng: -74.0060, weight: 10, divorceRate: 5.2, netWorth: 18.5, luxuryDensity: 8.3, multiProperty: 45 }, // New York
      { lat: 34.0522, lng: -118.2437, weight: 8, divorceRate: 6.1, netWorth: 22.7, luxuryDensity: 9.2, multiProperty: 62 }, // Los Angeles
      { lat: 41.8781, lng: -87.6298, weight: 7, divorceRate: 4.8, netWorth: 12.4, luxuryDensity: 5.8, multiProperty: 34 }, // Chicago
      { lat: 29.7604, lng: -95.3698, weight: 6, divorceRate: 5.5, netWorth: 16.2, luxuryDensity: 6.1, multiProperty: 38 }, // Houston
      { lat: 33.4484, lng: -112.0740, weight: 5, divorceRate: 6.3, netWorth: 10.5, luxuryDensity: 4.2, multiProperty: 41 }, // Phoenix
      { lat: 39.9526, lng: -75.1652, weight: 9, divorceRate: 4.7, netWorth: 14.8, luxuryDensity: 7.6, multiProperty: 36 }, // Philadelphia
      { lat: 32.7767, lng: -96.7970, weight: 7, divorceRate: 5.8, netWorth: 18.9, luxuryDensity: 7.2, multiProperty: 48 }, // Dallas
      { lat: 37.7749, lng: -122.4194, weight: 10, divorceRate: 4.2, netWorth: 35.6, luxuryDensity: 12.1, multiProperty: 72 }, // San Francisco
      { lat: 47.6062, lng: -122.3321, weight: 8, divorceRate: 4.5, netWorth: 19.3, luxuryDensity: 8.7, multiProperty: 51 }, // Seattle
      { lat: 25.7617, lng: -80.1918, weight: 9, divorceRate: 7.2, netWorth: 28.4, luxuryDensity: 10.8, multiProperty: 68 }, // Miami
      { lat: 42.3601, lng: -71.0589, weight: 8, divorceRate: 3.9, netWorth: 22.7, luxuryDensity: 9.3, multiProperty: 46 }, // Boston
      { lat: 36.1699, lng: -115.1398, weight: 7, divorceRate: 8.1, netWorth: 15.8, luxuryDensity: 11.2, multiProperty: 59 }, // Las Vegas
      { lat: 30.2672, lng: -97.7431, weight: 6, divorceRate: 5.4, netWorth: 17.6, luxuryDensity: 7.8, multiProperty: 44 }, // Austin
      { lat: 33.7490, lng: -84.3880, weight: 7, divorceRate: 6.2, netWorth: 16.4, luxuryDensity: 7.3, multiProperty: 42 }, // Atlanta
      { lat: 38.9072, lng: -77.0369, weight: 9, divorceRate: 4.1, netWorth: 24.5, luxuryDensity: 9.6, multiProperty: 53 }, // Washington D.C.
    ];

    // Filter points based on the active filters
    if (filters) {
      return basePoints.filter(point => {
        let include = true;
        
        if (filters.divorceRate?.enabled && point.divorceRate < filters.divorceRate.min) {
          include = false;
        }
        
        if (filters.netWorth?.enabled && (point.netWorth < filters.netWorth.min || point.netWorth > filters.netWorth.max)) {
          include = false;
        }
        
        if (filters.luxuryDensity?.enabled && point.luxuryDensity < filters.luxuryDensity.min) {
          include = false;
        }
        
        if (filters.multiProperty?.enabled && point.multiProperty < filters.multiProperty.min) {
          include = false;
        }
        
        return include;
      });
    }
    
    return basePoints;
  };

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
          const heatmapData = getHeatmapData();
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
            
            setRegionSummary({
              region: regionName,
              metrics: [
                { label: 'Divorce Rate', value: `${closestPoint.divorceRate}%` },
                { label: 'Avg. Net Worth', value: `$${closestPoint.netWorth}M` },
                { label: 'Luxury Density', value: `${closestPoint.luxuryDensity}/km²` },
                { label: 'Multi-Property', value: `${closestPoint.multiProperty}%` },
              ]
            });
            
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
    const filteredData = getHeatmapData();
    
    // Determine active filters for coloring
    const activeFiltersList: string[] = [];
    if (filters?.divorceRate?.enabled) activeFiltersList.push('divorceRate');
    if (filters?.netWorth?.enabled) activeFiltersList.push('netWorth');
    if (filters?.luxuryDensity?.enabled) activeFiltersList.push('luxuryDensity');
    if (filters?.multiProperty?.enabled) activeFiltersList.push('multiProperty');
    setActiveFilters(activeFiltersList);
    
    // If no specific filters are enabled, use default weight
    const getPointWeight = (point: any) => {
      if (activeFiltersList.length === 0) return point.weight;
      
      // Calculate combined score from active filters
      let score = 0;
      let count = 0;
      
      if (filters?.divorceRate?.enabled) {
        score += (point.divorceRate / 10) * 10; // Scale to 0-10
        count++;
      }
      
      if (filters?.netWorth?.enabled) {
        score += (point.netWorth / 40) * 10; // Scale to 0-10
        count++;
      }
      
      if (filters?.luxuryDensity?.enabled) {
        score += (point.luxuryDensity / 15) * 10; // Scale to 0-10
        count++;
      }
      
      if (filters?.multiProperty?.enabled) {
        score += (point.multiProperty / 80) * 10; // Scale to 0-10
        count++;
      }
      
      return count > 0 ? score / count : point.weight;
    };
    
    // Create the heatmap data
    const heatmapData = filteredData.map(point => {
      return {
        location: new google.maps.LatLng(point.lat, point.lng),
        weight: getPointWeight(point)
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

  const loadGoogleMapsScript = (apiKey: string) => {
    // Skip if already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    // Create script element
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization,geometry&callback=initMap`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;

    // Define callback
    window.initMap = () => {
      setMapLoaded(true);
      initializeMap();
    };

    // Append script to document
    document.head.appendChild(googleMapsScript);

    return () => {
      // Cleanup
      delete window.initMap;
      document.head.removeChild(googleMapsScript);
    };
  };

  useEffect(() => {
    // If we have an API key, load the map
    if (apiKey) {
      loadGoogleMapsScript(apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    // When state, city or filters change, update the map
    if (mapLoaded && map) {
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
  }, [state, city, filters, mapLoaded, map]);

  const handleSearch = () => {
    if (!map || !searchQuery) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery + ', USA' }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(10);
        
        // Add a marker
        new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: searchQuery,
          animation: google.maps.Animation.DROP,
        });
      }
    });
  };

  if (!apiKey) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Google Maps API Key Required</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Please enter your Google Maps API key to enable the map functionality. 
          The key should have Maps JavaScript API and Maps Visualization API enabled.
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter Google Maps API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={() => setApiKey(apiKey)}>
            Load Map
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
        
        {activeFilters.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 p-1">
                  <p className="font-medium text-sm">Active Filters:</p>
                  <ul className="text-xs">
                    {activeFilters.map(filter => (
                      <li key={filter}>
                        {filter === 'divorceRate' && `Divorce Rate: ≥ ${filters?.divorceRate?.min}%`}
                        {filter === 'netWorth' && `Net Worth: $${filters?.netWorth?.min}M - $${filters?.netWorth?.max}M`}
                        {filter === 'luxuryDensity' && `Luxury Density: ≥ ${filters?.luxuryDensity?.min}/km²`}
                        {filter === 'multiProperty' && `Multi-Property: ≥ ${filters?.multiProperty?.min}%`}
                      </li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex flex-1 gap-4">
        <div ref={mapRef} className="flex-1 min-h-[300px] rounded-md bg-muted/20">
          {!mapLoaded && (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          )}
        </div>
        
        {regionSummary && fullscreen && (
          <div className="w-64 h-fit bg-card border rounded-md p-4 self-start">
            <div className="flex items-center mb-3">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <h3 className="font-medium">{regionSummary.region}</h3>
            </div>
            <div className="space-y-2">
              {regionSummary.metrics.map((metric, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{metric.label}:</span>
                  <span className="text-sm font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;

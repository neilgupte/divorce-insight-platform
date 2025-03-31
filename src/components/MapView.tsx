
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

interface MapViewProps {
  state: string | null;
  city: string | null;
}

const MapView = ({ state, city }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKey, setApiKey] = useState<string>('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);

  // Mock data for heatmap - in a real app, this would come from your API
  const getHeatmapData = () => {
    return [
      { lat: 40.7128, lng: -74.0060, weight: 10 }, // New York
      { lat: 34.0522, lng: -118.2437, weight: 8 }, // Los Angeles
      { lat: 41.8781, lng: -87.6298, weight: 7 }, // Chicago
      { lat: 29.7604, lng: -95.3698, weight: 6 }, // Houston
      { lat: 33.4484, lng: -112.0740, weight: 5 }, // Phoenix
      { lat: 39.9526, lng: -75.1652, weight: 9 }, // Philadelphia
      { lat: 32.7767, lng: -96.7970, weight: 7 }, // Dallas
      { lat: 37.7749, lng: -122.4194, weight: 10 }, // San Francisco
      { lat: 47.6062, lng: -122.3321, weight: 8 }, // Seattle
      { lat: 25.7617, lng: -80.1918, weight: 9 }, // Miami
      // Add more locations as needed
    ];
  };

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

    // Initialize heatmap
    const heatmapData = getHeatmapData().map(point => {
      return new google.maps.LatLng(point.lat, point.lng);
    });

    const newHeatmap = new google.maps.visualization.HeatmapLayer({
      data: new google.maps.MVCArray(heatmapData),
      map: newMap,
      radius: 20,
      opacity: 0.7,
    });
    setHeatmap(newHeatmap);

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
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=initMap`;
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
    // When state or city changes, update the map
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
    }
  }, [state, city, mapLoaded, map]);

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
      </div>
      <div ref={mapRef} className="flex-1 min-h-[300px] rounded-md bg-muted/20">
        {!mapLoaded && (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;

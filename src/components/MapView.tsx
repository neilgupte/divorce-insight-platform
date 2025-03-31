
import React, { useRef, useState, useEffect } from 'react';
import { MapFilters, RegionSummary } from './map/utils/mapUtils';
import MapApiKeyInput from './map/MapApiKeyInput';
import MapSearchBar from './map/MapSearchBar';
import RegionSummaryPanel from './map/RegionSummaryPanel';
import GoogleMapInitializer from './map/GoogleMapInitializer';

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
  const [apiKeySubmitted, setApiKeySubmitted] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [regionSummary, setRegionSummary] = useState<RegionSummary | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);

  // Try to load API key from localStorage on component mount
  useEffect(() => {
    try {
      const savedApiKey = localStorage.getItem('googleMapsApiKey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
        setApiKeySubmitted(true);
        setApiKeyLoaded(true);
      } else {
        setApiKeyLoaded(true); // Even if there's no key, we've finished trying to load
      }
    } catch (error) {
      console.error("Error loading API key from localStorage:", error);
      setApiKeyLoaded(true); // Mark as loaded even on error
    }
  }, []);

  const handleSearch = () => {
    if (!window.google || !searchQuery) return;
    
    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery + ', USA' }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const map = new google.maps.Map(mapRef.current!);
          map.setCenter(results[0].geometry.location);
          map.setZoom(10);
          
          // Add a marker
          new google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            title: searchQuery,
            animation: google.maps.Animation.DROP,
          });
        } else {
          console.warn("Geocoding failed with status:", status);
          setMapError(`Geocoding failed: ${status}`);
        }
      });
    } catch (error) {
      console.error("Error during search:", error);
      setMapError("Error during search operation");
    }
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
  };

  const handleApiKeySubmit = () => {
    try {
      // Save API key to localStorage
      if (apiKey.trim()) {
        localStorage.setItem('googleMapsApiKey', apiKey);
        setApiKeySubmitted(true);
        setMapError(null);
      } else {
        setMapError("API key cannot be empty");
      }
    } catch (error) {
      console.error("Error saving API key:", error);
      setMapError("Failed to save API key");
    }
  };

  // Show loading state while checking for saved API key
  if (!apiKeyLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading map configuration...</p>
      </div>
    );
  }

  // If API key hasn't been submitted, show the input form
  if (!apiKeySubmitted) {
    return (
      <MapApiKeyInput 
        apiKey={apiKey} 
        onApiKeyChange={handleApiKeyChange}
        onSubmit={handleApiKeySubmit}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {mapError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {mapError}
        </div>
      )}
      
      <MapSearchBar 
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        activeFilters={activeFilters}
        filters={filters}
      />
      
      <div className="flex flex-1 gap-4">
        <div ref={mapRef} className="flex-1 min-h-[300px] rounded-md bg-muted/20">
          {!mapLoaded && (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          )}
          
          {apiKeySubmitted && (
            <GoogleMapInitializer 
              apiKey={apiKey}
              mapRef={mapRef}
              state={state}
              city={city}
              filters={filters}
              fullscreen={fullscreen}
              onMapLoaded={setMapLoaded}
              onActiveFiltersChange={setActiveFilters}
              onRegionSummaryChange={setRegionSummary}
              onError={(error) => setMapError(error)}
            />
          )}
        </div>
        
        {regionSummary && fullscreen && (
          <RegionSummaryPanel regionSummary={regionSummary} />
        )}
      </div>
    </div>
  );
};

export default MapView;

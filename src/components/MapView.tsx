
import React, { useRef, useState } from 'react';
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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [regionSummary, setRegionSummary] = useState<RegionSummary | null>(null);

  const handleSearch = () => {
    if (!window.google || !searchQuery) return;
    
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
      }
    });
  };

  if (!apiKey) {
    return (
      <MapApiKeyInput 
        apiKey={apiKey} 
        onApiKeyChange={setApiKey}
        onSubmit={() => setApiKey(apiKey)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
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
          />
        </div>
        
        {regionSummary && fullscreen && (
          <RegionSummaryPanel regionSummary={regionSummary} />
        )}
      </div>
    </div>
  );
};

export default MapView;

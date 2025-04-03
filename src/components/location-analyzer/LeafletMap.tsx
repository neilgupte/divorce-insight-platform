
import React, { useState, useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/leaflet-fixes.css";
import { ZIPCodeData } from "@/lib/zipUtils";
import StateSelector from "./mapbox/StateSelector";
import MapComponent from "./mapbox/MapComponent";
import { GEOJSON_FILES } from "./mapbox/mapConstants";
import { loadGeoJsonFile } from "./mapbox/geoJSONUtils";

interface LeafletMapProps {
  fullscreen?: boolean;
  zipData?: ZIPCodeData[];
  onZipClick?: (data: ZIPCodeData) => void;
  opportunityFilter?: 'Low' | 'Medium' | 'High' | 'All';
  urbanicityFilter?: 'Urban' | 'Suburban' | 'Rural' | 'All';
  showOfficeLocations?: boolean;
  officeLocations?: { city: string; position: [number, number] }[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  fullscreen = false,
  zipData = [],
  onZipClick,
  opportunityFilter = 'All',
  urbanicityFilter = 'All',
  showOfficeLocations = false,
  officeLocations = []
}) => {
  const defaultCenter: [number, number] = [37.0902, -95.7129]; // Center of US
  const defaultZoom = 4;
  const [mapError, setMapError] = useState<string | null>(null);
  const [geoJsonDataMap, setGeoJsonDataMap] = useState<Record<string, any>>({});
  const [map, setMap] = useState<L.Map | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(["06"]); // Default to California

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId) 
        : [...prev, fileId]
    );
  };

  // Load selected GeoJSON files
  useEffect(() => {
    const loadSelectedFiles = async () => {
      const newDataMap: Record<string, any> = {};
      
      for (const fileId of selectedFiles) {
        const fileInfo = GEOJSON_FILES.find(f => f.id === fileId);
        if (fileInfo) {
          const data = await loadGeoJsonFile(fileInfo);
          if (data) {
            newDataMap[fileId] = data;
          }
        }
      }
      
      setGeoJsonDataMap(newDataMap);
      
      // If we have a map and data, fit bounds
      if (map && Object.keys(newDataMap).length > 0) {
        try {
          const allLayers: L.GeoJSON[] = [];
          
          Object.values(newDataMap).forEach(data => {
            if (data && data.features && data.features.length) {
              allLayers.push(L.geoJSON(data));
            }
          });
          
          if (allLayers.length > 0) {
            const group = L.featureGroup(allLayers);
            map.fitBounds(group.getBounds(), { padding: [50, 50] });
          }
        } catch (e) {
          console.error("Error setting map bounds:", e);
        }
      }
    };
    
    loadSelectedFiles();
  }, [selectedFiles, map]);

  const filteredGeoJsonData = useMemo(() => {
    const filtered: Record<string, any> = {};
    
    Object.entries(geoJsonDataMap).forEach(([fileId, geoData]) => {
      if (!geoData) return;
      
      if (opportunityFilter === 'All' && urbanicityFilter === 'All') {
        filtered[fileId] = geoData;
        return;
      }
      
      const filteredData = {
        ...geoData,
        features: geoData.features.filter((feature: any) => {
          let opportunityTier = 'Medium';
          if (feature.properties.opportunity !== undefined) {
            const value = parseFloat(feature.properties.opportunity);
            if (value < 10) opportunityTier = 'Low';
            else if (value <= 50) opportunityTier = 'Medium';
            else opportunityTier = 'High';
          }
          
          const urbanicity = feature.properties.urbanicity || 'Suburban';
          
          const matchesOpportunity = opportunityFilter === 'All' || opportunityTier === opportunityFilter;
          const matchesUrbanicity = urbanicityFilter === 'All' || urbanicity === urbanicityFilter;
          
          return matchesOpportunity && matchesUrbanicity;
        })
      };
      
      filtered[fileId] = filteredData;
    });
    
    return filtered;
  }, [geoJsonDataMap, opportunityFilter, urbanicityFilter]);

  const handleMapReady = (mapInstance: L.Map) => {
    setMap(mapInstance);
  };

  return (
    <div className="flex flex-col h-full">
      <StateSelector 
        geoJSONFiles={GEOJSON_FILES} 
        selectedFiles={selectedFiles} 
        onToggleFile={toggleFileSelection} 
      />
      
      {mapError && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-red-100 text-red-700 text-sm text-center z-50">
          {mapError}
        </div>
      )}

      <MapComponent 
        filteredGeoJsonData={filteredGeoJsonData}
        fullscreen={fullscreen}
        zipData={zipData}
        onZipClick={onZipClick}
        showOfficeLocations={showOfficeLocations}
        officeLocations={officeLocations}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        onMapReady={handleMapReady}
      />
    </div>
  );
};

export default LeafletMap;

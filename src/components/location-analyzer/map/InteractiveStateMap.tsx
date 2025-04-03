
import React, { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ZIPCodeDetail } from "../StateMapsOverlay";
import { MAP_SETTINGS, MAP_UTILS } from "./mapSettings";

// Function to determine opportunity color based on value
function getOpportunityColor(value: number): string {
  if (value >= 10) {
    return "#7f1d1d"; // Dark red for high opportunity ($10M+)
  } else if (value >= 1) {
    return "#b91c1c"; // Medium red for medium opportunity ($1M-$9.9M)
  } else {
    return "#ef4444"; // Light red for low opportunity (<$1M)
  }
}

// Function to determine opportunity category based on value
function getOpportunityCategory(value: number): 'Low' | 'Medium' | 'High' {
  if (value >= 10) {
    return 'High';
  } else if (value >= 1) {
    return 'Medium';
  } else {
    return 'Low';
  }
}

interface Filters {
  urbanicity: 'All' | 'Urban' | 'Suburban' | 'Rural';
  opportunity: 'All' | 'Low' | 'Medium' | 'High';
  netWorthRange: [number, number];
  divorceRateThreshold: number;
  hideExistingOffices: boolean;
}

interface InteractiveStateMapProps {
  selectedState: string;
  onZIPSelect: (detail: ZIPCodeDetail) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
  filters: Filters;
}

const InteractiveStateMap: React.FC<InteractiveStateMapProps> = ({
  selectedState,
  onZIPSelect,
  setLoading,
  setError,
  toggleSidebar,
  sidebarCollapsed,
  filters
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Initialize the map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      mapboxgl.accessToken = MAP_SETTINGS.accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_SETTINGS.style,
        center: MAP_SETTINGS.defaultCenter,
        zoom: MAP_SETTINGS.defaultZoom
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      map.current.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
      
      map.current.on('load', () => {
        setMapInitialized(true);
      });
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Load GeoJSON data when state changes
  useEffect(() => {
    if (!mapInitialized || !selectedState) return;
    
    const loadStateData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Format state name for file path (PascalCase, no spaces or dashes)
        const formattedStateName = MAP_UTILS.formatStateNameForFile(selectedState);
        
        // Fetch the enriched GeoJSON file for the selected state
        const response = await fetch(`/zcta_${formattedStateName}_enriched.geojson`);
        
        if (!response.ok) {
          throw new Error(`Failed to load data for ${selectedState}`);
        }
        
        const data = await response.json();
        
        // Add random mock data for demonstration purposes
        if (data.features && data.features.length > 0) {
          data.features.forEach((feature: any) => {
            if (!feature.properties) {
              feature.properties = {};
            }
            
            // Add mock data only if not already present in the enriched file
            if (feature.properties.opportunity === undefined) {
              feature.properties.opportunity = parseFloat((Math.random() * 15).toFixed(1));
            }
            if (feature.properties.netWorth === undefined) {
              feature.properties.netWorth = parseFloat((Math.random() * 25 + 0.5).toFixed(1));
            }
            if (feature.properties.divorceRate === undefined) {
              feature.properties.divorceRate = parseFloat((Math.random() * 0.1).toFixed(2));
            }
            if (feature.properties.urbanicity === undefined) {
              feature.properties.urbanicity = ['Urban', 'Suburban', 'Rural'][Math.floor(Math.random() * 3)];
            }
            if (feature.properties.hasOffice === undefined) {
              feature.properties.hasOffice = Math.random() > 0.8; // 20% chance of having an office
            }
          });
        }
        
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
        setError(`Failed to load map data for ${selectedState}. Please try another state.`);
      } finally {
        setLoading(false);
      }
    };
    
    loadStateData();
  }, [selectedState, mapInitialized, setLoading, setError]);
  
  // Apply filters and update map when data or filters change
  useEffect(() => {
    if (!mapInitialized || !map.current || !geoJsonData) return;
    
    // Apply filters to GeoJSON data
    const filteredData = {
      ...geoJsonData,
      features: geoJsonData.features.filter((feature: any) => {
        const opportunity = feature.properties.opportunity;
        const netWorth = feature.properties.netWorth;
        const divorceRate = feature.properties.divorceRate;
        const urbanicity = feature.properties.urbanicity;
        const hasOffice = feature.properties.hasOffice;
        
        // Filter by opportunity
        if (filters.opportunity !== 'All') {
          const category = getOpportunityCategory(opportunity);
          if (category !== filters.opportunity) return false;
        }
        
        // Filter by urbanicity
        if (filters.urbanicity !== 'All' && urbanicity !== filters.urbanicity) return false;
        
        // Filter by net worth range
        if (netWorth < filters.netWorthRange[0] || netWorth > filters.netWorthRange[1]) return false;
        
        // Filter by divorce rate threshold
        if (divorceRate * 100 < filters.divorceRateThreshold) return false;
        
        // Filter by existing offices
        if (filters.hideExistingOffices && hasOffice) return false;
        
        return true;
      })
    };
    
    // Remove previous layers if they exist
    if (map.current.getLayer('zip-fills')) {
      map.current.removeLayer('zip-fills');
    }
    if (map.current.getLayer('zip-borders')) {
      map.current.removeLayer('zip-borders');
    }
    if (map.current.getLayer('zip-labels')) {
      map.current.removeLayer('zip-labels');
    }
    if (map.current.getSource('zips')) {
      map.current.removeSource('zips');
    }
    
    // Add new data to map
    if (filteredData.features.length > 0) {
      map.current.addSource('zips', {
        type: 'geojson',
        data: filteredData
      });
      
      // Add fill layer
      map.current.addLayer({
        id: 'zip-fills',
        type: 'fill',
        source: 'zips',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'opportunity'],
            0, '#ef4444',  // Light red for low opportunity
            1, '#b91c1c',  // Medium red for medium opportunity
            10, '#7f1d1d'  // Dark red for high opportunity
          ],
          'fill-opacity': 0.7
        }
      });
      
      // Add border layer
      map.current.addLayer({
        id: 'zip-borders',
        type: 'line',
        source: 'zips',
        paint: {
          'line-color': '#000000',
          'line-width': 0.5,
          'line-opacity': 0.6
        }
      });
      
      // Add labels layer
      map.current.addLayer({
        id: 'zip-labels',
        type: 'symbol',
        source: 'zips',
        layout: {
          'text-field': ['get', 'ZCTA5CE20'],
          'text-font': ['Open Sans Regular'],
          'text-size': 12,
          'text-offset': [0, 0.5],
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#000000',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      });
      
      // Fit map to state boundaries
      const bounds = new mapboxgl.LngLatBounds();
      filteredData.features.forEach((feature: any) => {
        if (feature.geometry && feature.geometry.coordinates) {
          const coords = feature.geometry.coordinates;
          
          if (feature.geometry.type === 'Polygon') {
            coords[0].forEach((coord: number[]) => {
              bounds.extend([coord[0], coord[1]]);
            });
          } else if (feature.geometry.type === 'MultiPolygon') {
            coords.forEach((polygon: number[][][]) => {
              polygon[0].forEach((coord: number[]) => {
                bounds.extend([coord[0], coord[1]]);
              });
            });
          }
        }
      });
      
      map.current.fitBounds(bounds, {
        padding: 20,
        maxZoom: 10
      });
      
      // Add click interaction
      map.current.on('click', 'zip-fills', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const props = feature.properties;
          
          const zipDetail: ZIPCodeDetail = {
            zipCode: props.ZCTA5CE20 || 'Unknown',
            county: props.COUNTY || props.COUNTYFP20 || 'Unknown',
            state: selectedState,
            opportunity: props.opportunity,
            urbanicity: props.urbanicity,
            netWorth: props.netWorth,
            divorceRate: props.divorceRate,
            hasOffice: props.hasOffice
          };
          
          onZIPSelect(zipDetail);
        }
      });
      
      // Change cursor on hover
      map.current.on('mouseenter', 'zip-fills', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });
      
      map.current.on('mouseleave', 'zip-fills', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
    }
  }, [geoJsonData, filters, mapInitialized, selectedState, onZIPSelect]);
  
  return (
    <div className="relative h-full w-full">
      {sidebarCollapsed && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-10 bg-background shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Expand sidebar</span>
        </Button>
      )}
      
      <div ref={mapContainer} className="h-full w-full" />
      
      <div className="absolute bottom-4 left-4 z-10 bg-background/90 p-2 rounded-md shadow-md">
        <div className="text-xs font-medium mb-1">Opportunity Level</div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-700 rounded-sm"></div>
            <span className="text-xs">Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-900 rounded-sm"></div>
            <span className="text-xs">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveStateMap;

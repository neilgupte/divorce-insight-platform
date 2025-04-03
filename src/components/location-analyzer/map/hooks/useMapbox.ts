
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { MAP_SETTINGS } from "../mapSettings";
import { getOpportunityCategory } from "../utils/mapUtils";
import { ZIPCodeDetail } from "../../StateMapsOverlay";

interface MapOptions {
  selectedState: string;
  onZIPSelect: (detail: ZIPCodeDetail) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filters: {
    urbanicity: 'All' | 'Urban' | 'Suburban' | 'Rural';
    opportunity: 'All' | 'Low' | 'Medium' | 'High';
    netWorthRange: [number, number];
    divorceRateThreshold: number;
    showExistingOffices: boolean;
  };
}

export function useMapbox({ 
  selectedState, 
  onZIPSelect, 
  setLoading, 
  setError, 
  filters 
}: MapOptions) {
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
        center: MAP_SETTINGS.defaultCenter as [number, number],
        zoom: MAP_SETTINGS.defaultZoom
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      map.current.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
      
      map.current.on('load', () => {
        console.log("✅ Map initialized successfully");
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
    if (!mapInitialized) return;
    
    const loadStateData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Handle "All States" selection - either load a few key states or show a message
        if (selectedState === "All States") {
          console.log("✅ All States selected - loading selected sample states");
          // For "All States", we'll load a sample of states (e.g., California, New York)
          // This can be expanded to load multiple states in a production environment
          // For now, we'll load California as a sample
          const formattedStateName = MAP_UTILS.formatStateNameForFile("California");
          
          // Fetch the enriched GeoJSON file for the sample state
          const response = await fetch(`https://raw.githubusercontent.com/neilgupte/divorce-insight-platform/main/public/zcta_${formattedStateName}_enriched.geojson`);
          
          if (!response.ok) {
            throw new Error("Failed to load sample state data");
          }
          
          const data = await response.json();
          console.log(`✅ Loaded ${data.features?.length || 0} ZIP features from sample state`);
          setGeoJsonData(data);
        } else {
          // Format state name for file path (PascalCase, no spaces or dashes)
          const formattedStateName = MAP_UTILS.formatStateNameForFile(selectedState);
          console.log("✅ Loading data for state:", formattedStateName);
          
          // Fetch the enriched GeoJSON file for the selected state
          const response = await fetch(`https://raw.githubusercontent.com/neilgupte/divorce-insight-platform/main/public/zcta_${formattedStateName}_enriched.geojson`);
          
          if (!response.ok) {
            throw new Error(`Failed to load data for ${selectedState}`);
          }
          
          const data = await response.json();
          console.log(`✅ Loaded ${data.features?.length || 0} ZIP features from ${selectedState}`);
          setGeoJsonData(data);
        }
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
        setError(`Failed to load map data for ${selectedState}. Please try another state.`);
        
        // Create emergency mock data if fetch fails
        const mockData = {
          type: "FeatureCollection",
          features: Array.from({ length: 20 }, (_, i) => ({
            type: "Feature",
            properties: {
              ZCTA5CE20: `9${i.toString().padStart(4, '0')}`,
              COUNTY: "Emergency Mock County",
              opportunity: parseFloat((Math.random() * 15).toFixed(1)),
              netWorth: parseFloat((Math.random() * 25 + 0.5).toFixed(1)),
              divorceRate: parseFloat((Math.random() * 0.1).toFixed(2)),
              urbanicity: ['Urban', 'Suburban', 'Rural'][Math.floor(Math.random() * 3)],
              hasOffice: Math.random() > 0.8,
              opportunityTier: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                Array.from({ length: 5 }, () => [
                  -122 + Math.random() * 10,
                  37 + Math.random() * 5
                ] as [number, number])
              ]
            }
          }))
        };
        setGeoJsonData(mockData);
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
        const opportunity = feature.properties.opportunity || 0;
        const netWorth = feature.properties.netWorth || 0;
        const divorceRate = feature.properties.divorceRate || 0;
        const urbanicity = feature.properties.urbanicity || 'Suburban';
        
        // Console log to debug filter values
        console.log(`ZIP: ${feature.properties.ZCTA5CE20}, Opportunity: ${opportunity}, NetWorth: ${netWorth}, DivorceRate: ${divorceRate}, Urbanicity: ${urbanicity}`);
        
        // Filter by opportunity - fixed to use numeric values
        if (filters.opportunity !== 'All') {
          const category = getOpportunityCategory(opportunity);
          if (category !== filters.opportunity) return false;
        }
        
        // Filter by urbanicity
        if (filters.urbanicity !== 'All' && urbanicity !== filters.urbanicity) return false;
        
        // Filter by net worth range - be more lenient
        if (netWorth < filters.netWorthRange[0]) return false;
        
        // Filter by divorce rate threshold - convert from decimals to percentages for comparison
        if ((divorceRate * 100) < filters.divorceRateThreshold) return false;
        
        return true;
      })
    };
    
    console.log("✅ Rendering features:", filteredData.features.length);
    
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
    
    // Remove any existing office markers
    const existingMarkers = document.querySelectorAll('.office-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Add new data to map
    if (filteredData.features.length > 0) {
      map.current.addSource('zips', {
        type: 'geojson',
        data: filteredData
      });
      
      // First add the fill layer (bottom)
      map.current.addLayer({
        id: 'zip-fills',
        type: 'fill',
        source: 'zips',
        paint: {
          'fill-color': [
            'match',
            ['get', 'opportunityTier'],
            'Low', '#ef4444',
            'Medium', '#b91c1c',
            'High', '#7f1d1d',
            '#cccccc' // default color if no match
          ],
          'fill-opacity': 0.7
        }
      });
      console.log("✅ zip-fills layer added");
      
      // Then add border layer (middle)
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
      console.log("✅ zip-borders layer added");
      
      // Finally add labels layer (top) with improved visibility
      map.current.addLayer({
        id: 'zip-labels',
        type: 'symbol',
        source: 'zips',
        layout: {
          'text-field': ['get', 'ZCTA5CE20'],
          'text-font': ['Open Sans Bold'],
          'text-size': 12,
          'text-offset': [0, 0],
          'text-anchor': 'center',
          'text-allow-overlap': true,
          'text-ignore-placement': true
        },
        paint: {
          'text-color': '#000000',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
          'text-opacity': 1
        }
      });
      console.log("✅ zip-labels layer added");
      
      // Add office markers if showExistingOffices is enabled - regardless of state selection
      if (filters.showExistingOffices) {
        // Sample office locations for major cities
        const majorOffices = {
          "Los Angeles": [-118.2437, 34.0522],
          "San Francisco": [-122.4194, 37.7749],
          "Chicago": [-87.6298, 41.8781],
          "Miami": [-80.1918, 25.7617],
          "New York": [-73.9352, 40.7306]
        };
        
        // Add markers for all offices regardless of selected state
        Object.entries(majorOffices).forEach(([city, coordinates]) => {
          const el = document.createElement('div');
          el.className = 'office-marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = '#3b82f6';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.25)';
          
          // Create a tooltip on hover
          el.title = `${city} Office`;
          
          new mapboxgl.Marker(el)
            .setLngLat(coordinates as [number, number])
            .addTo(map.current as mapboxgl.Map);
        });
      }
      
      // Fit map to state boundaries
      const bounds = new mapboxgl.LngLatBounds();
      filteredData.features.forEach((feature: any) => {
        if (feature.geometry && feature.geometry.coordinates) {
          const coords = feature.geometry.coordinates;
          
          if (feature.geometry.type === 'Polygon') {
            coords[0].forEach((coord: [number, number]) => {
              bounds.extend(coord as mapboxgl.LngLatLike);
            });
          } else if (feature.geometry.type === 'MultiPolygon') {
            coords.forEach((polygon: [number, number][][]) => {
              polygon[0].forEach((coord: [number, number]) => {
                bounds.extend(coord as mapboxgl.LngLatLike);
              });
            });
          }
        }
      });
      
      try {
        // Only fit bounds if bounds are valid
        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, {
            padding: 20,
            maxZoom: 10
          });
        } else {
          // If bounds are empty, set default view
          map.current.flyTo({
            center: MAP_SETTINGS.defaultCenter as [number, number],
            zoom: MAP_SETTINGS.defaultZoom,
            essential: true
          });
        }
      } catch (error) {
        console.error("Error fitting map bounds:", error);
        // Fallback to default view
        map.current.flyTo({
          center: MAP_SETTINGS.defaultCenter as [number, number],
          zoom: MAP_SETTINGS.defaultZoom,
          essential: true
        });
      }
      
      // Add click interaction
      map.current.on('click', 'zip-fills', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const props = feature.properties;
          
          const zipDetail: ZIPCodeDetail = {
            zipCode: props.ZCTA5CE20 || props.GEOID20 || 'Unknown',
            county: props.COUNTY || props.COUNTYFP20 || 'Unknown',
            state: selectedState,
            opportunity: props.opportunity || 0,
            urbanicity: props.urbanicity || 'Suburban',
            netWorth: props.netWorth || 0,
            divorceRate: props.divorceRate || 0,
            hasOffice: props.hasOffice || false
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

  return { mapContainer };
}

// Get MAP_UTILS from mapSettings
import { MAP_UTILS } from "../mapSettings";

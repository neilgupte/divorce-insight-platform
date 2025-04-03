
import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/leaflet-fixes.css";
import { ZIPCodeData } from "@/lib/zipUtils";

interface LeafletMapProps {
  fullscreen?: boolean;
  zipData?: ZIPCodeData[];
  onZipClick?: (data: ZIPCodeData) => void;
  opportunityFilter?: 'Low' | 'Medium' | 'High' | 'All';
  urbanicityFilter?: 'Urban' | 'Suburban' | 'Rural' | 'All';
  showOfficeLocations?: boolean;
  officeLocations?: { city: string; position: [number, number] }[];
}

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOHp6czZ1ZzBmNHcyanM4MnRkcHQ2dTUifQ.r4eSgGg09379mRWiUchnvg";

// List of available GeoJSON files
const GEOJSON_FILES = [
  { id: "06", name: "California", url: "https://raw.githubusercontent.com/neilgupte/divorce-insight-platform/main/public/zcta_06_halfsize.geojson?raw=true" },
  { id: "08", name: "Colorado", url: "/zcta_08.geojson" },
  { id: "09", name: "Connecticut", url: "/zcta_09.geojson" },
  { id: "10", name: "Delaware", url: "/zcta_10.geojson" },
  { id: "11", name: "District of Columbia", url: "/zcta_11.geojson" },
  { id: "12", name: "Florida", url: "/zcta_12.geojson" },
  { id: "13", name: "Georgia", url: "/zcta_13.geojson" },
  { id: "15", name: "Hawaii", url: "/zcta_15.geojson" },
  { id: "16", name: "Idaho", url: "/zcta_16.geojson" },
  { id: "17", name: "Illinois", url: "/zcta_17.geojson" },
  { id: "18", name: "Indiana", url: "/zcta_18.geojson" },
  { id: "19", name: "Iowa", url: "/zcta_19.geojson" },
  { id: "20", name: "Kansas", url: "/zcta_20.geojson" },
  { id: "21", name: "Kentucky", url: "/zcta_21.geojson" },
  { id: "22", name: "Louisiana", url: "/zcta_22.geojson" },
  { id: "23", name: "Maine", url: "/zcta_23.geojson" },
  { id: "24", name: "Maryland", url: "/zcta_24.geojson" },
  { id: "25", name: "Massachusetts", url: "/zcta_25.geojson" },
  { id: "26", name: "Michigan", url: "/zcta_26.geojson" },
  { id: "27", name: "Minnesota", url: "/zcta_27.geojson" },
];

// State abbreviation mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "District of Columbia": "DC",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
};

// MapReady component to handle setting the map instance
const MapReady = ({ setMap }: { setMap: (map: L.Map) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  
  return null;
};

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

  // Function to load a single GeoJSON file
  const loadGeoJsonFile = async (fileInfo: typeof GEOJSON_FILES[0]) => {
    try {
      const response = await fetch(fileInfo.url);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      
      // Add state information to each feature
      if (data && data.features) {
        data.features.forEach((feature: any) => {
          if (!feature.properties) {
            feature.properties = {};
          }
          feature.properties.STATE_NAME = fileInfo.name;
          feature.properties.STATE_ABBR = STATE_ABBREVIATIONS[fileInfo.name] || fileInfo.name;
        });
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching GeoJSON for ${fileInfo.name}:`, error);
      setMapError(`Failed to load GeoJSON map data for ${fileInfo.name}.`);
      return null;
    }
  };

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

  const getStyle = (feature: any) => {
    let opportunity = 'Medium';

    if (feature.properties.opportunity !== undefined) {
      const value = parseFloat(feature.properties.opportunity);
      if (value < 10) opportunity = 'Low';
      else if (value > 50) opportunity = 'High';
    }
    
    return {
      fillColor: getOpportunityColor(opportunity),
      weight: 1,
      opacity: 0.7,
      color: '#666',
      fillOpacity: 0.6,
    };
  };

  const getOpportunityColor = (opportunity: string): string => {
    switch (opportunity) {
      case 'Low': return '#FFC107';
      case 'Medium': return '#FF9800';
      case 'High': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties) {
      const zipCode = feature.properties.GEOID20 || feature.properties.ZCTA5CE20 || 'Unknown';
      const county = feature.properties.COUNTY || 'Unknown';
      const state = feature.properties.STATE_NAME || 'Unknown';
      const stateAbbr = feature.properties.STATE_ABBR || 'UN';
      const opportunityValue = feature.properties.opportunity ? 
        `$${parseFloat(feature.properties.opportunity).toFixed(2)}M` : 'Unknown';

      layer.bindPopup(`
        <strong>ZIP Code:</strong> ${zipCode}<br/>
        <strong>County:</strong> ${county}<br/>
        <strong>State:</strong> ${state}<br/>
        <strong>Opportunity:</strong> ${opportunityValue}
      `);

      layer.on('click', () => {
        if (onZipClick && zipData) {
          // Try to find matching ZIP code in our data
          const matchingZip = zipData.find(z => z.zipCode === zipCode);
          
          // If we don't find a matching ZIP, generate mock data for this ZIP code
          if (!matchingZip && zipCode !== 'Unknown') {
            // Generate dynamic data based on zip code to ensure different values
            const zipSeed = parseInt(zipCode.substring(0, 5)) || 10000;
            const randomMultiplier = (zipSeed % 100) / 100 + 0.5; // Value between 0.5 and 1.5
            
            const mockData: ZIPCodeData = {
              zipCode: zipCode,
              city: county || 'Major City',
              state: stateAbbr,
              urbanicity: ['Urban', 'Suburban', 'Rural'][zipSeed % 3] as 'Urban' | 'Suburban' | 'Rural',
              divorceRate: (3 + (zipSeed % 8)) / 100,
              netWorth: Math.round(28000000 * randomMultiplier) / 10000000,
              opportunity: parseFloat(feature.properties.opportunity || (10 + (zipSeed % 70)).toString()),
              tam: Math.round(20 + (zipSeed % 30)),
              sam: Math.round(10 + (zipSeed % 20))
            };
            
            if (onZipClick) {
              onZipClick(mockData);
            }
          } else if (matchingZip && onZipClick) {
            onZipClick(matchingZip);
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-muted p-2 mb-2 rounded-md">
        <div className="text-sm font-medium mb-1">Select States to Display:</div>
        <div className="flex flex-wrap gap-1">
          {GEOJSON_FILES.slice(0, 10).map(file => (
            <button
              key={file.id}
              className={`text-xs px-2 py-1 rounded ${
                selectedFiles.includes(file.id) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => toggleFileSelection(file.id)}
            >
              {file.name}
            </button>
          ))}
          <div className="relative group">
            <button className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
              More...
            </button>
            <div className="absolute hidden group-hover:block z-10 bg-background shadow-lg rounded-md p-2 right-0 w-64">
              <div className="grid grid-cols-2 gap-1">
                {GEOJSON_FILES.slice(10).map(file => (
                  <button
                    key={file.id}
                    className={`text-xs px-2 py-1 rounded ${
                      selectedFiles.includes(file.id) 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ height: fullscreen ? "calc(100% - 56px)" : "360px", width: "100%" }} className="relative">
        {mapError && (
          <div className="absolute top-0 left-0 right-0 p-2 bg-red-100 text-red-700 text-sm text-center z-50">
            {mapError}
          </div>
        )}

        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={defaultCenter}
          zoom={defaultZoom}
          zoomControl={false}
        >
          <MapReady setMap={setMap} />
          
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/spiratech/cm900m0pi005z01s71vnefvq3/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`}
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          />
          
          {Object.entries(filteredGeoJsonData).map(([fileId, geoData]) => 
            geoData && geoData.features && geoData.features.length > 0 && (
              <GeoJSON 
                key={`geo-json-${fileId}-${opportunityFilter}-${urbanicityFilter}`}
                data={geoData} 
                style={getStyle} 
                onEachFeature={onEachFeature} 
              />
            )
          )}

          {showOfficeLocations && officeLocations.map((office, index) => (
            <Marker key={index} position={office.position}>
              <Popup>
                <strong>{office.city} Office</strong><br/>
                Company Headquarters
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default LeafletMap;


import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
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

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  fullscreen = false,
  zipData = [],
  onZipClick,
  opportunityFilter = 'All',
  urbanicityFilter = 'All',
  showOfficeLocations = false,
  officeLocations = []
}) => {
  const defaultCenter: [number, number] = [37.0902, -95.7129];
  const defaultZoom = 4;
  const [mapError, setMapError] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  // Set up Leaflet icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Fetch GeoJSON data
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/spiratech/public/main/zcta_06_halfsize.geojson")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setGeoJsonData(data);
        // Set bounds if map is available
        if (map && data?.features?.length) {
          try {
            const geoLayer = L.geoJSON(data);
            const bounds = geoLayer.getBounds();
            map.fitBounds(bounds, { padding: [50, 50] });
          } catch (e) {
            console.error("Error setting map bounds:", e);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
        setMapError("Failed to load GeoJSON map data.");
      });
  }, [map]);

  // Filter GeoJSON features based on opportunity and urbanicity filters
  const filteredGeoJsonData = useMemo(() => {
    if (!geoJsonData) return null;
    
    // If both filters are set to 'All', return the original data
    if (opportunityFilter === 'All' && urbanicityFilter === 'All') {
      return geoJsonData;
    }
    
    // Create a deep copy of the geoJsonData to avoid mutating the original
    const filteredData = {
      ...geoJsonData,
      features: geoJsonData.features.filter((feature: any) => {
        // Get opportunity tier from feature properties
        let opportunityTier = 'Medium';
        if (feature.properties.opportunity) {
          const value = feature.properties.opportunity;
          if (value < 10) opportunityTier = 'Low';
          else if (value > 25) opportunityTier = 'High';
        }
        
        // Get urbanicity from feature properties (default to 'Suburban' if not specified)
        const urbanicity = feature.properties.urbanicity || 'Suburban';
        
        // Filter based on opportunity and urbanicity
        const matchesOpportunity = opportunityFilter === 'All' || opportunityTier === opportunityFilter;
        const matchesUrbanicity = urbanicityFilter === 'All' || urbanicity === urbanicityFilter;
        
        return matchesOpportunity && matchesUrbanicity;
      })
    };
    
    return filteredData;
  }, [geoJsonData, opportunityFilter, urbanicityFilter]);

  const getStyle = (feature: any) => {
    let opportunity = 'Medium';

    // If we have a property with opportunity data, use it
    if (feature.properties.opportunity) {
      const value = feature.properties.opportunity;
      if (value < 10) opportunity = 'Low';
      else if (value > 25) opportunity = 'High';
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

  // Handle map ready event
  const handleMapReady = (e: L.LeafletEvent) => {
    setMap(e.target);
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties) {
      const zipCode = feature.properties.GEOID20 || 'Unknown';
      const county = feature.properties.COUNTY || 'Unknown';
      const opportunityValue = feature.properties.opportunity ? 
        `$${feature.properties.opportunity.toFixed(2)}M` : 'Unknown';

      layer.bindPopup(`
        <strong>ZIP Code:</strong> ${zipCode}<br/>
        <strong>County:</strong> ${county}<br/>
        <strong>Opportunity:</strong> ${opportunityValue}
      `);

      // Add click handling
      layer.on('click', () => {
        if (onZipClick && zipData) {
          // Find matching ZIP in our data array if available
          const matchingZip = zipData.find(z => z.zipCode === parseInt(zipCode, 10));
          if (matchingZip) {
            onZipClick(matchingZip);
          }
        }
      });
    }
  };

  return (
    <div style={{ height: fullscreen ? "100%" : "400px", width: "100%" }}>
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
        whenReady={handleMapReady as any} // Type assertion to fix TypeScript error
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/spiratech/cm900m0pi005z01s71vnefvq3/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`}
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
        />
        {filteredGeoJsonData && filteredGeoJsonData.features && filteredGeoJsonData.features.length > 0 && (
          <GeoJSON 
            key={`geo-json-${opportunityFilter}-${urbanicityFilter}`} // Force re-render when filters change
            data={filteredGeoJsonData} 
            style={getStyle} 
            onEachFeature={onEachFeature} 
          />
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
  );
};

export default LeafletMap;

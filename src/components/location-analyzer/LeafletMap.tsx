
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZIPCodeData } from "@/lib/zipUtils";
import { getOpportunityColor, getOpportunityTier } from "@/lib/mapUtils";

// Define the component properties
interface LeafletMapProps {
  zipData: ZIPCodeData[];
  onZipClick: (data: ZIPCodeData) => void;
  opportunityFilter: 'Low' | 'Medium' | 'High' | 'All';
  urbanicityFilter: 'Urban' | 'Suburban' | 'Rural' | 'All';
  showOfficeLocations: boolean;
  officeLocations: { city: string; position: [number, number] }[];
  fullscreen?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  zipData,
  onZipClick,
  opportunityFilter,
  urbanicityFilter,
  showOfficeLocations,
  officeLocations,
  fullscreen = false
}) => {
  const defaultCenter: [number, number] = [37.0902, -95.7129]; // USA center
  const defaultZoom = 4;
  const [mapError, setMapError] = useState<string | null>(null);

  // Filtered ZIP data based on opportunity and urbanicity
  const filteredZipData = zipData.filter(zip => {
    const opportunityTier = getOpportunityTier(zip.opportunity);
    const opportunityMatch = opportunityFilter === 'All' || opportunityTier === opportunityFilter;
    const urbanicityMatch = urbanicityFilter === 'All' || zip.urbanicity === urbanicityFilter;
    return opportunityMatch && urbanicityMatch;
  });

  // Function to handle map initialization
  const handleMapInit = (map: L.Map) => {
    // Check for Leaflet's map object
    if (!map) {
      setMapError("Failed to initialize Leaflet map.");
      return;
    }
  };

  return (
    <div style={{ height: fullscreen ? "100%" : "400px", width: "100%" }}>
      {mapError && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-destructive/10 text-destructive text-sm text-center z-50">
          {mapError}
        </div>
      )}
      
      <MapContainer 
        style={{ height: "100%", width: "100%" }} 
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={false}
        whenReady={(map) => {
          handleMapInit(map.target);
        }}
      >
        {/* Position the map on the center point */}
        <SetViewOnUpdate center={defaultCenter} zoom={defaultZoom} />
        
        {/* Add a tile layer to provide the map with visual data */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render ZIP code markers */}
        {filteredZipData.map((zip, index) => (
          <Circle
            key={index}
            center={[parseFloat(zip.latitude || "0"), parseFloat(zip.longitude || "0")] as [number, number]}
            pathOptions={{
              fillColor: getOpportunityColor(zip.opportunity),
              fillOpacity: 0.5,
              stroke: false
            }}
            radius={5000} // Adjust the radius as needed
            eventHandlers={{
              click: () => {
                onZipClick(zip);
              }
            }}
          >
            <Tooltip 
              permanent 
              className="custom-tooltip"
            >
              <div>
                ZIP: {zip.zipCode}
                <br />
                Opportunity: ${zip.opportunity}M
              </div>
            </Tooltip>
            <Popup>
              <h2>ZIP Code: {zip.zipCode}</h2>
              <p>Opportunity: ${zip.opportunity}M</p>
            </Popup>
          </Circle>
        ))}
        
        {/* Render office location markers */}
        {showOfficeLocations && officeLocations.map((office, index) => (
          <Marker
            key={index}
            position={office.position}
          >
            <Popup>
              <h2>{office.city} Office</h2>
              <p>Office Location</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Helper component to set map view
const SetViewOnUpdate = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

export default LeafletMap;

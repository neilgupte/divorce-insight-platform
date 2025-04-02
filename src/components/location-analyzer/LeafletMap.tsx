
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { ZIPCodeData } from "@/lib/zipUtils";

// Custom component to update map view when props change
const SetViewOnUpdate = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

interface LeafletMapProps {
  zipData: ZIPCodeData[];
  onZipClick: (data: ZIPCodeData) => void;
  opportunityFilter: 'Low' | 'Medium' | 'High' | 'All';
  urbanicityFilter: 'Urban' | 'Suburban' | 'Rural' | 'All';
  showOfficeLocations?: boolean;
  officeLocations?: { city: string; position: [number, number] }[];
  fullscreen?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  zipData,
  onZipClick,
  opportunityFilter,
  urbanicityFilter,
  showOfficeLocations = false,
  officeLocations = [],
  fullscreen = false
}) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const defaultPosition: [number, number] = [39.8283, -98.5795]; // Center of the US
  const defaultZoom = 4;
  
  // Filter ZIP data based on active filters
  const filteredZipData = zipData.filter(zip => {
    if (opportunityFilter !== 'All' && zip.opportunityScore !== opportunityFilter) {
      return false;
    }
    if (urbanicityFilter !== 'All' && zip.urbanicity !== urbanicityFilter) {
      return false;
    }
    return true;
  });
  
  // Get opportunity color
  const getOpportunityColor = (score: 'Low' | 'Medium' | 'High'): string => {
    switch (score) {
      case 'High': return '#ef4444'; // Red
      case 'Medium': return '#f97316'; // Orange
      case 'Low': return '#3b82f6'; // Blue
      default: return '#3b82f6';
    }
  };
  
  const handleMapReady = (e: L.LeafletEvent) => {
    setMapInstance(e.target);
  };

  return (
    <div className={`w-full ${fullscreen ? 'h-full' : 'h-[400px]'}`}>
      <MapContainer
        center={defaultPosition}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        whenReady={handleMapReady}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Update view when state is changed externally */}
        <SetViewOnUpdate center={defaultPosition} zoom={defaultZoom} />
        
        {/* Display filtered ZIP Codes */}
        {filteredZipData.map((zip) => (
          <Marker
            key={zip.zipCode}
            position={[zip.latitude, zip.longitude]}
            eventHandlers={{
              click: () => onZipClick(zip),
            }}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: ${getOpportunityColor(zip.opportunityScore)}; width: 20px; height: 20px; border-radius: 50%; opacity: 0.8;"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{zip.zipCode}</h3>
                <p>{zip.city}, {zip.state}</p>
                <p>Opportunity: {zip.opportunityScore}</p>
                <p>Area Type: {zip.urbanicity}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Display office locations if enabled */}
        {showOfficeLocations && officeLocations.map((office, index) => (
          <Marker
            key={index}
            position={office.position}
            icon={L.divIcon({
              className: 'office-icon',
              html: `<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>
              <div>
                <h3 className="font-bold">Office Location</h3>
                <p>{office.city}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

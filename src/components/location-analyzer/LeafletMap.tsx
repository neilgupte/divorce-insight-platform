
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { ZIPCodeData } from '@/lib/zipUtils';

// Fix for marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for office locations
const officeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Define colors for opportunity levels
const opportunityColors = {
  Low: '#3b82f6', // Blue
  Medium: '#8b5cf6', // Purple
  High: '#ef4444', // Red
  Default: '#6b7280', // Gray
};

interface LeafletMapProps {
  zipData: ZIPCodeData[];
  onZipClick: (data: ZIPCodeData) => void;
  opportunityFilter: 'Low' | 'Medium' | 'High' | 'All';
  urbanicityFilter: 'Urban' | 'Suburban' | 'Rural' | 'All';
  showOfficeLocations: boolean;
  officeLocations: { city: string; position: [number, number] }[];
  fullscreen?: boolean;
}

// Get the opportunity size label from the opportunity value
const getOpportunitySize = (opportunityValue: number): 'Low' | 'Medium' | 'High' => {
  if (opportunityValue >= 10) {
    return 'High';
  } else if (opportunityValue >= 5) {
    return 'Medium';
  } else {
    return 'Low';
  }
};

// Function to filter the data based on filters
const filterData = (
  data: ZIPCodeData[],
  opportunityFilter: 'Low' | 'Medium' | 'High' | 'All',
  urbanicityFilter: 'Urban' | 'Suburban' | 'Rural' | 'All'
) => {
  return data.filter(item => {
    // Filter by opportunity
    if (opportunityFilter !== 'All') {
      const itemOpportunitySize = getOpportunitySize(item.opportunity);
      if (itemOpportunitySize !== opportunityFilter) return false;
    }
    
    // Filter by urbanicity
    if (urbanicityFilter !== 'All') {
      if (item.urbanicity !== urbanicityFilter) return false;
    }
    
    return true;
  });
};

// Map view updater component
const MapViewUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Legend component
const Legend: React.FC = () => {
  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar bg-white dark:bg-gray-800 p-2 m-2 rounded-md shadow-md">
        <h4 className="text-sm font-semibold mb-1">Opportunity</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: opportunityColors.High }}></div>
            <span className="text-xs">High ($10M+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: opportunityColors.Medium }}></div>
            <span className="text-xs">Medium ($5-10M)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: opportunityColors.Low }}></div>
            <span className="text-xs">Low ($0-5M)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  zipData,
  onZipClick,
  opportunityFilter,
  urbanicityFilter,
  showOfficeLocations,
  officeLocations,
  fullscreen = false
}) => {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const filteredData = filterData(zipData, opportunityFilter, urbanicityFilter);
  
  // USA center coordinates and default zoom
  const center: [number, number] = [39.8283, -98.5795];
  const defaultZoom = 4;
  
  useEffect(() => {
    if (mapRef.current) {
      setMapReady(true);
    }
  }, [mapRef.current]);

  return (
    <div className={`w-full ${fullscreen ? 'h-full' : 'h-[400px]'} relative z-10`}>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        zoom={defaultZoom}
        zoomControl={false}
        center={center}
        whenCreated={(map) => {
          mapRef.current = map;
          setMapReady(true);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomleft" />
        <MapViewUpdater center={center} zoom={defaultZoom} />
        
        {/* Render ZIP code data as markers */}
        {mapReady && filteredData.map((zip, index) => {
          const opportunitySize = getOpportunitySize(zip.opportunity);
          const opportunityColor = opportunityColors[opportunitySize] || opportunityColors.Default;
          
          // Create custom icon with color based on opportunity size
          const zipMarker = new L.DivIcon({
            className: 'custom-zip-marker',
            html: `<div style="background-color: ${opportunityColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          
          return (
            <Marker
              key={`zip-${index}`}
              position={[parseFloat(zip.latitude || "0"), parseFloat(zip.longitude || "0")]}
              icon={zipMarker}
              eventHandlers={{
                click: () => {
                  onZipClick(zip);
                },
              }}
            >
              <Tooltip>
                <div>
                  <div className="font-semibold">{zip.zipCode} - {zip.city}</div>
                  <div>Opportunity: ${zip.opportunity}M</div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
        
        {/* Office locations */}
        {showOfficeLocations && officeLocations.map((office, index) => (
          <Marker
            key={`office-${index}`}
            position={office.position}
            icon={officeIcon}
          >
            <Popup>
              <div>
                <div className="font-semibold">{office.city} Office</div>
                <div className="text-sm">Existing office location</div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Map Legend */}
        <Legend />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

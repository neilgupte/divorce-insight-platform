
import React, { useEffect, useRef, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Tooltip,
  ZoomControl,
  useMap,
  Marker
} from 'react-leaflet';
import { ZIPCodeData } from '@/lib/zipUtils';
import { 
  ZIPPolygon, 
  generateZIPPolygons, 
  getOpportunityColor, 
  getOpportunityOpacity,
  getMapBounds,
  getOpportunityTier
} from '@/lib/mapUtils';
import 'leaflet/dist/leaflet.css';
import { LatLngBoundsExpression, Icon } from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix the Leaflet icon issue for markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LeafletMapProps {
  zipData: ZIPCodeData[];
  onZipClick: (data: ZIPCodeData) => void;
  className?: string;
  opportunityFilter?: 'Low' | 'Medium' | 'High' | 'All';
  urbanicityFilter?: 'Urban' | 'Suburban' | 'Rural' | 'All';
  fullscreen?: boolean;
  showOfficeLocations?: boolean;
  officeLocations?: Array<{ city: string; position: [number, number] }>;
}

// Component to update map bounds when data changes
const MapBoundsUpdater: React.FC<{ bounds: LatLngBoundsExpression }> = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(bounds);
  }, [bounds, map]);
  
  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  zipData, 
  onZipClick,
  className,
  opportunityFilter = 'All',
  urbanicityFilter = 'All',
  fullscreen = false,
  showOfficeLocations = false,
  officeLocations = []
}) => {
  const [polygons, setPolygons] = useState<ZIPPolygon[]>([]);
  const mapRef = useRef(null);
  const [bounds, setBounds] = useState<LatLngBoundsExpression>([[25, -125], [49, -65]]);
  
  // Filter polygons based on opportunity and urbanicity filters
  const getFilteredPolygons = (allPolygons: ZIPPolygon[]) => {
    return allPolygons.filter(polygon => {
      const data = polygon.data;
      
      // Filter by opportunity tier
      if (opportunityFilter !== 'All') {
        const tier = getOpportunityTier(data.opportunity);
        if (tier !== opportunityFilter) return false;
      }
      
      // Filter by urbanicity
      if (urbanicityFilter !== 'All' && data.urbanicity !== urbanicityFilter) {
        return false;
      }
      
      return true;
    });
  };
  
  // Generate polygons when zipData changes
  useEffect(() => {
    if (zipData.length) {
      const generatedPolygons = generateZIPPolygons(zipData);
      const filteredPolygons = getFilteredPolygons(generatedPolygons);
      setPolygons(filteredPolygons);
      
      // Calculate map bounds
      const newBounds = getMapBounds(filteredPolygons);
      setBounds(newBounds);
    }
  }, [zipData, opportunityFilter, urbanicityFilter]);
  
  // Use colorful OpenStreetMap tiles
  const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <MapContainer
        ref={mapRef}
        className="w-full h-full rounded-md"
        style={{ background: '#f0f0f0' }}
        bounds={bounds}
      >
        <TileLayer
          url={tileLayerUrl}
        />
        
        <ZoomControl position="bottomright" />
        
        {/* Update map bounds when data changes */}
        <MapBoundsUpdater bounds={bounds} />
        
        {/* Render ZIP code polygons */}
        {polygons.map((polygon) => {
          const data = polygon.data;
          const displayValue = `$${data.opportunity.toFixed(1)}M`;
          const color = getOpportunityColor(data.opportunity);
          const opacity = getOpportunityOpacity(data.opportunity);
          
          return (
            <Polygon
              key={data.zipCode}
              positions={polygon.coordinates.map(point => [point.lat, point.lng])}
              pathOptions={{
                fillColor: color,
                fillOpacity: opacity,
                weight: 1,
                opacity: 0.7,
                color: 'white',
              }}
              eventHandlers={{
                click: () => onZipClick(data),
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 2,
                    color: '#fff',
                    fillOpacity: opacity + 0.2,
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 1,
                    color: 'white',
                    fillOpacity: opacity,
                  });
                },
              }}
            >
              <Tooltip>
                <div className="font-semibold">{data.zipCode}</div>
                <div>{data.city}, {data.state}</div>
                <div className="font-medium">{displayValue}</div>
                {data.divorceRate && (
                  <div className="text-sm">Divorce Rate: {data.divorceRate}%</div>
                )}
              </Tooltip>
            </Polygon>
          );
        })}
        
        {/* Office Location Markers */}
        {showOfficeLocations && officeLocations.map((office, index) => (
          <Marker 
            key={`office-${index}`} 
            position={office.position}
          >
            <Tooltip permanent>
              <div className="font-semibold">{office.city} Office</div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend - fixed position at bottom right */}
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded shadow-md text-xs z-10">
        <div className="font-medium mb-1">Opportunity Tiers:</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Low ($0-5M)</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a855f7' }}></div>
          <span>Medium ($5-10M)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
          <span>High ($10M+)</span>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;

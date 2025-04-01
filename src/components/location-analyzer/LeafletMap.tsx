
import React, { useEffect, useRef, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Tooltip as LeafletTooltip,
  ZoomControl,
  useMap
} from 'react-leaflet';
import { ZIPCodeData } from '@/lib/zipUtils';
import { 
  ZIPPolygon, 
  generateZIPPolygons, 
  getOpportunityColor, 
  getOpportunityOpacity,
  getMapBounds
} from '@/lib/mapUtils';
import 'leaflet/dist/leaflet.css';
import { LatLngBoundsExpression } from 'leaflet';

interface LeafletMapProps {
  zipData: ZIPCodeData[];
  viewMode: 'opportunity' | 'tam';
  onZipClick: (data: ZIPCodeData) => void;
  className?: string;
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
  viewMode, 
  onZipClick,
  className 
}) => {
  const [polygons, setPolygons] = useState<ZIPPolygon[]>([]);
  const mapRef = useRef(null);
  const [bounds, setBounds] = useState<LatLngBoundsExpression>([[25, -125], [49, -65]]);
  
  // Generate polygons when zipData changes
  useEffect(() => {
    if (zipData.length) {
      const generatedPolygons = generateZIPPolygons(zipData);
      setPolygons(generatedPolygons);
      
      // Calculate map bounds
      const newBounds = getMapBounds(generatedPolygons);
      setBounds(newBounds);
    }
  }, [zipData]);
  
  // Use standard colored OpenStreetMap tiles
  const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <MapContainer
        ref={mapRef}
        className="w-full h-full rounded-md"
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ background: '#f0f0f0' }}
        bounds={[[25, -125], [49, -65]]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileLayerUrl}
        />
        
        <ZoomControl position="bottomright" />
        
        {/* Update map bounds when data changes */}
        <MapBoundsUpdater bounds={bounds} />
        
        {/* Render ZIP code polygons */}
        {polygons.map((polygon) => {
          const data = polygon.data;
          const displayValue = viewMode === 'opportunity' 
            ? `$${data.opportunity.toFixed(1)}M` 
            : `$${data.tam.toFixed(1)}M`;
          const color = viewMode === 'opportunity' 
            ? getOpportunityColor(data.opportunity) 
            : getOpportunityColor(data.tam / 2); // Adjusting scale for TAM
          const opacity = getOpportunityOpacity(viewMode === 'opportunity' ? data.opportunity : data.tam / 2);
          
          return (
            <Polygon
              key={`${data.zipCode}-${viewMode}`}
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
              <LeafletTooltip sticky className="custom-tooltip">
                <div className="font-semibold">{data.zipCode}</div>
                <div>{data.city}, {data.state}</div>
                <div className="font-medium">{displayValue}</div>
              </LeafletTooltip>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

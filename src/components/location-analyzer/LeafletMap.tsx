
import React, { useEffect, useRef, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Tooltip,
  ZoomControl,
  useMap
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
import { LatLngBoundsExpression } from 'leaflet';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Filter } from 'lucide-react';

interface LeafletMapProps {
  zipData: ZIPCodeData[];
  viewMode?: 'opportunity' | 'tam';
  onZipClick: (data: ZIPCodeData) => void;
  className?: string;
  opportunityFilter?: 'Low' | 'Medium' | 'High' | 'All';
  urbanicityFilter?: 'Urban' | 'Suburban' | 'Rural' | 'All';
  fullscreen?: boolean;
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
  viewMode = 'opportunity', 
  onZipClick,
  className,
  opportunityFilter = 'All',
  urbanicityFilter = 'All',
  fullscreen = false
}) => {
  const [polygons, setPolygons] = useState<ZIPPolygon[]>([]);
  const mapRef = useRef(null);
  const [bounds, setBounds] = useState<LatLngBoundsExpression>([[25, -125], [49, -65]]);
  const [localViewMode, setLocalViewMode] = useState<'opportunity' | 'tam'>(viewMode);
  
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
  
  // Update view mode when prop changes
  useEffect(() => {
    setLocalViewMode(viewMode);
  }, [viewMode]);
  
  // Use colorful OpenStreetMap tiles
  const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  return (
    <div className={`w-full h-full ${className || ''}`}>
      {fullscreen && (
        <div className="absolute top-2 right-16 z-10 bg-white/90 dark:bg-gray-800/90 rounded shadow-md p-1">
          <Tabs defaultValue={localViewMode} onValueChange={(value) => setLocalViewMode(value as 'opportunity' | 'tam')}>
            <TabsList>
              <TabsTrigger value="opportunity" className="flex items-center gap-1 px-3 py-1.5">
                <Filter className="h-4 w-4" />
                <span>Opportunity</span>
              </TabsTrigger>
              <TabsTrigger value="tam" className="flex items-center gap-1 px-3 py-1.5">
                <Layers className="h-4 w-4" />
                <span>TAM</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <MapContainer
        ref={mapRef}
        className="w-full h-full rounded-md"
        style={{ background: '#f0f0f0' }}
        bounds={bounds}
        zoomControl={false}
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
          const displayValue = localViewMode === 'opportunity' 
            ? `$${data.opportunity.toFixed(1)}M` 
            : `$${data.tam.toFixed(1)}M`;
          const color = localViewMode === 'opportunity' 
            ? getOpportunityColor(data.opportunity) 
            : getOpportunityColor(data.tam / 2); // Adjusting scale for TAM
          const opacity = getOpportunityOpacity(localViewMode === 'opportunity' ? data.opportunity : data.tam / 2);
          
          return (
            <Polygon
              key={`${data.zipCode}-${localViewMode}`}
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

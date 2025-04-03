
import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { ZIPCodeData } from "@/lib/zipUtils";
import { MAPBOX_ACCESS_TOKEN } from "./mapConstants";
import { getFeatureStyle, configureFeatureInteractions } from "./geoJSONUtils";

interface MapComponentProps {
  filteredGeoJsonData: Record<string, any>;
  fullscreen?: boolean;
  zipData?: ZIPCodeData[];
  onZipClick?: (data: ZIPCodeData) => void;
  showOfficeLocations?: boolean;
  officeLocations?: { city: string; position: [number, number] }[];
  defaultCenter: [number, number];
  defaultZoom: number;
  onMapReady: (map: L.Map) => void;
}

// MapReady component to handle setting the map instance
const MapReady = ({ setMap }: { setMap: (map: L.Map) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  filteredGeoJsonData,
  fullscreen = false,
  zipData = [],
  onZipClick,
  showOfficeLocations = false,
  officeLocations = [],
  defaultCenter,
  defaultZoom,
  onMapReady
}) => {
  return (
    <div style={{ height: fullscreen ? "calc(100% - 56px)" : "360px", width: "100%" }} className="relative">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={false}
      >
        <MapReady setMap={onMapReady} />
        
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/spiratech/cm900m0pi005z01s71vnefvq3/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`}
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
        />
        
        {Object.entries(filteredGeoJsonData).map(([fileId, geoData]) => 
          geoData && geoData.features && geoData.features.length > 0 && (
            <GeoJSON 
              key={`geo-json-${fileId}`}
              data={geoData} 
              style={getFeatureStyle} 
              onEachFeature={(feature, layer) => 
                configureFeatureInteractions(feature, layer, zipData, onZipClick)
              } 
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
  );
};

export default MapComponent;

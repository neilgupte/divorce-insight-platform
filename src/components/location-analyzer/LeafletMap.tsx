
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/leaflet-fixes.css";

interface LeafletMapProps {
  fullscreen?: boolean;
}

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOHp6czZ1ZzBmNHcyanM4MnRkcHQ2dTUifQ.r4eSgGg09379mRWiUchnvg";

const LeafletMap: React.FC<LeafletMapProps> = ({ fullscreen = false }) => {
  const defaultCenter: [number, number] = [37.0902, -95.7129];
  const defaultZoom = 4;
  const [mapError, setMapError] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/spiratech/public/main/zcta_06_halfsize.geojson")
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch(() => setMapError("Failed to load GeoJSON map data."));
  }, []);

  const getStyle = (feature: any) => {
    return {
      fillColor: feature.properties.fill || "#ccc",
      weight: 0.5,
      opacity: 0.5,
      color: "#666",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.GEOID20) {
      layer.bindPopup(
        `<strong>ZIP:</strong> ${feature.properties.GEOID20}<br/>
         <strong>Opportunity:</strong> $${feature.properties.opportunity?.toFixed(2)}M`
      );
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
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/spiratech/cm900m0pi005z01s71vnefvq3/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`}
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
        />
        {geoJsonData && (
          <GeoJSON data={geoJsonData} style={getStyle} onEachFeature={onEachFeature} />
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

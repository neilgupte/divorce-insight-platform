
import React from "react";

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
}

const MapContainer: React.FC<MapContainerProps> = ({ mapRef }) => {
  return <div ref={mapRef} className="h-full w-full" />;
};

export default MapContainer;


import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Facility } from "./types";

// Updated token with the correct one
const MAPBOX_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOXBzbXI0eTFjdHoya3IwNng1ZTI4ZHoifQ.hgWIXnSx6HdRC67U2xhdxQ";

interface FacilityMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (facility: Facility) => void;
  fullscreen: boolean;
}

const FacilityMap: React.FC<FacilityMapProps> = ({ 
  facilities, 
  selectedFacility, 
  onSelectFacility,
  fullscreen
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{[key: string]: mapboxgl.Marker}>({});
  const popups = useRef<{[key: string]: mapboxgl.Popup}>({});

  // Calculate center of all facilities
  const getMapCenter = (): [number, number] => {
    if (facilities.length === 0) return [-95.7129, 37.0902]; // Default center of US
    
    const sumLat = facilities.reduce((sum, facility) => sum + facility.lat, 0);
    const sumLng = facilities.reduce((sum, facility) => sum + facility.lng, 0);
    
    return [sumLng / facilities.length, sumLat / facilities.length];
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Clear any previous map instance
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Set the correct Mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: getMapCenter(),
        zoom: 5
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

      map.current.on("load", () => {
        if (!map.current) return;
        
        // Add facility markers
        facilities.forEach((facility) => {
          // Create marker element
          const el = document.createElement("div");
          el.className = "facility-marker";
          el.style.width = "30px";
          el.style.height = "30px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = "#9b87f5";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.style.color = "white";
          el.style.fontWeight = "bold";
          el.style.border = "2px solid white";
          el.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
          el.style.cursor = "pointer";
          el.innerText = facility.id;
          
          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${facility.name}</h3>
                <p class="text-sm">Delta: ${facility.delta > 0 ? '+' : ''}${facility.delta}</p>
              </div>
            `);

          // Create marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([facility.lng, facility.lat])
            .setPopup(popup)
            .addTo(map.current!);
            
          // Store markers and popups for later reference
          markers.current[facility.id] = marker;
          popups.current[facility.id] = popup;
          
          // Add click event
          el.addEventListener('click', () => {
            onSelectFacility(facility);
          });
          
          // Add hover event
          el.addEventListener('mouseenter', () => {
            popup.addTo(map.current!);
          });
          
          el.addEventListener('mouseleave', () => {
            popup.remove();
          });
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [facilities, onSelectFacility, fullscreen]);
  
  // Update marker appearance when selection changes
  useEffect(() => {
    Object.entries(markers.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      
      if (selectedFacility && id === selectedFacility.id) {
        el.style.backgroundColor = "#7E69AB";
        el.style.width = "36px";
        el.style.height = "36px";
        el.style.zIndex = "10";
      } else {
        el.style.backgroundColor = "#9b87f5";
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.zIndex = "1";
      }
    });
  }, [selectedFacility]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default FacilityMap;

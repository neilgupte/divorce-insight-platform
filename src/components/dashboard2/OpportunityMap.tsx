import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import { MAPBOX_ACCESS_TOKEN } from '@/components/location-analyzer/mapbox/mapConstants';

interface OpportunityMapProps {
  selectedState: string;
  scoreFilters: {
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  incomeRange: [number, number];
}

const OpportunityMap: React.FC<OpportunityMapProps> = ({ 
  selectedState, 
  scoreFilters,
  incomeRange 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { theme } = useTheme();

  const getMapStyle = () => {
    return theme === 'dark' 
      ? 'mapbox://styles/mapbox/dark-v11' 
      : 'mapbox://styles/mapbox/streets-v12';
  };

  // State center coordinates
  const getStateCenter = (): [number, number] => {
    const stateCoordinates: Record<string, [number, number]> = {
      'Florida': [-82.4, 28.0],
      'California': [-119.4179, 36.7783],
      'Texas': [-99.9018, 31.9686],
      'New York': [-75.0152, 43.2994],
      // Add more states here
    };
    return stateCoordinates[selectedState] || [-98.5795, 39.8283]; // US center fallback
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const center = getStateCenter();
    const zoom = selectedState === 'All States' ? 3 : 6;

    if (!map.current) {
      // Create new map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: getMapStyle(),
        center,
        zoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.once('load', () => {
        addLegend();
      });
    } else {
      // If map already exists, just update style and view
      map.current.setStyle(getMapStyle());

      map.current.flyTo({
        center,
        zoom,
        essential: true,
      });

      map.current.once('styledata', () => {
        addLegend();
      });
    }

    const addLegend = () => {
      if (!map.current) return;

      const existingLegend = document.querySelector('.map-legend');
      if (existingLegend) {
        existingLegend.remove();
      }

      const legend = document.createElement('div');
      legend.className = 'map-legend';
      legend.style.position = 'absolute';
      legend.style.bottom = '10px';
      legend.style.right = '10px';
      legend.style.backgroundColor = 'white';
      legend.style.padding = '10px';
      legend.style.borderRadius = '6px';
      legend.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      legend.style.fontSize = '12px';
      legend.style.zIndex = '10';

      const title = document.createElement('div');
      title.innerHTML = '<strong>Composite Score</strong>';
      title.style.marginBottom = '8px';
      legend.appendChild(title);

      const items = [
        { color: '#ef4444', label: 'Low (1-7)' },
        { color: '#facc15', label: 'Medium (8-14)' },
        { color: '#22c55e', label: 'High (15-20)' },
      ];

      items.forEach(item => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.marginBottom = '4px';

        const colorBox = document.createElement('div');
        colorBox.style.width = '12px';
        colorBox.style.height = '12px';
        colorBox.style.backgroundColor = item.color;
        colorBox.style.marginRight = '6px';

        const label = document.createElement('span');
        label.textContent = item.label;

        row.appendChild(colorBox);
        row.appendChild(label);
        legend.appendChild(row);
      });

      mapContainer.current?.appendChild(legend);
    };

    return () => {
      // Optional: if you want to fully reset the map on unmount
      // if (map.current) {
      //   map.current.remove();
      //   map.current = null;
      // }
    };
  }, [selectedState, theme]);

  return (
    <div ref={mapContainer} className="h-full w-full relative" />
  );
};

export default OpportunityMap;

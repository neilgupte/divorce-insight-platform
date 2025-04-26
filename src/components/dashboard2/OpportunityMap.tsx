
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
  const mapStyle = theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';
  
  // Get state center coordinates
  const getStateCenter = (): [number, number] => {
    const stateCoordinates: Record<string, [number, number]> = {
      'Florida': [-82.4, 28.0],
      'California': [-119.4179, 36.7783],
      'Texas': [-99.9018, 31.9686],
      'New York': [-75.0152, 43.2994],
      // Add more states as needed
    };
    
    return stateCoordinates[selectedState] || [-98.5795, 39.8283]; // Default to US center
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    // If map doesn't exist, create it
    if (!map.current) {
      const center = getStateCenter();
      const zoom = selectedState === 'All States' ? 3 : 6;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: zoom
      });
      
      // Add navigation controls (zoom in/out buttons)
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );
    } else {
      // Update map style if theme changes
      map.current.setStyle(mapStyle);
      
      // Update center and zoom based on selected state
      if (selectedState) {
        map.current.flyTo({
          center: getStateCenter(),
          zoom: selectedState === 'All States' ? 3 : 6,
          essential: true
        });
      }
    }
    
    // Add legend to the map
    const addLegend = () => {
      if (!map.current) return;
      
      // Remove existing legend if it exists
      const existingLegend = document.querySelector('.map-legend');
      if (existingLegend) {
        existingLegend.remove();
      }
      
      // Create legend element
      const legend = document.createElement('div');
      legend.className = 'map-legend';
      legend.style.position = 'absolute';
      legend.style.bottom = '10px';
      legend.style.right = '10px';
      legend.style.backgroundColor = 'white';
      legend.style.padding = '10px';
      legend.style.borderRadius = '4px';
      legend.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
      legend.style.zIndex = '1';
      legend.style.fontSize = '12px';

      // Add title
      const title = document.createElement('div');
      title.innerHTML = '<strong>Composite Score</strong>';
      title.style.marginBottom = '8px';
      legend.appendChild(title);

      // Add legend items
      const items = [
        { color: '#ef4444', label: 'Low (1-7)' },
        { color: '#a855f7', label: 'Medium (8-14)' },
        { color: '#22c55e', label: 'High (15-20)' }
      ];
      
      items.forEach((item) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.marginBottom = '4px';
        
        const colorSquare = document.createElement('div');
        colorSquare.style.width = '12px';
        colorSquare.style.height = '12px';
        colorSquare.style.backgroundColor = item.color;
        colorSquare.style.marginRight = '6px';
        
        const label = document.createElement('span');
        label.textContent = item.label;
        
        row.appendChild(colorSquare);
        row.appendChild(label);
        legend.appendChild(row);
      });
      
      // Add attribution logo
      const attribution = document.createElement('div');
      attribution.style.marginTop = '6px';
      attribution.style.fontSize = '10px';
      attribution.innerHTML = '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>';
      legend.appendChild(attribution);
      
      mapContainer.current?.appendChild(legend);
    };

    map.current.once('load', addLegend);
    
    return () => {
      // No need to clean up the map as we're reusing it
    };
  }, [selectedState, mapStyle, theme]);

  return (
    <div ref={mapContainer} className="h-full w-full" />
  );
};

export default OpportunityMap;

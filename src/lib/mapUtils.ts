
// Utility functions for the interactive ZIP code map

import { ZIPCodeData } from "./zipUtils";

// Interface for a polygon coordinate point
export interface Point {
  lat: number;
  lng: number;
}

// Interface for a ZIP code polygon
export interface ZIPPolygon {
  zipCode: string;
  coordinates: Point[];
  data: ZIPCodeData;
}

// Function to generate a polygon around a center point
const generatePolygonAroundPoint = (centerLat: number, centerLng: number, size: number = 0.05): Point[] => {
  const coordinates: Point[] = [];
  const corners = 5 + Math.floor(Math.random() * 4); // 5 to 8 corners for variety
  
  for (let i = 0; i < corners; i++) {
    // Create slightly irregular polygons for realism
    const angle = (i / corners) * 2 * Math.PI;
    const irregularity = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3
    const r = size * irregularity;
    
    coordinates.push({
      lat: centerLat + r * Math.sin(angle),
      lng: centerLng + r * Math.cos(angle)
    });
  }
  
  return coordinates;
};

// Define approximate center points for some states
const stateCenterPoints: Record<string, { lat: number; lng: number }> = {
  "California": { lat: 36.778259, lng: -119.417931 },
  "New York": { lat: 40.712776, lng: -74.005974 },
  "Texas": { lat: 31.968599, lng: -99.901810 },
  "Florida": { lat: 27.664827, lng: -81.515754 },
  "Illinois": { lat: 40.633125, lng: -89.398528 },
  "Arkansas": { lat: 34.799999, lng: -92.199997 },
  "Alabama": { lat: 32.318230, lng: -86.902298 },
  "Alaska": { lat: 64.200844, lng: -149.493668 },
  "Arizona": { lat: 34.048927, lng: -111.093735 },
  "Colorado": { lat: 39.113014, lng: -105.358887 },
  "Connecticut": { lat: 41.599998, lng: -72.699997 },
  // Default for other states
  "default": { lat: 39.833333, lng: -98.583333 }, // Approximate center of US
};

// Generate simulated polygon data for ZIP codes
export const generateZIPPolygons = (zipData: ZIPCodeData[]): ZIPPolygon[] => {
  return zipData.map(data => {
    // Get state center point or use default US center
    const stateCenter = stateCenterPoints[data.state] || stateCenterPoints.default;
    
    // Create a random offset from the state center (for visual distribution)
    const latOffset = (Math.random() - 0.5) * 2; // +/- 1 degree
    const lngOffset = (Math.random() - 0.5) * 2;
    
    // Generate base center point
    const centerLat = stateCenter.lat + latOffset;
    const centerLng = stateCenter.lng + lngOffset;
    
    // Generate polygon size based on opportunity (larger opportunity = larger polygon)
    const polygonSize = 0.03 + (data.opportunity / 20) * 0.05; // 0.03 to 0.08 based on opportunity
    
    return {
      zipCode: data.zipCode,
      coordinates: generatePolygonAroundPoint(centerLat, centerLng, polygonSize),
      data: data
    };
  });
};

// Get color based on opportunity tier
export const getOpportunityColor = (opportunity: number): string => {
  if (opportunity >= 10) {
    return '#ef4444'; // Red for High ($10M+)
  } else if (opportunity >= 5) {
    return '#a855f7'; // Purple for Medium ($5M-$10M)
  } else {
    return '#3b82f6'; // Blue for Low (<$5M)
  }
};

// Get opacity based on opportunity (higher opportunity = more opaque)
export const getOpportunityOpacity = (opportunity: number): number => {
  return 0.4 + (opportunity / 20) * 0.4; // 0.4 to 0.8 based on opportunity
};

// Get opportunity tier label
export const getOpportunityTier = (opportunity: number): string => {
  if (opportunity >= 10) {
    return 'High';
  } else if (opportunity >= 5) {
    return 'Medium';
  } else {
    return 'Low';
  }
};

// Function to get map bounds from polygons
export const getMapBounds = (polygons: ZIPPolygon[]): [[number, number], [number, number]] => {
  if (polygons.length === 0) return [[25, -125], [49, -65]]; // Default US bounds
  
  // Initialize with extreme values
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  
  // Find min/max bounds across all polygons
  polygons.forEach(polygon => {
    polygon.coordinates.forEach(point => {
      minLat = Math.min(minLat, point.lat);
      maxLat = Math.max(maxLat, point.lat);
      minLng = Math.min(minLng, point.lng);
      maxLng = Math.max(maxLng, point.lng);
    });
  });
  
  // Add padding
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;
  
  return [
    [minLat - latPadding, minLng - lngPadding],
    [maxLat + latPadding, maxLng + lngPadding]
  ];
};

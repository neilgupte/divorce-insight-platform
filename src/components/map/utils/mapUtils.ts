
// Add type declaration for window.initMap
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

// Mock data for heatmap - in a real app, this would come from your API
export const getHeatmapData = (filters?: MapFilters) => {
  // Base data points
  const basePoints = [
    { lat: 40.7128, lng: -74.0060, weight: 10, divorceRate: 5.2, netWorth: 18.5, luxuryDensity: 8.3, multiProperty: 45 }, // New York
    { lat: 34.0522, lng: -118.2437, weight: 8, divorceRate: 6.1, netWorth: 22.7, luxuryDensity: 9.2, multiProperty: 62 }, // Los Angeles
    { lat: 41.8781, lng: -87.6298, weight: 7, divorceRate: 4.8, netWorth: 12.4, luxuryDensity: 5.8, multiProperty: 34 }, // Chicago
    { lat: 29.7604, lng: -95.3698, weight: 6, divorceRate: 5.5, netWorth: 16.2, luxuryDensity: 6.1, multiProperty: 38 }, // Houston
    { lat: 33.4484, lng: -112.0740, weight: 5, divorceRate: 6.3, netWorth: 10.5, luxuryDensity: 4.2, multiProperty: 41 }, // Phoenix
    { lat: 39.9526, lng: -75.1652, weight: 9, divorceRate: 4.7, netWorth: 14.8, luxuryDensity: 7.6, multiProperty: 36 }, // Philadelphia
    { lat: 32.7767, lng: -96.7970, weight: 7, divorceRate: 5.8, netWorth: 18.9, luxuryDensity: 7.2, multiProperty: 48 }, // Dallas
    { lat: 37.7749, lng: -122.4194, weight: 10, divorceRate: 4.2, netWorth: 35.6, luxuryDensity: 12.1, multiProperty: 72 }, // San Francisco
    { lat: 47.6062, lng: -122.3321, weight: 8, divorceRate: 4.5, netWorth: 19.3, luxuryDensity: 8.7, multiProperty: 51 }, // Seattle
    { lat: 25.7617, lng: -80.1918, weight: 9, divorceRate: 7.2, netWorth: 28.4, luxuryDensity: 10.8, multiProperty: 68 }, // Miami
    { lat: 42.3601, lng: -71.0589, weight: 8, divorceRate: 3.9, netWorth: 22.7, luxuryDensity: 9.3, multiProperty: 46 }, // Boston
    { lat: 36.1699, lng: -115.1398, weight: 7, divorceRate: 8.1, netWorth: 15.8, luxuryDensity: 11.2, multiProperty: 59 }, // Las Vegas
    { lat: 30.2672, lng: -97.7431, weight: 6, divorceRate: 5.4, netWorth: 17.6, luxuryDensity: 7.8, multiProperty: 44 }, // Austin
    { lat: 33.7490, lng: -84.3880, weight: 7, divorceRate: 6.2, netWorth: 16.4, luxuryDensity: 7.3, multiProperty: 42 }, // Atlanta
    { lat: 38.9072, lng: -77.0369, weight: 9, divorceRate: 4.1, netWorth: 24.5, luxuryDensity: 9.6, multiProperty: 53 }, // Washington D.C.
  ];

  // Filter points based on the active filters
  if (filters) {
    return basePoints.filter(point => {
      let include = true;
      
      if (filters.divorceRate?.enabled && point.divorceRate < filters.divorceRate.min) {
        include = false;
      }
      
      if (filters.netWorth?.enabled && (point.netWorth < filters.netWorth.min || point.netWorth > filters.netWorth.max)) {
        include = false;
      }
      
      if (filters.luxuryDensity?.enabled && point.luxuryDensity < filters.luxuryDensity.min) {
        include = false;
      }
      
      if (filters.multiProperty?.enabled && point.multiProperty < filters.multiProperty.min) {
        include = false;
      }
      
      return include;
    });
  }
  
  return basePoints;
};

export const getPointWeight = (point: any, activeFiltersList: string[], filters?: MapFilters) => {
  if (activeFiltersList.length === 0) return point.weight;
  
  // Calculate combined score from active filters
  let score = 0;
  let count = 0;
  
  if (filters?.divorceRate?.enabled) {
    score += (point.divorceRate / 10) * 10; // Scale to 0-10
    count++;
  }
  
  if (filters?.netWorth?.enabled) {
    score += (point.netWorth / 40) * 10; // Scale to 0-10
    count++;
  }
  
  if (filters?.luxuryDensity?.enabled) {
    score += (point.luxuryDensity / 15) * 10; // Scale to 0-10
    count++;
  }
  
  if (filters?.multiProperty?.enabled) {
    score += (point.multiProperty / 80) * 10; // Scale to 0-10
    count++;
  }
  
  return count > 0 ? score / count : point.weight;
};

export interface MapFilters {
  state: string | null;
  divorceRate?: {
    enabled: boolean;
    min: number;
  };
  netWorth?: {
    enabled: boolean;
    min: number;
    max: number;
  };
  luxuryDensity?: {
    enabled: boolean;
    min: number;
  };
  multiProperty?: {
    enabled: boolean;
    min: number;
  };
}

export interface RegionSummary {
  region: string;
  metrics: {label: string; value: string}[];
}

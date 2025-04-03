
// Map settings

export const MAP_SETTINGS = {
  // Mapbox access token
  accessToken: "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOHp6czZ1ZzBmNHcyanM4MnRkcHQ2dTUifQ.r4eSgGg09379mRWiUchnvg",
  
  // Map style
  style: "mapbox://styles/mapbox/light-v11",
  
  // Default center coordinates (center of US)
  defaultCenter: [-98.5795, 39.8283] as [number, number],
  
  // Default zoom level
  defaultZoom: 3,
  
  // Opportunity color thresholds
  opportunityColors: {
    low: "#ef4444",    // Light red for low opportunity (<$1M)
    medium: "#b91c1c", // Medium red for medium opportunity ($1M-$9.9M)
    high: "#7f1d1d"    // Dark red for high opportunity ($10M+)
  },
  
  // Opportunity thresholds in millions
  opportunityThresholds: {
    low: 1,  // $1M threshold between low and medium
    high: 10 // $10M threshold between medium and high
  }
};

// Helper functions for map data
export const MAP_UTILS = {
  // Get opportunity color based on value
  getOpportunityColor(value: number): string {
    if (value >= MAP_SETTINGS.opportunityThresholds.high) {
      return MAP_SETTINGS.opportunityColors.high;
    } else if (value >= MAP_SETTINGS.opportunityThresholds.low) {
      return MAP_SETTINGS.opportunityColors.medium;
    } else {
      return MAP_SETTINGS.opportunityColors.low;
    }
  },
  
  // Get opportunity label based on value
  getOpportunityLabel(value: number): string {
    if (value >= MAP_SETTINGS.opportunityThresholds.high) {
      return "High";
    } else if (value >= MAP_SETTINGS.opportunityThresholds.low) {
      return "Medium";
    } else {
      return "Low";
    }
  }
};

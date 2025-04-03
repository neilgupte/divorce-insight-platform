
import { ZIPCodeData } from "@/lib/zipUtils";
import L from "leaflet";
import { STATE_ABBREVIATIONS, GEOJSON_FILES } from "./mapConstants";

// Load a single GeoJSON file
export const loadGeoJsonFile = async (fileInfo: typeof GEOJSON_FILES[0]) => {
  try {
    const response = await fetch(fileInfo.url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    
    // Add state information to each feature
    if (data && data.features) {
      data.features.forEach((feature: any) => {
        if (!feature.properties) {
          feature.properties = {};
        }
        feature.properties.STATE_NAME = fileInfo.name;
        feature.properties.STATE_ABBR = STATE_ABBREVIATIONS[fileInfo.name] || fileInfo.name;
      });
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching GeoJSON for ${fileInfo.name}:`, error);
    return null;
  }
};

// Get style for GeoJSON features
export const getFeatureStyle = (feature: any) => {
  let opportunity = 'Medium';

  if (feature.properties.opportunity !== undefined) {
    const value = parseFloat(feature.properties.opportunity);
    if (value < 10) opportunity = 'Low';
    else if (value > 50) opportunity = 'High';
  }
  
  return {
    fillColor: getOpportunityColor(opportunity),
    weight: 1,
    opacity: 0.7,
    color: '#666',
    fillOpacity: 0.6,
  };
};

// Get color based on opportunity level
export const getOpportunityColor = (opportunity: string): string => {
  switch (opportunity) {
    case 'Low': return '#FFC107';
    case 'Medium': return '#FF9800';
    case 'High': return '#F44336';
    default: return '#9E9E9E';
  }
};

// Generate mock data for a ZIP code
export const generateMockZIPData = (
  zipCode: string, 
  county: string, 
  stateAbbr: string
): ZIPCodeData => {
  // Generate dynamic data based on zip code to ensure different values
  const zipSeed = parseInt(zipCode.substring(0, 5)) || 10000;
  const randomMultiplier = (zipSeed % 100) / 100 + 0.5; // Value between 0.5 and 1.5
  
  return {
    zipCode: zipCode,
    city: county || 'Major City',
    state: stateAbbr,
    urbanicity: ['Urban', 'Suburban', 'Rural'][zipSeed % 3] as 'Urban' | 'Suburban' | 'Rural',
    divorceRate: (3 + (zipSeed % 8)) / 100,
    netWorth: Math.round(28000000 * randomMultiplier) / 10000000,
    opportunity: Math.round(10 + (zipSeed % 70)),
    tam: Math.round(20 + (zipSeed % 30)),
    sam: Math.round(10 + (zipSeed % 20))
  };
};

// Configure popup and events for each feature
export const configureFeatureInteractions = (
  feature: any, 
  layer: L.Layer,
  zipData: ZIPCodeData[],
  onZipClick?: (data: ZIPCodeData) => void
) => {
  if (feature.properties) {
    const zipCode = feature.properties.GEOID20 || feature.properties.ZCTA5CE20 || 'Unknown';
    const county = feature.properties.COUNTY || 'Unknown';
    const state = feature.properties.STATE_NAME || 'Unknown';
    const stateAbbr = feature.properties.STATE_ABBR || 'UN';
    const opportunityValue = feature.properties.opportunity ? 
      `$${parseFloat(feature.properties.opportunity).toFixed(2)}M` : 'Unknown';

    layer.bindPopup(`
      <strong>ZIP Code:</strong> ${zipCode}<br/>
      <strong>County:</strong> ${county}<br/>
      <strong>State:</strong> ${state}<br/>
      <strong>Opportunity:</strong> ${opportunityValue}
    `);

    layer.on('click', () => {
      if (onZipClick && zipData) {
        // Try to find matching ZIP code in our data
        const matchingZip = zipData.find(z => z.zipCode === zipCode);
        
        // If we don't find a matching ZIP, generate mock data for this ZIP code
        if (!matchingZip && zipCode !== 'Unknown') {
          const mockData = generateMockZIPData(zipCode, county, stateAbbr);
          
          if (onZipClick) {
            onZipClick(mockData);
          }
        } else if (matchingZip && onZipClick) {
          onZipClick(matchingZip);
        }
      }
    });
  }
};

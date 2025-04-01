// Mock data generator for ZIP code analysis

export interface ZIPCodeData {
  zipCode: string;
  state: string;
  city: string;
  tam: number; // Total Addressable Market in $M
  sam: number; // Serviceable Addressable Market in $M
  competitorCount: number;
  opportunity: number; // in $M
  hasOffice: boolean;
  urbanicity: "Urban" | "Suburban" | "Rural";
  divorceRate?: number; // Added divorceRate property as optional
  latitude?: string; // Added latitude property
  longitude?: string; // Added longitude property
}

// States with their abbreviations for reference
const stateAbbreviations: Record<string, string> = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY"
};

export { stateAbbreviations };

// Get state abbreviation 
export const getStateAbbreviation = (state: string): string => {
  return stateAbbreviations[state] || state;
};

// Map of states to major cities (simplified)
const stateCities: Record<string, string[]> = {
  "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
  "Texas": ["Houston", "Dallas", "Austin", "San Antonio"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
  "Illinois": ["Chicago", "Springfield", "Peoria", "Rockford"],
  "Arkansas": ["Little Rock", "Fayetteville", "Fort Smith", "Jonesboro"],
  "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville"],
  "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Sitka"],
  "Arizona": ["Phoenix", "Tucson", "Mesa", "Scottsdale"],
  "Colorado": ["Denver", "Boulder", "Colorado Springs", "Fort Collins"],
  "Connecticut": ["Hartford", "New Haven", "Stamford", "Bridgeport"]
};

// Generate a random ZIP code for a given state
const generateZipForState = (state: string): string => {
  // Real ZIP code mapping would be more accurate, but this is a simplification
  const zipRanges: Record<string, [number, number]> = {
    "California": [90001, 96162],
    "New York": [10001, 14975],
    "Texas": [73301, 79999],
    "Florida": [32003, 34997],
    "Illinois": [60001, 62999],
    "Arkansas": [71601, 72959],
    "default": [10000, 99999],
  };
  
  const range = zipRanges[state] || zipRanges["default"];
  return String(Math.floor(range[0] + Math.random() * (range[1] - range[0])));
};

// Generate a city for a state
const getCityForState = (state: string): string => {
  if (state === "All States") {
    const allStates = Object.keys(stateAbbreviations);
    const randomState = allStates[Math.floor(Math.random() * allStates.length)];
    return getCityForState(randomState);
  }
  
  const cities = stateCities[state];
  if (cities && cities.length > 0) {
    return cities[Math.floor(Math.random() * cities.length)];
  }
  
  return "Major City";
};

// Generate mock ZIP code data based on filters
export const generateMockZIPData = (
  selectedState: string,
  selectedCity: string,
  urbanicity: string,
  netWorthRange: [number, number],
  divorceRateThreshold: number,
  competitorCount: number,
  count: number = 25 // Default number of records to generate
): ZIPCodeData[] => {
  const result: ZIPCodeData[] = [];
  
  // Determine which states to include
  const states = selectedState !== "All States" 
    ? [selectedState] 
    : Object.keys(stateAbbreviations).slice(0, 15); // Limit to first 15 states for simplicity
  
  // Generate data
  for (let i = 0; i < count; i++) {
    const stateIdx = Math.floor(Math.random() * states.length);
    const state = states[stateIdx];
    const city = selectedCity !== "All Cities" ? selectedCity : getCityForState(state);
    
    // Determine urbanicity
    const urbanTypes: Array<"Urban" | "Suburban" | "Rural"> = ["Urban", "Suburban", "Rural"];
    const urbanType = urbanTypes[Math.floor(Math.random() * urbanTypes.length)] as "Urban" | "Suburban" | "Rural";
    
    // Skip if urbanicity filter doesn't match
    if (urbanicity !== "All" && urbanicity !== urbanType) {
      // Generate another item to ensure we reach count
      i--;
      continue;
    }
    
    // Calculate financial metrics
    // For simulation, higher net worth areas have higher TAM
    const netWorthMultiplier = Math.random() * (netWorthRange[1] - netWorthRange[0]) + netWorthRange[0];
    const tamBase = urbanType === "Urban" ? 12 : urbanType === "Suburban" ? 8 : 4;
    const tam = parseFloat((tamBase * (netWorthMultiplier / 10)).toFixed(1));
    
    // SAM is a percentage of TAM based on urbanicity (urban areas have higher accessibility)
    const samPercentage = urbanType === "Urban" ? 0.8 : urbanType === "Suburban" ? 0.6 : 0.4;
    const sam = parseFloat((tam * samPercentage).toFixed(1));
    
    // Competitor count with some randomness around the user-set value
    const competitors = Math.max(0, Math.floor(competitorCount + (Math.random() * 4 - 2)));
    
    // Divorce rate influenced by the threshold (modified to always include divorce rate)
    const divorceRate = (divorceRateThreshold + Math.random() * 3) / 100;
    
    // Opportunity calculation: TAM × Divorce Rate ÷ (Competitors + 1)
    const opportunity = parseFloat((tam * divorceRate / (competitors + 1)).toFixed(1));
    
    // Random office presence
    const hasOffice = Math.random() > 0.7;
    
    // Generate latitude and longitude for the ZIP code (simplified for mock data)
    const baseLat = state === "Alaska" ? 61.2 : state === "Hawaii" ? 19.9 : 38.0;
    const baseLng = state === "Alaska" ? -149.9 : state === "Hawaii" ? -155.5 : -98.0;
    
    // Random offset for visual distribution
    const latOffset = (Math.random() - 0.5) * 10;
    const lngOffset = (Math.random() - 0.5) * 20;
    
    const latitude = (baseLat + latOffset).toString();
    const longitude = (baseLng + lngOffset).toString();
    
    result.push({
      zipCode: generateZipForState(state),
      state,
      city,
      tam,
      sam,
      competitorCount: competitors,
      opportunity,
      hasOffice,
      urbanicity: urbanType,
      divorceRate: parseFloat((divorceRate * 100).toFixed(1)), // Convert to percentage and store
      latitude,
      longitude
    });
  }
  
  return result;
};

// Generate simulated competitor data
export interface CompetitorData {
  name: string;
  address: string;
  principal: string;
  rating?: number;
  yearsInOperation?: number;
  size?: string;
}

export const generateMockCompetitors = (zipCode: string, count: number = 5): CompetitorData[] => {
  const competitorNames = [
    "Elite Divorce Law",
    "Prestige Family Legal",
    "Diamond Separation Services",
    "Executive Divorce Counsel",
    "Platinum Family Law",
    "Sovereign Legal Partners",
    "Legacy Divorce Group",
    "Premier Family Attorneys",
    "Apex Dissolution Law",
    "Crown Separation Counsel"
  ];
  
  const streetNames = [
    "Main Street",
    "Oak Avenue",
    "Maple Boulevard",
    "Washington Street",
    "Park Avenue",
    "Broadway",
    "Central Avenue",
    "Highland Drive",
    "Lexington Avenue",
    "Wilshire Boulevard"
  ];
  
  const principals = [
    "Alexandra Wilson",
    "Jonathan Hughes",
    "Victoria Reynolds",
    "Maxwell Bennett",
    "Elizabeth Montgomery",
    "Richard Blackwell",
    "Sophia Harrington",
    "Theodore Chandler",
    "Olivia Remington",
    "Benjamin Sterling"
  ];
  
  const result: CompetitorData[] = [];
  
  for (let i = 0; i < count; i++) {
    const nameIndex = Math.floor(Math.random() * competitorNames.length);
    const streetIndex = Math.floor(Math.random() * streetNames.length);
    const principalIndex = Math.floor(Math.random() * principals.length);
    
    // Building number
    const buildingNumber = Math.floor(Math.random() * 999) + 100;
    
    // Suite number
    const suiteNumber = Math.floor(Math.random() * 300) + 100;
    
    // Rating between 3.0 and 5.0
    const rating = parseFloat((3 + Math.random() * 2).toFixed(1));
    
    // Years in operation between 2 and 25
    const yearsInOperation = Math.floor(Math.random() * 23) + 2;
    
    // Firm size
    const sizes = ["Small (2-5 attorneys)", "Medium (6-15 attorneys)", "Large (16+ attorneys)"];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    
    result.push({
      name: competitorNames[nameIndex],
      address: `${buildingNumber} ${streetNames[streetIndex]}, Suite ${suiteNumber}, ZIP ${zipCode}`,
      principal: principals[principalIndex],
      rating,
      yearsInOperation,
      size
    });
  }
  
  return result;
};

// Generate simulated HNW household stats
export interface HNWHouseholdStats {
  count: number;
  averageNetWorth: string;
  multiPropertyPercentage: number;
}

export const generateHNWHouseholdStats = (zipCode: string, urbanicity: "Urban" | "Suburban" | "Rural"): HNWHouseholdStats => {
  // Base count depending on urbanicity
  let baseCount: number;
  if (urbanicity === "Urban") {
    baseCount = Math.floor(Math.random() * 300) + 200; // 200-500
  } else if (urbanicity === "Suburban") {
    baseCount = Math.floor(Math.random() * 200) + 100; // 100-300
  } else {
    baseCount = Math.floor(Math.random() * 100) + 50; // 50-150
  }
  
  // Average net worth in millions
  const avgNetWorth = parseFloat((2 + Math.random() * 18).toFixed(1));
  
  // Percentage with 2+ properties
  const multiPropertyPercentage = Math.floor(Math.random() * 40) + 20; // 20-60%
  
  return {
    count: baseCount,
    averageNetWorth: `$${avgNetWorth}M`,
    multiPropertyPercentage
  };
};

// Generate simulated nearby luxury infrastructure
export interface LuxuryInfrastructure {
  privateAirstrips: number;
  luxuryClubs: number;
  fiveStarHotels: number;
  highEndRetail: number;
}

export const generateLuxuryInfrastructure = (zipCode: string, urbanicity: "Urban" | "Suburban" | "Rural"): LuxuryInfrastructure => {
  // Base multiplier depending on urbanicity
  let multiplier: number;
  if (urbanicity === "Urban") {
    multiplier = 1.5;
  } else if (urbanicity === "Suburban") {
    multiplier = 1.0;
  } else {
    multiplier = 0.5;
  }
  
  return {
    privateAirstrips: Math.floor(Math.random() * 3 * multiplier),
    luxuryClubs: Math.floor(Math.random() * 5 * multiplier) + 1,
    fiveStarHotels: Math.floor(Math.random() * 6 * multiplier),
    highEndRetail: Math.floor(Math.random() * 8 * multiplier) + 1
  };
};

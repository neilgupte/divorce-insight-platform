
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

// Map of states to major cities (simplified)
const stateCities: Record<string, string[]> = {
  "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
  "Texas": ["Houston", "Dallas", "Austin", "San Antonio"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
  "Illinois": ["Chicago", "Springfield", "Peoria", "Rockford"],
  // Add more as needed
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
    // Default range for other states
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
  if (cities) {
    return cities[Math.floor(Math.random() * cities.length)];
  }
  return "Unknown City";
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
    
    // Divorce rate influenced by the threshold
    const divorceRate = (divorceRateThreshold + Math.random() * 3) / 100;
    
    // Opportunity calculation: TAM × Divorce Rate ÷ (Competitors + 1)
    const opportunity = parseFloat((tam * divorceRate / (competitors + 1)).toFixed(1));
    
    // Random office presence
    const hasOffice = Math.random() > 0.7;
    
    result.push({
      zipCode: generateZipForState(state),
      state,
      city,
      tam,
      sam,
      competitorCount: competitors,
      opportunity,
      hasOffice,
      urbanicity: urbanType
    });
  }
  
  return result;
};

export interface ZIPCodeData {
  zipCode: string;
  city: string;
  state: string;
  urbanicity: 'Urban' | 'Suburban' | 'Rural';
  divorceRate: number;
  opportunity: number;
  netWorth?: number;
  tam?: number;
  sam?: number;
}

// Export the getStateAbbreviation function so it can be imported by ZIPCodeTable
export function getStateAbbreviation(stateName: string): string {
  const stateAbbreviations: { [key: string]: string } = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
  };
  return stateAbbreviations[stateName] || "CA";
}

export function generateMockZIPData(
  stateName: string,
  cityName: string,
  urbanicity: string,
  netWorthRange: [number, number],
  divorceRateThreshold: number,
  competitorCount: number,
  count: number,
  baseSeed: number = 1000
): ZIPCodeData[] {
  const US_CITIES: { [state: string]: string[] } = {
    "All States": ["All Cities"],
    Alabama: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
    Alaska: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
    Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
    Arkansas: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
    California: [
      "Los Angeles",
      "San Diego",
      "San Jose",
      "San Francisco",
      "Fresno",
    ],
    Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"],
    Connecticut: ["Bridgeport", "New Haven", "Stamford", "Hartford", "Waterbury"],
    Delaware: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
    Florida: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg"],
    Georgia: ["Atlanta", "Columbus", "Augusta", "Savannah", "Athens"],
    Hawaii: ["Honolulu", "Hilo", "Kailua", "Pearl City", "Waipahu"],
    Idaho: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
    Illinois: ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville"],
    Indiana: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
    Iowa: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Waterloo"],
    Kansas: ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe"],
    Kentucky: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
    Louisiana: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
    Maine: ["Portland", "Lewiston", "Bangor", "Auburn", "Biddeford"],
    Maryland: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Annapolis"],
    Massachusetts: ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge"],
    Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"],
    Minnesota: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"],
    Mississippi: ["Jackson", "Gulfport", "Hattiesburg", "Biloxi", "Meridian"],
    Missouri: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
    Montana: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
    Nebraska: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
    Nevada: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
    "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry", "Rochester"],
    "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison"],
    "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
    "New York": ["New York", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
    "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
    Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
    Oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Lawton"],
    Oregon: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"],
    Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
    "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
    "South Carolina": ["Columbia", "Charleston", "North Charleston", "Mount Pleasant", "Rock Hill"],
    "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
    Tennessee: ["Memphis", "Nashville", "Knoxville", "Chattanooga", "Clarksville"],
    Texas: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
    Utah: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
    Vermont: ["Burlington", "South Burlington", "Colchester", "Rutland", "Essex"],
    Virginia: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News"],
    Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
    "West Virginia": ["Charleston", "Huntington", "Parkersburg", "Morgantown", "Wheeling"],
    Wisconsin: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
    Wyoming: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
  };

  const US_STATES = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const randomCity = (randomValue: number, state: string): string => {
    const cities = US_CITIES[state] || US_CITIES["California"];
    return cities[Math.floor(randomValue * (cities.length - 1)) + 1];
  };

  const randomState = (randomValue: number): string => {
    return US_STATES[Math.floor(randomValue * US_STATES.length)];
  };
  
  return Array.from({ length: count }).map((_, index) => {
    const zipSeed = baseSeed + index;
    const zipNum = 10000 + Math.floor(Math.random() * 89999);
    
    // Calculate a consistent random value based on the zip code
    const consistentRandom = (zipNum % 10000) / 10000;
    
    // Create urbanicity distribution (50% suburban, 30% urban, 20% rural)
    let zipUrbanicity: 'Urban' | 'Suburban' | 'Rural' = 'Suburban';
    if (consistentRandom < 0.3) {
      zipUrbanicity = 'Urban';
    } else if (consistentRandom > 0.8) {
      zipUrbanicity = 'Rural';
    }
    
    // Filter by urbanicity if specified
    if (urbanicity !== 'All' && zipUrbanicity !== urbanicity) {
      // Skip this entry if it doesn't match the filter
      return null as unknown as ZIPCodeData;
    }
    
    // Base values that will be modified by filters
    const baseNetWorth = 1 + Math.random() * 9; // 1M to 10M
    const baseOpportunity = 1 + Math.random() * 14; // 1M to 15M
    const baseDivorceRate = (2 + Math.random() * 8) / 100; // 2% to 10%
    
    // Adjust values based on filter settings
    let netWorth = baseNetWorth;
    let opportunity = baseOpportunity;
    let divorceRate = baseDivorceRate;
    
    // Net worth filter
    if (netWorth < netWorthRange[0] || netWorth > netWorthRange[1]) {
      // Adjust to fit within range
      netWorth = netWorthRange[0] + Math.random() * (netWorthRange[1] - netWorthRange[0]);
    }
    
    // Divorce rate filter
    if (divorceRate < divorceRateThreshold / 100) {
      // Adjust to meet minimum threshold
      divorceRate = divorceRateThreshold / 100 + Math.random() * 0.05; // Up to 5% above threshold
    }
    
    // Calculate total addressable market (TAM) as a function of net worth and divorce rate
    const tam = Math.round((netWorth * 10) * (1 + divorceRate * 10));
    
    // Calculate serviceable addressable market (SAM) as a subset of TAM
    const sam = Math.round(tam * (0.5 + Math.random() * 0.3)); // 50-80% of TAM
    
    // Adjust opportunity based on competitors
    opportunity = tam * divorceRate / (competitorCount + 1);
    
    return {
      zipCode: zipNum.toString(),
      city: cityName || randomCity(consistentRandom, stateName || 'CA'),
      state: stateName || randomState(consistentRandom),
      urbanicity: zipUrbanicity,
      divorceRate,
      netWorth,
      opportunity,
      tam,
      sam
    };
  }).filter(Boolean) as ZIPCodeData[];
}

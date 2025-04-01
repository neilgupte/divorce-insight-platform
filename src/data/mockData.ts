// Mock data for the platform

// US States for filters and maps
export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

// Top cities by state for filters
export const TOP_CITIES: Record<string, string[]> = {
  "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
  "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
  "Arizona": ["Phoenix", "Tucson", "Mesa", "Scottsdale", "Chandler", "Sedona"],
  "Arkansas": ["Little Rock", "Fayetteville", "Fort Smith", "Springdale", "Jonesboro"],
  "California": ["Los Angeles", "San Francisco", "San Diego", "Beverly Hills", "Malibu", "Newport Beach", "Palo Alto", "San Jose", "Sacramento"],
  "Colorado": ["Denver", "Boulder", "Colorado Springs", "Aspen", "Vail", "Fort Collins"],
  "Connecticut": ["Hartford", "New Haven", "Stamford", "Greenwich", "Westport", "Darien"],
  "Delaware": ["Wilmington", "Dover", "Newark", "Rehoboth Beach", "Lewes"],
  "Florida": ["Miami", "Palm Beach", "Naples", "Boca Raton", "Key Biscayne", "Jupiter Island", "Orlando", "Tampa", "Jacksonville"],
  "Georgia": ["Atlanta", "Savannah", "Augusta", "Athens", "Marietta", "Sea Island"],
  "Hawaii": ["Honolulu", "Kahului", "Hilo", "Kailua", "Lahaina", "Kauai"],
  "Idaho": ["Boise", "Coeur d'Alene", "Idaho Falls", "Sun Valley", "Sandpoint"],
  "Illinois": ["Chicago", "Naperville", "Evanston", "Lake Forest", "Winnetka", "Highland Park"],
  "New York": ["New York City", "Hamptons", "Scarsdale", "Great Neck", "Bronxville", "Rye", "Buffalo", "Albany", "Syracuse"],
  "Texas": ["Dallas", "Houston", "Austin", "San Antonio", "Highland Park", "The Woodlands", "Fort Worth", "Plano", "El Paso"],
  "Massachusetts": ["Boston", "Cambridge", "Newton", "Weston", "Lexington"],
  "New Jersey": ["Newark", "Jersey City", "Princeton", "Short Hills", "Alpine"],
  "Washington": ["Seattle", "Bellevue", "Medina", "Mercer Island", "Spokane"],
  "Nevada": ["Las Vegas", "Reno", "Henderson", "Incline Village", "Carson City"],
  "Virginia": ["Richmond", "Virginia Beach", "McLean", "Alexandria", "Great Falls"],
  "Pennsylvania": ["Philadelphia", "Pittsburgh", "Bryn Mawr", "Gladwyne", "Sewickley Heights"],
  "North Carolina": ["Charlotte", "Raleigh", "Chapel Hill", "Asheville", "Cary"],
  "Maryland": ["Baltimore", "Bethesda", "Potomac", "Chevy Chase", "Annapolis"],
  "Michigan": ["Detroit", "Ann Arbor", "Bloomfield Hills", "Grosse Pointe", "Birmingham"],
  "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Shaker Heights", "Hudson"]
};

// Net worth brackets for filters
export const NET_WORTH_BRACKETS = [
  "All",
  "$1M - $5M",
  "$5M - $10M",
  "$10M - $50M",
  "$50M - $100M",
  "$100M+"
];

// Regional metrics data for dashboard
export const REGIONAL_METRICS = [
  { region: "Northeast", avgNetWorth: 18500000, divorceRate: 5.2, luxuryDensity: 8.7 },
  { region: "Southeast", avgNetWorth: 12000000, divorceRate: 6.8, luxuryDensity: 5.4 },
  { region: "Midwest", avgNetWorth: 7800000, divorceRate: 4.1, luxuryDensity: 3.2 },
  { region: "Southwest", avgNetWorth: 10500000, divorceRate: 5.6, luxuryDensity: 4.6 },
  { region: "West", avgNetWorth: 22000000, divorceRate: 6.2, luxuryDensity: 7.8 },
  { region: "Northwest", avgNetWorth: 13400000, divorceRate: 4.5, luxuryDensity: 5.1 },
];

// Top 5 luxury property locations
export const TOP_LUXURY_LOCATIONS = [
  { city: "Beverly Hills, CA", density: 12.4, avgValue: "$6.5M", highNetWorthRatio: 0.72 },
  { city: "Manhattan, NY", density: 10.8, avgValue: "$7.2M", highNetWorthRatio: 0.68 },
  { city: "Miami Beach, FL", density: 9.3, avgValue: "$5.1M", highNetWorthRatio: 0.64 },
  { city: "Aspen, CO", density: 8.7, avgValue: "$8.3M", highNetWorthRatio: 0.81 },
  { city: "Greenwich, CT", density: 7.9, avgValue: "$5.7M", highNetWorthRatio: 0.69 },
];

// AI Insights for dashboard
export const AI_INSIGHTS = [
  { 
    id: 1,
    title: "Divorce Rate Anomaly",
    description: "Palm Beach County has 2.5x more contested divorces than the national average with cases lasting 50% longer.",
    severity: "high",
    trend: "increasing"
  },
  { 
    id: 2,
    title: "Asset Protection Pattern",
    description: "Pre-divorce asset transfers to LLCs increased 40% in Miami-Dade over the past quarter.",
    severity: "medium",
    trend: "increasing"
  },
  { 
    id: 3,
    title: "Net Worth Correlation",
    description: "Households with 3+ luxury vehicles show 28% higher divorce filing rates in Orange County.",
    severity: "medium",
    trend: "stable"
  },
  { 
    id: 4,
    title: "Geographic Insight",
    description: "Northwest Montana showing unexpected 67% increase in high-net-worth divorce filings year-over-year.",
    severity: "high", 
    trend: "increasing"
  },
];

// Chart data for location analyzer
export const HISTORICAL_DIVORCE_RATES = [
  { year: 2014, rate: 4.2 },
  { year: 2015, rate: 4.5 },
  { year: 2016, rate: 4.8 },
  { year: 2017, rate: 5.1 },
  { year: 2018, rate: 5.5 },
  { year: 2019, rate: 5.8 },
  { year: 2020, rate: 5.6 },
  { year: 2021, rate: 5.9 },
  { year: 2022, rate: 6.2 },
  { year: 2023, rate: 6.5 },
];

export const LUXURY_REAL_ESTATE = [
  { priceRange: "$1M-$2M", count: 145 },
  { priceRange: "$2M-$5M", count: 87 },
  { priceRange: "$5M-$10M", count: 42 },
  { priceRange: "$10M-$20M", count: 18 },
  { priceRange: "$20M+", count: 8 },
];

export const MULTI_PROPERTY_HOUSEHOLDS = [
  { properties: "2 Properties", households: 1250 },
  { properties: "3 Properties", households: 750 },
  { properties: "4 Properties", households: 320 },
  { properties: "5+ Properties", households: 180 },
];

// Sample documents for document vault
export const SAMPLE_DOCUMENTS = [
  {
    id: "doc-001",
    name: "Smith Asset Analysis.pdf",
    type: "PDF",
    size: "4.2 MB",
    uploadDate: "2023-11-15",
    tags: ["California", "Los Angeles", "Ultra-high net worth", "Real estate"],
    uploadedBy: "Admin User",
  },
  {
    id: "doc-002",
    name: "Johnson Holdings Report.docx",
    type: "Document",
    size: "2.7 MB",
    uploadDate: "2023-10-22",
    tags: ["New York", "Investment", "Offshore assets"],
    uploadedBy: "Jessica Chen",
  },
  {
    id: "doc-003",
    name: "Miami Property Valuations.xlsx",
    type: "Spreadsheet", 
    size: "3.1 MB",
    uploadDate: "2023-09-18",
    tags: ["Florida", "Miami", "Real estate", "Valuation"],
    uploadedBy: "Michael Brown",
  },
  {
    id: "doc-004",
    name: "Tech Founder Stock Options.pdf",
    type: "PDF",
    size: "5.8 MB", 
    uploadDate: "2023-12-01",
    tags: ["California", "San Francisco", "Tech", "Stock options"],
    uploadedBy: "Admin User",
  },
  {
    id: "doc-005",
    name: "Dallas Private Club Membership List.xlsx",
    type: "Spreadsheet",
    size: "1.9 MB",
    uploadDate: "2023-11-05",
    tags: ["Texas", "Dallas", "Private clubs", "Social connections"],
    uploadedBy: "Robert Johnson",
  },
];

// Sample users for user management
export const USERS = [
  {
    id: "user-001",
    name: "Admin User",
    email: "admin@example.com",
    role: "superuser",
    permissions: ["all"],
    status: "active",
    lastLogin: "2023-12-02 09:34 AM",
    createdAt: "2022-10-15",
  },
  {
    id: "user-002",
    name: "Jessica Chen",
    email: "jessica@example.com",
    role: "user",
    permissions: ["dashboard:view", "location:view", "reports:view", "documents:view"],
    status: "active",
    lastLogin: "2023-12-01 03:15 PM",
    createdAt: "2023-01-20",
  },
  {
    id: "user-003",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "user",
    permissions: ["dashboard:view", "location:view", "reports:view"],
    status: "inactive",
    lastLogin: "2023-11-21 11:42 AM",
    createdAt: "2023-02-10",
  },
  {
    id: "user-004",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "user",
    permissions: ["dashboard:view", "location:view"],
    status: "active",
    lastLogin: "2023-12-01 10:08 AM",
    createdAt: "2023-03-15",
  },
];

// Sample user activity log
export const USER_ACTIVITY = [
  {
    id: "log-001",
    userId: "user-001",
    userName: "Admin User",
    action: "Login",
    details: "Successful login from 192.168.1.1",
    timestamp: "2023-12-02 09:34 AM",
  },
  {
    id: "log-002",
    userId: "user-002",
    userName: "Jessica Chen",
    action: "Document Upload",
    details: "Uploaded 'Johnson Holdings Report.docx'",
    timestamp: "2023-12-01 03:25 PM",
  },
  {
    id: "log-003",
    userId: "user-001",
    userName: "Admin User",
    action: "User Creation",
    details: "Created new user 'robert@example.com'",
    timestamp: "2023-12-01 01:17 PM",
  },
  {
    id: "log-004",
    userId: "user-003",
    userName: "Michael Brown",
    action: "Report Access",
    details: "Generated PDF report for Palm Beach",
    timestamp: "2023-11-30 02:42 PM",
  },
  {
    id: "log-005",
    userId: "user-004",
    userName: "Robert Johnson",
    action: "Location Analysis",
    details: "Analyzed location data for Dallas, TX",
    timestamp: "2023-12-01 10:15 AM",
  },
];

// AI Assistant sample responses
export const AI_SAMPLE_RESPONSES = [
  {
    id: 1,
    query: "Show me counties in Florida with the highest rate of asset protection cases",
    response: "Analyzing data for Florida counties:\n\n1. Palm Beach County: 34.2% of cases\n2. Miami-Dade County: 28.7% of cases\n3. Collier County (Naples): 22.5% of cases\n4. Broward County: 17.3% of cases\n5. Orange County: 14.8% of cases\n\nWould you like me to generate a visualization of this data?"
  },
  {
    id: 2,
    query: "Compare Palm Beach, FL to Marin County, CA",
    response: "Comparison between Palm Beach, FL and Marin County, CA:\n\nDivorce Rate:\nPalm Beach: 6.8 per 1,000 households\nMarin County: 5.2 per 1,000 households\n\nAverage Net Worth:\nPalm Beach: $22.5M\nMarin County: $18.7M\n\nLuxury Real Estate:\nPalm Beach: 532 properties above $5M\nMarin County: 467 properties above $5M\n\nPrivate Transportation Access:\nPalm Beach: 3 private airports, 5 marinas\nMarin County: 1 private airport, 3 marinas\n\nWould you like me to generate a detailed report comparing these locations?"
  }
];

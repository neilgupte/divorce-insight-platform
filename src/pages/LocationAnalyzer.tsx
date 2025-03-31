
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  US_STATES, 
  TOP_CITIES, 
  HISTORICAL_DIVORCE_RATES,
  LUXURY_REAL_ESTATE,
  MULTI_PROPERTY_HOUSEHOLDS 
} from "@/data/mockData";
import { 
  Search, 
  ChevronRight,
  MapPin, 
  Building, 
  Home, 
  Car, 
  Plane, 
  ShoppingBag,
  Hotel,
  ArrowRightLeft,
  PlusCircle,
  Save,
  Map as MapIcon
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { toast } from "sonner";

// For the comparison feature
interface LocationData {
  name: string;
  divorceRate: number;
  avgNetWorth: number;
  luxuryDensity: number;
  multiPropertyRate: number;
  exclusiveClubs: number;
  privateTransport: number;
  luxuryRetail: number;
  retailPresence: "Low" | "Medium" | "High";
}

// Sample location data for selected locations
const locationData: Record<string, LocationData> = {
  "New York City": {
    name: "New York City",
    divorceRate: 6.8,
    avgNetWorth: 27500000,
    luxuryDensity: 9.7,
    multiPropertyRate: 42,
    exclusiveClubs: 24,
    privateTransport: 8,
    luxuryRetail: 87,
    retailPresence: "High",
  },
  "Los Angeles": {
    name: "Los Angeles",
    divorceRate: 7.2,
    avgNetWorth: 23800000,
    luxuryDensity: 8.3,
    multiPropertyRate: 38,
    exclusiveClubs: 18,
    privateTransport: 12,
    luxuryRetail: 76,
    retailPresence: "High",
  },
  "Miami": {
    name: "Miami",
    divorceRate: 8.1,
    avgNetWorth: 21300000,
    luxuryDensity: 7.8,
    multiPropertyRate: 47,
    exclusiveClubs: 15,
    privateTransport: 10,
    luxuryRetail: 65,
    retailPresence: "Medium",
  },
  "San Francisco": {
    name: "San Francisco",
    divorceRate: 5.9,
    avgNetWorth: 32100000,
    luxuryDensity: 8.9,
    multiPropertyRate: 36,
    exclusiveClubs: 16,
    privateTransport: 9,
    luxuryRetail: 72,
    retailPresence: "High",
  },
  "Chicago": {
    name: "Chicago",
    divorceRate: 6.2,
    avgNetWorth: 19700000,
    luxuryDensity: 6.8,
    multiPropertyRate: 31,
    exclusiveClubs: 13,
    privateTransport: 7,
    luxuryRetail: 58,
    retailPresence: "Medium",
  },
  "Palm Beach": {
    name: "Palm Beach",
    divorceRate: 7.8,
    avgNetWorth: 24900000,
    luxuryDensity: 9.2,
    multiPropertyRate: 53,
    exclusiveClubs: 21,
    privateTransport: 14,
    luxuryRetail: 68,
    retailPresence: "High",
  },
  "Austin": {
    name: "Austin",
    divorceRate: 5.4,
    avgNetWorth: 18500000,
    luxuryDensity: 5.8,
    multiPropertyRate: 29,
    exclusiveClubs: 10,
    privateTransport: 6,
    luxuryRetail: 48,
    retailPresence: "Medium",
  },
  "Boston": {
    name: "Boston",
    divorceRate: 5.1,
    avgNetWorth: 22800000,
    luxuryDensity: 7.2,
    multiPropertyRate: 33,
    exclusiveClubs: 14,
    privateTransport: 8,
    luxuryRetail: 61,
    retailPresence: "Medium",
  },
  "Seattle": {
    name: "Seattle",
    divorceRate: 4.8,
    avgNetWorth: 20600000,
    luxuryDensity: 6.5,
    multiPropertyRate: 28,
    exclusiveClubs: 11,
    privateTransport: 5,
    luxuryRetail: 54,
    retailPresence: "Low",
  },
};

// Color array for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Amenity types
const AMENITY_TYPES = [
  "Private Club",
  "Private Aviation",
  "Luxury Retail",
  "5-Star Hotel",
  "Golf Course",
  "Marina",
  "Spa & Wellness",
  "Fine Dining",
  "Art Gallery",
  "Exclusive School"
];

// Define zod schema for amenity form
const amenitySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.string().min(1, { message: "Please select an amenity type" }),
  region: z.string().min(2, { message: "Region must be at least 2 characters" }),
  notes: z.string().optional(),
});

// Define zod schema for scoring profile
const scoringProfileSchema = z.object({
  profileName: z.string().min(2, { message: "Profile name must be at least 2 characters" }),
});

// Sample amenities data
const initialAmenities = [
  { id: 1, name: "The Metropolitan Club", type: "Private Club", region: "Upper East Side", notes: "Founded in 1891, exclusive membership" },
  { id: 2, name: "Teterboro Airport", type: "Private Aviation", region: "New Jersey", notes: "Major private jet hub for NYC" },
  { id: 3, name: "Fifth Avenue Shops", type: "Luxury Retail", region: "Midtown", notes: "High concentration of luxury brands" },
  { id: 4, name: "The Plaza Hotel", type: "5-Star Hotel", region: "Central Park South", notes: "Historic luxury accommodation" },
];

const LocationAnalyzer = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // For comparison view
  const [isComparisonView, setIsComparisonView] = useState<boolean>(false);
  const [location1, setLocation1] = useState<string>("New York City");
  const [location2, setLocation2] = useState<string>("Miami");
  
  // For map dialog
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  
  // For amenities
  const [amenities, setAmenities] = useState(initialAmenities);
  const [isAmenityDialogOpen, setIsAmenityDialogOpen] = useState<boolean>(false);
  
  // For weighted scoring
  const [weights, setWeights] = useState({
    netWorth: 30,
    divorceRate: 25,
    luxuryDensity: 20,
    multiProperty: 10,
    exclusiveClubs: 5,
    privateTransport: 5,
    luxuryRetail: 5,
  });
  
  // For scoring profiles
  const [isSaveProfileOpen, setIsSaveProfileOpen] = useState<boolean>(false);

  // Forms setup
  const amenityForm = useForm<z.infer<typeof amenitySchema>>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      name: "",
      type: "",
      region: "",
      notes: "",
    },
  });
  
  const profileForm = useForm<z.infer<typeof scoringProfileSchema>>({
    resolver: zodResolver(scoringProfileSchema),
    defaultValues: {
      profileName: "",
    },
  });

  // Filter cities based on selected state
  const availableCities = selectedState !== "All States" && TOP_CITIES[selectedState] 
    ? ["All Cities", ...TOP_CITIES[selectedState]] 
    : ["All Cities"];

  // Locations for comparison (in reality, this would be dynamically generated)
  const locationOptions = Object.keys(locationData);

  // Generate radar chart data for comparison
  const generateComparisonData = (location: string) => {
    const data = locationData[location];
    if (!data) return [];
    
    return [
      { subject: 'Divorce Rate', A: data.divorceRate, fullMark: 10 },
      { subject: 'Net Worth', A: data.avgNetWorth / 5000000, fullMark: 10 },
      { subject: 'Luxury Density', A: data.luxuryDensity, fullMark: 10 },
      { subject: 'Multi-Property', A: data.multiPropertyRate / 10, fullMark: 10 },
      { subject: 'Exclusive Clubs', A: data.exclusiveClubs / 3, fullMark: 10 },
      { subject: 'Private Transport', A: data.privateTransport / 2, fullMark: 10 },
      { subject: 'Luxury Retail', A: data.luxuryRetail / 10, fullMark: 10 },
    ];
  };

  // Calculate weighted score for a location
  const calculateScore = (location: string) => {
    const data = locationData[location];
    if (!data) return 0;
    
    const score = 
      (data.avgNetWorth / 5000000) * (weights.netWorth / 100) + 
      data.divorceRate * (weights.divorceRate / 100) + 
      data.luxuryDensity * (weights.luxuryDensity / 100) + 
      (data.multiPropertyRate / 10) * (weights.multiProperty / 100) + 
      (data.exclusiveClubs / 3) * (weights.exclusiveClubs / 100) + 
      (data.privateTransport / 2) * (weights.privateTransport / 100) + 
      (data.luxuryRetail / 10) * (weights.luxuryRetail / 100);
    
    return score.toFixed(2);
  };

  // Calculate individual scores for each metric
  const getIndividualScores = (location: string) => {
    const data = locationData[location];
    if (!data) return {};
    
    return {
      netWorth: ((data.avgNetWorth / 5000000) * 10).toFixed(1),
      divorceRate: (data.divorceRate).toFixed(1),
      luxuryDensity: (data.luxuryDensity).toFixed(1),
      multiProperty: ((data.multiPropertyRate / 10)).toFixed(1),
      exclusiveClubs: ((data.exclusiveClubs / 3) * 10).toFixed(1),
      privateTransport: ((data.privateTransport / 2) * 10).toFixed(1),
      luxuryRetail: ((data.luxuryRetail / 10) * 10).toFixed(1),
    };
  };

  // Generate side-by-side comparison data
  const comparisonData = [
    {
      name: "Divorce Rate",
      [location1]: locationData[location1]?.divorceRate,
      [location2]: locationData[location2]?.divorceRate,
    },
    {
      name: "Avg Net Worth (M)",
      [location1]: locationData[location1]?.avgNetWorth / 1000000,
      [location2]: locationData[location2]?.avgNetWorth / 1000000,
    },
    {
      name: "Luxury Density",
      [location1]: locationData[location1]?.luxuryDensity,
      [location2]: locationData[location2]?.luxuryDensity,
    },
    {
      name: "Multi-Property %",
      [location1]: locationData[location1]?.multiPropertyRate,
      [location2]: locationData[location2]?.multiPropertyRate,
    },
    {
      name: "Exclusive Clubs",
      [location1]: locationData[location1]?.exclusiveClubs,
      [location2]: locationData[location2]?.exclusiveClubs,
    },
    {
      name: "Private Transport",
      [location1]: locationData[location1]?.privateTransport,
      [location2]: locationData[location2]?.privateTransport,
    },
    {
      name: "Luxury Retail",
      [location1]: locationData[location1]?.luxuryRetail,
      [location2]: locationData[location2]?.luxuryRetail,
    },
  ];
  
  // Function to handle amenity submission
  const onAmenitySubmit = (values: z.infer<typeof amenitySchema>) => {
    const newAmenity = {
      id: amenities.length + 1,
      ...values,
    };
    
    setAmenities([...amenities, newAmenity]);
    setIsAmenityDialogOpen(false);
    amenityForm.reset();
    
    toast.success("New amenity added successfully");
  };
  
  // Function to handle profile save
  const onProfileSave = (values: z.infer<typeof scoringProfileSchema>) => {
    toast.success(`Scoring profile "${values.profileName}" saved successfully`);
    setIsSaveProfileOpen(false);
    profileForm.reset();
  };
  
  // Get the selected location data
  const selectedLocationData = useMemo(() => {
    if (selectedCity !== "All Cities") {
      return locationData[selectedCity] || null;
    }
    return null;
  }, [selectedCity]);
  
  // Calculate individual scores for the selected location
  const individualScores = useMemo(() => {
    if (selectedCity !== "All Cities") {
      return getIndividualScores(selectedCity);
    }
    return null;
  }, [selectedCity]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze high-net-worth divorce patterns by location
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsComparisonView(!isComparisonView)}
            className="flex items-center"
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            {isComparisonView ? "Single Location View" : "Comparison View"}
          </Button>
          
          <Button 
            variant="default" 
            onClick={() => setIsMapOpen(true)}
            className="flex items-center"
          >
            <MapIcon className="mr-2 h-4 w-4" />
            View on Map
          </Button>
        </div>
      </div>

      {!isComparisonView ? (
        <>
          {/* Search and Filter Section */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search locations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All States">All States</SelectItem>
                {US_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
            {/* Location Info Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  {selectedCity !== "All Cities" ? selectedCity : selectedState !== "All States" ? selectedState : "United States"}
                </CardTitle>
                <CardDescription>
                  High-net-worth divorce insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">Divorce Rate:</span>
                    <span className="font-medium">
                      {selectedLocationData ? `${selectedLocationData.divorceRate}%` : "6.2%"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">Avg. Net Worth:</span>
                    <span className="font-medium">
                      ${selectedLocationData 
                        ? (selectedLocationData.avgNetWorth / 1000000).toFixed(1) + "M" 
                        : "18.5M"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">Luxury Property Density:</span>
                    <span className="font-medium">
                      {selectedLocationData ? `${selectedLocationData.luxuryDensity}/km²` : "7.3/km²"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">Multi-Property Households:</span>
                    <span className="font-medium">
                      {selectedLocationData ? `${selectedLocationData.multiPropertyRate}%` : "36%"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">Exclusive Clubs:</span>
                    <span className="font-medium">
                      {selectedLocationData ? selectedLocationData.exclusiveClubs : 12}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">Private Transport Hubs:</span>
                    <span className="font-medium">
                      {selectedLocationData ? selectedLocationData.privateTransport : 7}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-sm text-muted-foreground">High-End Retail Presence:</span>
                    <span className="font-medium">
                      {selectedLocationData ? selectedLocationData.retailPresence : "Medium"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Area */}
            <div className="md:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Divorce Rate</CardTitle>
                  <CardDescription>
                    High-net-worth divorce trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={HISTORICAL_DIVORCE_RATES}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis label={{ value: "Rate %", angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="rate" stroke="#3B82F6" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Luxury Real Estate</CardTitle>
                    <CardDescription>
                      Distribution by price range
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={LUXURY_REAL_ESTATE}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="priceRange" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Property Households</CardTitle>
                    <CardDescription>
                      Households owning multiple properties
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={MULTI_PROPERTY_HOUSEHOLDS}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="households"
                            nameKey="properties"
                            label
                          >
                            {MULTI_PROPERTY_HOUSEHOLDS.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Amenities and Services */}
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Exclusive Amenities</CardTitle>
                  <CardDescription>
                    High-end services and venues in the area
                  </CardDescription>
                </div>
                <Dialog open={isAmenityDialogOpen} onOpenChange={setIsAmenityDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Amenity
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Amenity</DialogTitle>
                      <DialogDescription>
                        Enter details about the exclusive amenity in this location.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...amenityForm}>
                      <form onSubmit={amenityForm.handleSubmit(onAmenitySubmit)} className="space-y-4">
                        <FormField
                          control={amenityForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="The Ritz-Carlton" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={amenityForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {AMENITY_TYPES.map(type => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={amenityForm.control}
                          name="region"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Region</FormLabel>
                              <FormControl>
                                <Input placeholder="Downtown" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={amenityForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Additional details about this amenity..."
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit">Add Amenity</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-start space-x-3 rounded-md border p-3">
                      {amenity.type === "Private Club" && <Building className="h-5 w-5 text-primary mt-0.5" />}
                      {amenity.type === "Private Aviation" && <Plane className="h-5 w-5 text-primary mt-0.5" />}
                      {amenity.type === "Luxury Retail" && <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />}
                      {amenity.type === "5-Star Hotel" && <Hotel className="h-5 w-5 text-primary mt-0.5" />}
                      <div>
                        <p className="text-sm font-medium">{amenity.name}</p>
                        <p className="text-xs text-muted-foreground">{amenity.type} • {amenity.region}</p>
                        {amenity.notes && <p className="text-xs mt-1">{amenity.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weighted Score System */}
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Weighted Scoring System</CardTitle>
                  <CardDescription>
                    Customize weights to prioritize different factors
                  </CardDescription>
                </div>
                <Dialog open={isSaveProfileOpen} onOpenChange={setIsSaveProfileOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Scoring Profile</DialogTitle>
                      <DialogDescription>
                        Save your current weight configuration for future use.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="profileName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Attorney View" {...field} />
                              </FormControl>
                              <FormDescription>
                                Give your scoring profile a meaningful name
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit">Save Profile</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Net Worth ({weights.netWorth}%)</Label>
                      {individualScores && <span className="text-sm font-medium">Score: {individualScores.netWorth}/10</span>}
                    </div>
                    <Slider
                      value={[weights.netWorth]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setWeights({...weights, netWorth: value[0]})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Divorce Rate ({weights.divorceRate}%)</Label>
                      {individualScores && <span className="text-sm font-medium">Score: {individualScores.divorceRate}/10</span>}
                    </div>
                    <Slider
                      value={[weights.divorceRate]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setWeights({...weights, divorceRate: value[0]})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Luxury Property Density ({weights.luxuryDensity}%)</Label>
                      {individualScores && <span className="text-sm font-medium">Score: {individualScores.luxuryDensity}/10</span>}
                    </div>
                    <Slider
                      value={[weights.luxuryDensity]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setWeights({...weights, luxuryDensity: value[0]})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Multi-Property Households ({weights.multiProperty}%)</Label>
                      {individualScores && <span className="text-sm font-medium">Score: {individualScores.multiProperty}/10</span>}
                    </div>
                    <Slider
                      value={[weights.multiProperty]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setWeights({...weights, multiProperty: value[0]})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Exclusive Clubs ({weights.exclusiveClubs}%)</Label>
                      {individualScores && <span className="text-sm font-medium">Score: {individualScores.exclusiveClubs}/10</span>}
                    </div>
                    <Slider
                      value={[weights.exclusiveClubs]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setWeights({...weights, exclusiveClubs: value[0]})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Private Transport ({weights.privateTransport}%)</Label>
                      {individualScores && <span className="text-sm font-medium">Score: {individualScores.privateTransport}/10</span>}
                    </div>
                    <Slider
                      value={[weights.privateTransport]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setWeights({...weights, privateTransport: value[0]})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Luxury Retail ({weights.luxuryRetail}%)</Label>
                      {individualScores && <span className="text-sm font-medium">Score: {individualScores.luxuryRetail}/10</span>}
                    </div>
                    <Slider
                      value={[weights.luxuryRetail]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setWeights({...weights, luxuryRetail: value[0]})}
                    />
                  </div>
                  
                  <div className="mt-6 rounded-md bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Weighted Score:</span>
                      <span className="text-lg font-bold">
                        {selectedCity !== "All Cities" ? `${calculateScore(selectedCity)}/10` : "7.8/10"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Comparison View */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Location 1</label>
              <Select value={location1} onValueChange={setLocation1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location 1" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="rounded-lg bg-card p-4 shadow">
                <h3 className="mb-2 text-lg font-semibold">{location1}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Weighted Score:</span>
                    <span className="font-medium">{calculateScore(location1)} / 10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Divorce Rate:</span>
                    <span className="font-medium">{locationData[location1]?.divorceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Net Worth:</span>
                    <span className="font-medium">${(locationData[location1]?.avgNetWorth / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Location 2</label>
              <Select value={location2} onValueChange={setLocation2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location 2" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="rounded-lg bg-card p-4 shadow">
                <h3 className="mb-2 text-lg font-semibold">{location2}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Weighted Score:</span>
                    <span className="font-medium">{calculateScore(location2)} / 10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Divorce Rate:</span>
                    <span className="font-medium">{locationData[location2]?.divorceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Net Worth:</span>
                    <span className="font-medium">${(locationData[location2]?.avgNetWorth / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Side-by-Side Comparison</CardTitle>
                <CardDescription>
                  Direct comparison of key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={comparisonData}
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={location1} fill="#3B82F6" />
                      <Bar dataKey={location2} fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{location1} Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={generateComparisonData(location1)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar name={location1} dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{location2} Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={generateComparisonData(location2)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar name={location2} dataKey="A" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
      
      {/* Map Dialog */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Location Heatmap</DialogTitle>
            <DialogDescription>
              Interactive map showing key metrics across the United States
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            <div className="bg-muted mb-4 p-4 rounded-md flex justify-between items-center">
              <div className="flex gap-4">
                <Select defaultValue="divorceRate">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="divorceRate">Divorce Rate</SelectItem>
                    <SelectItem value="netWorth">Avg. Net Worth</SelectItem>
                    <SelectItem value="luxuryDensity">Luxury Density</SelectItem>
                    <SelectItem value="multiProperty">Multi-Property</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="All States">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All States">All States</SelectItem>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Low</span>
                <div className="w-32 h-3 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full"></div>
                <span className="text-sm">High</span>
              </div>
            </div>
            
            {/* Map Placeholder - In a real implementation, this would be an actual interactive map */}
            <div className="flex-1 bg-muted rounded-md flex items-center justify-center relative">
              <div className="absolute inset-0 p-4 text-white opacity-80 flex items-center justify-center">
                <div className="p-8 rounded-xl bg-background border text-center">
                  <MapIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground">This is where the interactive map would be displayed, showing heatmap data for the selected metric across U.S. states.</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationAnalyzer;

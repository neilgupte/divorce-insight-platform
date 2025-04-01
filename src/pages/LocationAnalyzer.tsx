import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import AdvancedMapOverlay from "@/components/map/AdvancedMapOverlay";
import LocationMap from "@/components/location-analyzer/LocationMap";
import AmenityForm from "@/components/location-analyzer/AmenityForm";
import { 
  MapPin, 
  Map, 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Plus, 
  Save,
  DollarSign,
  Info,
  MessageSquare
} from "lucide-react";
import { US_STATES, TOP_CITIES } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import DummyMapOverlay from "@/components/map/DummyMapOverlay";
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AIChatbot from "@/components/common/AIChatbot";
import ZIPCodeAnalysis from "@/components/location-analyzer/ZIPCodeAnalysis";

interface Amenity {
  id: number;
  name: string;
  type: string;
  region: string;
  notes: string;
}

const divorceRateData = [
  { year: "2014", rate: 3.8 },
  { year: "2015", rate: 4.2 },
  { year: "2016", rate: 4.0 },
  { year: "2017", rate: 3.6 },
  { year: "2018", rate: 3.9 },
  { year: "2019", rate: 4.3 },
  { year: "2020", rate: 4.5 },
  { year: "2021", rate: 5.1 },
  { year: "2022", rate: 5.6 },
  { year: "2023", rate: 5.8 },
];

const luxuryRealEstateData = [
  { category: "$1M-$2M", count: 145 },
  { category: "$2M-$5M", count: 87 },
  { category: "$5M-$10M", count: 43 },
  { category: "$10M-$20M", count: 18 },
  { category: "$20M+", count: 7 },
];

const multiPropertyData = [
  { name: "2 Properties", value: 45 },
  { name: "3 Properties", value: 28 },
  { name: "4 Properties", value: 15 },
  { name: "5+ Properties", value: 12 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const initialAmenities: Amenity[] = [
  { id: 1, name: "Everglades Club", type: "Private Club", region: "Palm Beach", notes: "Exclusive social club, invitation only" },
  { id: 2, name: "Teterboro Airport", type: "Private Aviation", region: "New Jersey", notes: "Major private jet hub for NYC area" },
  { id: 3, name: "Worth Avenue", type: "Luxury Retail", region: "Palm Beach", notes: "High-end shopping district" },
  { id: 4, name: "The Breakers Resort", type: "5-Star Hotel", region: "Palm Beach", notes: "Historic luxury resort" },
];

const LocationAnalyzer = () => {
  const { toast } = useToast();
  const [state, setState] = useState<string>("All States");
  const [city, setCity] = useState<string>("All Cities");
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [isAdvancedMapOpen, setIsAdvancedMapOpen] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
  const [newAmenity, setNewAmenity] = useState<Partial<Amenity>>({});
  const [scoringWeights, setScoringWeights] = useState({
    netWorth: 30,
    divorceRate: 25, 
    luxuryProperty: 20,
    multiProperty: 10,
    amenities: 15,
  });
  const [view, setView] = useState<"standard" | "comparison">("standard");
  const [competitorCount, setCompetitorCount] = useState<number>(3);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiChatPrompt, setAiChatPrompt] = useState("");
  const [divorceRateThreshold, setDivorceRateThreshold] = useState<number>(5.0);
  
  const availableCities = state !== "All States" && TOP_CITIES[state] 
    ? ["All Cities", ...TOP_CITIES[state]] 
    : ["All Cities"];
    
  const handleAddAmenity = () => {
    if (!newAmenity.name || !newAmenity.type || !newAmenity.region) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const amenityToAdd: Amenity = {
      id: Date.now(),
      name: newAmenity.name || "",
      type: newAmenity.type || "",
      region: newAmenity.region || "",
      notes: newAmenity.notes || "",
    };
    
    setAmenities([...amenities, amenityToAdd]);
    setNewAmenity({});
    setIsAmenityModalOpen(false);
    
    toast({
      title: "Amenity added",
      description: `"${amenityToAdd.name}" has been added to your amenities list.`,
    });
  };

  const calculateMetricScore = (value: number, max: number): number => {
    return ((value / max) * 10).toFixed(1) as unknown as number;
  };
  
  const getWeightedScore = (): number => {
    const scores = {
      netWorth: 8.4,
      divorceRate: 7.6,
      luxuryProperty: 9.2,
      multiProperty: 6.8,
      amenities: 8.9,
    };
    
    const weightedSum = Object.entries(scoringWeights).reduce((sum, [key, weight]) => {
      return sum + (scores[key as keyof typeof scores] * weight / 100);
    }, 0);
    
    return parseFloat(weightedSum.toFixed(1));
  };

  const calculateOpportunity = (): string => {
    const totalNetWorth = 142000000; // $142M (simulated total net worth)
    const divorceRate = 0.058; // 5.8% (from the mock data)
    
    const opportunity = totalNetWorth * divorceRate / (competitorCount + 1);
    
    if (opportunity >= 1000000) {
      return `$${(opportunity / 1000000).toFixed(1)}M`;
    } else if (opportunity >= 1000) {
      return `$${(opportunity / 1000).toFixed(1)}K`;
    } else {
      return `$${opportunity.toFixed(0)}`;
    }
  };

  const saveProfile = () => {
    toast({
      title: "Profile saved",
      description: "Your scoring profile has been saved as 'Attorney View'.",
    });
  };

  const handleAddCustomMetric = () => {
    setAiChatPrompt("I'd like to add a custom metric to my dashboard. For example, can you show me divorce rates by age group, or add a chart for rising asset transfers?");
    setIsAIChatOpen(true);
  };

  const handleAIAction = (actionType: string, data: any) => {
    console.log("AI Action:", actionType, data);
    // Future implementation: Handle the AI-generated custom metric
    toast({
      title: "Custom Metric Added",
      description: "Your custom metric has been added to the dashboard.",
    });
    setIsAIChatOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Location Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze and compare locations based on key divorce and wealth metrics
        </p>
      </div>
      
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All States">All States</SelectItem>
              {US_STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="w-40">
            <Label className="text-xs mb-1 block">Divorce Rate ({divorceRateThreshold}%+)</Label>
            <Slider
              value={[divorceRateThreshold]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={(value) => setDivorceRateThreshold(value[0])}
            />
          </div>
        </div>
      </div>

      <ZIPCodeAnalysis
        selectedState={state}
        selectedCity={city}
        netWorthRange={[1, 50]}
        divorceRateThreshold={divorceRateThreshold}
        usStates={US_STATES}
        availableCities={availableCities}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              <CardTitle>Location Summary</CardTitle>
            </div>
            <CardDescription>
              {city !== "All Cities" ? city : state !== "All States" ? state : "United States"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Divorce Rate</div>
                <div className="text-2xl font-bold">5.8%</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Avg. Net Worth</div>
                <div className="text-2xl font-bold">$14.2M</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Luxury Property</div>
                <div className="text-2xl font-bold">6.2/km²</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Multi-Property</div>
                <div className="text-2xl font-bold">38%</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exclusive Clubs & Transport</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>High-End Retail Presence</span>
                <span className="font-medium">High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <LineChartIcon className="mr-2 h-5 w-5" />
              <CardTitle>Historical Divorce Rate</CardTitle>
            </div>
            <CardDescription>
              10-year trend for high-net-worth divorces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={divorceRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 'dataMax + 1']} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Divorce Rate']} />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              <CardTitle>Luxury Real Estate</CardTitle>
            </div>
            <CardDescription>
              Property distribution by price range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={luxuryRealEstateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5" />
              <CardTitle>Multi-Property Households</CardTitle>
            </div>
            <CardDescription>
              Distribution of property ownership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={multiPropertyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {multiPropertyData.map((entry, index) => (
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

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Exclusive Amenities</CardTitle>
              <CardDescription>
                High-end amenities in the selected location
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsAmenityModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Amenity
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {amenities.map((amenity) => (
                <Card key={amenity.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{amenity.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-2">{amenity.type}</span>
                          <span>•</span>
                          <span className="ml-2">{amenity.region}</span>
                        </div>
                      </div>
                    </div>
                    {amenity.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{amenity.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              <CardTitle>$ Opportunity</CardTitle>
            </div>
            <CardDescription>
              Potential market value in selected region
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md text-center">
              <div className="text-sm font-medium mb-1">Estimated Opportunity</div>
              <div className="text-3xl font-bold">{calculateOpportunity()}</div>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground cursor-help">
                      <Info className="h-3 w-3 mr-1" />
                      How is this calculated?
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>$ Opportunity = Total Regional Net Worth × Divorce Rate ÷ (Competitors + 1)</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="competitor-count">Competitor Count ({competitorCount})</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCompetitorCount(Math.max(0, competitorCount - 1))}
                  >
                    -
                  </Button>
                  <Input 
                    id="competitor-count"
                    type="number"
                    min="0"
                    value={competitorCount}
                    onChange={(e) => setCompetitorCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-center"
                  />
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setCompetitorCount(competitorCount + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center text-sm">
                <span>Net Worth (Simulated)</span>
                <span className="font-medium">$142M</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Divorce Rate</span>
                <span className="font-medium">5.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weighted Scoring System</CardTitle>
            <CardDescription>
              Customize weights to calculate location score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Net Worth ({scoringWeights.netWorth}%)</Label>
                  <span className="text-sm font-medium">Score: 8.4</span>
                </div>
                <Slider 
                  value={[scoringWeights.netWorth]} 
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setScoringWeights({ ...scoringWeights, netWorth: value[0] })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Divorce Rate ({scoringWeights.divorceRate}%)</Label>
                  <span className="text-sm font-medium">Score: 7.6</span>
                </div>
                <Slider 
                  value={[scoringWeights.divorceRate]} 
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setScoringWeights({ ...scoringWeights, divorceRate: value[0] })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Luxury Property ({scoringWeights.luxuryProperty}%)</Label>
                  <span className="text-sm font-medium">Score: 9.2</span>
                </div>
                <Slider 
                  value={[scoringWeights.luxuryProperty]} 
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setScoringWeights({ ...scoringWeights, luxuryProperty: value[0] })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Multi-Property ({scoringWeights.multiProperty}%)</Label>
                  <span className="text-sm font-medium">Score: 6.8</span>
                </div>
                <Slider 
                  value={[scoringWeights.multiProperty]} 
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setScoringWeights({ ...scoringWeights, multiProperty: value[0] })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Amenities ({scoringWeights.amenities}%)</Label>
                  <span className="text-sm font-medium">Score: 8.9</span>
                </div>
                <Slider 
                  value={[scoringWeights.amenities]} 
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setScoringWeights({ ...scoringWeights, amenities: value[0] })}
                />
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-md text-center">
              <div className="text-sm font-medium mb-1">Total Weighted Score</div>
              <div className="text-3xl font-bold">{getWeightedScore()} / 10</div>
            </div>
            
            <Button className="w-full" onClick={saveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Save Scoring Profile
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="flex flex-col items-center justify-center cursor-pointer border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={handleAddCustomMetric}
        >
          <CardContent className="flex flex-col items-center justify-center h-full py-10">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center font-medium">Add Custom Metric</p>
            <p className="text-center text-muted-foreground text-sm mt-2">
              Use AI to generate a custom metric card
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAIChatOpen} onOpenChange={setIsAIChatOpen}>
        <DialogContent className="sm:max-w-[500px] h-[500px] p-0 flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>AI Metric Generator</DialogTitle>
            <DialogDescription>
              Describe what kind of custom metric you'd like to create
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <AIChatbot 
              initialMessage="I'm ready to help you create a custom metric for your dashboard. What type of data would you like to visualize? For example, divorce rates by age group, asset transfers over time, or something else?"
              title="Metric Creator"
              onAction={handleAIAction}
              availableActions={[
                {
                  name: "Divorce by Age Group",
                  description: "Show divorce rates segmented by age",
                  handler: () => {
                    setAiChatPrompt("Show me divorce rates by age group");
                  }
                },
                {
                  name: "Asset Transfers",
                  description: "Visualize asset transfers over time",
                  handler: () => {
                    setAiChatPrompt("Add a chart for rising asset transfers");
                  }
                }
              ]}
            />
          </div>
        </DialogContent>
      </Dialog>

      <DummyMapOverlay
        open={isAdvancedMapOpen}
        onClose={() => setIsAdvancedMapOpen(false)}
        initialState={state !== "All States" ? state : null}
        initialCity={city !== "All Cities" ? city : null}
      />

      <Dialog open={isAmenityModalOpen} onOpenChange={setIsAmenityModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Amenity</DialogTitle>
            <DialogDescription>
              Enter details about the exclusive amenity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amenity-name">Name</Label>
              <Input 
                id="amenity-name" 
                placeholder="e.g., The Breakers Resort" 
                value={newAmenity.name || ""}
                onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amenity-type">Type</Label>
              <Select 
                value={newAmenity.type}
                onValueChange={(value) => setNewAmenity({ ...newAmenity, type: value })}
              >
                <SelectTrigger id="amenity-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private Club">Private Club</SelectItem>
                  <SelectItem value="Private Aviation">Private Aviation</SelectItem>
                  <SelectItem value="Luxury Retail">Luxury Retail</SelectItem>
                  <SelectItem value="5-Star Hotel">5-Star Hotel</SelectItem>
                  <SelectItem value="Golf Club">Golf Club</SelectItem>
                  <SelectItem value="Yacht Club">Yacht Club</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amenity-region">Region</Label>
              <Input 
                id="amenity-region" 
                placeholder="e.g., Palm Beach, Florida" 
                value={newAmenity.region || ""}
                onChange={(e) => setNewAmenity({ ...newAmenity, region: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amenity-notes">Notes</Label>
              <Textarea 
                id="amenity-notes" 
                placeholder="Additional information about this amenity" 
                value={newAmenity.notes || ""}
                onChange={(e) => setNewAmenity({ ...newAmenity, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAmenityModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAmenity}>
              Add Amenity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationAnalyzer;

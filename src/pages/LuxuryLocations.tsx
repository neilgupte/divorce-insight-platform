
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  MapPin, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Filter 
} from "lucide-react";
import MapView from "@/components/MapView";
import { TOP_LUXURY_LOCATIONS, US_STATES, TOP_CITIES } from "@/data/mockData";

const LuxuryLocations = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({ key: "density", direction: "descending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("list");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const itemsPerPage = 20;

  // Filter cities based on selected state
  const availableCities = selectedState !== "All States" && TOP_CITIES[selectedState] 
    ? ["All Cities", ...TOP_CITIES[selectedState]] 
    : ["All Cities"];

  useEffect(() => {
    if (location.state?.fromDashboard) {
      // Use any filters passed from the dashboard
    }
  }, [location]);

  // Filter locations based on search term and filters
  const filteredLocations = TOP_LUXURY_LOCATIONS.filter(location => {
    const matchesSearch = searchTerm 
      ? location.city.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesState = selectedState !== "All States"
      ? location.city.includes(selectedState)
      : true;
      
    const matchesCity = selectedCity !== "All Cities"
      ? location.city.includes(selectedCity)
      : true;
      
    return matchesSearch && matchesState && matchesCity;
  });

  // Sort locations
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    const key = sortConfig.key as keyof typeof a;
    if (a[key] < b[key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Paginate
  const paginatedLocations = sortedLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedLocations.length / itemsPerPage);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (location: any) => {
    setSelectedLocation(location);
    setActiveTab("details");
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Luxury Locations</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of high-net-worth properties across the United States
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          {selectedLocation && (
            <TabsTrigger value="details">Location Details</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Top Luxury Locations</CardTitle>
              <CardDescription>
                Showing {paginatedLocations.length} of {filteredLocations.length} locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => requestSort("city")}
                      >
                        <div className="flex items-center">
                          Location {getSortIcon("city")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort("density")}
                      >
                        <div className="flex items-center justify-end">
                          Density {getSortIcon("density")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => requestSort("avgValue")}
                      >
                        <div className="flex items-center justify-end">
                          Avg Value {getSortIcon("avgValue")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLocations.length > 0 ? (
                      paginatedLocations.map((location, index) => (
                        <TableRow 
                          key={index}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => handleRowClick(location)}
                        >
                          <TableCell className="font-medium">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                              {location.city}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {location.density}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                              {location.avgValue}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Luxury Locations Map</CardTitle>
              <CardDescription>
                Interactive map of high-net-worth property concentrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] rounded-md overflow-hidden">
                <MapView 
                  state={selectedState === "All States" ? null : selectedState} 
                  city={selectedCity === "All Cities" ? null : selectedCity}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          {selectedLocation && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{selectedLocation.city}</CardTitle>
                  <CardDescription>
                    Detailed metrics and insights for this location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Luxury Density</h3>
                        <p className="text-2xl font-bold">{selectedLocation.density}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Avg Property Value</h3>
                        <p className="text-2xl font-bold">{selectedLocation.avgValue}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Divorce Rate</h3>
                        <p className="text-2xl font-bold">5.8%</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Asset Protection Rate</h3>
                        <p className="text-2xl font-bold">42%</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">High-Net-Worth Households</h3>
                        <p className="text-2xl font-bold">3,240</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Luxury Amenities</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">Private Airports</Badge>
                          <Badge variant="secondary">Yacht Clubs</Badge>
                          <Badge variant="secondary">Golf Courses</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-2 text-lg font-medium">Location Trends</h3>
                    <div className="h-64">
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        Historical trend chart would appear here
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Map View</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <MapView 
                    state={selectedLocation.city.split(', ')[1]} 
                    city={selectedLocation.city.split(', ')[0]} 
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LuxuryLocations;

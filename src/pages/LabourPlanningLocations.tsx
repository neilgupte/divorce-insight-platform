
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusIcon, BuildingIcon, MapPinIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddLocationDialog from "@/components/labour-planning/AddLocationDialog";

const LabourPlanningLocations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);

  // Sample location data
  const locations = [
    {
      id: "1",
      name: "Downtown Store",
      type: "Restaurant",
      squareFootage: 4500,
      posCount: 8,
      hours: "7AM - 11PM",
      address: "123 Main St, Downtown, NY 10001",
      region: "Central"
    },
    {
      id: "2",
      name: "Westside Location",
      type: "Warehouse",
      squareFootage: 12800,
      posCount: 3,
      hours: "6AM - 8PM",
      address: "456 West Ave, Westside, NY 10002",
      region: "Western"
    },
    {
      id: "3",
      name: "North Mall",
      type: "Restaurant",
      squareFootage: 3200,
      posCount: 6,
      hours: "9AM - 9PM",
      address: "789 North Blvd, Northside, NY 10003",
      region: "Northern"
    },
    {
      id: "4",
      name: "East Side Branch",
      type: "Restaurant",
      squareFootage: 3800,
      posCount: 5,
      hours: "8AM - 10PM",
      address: "321 East St, Eastside, NY 10004",
      region: "Eastern"
    },
    {
      id: "5",
      name: "South Point",
      type: "Other",
      squareFootage: 5200,
      posCount: 4,
      hours: "7AM - 9PM",
      address: "654 South Ave, Southside, NY 10005",
      region: "Southern"
    }
  ];

  // Filter locations based on search query
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage your workforce locations and resource planning
          </p>
        </div>
        <Button 
          onClick={() => setShowAddLocationDialog(true)} 
          className="mt-4 sm:mt-0 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add New Location
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map(location => (
          <Card key={location.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BuildingIcon className="h-4 w-4" />
                {location.name}
              </CardTitle>
              <CardDescription>{location.type} • {location.region} Region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Square Footage:</span>
                  <span>{location.squareFootage.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">POS Systems:</span>
                  <span>{location.posCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hours:</span>
                  <span>{location.hours}</span>
                </div>
                <div className="flex items-start text-sm">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5 mr-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{location.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                <Button variant="default" size="sm" className="flex-1">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-12">
          <BuildingIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
          <h3 className="mt-4 text-lg font-medium">No locations found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? "No locations match your search criteria" 
              : "Start by adding your first location"}
          </p>
          <Button 
            onClick={() => setShowAddLocationDialog(true)} 
            className="mt-4"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add New Location
          </Button>
        </div>
      )}

      <AddLocationDialog 
        open={showAddLocationDialog} 
        onOpenChange={setShowAddLocationDialog} 
      />
    </div>
  );
};

export default LabourPlanningLocations;

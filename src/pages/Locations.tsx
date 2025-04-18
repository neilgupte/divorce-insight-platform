
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";
import LocationForm from "@/components/labour-planning/LocationForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Locations = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Locations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <LocationForm onSubmit={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">{location.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {location.address}
                  </CardDescription>
                </div>
                <div className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {location.type}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{location.size} sq ft</p>
                </div>
                <div>
                  <p className="text-muted-foreground">POS Systems</p>
                  <p className="font-medium">{location.posSystems}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hours</p>
                  <p className="font-medium">{location.hours}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Region</p>
                  <p className="font-medium">{location.region}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Sample data
const locations = [
  {
    id: 1,
    name: "Downtown Restaurant",
    type: "Restaurant",
    address: "123 Main St, Downtown",
    size: 3500,
    posSystems: 5,
    hours: "7AM - 10PM",
    region: "Central"
  },
  {
    id: 2,
    name: "Westside Branch",
    type: "Restaurant",
    address: "456 West Ave, Westside",
    size: 2800,
    posSystems: 3,
    hours: "11AM - 9PM",
    region: "West"
  },
  {
    id: 3,
    name: "Airport Terminal",
    type: "Restaurant",
    address: "Terminal 2, Airport Blvd",
    size: 1500,
    posSystems: 4,
    hours: "5AM - 11PM",
    region: "North"
  },
  {
    id: 4,
    name: "Central Warehouse",
    type: "Warehouse",
    address: "789 Industry Pkwy",
    size: 15000,
    posSystems: 2,
    hours: "24/7",
    region: "Central"
  },
  {
    id: 5,
    name: "Eastside Cafe",
    type: "Restaurant",
    address: "321 East Rd, Eastside",
    size: 1200,
    posSystems: 2,
    hours: "6AM - 4PM",
    region: "East"
  }
];

export default Locations;

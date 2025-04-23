
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

interface SearchLocationProps {
  onRunAnalysis: (location: string) => void;
}

const SearchLocation = ({ onRunAnalysis }: SearchLocationProps) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(10);
  const [storeType, setStoreType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location) {
      onRunAnalysis(location);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Location</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">ZIP Code or City/Town</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter ZIP code or city..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <Button type="button" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Search Radius: {radius} miles</Label>
              <Slider
                value={[radius]}
                min={5}
                max={50}
                step={5}
                onValueChange={([value]) => setRadius(value)}
                className="py-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>5 miles</span>
                <span>50 miles</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeType">Location Type</Label>
              <Select value={storeType} onValueChange={setStoreType}>
                <SelectTrigger id="storeType">
                  <SelectValue placeholder="Select location type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="distribution">Distribution Center</SelectItem>
                  <SelectItem value="office">Corporate Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/30">
              <p className="text-sm font-medium mb-2">Map Selection</p>
              <div className="bg-muted h-[250px] rounded-md flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click on the map to select a location
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="lg"
                disabled={!location}
              >
                Run Labour Market Scan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchLocation;

// src/components/network-optimization/NetworkDashboard.tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Zap,
  TrendingUp,
  SlidersHorizontal,
  MapPin,
  Building,
  Users,
  Clock,
  Network,
} from "lucide-react";

// —————— types ——————
interface Facility {
  id: string;
  name: string;
  type: string;
  workers: number;
  neededWorkers: number;
  utilisation: number;  // 0-1
  attrition: number;    // 0-1
  commuteTime: number;  // mins
  lat: number;
  lng: number;
}

interface Insight {
  id: string;
  type: "network" | "facility" | "scenario";
  title: string;
  description: string;
}

// —————— mock data ——————
const mockFacilities: Facility[] = [
  { id:"1", name:"Downtown Distribution Center", type:"Distribution", workers:145, neededWorkers:15, utilisation:0.91, attrition:0.12, commuteTime:28, lat:37.7749, lng:-122.4194 },
  { id:"2", name:"Eastside Fulfillment",         type:"Fulfillment",  workers:78,  neededWorkers:23, utilisation:0.77, attrition:0.18, commuteTime:35, lat:37.8044, lng:-122.2712 },
  { id:"3", name:"South Bay Storage",            type:"Storage",      workers:92,  neededWorkers:8,  utilisation:0.89, attrition:0.08, commuteTime:22, lat:37.3382, lng:-121.8863 },
  { id:"4", name:"North County Logistics",       type:"Logistics",    workers:112, neededWorkers:0,  utilisation:1.00, attrition:0.15, commuteTime:31, lat:38.1499, lng:-122.4569 },
  { id:"5", name:"Central Valley Distribution",  type:"Distribution", workers:65,  neededWorkers:30, utilisation:0.68, attrition:0.22, commuteTime:42, lat:37.9577, lng:-121.2908 },
];

const mockInsights: Insight[] = [
  { id:"i1", type:"network",  title:"High Attrition in Urban Facilities", description:"Urban facilities show 18% higher attrition rates compared to suburban locations. Consider offering enhanced transportation benefits or flexible scheduling options." },
  { id:"i2", type:"facility", title:"Workforce Gaps Analysis",          description:"Your network has a total shortage of 76 workers. Central Valley Distribution has the largest gap with 30 open positions to fill." },
  { id:"i3", type:"scenario", title:"Optimization Opportunity",         description:"Shifting 15% of workload from Central Valley to South Bay Storage could reduce overall commute times by 12% and increase network utilization efficiency by 7%." },
];

// —————— Mapbox token ——————
mapboxgl.accessToken = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOXBzbXI0eTFjdHoya3IwNng1ZTI4ZHoifQ.hgWIXnSx6HdRC67U2xhdxQ";

// —————— subcomponents ——————
const FacilityTable: React.FC<{
  facilities: Facility[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ facilities, selectedId, onSelect }) => {
  const [filter, setFilter] = useState("");
  const filtered = facilities.filter(f =>
    f.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Input
          placeholder="Search facilities…"
          value={filter}
          onChange={e => setFilter(e.currentTarget.value)}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility</TableHead>
              <TableHead className="text-right">Workers</TableHead>
              <TableHead className="text-right">Needed</TableHead>
              <TableHead className="text-right">Util.</TableHead>
              <TableHead className="text-right">Attr.</TableHead>
              <TableHead className="text-right">Commute</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(f => (
              <TableRow
                key={f.id}
                className={`cursor-pointer ${f.id === selectedId ? "bg-accent/20" : ""}`}
                onClick={() => onSelect(f.id)}
              >
                <TableCell>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.type}</div>
                </TableCell>
                <TableCell className="text-right">{f.workers}</TableCell>
                <TableCell className="text-right">{f.neededWorkers}</TableCell>
                <TableCell className={`text-right ${f.utilisation >= 0.9 ? "text-green-600" : "text-gray-600"}`}>
                  {(f.utilisation * 100).toFixed(0)}%
                </TableCell>
                <TableCell className={`text-right ${f.attrition >= 0.15 ? "text-red-600" : "text-gray-600"}`}>
                  {(f.attrition * 100).toFixed(0)}%
                </TableCell>
                <TableCell className="text-right">{f.commuteTime}m</TableCell>
              </TableRow>
            ))}
            {!filtered.length && (
              <TableRow>
                <TableCell colSpan={6} className="py-4 text-center text-sm text-muted-foreground">
                  No facilities found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const InsightsPanel: React.FC<{ insights: Insight[] }> = ({ insights }) => {
  const icons: Record<Insight["type"], JSX.Element> = {
    network: <Zap className="h-5 w-5 text-yellow-500" />,
    facility: <TrendingUp className="h-5 w-5 text-blue-500" />,
    scenario: <SlidersHorizontal className="h-5 w-5 text-green-500" />,
  };

  return (
    <div className="space-y-4">
      {insights.map(ins => (
        <Card key={ins.id} className="shadow-sm">
          <CardContent className="flex items-start space-x-4">
            {icons[ins.type]}
            <div>
              <h3 className="font-medium">{ins.title}</h3>
              <p className="text-sm text-muted-foreground">{ins.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// —————— main component ——————
const NetworkDashboard: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-122.2712, 37.8044],
      zoom: 9,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      // add circle layer for each facility
      mockFacilities.forEach(f => {
        const src = `circle-${f.id}`;
        map.addSource(src, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "Point", coordinates: [f.lng, f.lat] },
          },
        });
        map.addLayer({
          id: src,
          type: "circle",
          source: src,
          paint: {
            "circle-radius": 200,
            "circle-color": "rgba(66,135,245,0.2)",
            "circle-stroke-width": 1,
            "circle-stroke-color": "rgba(66,135,245,0.5)",
          },
        });

        // marker
        const el = document.createElement("div");
        el.className = "facility-marker";
        el.style.width = "12px";
        el.style.height = "12px";
        el.style.backgroundColor = "#4a90e2";
        el.style.border = "2px solid white";
        el.style.borderRadius = "50%";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker(el)
          .setLngLat([f.lng, f.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<strong>${f.name}</strong>`))
          .addTo(map);

        el.onclick = () => setSelectedId(f.id);
      });
    });

    return () => {
      map.remove();
      mapRef.current = undefined;
    };
  }, []);

  return (
    <div className="flex flex-col h-screen p-6 space-y-6">
      {/* header */}
      <div>
        <h1 className="text-3xl font-bold">Network Optimization</h1>
        <p className="text-muted-foreground">
          Optimize your facility network & workforce distribution
        </p>
      </div>

      {/* two-column split */}
      <div className="flex gap-6 flex-1">
        {/* left: map */}
        <div className="w-2/5 h-[900px]">
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Facility Network Map</CardTitle>
                {/* you can add your “expand” button here */}
                <Button variant="outline" size="icon">
                  <MapPin />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-3rem)]">
              <div ref={mapContainer} className="h-full w-full" />
            </CardContent>
          </Card>
        </div>

        {/* right: overview + insights */}
        <div className="w-3/5 flex flex-col gap-6">
          <Card className="h-[400px] overflow-hidden">
            <CardHeader>
              <CardTitle>Facility Overview</CardTitle>
              <CardDescription>
                {mockFacilities.length} facilities,{" "}
                {mockFacilities.reduce((a, f) => a + f.workers, 0)} workers total
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-3.5rem)]">
              <FacilityTable
                facilities={mockFacilities}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <InsightsPanel insights={mockInsights} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI summary pinned at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Total Facilities</CardTitle>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{mockFacilities.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockFacilities.filter((f) => f.utilisation >= 0.9).length} at high utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Workforce</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {mockFacilities.reduce((sum, f) => sum + f.workers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockFacilities.reduce((sum, f) => sum + f.neededWorkers, 0)} additional needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Avg Commute Time</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {Math.round(
                mockFacilities.reduce((sum, f) => sum + f.commuteTime, 0) /
                  mockFacilities.length
              )}{" "}
              mins
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockFacilities.reduce((sum, f) => sum + f.attrition, 0) /
                  mockFacilities.length) *
                  100
              )}
              % avg attrition
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Network Efficiency</CardTitle>
            <Network className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {Math.round(
                (mockFacilities.reduce((sum, f) => sum + f.workers * f.utilisation, 0) /
                  mockFacilities.reduce((sum, f) => sum + f.workers, 0)) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">+2.5% from last quarter</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkDashboard;

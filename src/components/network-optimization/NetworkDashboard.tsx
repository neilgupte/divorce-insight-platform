// src/components/network-optimization/NetworkDashboard.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Building,
  Clock,
  Users,
  MapPin,
  Expand,
  ChevronLeft,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import NetworkMap from "./NetworkMap";
import FacilityTable from "./FacilityTable";
import InsightsPanel from "./InsightsPanel";

export interface Facility {
  id: string;
  name: string;
  workers: number;
  neededWorkers: number;
  marginalValue: number;
  utilisation: number;
  attrition: number;
  commuteTime: number;
  laborPoolIndex: number;
  type: string;
  lat: number;
  lng: number;
}

// TODO: replace this mock with your real data fetch
const mockFacilities: Facility[] = [
  { id: "1", name: "Downtown Distribution Center", workers: 145, neededWorkers: 15, marginalValue: 0.87, utilisation: 0.91, attrition: 0.12, commuteTime: 28, laborPoolIndex: 0.76, type: "Distribution", lat: 37.7749, lng: -122.4194 },
  { id: "2", name: "Eastside Fulfillment",             workers: 78,  neededWorkers: 23, marginalValue: 0.65, utilisation: 0.77, attrition: 0.18, commuteTime: 35, laborPoolIndex: 0.62, type: "Fulfillment",   lat: 37.8044, lng: -122.2712 },
  { id: "3", name: "South Bay Storage",                workers: 92,  neededWorkers: 8,  marginalValue: 0.92, utilisation: 0.89, attrition: 0.08, commuteTime: 22, laborPoolIndex: 0.88, type: "Storage",       lat: 37.3382, lng: -121.8863 },
  { id: "4", name: "North County Logistics",           workers: 112, neededWorkers: 0,  marginalValue: 0.79, utilisation: 1.00, attrition: 0.15, commuteTime: 31, laborPoolIndex: 0.71, type: "Logistics",     lat: 38.1499, lng: -122.4569 },
  { id: "5", name: "Central Valley Distribution",      workers: 65,  neededWorkers: 30, marginalValue: 0.58, utilisation: 0.68, attrition: 0.22, commuteTime: 42, laborPoolIndex: 0.55, type: "Distribution", lat: 37.9577, lng: -121.2908 },
];

export default function NetworkDashboard() {
  const navigate = useNavigate();

  // full-screen dialog state
  const [showFull, setShowFull] = useState(false);

  // view: "map" or "table"
  const [activeView, setActiveView] = useState<"map" | "table">("map");
  const onView = (v: "map" | "table") => {
    setActiveView(v);
    navigate(v === "map" ? "/network/dashboard" : "/network/table");
  };

  // filters
  const [maxRadius, setMaxRadius] = useState(30);
  const [utilThreshold, setUtilThreshold] = useState(0);
  const [openThreshold, setOpenThreshold] = useState(100);
  const types = useMemo(() => Array.from(new Set(mockFacilities.map(f => f.type))), []);
  const [typeFilter, setTypeFilter] = useState<string[]>(types);
  const toggleType = (t: string) =>
    setTypeFilter(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );

  // apply filters
  const facilities = useMemo(() => {
    return mockFacilities.filter(f =>
      typeFilter.includes(f.type) &&
      f.utilisation * 100 >= utilThreshold &&
      f.neededWorkers <= openThreshold
    );
  }, [utilThreshold, openThreshold, typeFilter]);

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Network Optimization</h1>
          <p className="text-muted-foreground">Optimize your facility network & workforce</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={activeView==="map"?"default":"outline"} onClick={()=>onView("map")}>
            <MapPin className="mr-2 h-4 w-4"/>Map View
          </Button>
          <Button variant={activeView==="table"?"default":"outline"} onClick={()=>onView("table")}>
            <Building className="mr-2 h-4 w-4"/>Table View
          </Button>
          <Dialog open={showFull} onOpenChange={setShowFull}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-4 flex items-center">
                <Expand className="mr-2 h-4 w-4"/>Expand Map
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-none h-screen">
              <DialogHeader>
                <DialogTitle>Full-Screen Map</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-5 w-5"/>
                  </Button>
                </DialogClose>
              </DialogHeader>
              <div className="relative h-[calc(100%-4rem)] mt-4">
                <NetworkMap
                  facilities={facilities}
                  selectedFacility={selectedFacility}
                  onSelectFacility={setSelectedFacility}
                  layers={{ facilities: true, commuteRadii: true, populationDensity: false, laborHeatmap: false }}
                  fullscreen={true}
                  maxRadius={maxRadius}
                />
                {/* full-screen filters */}
                <div className="absolute bottom-5 left-5 bg-white/90 p-4 rounded shadow z-20 w-64 space-y-4">
                  {/* Radius */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Max Radius (mi)</span><span>{maxRadius}</span>
                    </div>
                    <Slider value={[maxRadius]} min={5} max={50} step={5} onValueChange={v=>setMaxRadius(v[0])}/>
                  </div>
                  {/* Util */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Util ≥</span><span>{utilThreshold}%</span>
                    </div>
                    <Slider value={[utilThreshold]} min={0} max={100} step={10} onValueChange={v=>setUtilThreshold(v[0])}/>
                  </div>
                  {/* Open */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Open ≤</span><span>{openThreshold}</span>
                    </div>
                    <Slider value={[openThreshold]} min={0} max={100} step={5} onValueChange={v=>setOpenThreshold(v[0])}/>
                  </div>
                  {/* Types */}
                  <div>
                    <div className="text-sm font-medium mb-1">Facility Types</div>
                    <div className="flex flex-wrap gap-2">
                      {types.map(t=>(
                        <button key={t} onClick={()=>toggleType(t)}
                          className={`px-2 py-1 text-xs rounded ${
                            typeFilter.includes(t) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* main */}
      {activeView==="map" ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[60%] w-full h-[500px]">
            <NetworkMap
              facilities={facilities}
              selectedFacility={selectedFacility}
              onSelectFacility={setSelectedFacility}
              layers={{ facilities: true, commuteRadii: true, populationDensity: false, laborHeatmap: false }}
              maxRadius={maxRadius}
            />
          </div>
          <div className="lg:w-[40%] w-full">
            <FacilityTable
              facilities={facilities}
              selectedFacilityId={selectedFacility?.id}
              onSelectFacility={setSelectedFacility}
            />
          </div>
        </div>
      ) : (
        <FacilityTable
          facilities={facilities}
          selectedFacilityId={selectedFacility?.id}
          onSelectFacility={setSelectedFacility}
        />
      )}

      {/* insights */}
      <InsightsPanel selectedFacility={selectedFacility} facilities={facilities} />

      {/* bottom KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="flex justify-between"><Building className="text-muted-foreground"/>Total Facilities</div>
          <div className="mt-2 text-2xl font-bold">{facilities.length}</div>
          <div className="text-xs text-muted-foreground">
            {facilities.filter(f=>f.utilisation>=0.9).length} high utilization
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="flex justify-between"><Users className="text-muted-foreground"/>Workforce</div>
          <div className="mt-2 text-2xl font-bold">
            {facilities.reduce((sum,f)=>sum+f.workers,0)}
          </div>
          <div className="text-xs text-muted-foreground">
            {facilities.reduce((sum,f)=>sum+f.neededWorkers,0)} needed
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="flex justify-between"><Clock className="text-muted-foreground"/>Avg Commute</div>
          <div className="mt-2 text-2xl font-bold">
            {Math.round(facilities.reduce((s,f)=>s+f.commuteTime,0)/facilities.length)} mins
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(facilities.reduce((s,f)=>s+f.attrition,0)/facilities.length*100)}% attrition
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="flex justify-between"><MapPin className="text-muted-foreground"/>Efficiency</div>
          <div className="mt-2 text-2xl font-bold">
            {Math.round(facilities.reduce((s,f)=>s+f.marginalValue,0)/facilities.length*100)}%
          </div>
          <div className="text-xs text-muted-foreground">
            +2.5% last quarter
          </div>
        </div>
      </div>
    </div>
  );
}


// src/components/network-optimization/NetworkDashboard.tsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table as TableIcon,
  Maximize,
  ChevronLeft,
  MapPin,
  Building,
  Users,
  Clock,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import NetworkMap from "./NetworkMap";
import InsightsPanel from "./InsightsPanel";
import FacilityTable from "./FacilityTable";

// ——— Facility & Insight Types ———
export interface Facility {
  id: string;
  name: string;
  workers: number;
  neededWorkers: number;
  marginalValue: number;
  utilisation: number;  // 0–1
  attrition: number;    // 0–1
  commuteTime: number;  // mins
  laborPoolIndex: number;
  type: string;
  lat: number;
  lng: number;
}

export interface Insight {
  id: string;
  type: "network" | "facility" | "scenario";
  title: string;
  description: string;
}

// ——— Mock Data ———
const mockFacilities: Facility[] = [
  { id: "1", name: "Downtown Distribution Center", type: "Distribution", workers: 145, neededWorkers: 15, utilisation: 0.91, attrition: 0.12, commuteTime: 28, lat: 37.7749, lng: -122.4194, laborPoolIndex: 0.76, marginalValue: 0.87 },
  { id: "2", name: "Eastside Fulfillment",           type: "Fulfillment",   workers: 78, neededWorkers: 23, utilisation: 0.77, attrition: 0.18, commuteTime: 35, lat: 37.8044, lng: -122.2712, laborPoolIndex: 0.62, marginalValue: 0.65 },
  { id: "3", name: "South Bay Storage",              type: "Storage",       workers: 92, neededWorkers: 8,  utilisation: 0.89, attrition: 0.08, commuteTime: 22, lat: 37.3382, lng: -121.8863, laborPoolIndex: 0.88, marginalValue: 0.92 },
  { id: "4", name: "North County Logistics",         type: "Logistics",     workers: 112,neededWorkers: 0,  utilisation: 1.00, attrition: 0.15, commuteTime: 31, lat: 38.1499, lng: -122.4569, laborPoolIndex: 0.71, marginalValue: 0.79 },
  { id: "5", name: "Central Valley Distribution",    type: "Distribution",  workers: 65, neededWorkers: 30, utilisation: 0.68, attrition: 0.22, commuteTime: 42, lat: 37.9577, lng: -121.2908, laborPoolIndex: 0.55, marginalValue: 0.58 },
];

const mockInsights: Insight[] = [
  { id: "i1", type: "network",  title: "High Attrition in Urban Facilities", description: "Urban facilities show 18% higher attrition rates compared to suburban locations. Consider offering enhanced transportation benefits or flexible scheduling options." },
  { id: "i2", type: "facility", title: "Workforce Gaps Analysis",          description: "Your network has a total shortage of 76 workers. Central Valley Distribution has the largest gap with 30 open positions to fill." },
  { id: "i3", type: "scenario", title: "Optimization Opportunity",         description: "Shifting 15% of workload from Central Valley to South Bay Storage could reduce overall commute times by 12% and increase network utilization efficiency by 7%." },
];

// ——— Main Component ———
export default function NetworkDashboard() {
  // view & navigation
  const [activeView, setActiveView] = useState<"map"|"table">("map");
  const onView = (v:"map"|"table") => setActiveView(v);

  // filters & state
  const [maxRadius, setMaxRadius] = useState(30);
  const [utilThreshold, setUtilThreshold] = useState(0);
  const [openThreshold, setOpenThreshold] = useState(100);
  const types = useMemo(() => Array.from(new Set(mockFacilities.map(f=>f.type))), []);
  const [typeFilter, setTypeFilter] = useState<string[]>(types);
  const toggleType = (t:string) =>
    setTypeFilter(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t]);

  // filtered facilities
  const facilities = useMemo(() => 
    mockFacilities.filter(f=>
      typeFilter.includes(f.type) &&
      f.utilisation*100 >= utilThreshold &&
      f.neededWorkers <= openThreshold
    ), [utilThreshold, openThreshold, typeFilter]
  );

  const [selectedFacility, setSelectedFacility] = useState<Facility|null>(null);
  const [fullscreenMapOpen, setFullscreenMapOpen] = useState(false);

  // insight tab
  const [insightType, setInsightType] = useState<Insight["type"]>("network");

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Network Optimization</h1>
          <p className="text-muted-foreground">Optimize your facility network & workforce distribution</p>
        </div>
        {/* view & expand buttons */}
        <div className="flex items-center space-x-2">
          <Button variant={activeView==="map"?"default":"outline"} onClick={()=>onView("map")}>
            <MapPin className="mr-2 h-4 w-4"/>Map View
          </Button>
          <Button variant={activeView==="table"?"default":"outline"} onClick={()=>onView("table")}>
            <Building className="mr-2 h-4 w-4"/>Table View
          </Button>
          <Dialog open={fullscreenMapOpen} onOpenChange={setFullscreenMapOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Maximize className="mr-2 h-4 w-4"/>Expand Map
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-auto mt-8 bg-white rounded-lg shadow-lg max-w-[85vw] w-[85vw] h-[85vh] p-0 overflow-hidden">
              <DialogHeader className="flex justify-between items-center p-4 border-b">
                <DialogTitle>Full-Screen Map</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-5 w-5"/>
                  </Button>
                </DialogClose>
              </DialogHeader>

              <div className="relative flex h-[calc(100%-56px)]">
                {/* big map - now takes full height */}
                <div className="flex-1 h-full">
                  <NetworkMap
                    facilities={facilities}
                    selectedFacility={selectedFacility}
                    onSelectFacility={setSelectedFacility}
                    layers={{
                      commuteRadii: true,
                    }}
                    fullscreen={true}
                    maxRadius={maxRadius}
                  />
                </div>

                {/* filter sidebar moved completely to right column */}
                <div className="w-64 bg-white p-4 overflow-auto shadow-inner">
                  {/* Radius */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Max Radius (mi)</span><span>{maxRadius}</span>
                    </div>
                    <Slider value={[maxRadius]} min={5} max={50} step={5} onValueChange={v=>setMaxRadius(v[0])}/>
                  </div>
                  {/* Util */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Util ≥</span><span>{utilThreshold}%</span>
                    </div>
                    <Slider value={[utilThreshold]} min={0} max={100} step={10} onValueChange={v=>setUtilThreshold(v[0])}/>
                  </div>
                  {/* Open */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Open ≤</span><span>{openThreshold}</span>
                    </div>
                    <Slider value={[openThreshold]} min={0} max={100} step={5} onValueChange={v=>setOpenThreshold(v[0])}/>
                  </div>
                  {/* Show Facilities */}
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Show Facilities</div>
                    <div className="space-y-2">
                      {facilities.map(f=>(
                        <div key={f.id} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={true}
                            readOnly
                            className="mr-2"
                          />
                          {f.name}
                        </div>
                      ))}
                      {facilities.length===0 && <div className="text-xs text-muted-foreground">No facilities to show</div>}
                    </div>
                  </div>
                  {/* Facility Types */}
                  <div>
                    <div className="text-sm font-medium mb-2">Facility Types</div>
                    <div className="flex flex-wrap gap-2">
                      {types.map(t=>(
                        <button key={t} onClick={()=>toggleType(t)}
                          className={`px-2 py-1 text-xs rounded ${
                            typeFilter.includes(t)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
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

      {/* main content */}
      {activeView==="map" ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/5 w-full h-[900px]">
            <Card className="h-full overflow-hidden">
              <CardHeader>
                <CardTitle>Facility Network Map</CardTitle>
                <CardDescription>
                  {facilities.length} facilities, {facilities.reduce((a,f)=>a+f.workers,0)} workers total
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-3rem)]">
                <NetworkMap
                  facilities={facilities}
                  selectedFacility={selectedFacility}
                  onSelectFacility={setSelectedFacility}
                  layers={{
                    commuteRadii: true,
                  }}
                  maxRadius={maxRadius}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-3/5 w-full flex flex-col gap-6">
            <Card className="h-[550px] overflow-hidden">
              <CardHeader>
                <CardTitle>Facility Overview</CardTitle>
                <CardDescription>
                  {facilities.length} facilities, {facilities.reduce((a,f)=>a+f.workers,0)} workers total
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-3.5rem)]">
                <FacilityTable
                  facilities={facilities}
                  selectedFacilityId={selectedFacility?.id}
                  onSelectFacility={(facility) => setSelectedFacility(facility)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle>Insights & Recommendations</CardTitle>
                <div className="flex space-x-2 sm:hidden">
                  {/* mobile icon toggles... */}
                </div>
                <div className="hidden sm:flex space-x-2">
                  <Button variant={insightType==="network"?"default":"outline"} size="sm" onClick={()=>setInsightType("network")}>Network Insights</Button>
                  <Button variant={insightType==="facility"?"default":"outline"} size="sm" onClick={()=>setInsightType("facility")}>Facility Analysis</Button>
                  <Button variant={insightType==="scenario"?"default":"outline"} size="sm" onClick={()=>setInsightType("scenario")}>Run Scenario</Button>
                </div>
              </CardHeader>
              <CardContent>
                <InsightsPanel
                  facilities={facilities}
                  selectedFacility={selectedFacility}
                  initialInsightType={insightType}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <FacilityTable
          facilities={facilities}
          selectedFacilityId={selectedFacility?.id}
          onSelectFacility={(facility) => setSelectedFacility(facility)}
        />
      )}

      {/* bottom KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Total Facilities</CardTitle>
            <Building className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{facilities.length}</div>
            <p className="text-xs text-muted-foreground">
              {facilities.filter(f=>f.utilisation>=0.9).length} at high utilization
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Workforce</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{facilities.reduce((a,f)=>a+f.workers,0)}</div>
            <p className="text-xs text-muted-foreground">{facilities.reduce((a,f)=>a+f.neededWorkers,0)} needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Avg Commute Time</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {Math.round(facilities.reduce((s,f)=>s+f.commuteTime,0)/facilities.length)} mins
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((facilities.reduce((s,f)=>s+f.attrition,0)/facilities.length)*100)}% attrition
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Network Efficiency</CardTitle>
            <Network className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {Math.round((facilities.reduce((s,f)=>s+f.marginalValue,0)/facilities.length)*100)}%
            </div>
            <p className="text-xs text-muted-foreground">+2.5% last quarter</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

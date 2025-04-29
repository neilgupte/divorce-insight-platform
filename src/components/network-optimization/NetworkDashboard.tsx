// src/components/network-optimization/NetworkDashboard.tsx
import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  MapPin,
  Table as TableIcon,
  Maximize,
  ChevronLeft,
} from "lucide-react";

import NetworkMap from "./NetworkMap";
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

// … your mockFacilities and everything else is unchanged …

export default function NetworkDashboard() {
  const navigate = useNavigate();
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

  const facilities = useMemo(() => {
    return mockFacilities.filter(f =>
      typeFilter.includes(f.type) &&
      f.utilisation * 100 >= utilThreshold &&
      f.neededWorkers <= openThreshold
    );
  }, [utilThreshold, openThreshold, typeFilter]);

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [fullscreenMapOpen, setFullscreenMapOpen] = useState(false);

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
            <TableIcon className="mr-2 h-4 w-4"/>Table View
          </Button>
          <Dialog open={fullscreenMapOpen} onOpenChange={setFullscreenMapOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-4 flex items-center">
                <Maximize className="mr-2 h-4 w-4"/>Expand Map
              </Button>
            </DialogTrigger>
            {/* ─── UPDATED DIALOG CONTENT ─── */}
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
                {/* Map area */}
                <div className="flex-1">
                  <NetworkMap
                    facilities={facilities}
                    selectedFacility={selectedFacility}
                    onSelectFacility={setSelectedFacility}
                    layers={{
                      facilities: true,
                      commuteRadii: true,
                      populationDensity: false,
                      laborHeatmap: false,
                    }}
                    fullscreen={true}
                    maxRadius={maxRadius}
                  />
                </div>
                {/* Sidebar filters */}
                <div className="w-64 bg-white p-4 overflow-auto shadow-inner">
                  {/* Radius */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Max Radius (mi)</span>
                      <span>{maxRadius}</span>
                    </div>
                    <Slider
                      value={[maxRadius]}
                      min={5}
                      max={50}
                      step={5}
                      onValueChange={v => setMaxRadius(v[0])}
                    />
                  </div>
                  {/* Utilization */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Util ≥</span>
                      <span>{utilThreshold}%</span>
                    </div>
                    <Slider
                      value={[utilThreshold]}
                      min={0}
                      max={100}
                      step={10}
                      onValueChange={v => setUtilThreshold(v[0])}
                    />
                  </div>
                  {/* Open slots */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Open ≤</span>
                      <span>{openThreshold}</span>
                    </div>
                    <Slider
                      value={[openThreshold]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={v => setOpenThreshold(v[0])}
                    />
                  </div>
                  {/* Facility checkboxes */}
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Show Facilities</div>
                    <div className="space-y-2">
                      {mockFacilities.map(f => (
                        <label key={f.id} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={typeFilter.includes(f.type)}
                            onChange={() => toggleType(f.type)}
                            className="mr-2"
                          />
                          {f.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Type toggles */}
                  <div>
                    <div className="text-sm font-medium mb-2">Facility Types</div>
                    <div className="flex flex-wrap gap-2">
                      {types.map(t => (
                        <button
                          key={t}
                          onClick={() => toggleType(t)}
                          className={`px-2 py-1 text-xs rounded ${
                            typeFilter.includes(t)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
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

      {/* …the rest of your dashboard (map/table split, InsightsPanel, KPI cards) remains exactly as it was. */}
    </div>
  );
}

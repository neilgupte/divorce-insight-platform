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
  MapPin,
  Building,
  Table as TableIcon,
  Maximize,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import NetworkMap from "./NetworkMap";
import FacilityTable from "./FacilityTable";
import InsightsPanel from "./InsightsPanel";

// —————— types ——————
export interface Facility {
  id: string;
  name: string;
  workers: number;
  neededWorkers: number;
  marginalValue: number;
  utilisation: number; // 0–1
  attrition: number;   // 0–1
  commuteTime: number; // mins
  laborPoolIndex: number;
  type: string;
  lat: number;
  lng: number;
}

// —————— mock data ——————
const mockFacilities: Facility[] = [
  { id: "1", name: "Downtown Distribution Center", type: "Distribution", workers: 145, neededWorkers: 15, utilisation: 

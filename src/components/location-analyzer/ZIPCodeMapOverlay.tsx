
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import StateMapsOverlay from "./StateMapsOverlay";

interface ZIPCodeMapOverlayProps {
  open: boolean;
  onClose: () => void;
  initialState?: string;
  initialCity?: string;
}

const ZIPCodeMapOverlay: React.FC<ZIPCodeMapOverlayProps> = ({
  open,
  onClose,
  initialState = "All States",
  initialCity = "All Cities"
}) => {
  // Convert state name to abbreviation if needed
  const getStateAbbreviation = (stateName: string): string => {
    // Map of state names to abbreviations
    const stateMap: Record<string, string> = {
      "Alabama": "AL",
      "Alaska": "AK",
      "Arizona": "AZ",
      "Arkansas": "AR",
      "California": "CA",
      "Colorado": "CO",
      "Connecticut": "CT",
      "Delaware": "DE",
      "Florida": "FL",
      "Georgia": "GA",
      "Hawaii": "HI",
      "Idaho": "ID",
      "Illinois": "IL",
      "Indiana": "IN",
      "Iowa": "IA",
      "Kansas": "KS",
      "Kentucky": "KY",
      "Louisiana": "LA",
      "Maine": "ME",
      "Maryland": "MD",
      "Massachusetts": "MA",
      "Michigan": "MI",
      "Minnesota": "MN",
      "Mississippi": "MS",
      "Missouri": "MO",
      "Montana": "MT",
      "Nebraska": "NE",
      "Nevada": "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      "Ohio": "OH",
      "Oklahoma": "OK",
      "Oregon": "OR",
      "Pennsylvania": "PA",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      "Tennessee": "TN",
      "Texas": "TX",
      "Utah": "UT",
      "Vermont": "VT",
      "Virginia": "VA",
      "Washington": "WA",
      "West Virginia": "WV",
      "Wisconsin": "WI",
      "Wyoming": "WY",
      "District of Columbia": "DC"
    };
    
    if (stateName === "All States") return "CA"; // Default to California
    return stateMap[stateName] || "CA"; // Default to California if not found
  };

  // Set initial state abbreviation
  const initialStateAbbr = getStateAbbreviation(initialState);

  return <StateMapsOverlay open={open} onClose={onClose} initialState={initialStateAbbr} />;
};

export default ZIPCodeMapOverlay;

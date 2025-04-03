
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
import { getStateAbbreviation } from "@/lib/zipUtils";

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
  // Convert state name to abbreviation
  const initialStateAbbr = getStateAbbreviation(initialState);

  return <StateMapsOverlay open={open} onClose={onClose} initialState={initialStateAbbr} />;
};

export default ZIPCodeMapOverlay;

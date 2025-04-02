
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, Share2, X } from "lucide-react";

interface MapControlsProps {
  onPrint: () => void;
  onExport: () => void;
  onShare: () => void;
  onClose: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  onPrint,
  onExport,
  onShare,
  onClose,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={onPrint}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={onShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MapControls;

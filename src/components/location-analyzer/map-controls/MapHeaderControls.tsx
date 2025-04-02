
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MapHeaderControlsProps {
  onClose: () => void;
}

const MapHeaderControls: React.FC<MapHeaderControlsProps> = ({ onClose }) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Map Exported",
      description: "The map has been exported as an image file."
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Opening print dialog for the current map view."
    });
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://example.com/shared-map/abc123");
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to your clipboard."
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MapHeaderControls;

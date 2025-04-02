
import { UseToastReturn } from "@/hooks/use-toast";

export const createMapControlHandlers = (toast: UseToastReturn["toast"]) => {
  const handleExport = () => {
    toast({
      title: "Map Exported",
      description: "The map has been exported as an image file.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Opening print dialog for the current map view.",
    });
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://example.com/shared-geojson-map/california");
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to your clipboard.",
    });
  };

  return {
    handleExport,
    handlePrint,
    handleShare
  };
};

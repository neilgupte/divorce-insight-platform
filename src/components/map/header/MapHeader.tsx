
import React from "react";
import { Save, FileDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SavedView } from "../types";

interface MapHeaderProps {
  savedViews: SavedView[];
  selectedView: string | null;
  onSaveClick: () => void;
  onGenerateReport: () => void;
  onClose: () => void;
  onLoadView: (viewId: string) => void;
}

const MapHeader: React.FC<MapHeaderProps> = ({
  savedViews,
  selectedView,
  onSaveClick,
  onGenerateReport,
  onClose,
  onLoadView,
}) => {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h2 className="text-xl font-semibold">Location Heatmap Analysis</h2>
      <div className="flex items-center gap-2">
        <Select value={selectedView || ""} onValueChange={onLoadView}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Saved views..." />
          </SelectTrigger>
          <SelectContent>
            {savedViews.map((view) => (
              <SelectItem key={view.id} value={view.id}>
                {view.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          onClick={onSaveClick}
        >
          <Save className="h-4 w-4 mr-2" />
          Save View
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onGenerateReport}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="h-9 w-9 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapHeader;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookmarkIcon } from "lucide-react";
import { formatNetWorth } from "@/lib/utils";

interface SnapshotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  currentFilters: {
    state: string;
    city: string;
    netWorthRange: [number, number];
  };
}

const SnapshotDialog: React.FC<SnapshotDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentFilters,
}) => {
  const [snapshotName, setSnapshotName] = useState("");
  const [error, setError] = useState("");

  // Generate a default name based on the current filters
  const generateDefaultName = () => {
    const { state, city, netWorthRange } = currentFilters;
    const locationPart = state !== "All States" 
      ? city !== "All Cities" 
        ? `${city}, ${state}` 
        : state
      : "All Locations";
      
    const netWorthPart = `$${netWorthRange[0]}M-$${netWorthRange[1]}M`;
    
    return `${locationPart} (${netWorthPart})`;
  };

  // Set default name when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSnapshotName(generateDefaultName());
      setError("");
    }
  }, [isOpen, currentFilters]);

  const handleSave = () => {
    if (!snapshotName.trim()) {
      setError("Please provide a name for this snapshot");
      return;
    }
    
    onSave(snapshotName.trim());
    setSnapshotName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5" />
            Save Dashboard View
          </DialogTitle>
          <DialogDescription>
            Save your current filter settings as a snapshot for easy access later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="snapshot-name" className="text-sm font-medium">
              Snapshot Name
            </label>
            <Input
              id="snapshot-name"
              placeholder="Enter a name for this snapshot"
              value={snapshotName}
              onChange={(e) => {
                setSnapshotName(e.target.value);
                setError("");
              }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Current Filters</h4>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p><span className="font-medium">Location:</span> {currentFilters.state !== "All States" 
                ? currentFilters.city !== "All Cities" 
                  ? `${currentFilters.city}, ${currentFilters.state}` 
                  : currentFilters.state
                : "All States"}</p>
              <p><span className="font-medium">Net Worth Range:</span> {formatNetWorth(currentFilters.netWorthRange[0])} – {formatNetWorth(currentFilters.netWorthRange[1])}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Snapshot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SnapshotDialog;

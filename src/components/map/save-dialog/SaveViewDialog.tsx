
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SaveViewDialogProps {
  open: boolean;
  viewName: string;
  onOpenChange: (open: boolean) => void;
  onViewNameChange: (name: string) => void;
  onSave: () => void;
}

const SaveViewDialog: React.FC<SaveViewDialogProps> = ({
  open,
  viewName,
  onOpenChange,
  onViewNameChange,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Current View</DialogTitle>
          <DialogDescription>
            Give your current map configuration a name to save it for future use.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="view-name" className="mb-2 block">View Name</Label>
          <Input
            id="view-name"
            placeholder="e.g., High Net Worth - East Coast"
            value={viewName}
            onChange={(e) => onViewNameChange(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveViewDialog;

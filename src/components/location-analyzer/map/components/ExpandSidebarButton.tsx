
import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpandSidebarButtonProps {
  onClick: () => void;
}

const ExpandSidebarButton: React.FC<ExpandSidebarButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="absolute top-4 left-4 z-10 bg-background shadow-md"
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Expand sidebar</span>
    </Button>
  );
};

export default ExpandSidebarButton;

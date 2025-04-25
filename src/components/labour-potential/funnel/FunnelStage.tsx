
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FunnelStageProps {
  id: string;
  name: string;
  value: number;
  description: string;
  previousValue: number;
  isPercentage: boolean;
  color: string;
  onNameChange: (id: string, name: string) => void;
  onValueChange: (id: string, value: number) => void;
  onDescriptionChange: (id: string, description: string) => void;
  onToggleValueType: (id: string) => void;
}

const FunnelStage: React.FC<FunnelStageProps> = ({
  id,
  name,
  value,
  description,
  previousValue,
  isPercentage,
  color,
  onNameChange,
  onValueChange,
  onToggleValueType
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);
  
  const resultValue = isPercentage
    ? Math.round(previousValue * (1 - value / 100))
    : previousValue - value;

  const percentage = (resultValue / previousValue) * 100;
  
  return (
    <div 
      className="relative mb-1 w-full transition-all duration-200"
      style={{ 
        minHeight: "60px",
        maxWidth: `${Math.max(percentage, 30)}%`,
        marginLeft: `${(100 - Math.max(percentage, 30)) / 2}%`
      }}
    >
      <div 
        className="w-full p-3 text-white"
        style={{ 
          background: color,
          clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0 100%)",
          minHeight: "60px"
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {isEditingName ? (
              <Input
                value={name}
                onChange={(e) => onNameChange(id, e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                autoFocus
                className="font-medium bg-white/20"
              />
            ) : (
              <div 
                className="font-medium cursor-pointer flex items-center gap-2" 
                onClick={() => setIsEditingName(true)}
              >
                {name}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="cursor-help opacity-70" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{description || "Add a description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isEditingValue ? (
              <Input
                type="number"
                value={value}
                onChange={(e) => onValueChange(id, Number(e.target.value))}
                onBlur={() => setIsEditingValue(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingValue(false)}
                autoFocus
                className="w-20 text-right bg-white/20"
              />
            ) : (
              <div 
                className="font-bold cursor-pointer text-right w-20"
                onClick={() => setIsEditingValue(true)}
              >
                {resultValue.toLocaleString()}
              </div>
            )}
            <button 
              className="ml-2 text-xs opacity-70 hover:opacity-100"
              onClick={() => onToggleValueType(id)}
            >
              {isPercentage ? "%" : "#"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelStage;

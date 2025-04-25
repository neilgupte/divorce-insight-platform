
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
  onNameChange,
  onValueChange,
  onDescriptionChange,
  onToggleValueType
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);
  
  const displayValue = isPercentage 
    ? `${value}%` 
    : value.toLocaleString();
  
  const resultValue = isPercentage
    ? Math.round(previousValue * (1 - value / 100))
    : previousValue - value;

  return (
    <Card className="mb-2 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {isEditingName ? (
              <Input
                value={name}
                onChange={(e) => onNameChange(id, e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                autoFocus
                className="font-medium"
              />
            ) : (
              <div 
                className="font-medium cursor-pointer hover:text-blue-500 transition-colors flex items-center gap-2" 
                onClick={() => setIsEditingName(true)}
              >
                {name}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{description || "Add a description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">Previous: {previousValue.toLocaleString()}</div>
            <div className="flex items-center">
              {isEditingValue ? (
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => onValueChange(id, Number(e.target.value))}
                  onBlur={() => setIsEditingValue(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingValue(false)}
                  autoFocus
                  className="w-24 text-right"
                />
              ) : (
                <div 
                  className="font-bold cursor-pointer hover:text-blue-500 transition-colors text-right w-24"
                  onClick={() => setIsEditingValue(true)}
                >
                  {isPercentage ? `${value}%` : value.toLocaleString()}
                </div>
              )}
              <button 
                className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => onToggleValueType(id)}
              >
                {isPercentage ? "%" : "#"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500" 
            style={{ width: `${(resultValue / previousValue) * 100}%` }}
          ></div>
        </div>
        
        <div className="mt-2 font-bold text-right">
          Result: {resultValue.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelStage;

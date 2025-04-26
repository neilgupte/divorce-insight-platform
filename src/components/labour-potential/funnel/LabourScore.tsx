import React from "react";
import { Button } from "@/components/ui/button";

const LabourScore: React.FC<any> = (props) => {
  const [score, setScore] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const calculateScore = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Random score between 1-100
      setScore(Math.floor(Math.random() * 100) + 1);
      setIsLoading(false);
    }, 1500);
  };
  
  const getScoreColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };
  
  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Average";
    return "Poor";
  };
  
  return (
    <div className="bg-card rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Labour Market Score</h3>
      
      <div className="flex flex-col items-center justify-center py-6">
        {score > 0 ? (
          <>
            <div className={`text-5xl font-bold ${getScoreColor()}`}>
              {score}
            </div>
            <div className={`text-sm mt-2 ${getScoreColor()}`}>
              {getScoreLabel()}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
              This score represents the overall health of the labour market in the selected area based on multiple factors.
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              onClick={calculateScore}
              disabled={isLoading}
            >
              Recalculate
            </Button>
          </>
        ) : (
          <>
            <div className="text-muted-foreground text-center mb-4">
              Calculate the labour market score for the selected area
            </div>
            <Button 
              size="sm"
              onClick={calculateScore}
              disabled={isLoading}
            >
              {isLoading ? "Calculating..." : "Calculate Score"}
            </Button>
          </>
        )}
      </div>
      
      {score > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Score Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Supply vs Demand</span>
              <span className="font-medium">Good</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Wage Competitiveness</span>
              <span className="font-medium">Average</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Talent Availability</span>
              <span className="font-medium">Excellent</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Market Growth</span>
              <span className="font-medium">Poor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabourScore;


import React from "react";
import { Facility } from "./types";

interface AIRecommendationsProps {
  selectedFacility: Facility | null;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ selectedFacility }) => {
  // Default recommendations
  const defaultRecommendations = [
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    "Aurltan consecto ligula eget dor. Aenean massa eu."
  ];
  
  // Facility-specific recommendations (would come from an API in a real app)
  const facilityRecommendations: {[key: string]: string[]} = {
    "A": [
      "Facility A is operating within expected parameters.",
      "Consider increasing staff during peak hours to improve customer satisfaction."
    ],
    "B": [
      "Facility B is currently understaffed by 10 positions.",
      "Urgent attention needed: Hiring or redeployment recommended within 14 days."
    ],
    "C": [
      "Facility C is overstaffed by 10 positions.",
      "Consider redeploying excess staff to Facility B which is understaffed."
    ],
    "D": [
      "Facility D has excess labour capacity that could be optimized.",
      "Recommended to review shift distribution to better match demand patterns."
    ]
  };
  
  const recommendations = selectedFacility 
    ? facilityRecommendations[selectedFacility.id] || defaultRecommendations
    : defaultRecommendations;
    
  return (
    <div className="p-4">
      {recommendations.map((rec, index) => (
        <p key={index} className="text-gray-700 mb-3">
          {rec}
        </p>
      ))}
      
      {selectedFacility && (
        <div className="mt-4 text-sm text-gray-500">
          <p>
            Based on historical patterns and current demand forecasts for {selectedFacility.name}.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;

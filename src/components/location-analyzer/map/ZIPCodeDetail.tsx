
import React from "react";

interface ZIPCodeDetailProps {
  zip: {
    GEOID20: string;
    COUNTY: string;
    opportunity: number;
    urbanicity: string;
    netWorth: number;
    divorceRate: number;
    hasOffice: boolean;
  };
}

const ZIPCodeDetail: React.FC<ZIPCodeDetailProps> = ({ zip }) => {
  return (
    <div className="space-y-2 text-sm">
      <p><strong>ZIP Code:</strong> {zip.GEOID20}</p>
      <p><strong>County:</strong> {zip.COUNTY || "Unknown"}</p>
      <p><strong>Opportunity:</strong> ${zip.opportunity.toFixed(2)}M</p>
      <p><strong>Urbanicity:</strong> {zip.urbanicity}</p>
      <p><strong>Net Worth:</strong> ${zip.netWorth.toLocaleString()}M</p>
      <p><strong>Divorce Rate:</strong> {zip.divorceRate}%</p>
      <p><strong>Office Present:</strong> {zip.hasOffice ? "Yes" : "No"}</p>
    </div>
  );
};

export default ZIPCodeDetail;

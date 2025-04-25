import React from "react";

interface MarketDisplayProps {
  country: string;
  city: string;
  dma: string;
}

const MarketDisplay: React.FC<MarketDisplayProps> = ({ country, city, dma }) => {
  return (
    <p className="text-sm text-muted-foreground mt-1">
      <strong>Market:</strong> {country} / {city} / {dma}
    </p>
  );
};

export default MarketDisplay;

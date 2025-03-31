
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MapApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onSubmit: () => void;
}

const MapApiKeyInput: React.FC<MapApiKeyInputProps> = ({ 
  apiKey, 
  onApiKeyChange, 
  onSubmit 
}) => {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-medium">Google Maps API Key Required</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Please enter your Google Maps API key to enable the map functionality. 
        The key should have Maps JavaScript API and Maps Visualization API enabled.
      </p>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter Google Maps API Key"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        />
        <Button onClick={onSubmit}>
          Load Map
        </Button>
      </div>
    </Card>
  );
};

export default MapApiKeyInput;

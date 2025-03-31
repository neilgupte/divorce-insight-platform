
import React, { useState } from 'react';
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
  // Local state for the input value to prevent re-renders of parent component while typing
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  // Handle local changes without triggering parent re-render
  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalApiKey(e.target.value);
  };

  // Only update parent state when submitting
  const handleSubmit = () => {
    onApiKeyChange(localApiKey);
    onSubmit();
  };

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
          value={localApiKey}
          onChange={handleLocalChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button onClick={handleSubmit}>
          Load Map
        </Button>
      </div>
    </Card>
  );
};

export default MapApiKeyInput;

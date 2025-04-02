
import React from "react";

interface MapLoadingStateProps {
  loading: boolean;
  error: string | null;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ loading, error }) => {
  if (!loading && !error) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
      <div className="text-center">
        {loading && (
          <>
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2 mx-auto"></div>
            <p>Loading ZIP code boundaries...</p>
          </>
        )}
        
        {error && (
          <div className="text-center text-destructive p-4 rounded-md bg-destructive/10">
            <p className="font-medium mb-2">Error</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLoadingState;

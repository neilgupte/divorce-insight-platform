
import React from "react";

export interface GeoJSONFile {
  id: string;
  name: string;
  url: string;
}

interface StateSelectorProps {
  geoJSONFiles: GeoJSONFile[];
  selectedFiles: string[];
  onToggleFile: (fileId: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({
  geoJSONFiles,
  selectedFiles,
  onToggleFile
}) => {
  return (
    <div className="bg-muted p-2 mb-2 rounded-md">
      <div className="text-sm font-medium mb-1">Select States to Display:</div>
      <div className="flex flex-wrap gap-1">
        {geoJSONFiles.slice(0, 10).map(file => (
          <button
            key={file.id}
            className={`text-xs px-2 py-1 rounded ${
              selectedFiles.includes(file.id) 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => onToggleFile(file.id)}
          >
            {file.name}
          </button>
        ))}
        <div className="relative group">
          <button className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
            More...
          </button>
          <div className="absolute hidden group-hover:block z-10 bg-background shadow-lg rounded-md p-2 right-0 w-64">
            <div className="grid grid-cols-2 gap-1">
              {geoJSONFiles.slice(10).map(file => (
                <button
                  key={file.id}
                  className={`text-xs px-2 py-1 rounded ${
                    selectedFiles.includes(file.id) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                  onClick={() => onToggleFile(file.id)}
                >
                  {file.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateSelector;

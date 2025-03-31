
// Re-export the MapFilters type from mapUtils with 'export type' syntax
export type { MapFilters } from './utils/mapUtils';

export interface SavedView {
  id: string;
  name: string;
  filters: {
    state: string | null;
    divorceRate: {
      enabled: boolean;
      min: number;
    };
    netWorth: {
      enabled: boolean;
      min: number;
      max: number;
    };
    luxuryDensity: {
      enabled: boolean;
      min: number;
    };
    multiProperty: {
      enabled: boolean;
      min: number;
    };
  };
}

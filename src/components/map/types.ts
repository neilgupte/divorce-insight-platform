
export interface SavedView {
  id: string;
  name: string;
  filters: MapFilters;
}

export interface MapFilters {
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
}

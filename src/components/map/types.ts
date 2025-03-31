
import { MapFilters } from './utils/mapUtils';

export interface SavedView {
  id: string;
  name: string;
  filters: MapFilters;
}

// Change from export { MapFilters } to export type { MapFilters }
export type { MapFilters };


export interface Facility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  desiredLabour: number;
  currentLabour: number;
  delta: number;
  recommendedLabour: number;
  mfx: string;
}


// Mapbox access token
export const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOHp6czZ1ZzBmNHcyanM4MnRkcHQ2dTUifQ.r4eSgGg09379mRWiUchnvg";

// List of available GeoJSON files
export const GEOJSON_FILES = [
  { id: "06", name: "California", url: "https://raw.githubusercontent.com/neilgupte/divorce-insight-platform/main/public/zcta_06_halfsize.geojson?raw=true" },
  { id: "08", name: "Colorado", url: "/zcta_08.geojson" },
  { id: "09", name: "Connecticut", url: "/zcta_09.geojson" },
  { id: "10", name: "Delaware", url: "/zcta_10.geojson" },
  { id: "11", name: "District of Columbia", url: "/zcta_11.geojson" },
  { id: "12", name: "Florida", url: "/zcta_12.geojson" },
  { id: "13", name: "Georgia", url: "/zcta_13.geojson" },
  { id: "15", name: "Hawaii", url: "/zcta_15.geojson" },
  { id: "16", name: "Idaho", url: "/zcta_16.geojson" },
  { id: "17", name: "Illinois", url: "/zcta_17.geojson" },
  { id: "18", name: "Indiana", url: "/zcta_18.geojson" },
  { id: "19", name: "Iowa", url: "/zcta_19.geojson" },
  { id: "20", name: "Kansas", url: "/zcta_20.geojson" },
  { id: "21", name: "Kentucky", url: "/zcta_21.geojson" },
  { id: "22", name: "Louisiana", url: "/zcta_22.geojson" },
  { id: "23", name: "Maine", url: "/zcta_23.geojson" },
  { id: "24", name: "Maryland", url: "/zcta_24.geojson" },
  { id: "25", name: "Massachusetts", url: "/zcta_25.geojson" },
  { id: "26", name: "Michigan", url: "/zcta_26.geojson" },
  { id: "27", name: "Minnesota", url: "/zcta_27.geojson" },
];

// State abbreviation mapping
export const STATE_ABBREVIATIONS: Record<string, string> = {
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "District of Columbia": "DC",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
};

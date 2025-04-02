
import mapboxgl from "mapbox-gl";

// Mapbox access token
export const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic3BpcmF0ZWNoIiwiYSI6ImNtOHp6czZ1ZzBmNHcyanM4MnRkcHQ2dTUifQ.r4eSgGg09379mRWiUchnvg";

// Add GeoJSON layer to map
export const addGeoJSONLayer = (mapInstance: mapboxgl.Map, data: any) => {
  // Check if the source already exists
  if (mapInstance.getSource('zip-boundaries')) {
    return; // Source already exists, no need to add again
  }

  // Add the GeoJSON source
  mapInstance.addSource("zip-boundaries", {
    type: "geojson",
    data: data,
  });

  // Add the fill layer
  mapInstance.addLayer({
    id: "zip-boundaries-fill",
    type: "fill",
    source: "zip-boundaries",
    paint: {
      "fill-color": ["get", "fill"],
      "fill-opacity": 0.7,
    },
  });

  // Add a border layer
  mapInstance.addLayer({
    id: "zip-boundaries-line",
    type: "line",
    source: "zip-boundaries",
    paint: {
      "line-color": ["get", "stroke"],
      "line-width": 1,
    },
  });
  
  // Add popup on click
  mapInstance.on('click', 'zip-boundaries-fill', (e) => {
    if (e.features && e.features[0] && e.lngLat) {
      const feature = e.features[0];
      const zipCode = feature.properties.ZCTA5CE20;
      const county = feature.properties.COUNTYFP20 || "Unknown";
      
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <h3 class="text-sm font-bold">ZIP Code: ${zipCode}</h3>
          <p class="text-xs mt-1">County: ${county}</p>
        `)
        .addTo(mapInstance);
    }
  });
  
  // Change cursor on hover
  mapInstance.on('mouseenter', 'zip-boundaries-fill', () => {
    if (mapInstance) {
      mapInstance.getCanvas().style.cursor = 'pointer';
    }
  });
  
  mapInstance.on('mouseleave', 'zip-boundaries-fill', () => {
    if (mapInstance) {
      mapInstance.getCanvas().style.cursor = '';
    }
  });
};

// Fetch GeoJSON data from a URL
export const fetchGeoJSONData = async (): Promise<any> => {
  const response = await fetch(
    "https://raw.githubusercontent.com/neilgupte/geojson-demo/main/zcta_06_styled_all.geojson"
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
  }
  
  return await response.json();
};

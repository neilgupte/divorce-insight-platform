
import mapboxgl from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN, GEOJSON_FILES } from "./mapConstants";

// Fetch GeoJSON data from a URL
export const fetchGeoJSONData = async (fileId: string = "06"): Promise<any> => {
  const fileInfo = GEOJSON_FILES.find(f => f.id === fileId);
  if (!fileInfo) {
    throw new Error(`GeoJSON file with ID ${fileId} not found`);
  }
  
  const response = await fetch(fileInfo.url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
  }
  
  return await response.json();
};

// Add GeoJSON layer to map
export const addGeoJSONLayer = (
  mapInstance: mapboxgl.Map, 
  data: any, 
  sourceId: string = 'zip-boundaries',
  fillLayerId: string = 'zip-boundaries-fill',
  lineLayerId: string = 'zip-boundaries-line'
) => {
  // Check if the source already exists
  if (mapInstance.getSource(sourceId)) {
    // If the source exists, update its data
    const source = mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource;
    source.setData(data);
    return;
  }

  // Add the GeoJSON source
  mapInstance.addSource(sourceId, {
    type: "geojson",
    data: data,
  });

  // Add the fill layer
  mapInstance.addLayer({
    id: fillLayerId,
    type: "fill",
    source: sourceId,
    paint: {
      "fill-color": ["get", "fill"],
      "fill-opacity": 0.7,
    },
  });

  // Add a border layer
  mapInstance.addLayer({
    id: lineLayerId,
    type: "line",
    source: sourceId,
    paint: {
      "line-color": ["get", "stroke"],
      "line-width": 1,
    },
  });
  
  // Add popup on click
  mapInstance.on('click', fillLayerId, (e) => {
    if (e.features && e.features[0] && e.lngLat) {
      const feature = e.features[0];
      const zipCode = feature.properties.ZCTA5CE20 || feature.properties.GEOID20 || "Unknown";
      const county = feature.properties.COUNTYFP20 || feature.properties.COUNTY || "Unknown";
      const state = feature.properties.STATE_NAME || "Unknown";
      
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <h3 class="text-sm font-bold">ZIP Code: ${zipCode}</h3>
          <p class="text-xs mt-1">County: ${county}</p>
          <p class="text-xs mt-1">State: ${state}</p>
        `)
        .addTo(mapInstance);
    }
  });
  
  // Change cursor on hover
  mapInstance.on('mouseenter', fillLayerId, () => {
    if (mapInstance) {
      mapInstance.getCanvas().style.cursor = 'pointer';
    }
  });
  
  mapInstance.on('mouseleave', fillLayerId, () => {
    if (mapInstance) {
      mapInstance.getCanvas().style.cursor = '';
    }
  });
};

// Add multiple GeoJSON layers to map
export const addMultipleGeoJSONLayers = async (
  mapInstance: mapboxgl.Map, 
  fileIds: string[]
) => {
  for (let i = 0; i < fileIds.length; i++) {
    const fileId = fileIds[i];
    try {
      const data = await fetchGeoJSONData(fileId);
      const sourceId = `zip-boundaries-${fileId}`;
      const fillLayerId = `zip-boundaries-fill-${fileId}`;
      const lineLayerId = `zip-boundaries-line-${fileId}`;
      
      addGeoJSONLayer(mapInstance, data, sourceId, fillLayerId, lineLayerId);
    } catch (error) {
      console.error(`Error adding GeoJSON layer for ${fileId}:`, error);
    }
  }
};

// Remove GeoJSON layer from map
export const removeGeoJSONLayer = (
  mapInstance: mapboxgl.Map, 
  sourceId: string
) => {
  if (mapInstance.getLayer(`${sourceId}-fill`)) {
    mapInstance.removeLayer(`${sourceId}-fill`);
  }
  
  if (mapInstance.getLayer(`${sourceId}-line`)) {
    mapInstance.removeLayer(`${sourceId}-line`);
  }
  
  if (mapInstance.getSource(sourceId)) {
    mapInstance.removeSource(sourceId);
  }
};

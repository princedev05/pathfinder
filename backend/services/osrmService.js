const axios = require("axios");

// Haversine formula to compute distance between two lat/lng coordinates in meters
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Get average speed in m/s based on travel mode
function getSpeedForMode(mode) {
  switch (mode) {
    case "bike":
      return 4.0; // ~14.4 km/h
    case "car":
    case "driving":
      return 8.0; // ~28.8 km/h city speed
    case "foot":
    case "walking":
    default:
      return 1.3; // ~4.7 km/h walking speed
  }
}

/**
 * Fetches real travel distance/duration matrix from OSRM demo server
 * Falls back to Haversine matrix if OSRM is unreachable
 */
async function fetchOsrmMatrix(places, mode = "foot") {
  const osrmProfile = mode === "car" || mode === "driving" ? "driving" : mode === "bike" ? "bike" : "foot";
  const coordsStr = places.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `http://router.project-osrm.org/table/v1/${osrmProfile}/${coordsStr}?annotations=distance,duration`;

  try {
    const response = await axios.get(url, { timeout: 4000 });
    if (
      response.data &&
      response.data.code === "Ok" &&
      response.data.durations &&
      response.data.distances
    ) {
      return {
        durations: response.data.durations, // seconds
        distances: response.data.distances, // meters
        estimated: false
      };
    }
  } catch (err) {
    console.warn("[OSRM] Service unreachable or timed out, using Haversine fallback.", err.message);
  }

  // Fallback: Haversine distance matrix
  const N = places.length;
  const speed = getSpeedForMode(mode);
  const distances = Array.from({ length: N }, () => Array(N).fill(0));
  const durations = Array.from({ length: N }, () => Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i !== j) {
        const dist = haversineDistance(
          places[i].lat,
          places[i].lng,
          places[j].lat,
          places[j].lng
        );
        distances[i][j] = dist;
        durations[i][j] = Math.round(dist / speed);
      }
    }
  }

  return { distances, durations, estimated: true };
}

/**
 * Fetches GeoJSON route polyline geometry from OSRM
 */
async function fetchRouteGeometry(orderedPlaces, mode = "foot") {
  if (!orderedPlaces || orderedPlaces.length < 2) {
    return {
      type: "LineString",
      coordinates: orderedPlaces ? orderedPlaces.map((p) => [p.lng, p.lat]) : []
    };
  }

  const osrmProfile = mode === "car" || mode === "driving" ? "driving" : mode === "bike" ? "bike" : "foot";
  const coordsStr = orderedPlaces.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `http://router.project-osrm.org/route/v1/${osrmProfile}/${coordsStr}?overview=full&geometries=geojson`;

  try {
    const response = await axios.get(url, { timeout: 4000 });
    if (
      response.data &&
      response.data.code === "Ok" &&
      response.data.routes &&
      response.data.routes[0] &&
      response.data.routes[0].geometry
    ) {
      return response.data.routes[0].geometry;
    }
  } catch (err) {
    console.warn("[OSRM] Geometry fetch failed, returning straight line fallback.", err.message);
  }

  // Fallback straight lines
  return {
    type: "LineString",
    coordinates: orderedPlaces.map((p) => [p.lng, p.lat])
  };
}

module.exports = {
  haversineDistance,
  fetchOsrmMatrix,
  fetchRouteGeometry
};

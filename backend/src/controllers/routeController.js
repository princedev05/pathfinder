import { CITIES_DATA } from "../../data/cities.js";
import { getIsConnected } from "../db/index.js";
import City from "../models/City.js";
import { optimizeRoute, fetchRouteGeometry } from "../../services/tspSolver.js";
import { asyncHandler } from "../utils/async-Handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * POST /api/optimize - Compute optimal route sequence using Held-Karp DP
 */
const handleOptimizeRoute = asyncHandler(async (req, res) => {
  const { placeIds, cityId = "udaipur", mode = "foot", roundTrip = false, startPlaceId = null } = req.body;

  if (!placeIds || !Array.isArray(placeIds) || placeIds.length === 0) {
    throw new ApiError(400, "Please provide a non-empty array of placeIds.");
  }

  let selectedPlaces = [];

  // Attempt MongoDB lookup if connected
  if (getIsConnected()) {
    try {
      const dbCity = await City.findOne({ id: cityId.toLowerCase() }).lean();
      if (dbCity && dbCity.places) {
        selectedPlaces = placeIds
          .map((id) => dbCity.places.find((p) => p.id === id))
          .filter(Boolean);
      }
    } catch (err) {
      console.warn("[MongoDB] Place lookup fallback failed:", err.message);
    }
  }

  // In-memory fallback lookup
  if (selectedPlaces.length === 0) {
    const city = CITIES_DATA.find((c) => c.id === cityId.toLowerCase()) || CITIES_DATA[0];
    selectedPlaces = placeIds
      .map((id) => city.places.find((p) => p.id === id))
      .filter(Boolean);

    if (selectedPlaces.length < placeIds.length) {
      const allPlaces = CITIES_DATA.flatMap((c) => c.places);
      selectedPlaces = placeIds
        .map((id) => allPlaces.find((p) => p.id === id))
        .filter(Boolean);
    }
  }

  if (selectedPlaces.length === 0) {
    throw new ApiError(400, "None of the specified placeIds were found.");
  }

  const optimizationResult = await optimizeRoute({
    places: selectedPlaces,
    mode,
    roundTrip: Boolean(roundTrip),
    startPlaceId
  });

  return res.status(200).json(
    new ApiResponse(200, optimizationResult, "Route optimized successfully")
  );
});

/**
 * POST /api/route-geometry - Get GeoJSON route polyline coordinates
 */
const handleRouteGeometry = asyncHandler(async (req, res) => {
  const { order, cityId = "udaipur", mode = "foot", places } = req.body;

  let orderedPlaces = [];

  if (places && Array.isArray(places)) {
    orderedPlaces = places;
  } else if (order && Array.isArray(order)) {
    const allPlaces = CITIES_DATA.flatMap((c) => c.places);
    orderedPlaces = order
      .map((id) => allPlaces.find((p) => p.id === id))
      .filter(Boolean);
  }

  if (orderedPlaces.length === 0) {
    throw new ApiError(400, "Invalid order or places list provided.");
  }

  const geometry = await fetchRouteGeometry(orderedPlaces, mode);
  
  return res.status(200).json(
    new ApiResponse(200, { geometry }, "Route geometry fetched successfully")
  );
});

export { handleOptimizeRoute, handleRouteGeometry };

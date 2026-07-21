const { CITIES_DATA } = require("../data/cities");
const { getIsConnected } = require("../config/db");
const City = require("../models/City");
const { optimizeRoute, fetchRouteGeometry } = require("../services/tspSolver");

/**
 * POST /api/optimize - Compute optimal route sequence using Held-Karp DP
 */
exports.handleOptimizeRoute = async (req, res, next) => {
  try {
    const { placeIds, cityId = "udaipur", mode = "foot", roundTrip = false, startPlaceId = null } = req.body;

    if (!placeIds || !Array.isArray(placeIds) || placeIds.length === 0) {
      return res.status(400).json({ error: "Please provide a non-empty array of placeIds." });
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
        console.warn("[MongoDB] Place lookup fallback:", err.message);
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
      return res.status(400).json({ error: "None of the specified placeIds were found." });
    }

    const optimizationResult = await optimizeRoute({
      places: selectedPlaces,
      mode,
      roundTrip: Boolean(roundTrip),
      startPlaceId
    });

    return res.json(optimizationResult);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/route-geometry - Get GeoJSON route polyline coordinates
 */
exports.handleRouteGeometry = async (req, res, next) => {
  try {
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
      return res.status(400).json({ error: "Invalid order or places provided." });
    }

    const geometry = await fetchRouteGeometry(orderedPlaces, mode);
    return res.json({ geometry });
  } catch (err) {
    next(err);
  }
};

const express = require("express");
const router = express.Router();
const { CITIES_DATA } = require("../data/cities");
const { optimizeRoute, fetchRouteGeometry } = require("../services/tspSolver");
const { getIsConnected } = require("../config/db");
const City = require("../models/City");
const Trip = require("../models/Trip");

// GET /api/cities - Returns list of cities (from MongoDB if connected, else in-memory data)
router.get("/cities", async (req, res) => {
  try {
    if (getIsConnected()) {
      const dbCities = await City.find({}).lean();
      if (dbCities && dbCities.length > 0) {
        return res.json({ cities: dbCities, source: "mongodb" });
      }
    }
  } catch (err) {
    console.warn("MongoDB fetch cities failed, falling back to static dataset.", err.message);
  }
  res.json({ cities: CITIES_DATA, source: "in-memory" });
});

// POST /api/cities/seed - Seed or re-seed cities data into MongoDB
router.post("/cities/seed", async (req, res) => {
  if (!getIsConnected()) {
    return res.status(503).json({
      error: "MongoDB is not currently connected.",
      message: "Please ensure MongoDB is running locally or MONGODB_URI environment variable is configured."
    });
  }

  try {
    await City.deleteMany({});
    const created = await City.insertMany(CITIES_DATA);
    res.json({
      success: true,
      message: `Successfully seeded ${created.length} Indian cities into MongoDB!`,
      cities: created
    });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ error: "Failed to seed cities to MongoDB.", message: err.message });
  }
});

// POST /api/optimize - Compute optimal route sequence using Held-Karp DP
router.post("/optimize", async (req, res) => {
  try {
    const { placeIds, cityId = "udaipur", mode = "foot", roundTrip = false, startPlaceId = null } = req.body;

    if (!placeIds || !Array.isArray(placeIds) || placeIds.length === 0) {
      return res.status(400).json({ error: "Please provide a non-empty array of placeIds." });
    }

    let selectedPlaces = [];

    // Attempt MongoDB lookup first if connected
    if (getIsConnected()) {
      try {
        const dbCity = await City.findOne({ id: cityId.toLowerCase() }).lean();
        if (dbCity && dbCity.places) {
          selectedPlaces = placeIds
            .map((id) => dbCity.places.find((p) => p.id === id))
            .filter(Boolean);
        }
      } catch (err) {
        console.warn("MongoDB place lookup fallback:", err.message);
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

    res.json(optimizationResult);
  } catch (err) {
    console.error("Optimization Error:", err);
    res.status(500).json({ error: "Failed to optimize route.", message: err.message });
  }
});

// POST /api/route-geometry - Get GeoJSON route polyline coordinates
router.post("/route-geometry", async (req, res) => {
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
    res.json({ geometry });
  } catch (err) {
    console.error("Geometry Error:", err);
    res.status(500).json({ error: "Failed to fetch route geometry.", message: err.message });
  }
});

// POST /api/trips - Save an optimized route to MongoDB
router.post("/trips", async (req, res) => {
  if (!getIsConnected()) {
    return res.status(503).json({
      error: "MongoDB is not currently connected.",
      message: "MongoDB connection required to persist trips."
    });
  }

  try {
    const {
      title,
      cityId,
      cityName,
      placeIds,
      order,
      legs,
      totalDistance,
      totalDuration,
      travelMode,
      roundTrip,
      startPlaceId,
      estimated
    } = req.body;

    const tripId = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newTrip = new Trip({
      tripId,
      title: title || `${cityName} Sightseeing Route`,
      cityId,
      cityName,
      placeIds,
      order,
      legs,
      totalDistance,
      totalDuration,
      travelMode,
      roundTrip,
      startPlaceId,
      estimated
    });

    await newTrip.save();

    res.json({
      success: true,
      tripId,
      trip: newTrip
    });
  } catch (err) {
    console.error("Save Trip error:", err);
    res.status(500).json({ error: "Failed to save trip to MongoDB.", message: err.message });
  }
});

// GET /api/trips/:tripId - Retrieve a saved trip from MongoDB by ID
router.get("/trips/:tripId", async (req, res) => {
  if (!getIsConnected()) {
    return res.status(503).json({ error: "MongoDB is not connected." });
  }

  try {
    const trip = await Trip.findOne({ tripId: req.params.tripId }).lean();
    if (!trip) {
      return res.status(404).json({ error: "Trip not found." });
    }
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trip.", message: err.message });
  }
});

// GET /api/trips - List recent saved trips from MongoDB
router.get("/trips", async (req, res) => {
  if (!getIsConnected()) {
    return res.status(503).json({ error: "MongoDB is not connected." });
  }

  try {
    const trips = await Trip.find({}).sort({ createdAt: -1 }).limit(20).lean();
    res.json({ trips });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved trips.", message: err.message });
  }
});

module.exports = router;

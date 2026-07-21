const { getIsConnected } = require("../config/db");
const Trip = require("../models/Trip");

/**
 * POST /api/trips - Save an optimized route to MongoDB
 */
exports.saveTrip = async (req, res, next) => {
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

    return res.json({
      success: true,
      tripId,
      trip: newTrip
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips/:tripId - Retrieve a saved trip by ID
 */
exports.getTripById = async (req, res, next) => {
  if (!getIsConnected()) {
    return res.status(503).json({ error: "MongoDB is not connected." });
  }

  try {
    const trip = await Trip.findOne({ tripId: req.params.tripId }).lean();
    if (!trip) {
      return res.status(404).json({ error: "Trip not found." });
    }
    return res.json({ trip });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips - List recent saved trips
 */
exports.getRecentTrips = async (req, res, next) => {
  if (!getIsConnected()) {
    return res.status(503).json({ error: "MongoDB is not connected." });
  }

  try {
    const trips = await Trip.find({}).sort({ createdAt: -1 }).limit(20).lean();
    return res.json({ trips });
  } catch (err) {
    next(err);
  }
};

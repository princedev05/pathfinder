import { getIsConnected } from "../db/index.js";
import Trip from "../models/Trip.js";
import { asyncHandler } from "../utils/async-Handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * POST /api/trips - Save an optimized route to MongoDB
 */
const saveTrip = asyncHandler(async (req, res) => {
  if (!getIsConnected()) {
    throw new ApiError(503, "MongoDB connection required to persist trips.");
  }

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
    userId: req.user._id,
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

  return res.status(200).json(
    new ApiResponse(200, { tripId, trip: newTrip }, "Trip saved successfully")
  );
});

/**
 * GET /api/trips/:tripId - Retrieve a saved trip by ID
 */
const getTripById = asyncHandler(async (req, res) => {
  if (!getIsConnected()) {
    throw new ApiError(503, "MongoDB is not connected.");
  }

  const trip = await Trip.findOne({ tripId: req.params.tripId, userId: req.user._id }).lean();
  if (!trip) {
    throw new ApiError(404, "Trip not found.");
  }

  return res.status(200).json(
    new ApiResponse(200, { trip }, "Trip fetched successfully")
  );
});

/**
 * GET /api/trips - List recent saved trips
 */
const getRecentTrips = asyncHandler(async (req, res) => {
  if (!getIsConnected()) {
    throw new ApiError(503, "MongoDB is not connected.");
  }

  const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20).lean();
  
  return res.status(200).json(
    new ApiResponse(200, { trips }, "Recent trips fetched successfully")
  );
});

export { saveTrip, getTripById, getRecentTrips };

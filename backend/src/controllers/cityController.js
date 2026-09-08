import { CITIES_DATA } from "../../data/cities.js";
import { getIsConnected } from "../db/index.js";
import City from "../models/City.js";
import { asyncHandler } from "../utils/async-Handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * GET /api/cities - Returns list of cities
 */
const getCities = asyncHandler(async (req, res) => {
  if (getIsConnected()) {
    const dbCities = await City.find({}).lean();
    if (dbCities && dbCities.length > 0) {
      return res.status(200).json(
        new ApiResponse(200, { cities: dbCities, source: "mongodb" }, "Cities fetched successfully from database")
      );
    }
  }
  return res.status(200).json(
    new ApiResponse(200, { cities: CITIES_DATA, source: "in-memory" }, "Cities fetched successfully from local memory")
  );
});

/**
 * POST /api/cities/seed - Seed cities data into MongoDB
 */
const seedCities = asyncHandler(async (req, res) => {
  if (!getIsConnected()) {
    throw new ApiError(503, "MongoDB is not currently connected. Seed operation unavailable.");
  }

  await City.deleteMany({});
  const created = await City.insertMany(CITIES_DATA);
  
  return res.status(200).json(
    new ApiResponse(
      200,
      { success: true, count: created.length, cities: created },
      `Successfully seeded ${created.length} Indian cities into MongoDB!`
    )
  );
});

export { getCities, seedCities };

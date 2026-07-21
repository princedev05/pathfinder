const { CITIES_DATA } = require("../data/cities");
const { getIsConnected } = require("../config/db");
const City = require("../models/City");

/**
 * GET /api/cities - Returns list of cities
 */
exports.getCities = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const dbCities = await City.find({}).lean();
      if (dbCities && dbCities.length > 0) {
        return res.json({ cities: dbCities, source: "mongodb" });
      }
    }
    return res.json({ cities: CITIES_DATA, source: "in-memory" });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/cities/seed - Seed cities data into MongoDB
 */
exports.seedCities = async (req, res, next) => {
  if (!getIsConnected()) {
    return res.status(503).json({
      error: "MongoDB is not currently connected.",
      message: "Please ensure MongoDB server is running."
    });
  }

  try {
    await City.deleteMany({});
    const created = await City.insertMany(CITIES_DATA);
    return res.json({
      success: true,
      message: `Successfully seeded ${created.length} Indian cities into MongoDB!`,
      cities: created
    });
  } catch (err) {
    next(err);
  }
};

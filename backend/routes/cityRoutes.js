const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

router.get("/", cityController.getCities);
router.post("/seed", cityController.seedCities);

module.exports = router;

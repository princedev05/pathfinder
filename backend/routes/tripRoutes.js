const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.post("/", tripController.saveTrip);
router.get("/", tripController.getRecentTrips);
router.get("/:tripId", tripController.getTripById);

module.exports = router;

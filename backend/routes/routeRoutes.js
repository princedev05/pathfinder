const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");

router.post("/optimize", routeController.handleOptimizeRoute);
router.post("/route-geometry", routeController.handleRouteGeometry);

module.exports = router;

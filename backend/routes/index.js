const express = require("express");
const router = express.Router();

const cityRoutes = require("./cityRoutes");
const routeRoutes = require("./routeRoutes");
const tripRoutes = require("./tripRoutes");

router.use("/cities", cityRoutes);
router.use("/", routeRoutes);
router.use("/trips", tripRoutes);

module.exports = router;

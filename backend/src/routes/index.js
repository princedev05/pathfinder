import { Router } from "express";
import cityRoutes from "./cityRoutes.js";
import authRoutes from "./authRoutes.js";
import routeRoutes from "./routeRoutes.js";
import tripRoutes from "./tripRoutes.js";
import healthcheckRoutes from "./healthcheck.routes.js";

const router = Router();

router.use("/cities", cityRoutes);
router.use("/auth", authRoutes);
router.use("/", routeRoutes);
router.use("/trips", tripRoutes);
router.use("/healthcheck", healthcheckRoutes);

export default router;

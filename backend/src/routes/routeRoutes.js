import { Router } from "express";
import { handleOptimizeRoute, handleRouteGeometry } from "../controllers/routeController.js";

const router = Router();

// Route optimization and polyline geometry calculation
router.post("/optimize", handleOptimizeRoute);
router.post("/route-geometry", handleRouteGeometry);

export default router;

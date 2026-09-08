import { Router } from "express";
import { saveTrip, getRecentTrips, getTripById } from "../controllers/tripController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, saveTrip);
router.get("/", verifyJWT, getRecentTrips);
router.get("/:tripId", verifyJWT, getTripById);

export default router;

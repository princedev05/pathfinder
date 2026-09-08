import { Router } from "express";
import { getCities, seedCities } from "../controllers/cityController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getCities);
router.post("/seed", verifyJWT, seedCities);

export default router;

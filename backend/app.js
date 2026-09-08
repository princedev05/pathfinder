import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoutes from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
// import { verifyJWT } from "./src/middleware/auth.middleware.js";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== "*"
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return callback(null, origin);
    }
    return callback(null, origin);
  },
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"))

app.use(cookieParser());


// Public routes
app.use("/api", apiRoutes);


// Health check on root
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    app: "PathFinder Modular API Server",
    version: "2.0.0",
    architecture: "MVC Controllers + Modular Services (ES Modules)",
    database: "MongoDB (Mongoose)",
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/logout",
      "GET  /api/auth/current-user",
      "POST /api/auth/refresh-token",
      "GET  /api/cities",
      "POST /api/cities/seed",
      "POST /api/optimize",
      "POST /api/route-geometry",
      "POST /api/trips",
      "GET  /api/trips",
      "GET  /api/trips/:tripId",
      "GET  /api/healthcheck"
    ]
  });
});




app.use(errorHandler);

export default app;

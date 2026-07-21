try {
  require("dotenv").config();
} catch (err) {
  // dotenv is optional in environments where variables are set directly
}
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const apiRoutes = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// API Modular Routes
app.use("/api", apiRoutes);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    app: "PathFinder Modular API Server",
    version: "2.0.0",
    architecture: "MVC Controllers + Modular Services",
    database: "MongoDB (Mongoose)",
    endpoints: [
      "GET  /api/cities",
      "POST /api/cities/seed",
      "POST /api/optimize",
      "POST /api/route-geometry",
      "POST /api/trips",
      "GET  /api/trips/:tripId"
    ]
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`PathFinder Modular Backend Server running on http://localhost:${PORT}`);
});

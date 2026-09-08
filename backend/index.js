import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./src/db/index.js";

const PORT = process.env.PORT || 5000;


// Connect to MongoDB (handles in-memory fallback gracefully if db is offline)
connectDB();

app.listen(PORT, () => {
  console.log(`PathFinder Modular Backend Server running on http://localhost:${PORT}`);
});

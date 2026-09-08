import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pathfinder";
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Quick timeout to fallback if local db is down
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${mongoURI}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Connection skipped (${error.message}). Application running in in-memory dataset mode.`);
  }
};

const getIsConnected = () => isConnected;

export { connectDB, getIsConnected };
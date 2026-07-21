const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pathfinder";
  
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Quick timeout if MongoDB is not running locally
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${mongoURI}`);
  } catch (err) {
    isConnected = false;
    console.warn(`[MongoDB] Connection skipped (${err.message}). Application using in-memory dataset mode.`);
  }
}

function getIsConnected() {
  return isConnected;
}

module.exports = { connectDB, getIsConnected };

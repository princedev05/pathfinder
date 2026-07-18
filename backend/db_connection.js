import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUrl =
            (process.env.MONGODB_URL || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/intelliroute").trim();
        const dbName = process.env.MONGO_DB_NAME || process.env.DB_NAME || "pathfinder";
        const normalizedMongoUrl = /\/[^/?#]+(?:\?|#|$)/.test(mongoUrl)
            ? mongoUrl
            : `${mongoUrl.replace(/\/?$/, "")}/${dbName}`;

        const instance = await mongoose.connect(normalizedMongoUrl, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`==> MongoDB Connected: ${instance.connection.host}`);
        return instance;
    } catch (error) {
        console.warn(
            "MongoDB connection unavailable. Continuing without a database for now:",
            error.message
        );
        return null;
    }
};
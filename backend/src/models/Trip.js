import mongoose from "mongoose";

const LegSchema = new mongoose.Schema({
  from: { type: String },
  to: { type: String },
  distance: { type: Number },
  duration: { type: Number }
});

const TripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tripId: { type: String, required: true, unique: true },
    title: { type: String, default: "Optimized Trip" },
    cityId: { type: String, required: true },
    cityName: { type: String, required: true },
    placeIds: [{ type: String }],
    order: [{ type: String }],
    legs: [LegSchema],
    totalDistance: { type: Number },
    totalDuration: { type: Number },
    travelMode: { type: String, default: "foot" },
    roundTrip: { type: Boolean, default: false },
    startPlaceId: { type: String },
    estimated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;

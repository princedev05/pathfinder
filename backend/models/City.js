const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  category: { type: String, default: "Attraction" },
  suggestedVisitMinutes: { type: Number, default: 60 },
  description: { type: String },
  image: { type: String }
});

const CitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    state: { type: String },
    country: { type: String, default: "India" },
    center: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    zoom: { type: Number, default: 13 },
    description: { type: String },
    places: [PlaceSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", CitySchema);

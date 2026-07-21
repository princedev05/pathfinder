import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Navigation,
  Footprints,
  Bike,
  Car,
  Trash2,
  ExternalLink,
  Plus,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle,
  Share2,
  Database
} from "lucide-react";
import MapView from "./MapView";
import { saveTripApi } from "../utils/api";

export default function Results({
  city,
  orderedPlaces = [],
  optimizationData = {},
  routeGeometry = null,
  travelMode,
  onChangeMode,
  roundTrip,
  onToggleRoundTrip,
  onRemovePlace,
  onAddMorePlaces,
  onReOptimize
}) {
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedTripId, setSavedTripId] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const handleSaveTrip = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await saveTripApi({
        title: `${city?.name || 'India'} Trip Route`,
        cityId: city?.id || "udaipur",
        cityName: city?.name || "Udaipur",
        placeIds: orderedPlaces.map((p) => p.id),
        order: optimizationData.order || orderedPlaces.map((p) => p.id),
        legs: optimizationData.legs || [],
        totalDistance: optimizationData.totalDistance || 0,
        totalDuration: optimizationData.totalDuration || 0,
        travelMode,
        roundTrip,
        startPlaceId: orderedPlaces[0]?.id,
        estimated: optimizationData.estimated || false
      });
      if (res && res.tripId) {
        setSavedTripId(res.tripId);
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || "Failed to save trip");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate summary metrics
  const totalDistMeters = optimizationData.totalDistance || 0;
  const totalDistKm = (totalDistMeters / 1000).toFixed(1);
  const totalDistMiles = (totalDistMeters * 0.000621371).toFixed(1);

  const totalTravelSeconds = optimizationData.totalDuration || 0;
  const totalTravelMinutes = Math.round(totalTravelSeconds / 60);

  const totalVisitMinutes = orderedPlaces.reduce(
    (sum, p) => sum + (p.suggestedVisitMinutes || 45),
    0
  );

  const totalDayMinutes = totalTravelMinutes + totalVisitMinutes;
  const dayHours = Math.floor(totalDayMinutes / 60);
  const dayMins = totalDayMinutes % 60;

  // Build Google Maps Multi-stop directions URL
  const buildGoogleMapsUrl = () => {
    if (orderedPlaces.length === 0) return "#";
    const origin = `${orderedPlaces[0].lat},${orderedPlaces[0].lng}`;
    const destination = roundTrip
      ? origin
      : `${orderedPlaces[orderedPlaces.length - 1].lat},${orderedPlaces[orderedPlaces.length - 1].lng}`;

    let waypoints = [];
    if (roundTrip) {
      waypoints = orderedPlaces.slice(1).map((p) => `${p.lat},${p.lng}`);
    } else {
      waypoints = orderedPlaces.slice(1, -1).map((p) => `${p.lat},${p.lng}`);
    }

    const waypointsStr = waypoints.length > 0 ? `&waypoints=${waypoints.join("|")}` : "";
    const travelmodeParam = travelMode === "car" ? "driving" : travelMode === "bike" ? "bicycling" : "walking";

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsStr}&travelmode=${travelmodeParam}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Metric Summary Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative wave */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded">
                Optimal Route Solved
              </span>
              {optimizationData.estimated && (
                <span className="bg-slate-800 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded flex items-center space-x-1">
                  <Info className="w-3 h-3 text-amber-400" />
                  <span>Haversine Fallback Matrix</span>
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-2">
              Your {city?.name || "City"} Sightseeing Itinerary
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {orderedPlaces.length} places optimized in mathematically shortest visiting sequence
            </p>
          </div>

          {/* Export & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveTrip}
              disabled={isSaving}
              className="px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-900/20 transition-all flex items-center space-x-2 border border-teal-400/40"
            >
              <Database className="w-4 h-4 text-amber-300" />
              <span>{savedTripId ? "Saved to MongoDB ✓" : isSaving ? "Saving..." : "Save to MongoDB"}</span>
            </button>

            <a
              href={buildGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Maps</span>
            </a>

            <button
              onClick={onAddMorePlaces}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Modify Spots</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Counters */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-teal-400" />
              <span>Total Distance</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {totalDistKm} km <span className="text-xs text-slate-400 font-normal">({totalDistMiles} mi)</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Transit Time</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {totalTravelMinutes} mins
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Sightseeing Time</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {Math.round(totalVisitMinutes / 60)} hrs {totalVisitMinutes % 60} mins
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Total Day Plan</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {dayHours}h {dayMins}m
            </div>
          </div>
        </div>
      </div>

      {/* Mode & Options Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Travel Mode Pills */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Mode:
          </span>
          <button
            onClick={() => onChangeMode("foot")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              travelMode === "foot"
                ? "bg-teal-700 text-white border-teal-800 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Footprints className="w-3.5 h-3.5 text-amber-400" />
            <span>Walking</span>
          </button>

          <button
            onClick={() => onChangeMode("bike")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              travelMode === "bike"
                ? "bg-teal-700 text-white border-teal-800 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-amber-400" />
            <span>Bicycle</span>
          </button>

          <button
            onClick={() => onChangeMode("car")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              travelMode === "car"
                ? "bg-teal-700 text-white border-teal-800 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Car className="w-3.5 h-3.5 text-amber-400" />
            <span>Driving</span>
          </button>
        </div>

        {/* Round Trip Toggle */}
        <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={roundTrip}
            onChange={onToggleRoundTrip}
            className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
          />
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>Return to start (Round Trip)</span>
        </label>
      </div>

      {/* Main Split View Layout: Left Timeline, Right Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Step-by-Step Itinerary List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Optimal Sequence
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Hover over a stop to highlight on map
            </span>
          </div>

          <div className="space-y-3">
            {orderedPlaces.map((place, idx) => {
              const leg = optimizationData.legs ? optimizationData.legs[idx] : null;
              const legDistKm = leg ? (leg.distance / 1000).toFixed(2) : null;
              const legDurationMins = leg ? Math.round(leg.duration / 60) : null;

              return (
                <React.Fragment key={place.id}>
                  {/* Sequence Card */}
                  <div
                    onMouseEnter={() => setHoveredPlaceId(place.id)}
                    onMouseLeave={() => setHoveredPlaceId(null)}
                    className={`group rounded-2xl bg-white p-4 border transition-all duration-200 relative flex items-center justify-between gap-4 ${
                      idx === 0
                        ? "border-teal-600 ring-2 ring-teal-600/20 bg-teal-50/20 shadow-md"
                        : hoveredPlaceId === place.id
                        ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md bg-amber-50/20"
                        : "border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    {/* Number Badge & Details */}
                    <div className="flex items-center space-x-4 min-w-0">
                      {/* Sequence Badge */}
                      <div className={`w-10 h-10 rounded-2xl text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105 ${
                        idx === 0 ? "bg-amber-500 text-slate-950 shadow-amber-500/30" : "bg-teal-700 shadow-teal-900/10"
                      }`}>
                        {idx === 0 ? "🚩 1" : idx + 1}
                      </div>

                      {/* Photo Thumbnail */}
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                      />

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          {idx === 0 && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-950 bg-amber-400 px-2 py-0.5 rounded shadow-2xs">
                              Starting Point
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {place.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 truncate mt-0.5">
                          {place.name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>~{place.suggestedVisitMinutes} mins visit</span>
                        </p>
                      </div>
                    </div>

                    {/* Remove Place Action */}
                    {orderedPlaces.length > 2 && (
                      <button
                        onClick={() => onRemovePlace(place.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                        title="Remove spot & re-optimize"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Inter-stop Leg Badge (Between Stop i and Stop i+1) */}
                  {leg && idx < orderedPlaces.length - 1 && (
                    <div className="py-1 px-4 my-1 flex items-center justify-center">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-2xs">
                        <Navigation className="w-3 h-3 text-teal-600" />
                        <span>
                          Leg {idx + 1} → {idx + 2}: <strong className="text-slate-900">{legDistKm} km</strong> ({legDurationMins} mins {travelMode})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Return leg for Round Trip */}
                  {roundTrip && idx === orderedPlaces.length - 1 && leg && (
                    <div className="py-1 px-4 my-1 flex items-center justify-center">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-800">
                        <RotateCcw className="w-3 h-3 text-amber-600" />
                        <span>
                          Return to Start: <strong className="text-slate-900">{legDistKm} km</strong> ({legDurationMins} mins)
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Persistent Interactive Leaflet Map */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Interactive Route Map</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Numbered 1 → {orderedPlaces.length}
              </span>
            </div>

            <div className="h-[520px]">
              <MapView
                city={city}
                orderedPlaces={orderedPlaces}
                routeGeometry={routeGeometry}
                activeHoverPlaceId={hoveredPlaceId}
                onMarkerClick={(id) => setHoveredPlaceId(id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

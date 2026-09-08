import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Footprints,
  Bike,
  Car,
  Trash2,
  ExternalLink,
  Plus,
  RotateCcw,
  Info,
  Database,
  Route
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

  const dataPayload = optimizationData?.data || optimizationData || {};

  const handleSaveTrip = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await saveTripApi({
        title: `${city?.name || 'India'} Trip Route`,
        cityId: city?.id || "udaipur",
        cityName: city?.name || "Udaipur",
        placeIds: orderedPlaces.map((p) => p.id),
        order: dataPayload.order || orderedPlaces.map((p) => p.id),
        legs: dataPayload.legs || [],
        totalDistance: dataPayload.totalDistance || 0,
        totalDuration: dataPayload.totalDuration || 0,
        travelMode,
        roundTrip,
        startPlaceId: orderedPlaces[0]?.id,
        estimated: dataPayload.estimated || false
      });
      if (res && (res.tripId || res.data?.tripId)) {
        setSavedTripId(res.tripId || res.data?.tripId);
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || "Failed to save trip");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate summary distance metrics
  const totalDistMeters = dataPayload.totalDistance || 0;
  const totalDistKm = (totalDistMeters / 1000).toFixed(1);
  const totalDistMiles = (totalDistMeters * 0.000621371).toFixed(1);

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
      {/* Distance Metric Summary Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded">
                Optimal Distance Sequence Solved
              </span>
              {optimizationData.estimated && (
                <span className="bg-slate-800 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded flex items-center space-x-1 border border-slate-700">
                  <Info className="w-3 h-3 text-amber-400" />
                  <span>Haversine Distance Matrix</span>
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
              {city?.name || "City"} Sightseeing Sequence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {orderedPlaces.length} destinations arranged in mathematically shortest visiting order
            </p>
          </div>

          {/* Export & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSaveTrip}
              disabled={isSaving}
              className="px-3.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-medium text-xs shadow-sm transition-colors flex items-center space-x-2 border border-teal-500/30"
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              <span>{savedTripId ? "Saved ✓" : isSaving ? "Saving..." : "Save Route"}</span>
            </button>

            <a
              href={buildGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>

            <button
              onClick={onAddMorePlaces}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>Modify Spots</span>
            </button>
          </div>
        </div>

        {/* Distance Stat Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-teal-400" />
              <span>Total Distance</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {totalDistKm} km <span className="text-xs text-slate-400 font-normal">({totalDistMiles} miles)</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Route className="w-3.5 h-3.5 text-amber-400" />
              <span>Visiting Sequence Length</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {orderedPlaces.length} <span className="text-xs text-slate-400 font-normal">Sightseeing Spots</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode & Options Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Travel Mode Pills */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Distance Mode:
          </span>
          <button
            onClick={() => onChangeMode("foot")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors border ${
              travelMode === "foot"
                ? "bg-teal-700 text-white border-teal-800"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Footprints className="w-3.5 h-3.5 text-amber-400" />
            <span>Walking</span>
          </button>

          <button
            onClick={() => onChangeMode("bike")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors border ${
              travelMode === "bike"
                ? "bg-teal-700 text-white border-teal-800"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-amber-400" />
            <span>Bicycle</span>
          </button>

          <button
            onClick={() => onChangeMode("car")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors border ${
              travelMode === "car"
                ? "bg-teal-700 text-white border-teal-800"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Step-by-Step Distance Sequence List */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">
              Visiting Sequence
            </h3>
            <span className="text-xs text-slate-500">
              Hover over a stop to highlight on map
            </span>
          </div>

          <div className="space-y-2.5">
            {orderedPlaces.map((place, idx) => {
              const leg = optimizationData.legs ? optimizationData.legs[idx] : null;
              const legDistKm = leg ? (leg.distance / 1000).toFixed(2) : null;

              return (
                <React.Fragment key={`${place.id}-${idx}`}>
                  {/* Sequence Card */}
                  <div
                    onMouseEnter={() => setHoveredPlaceId(place.id)}
                    onMouseLeave={() => setHoveredPlaceId(null)}
                    className={`rounded-xl bg-white p-3.5 border transition-all duration-150 flex items-center justify-between gap-3 ${
                      idx === 0
                        ? "border-teal-600 ring-1 ring-teal-600/30 bg-teal-50/20"
                        : hoveredPlaceId === place.id
                        ? "border-amber-500 ring-1 ring-amber-500/30 bg-amber-50/20"
                        : "border-slate-200 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    {/* Number Badge & Details */}
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Sequence Badge */}
                      <div className={`w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                        idx === 0 ? "bg-amber-500 text-slate-950 font-extrabold" : "bg-teal-700"
                      }`}>
                        {idx === 0 ? "1" : idx + 1}
                      </div>

                      {/* Photo Thumbnail */}
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                      />

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          {idx === 0 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded">
                              Start
                            </span>
                          )}
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {place.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 truncate mt-0.5">
                          {place.name}
                        </h4>
                      </div>
                    </div>

                    {/* Remove Place Action */}
                    {orderedPlaces.length > 2 && (
                      <button
                        onClick={() => onRemovePlace(place.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                        title="Remove spot & re-optimize"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Inter-stop Leg Distance Badge */}
                  {leg && idx < orderedPlaces.length - 1 && (
                    <div className="py-0.5 px-4 flex items-center justify-center">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700">
                        <Navigation className="w-3 h-3 text-teal-600" />
                        <span>
                          Distance to Stop {idx + 2}: <strong className="text-slate-900 font-bold">{legDistKm} km</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Return leg for Round Trip */}
                  {roundTrip && idx === orderedPlaces.length - 1 && leg && (
                    <div className="py-0.5 px-4 flex items-center justify-center">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-900">
                        <RotateCcw className="w-3 h-3 text-amber-600" />
                        <span>
                          Return Distance to Start: <strong className="text-slate-900 font-bold">{legDistKm} km</strong>
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
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Route Map</span>
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

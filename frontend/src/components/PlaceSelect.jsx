import React, { useState, useMemo } from "react";
import { Search, MapPin, Check, Footprints, Bike, Car, RotateCcw, Sparkles, Clock, AlertCircle, Flag, Navigation } from "lucide-react";

export default function PlaceSelect({
  cities = [],
  selectedCity,
  onSelectCity,
  selectedPlaceIds,
  onTogglePlace,
  onSelectAll,
  onClearAll,
  travelMode,
  onChangeMode,
  roundTrip,
  onToggleRoundTrip,
  startPlaceId,
  onChangeStartPlace,
  onOptimize
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const currentCity = selectedCity || cities[0] || { places: [] };
  const places = currentCity.places || [];

  // Filter categories
  const categories = useMemo(() => {
    const set = new Set(places.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [places]);

  // Filtered places search & category
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || place.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [places, searchQuery, selectedCategory]);

  const selectedCount = selectedPlaceIds.length;
  const selectedPlaceObjects = useMemo(() => {
    return selectedPlaceIds.map(id => places.find(p => p.id === id)).filter(Boolean);
  }, [selectedPlaceIds, places]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar - City Chooser & Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Step 2 of 3 • India Route Planner
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Select Destinations in {currentCity.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pick 4–8 attractions in {currentCity.name}, set your starting point, and we'll calculate the optimal order.
          </p>
        </div>

        {/* City Switcher */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 border ${
                currentCity.id === city.id
                  ? "bg-teal-700 text-white border-teal-800 shadow-md shadow-teal-900/10"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prominent Starting Point & Route Options Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* 1. Explicit Starting Point Picker */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center space-x-1.5">
              <Flag className="w-4 h-4 text-amber-400" />
              <span>1. Choose Starting Location</span>
            </label>
            <select
              value={startPlaceId || ""}
              onChange={(e) => onChangeStartPlace(e.target.value || null)}
              className="w-full bg-slate-800 text-amber-300 border-2 border-amber-500/50 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-inner"
            >
              <option value="">Auto-Detect Shortest Starting Spot</option>
              {selectedPlaceObjects.map((p) => (
                <option key={p.id} value={p.id}>
                  📍 Start at: {p.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              The optimizer will begin your journey at this location.
            </p>
          </div>

          {/* 2. Travel Mode Selector */}
          <div className="md:col-span-4 space-y-2">
            <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider">
              2. Travel Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChangeMode("foot")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border ${
                  travelMode === "foot"
                    ? "bg-teal-600 text-white border-teal-400 shadow-md"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
                }`}
              >
                <Footprints className="w-4 h-4 text-amber-400" />
                <span>Walk</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeMode("bike")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border ${
                  travelMode === "bike"
                    ? "bg-teal-600 text-white border-teal-400 shadow-md"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
                }`}
              >
                <Bike className="w-4 h-4 text-amber-400" />
                <span>Cycle</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeMode("car")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border ${
                  travelMode === "car"
                    ? "bg-teal-600 text-white border-teal-400 shadow-md"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
                }`}
              >
                <Car className="w-4 h-4 text-amber-400" />
                <span>Drive</span>
              </button>
            </div>
          </div>

          {/* 3. Round-Trip Option */}
          <div className="md:col-span-3">
            <label className="flex items-center space-x-3 cursor-pointer bg-slate-800 p-2.5 rounded-xl border border-slate-700 hover:bg-slate-750 transition-colors">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={onToggleRoundTrip}
                className="w-4 h-4 text-teal-600 rounded border-slate-600 focus:ring-teal-500 focus:ring-offset-slate-900"
              />
              <div className="flex items-center space-x-2 text-xs">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">
                  Return to Start
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Quick Start Location Selector Pills */}
        {selectedPlaceObjects.length > 0 && (
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Quick set start:</span>
            {selectedPlaceObjects.map((p) => {
              const isStart = startPlaceId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChangeStartPlace(isStart ? null : p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all border ${
                    isStart
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  <Flag className="w-3 h-3" />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Counter Bar & Action CTA */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs">
            <div
              className={`px-3 py-1.5 rounded-lg font-bold ${
                selectedCount >= 2 && selectedCount <= 12
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {selectedCount} of 12 Places Selected
            </div>
            {selectedCount < 2 && (
              <span className="text-slate-400 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Select at least 2 spots to compute optimal route</span>
              </span>
            )}
          </div>

          <button
            onClick={onOptimize}
            disabled={selectedCount < 2}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 group"
          >
            <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>Optimize Order with Held-Karp DP</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={`Search ${currentCity.name} attractions...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Select Buttons */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <button
            onClick={() => onSelectAll(filteredPlaces.map((p) => p.id))}
            className="px-3 py-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Grid of Attraction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => {
          const isSelected = selectedPlaceIds.includes(place.id);
          const isStart = startPlaceId === place.id;

          return (
            <div
              key={place.id}
              onClick={() => onTogglePlace(place.id)}
              className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 relative bg-white flex flex-col justify-between ${
                isSelected
                  ? "border-teal-600 ring-2 ring-teal-600/30 shadow-md"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              {/* Checkbox badge overlay */}
              <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
                {isSelected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeStartPlace(isStart ? null : place.id);
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1 shadow transition-all ${
                      isStart
                        ? "bg-amber-500 text-slate-950 border border-amber-400"
                        : "bg-slate-900/80 text-white hover:bg-amber-500 hover:text-slate-950 backdrop-blur-sm"
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    <span>{isStart ? "Start Point" : "Set Start"}</span>
                  </button>
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-teal-700 text-white shadow-md scale-105"
                      : "bg-slate-900/60 text-transparent backdrop-blur-sm group-hover:text-white/50"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Place Image */}
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={place.image}
                    alt={place.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isSelected ? "scale-105" : "group-hover:scale-105"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">
                      {place.category}
                    </span>
                    <h3 className="font-bold text-base mt-1 line-clamp-1">
                      {place.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2 text-slate-600 text-xs">
                  <p className="line-clamp-2 leading-relaxed text-slate-600">
                    {place.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 pb-4 pt-2 flex items-center justify-between text-slate-500 font-medium border-t border-slate-100 text-xs">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>~{place.suggestedVisitMinutes} min visit</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

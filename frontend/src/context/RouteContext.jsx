import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCities, optimizeRouteApi, fetchRouteGeometryApi } from "../utils/api";

const RouteContext = createContext(null);

export function RouteProvider({ children }) {
  const [activeStep, setActiveStep] = useState("landing"); // 'landing' | 'select' | 'loading' | 'results'
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  
  // Selection state
  const [selectedPlaceIds, setSelectedPlaceIds] = useState([]);
  const [travelMode, setTravelMode] = useState("foot"); // 'foot' | 'bike' | 'car'
  const [roundTrip, setRoundTrip] = useState(false);
  const [startPlaceId, setStartPlaceId] = useState(null);

  // Result state
  const [optimizationData, setOptimizationData] = useState(null);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [orderedPlaces, setOrderedPlaces] = useState([]);

  // Fetch Cities on Mount
  useEffect(() => {
    async function loadCities() {
      const data = await fetchCities();
      setCities(data);
      if (data.length > 0 && !selectedCity) {
        // Default to first city if none selected
        const defaultCity = data[0]; // Udaipur
        setSelectedCity(defaultCity);
        setSelectedPlaceIds(defaultCity.places.slice(0, 5).map((p) => p.id));
        if (defaultCity.places.length > 0) {
          setStartPlaceId(defaultCity.places[0].id);
        }
      }
    }
    loadCities();
  }, []);

  // Change Active City without forced reset
  const handleSelectCity = (city) => {
    setSelectedCity(city);
    // Select first 5 spots in the newly chosen city
    const defaultSelected = city.places.slice(0, 5).map((p) => p.id);
    setSelectedPlaceIds(defaultSelected);
    setStartPlaceId(city.places.length > 0 ? city.places[0].id : null);
  };

  // Toggle place selection
  const handleTogglePlace = (placeId) => {
    setSelectedPlaceIds((prev) => {
      if (prev.includes(placeId)) {
        const updated = prev.filter((id) => id !== placeId);
        if (startPlaceId === placeId) setStartPlaceId(null);
        return updated;
      } else {
        if (prev.length >= 12) return prev;
        return [...prev, placeId];
      }
    });
  };

  // Remove place from Results & re-optimize
  const handleRemovePlace = async (placeId) => {
    const updatedIds = selectedPlaceIds.filter((id) => id !== placeId);
    setSelectedPlaceIds(updatedIds);
    if (updatedIds.length >= 2) {
      await runOptimization(updatedIds, travelMode, roundTrip, startPlaceId);
    } else {
      setActiveStep("select");
    }
  };

  // Run Route Optimization
  const runOptimization = async (
    ids = selectedPlaceIds,
    mode = travelMode,
    rt = roundTrip,
    sp = startPlaceId
  ) => {
    if (ids.length < 2 || !selectedCity) return;

    setActiveStep("loading");

    try {
      const result = await optimizeRouteApi({
        placeIds: ids,
        cityId: selectedCity.id,
        mode,
        roundTrip: rt,
        startPlaceId: sp
      });

      setOptimizationData(result);

      // Map order IDs back to place objects
      const allPlaces = selectedCity ? selectedCity.places : [];
      const ordered = result.order
        .map((id) => allPlaces.find((p) => p.id === id))
        .filter(Boolean);

      setOrderedPlaces(ordered);

      // Fetch geometry for map polyline
      const geometry = await fetchRouteGeometryApi({
        order: result.order,
        cityId: selectedCity.id,
        mode,
        places: ordered
      });

      setRouteGeometry(geometry);
    } catch (err) {
      console.error("Optimization error:", err);
    }
  };

  // Mode change handler
  const handleModeChange = async (newMode) => {
    setTravelMode(newMode);
    if (activeStep === "results" && selectedPlaceIds.length >= 2) {
      await runOptimization(selectedPlaceIds, newMode, roundTrip, startPlaceId);
    }
  };

  // Round trip toggle handler
  const handleToggleRoundTrip = async () => {
    const nextRt = !roundTrip;
    setRoundTrip(nextRt);
    if (activeStep === "results" && selectedPlaceIds.length >= 2) {
      await runOptimization(selectedPlaceIds, travelMode, nextRt, startPlaceId);
    }
  };

  // Reset plan for CURRENT city (does NOT reset selected city back to Udaipur!)
  const handleResetPlan = () => {
    if (selectedCity) {
      setSelectedPlaceIds(selectedCity.places.slice(0, 5).map((p) => p.id));
      if (selectedCity.places.length > 0) {
        setStartPlaceId(selectedCity.places[0].id);
      }
    }
    setRoundTrip(false);
    setTravelMode("foot");
    setActiveStep("select");
  };

  const value = {
    activeStep,
    setActiveStep,
    cities,
    selectedCity,
    handleSelectCity,
    selectedPlaceIds,
    setSelectedPlaceIds,
    handleTogglePlace,
    travelMode,
    handleModeChange,
    roundTrip,
    handleToggleRoundTrip,
    startPlaceId,
    setStartPlaceId,
    optimizationData,
    routeGeometry,
    orderedPlaces,
    handleRemovePlace,
    runOptimization,
    handleResetPlan
  };

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
}

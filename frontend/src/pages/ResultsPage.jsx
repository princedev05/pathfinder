import React from "react";
import Results from "../components/Results";
import { useRoute } from "../context/RouteContext";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const navigate = useNavigate();
  const {
    selectedCity,
    orderedPlaces,
    optimizationData,
    routeGeometry,
    travelMode,
    handleModeChange,
    roundTrip,
    handleToggleRoundTrip,
    handleRemovePlace,
    runOptimization
  } = useRoute();

  return (
    <Results
      city={selectedCity}
      orderedPlaces={orderedPlaces}
      optimizationData={optimizationData}
      routeGeometry={routeGeometry}
      travelMode={travelMode}
      onChangeMode={handleModeChange}
      roundTrip={roundTrip}
      onToggleRoundTrip={handleToggleRoundTrip}
      onRemovePlace={handleRemovePlace}
      onAddMorePlaces={() => navigate("/select")}
      onReOptimize={() => runOptimization()}
    />
  );
}

import React from "react";
import Results from "../components/Results";
import { useRoute } from "../context/RouteContext";

export default function ResultsPage() {
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
    setActiveStep,
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
      onAddMorePlaces={() => setActiveStep("select")}
      onReOptimize={() => runOptimization()}
    />
  );
}

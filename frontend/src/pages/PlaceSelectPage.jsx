import React from "react";
import PlaceSelect from "../components/PlaceSelect";
import { useRoute } from "../context/RouteContext";

export default function PlaceSelectPage() {
  const {
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
    runOptimization
  } = useRoute();

  return (
    <PlaceSelect
      cities={cities}
      selectedCity={selectedCity}
      onSelectCity={handleSelectCity}
      selectedPlaceIds={selectedPlaceIds}
      onTogglePlace={handleTogglePlace}
      onSelectAll={(ids) => setSelectedPlaceIds(ids.slice(0, 12))}
      onClearAll={() => setSelectedPlaceIds([])}
      travelMode={travelMode}
      onChangeMode={handleModeChange}
      roundTrip={roundTrip}
      onToggleRoundTrip={handleToggleRoundTrip}
      startPlaceId={startPlaceId}
      onChangeStartPlace={setStartPlaceId}
      onOptimize={() => runOptimization()}
    />
  );
}

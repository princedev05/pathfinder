import React from "react";
import PlaceSelect from "../components/PlaceSelect";
import { useRoute } from "../context/RouteContext";
import { useNavigate } from "react-router-dom";

export default function PlaceSelectPage() {
  const navigate = useNavigate();
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

  const handleOptimize = async () => {
    await runOptimization();
    navigate("/results");
  };

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
      onOptimize={handleOptimize}
    />
  );
}

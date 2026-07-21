import React from "react";
import Landing from "../components/Landing";
import { useRoute } from "../context/RouteContext";

export default function LandingPage() {
  const { cities, handleSelectCity, setActiveStep } = useRoute();

  return (
    <Landing
      cities={cities}
      onSelectCity={handleSelectCity}
      onStartPlanning={() => setActiveStep("select")}
    />
  );
}

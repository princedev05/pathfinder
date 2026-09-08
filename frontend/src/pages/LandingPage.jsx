import React from "react";
import Landing from "../components/Landing";
import { useRoute } from "../context/RouteContext";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { cities, handleSelectCity } = useRoute();
  const navigate = useNavigate();

  return (
    <Landing
      cities={cities}
      onSelectCity={handleSelectCity}
      onStartPlanning={() => navigate("/select")}
    />
  );
}

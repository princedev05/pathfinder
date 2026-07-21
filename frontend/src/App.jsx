import React, { useEffect } from "react";
import { RouteProvider, useRoute } from "./context/RouteContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import PlaceSelectPage from "./pages/PlaceSelectPage";
import ResultsPage from "./pages/ResultsPage";
import RouteLoader from "./components/RouteLoader";

function AppContent() {
  const { activeStep, setActiveStep, handleResetPlan } = useRoute();

  // Sync state with URL hash for modular routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "select" || hash === "results" || hash === "landing") {
        setActiveStep(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [setActiveStep]);

  const handleNavigate = (step) => {
    setActiveStep(step);
    window.location.hash = step;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar
        activeStep={activeStep}
        onNavigate={handleNavigate}
        onReset={handleResetPlan}
      />

      <main>
        {activeStep === "landing" && <LandingPage />}
        {activeStep === "select" && <PlaceSelectPage />}
        {activeStep === "loading" && (
          <RouteLoader onComplete={() => handleNavigate("results")} />
        )}
        {activeStep === "results" && <ResultsPage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RouteProvider>
      <AppContent />
    </RouteProvider>
  );
}

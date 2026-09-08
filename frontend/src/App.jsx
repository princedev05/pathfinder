import React from "react";
import { Routes, Route } from "react-router-dom";
import { RouteProvider } from "./context/RouteContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Loader2 } from "lucide-react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import PlaceSelectPage from "./pages/PlaceSelectPage";
import ResultsPage from "./pages/ResultsPage";
import RouteLoader from "./components/RouteLoader";
import Login from "./pages/login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Initializing PathFinder...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/select"
            element={
              <ProtectedRoute>
                <PlaceSelectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loading"
            element={
              <ProtectedRoute>
                <RouteLoader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouteProvider>
        <AppContent />
      </RouteProvider>
    </AuthProvider>
  );
}
import React from "react";
import { ArrowRight, MapPin, Cpu, Route, Navigation, ShieldCheck, Footprints, Sparkles } from "lucide-react";

export default function Landing({ onStartPlanning, onSelectCity, cities = [] }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Smart Sightseeing Route Optimizer</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Find the optimal visiting sequence for your trip.
            </h1>

            {/* Problem & Solution Explanation */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Select destinations in Udaipur, Delhi, Jaipur, Chandigarh, Shimla, or Amritsar. PathFinder calculates the shortest route sequence using the Held-Karp algorithm and OSRM road distance matrices.
            </p>

            {/* Primary Call To Action Button */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onStartPlanning()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Plan Route Now</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Free & Open Source • Custom Starting Location</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-14 sm:mt-18 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Held-Karp Route Solver
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guarantees the true mathematically optimal visiting sequence ($O(n^2 2^n)$) starting from your selected location.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                OSRM Street Matrix
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates actual walking, cycling, or driving travel times over real street road networks via OpenStreetMap.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <Route className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Interactive Leaflet Map
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View road polyline paths, numbered pins (1 → 2 → 3), and export final directions to Google Maps.
              </p>
            </div>
          </div>

          {/* Pre-seeded City Destinations Preview */}
          <div className="mt-16">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Popular Indian Destinations
              </h2>
              <p className="text-xs text-slate-500">
                Select a city to choose attractions and compute your optimal route
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => {
                    if (onSelectCity) onSelectCity(city);
                    onStartPlanning();
                  }}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:border-slate-300 transition-all duration-200"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={city.places[0]?.image || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center space-x-1 text-[11px] text-amber-300 font-semibold mb-0.5 uppercase tracking-wider">
                        <MapPin className="w-3 h-3" />
                        <span>{city.state || city.country}</span>
                      </div>
                      <h3 className="text-lg font-bold">
                        {city.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3.5 flex items-center justify-between text-xs text-slate-600 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center space-x-1">
                      <Footprints className="w-3.5 h-3.5 text-teal-600" />
                      <span>{city.places.length} Attractions</span>
                    </div>
                    <span className="text-teal-700 font-semibold flex items-center space-x-1">
                      <span>Explore</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-1">
          <p className="font-medium text-slate-300">
            PathFinder — Smart Trip Route Optimizer
          </p>
          <p className="text-slate-500">
            Map tiles © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">OpenStreetMap</a> contributors • Routing by <a href="http://project-osrm.org" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">OSRM</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

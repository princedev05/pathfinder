import React from "react";
import { ArrowRight, MapPin, Cpu, Route, Navigation, ShieldCheck, Footprints, Clock, Sparkles } from "lucide-react";

export default function Landing({ onStartPlanning, onSelectCity, cities = [] }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Subtle Map Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#0f766e_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Smart Sightseeing Route Optimizer</span>
            </div>

            {/* Serif Hero Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15]">
              Find the <span className="text-teal-700 underline decoration-amber-400/80 decoration-wavy decoration-2">optimal visiting order</span> for your trip.
            </h1>

            {/* Problem & Solution Explanation */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Pick your destinations and starting location in Udaipur, Delhi, Jaipur, Chandigarh, Shimla, or Amritsar. PathFinder calculates the true shortest route using real street distance matrices.
            </p>

            {/* Primary Call To Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onStartPlanning()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-base shadow-xl shadow-teal-900/20 hover:shadow-teal-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 group"
              >
                <span>Plan My Route Now</span>
                <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>100% Free • Custom Starting Location • Instant Map</span>
              </div>
            </div>
          </div>

          {/* Interactive Feature Cards */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Held-Karp Route Solver
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Guarantees the true mathematically optimal visiting sequence ($O(n^2 2^n)$) starting from your designated location.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                OSRM Real Street Matrix
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calculates actual walking, cycling, or driving travel times over real road networks via OpenStreetMap.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Interactive Leaflet Map
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View connected road polyline paths, custom numbered pins (1 → 2 → 3), and export directly to Google Maps.
              </p>
            </div>
          </div>

          {/* Pre-seeded City Destinations Preview */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Popular Indian Destinations
                </h2>
                <p className="text-sm text-slate-500">
                  Select a city to choose attractions and compute your optimal route
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => {
                    if (onSelectCity) onSelectCity(city);
                    onStartPlanning();
                  }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={city.places[0]?.image || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-semibold mb-0.5 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{city.state || city.country}</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold">
                        {city.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between text-xs text-slate-600 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center space-x-1">
                      <Footprints className="w-4 h-4 text-teal-600" />
                      <span>{city.places.length} Attractions</span>
                    </div>
                    <span className="text-teal-700 font-semibold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
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
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-2">
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

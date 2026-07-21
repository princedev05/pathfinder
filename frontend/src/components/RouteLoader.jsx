import React, { useEffect, useState } from "react";
import { Cpu, Compass, Route, CheckCircle2, Sparkles } from "lucide-react";

export default function RouteLoader({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Querying OSRM Street Matrix",
      desc: "Fetching pairwise travel distance & duration tables across real road networks..."
    },
    {
      title: "Executing Held-Karp Bitmask DP",
      desc: "Computing true minimum cost path over 2^N state space matrix..."
    },
    {
      title: "Generating Leaflet Road Path",
      desc: "Connecting sequence with OpenStreetMap GeoJSON polyline geometry..."
    }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 500);
    const timer2 = setTimeout(() => setCurrentStep(2), 1000);
    const timer3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-lg w-full text-center space-y-8 relative overflow-hidden">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-600 via-amber-500 to-teal-700 animate-pulse" />

        {/* Animated Radar Compass Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-700 animate-spin" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 text-amber-400 flex items-center justify-center shadow-lg shadow-teal-900/30">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>DP Optimization Engine</span>
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Calculating Optimal Route...
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Solving Traveling Salesperson Problem using exact Held-Karp algorithm
          </p>
        </div>

        {/* Dynamic Step Progress */}
        <div className="space-y-4 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step.title}
                className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start space-x-3.5 ${
                  isCurrent
                    ? "bg-teal-50/70 border-teal-300 shadow-sm"
                    : isDone
                    ? "bg-slate-50 border-slate-200 opacity-70"
                    : "bg-white border-slate-100 opacity-40"
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

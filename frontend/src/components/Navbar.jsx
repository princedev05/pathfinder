import React from "react";
import { Compass, RefreshCw, Sparkles } from "lucide-react";

export default function Navbar({ activeStep, onNavigate, onReset }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center text-white shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5.5 h-5.5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl text-slate-900 tracking-tight block">
              PathFinder
            </span>
            <p className="text-[11px] text-slate-500 -mt-1 font-medium hidden sm:block">
              Trip Route Optimizer
            </p>
          </div>
        </button>

        {/* Step Navigation Pill */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-medium text-slate-500 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80">
          <button
            onClick={() => onNavigate("landing")}
            className={`px-3.5 py-1 rounded-full transition-all ${
              activeStep === "landing"
                ? "bg-white text-teal-800 font-semibold shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            Overview
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => onNavigate("select")}
            className={`px-3.5 py-1 rounded-full transition-all ${
              activeStep === "select"
                ? "bg-white text-teal-800 font-semibold shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            Select Places
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => onNavigate("results")}
            disabled={activeStep === "landing"}
            className={`px-3.5 py-1 rounded-full transition-all ${
              activeStep === "results"
                ? "bg-white text-teal-800 font-semibold shadow-xs"
                : "disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-900"
            }`}
          >
            Optimized Route
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {activeStep !== "landing" && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Start New Route"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Route</span>
            </button>
          )}

          <button
            onClick={() => onNavigate("select")}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-md shadow-teal-900/15 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Plan Route</span>
          </button>
        </div>
      </div>
    </header>
  );
}

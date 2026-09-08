import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, RefreshCw, Sparkles, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRoute } from "../context/RouteContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { handleResetPlan } = useRoute();

  const currentPath = location.pathname;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
            <Compass className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight block">
              PathFinder
            </span>
            <p className="text-[10px] text-slate-500 -mt-1 font-medium hidden sm:block">
              Smart Trip Optimizer
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 text-xs font-medium text-slate-600 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Link
            to="/"
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPath === "/"
                ? "bg-white text-teal-800 font-semibold shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            Overview
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            to="/select"
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPath === "/select"
                ? "bg-white text-teal-800 font-semibold shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            Select Places
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            to="/results"
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPath === "/results"
                ? "bg-white text-teal-800 font-semibold shadow-xs"
                : "hover:text-slate-900"
            }`}
          >
            Optimized Route
          </Link>
        </div>

        {/* Actions & User Auth */}
        <div className="flex items-center space-x-2.5">
          {currentPath !== "/" && (
            <button
              onClick={handleResetPlan}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Start New Route"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">New Route</span>
            </button>
          )}

          {currentUser ? (
            /* Logged In User Pill & Logout */
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-2.5">
              <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800">
                <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </div>
                <span className="max-w-[110px] truncate hidden sm:inline">
                  {currentUser.name || currentUser.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Unauthenticated Actions */
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

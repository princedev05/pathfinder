# PathFinder — Smart Trip Route Optimizer

**PathFinder** is a full-stack web application that solves the Traveling Salesperson Problem (TSP) for city sightseeing using the **Held-Karp dynamic programming algorithm** over a real-world travel time and distance matrix from **OSRM (Open Source Routing Machine)**.

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🛠️ Project Architecture

```
travelBuddy/
├── README.md                     # Main documentation
├── README (1).md                 # Initial specs reference
├── backend/                      # Express REST API
│   ├── server.js                 # API server on port 5000
│   ├── data/cities.js            # Pre-seeded attractions (London, Paris, NYC)
│   ├── services/tspSolver.js     # Held-Karp DP solver & OSRM matrix engine
│   └── routes/api.js             # /api/cities, /api/optimize, /api/route-geometry
└── frontend/                     # React + Vite + Tailwind CSS
    ├── index.html                # Leaflet CSS & Google Fonts
    ├── vite.config.js            # Proxy to backend server
    └── src/
        ├── App.jsx               # Navigation & application state
        ├── components/           # Landing, PlaceSelect, RouteLoader, Results, MapView
        └── utils/api.js          # API client
```

---

## 🎯 Features

- **Exact Held-Karp DP Solver**: Guarantees mathematically optimal shortest sequence ($O(n^2 2^n)$).
- **OSRM Distance Matrix & Polyline Geometry**: Real walking, cycling, or driving road routes via OpenStreetMap.
- **Leaflet Map Rendering**: High contrast map with custom teardrop pins numbered 1 to N.
- **Hover Synchronicity**: Hovering an itinerary item highlights its marker pin on the map.
- **1-Click Spot Removal**: Remove a location directly from the itinerary to trigger instant re-optimization.
- **Google Maps Multi-Stop Export**: Export final route to Google Maps directions.

# Pathfinder: Architecture & Route Optimization Documentation

## 1. Overview of Pathfinder
**Pathfinder** is an intelligent travel route optimization web application designed to solve the **Traveling Salesperson Problem (TSP)** for multi-stop sightseeing itineraries. Given a selection of destinations in a city, Pathfinder computes the mathematically optimal visiting sequence ordered purely by distance, generates precise turn-by-turn road polyline geometry, and visualizes the route interactively on maps with direct export to Google Maps.

---

## 2. Applications, Services & Technologies Used

### Frontend Stack
* **React 18 & Vite**: Modern component-based web framework built with Vite for fast HMR development and production bundling.
* **React Router DOM (v7)**: Client-side routing across Landing, Spot Selection, Route Results, Login, and Registration pages.
* **Tailwind CSS**: Utility-first CSS engine for clean, responsive UI layouts.
* **Leaflet & React-Leaflet**: Open-source interactive map rendering engine.
* **Lucide React**: Clean icon set for travel modes, markers, and toolbar controls.
* **Axios**: HTTP client for API communications with backend services.

### Backend Stack
* **Node.js & Express.js**: RESTful backend service for handling authentication, city data, route optimization requests, and trip persistence.
* **MongoDB & Mongoose ODM**: Database persistence layer for user accounts, seeded city spots, and saved trip itineraries. Features automatic in-memory fallback if MongoDB is offline.
* **JWT (JSON Web Tokens) & Cookie-Parser**: Secure HTTP-only cookie authentication for user sessions.
* **BcryptJS**: Password hashing and verification.

### External Services & Application APIs
1. **OSRM (Open Source Routing Machine) API**:
   * **Table API (`/table/v1/{profile}/{coordinates}`)**: Fetches real road-network distance ($N \times N$ matrix in meters) and duration matrices ($N \times N$ matrix in seconds).
   * **Route API (`/route/v1/{profile}/{coordinates}`)**: Fetches full GeoJSON `LineString` road network geometry coordinates for map polylines.
2. **OpenStreetMap (OSM)**: Open-access tile server (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) for interactive base maps.
3. **Google Maps Directions API Integration**: Formats multi-stop waypoints into standard URL structures (`https://www.google.com/maps/dir/?api=1&origin=...&destination=...&waypoints=...`) for instant navigation export.

---

## 3. Step-by-Step Path Optimization Pipeline

```
  ┌────────────────────────────────────────────────────────┐
  │ 1. User Selection (City, Spots, Mode, Start Spot)     │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ 2. Backend Request (POST /api/optimize)                 │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ 3. Distance & Duration Matrix Generation                │
  │    • Primary: OSRM Table Service API                   │
  │    • Fallback: Haversine Spherical Distance Formula    │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ 4. Exact TSP Optimization                              │
  │    • Held-Karp Dynamic Programming (Bitmasking)       │
  │    • Time Complexity: O(N² * 2ⁿ)                       │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ 5. Route Polyline Geometry Calculation                  │
  │    • Primary: OSRM Route GeoJSON Service                │
  │    • Fallback: Straight-line GeoJSON LineString         │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ 6. Frontend Rendering & Export                          │
  │    • Leaflet Polyline & Numbered Markers               │
  │    • Pure Distance Metrics & Sequence Cards            │
  │    • One-Click Export to Google Maps Navigation         │
  └────────────────────────────────────────────────────────┘
```

---

## 4. Technical Deep-Dive: Optimization Algorithms

### Step 1: Distance Matrix Generation
To optimize the path between $N$ locations, Pathfinder generates an $N \times N$ matrix representing the travel distance between every pair of locations $(u, v)$.

1. **OSRM Road Network Matrix (Primary)**:
   Pathfinder queries OSRM's table endpoint using the selected travel profile (`foot`, `bike`, `driving`):
   ```http
   GET http://router.project-osrm.org/table/v1/foot/{lng1},{lat1};{lng2},{lat2};...?annotations=distance,duration
   ```
2. **Haversine Matrix (Fallback)**:
   If the OSRM server is unreachable, Pathfinder calculates pairwise distances using the spherical law of haversines:
   $$\Delta \phi = \text{lat}_2 - \text{lat}_1, \quad \Delta \lambda = \text{lon}_2 - \text{lon}_1$$
   $$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\text{lat}_1) \cdot \cos(\text{lat}_2) \cdot \sin^2\left(\frac{\Delta \lambda}{2}\right)$$
   $$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right), \quad d = R \cdot c$$
   *(where $R = 6,371,000$ meters)*.

---

### Step 2: Held-Karp Dynamic Programming TSP Solver
Pathfinder uses the **Held-Karp algorithm** (Bitmask DP) to find the exact shortest visiting order.

* **Complexity**: $O(N^2 \cdot 2^N)$ time complexity and $O(N \cdot 2^N)$ space complexity.
* **State Definition**: Let `dp[mask][u]` be the minimum distance required to visit the subset of places represented by the bitmask `mask`, ending at node `u`.
* **State Transition**:
  $$\text{dp}[\text{mask} \mid (1 \ll v)][v] = \min_{u \in \text{mask}} \left( \text{dp}[\text{mask}][u] + \text{matrix}[u][v] \right)$$
* **Round Trip Support**:
  If round-trip optimization is enabled, the final cost incorporates the return leg to the starting spot:
  $$\text{totalCost} = \text{dp}[(2^N - 1)][u] + \text{matrix}[u][0]$$
* **Path Reconstruction**: Reconstructs the exact node sequence backward using stored parent pointers.

---

### Step 3: Polyline Geometry & Interactive Map Visualization
* **GeoJSON LineString**: Pathfinder requests turn-by-turn road geometry from OSRM's `/route/v1` API.
* **Leaflet Rendering**: Renders custom numbered pin markers for each stop (`1`, `2`, `3`...) and overlays a smooth polyline connecting all stops along actual roads.
* **Pure Distance UI**: Displays total distance in kilometers and miles, eliminating unnecessary time estimates to keep the interface clear and focused.

---

## 5. Primary API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/optimize` | `POST` | Computes optimal sequence using Held-Karp DP given `placeIds`, `mode`, `roundTrip`, and `startPlaceId`. |
| `/api/route-geometry` | `POST` | Fetches GeoJSON `LineString` road coordinates for map polylines. |
| `/api/cities` | `GET` | Fetches available cities and sightseeing spot coordinates (MongoDB or fallback seed). |
| `/api/trips` | `POST` | Persists an optimized trip itinerary for authenticated users. |
| `/api/auth/register` | `POST` | Registers a new user account. |
| `/api/auth/login` | `POST` | Authenticates user and issues HTTP-only JWT cookie. |

---

## 6. Summary of Architectural Resiliency
Pathfinder is built to be **100% fault-tolerant**:
- If MongoDB is offline, it automatically falls back to in-memory seeded city data.
- If the OSRM routing server is offline, it seamlessly falls back to Haversine matrix calculations and straight-line GeoJSON geometry.
- If backend network connections fail, the frontend executes a client-side nearest-neighbor TSP solver fallback directly in the browser.

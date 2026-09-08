# Backend Endpoint Testing Guide

Use the following requests, payloads, and instructions to test all the API endpoints created and modularized during **Phase-0**.

All endpoints are hosted locally at: `http://localhost:5000`

---

## 1. App Status & Healthcheck Routes

### GET Root `/`
Checks the root status of the API server and returns list of modular endpoints.
* **Method**: `GET`
* **URL**: `http://localhost:5000/`
* **Response**:
  ```json
  {
    "status": "ok",
    "app": "PathFinder Modular API Server",
    "version": "2.0.0",
    "architecture": "MVC Controllers + Modular Services (ES Modules)"
  }
  ```

### GET Healthcheck `/api/healthcheck`
Checks standard health status using the custom `ApiResponse` wrapper.
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/healthcheck`
* **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Health check successful",
    "data": {
      "message": "Server is running"
    }
  }
  ```

---

## 2. City Routes (`/api/cities`)

### GET Cities `/api/cities`
Fetches all available cities.
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/cities`
* **Response**: List of cities (sourced from MongoDB if connected, else static in-memory fallback dataset).

### POST Seed `/api/cities/seed`
Seeds default city datasets into MongoDB.
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/cities/seed`
* **Dependency**: Requires active MongoDB connection.

---

## 3. Route Optimization Routes (`/api/optimize` & `/api/route-geometry`)

### POST Optimize Route `/api/optimize`
Computes the optimized sequence for a list of waypoints using the Held-Karp dynamic programming TSP solver.
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/optimize`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "placeIds": [
      "city-palace-udaipur",
      "lake-pichola",
      "saheliyon-ki-bari"
    ],
    "cityId": "udaipur",
    "mode": "foot",
    "roundTrip": true,
    "startPlaceId": "city-palace-udaipur"
  }
  ```
* **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Route optimized successfully",
    "data": {
      "order": ["city-palace-udaipur", "lake-pichola", "saheliyon-ki-bari", "city-palace-udaipur"],
      "legs": [
        { "from": "city-palace-udaipur", "to": "lake-pichola", "distance": 810, "duration": 202.5 },
        { "from": "lake-pichola", "to": "saheliyon-ki-bari", "distance": 3530, "duration": 882.5 }
      ],
      "totalDistance": 4340,
      "totalDuration": 1085,
      "estimated": true
    }
  }
  ```

### POST Route Geometry `/api/route-geometry`
Generates OSRM road geometry or straight-line fallbacks for ordered place coordinates.
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/route-geometry`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "order": [
      "city-palace-udaipur",
      "lake-pichola"
    ],
    "cityId": "udaipur",
    "mode": "foot"
  }
  ```
* **Response**:
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Route geometry fetched successfully",
    "data": {
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [73.6835, 24.5764],
          [73.6791, 24.5695]
        ]
      }
    }
  }
  ```

---

## 4. Trip Persistence Routes (`/api/trips`)

> **Note**: All trip routes require an active database connection.

### POST Save Trip `/api/trips`
Saves an itinerary trip to MongoDB.
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/trips`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "title": "My Udaipur Sightseeing",
    "cityId": "udaipur",
    "cityName": "Udaipur",
    "placeIds": ["city-palace-udaipur", "lake-pichola"],
    "order": ["city-palace-udaipur", "lake-pichola"],
    "legs": [
      { "from": "city-palace-udaipur", "to": "lake-pichola", "distance": 810, "duration": 202.5 }
    ],
    "totalDistance": 810,
    "totalDuration": 202.5,
    "travelMode": "foot",
    "roundTrip": false,
    "startPlaceId": "city-palace-udaipur",
    "estimated": true
  }
  ```

### GET Recent Trips `/api/trips`
Fetches a list of up to 20 recently saved trips.
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/trips`

### GET Trip By ID `/api/trips/:tripId`
Retrieves a specific saved trip by its unique `tripId`.
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/trips/trip_12345_abcde`

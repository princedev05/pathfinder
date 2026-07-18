# Pathfinder 🚀

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Pathfinder is a full-stack campus commuting and logistics application designed to solve routing and dispatch challenges. It enables students to request transport carts/shuttles, automatically assigns the optimal vehicle based on real-time availability across multiple campus locations, and calculates the most efficient route of motion.

---

## 🎯 Overview

The system optimizes campus transportation by modeling the campus as a weighted graph. When a student requests a ride, Pathfinder employs graph theory and bipartite matching algorithms to pair the request with the best available cart, and then plans the shortest route to complete the operation.

### 🧠 Core Algorithms
1. **Dijkstra's Shortest Path Algorithm ($O(V^2)$)**: Used to calculate the most efficient path of motion between selected campus locations based on coordinate distances.
2. **Hungarian Algorithm / Kuhn-Munkres ($O(N^3)$)**: Executes global optimization to match a queue of ride requests with the fleet of available shuttles by minimizing total travel distance.
3. **Haversine Formula**: Computes precise great-circle distance between geospatial coordinates (latitude and longitude) to define graph edge weights.

---

## ✨ Features

- **Role-Based Authentication**: Secure login and session tracking for both Students and Admins.
- **Interactive Campus Map**: Built with **Leaflet** to visualize location nodes, connections, and active shuttle positions.
- **Shortest Route Visualization**: Animates the calculated Dijkstra path directly on the map interface with a green gradient dashed flow.
- **Automated Matchmaking**: Admin-triggered matching that assigns carts to requests optimally using the Hungarian algorithm.
- **Status Tracking**: Complete lifecycle tracking for ride requests (Pending, Matched, Completed, Cancelled).
- **Email/SMS Notifications (Planned)**: Automated notification alerts on dispatch and parcel/shuttle arrival.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19), Vite, React Router (v7), Leaflet, React Leaflet, CSS Modules
- **Backend**: Node.js, Express.js, cookie-parser, CORS, Express Rate Limit
- **Database**: MongoDB (Atlas) & Mongoose ODM
- **Algorithms**: `munkres-js` (Hungarian matching), custom Dijkstra utility
- **Hosting**: Deployed on Vercel (Frontend) and Render (Backend)

---

## 🌐 Live Demo & Deployment

<<<<<<< HEAD
- **Live Frontend Application**: [https://campus-carry-rho.vercel.app](https://campus-carry-rho.vercel.app)
- **Alternate Frontend Mirror**: [https://pathfinder.mayankrajtools.me](https://pathfinder.mayankrajtools.me)
- **Live Backend API**: [https://api-pathfinder.mayankrajtools.me/api](https://api-pathfinder.mayankrajtools.me/api)
=======
- **Live Frontend Application**: [https://pathfinder-henna-xi.vercel.app/)
- 
- **Live Backend API**: [https://pathfinder-cliq.onrender.com/)
>>>>>>> 72c172c3cac33686bedaec90b7f91b0b95fec581

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB Atlas account (or a local MongoDB instance)

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/princedev05/pathfinder.git
   cd pathfinder
   ```

2. **Backend Installation**
   ```bash
   cd backend
   npm install
   # Create and configure backend environment variables
   cp .env.example .env
   # Start backend development server
   npm run dev
   ```

3. **Frontend Installation**
   ```bash
   cd ../frontend
   npm install
   # Create and configure frontend environment variables
   cp .env.example .env
   # Start frontend development server
   npm run dev
   ```

---

## ⚙️ Environment Variables

Do not share your actual credentials. Setup a `.env` file in each directory using these schemas:

### Backend (`backend/.env`)
- `MONGODB_URL`: Your MongoDB connection URI.
- `PORT`: Server port (default: `5000`).
- `JWT_SECRET`: Secret key used for signing JWT tokens.
- `JWT_EXPIRES`: Lifetime of token (e.g., `1d`).
- `COOKIE_EXPIRES`: Cookie lifetime in days (e.g., `1`).
- `FRONTEND_URL`: URL of the frontend (for CORS whitelist).
- `ADMIN_SECRET_KEY`: Special passphrase required to register as an Admin user.

### Frontend (`frontend/.env`)
- `VITE_BACKEND_URL`: The absolute base URL of the running backend API.

---

## 💡 Usage Workflow

1. **Database Seeding**: On the initial startup of the backend server, the database is automatically seeded with default campus locations and path networks.
2. **Access Control**: Register a student account or an admin account (using the `ADMIN_SECRET_KEY`).
3. **Requesting a Cart (Student)**:
   - Log in as a student and navigate to the map.
   - Click on the map or select from the dropdowns to set a starting location and destination.
   - A dashed green path shows the calculated shortest route.
   - Click **Request Cart**.
4. **Fulfilling Requests (Admin)**:
   - Log in as an admin and access the dashboard.
   - Add/edit shuttles, manage location nodes, or monitor request logs.
   - Run the Hungarian Matching tool to pair pending requests with active shuttles.

---

## 📚 API Reference

All backend API endpoints are prefixed with `/api` and return JSON responses.

### 1. User & Authentication (`/api/users`)
| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new user (Student/Admin) | Public |
| `POST` | `/api/users/login` | Log in user and receive cookie JWT | Public |
| `GET` | `/api/users/profile` | Retrieve profile of logged-in user | Authenticated |
| `PUT` | `/api/users/profile` | Update profile information | Authenticated |
| `POST` | `/api/users/logout` | Log out user and clear token cookie | Authenticated |
| `POST` | `/api/users/logout-all-sessions` | Terminate all active sessions | Authenticated |
| `GET` | `/api/users/check-user` | Check session authentication status | Authenticated |
| `GET` | `/api/users` | List all registered users | Admin Only |
| `DELETE` | `/api/users/:id` | Delete a user account by ID | Admin Only |

### 2. Locations & Paths (`/api/locations`)
| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/locations` | Get list of all campus locations | Authenticated |
| `POST` | `/api/locations` | Add a single new location | Admin Only |
| `POST` | `/api/locations/batch` | Batch add multiple locations | Admin Only |
| `GET` | `/api/locations/nodes` | Get location nodes formatted for map graph | Authenticated |
| `GET` | `/api/locations/node/:id` | Get details of a single location node | Authenticated |
| `PUT` | `/api/locations/:id` | Update coordinates or details of a node | Admin Only |
| `DELETE` | `/api/locations/:id` | Delete a location node | Admin Only |
| `GET` | `/api/locations/paths` | List all paths connecting locations | Authenticated |
| `POST` | `/api/locations/paths` | Create new connecting path edges | Admin Only |
| `GET` | `/api/locations/paths/:id` | Get paths connected to a specific location | Authenticated |
| `DELETE` | `/api/locations/paths/:id` | Delete a connecting path edge | Admin Only |
| `POST` | `/api/locations/shortest-path` | Calculate shortest route using Dijkstra | Authenticated |

### 3. Shuttle Fleet (`/api/shuttles`)
| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shuttles` | List all shuttles in the database | Authenticated |
| `GET` | `/api/shuttles/:id` | Retrieve specific shuttle details | Authenticated |
| `POST` | `/api/shuttles` | Register a new shuttle | Admin Only |
| `POST` | `/api/shuttles/batch` | Batch register multiple shuttles | Admin Only |
| `PUT` | `/api/shuttles/:id` | Update shuttle status/location | Admin Only |
| `DELETE` | `/api/shuttles/:id` | Remove shuttle from the database | Admin Only |

### 4. Ride Requests (`/api/rides`)
| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rides/request` | Submit a new ride request | Authenticated |
| `GET` | `/api/rides` | View all ride requests across campus | Admin Only |
| `GET` | `/api/rides/user` | Fetch ride history for current student | Authenticated |
| `GET` | `/api/rides/:id` | Get specific ride request details | Authenticated |
| `PUT` | `/api/rides/cancel/:id` | Cancel a pending/matched ride request | Authenticated |
| `PUT` | `/api/rides/:id` | Manually update status of a ride | Admin Only |
| `POST` | `/api/rides/match/execute` | Trigger Hungarian Matching algorithm | Admin Only |

---

## 📁 Project Structure

```
pathfinder/
├── backend/                  # Express API Server & Graph Logic
│   ├── controllers/          # Business logic controllers
│   ├── hungarian_algo/       # Hungarian algorithm solver
│   ├── middlewares/          # JWT check & error-handling middleware
│   ├── models/               # MongoDB Mongoose schemas
│   ├── routes/               # Express endpoints grouped by resource
│   ├── utilities/            # Dijkstra implementation, auth, and database seed data
│   ├── server.js             # Main server entrypoint
│   └── package.json          # Backend package dependencies
│
└── frontend/                 # Vite + React Client
    ├── public/               # Static icons and assets
    ├── src/                  # React source files
    │   ├── components/       # Maps and UI components
    │   ├── pages/            # Application pages (Home, Login, Register, Profile)
    │   ├── GlobalContext.jsx # Global context state manager
    │   ├── App.jsx           # App routes and shell
    │   └── main.jsx          # App entrypoint
    ├── vite.config.js        # Vite bundler configuration
    └── package.json          # Frontend package dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---



---

## ✉️ Contact

- **Author**: Prince
- **GitHub**: [@princedev05](https://github.com/princedev05)
- **Project Link**: [https://github.com/princedev05/pathfinder](https://github.com/princedev05/pathfinder)

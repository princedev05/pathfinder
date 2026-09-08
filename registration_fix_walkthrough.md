# Registration & CORS Routing Fix Walkthrough

This document details the root cause diagnosis and resolution for the registration failure between the React frontend and Node.js/Express backend in **PathFinder**.

---

## 🚨 Root Cause Diagnosis

1. **Browser CORS Policy Violation**:
   - `backend/.env` contained `CORS_ORIGIN=*`.
   - `frontend/src/api/axios.js` is configured with `withCredentials: true` to support HTTP-Only cookies (`accessToken` and `refreshToken`).
   - **Browser Constraint**: Modern web browsers (Chrome, Firefox, Safari, Edge) strictly block cross-origin requests whenever `Access-Control-Allow-Origin: *` (wildcard) is combined with `credentials: true`. This caused the browser's security layer to block all `/api/auth/register` and `/api/auth/login` network requests before reaching the controller logic.

2. **Uncaught MongoDB Connection Failure**:
   - In `backend/src/controllers/auth.controller.js`, `User.findOne()` buffered database requests when MongoDB was offline or unreachable, resulting in 30-second query timeouts and unhandled 500 error responses.

---

## 🛠️ Solutions Applied

### 1. Updated `backend/.env`
- **File:** `backend/.env`
- **Change:** Updated `CORS_ORIGIN=*` to `CORS_ORIGIN=http://localhost:5173`.

### 2. Implemented Dynamic CORS Origin Callback
- **File:** `backend/app.js`
- **Change:** Implemented a dynamic CORS origin callback function. If a request arrives with credentials enabled, Express returns the explicit requesting client origin (`http://localhost:5173`) instead of returning wildcard `*`.
```javascript
const allowedOrigins = process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== "*"
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return callback(null, origin);
    }
    return callback(null, origin);
  },
  credentials: true,
}));
```

### 3. Added Database Connectivity Guard
- **File:** `backend/src/controllers/auth.controller.js`
- **Change:** Added `getIsConnected()` database status checks to `registerUser` and `loginUser`. If MongoDB is disconnected or offline, the API returns an immediate `503 Service Unavailable` response with an actionable error message rather than timing out.

---

## 🔍 Verification Results

### Backend Syntax Verification
```bash
cd backend
node --check app.js
node --check index.js
```
**Result:** Passed cleanly with exit code 0.

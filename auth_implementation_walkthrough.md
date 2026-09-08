# Full-Stack Authentication Implementation & Setup Walkthrough

This document outlines the complete full-stack integration of JSON Web Token (JWT) authentication across both the **Node.js/Express backend** and **React frontend** in **PathFinder**.

---

## 🏗️ Architecture & Component Overview

```
                          Full-Stack Auth Flow
                          
   [ Frontend Client ]                               [ Backend API ]
   
   React Router (/login, /register)                 Express Auth Router
   AuthContext (State & Methods)                   verifyJWT & Controllers
          │                                                │
          ├─── POST /api/auth/register ───────────────────►│ User.create()
          │    (name, email, password)                     │ (Bcrypt Hash)
          │                                                │
          ├─── POST /api/auth/login ──────────────────────►│ Returns User & sets
          │    (email, password)                           │ HTTP-Only Cookies
          │                                                │
          ├─── GET /api/auth/current-user ────────────────►│ Decodes JWT & returns
          │    (On Mount / Page Refresh)                   │ user profile
          │                                                │
          └─── POST /api/auth/logout ─────────────────────►│ Clears DB refresh token
               (Header / Cookie)                           │ & clears browser cookies
```

---

## 🛠️ Key Changes Implemented

### 1. Backend Configuration & CORS (`backend/`)
- **File:** `backend/app.js`
- **Changes:** Updated CORS configuration to explicitly whitelist the frontend origin (`http://localhost:5173`) with `credentials: true`. This allows browsers to automatically send and receive HTTP-Only `accessToken` and `refreshToken` cookies during cross-origin API calls.

---

### 2. Frontend State & Axios API Layer (`frontend/src/`)
- **Axios Instance:** `frontend/src/api/axios.js` configured with `withCredentials: true` and `baseURL: "http://localhost:5000"`.
- **Auth API Client:** `frontend/src/api/auth.js` defines helper functions for `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/current-user`.
- **Auth Context:** `frontend/src/context/AuthContext.jsx`
  - Hydrates `currentUser` state on application mount by invoking `getCurrentUser()`.
  - Exposes `login`, `register`, and `logout` methods to manage state across pages.

---

### 3. Glassmorphic UI Redesigns (`frontend/src/pages/`)
- **Login Page:** `frontend/src/pages/login.jsx`
  - Redesigned into a dark glassmorphic card styled with Tailwind CSS.
  - Includes Mail and Lock icons, password show/hide toggle (`Eye`/`EyeOff`), error alert banners (`AlertCircle`), submit spinners (`Loader2`), and navigation links to `/register`.
- **Register Page:** `frontend/src/pages/Register.jsx`
  - Redesigned into a matching glassmorphic registration card.
  - Includes Name, Email, and Password fields with client-side length validation, success/error feedback badges, and quick links to `/login`.

---

### 4. Navbar & Protected Route Guards (`frontend/src/components/`)
- **Navbar Component:** `frontend/src/components/Navbar.jsx`
  - Connected to `useAuth()` to display an avatar badge with the user's name/email when logged in, alongside a styled `Logout` button.
  - Displays `Sign In` and `Register` links when unauthenticated.
  - Replaced hash callbacks with `react-router-dom` navigation (`useNavigate`, `useLocation`).
- **Protected Route Guard:** `frontend/src/components/ProtectedRoute.jsx`
  - Enforces session security for protected paths (`/select`, `/loading`, `/results`). Unauthenticated users are redirected to `/login`.

---

## 🔍 Verification & Build Results

### Backend Syntax Verification
```bash
cd backend
node --check index.js
```
**Result:** Passed with code 0.

### Frontend Production Build Verification
```bash
cd frontend
npm run build
```
**Result:** Built successfully in 3.42s (1,550 modules transformed, 0 errors).

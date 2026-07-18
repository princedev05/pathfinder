import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";
import { getUserNameFromCookie } from "../utilities/cookie.utility";

export default function ProtectedRoute({
    children,
    isProtected = true,
    allowPublic = false,
    role = "student",
}) {
    const { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {
        if (!state.user) {
            dispatch({ type: "LOADING_USER" });

            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

            fetch(backendUrl + "/api/users/check-user", {
                method: "GET",
                credentials: "include",
            })
                .then(async (res) => {
                    const data = await res.json().catch(() => ({}));
                    if (data.success) {
                        console.log(data.user);
                        dispatch({ type: "SET_USER", payload: data.user });
                        const userName = getUserNameFromCookie();
                        if (userName) {
                            dispatch({ type: "SET_USER_NAME", payload: userName });
                        }
                    } else {
                        dispatch({ type: "REMOVE_USER" });
                    }
                })
                .catch(() => dispatch({ type: "REMOVE_USER" }));
        }
    }, [dispatch, state.user]);

    if (state.loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.2rem",
                    color: "#555",
                }}
            >
                <div className="loader"></div>
                <p style={{ marginTop: "12px" }}>Checking authentication...</p>
            </div>
        );
    }

    if (isProtected && !state.user && state.autoRedirect) {
        return <Navigate to="/login" replace />;
    }

    if (!isProtected && state.user && state.autoRedirect && !allowPublic) {
        return <Navigate to="/profile" replace />;
    }

    // Check if user exists before checking role
    if (state.user) {
        // Admin-only routes: block students
        if (role === "admin" && state.user.role !== "admin") {
            return (
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "2rem",
                        color: "#555",
                    }}
                >
                    <p style={{ marginTop: "12px" }}>
                        Unauthorized: Admin access only
                    </p>
                </div>
            );
        }
    }

    return children;
}

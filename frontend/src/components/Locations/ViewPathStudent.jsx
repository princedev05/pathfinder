import { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import styles from "./ViewPathStudent.module.css";
import Popup from "../PopUp";
import CampusMap from "../Map/CampusMap";

const fallbackLocations = [
    { _id: "fallback-bh", name: "Boys Hostel", code: "BH", latitude: 28.81637, longitude: 77.13299, type: "LOCATION" },
    { _id: "fallback-ab", name: "Admin Block", code: "AB", latitude: 28.81164, longitude: 77.13299, type: "LOCATION" },
    { _id: "fallback-bc", name: "Basketball Court", code: "BC", latitude: 28.81542, longitude: 77.13170, type: "LOCATION" },
    { _id: "fallback-sg", name: "Sports Ground", code: "SG", latitude: 28.81256, longitude: 77.13253, type: "LOCATION" },
    { _id: "fallback-mg", name: "Main Gate", code: "MG", latitude: 28.81617, longitude: 77.13363, type: "LOCATION" },
    { _id: "fallback-lib", name: "Library", code: "LIB", latitude: 28.81410, longitude: 77.13230, type: "LOCATION" },
    { _id: "fallback-acb", name: "Academic Block", code: "ACB", latitude: 28.81380, longitude: 77.13120, type: "LOCATION" },
];

const fallbackPaths = [
    { _id: "fallback-path-1", node1: fallbackLocations[0], node2: fallbackLocations[4] },
    { _id: "fallback-path-2", node1: fallbackLocations[4], node2: fallbackLocations[2] },
    { _id: "fallback-path-3", node1: fallbackLocations[2], node2: fallbackLocations[5] },
    { _id: "fallback-path-4", node1: fallbackLocations[5], node2: fallbackLocations[6] },
    { _id: "fallback-path-5", node1: fallbackLocations[6], node2: fallbackLocations[3] },
    { _id: "fallback-path-6", node1: fallbackLocations[3], node2: fallbackLocations[1] },
    { _id: "fallback-path-7", node1: fallbackLocations[5], node2: fallbackLocations[1] },
    { _id: "fallback-path-8", node1: fallbackLocations[4], node2: fallbackLocations[1] },
];

export function ViewPathStudent() {
    const [redirectTo, setRedirectTo] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [popupContent, setPopUpContent] = useState(null);

    const [paths, setPaths] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Haversine formula to calculate distance between two coordinates
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return (distance * 1000).toFixed(2); // Convert to meters with 2 decimal places
    };

    const fetchPaths = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/locations/paths",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!data.success) {
                console.error("ERROR : ", data.message);
                setPopUpContent(
                    <div>
                        <strong className={styles.fail}>{data.message}</strong>
                    </div>
                );
                setIsOpen(true);
                return;
            }

            // Success
            console.log(data.message);
            setPaths(data.message || fallbackPaths);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error(err);
            setPaths(fallbackPaths);
            setLocations(fallbackLocations);
            setPopUpContent("Some error occured");
            setIsOpen(true);
        }
    };

    const fetchLocations = async () => {
        try {
            const res = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/locations/",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (data.success) {
                setLocations(data.message);
            } else {
                setLocations(fallbackLocations);
            }
        } catch (err) {
            console.error("Error fetching locations:", err);
        }
    };

    useEffect(() => {
        fetchPaths();
        fetchLocations();
    }, []);

    if (isLoading)
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.2rem",
                    color: "#555",
                }}
            >
                <div className="loader"></div>
                <p style={{ marginTop: "12px" }}>Fetching Paths...</p>
            </div>
        );

    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <div className={styles.mapContainer}>
                    <CampusMap locations={locations} paths={paths} height="100%" />
                </div>
            </div>

            <div className={styles.rightSection}>
                <button onClick={() => { fetchPaths(); fetchLocations(); }} className={styles.button}>
                    <HiOutlineRefresh />
                    <p>Refresh</p>
                </button>
                <div className={styles.cardContainer}>
                    {paths.map((path) => {
                        const distance =
                            path.node1?.latitude &&
                            path.node1?.longitude &&
                            path.node2?.latitude &&
                            path.node2?.longitude
                                ? calculateDistance(
                                      path.node1.latitude,
                                      path.node1.longitude,
                                      path.node2.latitude,
                                      path.node2.longitude
                                  )
                                : "N/A";

                        return (
                            <div key={path._id} className={styles.card}>
                                <h3>Path Information</h3>
                                <p>
                                    🔵 Node 1:{" "}
                                    <strong>
                                        {path.node1?.name || "Unknown"} (
                                        {path.node1?.code || "N/A"})
                                    </strong>
                                </p>
                                <p>
                                    🔴 Node 2:{" "}
                                    <strong>
                                        {path.node2?.name || "Unknown"} (
                                        {path.node2?.code || "N/A"})
                                    </strong>
                                </p>
                                <p>
                                    📏 Distance:{" "}
                                    <span className={styles.distanceHighlight}>
                                        {distance === "N/A"
                                            ? distance
                                            : `${distance} m`}
                                    </span>
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Popup
                isOpen={isOpen}
                onClose={() => {
                    setRedirectTo(false);
                    setIsOpen(false);
                }}
                title="ALERT"
                redirectTo={redirectTo}
            >
                {popupContent}
            </Popup>
        </div>
    );
}

import React, { useEffect, useRef } from "react";
import L from "leaflet";

export default function MapView({
  city,
  orderedPlaces = [],
  routeGeometry = null,
  activeHoverPlaceId = null,
  onMarkerClick
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = city && city.center ? [city.center.lat, city.center.lng] : [51.5074, -0.1278];
      const initialZoom = city && city.zoom ? city.zoom : 13;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center when City changes
  useEffect(() => {
    if (mapInstanceRef.current && city && city.center) {
      mapInstanceRef.current.setView([city.center.lat, city.center.lng], city.zoom || 13);
    }
  }, [city]);

  // Render Markers and Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Clear previous polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (orderedPlaces.length === 0) return;

    const latLngs = [];

    // 1. Draw Numbered Markers
    orderedPlaces.forEach((place, index) => {
      const isHovered = activeHoverPlaceId === place.id;
      const markerNumber = index + 1;

      // Custom HTML pin
      const customIcon = L.divIcon({
        className: "leaflet-custom-marker",
        html: `
          <div class="marker-pin ${isHovered ? "active" : ""}">
            <span class="marker-num">${markerNumber}</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: Inter, sans-serif; width: 180px;">
          <div style="font-size: 11px; font-weight: 700; color: #0f766e; text-transform: uppercase; margin-bottom: 2px;">
            Stop #${markerNumber}
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 4px;">
            ${place.name}
          </div>
          <div style="font-size: 11px; color: #64748b;">
            ~${place.suggestedVisitMinutes} min visit
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(place.id));
      }

      markersRef.current.push(marker);
      latLngs.push([place.lat, place.lng]);
    });

    // 2. Draw Route Polyline
    if (routeGeometry && routeGeometry.coordinates && routeGeometry.coordinates.length > 0) {
      // GeoJSON is [lng, lat], convert to Leaflet [lat, lng]
      const polylineCoords = routeGeometry.coordinates.map((c) => [c[1], c[0]]);
      polylineRef.current = L.polyline(polylineCoords, {
        color: "#0f766e",
        weight: 5,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "1, 0"
      }).addTo(map);
    } else if (latLngs.length > 1) {
      // Fallback straight lines
      polylineRef.current = L.polyline(latLngs, {
        color: "#0f766e",
        weight: 4,
        opacity: 0.8,
        dashArray: "8, 6"
      }).addTo(map);
    }

    // 3. Auto-fit bounds
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [orderedPlaces, routeGeometry, activeHoverPlaceId, onMarkerClick]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different location types
const locationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const turnIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const parseCoordinate = (value) => {
    if (value === null || value === undefined || value === '') return null;

    const parsed = typeof value === 'string' ? Number(value.trim()) : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const normalizeLocation = (location) => {
    if (!location) return null;

    const latitude = parseCoordinate(location.latitude);
    const longitude = parseCoordinate(location.longitude);

    if (latitude === null || longitude === null) return null;

    return { ...location, latitude, longitude };
};

// Component to adjust map bounds when markers change
function MapBounds({ locations, paths }) {
    const map = useMap();

    useEffect(() => {
        if (locations && locations.length > 0) {
            const validLocations = locations
                .map(normalizeLocation)
                .filter(Boolean);
            
            if (validLocations.length > 0) {
                const bounds = L.latLngBounds(
                    validLocations.map(loc => [loc.latitude, loc.longitude])
                );
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [locations, paths, map]);

    return null;
}

function MapResizeHandler() {
    const map = useMap();

    useEffect(() => {
        const handleResize = () => {
            map.invalidateSize();
        };

        handleResize();
        const timeoutId = window.setTimeout(handleResize, 200);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.clearTimeout(timeoutId);
        };
    }, [map]);

    return null;
}

export default function CampusMap({ locations = [], paths = [], height = '100%' }) {
    // Filter valid locations with coordinates
    const validLocations = useMemo(() => 
        (locations || []).map(normalizeLocation).filter(Boolean),
        [locations]
    );

    // Debug logging
    useEffect(() => {
        console.log('CampusMap - Total locations:', locations.length);
        console.log('CampusMap - Valid locations:', validLocations.length);
        console.log('CampusMap - Paths:', paths.length);
    }, [locations, validLocations, paths]);

    const resolvedHeight = typeof height === 'number' ? `${height}px` : height || '100%';

    // Default center (use first location or default coordinates)
    const center = useMemo(() => {
        if (validLocations.length > 0) {
            return [validLocations[0].latitude, validLocations[0].longitude];
        }
        return [28.8144, 77.1326]; // NIT Delhi campus center
    }, [validLocations]);

    // Create polylines from paths
    const pathLines = useMemo(() => {
        return paths
            .filter(path => 
                path.node1?.latitude && path.node1?.longitude &&
                path.node2?.latitude && path.node2?.longitude
            )
            .map(path => ({
                positions: [
                    [path.node1.latitude, path.node1.longitude],
                    [path.node2.latitude, path.node2.longitude]
                ],
                path: path
            }));
    }, [paths]);

    return (
        <div style={{ height: resolvedHeight, width: '100%', position: 'relative' }}>
            {validLocations.length === 0 && (
                <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    zIndex: 1000,
                    background: 'rgba(255,255,255,0.95)',
                    color: '#374151',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '999px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                }}>
                    Showing default campus view
                </div>
            )}

            <MapContainer
                key={`map-${validLocations.length}-${center[0]}-${center[1]}`}
                center={center}
                zoom={validLocations.length > 0 ? 15 : 13}
                style={{ height: '100%', width: '100%', borderRadius: '8px', minHeight: '400px' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapResizeHandler />
                <MapBounds locations={validLocations} paths={paths} />

            {/* Draw path lines first (so they appear under markers) */}
            {pathLines.map((line, idx) => (
                <Polyline
                    key={`path-${idx}`}
                    positions={line.positions}
                    color="#3b82f6"
                    weight={3}
                    opacity={0.7}
                >
                    <Popup>
                        <strong>Path:</strong><br />
                        {line.path.node1?.name} → {line.path.node2?.name}
                    </Popup>
                </Polyline>
            ))}

            {validLocations.length === 0 && (
                <Marker position={center}>
                    <Popup>
                        <div style={{ minWidth: '150px' }}>
                            <strong style={{ fontSize: '1.05rem', color: '#3b82f6' }}>Default campus view</strong>
                            <br />
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                Add locations in the admin panel to populate this map.
                            </span>
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* Draw markers */}
            {validLocations.map((location, index) => {
                const isTurn = location.type === 'NODE' || location.type === 'node';
                const icon = isTurn ? turnIcon : locationIcon;
                const markerKey = location._id || `${location.code || 'location'}-${index}`;
                
                return (
                    <Marker
                        key={markerKey}
                        position={[location.latitude, location.longitude]}
                        icon={icon}
                    >
                        <Popup>
                            <div style={{ minWidth: '150px' }}>
                                <strong style={{ fontSize: '1.1rem', color: isTurn ? '#f59e0b' : '#10b981' }}>
                                    {location.name}
                                </strong>
                                <br />
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                    Code: {location.code}
                                </span>
                                <br />
                                <span style={{ fontSize: '0.85rem', color: '#888' }}>
                                    Type: {isTurn ? 'Turn' : 'Location'}
                                </span>
                                <br />
                                <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
            </MapContainer>
        </div>
    );
}

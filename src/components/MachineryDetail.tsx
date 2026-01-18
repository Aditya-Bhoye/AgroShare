import { X, ChevronRight } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { fetchRoute } from '../services/openRouteService';
import './MachineryDetail.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 19.9975,
    lng: 73.7898
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                { "color": "#e9e9e9" },
                { "lightness": 17 }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                { "color": "#f5f5f5" },
                { "lightness": 20 }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                { "color": "#ffffff" },
                { "lightness": 17 }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                { "color": "#ffffff" },
                { "lightness": 29 },
                { "weight": 0.2 }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                { "color": "#ffffff" },
                { "lightness": 18 }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                { "color": "#ffffff" },
                { "lightness": 16 }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                { "color": "#f5f5f5" },
                { "lightness": 21 }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                { "color": "#dedede" },
                { "lightness": 21 }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                { "visibility": "on" },
                { "color": "#ffffff" },
                { "lightness": 16 }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                { "saturation": 36 },
                { "color": "#333333" },
                { "lightness": 40 }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                { "visibility": "off" }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                { "color": "#f2f2f2" },
                { "lightness": 19 }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                { "color": "#fefefe" },
                { "lightness": 20 }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                { "color": "#fefefe" },
                { "lightness": 17 },
                { "weight": 1.2 }
            ]
        }
    ]
};

const MachineryDetail = ({ machine, onClose }: { machine: any, onClose: () => void }) => {
    if (!machine) return null;

    // Gallery Rotation Logic
    const [galleryImages, setGalleryImages] = useState(machine.gallery || [machine.image, machine.image, machine.image]);

    const handleNextImage = () => {
        setGalleryImages((prev: any[]) => {
            const [first, ...rest] = prev;
            return [...rest, first];
        });
    };

    // --- GOOGLE MAPS + ORS LOGIC ---
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });

    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[] | null>(null);


    // Convert machine location array [lat, lng] to object
    const machineryLocationStr = machine.location ? { lat: machine.location[0], lng: machine.location[1] } : { lat: 20.0470, lng: 73.8520 };
    const [machineryLocation] = useState<google.maps.LatLngLiteral>(machineryLocationStr);

    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(function callback(_map: google.maps.Map) {
        mapRef.current = null;
    }, []);

    // 1. Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        }
    }, []);

    // 2. Fetch Route from ORS
    useEffect(() => {
        const getRoute = async () => {
            if (userLocation) {
                try {
                    // ORS expects [lng, lat]
                    const start: [number, number] = [userLocation.lat, userLocation.lng];
                    const end: [number, number] = [machineryLocation.lat, machineryLocation.lng];

                    const data = await fetchRoute(start, end);

                    if (data && data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        const coords = feature.geometry.coordinates; // [lng, lat]

                        // Convert [lng, lat] (ORS) to { lat, lng } (Google Maps)
                        const pathString = coords.map((c: number[]) => ({
                            lat: c[1],
                            lng: c[0]
                        }));
                        setRoutePath(pathString);

                        // Fit Bounds
                        if (mapRef.current && pathString.length > 0) {
                            const bounds = new google.maps.LatLngBounds();
                            pathString.forEach((point: google.maps.LatLngLiteral) => bounds.extend(point));
                            bounds.extend(userLocation);
                            bounds.extend(machineryLocation);
                            mapRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
                        }

                    } else {
                        console.warn("No route found or invalid response");
                    }
                } catch (e) {
                    console.error("Failed to fetch route", e);
                }
            }
        };

        if (userLocation && isLoaded) {
            getRoute();
        }
    }, [userLocation, machineryLocation, isLoaded]);

    return (
        <div className="machinery-modal-overlay" onClick={onClose}>
            <div className="machinery-modal-content" onClick={e => e.stopPropagation()}>

                {/* Close Button */}
                <button className="close-btn" onClick={onClose}>
                    <X size={24} color="#333" />
                </button>

                {/* ===== STORED ELEMENTS - ALL CONTENT TEMPORARILY REMOVED ===== */}


                {/*
                ====================================================================
                LEFT SIDE: STACKING IMAGE GALLERY
                ====================================================================
                */}

                <div className="gallery-section">
                    <div className="gallery-container">
                        {galleryImages.slice(0, 3).map((img: string, index: number) => {
                            let style = {};
                            if (index === 0) {
                                style = {
                                    zIndex: 3,
                                    transform: 'translateX(0) rotate(0deg) scale(1)',
                                    opacity: 1,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                                };
                            } else if (index === 1) {
                                style = {
                                    zIndex: 2,
                                    transform: 'translateX(35px) rotate(6deg) scale(0.95)',
                                    opacity: 1,
                                    filter: 'brightness(0.95)',
                                    boxShadow: '4px 4px 20px rgba(0,0,0,0.1)'
                                };
                            } else {
                                style = {
                                    zIndex: 1,
                                    transform: 'translateX(70px) rotate(12deg) scale(0.9)',
                                    opacity: 1,
                                    filter: 'brightness(0.9)',
                                    boxShadow: '4px 4px 20px rgba(0,0,0,0.1)'
                                };
                            }

                            return (
                                <div key={img} className="gallery-card" style={style}>
                                    <img src={img} className="gallery-img" />
                                </div>
                            );
                        })}

                        <button
                            className="next-img-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNextImage();
                            }}
                        >
                            <ChevronRight size={32} color="#333" />
                        </button>
                    </div>

                    {/* Owner Info Section */}
                    <div className="owner-info">
                        {/* Owner Details Card */}
                        <div className="owner-details-card">
                            <div className="owner-header">
                                <div className="owner-avatar">
                                    <img src={machine.ownerImage || "https://via.placeholder.com/60"} alt="Owner" />
                                </div>
                                <div className="owner-name-block">
                                    <h4 className="owner-name">{machine.ownerName || "John Farmer"}</h4>
                                    <p className="owner-title">Equipment Owner</p>
                                </div>
                            </div>

                            <div className="owner-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{machine.ownerExperience || "5"}y</span>
                                    <span className="stat-label">Experience</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{machine.totalRents || "120"}</span>
                                    <span className="stat-label">Rents</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{machine.rating || "4.8"}⭐</span>
                                    <span className="stat-label">Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Button */}
                        <button className="contact-owner-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Contact Owner
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE: EMPTY FOR NOW (Details stored below for later use) */}

                {/* 
                ====================================================================
                RIGHT SIDE: MACHINE DETAILS, MAP & BOOKING (STORED FOR LATER USE)
                ====================================================================
                
                <div className="details-section">
                    <div className="header-row">
                        <div>
                            <span className="machine-tag">{machine.type}</span>
                            <h1 className="machine-title">{machine.title}</h1>
                        </div>
                        <div className="machine-price-block">
                            <span className="machine-price">{machine.price}</span>
                            <span className="machine-unit">per hour</span>
                        </div>
                    </div>

                    <div className="map-container">
                        {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={userLocation || defaultCenter}
                                zoom={13}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                                options={mapOptions}
                            >
                                {routePath && (
                                    <Polyline
                                        path={routePath}
                                        options={{
                                            strokeColor: '#000000',
                                            strokeWeight: 6,
                                            strokeOpacity: 0.8,
                                            clickable: false,
                                            draggable: false,
                                            editable: false,
                                            visible: true,
                                            zIndex: 50
                                        }}
                                    />
                                )}

                                {userLocation && <Marker position={userLocation} label="You" />}
                                <Marker position={machineryLocation} label="Machine" />
                            </GoogleMap>
                        ) : (
                            <div className="map-loading">
                                Loading Map...
                            </div>
                        )}
                    </div>

                    <button className="booking-btn">
                        Request Booking
                    </button>
                </div>
                
                */}

            </div>
        </div>
    );
};

export default MachineryDetail;

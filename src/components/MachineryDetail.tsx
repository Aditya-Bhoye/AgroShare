import { X, MapPin, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import BookingModal from './BookingModal';
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

// --- REVIEW LOGIC ---
interface Review {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
}

const REVIEWER_NAMES = [
    "Rahul Patil", "Amit Deshmukh", "Suresh Waghmare", "Vijay Kadam",
    "Anil Joshi", "Deepak Shinde", "Ganesh Gaikwad", "Pravin Pawar",
    "Sanjay More", "Ravi Sawant", "Kiran Kale", "Mahesh Chavan",
    "Ramesh Jadhav", "Vikas Bhoir", "Nitin Salunkhe", "Arun Gayakwad",
    "Sachin Tendulkar", "Vikram Rathod", "Manoj Tiwari", "Ashok Sutar"
];

const REVIEW_COMMENTS = [
    "Excellent machine, worked perfectly for my needs. The owner was very punctual and helpful.",
    "Good tractor. Basic but gets the job done. Price was reasonable.",
    "Very well maintained tractor. Ran smoothly without any issues for 3 days straight. Highly recommended!",
    "Owner was very helpful and the equipment is top notch. Will definitely rent from here again for the next harvest season.",
    "Good experience overall, but the pickup was slightly delayed. The machine itself is in great condition though.",
    "Powerful machine, saved me a lot of time on the field. Fuel efficiency was better than I expected.",
    "Decent.",
    "Highly recommended! The hydraulic system is very smooth. Makes ploughing effortless.",
    "Condition was exactly as described. Clean and ready to use.",
    "Great fuel efficiency, helped reduce my costs significantly. The tires are also new, so good grip.",
    "Seamless booking process and friendly owner. He even explained a few tricks to use the harvester more efficiently.",
    "Okay experience. The AC in the cabin wasn't cooling very well, but the engine is powerful.",
    "Best rental experience so far. Very professional.",
    "Machine is a beast! Handled the rocky terrain easily."
];

const generateReviews = (averageRating: number, count: number): Review[] => {
    const reviews: Review[] = [];

    for (let i = 0; i < count; i++) {
        // Skew ratings towards the average
        let rating = Math.round(averageRating);

        // Add some variance but keep it realistic
        const rand = Math.random();
        if (rand > 0.7) {
            rating = Math.min(5, rating + 1);
        } else if (rand < 0.2) {
            rating = Math.max(3, rating - 1);
        }

        const name = REVIEWER_NAMES[Math.floor(Math.random() * REVIEWER_NAMES.length)];
        const comment = REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];
        // Randomize avatar ID to ensure variety
        const avatarId = Math.floor(Math.random() * 70) + 10;

        reviews.push({
            id: i,
            name,
            avatar: `https://i.pravatar.cc/150?img=${avatarId}`,
            rating,
            date: `${Math.floor(Math.random() * 10) + 1} months ago`,
            comment
        });
    }
    return reviews;
};

const MachineryDetail = ({ machine, onClose }: { machine: any, onClose: () => void }) => {
    if (!machine) return null;

    // Gallery Logic - Standard Featured + Thumbnails
    const [selectedImage, setSelectedImage] = useState(machine.image);
    const galleryImages = machine.gallery || [machine.image, machine.image, machine.image, machine.image];

    // --- Next Image Logic ---
    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentIndex = galleryImages.findIndex((img: string) => img === selectedImage);
        // If image not found in gallery (e.g. init), start from 0; otherwise next logic
        const nextIndex = (currentIndex === -1) ? 0 : (currentIndex + 1) % galleryImages.length;
        setSelectedImage(galleryImages[nextIndex]);
    };

    // --- GOOGLE MAPS + ORS LOGIC ---
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });

    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[] | null>(null);
    const [distance, setDistance] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    // 0. Generate Reviews on Mount
    useEffect(() => {
        if (machine && machine.rating) {
            const ratingVal = parseFloat(machine.rating);
            // Generate between 7 and 12 reviews
            const count = Math.floor(Math.random() * 5) + 7;
            setReviews(generateReviews(ratingVal, count));
        }
    }, [machine]);

    // Ensure selected image updates if machine changes
    useEffect(() => {
        if (machine) {
            setSelectedImage(machine.image);
        }
    }, [machine]);


    // Convert machine location array [lat, lng] to object
    const machineryLocationStr = machine.location ? { lat: machine.location[0], lng: machine.location[1] } : { lat: 20.0470, lng: 73.8520 };
    const [machineryLocation] = useState<google.maps.LatLngLiteral>(machineryLocationStr);

    // --- BOOKING STATE ---
    const [showBookingModal, setShowBookingModal] = useState(false);



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

                        // Extract distance (in meters) and convert to km
                        if (feature.properties && feature.properties.summary && feature.properties.summary.distance) {
                            const distInMeters = feature.properties.summary.distance;
                            const distInKm = (distInMeters / 1000).toFixed(1);
                            setDistance(`${distInKm} km away`);
                        }

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

                {/* LEFT SIDE: FEATURED IMAGE GALLERY & OWNER INFO */}
                <div className="gallery-section">
                    <div className="main-image-container">
                        <img src={selectedImage} alt={machine.name} className="main-gallery-img" />
                        <button className="next-img-btn-overlay" onClick={handleNextImage}>
                            <ChevronRight size={24} color="#333" />
                        </button>
                    </div>

                    <div className="thumbnails-row">
                        {galleryImages.slice(0, 4).map((img: string, index: number) => (
                            <div
                                key={index}
                                className={`thumbnail-card ${selectedImage === img ? 'active' : ''}`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <img src={img} alt={`View ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="gallery-divider"></div>

                    {/* RELOCATED OWNER INFO */}
                    <div className="owner-card-refined sidebar-mode">
                        <div className="owner-avatar-large">
                            <img src={machine.ownerImage || "https://via.placeholder.com/60"} alt="Owner" />
                            <div className="verified-badge">
                                <ShieldCheck size={14} color="white" fill="#2e7d32" />
                            </div>
                        </div>
                        <div className="owner-info-content">
                            <h4 className="owner-name-large">{machine.ownerName || "John Farmer"}</h4>
                            <p className="owner-role">Verified Owner • Member since 2023</p>
                            <div className="owner-stats-row">
                                <span><strong>{machine.totalRents || "120"}</strong> Rents</span>
                                <span>•</span>
                                <span><strong>{machine.ownerExperience || "5"}y</strong> Exp</span>
                            </div>
                        </div>
                        <button className="contact-owner-mini-btn" onClick={(e) => {
                            e.stopPropagation();
                            if (machine.owner_id) {
                                window.location.href = `/seller/${machine.owner_id}`;
                            } else {
                                alert("This listing has no owner contact details linked.");
                            }
                        }}>
                            Contact
                        </button>
                    </div>

                </div>

                {/* RIGHT SIDE: SCROLLABLE DETAILS AREA */}
                <div className="details-section">

                    {/* Header: Title and Price */}
                    <div className="header-row">
                        <div className="header-info">
                            <span className="machine-tag">{machine.type}</span>
                            <h2 className="machine-title">{machine.name}</h2>
                            <div className="rating-row">
                                <Star fill="#FFD700" color="#FFD700" size={18} />
                                <span className="rating-val">{machine.rating}</span>
                                <span className="rating-count">({reviews.length} reviews)</span>
                            </div>
                        </div>
                        <div className="machine-price-block">
                            <span className="machine-price">₹{machine.price}</span>
                            <span className="machine-unit">/ hr</span>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <p className="machine-desc">{machine.desc}</p>


                    {/* --- REPOSITIONED MAP CARD (ALWAYS VISIBLE) --- */}
                    <div className="section-title">Location & Availability</div>
                    <div className="map-card-container">
                        <div className="map-card-header">
                            <h4>Location</h4>
                        </div>
                        <div className="location-display-box">
                            <MapPin size={18} color="#2e7d32" />
                            <span>{distance ? `On-Road Distance: ${distance}` : "Calculating on-road distance..."}</span>
                        </div>
                        <div className="map-wrapper">
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
                    </div>


                    {/* Reviews List - Always Visible now */}
                    <div className="section-title">Recent Reviews</div>
                    <div className="reviews-container">
                        {reviews.slice(0, 3).map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <img src={review.avatar} alt={review.name} className="reviewer-avatar" />
                                    <div className="reviewer-info">
                                        <h5 className="reviewer-name">{review.name}</h5>
                                        <div className="review-rating">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    fill={i < review.rating ? "#FFD700" : "none"}
                                                    color={i < review.rating ? "#FFD700" : "#ddd"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="review-date">{review.date}</span>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    <div className="action-buttons-sticky">
                        <button className="booking-btn" onClick={() => setShowBookingModal(true)}>
                            Request Booking
                        </button>
                    </div>
                </div>

            </div>
            {showBookingModal && (
                <BookingModal
                    machine={machine}
                    onClose={() => setShowBookingModal(false)}
                />
            )}
        </div>
    );
};

export default MachineryDetail;

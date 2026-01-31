import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
    Car,
    MessageCircle,
    Search,
    MoreHorizontal,
    ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './SellerDashboard.css';

// Dark Mode Style for Google Maps
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

const SellerProfile = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    // Seller Data
    const [seller, setSeller] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [clientTrips, setClientTrips] = useState<any[]>([]); // trips between this client and seller
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Map State
    const [mapCenter, setMapCenter] = useState({ lat: 20.0, lng: 73.78 }); // Default Nashik

    // Load Google Maps Script
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    });

    const onLoad = useCallback(function callback() {
        // map state handled via center prop
    }, []);

    const onUnmount = useCallback(function callback() {
        // cleanup
    }, []);

    useEffect(() => {
        if (sellerId) {
            loadSellerData();
        }
    }, [sellerId, user]);

    useEffect(() => {
        if (products.length > 0 && !selectedProduct) {
            setSelectedProduct(products[0]);
        }
    }, [products]);

    // Update map and addresses when product or requests change
    useEffect(() => {
        if (selectedProduct && selectedProduct.lat && selectedProduct.lng) {
            setMapCenter({ lat: selectedProduct.lat, lng: selectedProduct.lng });
        }
    }, [selectedProduct, clientTrips, user]);


    const loadSellerData = async () => {
        if (!sellerId) return;
        setLoading(true);

        // --- DEMO DATA HANDLING ---
        if (sellerId.startsWith('demo-owner-')) {
            // Simulate data for demo items
            setSeller({
                id: sellerId,
                fullName: "Review Owner (Demo)",
                imageUrl: "https://i.pravatar.cc/150?img=12",
                email: "demo.owner@agroshare.com"
            });
            // Create a dummy product based on the known products or just generic
            setProducts([{
                id: 999,
                name: "Demo Tractor",
                image_url: "https://images.unsplash.com/photo-1592878931055-63657cd30089?auto=format&fit=crop&q=80&w=1000",
                price_per_hour: 1200,
                rating: 4.8,
                lat: 20.0,
                lng: 73.78,
                category: "Tractor"
            }]);
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch Seller Details
            // Users are in Clerk, but we sync them to a 'users' table in Supabase?
            // Existing code implies 'users' table join in products query: select('*, users(full_name, avatar_url)')
            // So we can fetch from 'users' table directly.

            // Wait, does 'users' table exist? api.ts has getSellerRentalRequests using 'products!inner(owner_id)'
            // Let's assume we can fetch products and get owner info from there for now if users table isn't directly queryable by ID easily or RLS blocks it.
            // Actually, best to fetch products first.

            const { data: productsData, error: prodError } = await supabase
                .from('products')
                .select('*, users(full_name, avatar_url, email)') // select owner details
                .eq('owner_id', sellerId);

            if (prodError) console.error("Error fetching products:", prodError);

            if (productsData && productsData.length > 0) {
                setProducts(productsData);
                // Extract seller info from the first product
                const first = productsData[0];
                if (first.users) {
                    setSeller({
                        id: sellerId,
                        fullName: first.users.full_name,
                        imageUrl: first.users.avatar_url,
                        email: first.users.email
                    });
                }
            }

            // 2. Fetch Client's Trips with this Seller
            // Request where requester_id = user.id AND product.owner_id = sellerId
            if (user) {
                // Better: Fetch all my requests, then filter in JS for this seller.

                const { data: myRequests } = await supabase
                    .from('rental_requests')
                    .select('*, products(*)')
                    .eq('requester_id', user.id);

                if (myRequests) {
                    const relevantRequests = myRequests.filter((r: any) => r.products && r.products.owner_id === sellerId);
                    setClientTrips(relevantRequests);
                }
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="seller-dashboard-container">
            {/* Sidebar (Read Only / Navigation) */}
            <aside className="dashboard-sidebar">
                <div
                    className="logo-icon cursor-pointer"
                    onClick={() => navigate(-1)}
                    title="Go Back"
                >
                    <ArrowLeft size={20} color="white" />
                </div>
                <div className="nav-item active">
                    <Car size={20} />
                </div>
                <div className="nav-item">
                    <MessageCircle size={20} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-header-row">
                    <div className="header-user-info">
                        <h1>{seller ? `${seller.fullName}'s Profile` : 'Seller Profile'}</h1>
                    </div>
                    <div className="header-actions">
                        <div className="date-pill">Viewing as Client</div>
                    </div>
                </div>

                <div className="dashboard-content-grid">
                    <div className="left-panel">
                        <div className="info-row">
                            <div className="vehicle-card">
                                <div className="vehicle-header">
                                    <h2 style={{ color: '#fff' }}>{selectedProduct?.name || 'No Machinery Listed'}</h2>
                                    <div className="stars">★★★★★</div>
                                </div>
                                <div className="vehicle-image-container">
                                    {selectedProduct?.image_url ? (
                                        <img
                                            src={selectedProduct.image_url}
                                            alt={selectedProduct.name}
                                            className="vehicle-image"
                                        />
                                    ) : (
                                        <div className="text-white/50 text-sm">Select a product</div>
                                    )}
                                </div>
                                <div className="vehicle-stats">
                                    <div>
                                        <p style={{ color: '#9ca3af', fontSize: '0.7rem' }}>Mileage</p>
                                        <p>N/A</p>
                                    </div>
                                    <div className="text-right">
                                        <p style={{ color: '#9ca3af', fontSize: '0.7rem' }}>Category</p>
                                        <p>{selectedProduct?.category || 'General'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-details">
                                    <div className="info-item">
                                        <span className="info-label">Rent</span>
                                        <span className="info-value">{selectedProduct ? formatCurrency(selectedProduct.price_per_hour) : '₹0'}/hr</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Fines</span>
                                        <span className="info-value">₹0</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Deposit</span>
                                        <span className="info-value info-green">Returned</span>
                                    </div>

                                    <div className="bg-slate-800 p-2 rounded-lg mt-2 flex items-center gap-2">
                                        <div className="bg-orange-500 w-8 h-5 rounded"></div>
                                        <span className="text-xs text-white">Bank **** 1458</span>
                                    </div>
                                </div>

                                <div className="info-user-side">
                                    <img src={seller?.imageUrl || "https://i.pravatar.cc/150"} className="info-avatar" alt="Owner" />
                                    <div className="info-name">{seller?.fullName || 'Seller'}</div>
                                    <div className="info-sub">{seller?.email || 'Contact for details'}</div>
                                    <button className="chat-btn mt-4">Start a chat</button>
                                </div>
                            </div>
                        </div>

                        {/* Map Section with Real Map */}
                        <div className="map-section">
                            <div className="map-view">
                                {/* Google Map */}
                                <div style={{ height: '100%', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
                                    {isLoaded ? (
                                        <GoogleMap
                                            mapContainerStyle={{ width: '100%', height: '100%' }}
                                            center={mapCenter}
                                            zoom={13}
                                            onLoad={onLoad}
                                            onUnmount={onUnmount}
                                            options={{
                                                styles: darkMapStyle,
                                                disableDefaultUI: true,
                                            }}
                                        >
                                            {selectedProduct && selectedProduct.lat && (
                                                <Marker position={{ lat: selectedProduct.lat, lng: selectedProduct.lng }} />
                                            )}
                                        </GoogleMap>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white bg-[#242f3e]">
                                            {loadError ? (
                                                <div className="text-center p-4">
                                                    <p className="text-red-400 font-bold mb-2">Error loading Google Maps</p>
                                                    <p className="text-xs text-red-300 opacity-80">{loadError.message}</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                                                    <p className="text-sm">Loading Maps...</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right-panel">
                        <div className="panel-header">
                            <h2>Your Trips</h2>
                            <div className="search-circle"><Search size={16} /></div>
                        </div>

                        <div className="trips-list">
                            {loading ? (
                                <p className="text-center text-gray-500">Loading...</p>
                            ) : clientTrips.length === 0 ? (
                                <p className="text-center text-gray-500">No trips with this seller</p>
                            ) : (
                                clientTrips.map(req => (
                                    <div className="trip-item" key={req.id}>
                                        <div className="trip-top">
                                            <div className="trip-user">
                                                {/* In client view, show Product Image icon instead of User Avatar maybe? Or Seller Avatar? */}
                                                {/* Showing Product Name */}
                                                <span className="font-medium text-sm">{req.products?.name || 'Machinery'}</span>
                                            </div>
                                            <MoreHorizontal size={16} className="text-gray-500" />
                                        </div>
                                        <div className="trip-details mt-2">
                                            <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                            <span className={`trip-status ${req.status === 'pending' ? 'active' : 'completed'}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <div className="trip-details mt-1">
                                            <span>Cost</span>
                                            <span className="text-white">{formatCurrency(req.total_price || 0)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SellerProfile;

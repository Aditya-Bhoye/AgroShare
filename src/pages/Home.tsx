import { useSearchParams } from 'react-router-dom';
import mapBackground from '../assets/map_background.png';
import tractorHero from '../assets/tractor_hero.png';
import harvesterHero from '../assets/harvester_hero.png';
import planterHero from '../assets/planter_hero.png';
import sprayerHero from '../assets/sprayer_hero.png';
import ploughHero from '../assets/plough_hero.png';

import tractorSide from '../assets/tractor_side_1768688693390.png';
import tractorFront from '../assets/tractor_front_1768688707408.png';
import tractorBack from '../assets/tractor_back_1768688722278.png';

import harvesterSide from '../assets/harvester_side_1768688735158.png';
import harvesterFront from '../assets/harvester_front_1768688748792.png';
import harvesterBack from '../assets/harvester_back_1768688763395.png';

import planterSide from '../assets/planter_side_1768688789280.png';
import planterRear from '../assets/planter_rear_1768688803041.png';

import sprayerSide from '../assets/sprayer_side_1768688816900.png';
import sprayerBoom from '../assets/sprayer_boom_1768688832277.png';

import ploughSide from '../assets/plough_side_1768688847275.png';
import ploughRear from '../assets/plough_rear_1768688861585.png';

import tillerSide from '../assets/tiller_side_1768688878108.png';
import tillerRear from '../assets/tiller_rear_1768688892277.png';

const machineryData = [
    // --- Original 6 Items (Featured) ---
    {
        id: "fbf2d2e0-af02-4158-b521-99ab75fd4c66", // Real Supabase Product ID for testing
        title: "John Deere 5050D",
        type: "Tractor",
        image: tractorHero,
        rating: "4.8",
        price: "₹1,200",
        desc: "High power, low fuel consumption tractor.",
        ownerName: "Ramesh Kumar",
        ownerImage: "https://i.pravatar.cc/150?img=11",
        ownerExperience: "8",
        totalRents: "245",
        location: [20.0112, 73.7902], // Nashik Road area
        gallery: [tractorHero, tractorSide, tractorFront, tractorBack],
        owner_id: "demo-owner-1"
    },
    {
        id: 2,
        title: "Combine Harvester X9",
        type: "Harvester",
        image: harvesterHero,
        rating: "4.9",
        price: "₹4,500",
        desc: "Efficient grain harvesting with max capacity.",
        ownerName: "Suresh Singh",
        ownerImage: "https://i.pravatar.cc/150?img=12",
        ownerExperience: "12",
        totalRents: "189",
        location: [19.9975, 73.7898], // Central Nashik
        gallery: [harvesterHero, harvesterSide, harvesterFront, harvesterBack],
        owner_id: "demo-owner-2"
    },
    {
        id: 3,
        title: "Precision Planter 12",
        type: "Planter",
        image: planterHero,
        rating: "4.7",
        price: "₹1,500",
        desc: "Accurate seed placement for higher yields.",
        ownerName: "Anita Devi",
        ownerImage: "https://i.pravatar.cc/150?img=5",
        ownerExperience: "6",
        totalRents: "156",
        location: [19.9615, 73.7897], // Panchavati area
        gallery: [planterHero, planterSide, planterRear],
        owner_id: "demo-owner-3"
    },
    {
        id: 4,
        title: "Mega Sprayer 5000",
        type: "Sprayer",
        image: sprayerHero,
        rating: "4.6",
        price: "₹1,800",
        desc: "Wide coverage crop protection system.",
        ownerName: "Vikram Patel",
        ownerImage: "https://i.pravatar.cc/150?img=13",
        ownerExperience: "7",
        totalRents: "203",
        location: [20.0359, 73.7721], // Malegaon Road area
        gallery: [sprayerHero, sprayerSide, sprayerBoom],
        owner_id: "demo-owner-4"
    },
    {
        id: 5,
        title: "Hydraulic Plough 5F",
        type: "Plough",
        image: ploughHero,
        rating: "4.8",
        price: "₹1,200",
        desc: "Deep tillage for superior soil preparation.",
        ownerName: "Rajesh Gupta",
        ownerImage: "https://i.pravatar.cc/150?img=68",
        ownerExperience: "10",
        totalRents: "178",
        location: [19.9872, 73.8315], // Gangapur Road area
        gallery: [ploughHero, ploughSide, ploughRear],
        owner_id: "demo-owner-5"
    },
    {
        id: 6,
        title: "Rotary Tiller 6ft",
        type: "Others",
        image: tillerSide,
        rating: "4.5",
        price: "₹1,000",
        desc: "Perfect for soil pulverization.",
        ownerName: "Sunita Sharma",
        ownerImage: "https://i.pravatar.cc/150?img=9",
        ownerExperience: "5",
        totalRents: "134",
        location: [20.0089, 73.7654], // Trimbak Road area
        gallery: [tillerSide, tillerRear],
        owner_id: "demo-owner-6"
    },

    // --- NEW ITEMS (Only shown on filter/search) ---

    // TRACTORS
    {
        id: 101,
        title: "Mahindra 575 DI",
        type: "Tractor",
        image: tractorHero,
        rating: "4.7",
        price: "₹1,100",
        desc: "Powerful engine, great for haulage operations.",
        ownerName: "Kailash Wagh",
        ownerImage: "https://i.pravatar.cc/150?img=33",
        ownerExperience: "15",
        totalRents: "312",
        location: [19.9500, 73.8000], // Nashik Road (Near Station)
        gallery: [tractorHero, tractorSide, tractorBack],
        owner_id: "demo-owner-101"
    },
    {
        id: 102,
        title: "Swaraj 855 FE",
        type: "Tractor",
        image: tractorHero,
        rating: "4.6",
        price: "₹1,150",
        desc: "Rugged and reliable, suitable for hard soil.",
        ownerName: "Dnyaneshwar Patil",
        ownerImage: "https://i.pravatar.cc/150?img=51",
        ownerExperience: "9",
        totalRents: "190",
        location: [20.0500, 73.8200], // Mhasrul
        gallery: [tractorHero, tractorFront, tractorSide],
        owner_id: "demo-owner-102"
    },
    {
        id: 103,
        title: "New Holland 3630",
        type: "Tractor",
        image: tractorHero,
        rating: "4.9",
        price: "₹1,300",
        desc: "Advanced technology for precision farming.",
        ownerName: "Amitabh Bachhav",
        ownerImage: "https://i.pravatar.cc/150?img=60",
        ownerExperience: "4",
        totalRents: "85",
        location: [19.9300, 73.7400], // Pathardi Phata
        gallery: [tractorHero, tractorSide, tractorBack],
        owner_id: "demo-owner-103"
    },

    // HARVESTERS
    {
        id: 201,
        title: "Kubota Harvester DC-68G",
        type: "Harvester",
        image: harvesterHero,
        rating: "4.8",
        price: "₹4,200",
        desc: "Compact design, excellent for paddy fields.",
        ownerName: "Gokul Shinde",
        ownerImage: "https://i.pravatar.cc/150?img=15",
        ownerExperience: "11",
        totalRents: "210",
        location: [20.1000, 73.9300], // Ozar
        gallery: [harvesterHero, harvesterSide, harvesterBack],
        owner_id: "demo-owner-201"
    },
    {
        id: 202,
        title: "Claas Crop Tiger 30",
        type: "Harvester",
        image: harvesterHero,
        rating: "4.7",
        price: "₹4,000",
        desc: "Versatile track harvester for wet fields.",
        ownerName: "Mohan Joshi",
        ownerImage: "https://i.pravatar.cc/150?img=22",
        ownerExperience: "18",
        totalRents: "405",
        location: [19.8500, 74.0000], // Sinnar Area
        gallery: [harvesterHero, harvesterFront, harvesterSide],
        owner_id: "demo-owner-202"
    },

    // PLANTERS
    {
        id: 301,
        title: "National Multi-Crop Planter",
        type: "Planter",
        image: planterHero,
        rating: "4.5",
        price: "₹1,400",
        desc: "Adjustable row spacing for various crops.",
        ownerName: "Savita Gaikwad",
        ownerImage: "https://i.pravatar.cc/150?img=44",
        ownerExperience: "6",
        totalRents: "98",
        location: [20.0200, 73.7500], // Gangapur
        gallery: [planterHero, planterSide, planterRear],
        owner_id: "demo-owner-301"
    },
    {
        id: 302,
        title: "Pneumatic Planter 6-Row",
        type: "Planter",
        image: planterHero,
        rating: "4.8",
        price: "₹1,650",
        desc: "High speed planting with precision.",
        ownerName: "Robert D'souza",
        ownerImage: "https://i.pravatar.cc/150?img=10",
        ownerExperience: "12",
        totalRents: "167",
        location: [19.9000, 73.8300], // Deolali Camp
        gallery: [planterHero, planterRear, planterSide],
        owner_id: "demo-owner-302"
    },

    // SPRAYERS
    {
        id: 401,
        title: "Mitra Bullet Sprayer",
        type: "Sprayer",
        image: sprayerHero,
        rating: "4.6",
        price: "₹1,700",
        desc: "Ideal for vineyards and orchards.",
        ownerName: "Nashik Grapes Assoc.",
        ownerImage: "https://i.pravatar.cc/150?img=8",
        ownerExperience: "20",
        totalRents: "890",
        location: [20.0800, 73.8500], // Adgaon
        gallery: [sprayerHero, sprayerSide, sprayerBoom],
        owner_id: "demo-owner-401"
    },
    {
        id: 402,
        title: "Aspee Tractor Mounted",
        type: "Sprayer",
        image: sprayerHero,
        rating: "4.4",
        price: "₹1,500",
        desc: "Cost effective spraying solution.",
        ownerName: "Bhausaheb Thorat",
        ownerImage: "https://i.pravatar.cc/150?img=55",
        ownerExperience: "3",
        totalRents: "45",
        location: [19.9700, 73.7700], // Cidco
        gallery: [sprayerHero, sprayerBoom, sprayerSide],
        owner_id: "demo-owner-402"
    },

    // PLOUGHS
    {
        id: 501,
        title: "Lemken Opal 090",
        type: "Plough",
        image: ploughHero,
        rating: "4.9",
        price: "₹1,400",
        desc: "Reversible plough for quick turnover.",
        ownerName: "Arjun Rampal",
        ownerImage: "https://i.pravatar.cc/150?img=65",
        ownerExperience: "14",
        totalRents: "330",
        location: [19.9900, 73.7400], // Satpur
        gallery: [ploughHero, ploughSide, ploughRear],
        owner_id: "demo-owner-501"
    },
    {
        id: 502,
        title: "Fieldking Disc Plough",
        type: "Plough",
        image: ploughHero,
        rating: "4.6",
        price: "₹1,100",
        desc: "Best for stony and hard soil conditions.",
        ownerName: "Laxman Bhujbal",
        ownerImage: "https://i.pravatar.cc/150?img=59",
        ownerExperience: "25",
        totalRents: "600",
        location: [20.0050, 73.8100], // Panchavati (East)
        gallery: [ploughHero, ploughRear, ploughSide],
        owner_id: "demo-owner-502"
    }
];

import { useState, useEffect } from 'react';
import MachineryDetail from '../components/MachineryDetail';
import Footer from '../components/Footer';
import ShowcaseCard from '../components/ShowcaseCard';

const SEARCH_PHRASES = [
    "Search for Tractors near me...",
    "Search for Harvesters near me...",
    "Search for Planters near me...",
    "Search for Sprayers near me...",
    "Search for Ploughs near me..."
];

const Home = () => {
    // --- STATE ---
    const [placeholder, setPlaceholder] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(80);

    // Core Data State
    const [selectedMachine, setSelectedMachine] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    // Geolocation & Sorting State
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [shouldSortByDistance, setShouldSortByDistance] = useState(false);
    const [accurateDistances, setAccurateDistances] = useState<{ [key: string]: number }>({});

    // Haversine (Placeholder while loading accurate data)
    const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    const deg2rad = (deg: number) => deg * (Math.PI / 180);

    // --- EFFECTS ---

    // 1. Fetch Products from Supabase
    useEffect(() => {
        const loadProducts = async () => {
            const { data, error } = await import('../lib/supabase').then(m => m.supabase
                .from('products')
                .select('*, users(full_name, avatar_url)')
            );
            if (error) {
                console.error("Error loading products:", error);
            } else {
                const formatted = data.map((p: any) => ({
                    id: p.id,
                    title: p.name,
                    type: p.category,
                    image: p.image_url,
                    rating: "New",
                    price: `₹${p.price_per_hour}`,
                    desc: p.description,
                    ownerName: p.users?.full_name || "Supabase User",
                    ownerImage: p.users?.avatar_url || "https://i.pravatar.cc/150?img=3",
                    location: [p.lat, p.lng],
                    gallery: p.gallery_urls,
                    totalRents: "0",
                    ownerExperience: "0",
                    owner_id: p.owner_id // Pass owner_id
                }));
                setProducts(formatted);
            }
        };
        loadProducts();
    }, []);

    // 2. Fetch User Location & Trigger Sort Timer
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error(err)
            );
        }
        const timer = setTimeout(() => setShouldSortByDistance(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    // 3. Fetch Accurate Distances (Matrix API) when user location or products change
    useEffect(() => {
        if (!userLocation) return;

        const fetchAccurateData = async () => {
            const allItems = [...machineryData, ...products];
            // Filter items that have locations
            const targetItems = allItems.filter(item => item.location);
            const destinations: [number, number][] = targetItems.map(item => [item.location[0], item.location[1]]);

            if (destinations.length === 0) return;

            // Import dynamically to avoid top-level dependency issues if any
            const { fetchMatrix } = await import('../services/openRouteService');

            // Limit to 50 items to be safe with free tier matrix limits just in case
            // (ORS standard limit is often around 50x1 or 5x10)
            const slicedDestinations = destinations.slice(0, 45);

            const distances = await fetchMatrix([userLocation.lat, userLocation.lng], slicedDestinations);

            if (distances) {
                const newDistances: { [key: string]: number } = {};
                distances.forEach((dist: number, index: number) => {
                    if (dist !== null) {
                        const itemId = targetItems[index].id;
                        newDistances[itemId] = dist;
                    }
                });
                setAccurateDistances(prev => ({ ...prev, ...newDistances }));
            }
        };

        fetchAccurateData();
    }, [userLocation, products.length]); // Depend on product count change

    // --- FILTERING & SORTING LOGIC ---
    const allMachinery = [...machineryData, ...products];

    let visibleMachinery = allMachinery.map(item => {
        // Priority: Accurate Distance > Haversine
        let dist = null;
        if (accurateDistances[item.id] !== undefined) {
            dist = accurateDistances[item.id];
        } else if (userLocation && item.location) {
            dist = calculateHaversine(userLocation.lat, userLocation.lng, item.location[0], item.location[1]);
        }
        return { ...item, distance: dist };
    }).filter(item => {
        // 1. Initial State Check: If NO filter and NO search, show ONLY the first 6 featured items.
        if (!categoryFilter && !searchQuery) {
            // Check if item is in the original 6 of the hardcoded list (by ID is safer if we had consistent IDs, but index works for now)
            // We use the original index from the raw data
            const index = machineryData.findIndex(m => m.id === item.id);
            return index >= 0 && index < 6;
        }

        // 2. Filter by Category
        let matchesCategory = true;
        if (categoryFilter) {
            if (categoryFilter === 'Others') {
                matchesCategory = item.type === 'Others';
            } else {
                matchesCategory = item.type.toLowerCase().includes(categoryFilter.toLowerCase().replace(/s$/, ''));
            }
        }

        // 3. Filter by Search Query
        let matchesSearch = true;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            matchesSearch = item.title.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q.replace(/s$/, '')) || // Handle plurals (e.g. "Tractors" -> "Tractor")
                item.desc.toLowerCase().includes(q) ||
                item.ownerName.toLowerCase().includes(q);
        }

        return matchesCategory && matchesSearch;
    });

    // Apply Sorting if enabled and user location exists
    if (shouldSortByDistance && userLocation) {
        visibleMachinery.sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
    }

    // Typing effect logic...
    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % SEARCH_PHRASES.length;
            const fullText = SEARCH_PHRASES[i];

            setPlaceholder(isDeleting
                ? fullText.substring(0, placeholder.length - 1)
                : fullText.substring(0, placeholder.length + 1)
            );

            setTypingSpeed(isDeleting ? 25 : 50);

            if (!isDeleting && placeholder === fullText) {
                setTimeout(() => setIsDeleting(true), 1500); // Pause at full text
            } else if (isDeleting && placeholder === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [placeholder, isDeleting, loopNum, typingSpeed]);

    return (
        <>
            {/* Top Hero Section (White) */}
            <div style={{
                backgroundColor: 'transparent', /* Changed to transparent to let map show through */
                padding: '0px 20px 60px', /* Removed top padding */
                marginTop: '-30px', /* Negative margin to pull up closer to Navbar */
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                marginBottom: '0' /* Ensure no margin pushes content down */
            }}>
                <h1 style={{
                    fontSize: '4rem', /* Slightly adjusted size for better fit with multiple lines */
                    fontWeight: '900', /* Extra Bold */
                    color: 'var(--text-primary)',
                    marginBottom: '1rem',
                    letterSpacing: '-1.5px',
                    lineHeight: '1.1'
                }}>Rent <span style={{ color: '#2e7d32' }}>Agriculture</span><br />Equipments</h1>
                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>Find the best machinery for your farm near you. Rent tractors, harvesters, and more with ease.</p>

                {/* Search Bar */}
                <div style={{
                    position: 'relative',
                    maxWidth: '500px', /* Reduced width */
                    margin: '0 auto',
                    marginBottom: '2rem'
                }}>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSearchQuery(val);

                            // Suggestion Logic
                            if (val.length > 0) {
                                const allTypes = [...new Set([...machineryData, ...products].map(i => i.type))];
                                const allTitles = [...new Set([...machineryData, ...products].map(i => i.title))];
                                const combined = [...allTypes, ...allTitles];
                                const filtered = combined.filter(item =>
                                    item.toLowerCase().startsWith(val.toLowerCase())
                                ).slice(0, 5); // Limit to 5
                                setSuggestions(filtered);
                                setShowSuggestions(true);
                            } else {
                                setShowSuggestions(false);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '18px 30px',
                            paddingLeft: '50px', /* Space for left icon */
                            paddingRight: '60px',
                            borderRadius: '50px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-secondary)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
                            e.target.style.borderColor = 'var(--accent-color)';
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                            e.target.style.borderColor = 'var(--border-color)';
                            // Delay hiding to allow click
                            setTimeout(() => setShowSuggestions(false), 200);
                        }}
                    />

                    {/* Search Icon on Left */}
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-secondary)',
                            pointerEvents: 'none'
                        }}
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '20px', /* Align with input text start somewhat */
                            right: '20px',
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            marginTop: '10px',
                            zIndex: 100,
                            overflow: 'hidden',
                            textAlign: 'left'
                        }}>
                            {suggestions.map((s, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setSearchQuery(s);
                                        setShowSuggestions(false);
                                    }}
                                    style={{
                                        padding: '12px 20px',
                                        cursor: 'pointer',
                                        borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid #f0f0f0',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Map Section (Background) */}
            <div style={{
                position: 'relative',
                height: '650px', /* Reduced height as requested */
                width: '100%',
                overflow: 'hidden',
                marginTop: '-450px', /* Adjusted pull-up to move map upward */
                zIndex: 1
            }}>
                <img src={mapBackground} alt="Map Background" style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.8,
                    filter: 'grayscale(20%) contrast(1.1)'
                }} />
                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    /* Gradient: Solid White top 50%, then fades to transparent by 75% */
                    background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 50%, rgba(255,255,255,0) 75%, var(--bg-primary) 100%)'
                }}></div>
            </div>

            {/* Machinery Filters Section */}
            <div style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '3rem 2rem',
                position: 'relative',
                zIndex: 2,
                textAlign: 'center'
            }}>
                {/* Filter Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '1rem'
                }}>
                    {['All', 'Tractors', 'Harvesters', 'Planters', 'Sprayers', 'Ploughs', 'Others'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '30px',
                                border: 'none',
                                backgroundColor: (categoryFilter === cat) || (!categoryFilter && cat === 'All')
                                    ? 'var(--button-bg)'
                                    : 'var(--bg-secondary)',
                                color: (categoryFilter === cat) || (!categoryFilter && cat === 'All')
                                    ? 'var(--button-text)'
                                    : 'var(--text-secondary)',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: (categoryFilter === cat) ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
                                transform: (categoryFilter === cat) ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Machinery Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                    gap: '2rem',
                    marginTop: '3rem',
                    width: '100%',
                    maxWidth: '1600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    /* Animation for reordering */
                    transition: 'all 0.5s ease-in-out'
                }}>
                    {visibleMachinery.map((item) => (
                        <ShowcaseCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedMachine(item)}
                        />
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <MachineryDetail machine={selectedMachine} onClose={() => setSelectedMachine(null)} />

            <Footer />
        </>
    );
};

export default Home;


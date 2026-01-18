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
    {
        id: 1,
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
        gallery: [tractorHero, tractorSide, tractorFront, tractorBack]
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
        gallery: [harvesterHero, harvesterSide, harvesterFront, harvesterBack]
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
        gallery: [planterHero, planterSide, planterRear]
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
        gallery: [sprayerHero, sprayerSide, sprayerBoom]
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
        gallery: [ploughHero, ploughSide, ploughRear]
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
        gallery: [tillerSide, tillerRear]
    }
];

import { useState, useEffect } from 'react';
import MachineryDetail from '../components/MachineryDetail';

const SEARCH_PHRASES = [
    "Search for Tractors near me...",
    "Search for Harvesters near me...",
    "Search for Planters near me...",
    "Search for Sprayers near me...",
    "Search for Ploughs near me..."
];

const Home = () => {
    const [placeholder, setPlaceholder] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(80);
    const [selectedMachine, setSelectedMachine] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        // Fetch products from Supabase
        const loadProducts = async () => {
            const { data, error } = await import('../lib/supabase').then(m => m.supabase.from('products').select('*'));
            if (error) {
                console.error("Error loading products:", error);
            } else {
                // format supabase products to match UI
                const formatted = data.map((p: any) => ({
                    id: p.id,
                    title: p.name,
                    type: p.category,
                    image: p.image_url,
                    rating: "New",
                    price: `₹${p.price_per_hour}`,
                    desc: p.description,
                    ownerName: "Supabase User", // Placeholder or fetch owner details
                    ownerImage: "https://i.pravatar.cc/150?img=3",
                    location: [p.lat, p.lng],
                    gallery: p.gallery_urls // Ensure machinery detail handles this
                }));
                setProducts(formatted);
            }
        };
        loadProducts();
    }, []);

    const allMachinery = [...machineryData, ...products];

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
                backgroundColor: 'var(--bg-primary)',
                paddingTop: '20px', /* Minimal padding since navbar is relative */
                paddingBottom: '0px', /* Removed padding to bring map closer */
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2 /* Above the map */
            }}>
                <div style={{ textAlign: 'center', maxWidth: '800px', padding: '0 20px' }}>
                    <h1 style={{
                        fontSize: '5rem',
                        fontWeight: '700',
                        lineHeight: '1.1',
                        color: 'var(--text-primary)',
                        margin: 0,
                        textShadow: '0 10px 30px rgba(255,255,255,0.8)'
                    }}>
                        Rent <span style={{ color: 'var(--accent-color)' }}>Agriculture</span> <br />
                        Equipments
                    </h1>
                    <p style={{ margin: '1.5rem auto', fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
                        Connect with local farmers to rent the best machinery for your needs.
                    </p>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '-50px', /* Half overlapping */
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '800px', /* Increased width */
                    zIndex: 10
                }}>
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '20px',
                        padding: '25px', /* Increased padding for taller box */
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '10px' }}>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder={placeholder}
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontSize: '1.1rem',
                                padding: '10px 15px',
                                color: 'var(--text-primary)',
                                background: 'transparent'
                            }}
                        />
                        <button style={{
                            backgroundColor: 'var(--button-bg)',
                            color: 'var(--button-text)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 25px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div style={{
                backgroundImage: `url(${mapBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '50vh', /* Substantial height for the map */
                width: '100%',
                position: 'relative',
                zIndex: 1,
                marginTop: '-40px' /* Pull map up as requested */
            }}>
                {/* Overlay to blend map with white background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '250px', /* Increased height for even smoother blend */
                    background: 'linear-gradient(to bottom, var(--bg-primary) 0%, var(--bg-primary) 20%, transparent 100%)', /* Keeps top solid white */
                    backdropFilter: 'blur(5px)',
                    pointerEvents: 'none'
                }}></div>
            </div>

            {/* Machinery Filters Section */}
            <div style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '3rem 2rem',
                position: 'relative',
                zIndex: 2, /* Above map so it doesn't get covered if map bleeds */
                textAlign: 'center'
            }}>
                {/* Separation Line */}
                <div style={{
                    height: '1px',
                    backgroundColor: 'var(--border-color)',
                    width: '80%',
                    maxWidth: '1200px',
                    margin: '0 auto 3rem auto'
                }}></div>

                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '2rem'
                }}>
                    Which agriculture product machinery we want on rent
                </h2>

                {/* Filter Pills */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    {['Tractors', 'Harvesters', 'Planters', 'Sprayers', 'Plough', 'Others'].map((item) => (
                        <button key={item} style={{
                            padding: '12px 24px',
                            borderRadius: '30px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--card-bg)',
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}>
                            {item}
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
                    marginRight: 'auto'
                }}>
                    {allMachinery.map((item) => (
                        <div key={item.id} style={{
                            backgroundColor: 'var(--card-bg)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                            border: '1px solid var(--border-color)',
                            textAlign: 'left',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            onClick={() => setSelectedMachine(item)}
                        >
                            <div style={{
                                height: '200px',
                                width: '100%',
                                backgroundColor: 'var(--bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1rem'
                            }}>
                                <img src={item.image} alt={item.type} style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }} />
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{item.title}</h3>
                                    <span style={{ backgroundColor: '#e8f5e9', color: 'var(--accent-color)', padding: '4px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>{item.rating} ★</span>
                                </div>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    marginBottom: '1rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    minHeight: '2.8em' // Reserve space for 2 lines to align buttons
                                }}>{item.desc}</p>

                                {/* Owner Section */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <img src={item.ownerImage} alt={item.ownerName} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} />
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>{item.ownerName}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.price}<span style={{ fontSize: '0.9rem', fontWeight: '400', color: '#999' }}>/hr</span></span>
                                    <button style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'var(--button-bg)',
                                        color: 'var(--button-text)',
                                        border: 'none',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer'
                                    }}>Rent Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <MachineryDetail machine={selectedMachine} onClose={() => setSelectedMachine(null)} />
        </>
    );
};

export default Home;

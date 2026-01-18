import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Navbar.css';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Plus, LayoutDashboard } from 'lucide-react';
import CompleteProfileForm from './CompleteProfileForm';
import WelcomeCard from './WelcomeCard';
import AddProductModal from './AddProductModal';
import { fetchUser, updateUser } from '../services/api';

const Navbar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const { isSignedIn, user } = useUser();

    // Trigger Welcome Animation on Login & Load DB Role
    useEffect(() => {
        if (isSignedIn && user) {
            // Load from SQL DB
            fetchUser(user.id).then((userData: any) => {
                if (userData && userData.role) {
                    console.log("Loaded role from DB:", userData.role);
                    setUserRole(userData.role);
                } else {
                    console.log("No role found in DB, showing Welcome Card");
                    // Only show welcome if no role is saved (first time)
                    setShowWelcome(true);
                }
            });
        }
    }, [isSignedIn, user]);

    const isSeller = userRole === 'Seller';

    return (
        <>
            <nav className="navbar">
                <a href="/" className="navbar-logo">AgroShare</a>
                <ul className="navbar-links">
                    <li><a href="/" className="navbar-link">Home</a></li>
                    <li><a href="/about" className="navbar-link">About</a></li>
                    <li><a href="/services" className="navbar-link">Services</a></li>
                    <li><a href="/contact" className="navbar-link">Contact</a></li>
                </ul>
                <div className="navbar-actions">
                    {isSeller && (
                        <button className="btn-rent" onClick={() => setShowAddProduct(true)}>
                            <Plus size={16} strokeWidth={2.5} />
                            Add for Rent
                        </button>
                    )}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button style={{
                                padding: '10px 24px',
                                background: 'var(--button-bg)',
                                border: 'none',
                                borderRadius: '20px',
                                color: 'var(--button-text)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                                }}
                            >Sign In</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="navbar-user-container">
                            <UserButton appearance={{
                                elements: {
                                    userButtonAvatarBox: {
                                        width: '45px',
                                        height: '45px'
                                    },
                                    userButtonPopoverCard: {
                                        // Keeping explicit styles as backup to global CSS
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }
                                }
                            }}>
                                <UserButton.MenuItems>
                                    {isSeller && (
                                        <UserButton.Action
                                            label="Seller Dashboard"
                                            labelIcon={<LayoutDashboard size={16} />}
                                            onClick={() => window.location.href = '/dashboard'}
                                        />
                                    )}
                                    <UserButton.Action
                                        label="Manage Profile"
                                        labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                                        onClick={() => setShowProfile(true)}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                            {userRole && (
                                <div className={`nav-sticker ${userRole.toLowerCase()}`}>
                                    {userRole}
                                </div>
                            )}

                        </div>
                    </SignedIn>
                </div>
            </nav>

            {/* Welcome Card Overlay */}
            {showWelcome && createPortal(
                <WelcomeCard onSave={async (role) => {
                    if (!role) return; // Don't save if null
                    setUserRole(role);
                    if (user) {
                        try {
                            await updateUser({
                                clerk_id: user.id,
                                role,
                                full_name: user.fullName || ''
                            });
                            console.log("Role saved to DB:", role);
                        } catch (e) {
                            console.error("Failed to save role:", e);
                        }
                    }
                    setShowWelcome(false);
                }} />,
                document.body
            )}

            {/* Circular/Rounded Modal Overlay - Portalled to Body */}
            {showProfile && createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999, /* Very high z-index to stay on top */
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease'
                }}
                    onClick={() => setShowProfile(false)}
                >
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '2rem',
                        borderRadius: '40px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        maxWidth: '1000px',
                        width: '90%',
                        maxHeight: '75vh',
                        overflow: 'auto',
                        position: 'relative',
                        border: '1px solid var(--border-color)',
                        animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ width: '100%' }}>
                            <CompleteProfileForm
                                onClose={() => setShowProfile(false)}
                                initialRole={userRole}
                            />
                        </div>
                        <button
                            onClick={() => setShowProfile(false)}
                            style={{
                                position: 'absolute',
                                top: '25px',
                                right: '30px',
                                background: 'var(--bg-secondary)',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                zIndex: 10
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>,
                document.body
            )}
            {/* Add Product Modal */}
            {showAddProduct && createPortal(
                <AddProductModal onClose={() => setShowAddProduct(false)} />,
                document.body
            )}
        </>
    );
};
export default Navbar;

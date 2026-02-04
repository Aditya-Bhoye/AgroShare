import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Edit2, Loader2, User as UserIcon, LayoutDashboard, Calendar } from 'lucide-react';
import './CompleteProfileForm.css';
import { updateUser, getUserBookings } from '../services/api';

const CompleteProfileForm = ({ onClose, initialRole, initialTab = 'profile' }: { onClose: () => void, initialRole?: string | null, initialTab?: 'profile' | 'bookings' }) => {
    const { user } = useUser();
    const [role, setRole] = useState(initialRole || "");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    // Dashboard Logic
    const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>(initialTab);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'bookings' && user) {
            getUserBookings(user.id).then(setBookings);
        }
    }, [activeTab, user]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            user?.setProfileImage({ file });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await updateUser({
                clerk_id: user.id,
                role: role,
                full_name: user?.fullName || '',
                address: address,
                phone: phone
            });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-card-wrapper">
            <div className="profile-layout">
                {/* Left Sidebar */}
                <div className="profile-sidebar">
                    <div className="profile-header">
                        <label htmlFor="pfp-upload" className="ref-pfp-container">
                            <img src={user?.imageUrl} alt="Profile" className="ref-pfp-image" />



                            <div className="ref-pfp-edit-btn">
                                <Edit2 size={20} color="white" />
                            </div>
                        </label>
                        <input id="pfp-upload" type="file" accept="image/*" hidden onChange={handleImageUpload} />

                        <h3 className="profile-name">{user?.fullName || "User"}</h3>
                    </div>

                    <div className="profile-menu" style={{ marginTop: '2rem' }}>
                        <div
                            className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <UserIcon size={18} /> Personal Info
                        </div>
                        <div
                            className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            <LayoutDashboard size={18} /> My Bookings
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="profile-content">
                    {/* Mobile Tab Switcher */}
                    <div className="mobile-tabs">
                        <button
                            className={`mobile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Personal Info
                        </button>
                        <button
                            className={`mobile-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            My Bookings
                        </button>
                    </div>

                    {activeTab === 'profile' ? (
                        <>
                            <h2 className="content-title desktop-only">Personal Information</h2>

                            <form className="ref-form" onSubmit={handleSubmit}>
                                <div className="ref-form-grid">
                                    {/* Role - First as requested */}
                                    <div className="ref-form-group full-width">
                                        <label>I am a...</label>
                                        <div className="role-options-container">
                                            <button
                                                type="button"
                                                className={`role-select-btn ${role === 'Seller' ? 'active' : ''}`}
                                                onClick={() => setRole('Seller')}
                                            >
                                                Seller
                                            </button>
                                            <button
                                                type="button"
                                                className={`role-select-btn ${role === 'Lessee' ? 'active' : ''}`}
                                                onClick={() => setRole('Lessee')}
                                            >
                                                Lessee
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email - Second */}
                                    <div className="ref-form-group full-width">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                                            className="ref-input"
                                            readOnly
                                            style={{ opacity: 0.7 }}
                                        />
                                    </div>

                                    <div className="ref-form-group">
                                        <label>Full Name</label>
                                        <input type="text" defaultValue={user?.fullName || ""} className="ref-input" />
                                    </div>

                                    <div className="ref-form-group full-width">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            placeholder="123 Farm Lane, Rural District"
                                            className="ref-input"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>

                                    <div className="ref-form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="(405) 555-0128"
                                            className="ref-input"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="ref-form-group">
                                        <label>Postal Code</label>
                                        <input type="text" placeholder="30301" className="ref-input" />
                                    </div>
                                </div>

                                <div className="ref-actions">
                                    <button type="button" className="btn-discard" onClick={onClose} disabled={loading}>Discard Changes</button>
                                    <button type="submit" className="btn-save" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="content-title desktop-only">My Bookings</h2>
                            <div className="bookings-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {bookings.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                        <p>No bookings found.</p>
                                    </div>
                                ) : (
                                    bookings.map((booking) => (
                                        <div key={booking.id} style={{
                                            border: '1px solid #eee',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: '#f9f9f9'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '50px', height: '50px',
                                                    background: '#e0f7fa',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Calendar size={24} color="#006064" />
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>
                                                        {new Date(booking.date).toLocaleDateString()}
                                                    </h4>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                                                        {booking.duration} Hours - {booking.start_time} to {booking.end_time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2e7d32' }}>
                                                    ₹{booking.total_cost}
                                                </div>
                                                <span style={{
                                                    fontSize: '0.8rem',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    background: '#e8f5e9',
                                                    color: '#2e7d32',
                                                    fontWeight: '600'
                                                }}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompleteProfileForm;

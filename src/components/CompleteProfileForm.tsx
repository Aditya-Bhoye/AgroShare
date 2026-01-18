import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Edit2, Loader2 } from 'lucide-react';
import './CompleteProfileForm.css';
import { updateUser } from '../services/api';

const CompleteProfileForm = ({ onClose, initialRole }: { onClose: () => void, initialRole?: string | null }) => {
    const { user } = useUser();
    const [role, setRole] = useState(initialRole || "");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

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

                </div>

                {/* Right Content */}
                <div className="profile-content">
                    <h2 className="content-title">Personal Information</h2>

                    <form className="ref-form" onSubmit={handleSubmit}>
                        <div className="ref-form-grid">
                            <div className="ref-form-group">
                                <label>Full Name</label>
                                <input type="text" defaultValue={user?.fullName || ""} className="ref-input" />
                            </div>

                            <div className="ref-form-group">
                                <label>Role</label>
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
                </div>
            </div>
        </div>
    );
};

export default CompleteProfileForm;

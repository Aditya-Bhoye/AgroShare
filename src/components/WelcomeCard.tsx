import { useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Check } from 'lucide-react';
import './WelcomeCard.css';

const WelcomeCard = ({ onSave }: { onSave: (role: string | null) => void }) => {
    const { user } = useUser();
    const [role, setRole] = useState<string | null>(null);

    if (!user) return null;

    return (
        <div className="welcome-overlay">
            <div className="welcome-card-wrapper">
                <div className="welcome-card">
                    {/* Clean Card - No Decorative Elements */}

                    <div className="card-content">
                        <div className="avatar-container">
                            <img
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                className="user-avatar-lg"
                            />
                            {role && (
                                <div className={`role-sticker ${role.toLowerCase()}`}>
                                    {role.toUpperCase()}
                                </div>
                            )}

                        </div>

                        <h2 className="user-name">{user.fullName}</h2>
                        <p className="user-role">AgroShare Member</p>

                        {/* Stats Row Removed */}

                        {/* Role Selection Row */}
                        <div className="role-selection-row">
                            <button
                                className={`role-btn ${role === 'Seller' ? 'selected' : ''}`}
                                onClick={() => setRole('Seller')}
                            >
                                Seller
                            </button>
                            <button
                                className={`role-btn ${role === 'Lessee' ? 'selected' : ''}`}
                                onClick={() => setRole('Lessee')}
                            >
                                Lessee
                            </button>
                        </div>

                        {/* Main Action Row */}
                        <div className="action-row">
                            <button className="btn-full" onClick={() => onSave(role)}>
                                <Check size={18} strokeWidth={3} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeCard;

import { MapPin, Star, ArrowRight } from 'lucide-react';
// Force Vercel Rebuild
import './ShowcaseCard.css';

interface ShowcaseCardProps {
    item: any;
    onClick: () => void;
}

const ShowcaseCard = ({ item, onClick }: ShowcaseCardProps) => {
    return (
        <div className="showcase-card" onClick={onClick}>
            {/* Distance Badge */}
            {item.distance !== null && (
                <div className="distance-badge">
                    <MapPin size={14} fill="currentColor" strokeWidth={2.5} />
                    <span>{typeof item.distance === 'number' ? item.distance.toFixed(1) : item.distance} km</span>
                </div>
            )}

            <div className="image-container">
                <img src={item.image} alt={item.type} className="card-image" />
            </div>

            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{item.title}</h3>
                </div>

                <p className="card-desc">{item.desc}</p>

                <div className="owner-row">
                    <img src={item.ownerImage} alt={item.ownerName} className="owner-avatar" />
                    <span className="owner-name">{item.ownerName}</span>
                    <div className="rating-badge" style={{ marginLeft: 'auto' }}>
                        <span>{item.rating}</span>
                        <Star size={12} fill="currentColor" strokeWidth={0} />
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <div className="price-tag">
                    <span className="price-amount">{item.price}</span>
                    <span className="price-unit">/ hr</span>
                </div>
                <button className="rent-btn">
                    Rent Now
                    <ArrowRight size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default ShowcaseCard;

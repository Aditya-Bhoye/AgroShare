import { useState } from 'react';
import { X, Upload, MapPin, Loader2 } from 'lucide-react';
import { createProduct, uploadProductImage } from '../services/api';
import { useUser } from '@clerk/clerk-react';
import './MachineryDetail.css'; // Reuse styles
import './AddProductModal.css';

interface AddProductModalProps {
    onClose: () => void;
}

const AddProductModal = ({ onClose }: AddProductModalProps) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Tractor',
        description: '',
        price_per_hour: '',
        lat: 0,
        lng: 0
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const getLocation = () => {
        setLocationStatus('loading');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }));
                    setLocationStatus('success');
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationStatus('error');
                }
            );
        } else {
            setLocationStatus('error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !imageFile) {
            alert("Please sign in and select an image.");
            return;
        }

        setLoading(true);
        try {
            // 1. Upload Image
            const imageUrl = await uploadProductImage(imageFile);
            if (!imageUrl) throw new Error("Image upload failed");

            // 2. Create Product
            await createProduct({
                owner_id: user.id,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price_per_hour: parseFloat(formData.price_per_hour),
                image_url: imageUrl,
                lat: formData.lat,
                lng: formData.lng
            });

            onClose();
            alert("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="machinery-modal-overlay">
            <div className="machinery-modal-content">
                <button className="close-btn" onClick={onClose}>
                    <X size={24} color="#333" />
                </button>

                <div style={{ padding: '30px', width: '100%', overflowY: 'auto' }}>
                    <h2 style={{ marginBottom: '20px' }}>List Your Equipment</h2>

                    <form onSubmit={handleSubmit} className="ref-form">
                        <div className="ref-form-group full-width">
                            <label>Equipment Name</label>
                            <input
                                type="text"
                                name="name"
                                className="ref-input"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="ref-form-group full-width">
                            <label>Category</label>
                            <select
                                name="category"
                                className="ref-input"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="Tractor">Tractor</option>
                                <option value="Harvester">Harvester</option>
                                <option value="Planter">Planter</option>
                                <option value="Sprayer">Sprayer</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="ref-form-group full-width">
                            <label>Price per Hour ($)</label>
                            <input
                                type="number"
                                name="price_per_hour"
                                className="ref-input"
                                value={formData.price_per_hour}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="ref-form-group full-width">
                            <label>Description</label>
                            <textarea
                                name="description"
                                className="ref-input"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                            />
                        </div>

                        <div className="ref-form-group full-width">
                            <label>Upload Image</label>
                            <div className="upload-container" style={{ border: '1px dashed #ccc', padding: '10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    id="product-image-upload"
                                />
                                <label htmlFor="product-image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Upload size={24} />
                                    <span>{imageFile ? imageFile.name : "Click to Upload"}</span>
                                </label>
                            </div>
                        </div>

                        <div className="ref-form-group full-width">
                            <label>Location</label>
                            <button type="button" className="btn-save" onClick={getLocation} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: locationStatus === 'success' ? '#4CAF50' : '#FF9933' }}>
                                <MapPin size={18} />
                                {locationStatus === 'loading' ? 'Fetching...' :
                                    locationStatus === 'success' ? 'Location Set' :
                                        'Get Current Location'}
                            </button>
                        </div>

                        <button type="submit" className="btn-save" style={{ marginTop: '20px', width: '100%' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "List Product"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;

export interface Product {
    id?: string;
    owner_id: string;
    name: string;
    category: string;
    description: string;
    price_per_hour: number;
    image_url: string;
    gallery_urls?: string[];
    lat: number;
    lng: number;
}

export interface UserData {
    clerk_id: string;
    role?: string;
    full_name?: string;
    address?: string;
    phone?: string;
    [key: string]: any;
}

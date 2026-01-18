import { supabase } from '../lib/supabase';
import type { UserData, Product } from './types';

// Re-export UserData for backward compatibility if needed, or update imports elsewhere
export type { UserData };

export const uploadProductImage = async (file: File): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (err) {
        console.error('Unexpected error uploading image:', err);
        return null;
    }
};

export const createProduct = async (product: Product): Promise<string | null> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();

        if (error) {
            console.error('Error creating product:', error);
            return null;
        }
        return data.id;
    } catch (err) {
        console.error('Unexpected error creating product:', err);
        return null;
    }
};

export const fetchUser = async (clerkId: string): Promise<UserData | null> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', clerkId)
            .single();

        if (error) {
            console.error('Error fetching user:', error.message);
            return null;
        }
        return data;
    } catch (err) {
        console.error('Unexpected error fetching user:', err);
        return null;
    }
};

export const updateUser = async (data: UserData): Promise<void> => {
    try {
        const { error } = await supabase
            .from('users')
            .upsert({
                clerk_id: data.clerk_id,
                role: data.role,
                full_name: data.full_name,
                address: data.address,
                phone: data.phone
            }, { onConflict: 'clerk_id' });

        if (error) {
            throw new Error(error.message);
        }
        console.log("User updated in Supabase:", data);
    } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
    }
};

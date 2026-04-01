import { supabase } from './client';
import type { LostItem } from '../../types';

const STORAGE_BUCKET = 'found_assets';

/**
 * Upload image file to Supabase Storage
 * @param file - Image file to upload
 * @returns Public URL of uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);

    return publicUrl;
}

/**
 * Delete image from Supabase Storage
 * @param imageUrl - Full public URL of the image
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    if (!supabase || !imageUrl) return;

    try {
        // Extract file path from URL
        // URL format: https://{project}.supabase.co/storage/v1/object/public/found_assets/{filename}
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        if (fileName) {
            await supabase.storage
                .from(STORAGE_BUCKET)
                .remove([fileName]);
        }
    } catch (error) {
        console.error('Failed to delete image:', error);
        // Don't throw - allow DB deletion to proceed even if storage cleanup fails
    }
}

/**
 * Create a new lost item post
 */
export async function createPost(
    data: Omit<LostItem, 'id' | 'foundAt' | 'isClaimed'>,
    file?: File
): Promise<void> {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }

    let imageUrl = data.imageUrl;

    // Upload image if file provided
    if (file) {
        imageUrl = await uploadImage(file);
    }

    const { error } = await supabase
        .from('lost_items')
        .insert({
            name: data.name,
            description: data.description,
            location: data.location,
            image_url: imageUrl,
            contact_info: data.contactInfo,
            found_at: new Date().toISOString(),
            is_claimed: false
        });

    if (error) {
        // If insert fails and we uploaded an image, try to clean it up
        if (file && imageUrl) {
            await deleteImage(imageUrl);
        }
        throw new Error(`Failed to create post: ${error.message}`);
    }
}

/**
 * Update an existing post
 */
export async function updatePost(
    id: string,
    data: Partial<Omit<LostItem, 'id' | 'foundAt'>>,
    newFile?: File
): Promise<void> {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }

    let imageUrl = data.imageUrl;
    let oldImageUrl: string | undefined;

    // If updating with new file, upload it first
    if (newFile) {
        // Get old image URL to delete after successful update
        const { data: existingPost } = await supabase
            .from('lost_items')
            .select('image_url')
            .eq('id', id)
            .single();

        oldImageUrl = existingPost?.image_url;
        imageUrl = await uploadImage(newFile);
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.contactInfo !== undefined) updateData.contact_info = data.contactInfo;
    if (data.isClaimed !== undefined) updateData.is_claimed = data.isClaimed;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

    const { error } = await supabase
        .from('lost_items')
        .update(updateData)
        .eq('id', id);

    if (error) {
        // If update fails and we uploaded a new image, clean it up
        if (newFile && imageUrl) {
            await deleteImage(imageUrl);
        }
        throw new Error(`Failed to update post: ${error.message}`);
    }

    // Delete old image if we uploaded a new one
    if (newFile && oldImageUrl) {
        await deleteImage(oldImageUrl);
    }
}

/**
 * Delete a post and its associated image
 */
export async function deletePost(id: string): Promise<void> {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }

    // Get image URL before deleting
    const { data: post } = await supabase
        .from('lost_items')
        .select('image_url')
        .eq('id', id)
        .single();

    const { error } = await supabase
        .from('lost_items')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete post: ${error.message}`);
    }

    // Clean up storage
    if (post?.image_url) {
        await deleteImage(post.image_url);
    }
}

/**
 * Toggle claimed status
 */
export async function toggleClaimed(id: string, isClaimed: boolean): Promise<void> {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }

    const { error } = await supabase
        .from('lost_items')
        .update({ is_claimed: isClaimed })
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to toggle claimed status: ${error.message}`);
    }
}

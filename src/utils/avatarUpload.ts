// utils/avatarUpload.ts
import { supabase } from '../lib/supabase';

export interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

// Upload avatar to Supabase Storage
export const uploadAvatar = async (file: File, userId: string): Promise<UploadResult> => {
    try {
        // Validate file
        const validationResult = validateAvatarFile(file);
        if (!validationResult.valid) {
            return { success: false, error: validationResult.error };
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('user-content')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error('Error uploading avatar:', uploadError);
            return { success: false, error: uploadError.message };
        }

        // Get public URL
        const { data } = supabase.storage
            .from('user-content')
            .getPublicUrl(filePath);

        return { success: true, url: data.publicUrl };
    } catch (error) {
        console.error('Error uploading avatar:', error);
        return { success: false, error: 'Failed to upload avatar' };
    }
};

// Validate avatar file
export const validateAvatarFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)'
        };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size must be less than 5MB'
        };
    }

    // Check image dimensions (optional - requires loading the image)
    return { valid: true };
};

// Delete old avatar from storage
export const deleteAvatar = async (avatarUrl: string): Promise<boolean> => {
    try {
        // Extract file path from URL
        const url = new URL(avatarUrl);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(-2).join('/'); // Get 'avatars/filename.ext'

        const { error } = await supabase.storage
            .from('user-content')
            .remove([filePath]);

        if (error) {
            console.error('Error deleting avatar:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting avatar:', error);
        return false;
    }
};

// Resize image before upload (optional utility)
export const resizeImage = (file: File, maxWidth: number = 400, maxHeight: number = 400, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and resize image
            ctx?.drawImage(img, 0, 0, width, height);

            // Convert canvas to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(resizedFile);
                    } else {
                        reject(new Error('Failed to resize image'));
                    }
                },
                file.type,
                quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
};

// Create avatar preview URL
export const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
};

// Cleanup preview URL to prevent memory leaks
export const cleanupPreviewUrl = (url: string): void => {
    URL.revokeObjectURL(url);
};
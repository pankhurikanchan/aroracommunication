import { createClient, SupabaseClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { config } from '../config';

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = config.supabase.url;
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey;

  if (url && key && url.startsWith('http')) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export const SupabaseStorageService = {
  isConfigured(): boolean {
    const url = config.supabase.url;
    const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
    return Boolean(url && key && url.startsWith('http'));
  },

  getBucketName(): string {
    return config.supabase.storageBucket || 'product-images';
  },

  /**
   * Uploads an image buffer directly to Supabase Storage bucket 'product-images'
   */
  async uploadImage(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder = 'products'
  ): Promise<{ success: boolean; url: string; path: string; error?: string }> {
    const client = getSupabaseClient();
    const bucket = this.getBucketName();

    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const cleanBaseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const uniqueName = `${cleanBaseName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    const storagePath = folder ? `${folder}/${uniqueName}` : uniqueName;

    // 1. If Supabase is configured, upload to Supabase Storage
    if (client) {
      try {
        const { error: uploadError } = await client.storage
          .from(bucket)
          .upload(storagePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError);
          return { success: false, url: '', path: '', error: uploadError.message };
        }

        const { data: publicUrlData } = client.storage
          .from(bucket)
          .getPublicUrl(storagePath);

        return {
          success: true,
          url: publicUrlData.publicUrl,
          path: storagePath,
        };
      } catch (err: any) {
        console.error('Error uploading to Supabase:', err);
        return { success: false, url: '', path: '', error: err.message };
      }
    }

    // 2. Fallback for local development when Supabase is not yet configured
    try {
      const localUploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(localUploadDir)) {
        fs.mkdirSync(localUploadDir, { recursive: true });
      }
      const localFilePath = path.join(localUploadDir, uniqueName);
      fs.writeFileSync(localFilePath, buffer);

      return {
        success: true,
        url: `/uploads/${uniqueName}`,
        path: uniqueName,
      };
    } catch (localErr: any) {
      return {
        success: false,
        url: '',
        path: '',
        error: 'Supabase storage is not configured and local fallback failed: ' + localErr.message,
      };
    }
  },

  /**
   * Deletes an image from Supabase Storage bucket
   */
  async deleteImage(pathOrUrl: string): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient();
    const bucket = this.getBucketName();

    if (!pathOrUrl) {
      return { success: false, error: 'File path or URL is required' };
    }

    // Extract relative storage path if full public URL was provided
    let storagePath = pathOrUrl;
    if (pathOrUrl.includes(`/storage/v1/object/public/${bucket}/`)) {
      storagePath = pathOrUrl.split(`/storage/v1/object/public/${bucket}/`)[1];
    } else if (pathOrUrl.startsWith('/uploads/')) {
      // Local fallback removal
      try {
        const localFile = path.join(process.cwd(), pathOrUrl);
        if (fs.existsSync(localFile)) {
          fs.unlinkSync(localFile);
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    if (client) {
      try {
        const { error } = await client.storage.from(bucket).remove([storagePath]);
        if (error) {
          console.error('Supabase storage delete error:', error);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: true };
  },

  /**
   * Replaces an existing image by uploading new one and removing the previous one
   */
  async replaceImage(
    oldPathOrUrl: string,
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder = 'products'
  ): Promise<{ success: boolean; url: string; path: string; error?: string }> {
    const uploadResult = await this.uploadImage(buffer, originalName, mimeType, folder);
    if (!uploadResult.success) {
      return uploadResult;
    }

    if (oldPathOrUrl) {
      // Safely delete old image in background
      this.deleteImage(oldPathOrUrl).catch((err) => {
        console.warn('Could not delete old image:', err);
      });
    }

    return uploadResult;
  },
};

export default SupabaseStorageService;

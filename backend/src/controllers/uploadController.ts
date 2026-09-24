import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { SupabaseStorageService } from '../services/supabaseStorage';
import prisma from '../utils/prisma';

// Use memory storage for serverless compatibility (direct upload to Supabase bucket)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpg, jpeg, png, webp, svg) are allowed!'));
  },
});

/**
 * Upload an image to Supabase Storage bucket 'product-images'
 */
export async function uploadImage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const folder = (req.body.folder as string) || 'products';
    const result = await SupabaseStorageService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    if (!result.success) {
      res.status(500).json({ success: false, message: result.error || 'Failed to upload image' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.url,
      path: result.path,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error uploading file' });
  }
}

/**
 * Replace an existing uploaded image
 */
export async function replaceImage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded for replacement' });
      return;
    }

    const oldUrl = (req.body.oldUrl as string) || '';
    const folder = (req.body.folder as string) || 'products';

    const result = await SupabaseStorageService.replaceImage(
      oldUrl,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    if (!result.success) {
      res.status(500).json({ success: false, message: result.error || 'Failed to replace image' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Image replaced successfully',
      url: result.url,
      path: result.path,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error replacing file' });
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(req: Request, res: Response): Promise<void> {
  try {
    const { url, path: filePath, imageId } = req.body;
    const target = url || filePath;

    if (!target && !imageId) {
      res.status(400).json({ success: false, message: 'Image URL, path or ID is required' });
      return;
    }

    // If an imageId is provided, also delete record from database
    if (imageId) {
      const dbImage = await prisma.productImage.findUnique({ where: { id: String(imageId) } });
      if (dbImage) {
        await SupabaseStorageService.deleteImage(dbImage.url);
        await prisma.productImage.delete({ where: { id: String(imageId) } });
        res.status(200).json({ success: true, message: 'Product image deleted from storage and database' });
        return;
      }
    }

    const result = await SupabaseStorageService.deleteImage(target);
    if (!result.success) {
      res.status(500).json({ success: false, message: result.error || 'Failed to delete image' });
      return;
    }

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting file' });
  }
}

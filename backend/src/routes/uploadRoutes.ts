import { Router } from 'express';
import { upload, uploadImage, replaceImage, deleteImage } from '../controllers/uploadController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Supabase Storage endpoints for Admin
router.post('/', authenticateToken, requireAdmin, upload.single('image'), uploadImage);
router.put('/replace', authenticateToken, requireAdmin, upload.single('image'), replaceImage);
router.delete('/', authenticateToken, requireAdmin, deleteImage);

export default router;

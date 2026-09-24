import { Router } from 'express';
import {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductFilterMeta,
  addProductImage,
  deleteProductImage,
  setPrimaryProductImage,
} from '../controllers/productController';
import { getProductReviews, addReview } from '../controllers/reviewController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public Product Endpoints
router.get('/', getProducts);
router.get('/meta/filters', getProductFilterMeta);
router.get('/:identifier', getProductBySlugOrId);

// Product Reviews
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', authenticateToken, addReview);

// Admin-only Product CRUD
router.post('/', authenticateToken, requireAdmin, createProduct);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

// Admin-only Image Association & Management (Supabase Storage)
router.post('/:id/images', authenticateToken, requireAdmin, addProductImage);
router.delete('/:productId/images/:imageId', authenticateToken, requireAdmin, deleteProductImage);
router.put('/:productId/images/:imageId/primary', authenticateToken, requireAdmin, setPrimaryProductImage);

export default router;

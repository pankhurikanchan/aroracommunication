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
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public Product Endpoints
router.get('/', asyncHandler(getProducts));
router.get('/meta/filters', asyncHandler(getProductFilterMeta));
router.get('/:identifier', asyncHandler(getProductBySlugOrId));

// Product Reviews
router.get('/:productId/reviews', asyncHandler(getProductReviews));
router.post('/:productId/reviews', authenticateToken, asyncHandler(addReview));

// Admin-only Product CRUD
router.post('/', authenticateToken, requireAdmin, asyncHandler(createProduct));
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(updateProduct));
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(deleteProduct));

// Admin-only Image Association & Management (Supabase Storage)
router.post('/:id/images', authenticateToken, requireAdmin, asyncHandler(addProductImage));
router.delete('/:productId/images/:imageId', authenticateToken, requireAdmin, asyncHandler(deleteProductImage));
router.put('/:productId/images/:imageId/primary', authenticateToken, requireAdmin, asyncHandler(setPrimaryProductImage));

export default router;

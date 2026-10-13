import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getCategories));
router.post('/', authenticateToken, requireAdmin, asyncHandler(createCategory));
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(updateCategory));
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(deleteCategory));

export default router;

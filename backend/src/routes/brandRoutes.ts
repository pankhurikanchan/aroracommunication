import { Router } from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getBrands));
router.post('/', authenticateToken, requireAdmin, asyncHandler(createBrand));
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(updateBrand));
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(deleteBrand));

export default router;

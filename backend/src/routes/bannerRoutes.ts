import { Router } from 'express';
import {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getBanners));
router.get('/all', authenticateToken, requireAdmin, asyncHandler(getAllBanners));
router.post('/', authenticateToken, requireAdmin, asyncHandler(createBanner));
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(updateBanner));
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(deleteBanner));

export default router;

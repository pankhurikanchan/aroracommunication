import { Router } from 'express';
import {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getBanners);
router.get('/all', authenticateToken, requireAdmin, getAllBanners);
router.post('/', authenticateToken, requireAdmin, createBanner);
router.put('/:id', authenticateToken, requireAdmin, updateBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteBanner);

export default router;

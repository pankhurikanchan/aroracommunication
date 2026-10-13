import { Router } from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
} from '../controllers/couponController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/validate', asyncHandler(validateCoupon));
router.get('/', authenticateToken, requireAdmin, asyncHandler(getCoupons));
router.post('/', authenticateToken, requireAdmin, asyncHandler(createCoupon));
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(deleteCoupon));

export default router;

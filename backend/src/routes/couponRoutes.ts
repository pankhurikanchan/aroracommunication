import { Router } from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
} from '../controllers/couponController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/validate', validateCoupon);
router.get('/', authenticateToken, requireAdmin, getCoupons);
router.post('/', authenticateToken, requireAdmin, createCoupon);
router.delete('/:id', authenticateToken, requireAdmin, deleteCoupon);

export default router;

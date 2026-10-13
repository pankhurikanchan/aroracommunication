import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Order creation & lookup
router.post('/', optionalAuth, asyncHandler(createOrder));
router.get('/', authenticateToken, asyncHandler(getUserOrders));
router.get('/admin', authenticateToken, requireAdmin, asyncHandler(getAdminOrders));
router.put('/admin/:id/status', authenticateToken, requireAdmin, asyncHandler(updateOrderStatus));
router.put('/:id/status', authenticateToken, requireAdmin, asyncHandler(updateOrderStatus));
router.get('/:id', optionalAuth, asyncHandler(getOrderById));

export default router;

import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

// Order creation & lookup
router.post('/', optionalAuth, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/admin', authenticateToken, requireAdmin, getAdminOrders);
router.put('/admin/:id/status', authenticateToken, requireAdmin, updateOrderStatus);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);
router.get('/:id', optionalAuth, getOrderById);

export default router;

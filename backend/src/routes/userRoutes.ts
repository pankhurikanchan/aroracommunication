import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addAddress,
  deleteAddress,
  getAdminUsers,
} from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/profile', authenticateToken, asyncHandler(getUserProfile));
router.put('/profile', authenticateToken, asyncHandler(updateUserProfile));
router.get('/addresses', authenticateToken, asyncHandler(getUserAddresses));
router.post('/addresses', authenticateToken, asyncHandler(addAddress));
router.delete('/addresses/:id', authenticateToken, asyncHandler(deleteAddress));

// Admin-only user list
router.get('/admin/all', authenticateToken, requireAdmin, asyncHandler(getAdminUsers));

export default router;

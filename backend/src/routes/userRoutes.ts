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

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.get('/addresses', authenticateToken, getUserAddresses);
router.post('/addresses', authenticateToken, addAddress);
router.delete('/addresses/:id', authenticateToken, deleteAddress);

// Admin-only user list
router.get('/admin/all', authenticateToken, requireAdmin, getAdminUsers);

export default router;

import { Router } from 'express';
import { getAdminDashboardStats } from '../controllers/adminStatsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, asyncHandler(getAdminDashboardStats));

export default router;

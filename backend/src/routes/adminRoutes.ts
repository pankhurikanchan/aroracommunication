import { Router } from 'express';
import { getAdminDashboardStats } from '../controllers/adminStatsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, getAdminDashboardStats);

export default router;

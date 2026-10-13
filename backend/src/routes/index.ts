import { Router } from 'express';
import v1Router from './v1';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import brandRoutes from './brandRoutes';
import cartRoutes from './cartRoutes';
import wishlistRoutes from './wishlistRoutes';
import orderRoutes from './orderRoutes';
import userRoutes from './userRoutes';
import couponRoutes from './couponRoutes';
import reviewRoutes from './reviewRoutes';
import bannerRoutes from './bannerRoutes';
import paymentRoutes from './paymentRoutes';
import adminRoutes from './adminRoutes';
import uploadRoutes from './uploadRoutes';
import contactRoutes from './contactRoutes';
import prisma from '../utils/prisma';
import { authLimiter, orderLimiter, contactLimiter } from '../middleware/rateLimiter';

const router = Router();

// 1. Mount API Version 1
router.use('/v1', v1Router);

// 2. Backwards-Compatibility Mounts (preserves existing web & mobile app contracts)
router.use('/auth', authLimiter, authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderLimiter, orderRoutes);
router.use('/users', userRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/banners', bannerRoutes);
router.use('/payments', orderLimiter, paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactLimiter, contactRoutes);

// Comprehensive Liveness & Readiness Health Probe (Root /api/health)
router.get('/health', async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (error: any) {
    dbStatus = 'unhealthy';
  }

  const isHealthy = dbStatus === 'healthy';
  const status = isHealthy ? 200 : 503;

  res.status(status).json({
    status: isHealthy ? 'healthy' : 'degraded',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    services: {
      api: 'healthy',
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
    },
    responseTimeMs: Date.now() - startTime,
  });
});

export default router;

import { Router } from 'express';
import authRoutes from '../authRoutes';
import productRoutes from '../productRoutes';
import categoryRoutes from '../categoryRoutes';
import brandRoutes from '../brandRoutes';
import cartRoutes from '../cartRoutes';
import wishlistRoutes from '../wishlistRoutes';
import orderRoutes from '../orderRoutes';
import userRoutes from '../userRoutes';
import couponRoutes from '../couponRoutes';
import reviewRoutes from '../reviewRoutes';
import bannerRoutes from '../bannerRoutes';
import paymentRoutes from '../paymentRoutes';
import adminRoutes from '../adminRoutes';
import uploadRoutes from '../uploadRoutes';
import contactRoutes from '../contactRoutes';
import prisma from '../../utils/prisma';
import { authLimiter, orderLimiter, contactLimiter } from '../../middleware/rateLimiter';

const v1Router = Router();

// Routes with specific rate limiters applied
v1Router.use('/auth', authLimiter, authRoutes);
v1Router.use('/products', productRoutes);
v1Router.use('/categories', categoryRoutes);
v1Router.use('/brands', brandRoutes);
v1Router.use('/cart', cartRoutes);
v1Router.use('/wishlist', wishlistRoutes);
v1Router.use('/orders', orderLimiter, orderRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/coupons', couponRoutes);
v1Router.use('/reviews', reviewRoutes);
v1Router.use('/banners', bannerRoutes);
v1Router.use('/payments', orderLimiter, paymentRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/upload', uploadRoutes);
v1Router.use('/contact', contactLimiter, contactRoutes);

// Comprehensive Liveness & Readiness Health Probe
v1Router.get('/health', async (req, res) => {
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
    apiVersion: 'v1',
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

export default v1Router;

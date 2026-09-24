import { Router } from 'express';
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

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/banners', bannerRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    shop: 'Arora Communication',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;

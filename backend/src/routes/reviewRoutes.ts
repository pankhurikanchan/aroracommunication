import { Router } from 'express';
import { getProductReviews, addReview, getAllReviews } from '../controllers/reviewController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authenticateToken, addReview);
router.get('/admin/all', authenticateToken, requireAdmin, getAllReviews);

export default router;

import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticateToken, asyncHandler(getWishlist));
router.post('/', authenticateToken, asyncHandler(addToWishlist));
router.delete('/:id', authenticateToken, asyncHandler(removeFromWishlist));
router.post('/toggle', authenticateToken, asyncHandler(toggleWishlist));

export default router;

import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getWishlist);
router.post('/', authenticateToken, addToWishlist);
router.delete('/:id', authenticateToken, removeFromWishlist);
router.post('/toggle', authenticateToken, toggleWishlist);

export default router;

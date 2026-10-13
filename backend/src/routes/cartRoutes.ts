import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController';
import { optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', optionalAuth, asyncHandler(getCart));
router.post('/', optionalAuth, asyncHandler(addToCart));
router.put('/:id', optionalAuth, asyncHandler(updateCartItem));
router.delete('/:id', optionalAuth, asyncHandler(removeCartItem));
router.delete('/', optionalAuth, asyncHandler(clearCart));

export default router;

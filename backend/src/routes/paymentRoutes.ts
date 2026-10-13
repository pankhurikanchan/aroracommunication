import { Router } from 'express';
import { createPaymentOrder, verifyPayment, verifyAndCreateOrder } from '../controllers/paymentController';
import { optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/create-order', asyncHandler(createPaymentOrder));
router.post('/verify', asyncHandler(verifyPayment));
router.post('/verify-and-create-order', optionalAuth, asyncHandler(verifyAndCreateOrder));

export default router;

import { Router } from 'express';
import { createPaymentOrder, verifyPayment, verifyAndCreateOrder } from '../controllers/paymentController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.post('/verify-and-create-order', optionalAuth, verifyAndCreateOrder);

export default router;

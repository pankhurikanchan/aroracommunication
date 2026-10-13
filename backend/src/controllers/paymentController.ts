import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PaymentService } from '../services/paymentService';
import { sendSuccess } from '../core/responses/apiResponse';

export async function createPaymentOrder(req: Request, res: Response): Promise<void> {
  const { amount, currency = 'INR', receipt } = req.body;
  const paymentOrder = await PaymentService.createPaymentOrder(amount, currency, receipt);
  sendSuccess(res, paymentOrder, 'Payment order created successfully');
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const isValid = PaymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  sendSuccess(
    res,
    { verified: isValid },
    isValid ? 'Payment verified successfully' : 'Payment verification failed',
    isValid ? 200 : 400
  );
}

export async function verifyAndCreateOrder(req: AuthRequest, res: Response): Promise<void> {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    shippingAddress,
    addressId,
    couponCode,
    notes,
  } = req.body;

  const order = await PaymentService.verifyAndCreateOrder({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    shippingAddress,
    addressId,
    userId: req.user?.userId || null,
    couponCode,
    notes,
  });

  sendSuccess(res, order, 'Payment verified and order confirmed successfully', 201);
}

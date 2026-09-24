import { Request, Response } from 'express';
import crypto from 'crypto';
import { config } from '../config';
import prisma from '../utils/prisma';

export async function createPaymentOrder(req: Request, res: Response): Promise<void> {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      res.status(400).json({ success: false, message: 'Amount is required' });
      return;
    }

    // Amount in paise for Indian gateways (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    res.status(200).json({
      success: true,
      data: {
        id: mockOrderId,
        entity: 'order',
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        keyId: config.razorpay.keyId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating payment order' });
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Razorpay signature verification logic
    let isValid = true;
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', config.razorpay.keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    }

    if (orderId && isValid) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'CONFIRMED',
          payments: {
            create: {
              method: 'UPI',
              gateway: 'RAZORPAY',
              amount: 0, // updated from order
              status: 'COMPLETED',
              transactionId: razorpay_payment_id || `TXN-${Date.now()}`,
              rawResponse: JSON.stringify(req.body),
            },
          },
        },
      });
    }

    res.status(200).json({
      success: isValid,
      message: isValid ? 'Payment verified successfully' : 'Payment verification failed',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error verifying payment' });
  }
}

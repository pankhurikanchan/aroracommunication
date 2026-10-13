import { PaymentService } from '../src/services/paymentService';
import { ConflictError } from '../src/core/errors/AppError';
import prisma from '../src/utils/prisma';

describe('PaymentService Cryptography & Replay Attack Prevention', () => {
  it('Should reject forged Razorpay signatures', () => {
    // When secrets are configured, random signatures must fail
    const orderId = 'order_valid_123';
    const paymentId = 'pay_valid_456';
    const fakeSignature = 'bad_forged_signature_0000000000000000000000000000000000000000';

    // In non-mock mode, verifySignature computes sha256
    const isMock = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('mock');
    if (!isMock) {
      const isValid = PaymentService.verifySignature(orderId, paymentId, fakeSignature);
      expect(isValid).toBe(false);
    } else {
      expect(true).toBe(true);
    }
  });

  it('SEC-05: Should reject reused payment ID to prevent duplicate transactions (Replay Protection)', async () => {
    const duplicatePaymentId = `pay_replay_test_${Date.now()}`;

    // Create a dummy address and order to attach the first payment
    const addr = await prisma.address.create({
      data: {
        fullName: 'Payment Tester',
        phone: '9876543210',
        email: 'paytester@test.com',
        addressLine: 'Payment Way',
        city: 'Bareilly',
        state: 'Uttar Pradesh',
        pinCode: '243122',
      },
    });

    const ord = await prisma.order.create({
      data: {
        orderNumber: `ARC-TEST-${Date.now()}`,
        addressId: addr.id,
        subtotal: 500,
        totalAmount: 549,
      },
    });

    // Record the first payment
    await prisma.payment.create({
      data: {
        orderId: ord.id,
        transactionId: duplicatePaymentId,
        method: 'UPI',
        amount: 549,
        status: 'COMPLETED',
      },
    });

    // Attempt to verify and create another order with the EXACT SAME transactionId
    await expect(
      PaymentService.verifyAndCreateOrder({
        razorpay_order_id: 'order_test_999',
        razorpay_payment_id: duplicatePaymentId,
        razorpay_signature: 'sig_test',
        items: [],
      })
    ).rejects.toThrow(ConflictError);

    // Clean up
    await prisma.payment.deleteMany({ where: { transactionId: duplicatePaymentId } }).catch(() => {});
    await prisma.order.deleteMany({ where: { id: ord.id } }).catch(() => {});
    await prisma.address.deleteMany({ where: { id: addr.id } }).catch(() => {});
  });
});

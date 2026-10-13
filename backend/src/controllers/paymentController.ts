import { Request, Response } from 'express';
import crypto from 'crypto';
import { config } from '../config';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { sendOrderConfirmationEmail } from '../services/emailService';

export async function createPaymentOrder(req: Request, res: Response): Promise<void> {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      res.status(400).json({ success: false, message: 'Amount is required' });
      return;
    }

    // Amount in paise for Indian gateways (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    let orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const isRealRazorpay =
      config.razorpay.keyId &&
      !config.razorpay.keyId.includes('mock') &&
      config.razorpay.keySecret &&
      !config.razorpay.keySecret.includes('mock');

    if (isRealRazorpay) {
      const basicAuth = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
        }),
      });

      if (rzpRes.ok) {
        const rzpData: any = await rzpRes.json();
        orderId = rzpData.id;
      } else {
        const errJson: any = await rzpRes.json().catch(() => ({}));
        console.error('Razorpay API creation error:', errJson);
        res.status(rzpRes.status).json({
          success: false,
          message: errJson.error?.description || 'Failed to create Razorpay order',
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        id: orderId,
        entity: 'order',
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        keyId: config.razorpay.keyId,
        isLive: isRealRazorpay,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating payment order' });
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    let isValid = false;
    const isMock = config.razorpay.keyId?.includes('mock') || !config.razorpay.keySecret;
    if (isMock) {
      isValid = true;
    } else if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
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
              amount: 0,
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

export async function verifyAndCreateOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      addressId: existingAddressId,
      couponCode,
      notes,
    } = req.body;

    if (!razorpay_payment_id) {
      res.status(400).json({ success: false, message: 'Razorpay payment ID is required' });
      return;
    }

    // Cryptographic signature verification
    let isValid = false;
    const isMock = config.razorpay.keyId?.includes('mock') || !config.razorpay.keySecret;
    if (isMock) {
      isValid = true;
    } else if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', config.razorpay.keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    }

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
      return;
    }

    const userId = req.user?.userId || null;
    let addressId = existingAddressId;

    if (!addressId && shippingAddress) {
      const newAddress = await prisma.address.create({
        data: {
          userId,
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          email: shippingAddress.email,
          addressLine: shippingAddress.addressLine,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pinCode: shippingAddress.pinCode,
        },
      });
      addressId = newAddress.id;
    }

    if (!addressId) {
      res.status(400).json({ success: false, message: 'Valid shipping address is required' });
      return;
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Apply Coupon if valid
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && new Date() <= coupon.endDate && subtotal >= coupon.minSpend) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.value;
        }

        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: coupon.usageCount + 1 },
        });
      }
    }

    const deliveryCharge = subtotal > 1000 ? 0 : 49;
    const totalAmount = Math.max(0, subtotal - discount + deliveryCharge);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ARC-${new Date().getFullYear()}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        status: 'CONFIRMED',
        paymentMethod: 'UPI',
        paymentStatus: 'COMPLETED',
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        couponCode: couponCode || null,
        notes: `Paid via Razorpay Gateway. Payment ID: ${razorpay_payment_id} | Order ID: ${razorpay_order_id || 'N/A'}${notes ? ' | ' + notes : ''}`,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
            productName: item.productName,
            productImage: item.productImage || null,
          })),
        },
        payments: {
          create: {
            method: 'UPI',
            gateway: 'RAZORPAY',
            amount: totalAmount,
            status: 'COMPLETED',
            transactionId: razorpay_payment_id,
            rawResponse: JSON.stringify({ razorpay_payment_id, razorpay_order_id }),
          },
        },
      },
      include: {
        items: true,
        address: true,
        payments: true,
      },
    });

    // Reduce stock quantities
    for (const item of items) {
      try {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      } catch (e) {
        // continue
      }
    }

    // Send Order Confirmation Email asynchronously
    if (order.address?.email) {
      sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerEmail: order.address.email,
        customerName: order.address.fullName || 'Customer',
        totalAmount: order.totalAmount,
        paymentMethod: 'UPI',
        items: order.items.map((it) => ({
          productName: it.productName,
          quantity: it.quantity,
          price: it.price,
        })),
        shippingAddress: {
          addressLine: order.address.addressLine,
          city: order.address.city,
          state: order.address.state,
          pinCode: order.address.pinCode,
        },
      }).catch((err) => console.error('[PaymentController] Email dispatch failed:', err?.message));
    }

    res.status(201).json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error processing payment and creating order' });
  }
}

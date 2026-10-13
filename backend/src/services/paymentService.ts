import crypto from 'crypto';
import prisma from '../utils/prisma';
import { config } from '../config';
import { BadRequestError, ConflictError, NotFoundError } from '../core/errors/AppError';
import { sendOrderConfirmationEmail } from './emailService';

export class PaymentService {
  /**
   * Initialize Gateway Payment Order
   */
  static async createPaymentOrder(amount: number, currency: string = 'INR', receipt?: string) {
    if (!amount || amount <= 0) {
      throw new BadRequestError('A valid payment amount is required');
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    let orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const isRealRazorpay =
      Boolean(config.razorpay.keyId) &&
      !config.razorpay.keyId.includes('mock') &&
      Boolean(config.razorpay.keySecret) &&
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
        throw new BadRequestError(errJson.error?.description || 'Failed to initialize Razorpay order');
      }
    }

    return {
      id: orderId,
      entity: 'order',
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      keyId: config.razorpay.keyId,
      isLive: isRealRazorpay,
    };
  }

  /**
   * Cryptographic Signature Verification
   */
  static verifySignature(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean {
    const isMock = config.razorpay.keyId?.includes('mock') || !config.razorpay.keySecret;
    if (isMock) {
      return true;
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return false;
    }

    const generatedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  }

  /**
   * Atomic Payment Verification and Order Creation with Replay-Attack Protection
   */
  static async verifyAndCreateOrder(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    items: any[];
    shippingAddress?: any;
    addressId?: string;
    userId?: string | null;
    couponCode?: string | null;
    notes?: string | null;
  }) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      addressId: existingAddressId,
      userId,
      couponCode,
      notes,
    } = payload;

    if (!razorpay_payment_id) {
      throw new BadRequestError('Razorpay Payment ID is required');
    }

    // 1. REPLAY-ATTACK PREVENTION: Check if payment ID has already been recorded
    const existingPayment = await prisma.payment.findFirst({
      where: { transactionId: razorpay_payment_id },
    });
    if (existingPayment) {
      throw new ConflictError('This payment transaction has already been processed and credited to an order.');
    }

    // 2. Cryptographic signature check
    const isValid = this.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      throw new BadRequestError('Invalid cryptographic payment signature. Verification failed.');
    }

    // 3. Resolve shipping address
    let addressId = existingAddressId;
    if (!addressId && shippingAddress) {
      const newAddress = await prisma.address.create({
        data: {
          userId: userId || null,
          fullName: shippingAddress.fullName.trim(),
          phone: shippingAddress.phone.trim(),
          email: shippingAddress.email.trim().toLowerCase(),
          addressLine: shippingAddress.addressLine.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          pinCode: shippingAddress.pinCode.trim(),
        },
      });
      addressId = newAddress.id;
    }

    if (!addressId) {
      throw new BadRequestError('Valid shipping address is required');
    }

    // 4. Authoritative Server-Side Product Pricing
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let authoritativeSubtotal = 0;
    const validatedOrderItems: any[] = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        throw new NotFoundError(`Product not found with ID: ${item.productId}`);
      }

      let unitPrice = dbProduct.discountPrice || dbProduct.price;
      let variantName = '';

      if (item.variantId) {
        const variant = dbProduct.variants.find((v) => v.id === item.variantId);
        if (variant) {
          unitPrice = variant.discountPrice || variant.price;
          const parts: string[] = [];
          if (variant.ram) parts.push(variant.ram);
          if (variant.storage) parts.push(variant.storage);
          if (variant.color) parts.push(variant.color);
          if (parts.length > 0) variantName = ` (${parts.join(', ')})`;
        }
      }

      authoritativeSubtotal += unitPrice * item.quantity;
      validatedOrderItems.push({
        productId: dbProduct.id,
        variantId: item.variantId || null,
        productName: `${dbProduct.name}${variantName}`,
        productImage: item.productImage || null,
        quantity: item.quantity,
        price: unitPrice,
      });
    }

    // 5. Coupon calculation
    let discount = 0;
    let validCouponId: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive && new Date() <= coupon.endDate && authoritativeSubtotal >= coupon.minSpend) {
        validCouponId = coupon.id;
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (authoritativeSubtotal * coupon.value) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.value;
        }
      }
    }

    const deliveryCharge = authoritativeSubtotal > 1000 ? 0 : 49;
    const totalAmount = Math.max(0, authoritativeSubtotal - discount + deliveryCharge);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ARC-${new Date().getFullYear()}-${randomSuffix}`;

    // 6. ATOMIC TRANSACTION: Order + Stock Decrement + Payment Record + Cart Clearance
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          addressId: addressId!,
          status: 'CONFIRMED',
          paymentMethod: 'UPI',
          paymentStatus: 'COMPLETED',
          subtotal: authoritativeSubtotal,
          discount,
          deliveryCharge,
          totalAmount,
          couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
          notes: `Paid via Razorpay Gateway. Payment ID: ${razorpay_payment_id} | Order ID: ${razorpay_order_id || 'N/A'}${notes ? ' | ' + notes : ''}`,
          items: {
            create: validatedOrderItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              productImage: item.productImage,
              quantity: item.quantity,
              price: item.price,
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

      // Decrement stock
      for (const item of validatedOrderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { decrement: item.quantity } },
          }).catch(() => {});
        }
      }

      if (validCouponId) {
        await tx.coupon.update({
          where: { id: validCouponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      if (userId) {
        const userCart = await tx.cart.findUnique({ where: { userId } });
        if (userCart) {
          await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
        }
      }

      return createdOrder;
    });

    // 7. Send confirmation email asynchronously
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
      }).catch((err) => console.error('[PaymentService] Email dispatch failed:', err?.message));
    }

    return order;
  }
}

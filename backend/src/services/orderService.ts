import prisma from '../utils/prisma';
import { BadRequestError, NotFoundError, ForbiddenError } from '../core/errors/AppError';
import { sendOrderConfirmationEmail } from './emailService';

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
  price?: number;
  productName?: string;
  productImage?: string | null;
}

export interface CreateOrderInput {
  userId?: string | null;
  shippingAddress?: {
    fullName: string;
    phone: string;
    email: string;
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
  };
  addressId?: string;
  items: CreateOrderItemInput[];
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'CASH_ON_DELIVERY' | 'RAZORPAY';
  couponCode?: string | null;
  notes?: string | null;
  transactionId?: string | null;
}

export class OrderService {
  /**
   * Atomic Order Creation with Server-Side Price & Inventory Verification
   */
  static async createOrder(input: CreateOrderInput) {
    const { userId, items, paymentMethod, couponCode, notes, transactionId } = input;

    if (!items || items.length === 0) {
      throw new BadRequestError('Order must contain at least one item');
    }

    // 1. Resolve or Create Shipping Address
    let addressId = input.addressId;
    if (!addressId && input.shippingAddress) {
      const newAddress = await prisma.address.create({
        data: {
          userId: userId || null,
          fullName: input.shippingAddress.fullName.trim(),
          phone: input.shippingAddress.phone.trim(),
          email: input.shippingAddress.email.trim().toLowerCase(),
          addressLine: input.shippingAddress.addressLine.trim(),
          city: input.shippingAddress.city.trim(),
          state: input.shippingAddress.state.trim(),
          pinCode: input.shippingAddress.pinCode.trim(),
        },
      });
      addressId = newAddress.id;
    }

    if (!addressId) {
      throw new BadRequestError('Valid shipping address is required');
    }

    // 2. Fetch fresh catalog data from DB to verify stock and prevent price tampering
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        variants: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate inventory and calculate authoritative server-side pricing
    let authoritativeSubtotal = 0;
    const validatedOrderItems: {
      productId: string;
      variantId: string | null;
      productName: string;
      productImage: string | null;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        throw new NotFoundError(`Product not found with ID: ${item.productId}`);
      }

      // Check stock availability
      if (dbProduct.stockQuantity < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stockQuantity}, Requested: ${item.quantity}`
        );
      }

      // Determine authoritative price from database
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

          if (variant.stockQuantity < item.quantity) {
            throw new BadRequestError(
              `Insufficient stock for variant "${dbProduct.name}${variantName}". Available: ${variant.stockQuantity}`
            );
          }
        }
      }

      authoritativeSubtotal += unitPrice * item.quantity;

      validatedOrderItems.push({
        productId: dbProduct.id,
        variantId: item.variantId || null,
        productName: `${dbProduct.name}${variantName}`,
        productImage: item.productImage || dbProduct.images[0]?.url || null,
        quantity: item.quantity,
        price: unitPrice,
      });
    }

    // 3. Authoritative Coupon Verification & Discount Calculation
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
    const initialPaymentStatus = 'PENDING';
    const txnId = transactionId?.trim() || null;

    let finalNotes = notes?.trim() || '';
    if (txnId) {
      finalNotes = finalNotes ? `${finalNotes} | Customer UTR/Ref: ${txnId}` : `Customer UTR/Ref: ${txnId}`;
    }

    // 4. ATOMIC DATABASE TRANSACTION (Prisma.$transaction)
    const order = await prisma.$transaction(async (tx) => {
      // A. Create Order and OrderItems
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          addressId: addressId!,
          status: 'ORDER_PLACED',
          paymentMethod: paymentMethod === 'RAZORPAY' ? 'CREDIT_CARD' : paymentMethod,
          paymentStatus: initialPaymentStatus,
          subtotal: authoritativeSubtotal,
          discount,
          deliveryCharge,
          totalAmount,
          couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
          notes: finalNotes || null,
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
              method: paymentMethod === 'RAZORPAY' ? 'CREDIT_CARD' : paymentMethod,
              amount: totalAmount,
              status: initialPaymentStatus,
              transactionId: txnId,
            },
          },
        },
        include: {
          items: true,
          address: true,
          payments: true,
        },
      });

      // B. Atomically Decrement Product & Variant Stock
      for (const item of validatedOrderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          }).catch(() => {});
        }
      }

      // C. Increment coupon usage count if applied
      if (validCouponId) {
        await tx.coupon.update({
          where: { id: validCouponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      // D. Clear user's active cart if registered
      if (userId) {
        const userCart = await tx.cart.findUnique({ where: { userId } });
        if (userCart) {
          await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
        }
      }

      return createdOrder;
    });

    // 5. Asynchronous Confirmation Email Dispatch (Non-blocking)
    if (order.address?.email) {
      sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerEmail: order.address.email,
        customerName: order.address.fullName || 'Customer',
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
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
      }).catch((err) => console.error('[OrderService] Email dispatch failed:', err?.message));
    }

    return order;
  }

  /**
   * Secure Order Lookup by ID or OrderNumber with Ownership Protection
   */
  static async getOrderById(id: string, requesterUserId?: string, requesterRole?: string, guestVerifier?: { email?: string; phone?: string }) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: { include: { product: true } },
        address: true,
        payments: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Admin has universal read access
    if (requesterRole === 'ADMIN') {
      return order;
    }

    // Registered user order: must match requester userId
    if (order.userId) {
      if (!requesterUserId || order.userId !== requesterUserId) {
        throw new ForbiddenError('Unauthorized to view this order');
      }
      return order;
    }

    // Guest order: protect against IDOR.
    // If order has no registered userId, only allow if requester has matching email or phone
    if (guestVerifier && (guestVerifier.email || guestVerifier.phone)) {
      const emailMatches = guestVerifier.email && order.address?.email?.toLowerCase() === guestVerifier.email.toLowerCase();
      const phoneMatches = guestVerifier.phone && order.address?.phone?.replace(/\D/g, '') === guestVerifier.phone.replace(/\D/g, '');
      if (emailMatches || phoneMatches) {
        return order;
      }
    }

    // If viewed right after checkout by orderNumber reference
    if (order.orderNumber === id) {
      return order;
    }

    throw new ForbiddenError('Verification required to access guest order details');
  }

  /**
   * Retrieve Orders for User
   */
  static async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        address: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin Paginated Orders List with Filtering
   */
  static async getAdminOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    paymentStatus?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.paymentStatus) where.paymentStatus = params.paymentStatus;
    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { address: { fullName: { contains: q } } },
        { address: { phone: { contains: q } } },
        { address: { email: { contains: q } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: true,
          address: true,
          payments: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, orders, page, limit };
  }

  /**
   * Admin Status Update with Audit Tracking
   */
  static async updateOrderStatus(id: string, status: any, trackingNumber?: string, paymentStatus?: any) {
    const data: any = { status };
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    return prisma.order.update({
      where: { id },
      data,
      include: {
        items: true,
        address: true,
        payments: true,
      },
    });
  }
}

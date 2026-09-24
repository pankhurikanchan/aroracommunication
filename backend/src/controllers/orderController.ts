import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

const orderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    addressLine: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pinCode: z.string().min(6),
  }).optional(),
  addressId: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional().nullable(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      productName: z.string(),
      productImage: z.string().optional().nullable(),
    })
  ).min(1, 'Order must contain at least one item'),
  paymentMethod: z.enum(['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'CASH_ON_DELIVERY']),
  couponCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || null;
    const validated = orderSchema.parse(req.body);

    let addressId = validated.addressId;

    // Create address if inline provided
    if (!addressId && validated.shippingAddress) {
      const newAddress = await prisma.address.create({
        data: {
          userId,
          fullName: validated.shippingAddress.fullName,
          phone: validated.shippingAddress.phone,
          email: validated.shippingAddress.email,
          addressLine: validated.shippingAddress.addressLine,
          city: validated.shippingAddress.city,
          state: validated.shippingAddress.state,
          pinCode: validated.shippingAddress.pinCode,
        },
      });
      addressId = newAddress.id;
    }

    if (!addressId) {
      res.status(400).json({ success: false, message: 'Valid shipping address is required' });
      return;
    }

    // Calculate subtotal
    const subtotal = validated.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Apply Coupon if valid
    let discount = 0;
    if (validated.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: validated.couponCode.toUpperCase() },
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

        // Increase coupon usage
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

    const initialPaymentStatus = validated.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'COMPLETED';

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        status: 'ORDER_PLACED',
        paymentMethod: validated.paymentMethod,
        paymentStatus: initialPaymentStatus,
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        couponCode: validated.couponCode,
        notes: validated.notes,
        items: {
          create: validated.items.map((item) => ({
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
            method: validated.paymentMethod,
            amount: totalAmount,
            status: initialPaymentStatus,
            transactionId: validated.paymentMethod !== 'CASH_ON_DELIVERY' ? `TXN-${Date.now()}` : null,
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
    for (const item of validated.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      }).catch(() => {});
    }

    // Clear cart for this user/session if applicable
    if (userId) {
      const userCart = await prisma.cart.findUnique({ where: { userId } });
      if (userCart) {
        await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: error.errors[0].message });
      return;
    }
    res.status(500).json({ success: false, message: error.message || 'Error creating order' });
  }
}

export async function getUserOrders(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const orders = await prisma.order.findMany({
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

    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching orders' });
  }
}

export async function getOrderById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const userId = req.user?.userId;
    const role = req.user?.role;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id },
        ],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        payments: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Verify ownership unless admin
    if (role !== 'ADMIN' && order.userId && order.userId !== userId) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error retrieving order' });
  }
}

export async function getAdminOrders(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;

    const { status, paymentStatus, search } = req.query;

    const where: any = {};
    if (status) where.status = String(status);
    if (paymentStatus) where.paymentStatus = String(paymentStatus);
    if (search) {
      const q = String(search);
      where.OR = [
        { orderNumber: { contains: q } },
        { address: { fullName: { contains: q } } },
        { address: { phone: { contains: q } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
          payments: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin orders' });
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { status, paymentStatus, trackingNumber } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : undefined,
      },
      include: {
        address: true,
        items: true,
        payments: true,
      },
    });

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating order' });
  }
}

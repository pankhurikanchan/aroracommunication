import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { OrderService } from '../services/orderService';
import { sendSuccess, sendPaginated } from '../core/responses/apiResponse';

const orderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    email: z.string().email('Invalid email address'),
    addressLine: z.string().min(5, 'Address line must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pinCode: z.string().min(6, 'Pin code must be 6 digits'),
  }).optional(),
  addressId: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      variantId: z.string().optional().nullable(),
      quantity: z.number().int().positive('Quantity must be a positive integer'),
      price: z.number().optional(),
      productName: z.string().optional(),
      productImage: z.string().optional().nullable(),
    })
  ).min(1, 'Order must contain at least one item'),
  paymentMethod: z.enum(['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'CASH_ON_DELIVERY', 'RAZORPAY']),
  couponCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  transactionId: z.string().optional().nullable(),
});

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId || null;
  const validated = orderSchema.parse(req.body);

  const order = await OrderService.createOrder({
    userId,
    shippingAddress: validated.shippingAddress,
    addressId: validated.addressId,
    items: validated.items,
    paymentMethod: validated.paymentMethod,
    couponCode: validated.couponCode,
    notes: validated.notes,
    transactionId: validated.transactionId,
  });

  sendSuccess(res, order, 'Order placed successfully', 201);
}

export async function getUserOrders(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const orders = await OrderService.getUserOrders(userId);
  sendSuccess(res, orders, 'User orders retrieved successfully');
}

export async function getOrderById(req: AuthRequest, res: Response): Promise<void> {
  const id = String(req.params.id);
  const userId = req.user?.userId;
  const role = req.user?.role;
  const emailQuery = (req.query.email as string) || (req.headers['x-guest-email'] as string);
  const phoneQuery = (req.query.phone as string) || (req.headers['x-guest-phone'] as string);

  const order = await OrderService.getOrderById(id, userId, role, {
    email: emailQuery,
    phone: phoneQuery,
  });

  sendSuccess(res, order, 'Order retrieved successfully');
}

export async function getAdminOrders(req: AuthRequest, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const status = req.query.status as string;
  const search = req.query.search as string;
  const paymentStatus = req.query.paymentStatus as string;

  const result = await OrderService.getAdminOrders({
    page,
    limit,
    status,
    search,
    paymentStatus,
  });

  sendPaginated(res, result.orders, result.page, result.limit, result.total, 'Admin orders retrieved');
}

export async function updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
  const id = String(req.params.id);
  const { status, trackingNumber, paymentStatus } = req.body;

  const order = await OrderService.updateOrderStatus(id, status, trackingNumber, paymentStatus);
  sendSuccess(res, order, 'Order status updated successfully');
}

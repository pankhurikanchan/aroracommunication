import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export async function getAdminDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      completedOrders,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.order.findMany({
        where: { paymentStatus: 'COMPLETED' },
        select: { totalAmount: true, createdAt: true },
      }),
      prisma.product.findMany({
        where: { stockQuantity: { lte: 5 } },
        take: 10,
        select: { id: true, name: true, sku: true, stockQuantity: true, price: true },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          address: { select: { fullName: true, city: true } },
        },
      }),
    ]);

    const totalSales = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Group sales by recent month / week for revenue chart
    const monthlySales: Record<string, number> = {};
    for (const order of completedOrders) {
      const monthYear = new Date(order.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + order.totalAmount;
    }

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
        monthlySales,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin stats' });
  }
}

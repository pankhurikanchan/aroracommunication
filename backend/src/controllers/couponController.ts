import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export async function validateCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { code, amount } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: 'Coupon code is required' });
      return;
    }

    const orderAmount = parseFloat(amount || '0');

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
      return;
    }

    if (new Date() > coupon.endDate) {
      res.status(400).json({ success: false, message: 'This coupon has expired' });
      return;
    }

    if (orderAmount < coupon.minSpend) {
      res.status(400).json({
        success: false,
        message: `Coupon requires minimum order value of ₹${coupon.minSpend.toLocaleString('en-IN')}`,
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (orderAmount * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    discount = Math.min(discount, orderAmount);

    res.status(200).json({
      success: true,
      message: `Coupon applied: Saved ₹${discount.toLocaleString('en-IN')}!`,
      data: {
        code: coupon.code,
        discount,
        discountType: coupon.discountType,
        value: coupon.value,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error validating coupon' });
  }
}

export async function getCoupons(req: Request, res: Response): Promise<void> {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching coupons' });
  }
}

export async function createCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { code, discountType, value, minSpend, maxDiscount, endDate, isActive } = req.body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType: discountType || 'PERCENTAGE',
        value: parseFloat(value),
        minSpend: minSpend ? parseFloat(minSpend) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating coupon' });
  }
}

export async function deleteCoupon(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.coupon.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting coupon' });
  }
}

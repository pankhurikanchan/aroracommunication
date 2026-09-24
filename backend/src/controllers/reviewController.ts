import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(3),
});

export async function getProductReviews(req: Request, res: Response): Promise<void> {
  try {
    const productId = String(req.params.productId);
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching reviews' });
  }
}

export async function addReview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const validated = reviewSchema.parse(req.body);

    // Check if user previously bought this product
    const verifiedOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: { in: ['DELIVERED', 'SHIPPED', 'CONFIRMED'] },
        items: { some: { productId: validated.productId } },
      },
    });

    const isVerifiedPurchase = !!verifiedOrder;

    const review = await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: validated.productId,
          userId,
        },
      },
      update: {
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        isVerifiedPurchase,
      },
      create: {
        productId: validated.productId,
        userId,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        isVerifiedPurchase,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update Product average rating and count
    const allReviews = await prisma.review.findMany({
      where: { productId: validated.productId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: validated.productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        numReviews: allReviews.length,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: error.errors[0].message });
      return;
    }
    res.status(500).json({ success: false, message: error.message || 'Error submitting review' });
  }
}

export async function getAllReviews(req: Request, res: Response): Promise<void> {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
    res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching reviews' });
  }
}

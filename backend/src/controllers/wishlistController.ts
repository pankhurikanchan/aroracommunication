import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export async function getWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
        },
      });
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching wishlist' });
  }
}

export async function addToWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!productId) {
      res.status(400).json({ success: false, message: 'Product ID is required' });
      return;
    }

    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: String(productId),
        },
      },
    });

    if (existing) {
      res.status(200).json({ success: true, message: 'Product already in wishlist', data: existing });
      return;
    }

    const item = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: String(productId),
      },
      include: {
        product: {
          include: {
            images: true,
            brand: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, message: 'Product added to wishlist', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error adding to wishlist' });
  }
}

export async function removeFromWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const id = String(req.params.id);

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      res.status(404).json({ success: false, message: 'Wishlist not found' });
      return;
    }

    // Try deleting by wishlist item ID first, or by productId
    const item = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        OR: [
          { id },
          { productId: id },
        ],
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found in wishlist' });
      return;
    }

    await prisma.wishlistItem.delete({ where: { id: item.id } });

    res.status(200).json({ success: true, message: 'Item removed from wishlist' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing from wishlist' });
  }
}

export async function toggleWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: String(productId),
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      res.status(200).json({ success: true, message: 'Removed from wishlist', inWishlist: false });
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: String(productId),
        },
      });
      res.status(200).json({ success: true, message: 'Added to wishlist', inWishlist: true });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating wishlist' });
  }
}

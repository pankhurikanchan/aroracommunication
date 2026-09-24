import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

async function getOrCreateCart(userId?: string, guestSessionId?: string) {
  if (userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                brand: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  brand: true,
                },
              },
              variant: true,
            },
          },
        },
      });
    }
    return cart;
  }

  if (guestSessionId) {
    let cart = await prisma.cart.findUnique({
      where: { guestSessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                brand: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { guestSessionId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  brand: true,
                },
              },
              variant: true,
            },
          },
        },
      });
    }
    return cart;
  }

  return null;
}

function calculateCartTotals(items: any[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal > 1000 || subtotal === 0 ? 0 : 49;
  const total = subtotal + deliveryCharge;
  return { subtotal, deliveryCharge, total };
}

export async function getCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const guestSessionId = (req.headers['x-guest-session-id'] as string) || (req.query.guestSessionId as string);

    if (!userId && !guestSessionId) {
      res.status(200).json({
        success: true,
        data: { id: null, items: [], subtotal: 0, deliveryCharge: 0, total: 0 },
      });
      return;
    }

    const cart = await getOrCreateCart(userId, guestSessionId);
    if (!cart) {
      res.status(200).json({
        success: true,
        data: { id: null, items: [], subtotal: 0, deliveryCharge: 0, total: 0 },
      });
      return;
    }

    const totals = calculateCartTotals(cart.items);

    res.status(200).json({
      success: true,
      data: {
        id: cart.id,
        items: cart.items,
        ...totals,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching cart' });
  }
}

export async function addToCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const guestSessionId = (req.headers['x-guest-session-id'] as string) || (req.body.guestSessionId as string);
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, message: 'ProductId is required' });
      return;
    }

    if (!userId && !guestSessionId) {
      res.status(400).json({ success: false, message: 'User or Guest Session ID required' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: String(productId) },
      include: { variants: true },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    let price = product.discountPrice || product.price;
    if (variantId) {
      const variant = product.variants.find((v) => v.id === String(variantId));
      if (variant) {
        price = variant.discountPrice || variant.price;
      }
    }

    const cart = await getOrCreateCart(userId, guestSessionId);
    if (!cart) {
      res.status(500).json({ success: false, message: 'Could not access cart' });
      return;
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: String(productId),
        variantId: variantId ? String(variantId) : null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + Number(quantity),
          price,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: String(productId),
          variantId: variantId ? String(variantId) : null,
          quantity: Number(quantity),
          price,
        },
      });
    }

    const updatedCart = await getOrCreateCart(userId, guestSessionId);
    const totals = calculateCartTotals(updatedCart?.items || []);

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: {
        id: updatedCart?.id,
        items: updatedCart?.items,
        ...totals,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error adding to cart' });
  }
}

export async function updateCartItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { quantity } = req.body;
    const newQty = parseInt(quantity, 10);

    if (isNaN(newQty) || newQty <= 0) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity: newQty },
      });
    }

    const userId = req.user?.userId;
    const guestSessionId = (req.headers['x-guest-session-id'] as string) || (req.query.guestSessionId as string);
    const cart = await getOrCreateCart(userId, guestSessionId);
    const totals = calculateCartTotals(cart?.items || []);

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: {
        id: cart?.id,
        items: cart?.items,
        ...totals,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating cart item' });
  }
}

export async function removeCartItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.cartItem.delete({ where: { id } });

    const userId = req.user?.userId;
    const guestSessionId = (req.headers['x-guest-session-id'] as string) || (req.query.guestSessionId as string);
    const cart = await getOrCreateCart(userId, guestSessionId);
    const totals = calculateCartTotals(cart?.items || []);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: {
        id: cart?.id,
        items: cart?.items,
        ...totals,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing cart item' });
  }
}

export async function clearCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const guestSessionId = (req.headers['x-guest-session-id'] as string) || (req.query.guestSessionId as string);
    const cart = await getOrCreateCart(userId, guestSessionId);

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: { id: cart?.id, items: [], subtotal: 0, deliveryCharge: 0, total: 0 },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error clearing cart' });
  }
}

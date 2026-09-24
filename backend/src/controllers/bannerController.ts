import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export async function getBanners(req: Request, res: Response): Promise<void> {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.status(200).json({ success: true, data: banners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching banners' });
  }
}

export async function getAllBanners(req: Request, res: Response): Promise<void> {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.status(200).json({ success: true, data: banners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching all banners' });
  }
}

export async function createBanner(req: Request, res: Response): Promise<void> {
  try {
    const { title, subtitle, badge, buttonText, buttonLink, imageUrl, bgGradient, displayOrder, isActive } = req.body;
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        badge,
        buttonText: buttonText || 'Shop Now',
        buttonLink: buttonLink || '/products',
        imageUrl,
        bgGradient,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    res.status(201).json({ success: true, data: banner });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating banner' });
  }
}

export async function updateBanner(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const banner = await prisma.banner.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ success: true, data: banner });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating banner' });
  }
}

export async function deleteBanner(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.banner.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting banner' });
  }
}

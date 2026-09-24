import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export async function getBrands(req: Request, res: Response): Promise<void> {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
    res.status(200).json({ success: true, data: brands });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching brands' });
  }
}

export async function createBrand(req: Request, res: Response): Promise<void> {
  try {
    const { name, slug, logoUrl, description, isFeatured } = req.body;
    const brand = await prisma.brand.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logoUrl,
        description,
        isFeatured: isFeatured || false,
      },
    });
    res.status(201).json({ success: true, data: brand });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating brand' });
  }
}

export async function updateBrand(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { name, slug, logoUrl, description, isFeatured } = req.body;
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        slug,
        logoUrl,
        description,
        isFeatured,
      },
    });
    res.status(200).json({ success: true, data: brand });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating brand' });
  }
}

export async function deleteBrand(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.brand.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Brand deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting brand' });
  }
}

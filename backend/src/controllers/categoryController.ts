import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching categories' });
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, slug, description, imageUrl, icon, displayOrder } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        imageUrl,
        icon,
        displayOrder: displayOrder || 0,
      },
    });
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating category' });
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { name, slug, description, imageUrl, icon, displayOrder } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        imageUrl,
        icon,
        displayOrder,
      },
    });
    res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating category' });
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting category' });
  }
}

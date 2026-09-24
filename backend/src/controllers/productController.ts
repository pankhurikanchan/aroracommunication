import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { SupabaseStorageService } from '../services/supabaseStorage';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 12));
    const skip = (page - 1) * limit;

    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      featured,
      bestSeller,
      newArrival,
      deals,
      premium,
      ram,
      storage,
      sort,
    } = req.query;

    const where: any = {};

    // Search query matching product name, description, SKU, brand name, or category name
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { sku: { contains: q } },
        { brand: { name: { contains: q } } },
        { category: { name: { contains: q } } },
      ];
    }

    // Category filter
    if (category) {
      where.category = {
        OR: [
          { slug: String(category) },
          { id: String(category) },
        ],
      };
    }

    // Brand filter
    if (brand) {
      const brandsList = String(brand).split(',').map((b) => b.trim());
      where.brand = {
        OR: [
          { slug: { in: brandsList } },
          { id: { in: brandsList } },
          { name: { in: brandsList } },
        ],
      };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }

    // Rating filter
    if (minRating) {
      where.rating = { gte: parseFloat(String(minRating)) };
    }

    // Stock availability
    if (inStock === 'true') {
      where.stockQuantity = { gt: 0 };
    }

    // Promotional & Catalog Flags
    if (featured === 'true') where.isFeatured = true;
    if (bestSeller === 'true') where.isBestSeller = true;
    if (newArrival === 'true') where.isNewArrival = true;
    if (deals === 'true') where.isDealsOffer = true;
    if (premium === 'true') where.isPremium = true;

    // Variant RAM & Storage filtering
    if (ram || storage) {
      where.variants = {
        some: {
          ...(ram ? { ram: String(ram) } : {}),
          ...(storage ? { storage: String(storage) } : {}),
        },
      };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'popular') orderBy = { numReviews: 'desc' };
    else if (sort === 'discount') orderBy = { discountPercentage: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true, logoUrl: true } },
          images: { orderBy: { isPrimary: 'desc' } },
          variants: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching products' });
  }
}

export async function getProductBySlugOrId(req: Request, res: Response): Promise<void> {
  try {
    const identifier = String(req.params.identifier);

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier },
        ],
      },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { isPrimary: 'desc' } },
        variants: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Similar Products (same category, different product)
    const similarProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        images: true,
        brand: true,
      },
    });

    // Customers Also Viewed (same brand or high rating)
    const customersAlsoViewed = await prisma.product.findMany({
      where: {
        id: { notIn: [product.id, ...similarProducts.map((p) => p.id)] },
        OR: [
          { brandId: product.brandId },
          { isFeatured: true },
        ],
      },
      take: 4,
      include: {
        images: true,
        brand: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        product,
        similarProducts,
        customersAlsoViewed,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error retrieving product' });
  }
}

const productCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  brandId: z.string(),
  categoryId: z.string(),
  description: z.string(),
  price: z.number().positive(),
  discountPrice: z.number().optional().nullable(),
  stockQuantity: z.number().int().nonnegative().default(0),
  sku: z.string().min(1),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isDealsOffer: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  warrantyInfo: z.string().optional(),
  boxContents: z.string().optional(),
  specifications: z.string().optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(z.any()).optional(),
});

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const validated = productCreateSchema.parse(req.body);

    const discountPercentage = validated.discountPrice && validated.discountPrice < validated.price
      ? Math.round(((validated.price - validated.discountPrice) / validated.price) * 100)
      : null;

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        brandId: validated.brandId,
        categoryId: validated.categoryId,
        description: validated.description,
        price: validated.price,
        discountPrice: validated.discountPrice,
        discountPercentage,
        stockQuantity: validated.stockQuantity,
        sku: validated.sku,
        isFeatured: validated.isFeatured ?? false,
        isBestSeller: validated.isBestSeller ?? false,
        isNewArrival: validated.isNewArrival ?? false,
        isDealsOffer: validated.isDealsOffer ?? false,
        isPremium: validated.isPremium ?? false,
        warrantyInfo: validated.warrantyInfo || '1 Year Brand Manufacturer Warranty',
        boxContents: validated.boxContents,
        specifications: validated.specifications,
      },
    });

    // Add images if provided
    if (validated.images && validated.images.length > 0) {
      for (let i = 0; i < validated.images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: validated.images[i],
            isPrimary: i === 0,
          },
        });
      }
    }

    // Add variants if provided
    if (validated.variants && validated.variants.length > 0) {
      for (const v of validated.variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            color: v.color || null,
            colorCode: v.colorCode || null,
            ram: v.ram || null,
            storage: v.storage || null,
            price: v.price || validated.price,
            discountPrice: v.discountPrice || null,
            stockQuantity: v.stockQuantity || 10,
            sku: v.sku || `${validated.sku}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          },
        });
      }
    }

    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
      },
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: completeProduct });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: error.errors[0].message });
      return;
    }
    res.status(500).json({ success: false, message: error.message || 'Error creating product' });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const body = req.body;

    let discountPercentage = body.discountPercentage;
    if (body.price && body.discountPrice) {
      discountPercentage = Math.round(((body.price - body.discountPrice) / body.price) * 100);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        brandId: body.brandId,
        categoryId: body.categoryId,
        description: body.description,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        discountPrice: body.discountPrice !== undefined ? (body.discountPrice ? parseFloat(body.discountPrice) : null) : undefined,
        discountPercentage,
        stockQuantity: body.stockQuantity !== undefined ? parseInt(body.stockQuantity, 10) : undefined,
        sku: body.sku,
        isFeatured: body.isFeatured,
        isBestSeller: body.isBestSeller,
        isNewArrival: body.isNewArrival,
        isDealsOffer: body.isDealsOffer,
        isPremium: body.isPremium,
        warrantyInfo: body.warrantyInfo,
        boxContents: body.boxContents,
        specifications: body.specifications,
      },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
      },
    });

    res.status(200).json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating product' });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting product' });
  }
}

export async function getProductFilterMeta(req: Request, res: Response): Promise<void> {
  try {
    const [brands, categories, minMaxPrice] = await Promise.all([
      prisma.brand.findMany({ select: { id: true, name: true, slug: true } }),
      prisma.category.findMany({ select: { id: true, name: true, slug: true } }),
      prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    const ramOptions = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];
    const storageOptions = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];

    res.status(200).json({
      success: true,
      data: {
        brands,
        categories,
        priceRange: {
          min: minMaxPrice._min.price || 0,
          max: minMaxPrice._max.price || 200000,
        },
        ramOptions,
        storageOptions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching filters meta' });
  }
}

export async function addProductImage(req: Request, res: Response): Promise<void> {
  try {
    const productId = String(req.params.id);
    const { url, altText, isPrimary } = req.body;

    if (!url) {
      res.status(400).json({ success: false, message: 'Image URL is required' });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.productImage.create({
      data: {
        productId,
        url,
        altText: altText || product.name,
        isPrimary: Boolean(isPrimary),
      },
    });

    res.status(201).json({ success: true, message: 'Image added to product', data: image });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error adding product image' });
  }
}

export async function deleteProductImage(req: Request, res: Response): Promise<void> {
  try {
    const { productId, imageId } = req.params;

    const image = await prisma.productImage.findFirst({
      where: { id: String(imageId), productId: String(productId) },
    });

    if (!image) {
      res.status(404).json({ success: false, message: 'Product image not found' });
      return;
    }

    // Attempt deleting from Supabase Storage
    await SupabaseStorageService.deleteImage(image.url);

    await prisma.productImage.delete({ where: { id: image.id } });

    res.status(200).json({ success: true, message: 'Image deleted from product and storage' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting product image' });
  }
}

export async function setPrimaryProductImage(req: Request, res: Response): Promise<void> {
  try {
    const { productId, imageId } = req.params;

    await prisma.productImage.updateMany({
      where: { productId: String(productId) },
      data: { isPrimary: false },
    });

    const updated = await prisma.productImage.update({
      where: { id: String(imageId) },
      data: { isPrimary: true },
    });

    res.status(200).json({ success: true, message: 'Primary image updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error setting primary image' });
  }
}


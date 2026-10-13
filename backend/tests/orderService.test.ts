import prisma from '../src/utils/prisma';
import { OrderService } from '../src/services/orderService';
import { BadRequestError } from '../src/core/errors/AppError';

describe('OrderService Business Logic & Data Integrity', () => {
  let testProductId: string;
  let testBrandId: string;
  let testCategoryId: string;

  beforeAll(async () => {
    // Setup test brand
    const brand = await prisma.brand.upsert({
      where: { slug: 'test-brand-security' },
      update: {},
      create: {
        name: 'Test Brand Security',
        slug: 'test-brand-security',
      },
    });
    testBrandId = brand.id;

    // Setup test category
    const cat = await prisma.category.upsert({
      where: { slug: 'test-cat-security' },
      update: {},
      create: {
        name: 'Test Category Security',
        slug: 'test-cat-security',
      },
    });
    testCategoryId = cat.id;

    // Create a product with price = 1000 and stock = 5
    const prod = await prisma.product.create({
      data: {
        name: 'Security Test Phone',
        slug: `sec-test-phone-${Date.now()}`,
        sku: `SKU-TEST-${Date.now()}`,
        brandId: testBrandId,
        categoryId: testCategoryId,
        description: 'Test Phone Description',
        price: 1000,
        stockQuantity: 5,
      },
    });
    testProductId = prod.id;
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany({ where: { productId: testProductId } }).catch(() => {});
    await prisma.product.deleteMany({ where: { id: testProductId } }).catch(() => {});
    await prisma.brand.deleteMany({ where: { id: testBrandId } }).catch(() => {});
    await prisma.category.deleteMany({ where: { id: testCategoryId } }).catch(() => {});
  });

  it('SEC-03: Server-side pricing recalculation must PREVENT client price tampering', async () => {
    // Malicious client claims price is ₹1 instead of real ₹1000
    const order = await OrderService.createOrder({
      shippingAddress: {
        fullName: 'Price Tamper Tester',
        phone: '9876543210',
        email: 'tamper@test.com',
        addressLine: '100 Hacker Lane',
        city: 'Bareilly',
        state: 'Uttar Pradesh',
        pinCode: '243122',
      },
      items: [
        {
          productId: testProductId,
          quantity: 2,
          price: 1, // Tampered client price!
        },
      ],
      paymentMethod: 'CASH_ON_DELIVERY',
    });

    // Subtotal must be calculated from database: 2 * 1000 = 2000
    expect(order.subtotal).toBe(2000);
    expect(order.items[0].price).toBe(1000);
    // Since > 1000, delivery charge is FREE (0)
    expect(order.totalAmount).toBe(2000);

    // Verify stock was decremented from 5 to 3
    const updatedProd = await prisma.product.findUnique({ where: { id: testProductId } });
    expect(updatedProd?.stockQuantity).toBe(3);
  });

  it('DAT-02: Should REJECT order when requested quantity exceeds available stock', async () => {
    // Current stock is 3, request 10
    await expect(
      OrderService.createOrder({
        shippingAddress: {
          fullName: 'Over Stock Tester',
          phone: '9876543210',
          email: 'overstock@test.com',
          addressLine: '200 Storage Ave',
          city: 'Bareilly',
          state: 'Uttar Pradesh',
          pinCode: '243122',
        },
        items: [
          {
            productId: testProductId,
            quantity: 10,
          },
        ],
        paymentMethod: 'CASH_ON_DELIVERY',
      })
    ).rejects.toThrow(BadRequestError);
  });
});

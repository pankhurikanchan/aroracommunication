import request from 'supertest';
import { app } from '../src/app';
import prisma from '../src/utils/prisma';
import { generateToken } from '../src/utils/jwt';

describe('Security Controls & Authorization Checks', () => {
  let user1Token: string;
  let user2Token: string;
  let user1AddressId: string;

  beforeAll(async () => {
    // Generate test user 1
    const u1 = await prisma.user.upsert({
      where: { email: 'sec_test_user1@example.com' },
      update: {},
      create: {
        email: 'sec_test_user1@example.com',
        name: 'Security User 1',
        password: 'hashedpassword123',
        role: 'CUSTOMER',
      },
    });
    user1Token = generateToken({ userId: u1.id, email: u1.email, role: 'CUSTOMER' });

    // Generate test user 2
    const u2 = await prisma.user.upsert({
      where: { email: 'sec_test_user2@example.com' },
      update: {},
      create: {
        email: 'sec_test_user2@example.com',
        name: 'Security User 2',
        password: 'hashedpassword123',
        role: 'CUSTOMER',
      },
    });
    user2Token = generateToken({ userId: u2.id, email: u2.email, role: 'CUSTOMER' });

    // Create an address belonging to User 1
    const addr = await prisma.address.create({
      data: {
        userId: u1.id,
        fullName: 'User 1 Address',
        phone: '9876543210',
        email: 'sec_test_user1@example.com',
        addressLine: '123 Cyber Lane',
        city: 'Bareilly',
        state: 'Uttar Pradesh',
        pinCode: '243122',
      },
    });
    user1AddressId = addr.id;
  });

  afterAll(async () => {
    await prisma.address.deleteMany({ where: { email: 'sec_test_user1@example.com' } }).catch(() => {});
    await prisma.user.deleteMany({ where: { email: { in: ['sec_test_user1@example.com', 'sec_test_user2@example.com'] } } }).catch(() => {});
  });

  it('SEC-01: Should FORBID User 2 from deleting User 1 address (IDOR Prevention)', async () => {
    const res = await request(app)
      .delete(`/api/users/addresses/${user1AddressId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Unauthorized to delete this address');

    // Verify address still exists
    const stillExists = await prisma.address.findUnique({ where: { id: user1AddressId } });
    expect(stillExists).not.toBeNull();
  });

  it('SEC-01: Should ALLOW User 1 to delete their own address', async () => {
    const res = await request(app)
      .delete(`/api/users/addresses/${user1AddressId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify address is deleted
    const deleted = await prisma.address.findUnique({ where: { id: user1AddressId } });
    expect(deleted).toBeNull();
  });

  it('Input Validation: Should reject user registration with invalid email or short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

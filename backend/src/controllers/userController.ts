import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import { UnauthorizedError, NotFoundError, ForbiddenError, BadRequestError } from '../core/errors/AppError';
import { sendSuccess } from '../core/responses/apiResponse';

export async function getUserProfile(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
      createdAt: true,
      addresses: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User profile not found');
  }

  sendSuccess(res, user, 'Profile retrieved successfully');
}

export async function updateUserProfile(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }

  const { name, phone, password, avatar } = req.body;
  const updateData: any = {};

  if (name) updateData.name = name.trim();
  if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (password) {
    if (password.trim().length < 6) {
      throw new BadRequestError('Password must be at least 6 characters long');
    }
    updateData.password = await bcrypt.hash(password.trim(), 10);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
    },
  });

  sendSuccess(res, updated, 'Profile updated successfully');
}

export async function getUserAddresses(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  sendSuccess(res, addresses, 'Addresses retrieved successfully');
}

export async function addAddress(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }

  const { fullName, phone, email, addressLine, city, state, pinCode, isDefault } = req.body;

  if (!fullName || !phone || !email || !addressLine || !city || !state || !pinCode) {
    throw new BadRequestError('All required address fields must be provided');
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      isDefault: Boolean(isDefault),
    },
  });

  sendSuccess(res, address, 'Address added successfully', 201);
}

/**
 * IDOR Fixed: Verify address ownership before deletion
 */
export async function deleteAddress(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }

  const id = String(req.params.id);
  const address = await prisma.address.findUnique({ where: { id } });

  if (!address) {
    throw new NotFoundError('Address not found');
  }

  // Authorize: Only the owner or an admin can delete the address
  if (address.userId !== userId && req.user?.role !== 'ADMIN') {
    throw new ForbiddenError('Unauthorized to delete this address');
  }

  await prisma.address.delete({ where: { id } });
  sendSuccess(res, null, 'Address removed successfully');
}

export async function getAdminUsers(req: AuthRequest, res: Response): Promise<void> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
  });

  sendSuccess(res, users, 'Users retrieved successfully');
}

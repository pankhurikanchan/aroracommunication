import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export async function getUserProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
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

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching profile' });
  }
}

export async function updateUserProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { name, phone, password, avatar } = req.body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (password && password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
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

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
  }
}

export async function getUserAddresses(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, data: addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching addresses' });
  }
}

export async function addAddress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { fullName, phone, email, addressLine, city, state, pinCode, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        email,
        addressLine,
        city,
        state,
        pinCode,
        isDefault: !!isDefault,
      },
    });

    res.status(201).json({ success: true, message: 'Address added successfully', data: address });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error saving address' });
  }
}

export async function deleteAddress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    await prisma.address.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Address removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting address' });
  }
}

export async function getAdminUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
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

    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching users' });
  }
}

import prisma from '../prisma';
import { UserCreateData, UserUpdateData, UserFilters } from '../types';

export const userCrud = {
  async create(data: UserCreateData) {
    return await prisma.user.create({ data });
  },

  async getAll(where?: UserFilters) {
    return await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  },

  async getById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
        quotes: true,
        appointments: true,
        cartItems: {
          include: { product: true },
        },
      },
    });
  },

  async update(id: number, data: UserUpdateData) {
    return await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  async delete(id: number) {
    return await prisma.user.delete({ where: { id } });
  },

  async getByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  },
};

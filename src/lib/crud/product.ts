import prisma from '../prisma';
import { ProductCreateData, ProductUpdateData, ProductFilters } from '../types';

export const productCrud = {
  async create(data: ProductCreateData) {
    return await prisma.product.create({ data });
  },

  async getAll(filters?: ProductFilters) {
    const where: Record<string, unknown> = { isActive: true };

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.featured !== undefined) where.featured = filters.featured;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice)
        (where.price as Record<string, number>).gte = filters.minPrice;
      if (filters.maxPrice)
        (where.price as Record<string, number>).lte = filters.maxPrice;
    }

    return await prisma.product.findMany({
      where,
      include: {
        category: true,
        //
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        orderItems: {
          include: { order: true },
        },
      },
    });
  },

  async update(id: number, data: ProductUpdateData) {
    return await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  async delete(id: number) {
    return await prisma.product.delete({ where: { id } });
  },

  async updateStock(id: number, quantity: number) {
    return await prisma.product.update({
      where: { id },
      data: {
        stock: { increment: quantity },
      },
    });
  },
};

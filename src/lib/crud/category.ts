import prisma from '../prisma';
import { CategoryCreateData, CategoryUpdateData } from '../types';

export const categoryCrud = {
  async create(data: CategoryCreateData) {
    return await prisma.category.create({ data });
  },

  async getAll() {
    return await prisma.category.findMany({
      where: { isActive: true },
      include: {
        //
      },
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: number) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
        },
      },
    });
  },

  async getBySlug(slug: string) {
    return await prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });
  },

  async update(id: number, data: CategoryUpdateData) {
    return await prisma.category.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  async delete(id: number) {
    return await prisma.category.delete({ where: { id } });
  },
};

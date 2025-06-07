import prisma from '../prisma';
import {
  QuoteCreateData,
  QuoteUpdateData,
  QuoteFilters,
  QuoteStatus,
} from '../types';

export const quoteCrud = {
  async create(data: QuoteCreateData) {
    return await prisma.quote.create({
      data,
      include: {
        user: true,
        creator: true,
      },
    });
  },

  async getAll(filters?: QuoteFilters) {
    const where: Record<string, unknown> = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom)
        (where.createdAt as Record<string, Date>).gte = filters.dateFrom;
      if (filters.dateTo)
        (where.createdAt as Record<string, Date>).lte = filters.dateTo;
    }

    return await prisma.quote.findMany({
      where,
      include: {
        user: true,
        creator: true,
        approver: true,
        //
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: number) {
    return await prisma.quote.findUnique({
      where: { id },
      include: {
        user: true,
        creator: true,
        approver: true,
        orders: true,
        appointments: true,
        invoices: true,
      },
    });
  },

  async updateStatus(id: number, status: QuoteStatus, approvedBy?: number) {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'APPROVED' && approvedBy) {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
    }

    return await prisma.quote.update({
      where: { id },
      data: updateData,
    });
  },

  async update(id: number, data: QuoteUpdateData) {
    return await prisma.quote.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  },

  async delete(id: number) {
    return await prisma.quote.delete({ where: { id } });
  },
};

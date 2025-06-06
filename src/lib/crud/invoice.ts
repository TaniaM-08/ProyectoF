import prisma from '../prisma'
import { InvoiceCreateData, InvoiceUpdateData, InvoiceFilters } from '../types'

export const invoiceCrud = {
  async create(data: InvoiceCreateData) {
    return await prisma.invoice.create({
      data,
      include: {
        order: true,
        quote: true
      }
    })
  },

  async getAll(filters?: InvoiceFilters) {
    const where: Record<string, unknown> = {}
    
    if (filters?.paid === true) where.paidAt = { not: null }
    if (filters?.paid === false) where.paidAt = null
    if (filters?.overdue) {
      where.AND = [
        { paidAt: null },
        { dueDate: { lt: new Date() } }
      ]
    }
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) (where.createdAt as Record<string, Date>).gte = filters.dateFrom
      if (filters.dateTo) (where.createdAt as Record<string, Date>).lte = filters.dateTo
    }

    return await prisma.invoice.findMany({
      where,
      include: {
        order: {
          include: { user: true }
        },
        quote: true
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getById(id: number) {
    return await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: true,
            orderItems: {
              include: { product: true }
            }
          }
        },
        quote: true
      }
    })
  },

  async markAsPaid(id: number) {
    return await prisma.invoice.update({
      where: { id },
      data: { paidAt: new Date() }
    })
  },

  async update(id: number, data: InvoiceUpdateData) {
    return await prisma.invoice.update({
      where: { id },
      data
    })
  },

  async delete(id: number) {
    return await prisma.invoice.delete({ where: { id } })
  }
}
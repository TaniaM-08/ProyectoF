import prisma from '../prisma'
import { OrderCreateData, OrderFilters, OrderStatus } from '../types'

export const orderCrud = {
  async create(data: OrderCreateData) {
    const { items, ...orderData } = data
    
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const total = subtotal

    return await prisma.order.create({
      data: {
        ...orderData,
        subtotal,
        total,
        orderItems: {
          create: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        orderItems: {
          include: { product: true }
        },
        user: true
      }
    })
  },

  async getAll(filters?: OrderFilters) {
    const where: Record<string, unknown> = {}
    
    if (filters?.userId) where.userId = filters.userId
    if (filters?.status) where.status = filters.status
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) (where.createdAt as Record<string, Date>).gte = filters.dateFrom
      if (filters.dateTo) (where.createdAt as Record<string, Date>).lte = filters.dateTo
    }

    return await prisma.order.findMany({
      where,
      include: {
        user: true,
        orderItems: {
          include: { product: true }
        },
        quote: true
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getById(id: number) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: { product: true }
        },
        quote: true,
        appointments: true,
        invoices: true
      }
    })
  },

  async updateStatus(id: number, status: OrderStatus) {
    const updateData: Record<string, unknown> = { status, updatedAt: new Date() }
    
    if (status === 'SHIPPED') updateData.shippedAt = new Date()
    if (status === 'DELIVERED') updateData.deliveredAt = new Date()

    return await prisma.order.update({
      where: { id },
      data: updateData
    })
  },

  async delete(id: number) {
    return await prisma.order.delete({ where: { id } })
  }
}
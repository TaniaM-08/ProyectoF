import prisma from '../prisma'
import { ExpenseCreateData, ExpenseUpdateData, ExpenseFilters } from '../types'

export const expenseCrud = {
  async create(data: ExpenseCreateData) {
    return await prisma.expense.create({ data })
  },

  async getAll(filters?: ExpenseFilters) {
    const where: Record<string, unknown> = {}
    
    if (filters?.category) where.category = filters.category
    if (filters?.dateFrom || filters?.dateTo) {
      where.date = {}
      if (filters.dateFrom) (where.date as Record<string, Date>).gte = filters.dateFrom
      if (filters.dateTo) (where.date as Record<string, Date>).lte = filters.dateTo
    }

    return await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' }
    })
  },

  async getById(id: number) {
    return await prisma.expense.findUnique({ where: { id } })
  },

  async update(id: number, data: ExpenseUpdateData) {
    return await prisma.expense.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  },

  async delete(id: number) {
    return await prisma.expense.delete({ where: { id } })
  },

  async getTotalByCategory() {
    return await prisma.expense.groupBy({
      by: ['category'],
      _sum: { amount: true },
      _count: true
    })
  },

  async getMonthlyTotals() {
    const expenses = await prisma.expense.findMany({
      select: {
        amount: true,
        date: true
      },
      orderBy: { date: 'desc' }
    })

    const monthlyTotals: Record<string, number> = expenses.reduce((acc, expense) => {
      const month = expense.date.toISOString().substring(0, 7) // YYYY-MM
      if (!acc[month]) acc[month] = 0
      acc[month] += expense.amount.toNumber()
      return acc
    }, {} as Record<string, number>)

    return monthlyTotals
  }
}
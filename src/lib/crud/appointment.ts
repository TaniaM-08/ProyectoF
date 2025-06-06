import prisma from '../prisma'

import { AppointmentCreateData, AppointmentUpdateData, AppointmentFilters, AppointmentStatus } from '../types'

export const appointmentCrud = {
  async create(data: AppointmentCreateData) {
    return await prisma.appointment.create({
      data,
      include: {
        user: true,
        assignedUser: true,
        quote: true,
        order: true
      }
    })
  },

  async getAll(filters?: AppointmentFilters) {
    const where: Record<string, unknown> = {}
    
    if (filters?.status) where.status = filters.status
    if (filters?.assignedTo) where.assignedTo = filters.assignedTo
    if (filters?.appointmentType) where.appointmentType = filters.appointmentType
    if (filters?.dateFrom || filters?.dateTo) {
      where.scheduledDate = {}
      if (filters.dateFrom) (where.scheduledDate as Record<string, Date>).gte = filters.dateFrom
      if (filters.dateTo) (where.scheduledDate as Record<string, Date>).lte = filters.dateTo
    }

    return await prisma.appointment.findMany({
      where,
      include: {
        user: true,
        assignedUser: true,
        quote: true,
        order: true
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { scheduledTime: 'asc' }
      ]
    })
  },

  async getById(id: number) {
    return await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: true,
        assignedUser: true,
        creator: true,
        quote: true,
        order: true,
        statusHistory: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  },

  async updateStatus(id: number, status: AppointmentStatus, changedBy?: number, notes?: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id } })
    
    const result = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      }
    })

    if (appointment && changedBy) {
      await prisma.appointmentStatusHistory.create({
        data: {
          appointmentId: id,
          oldStatus: appointment.status,
          newStatus: status,
          changedBy,
          notes
        }
      })
    }

    return result
  },

  async update(id: number, data: AppointmentUpdateData) {
    return await prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  },

  async delete(id: number) {
    return await prisma.appointment.delete({ where: { id } })
  },

  async getByDate(date: Date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return await prisma.appointment.findMany({
      where: {
        scheduledDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        assignedUser: true,
        user: true
      },
      orderBy: { scheduledTime: 'asc' }
    })
  }
}
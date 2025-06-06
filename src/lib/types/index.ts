
export interface UserCreateData {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  role?: 'CLIENT' | 'ADMIN' | 'EMPLOYEE'
}

export interface UserUpdateData {
  name?: string
  email?: string
  password?: string
  phone?: string
  address?: string
  role?: 'CLIENT' | 'ADMIN' | 'EMPLOYEE'
  isActive?: boolean
  updatedAt?: Date
}

export interface UserFilters {
  role?: 'CLIENT' | 'ADMIN' | 'EMPLOYEE'
  isActive?: boolean
  name?: string
  email?: string
}

export interface ProductCreateData {
  name: string
  description?: string
  price: number
  imageUrl?: string
  stock?: number
  featured?: boolean
  categoryId?: number
}

export interface ProductUpdateData {
  name?: string
  description?: string
  price?: number
  imageUrl?: string
  stock?: number
  featured?: boolean
  categoryId?: number
  isActive?: boolean
  updatedAt?: Date
}

export interface ProductFilters {
  categoryId?: number
  featured?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
}

export interface CategoryCreateData {
  name: string
  slug: string
  description?: string
  imageUrl?: string
}

export interface CategoryUpdateData {
  name?: string
  slug?: string
  description?: string
  imageUrl?: string
  isActive?: boolean
  updatedAt?: Date
}

export interface OrderCreateData {
  userId?: number
  quoteId?: number
  orderNumber: string
  items: Array<{
    productId: number
    productName: string
    quantity: number
    unitPrice: number
  }>
  shippingAddress?: string
  billingAddress?: string
  notes?: string
}

export interface OrderFilters {
  userId?: number
  status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  dateFrom?: Date
  dateTo?: Date
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface QuoteCreateData {
  quoteNumber: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientAddress?: string
  notesProblem?: string
  sizeRoom?: string
  validUntil?: Date
  userId?: number
  createdBy?: number
}

export interface QuoteUpdateData {
  quoteNumber?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  notesProblem?: string
  sizeRoom?: string
  validUntil?: Date
  amount?: number
  updatedAt?: Date
}

export interface QuoteFilters {
  status?: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  userId?: number
  dateFrom?: Date
  dateTo?: Date
}

export type QuoteStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED'

export interface AppointmentCreateData {
  appointmentNumber: string
  appointmentType: 'CONSULTATION' | 'INSTALLATION' | 'MAINTENANCE' | 'REPAIR' | 'DELIVERY'
  title: string
  description?: string
  scheduledDate: Date
  scheduledTime: Date
  durationMinutes?: number
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientAddress?: string
  userId?: number
  quoteId?: number
  orderId?: number
  assignedTo?: number
  createdBy?: number
}

export interface AppointmentUpdateData {
  appointmentType?: 'CONSULTATION' | 'INSTALLATION' | 'MAINTENANCE' | 'REPAIR' | 'DELIVERY'
  title?: string
  description?: string
  scheduledDate?: Date
  scheduledTime?: Date
  durationMinutes?: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  assignedTo?: number
  updatedAt?: Date
}

export interface AppointmentFilters {
  status?: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'
  assignedTo?: number
  dateFrom?: Date
  dateTo?: Date
  appointmentType?: 'CONSULTATION' | 'INSTALLATION' | 'MAINTENANCE' | 'REPAIR' | 'DELIVERY'
}

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

export interface InvoiceCreateData {
  orderId?: number
  quoteId?: number
  invoiceNumber: string
  amount: number
  taxAmount?: number
  totalAmount: number
  dueDate?: Date
}

export interface InvoiceUpdateData {
  amount?: number
  taxAmount?: number
  totalAmount?: number
  dueDate?: Date
  paidAt?: Date
}

export interface InvoiceFilters {
  paid?: boolean
  overdue?: boolean
  dateFrom?: Date
  dateTo?: Date
}

export interface ExpenseCreateData {
  description: string
  amount: number
  category?: string
  date?: Date
}

export interface ExpenseUpdateData {
  description?: string
  amount?: number
  category?: string
  date?: Date
  updatedAt?: Date
}

export interface ExpenseFilters {
  category?: string
  dateFrom?: Date
  dateTo?: Date
}

export type UserRole = 'CLIENT' | 'ADMIN' | 'EMPLOYEE'
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type QuoteStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
export type AppointmentType = 'CONSULTATION' | 'INSTALLATION' | 'MAINTENANCE' | 'REPAIR' | 'DELIVERY'
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

export enum User_Role {
  CLIENT = 'client',
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

export enum Order_Status {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum Quote_Status {
  DRAFT = 'draft',
  SENT = 'sent',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum Appointment_Status {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

export enum Appointment_Type {
  CONSULTATION = 'consultation',
  INSTALLATION = 'installation',
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  DELIVERY = 'delivery'
}

export interface UserCreateData {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  role?: UserRole
}

export interface UserUpdateData {
  name?: string
  email?: string
  password?: string
  phone?: string
  address?: string
  role?: UserRole
  isActive?: boolean
  updatedAt?: Date
}

export interface UserFilters {
  role?: UserRole
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
  status?: OrderStatus
  dateFrom?: Date
  dateTo?: Date
}


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
  status?: QuoteStatus
  userId?: number
  dateFrom?: Date
  dateTo?: Date
}


export interface AppointmentCreateData {
  appointmentNumber: string
  appointmentType: AppointmentType
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
  appointmentType?: AppointmentType
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
  status?: AppointmentStatus
  assignedTo?: number
  dateFrom?: Date
  dateTo?: Date
  appointmentType?: AppointmentType
}


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
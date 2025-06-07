import { PrismaClient } from '../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import dotenv from 'dotenv'

dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter })

export default prisma;

export { userCrud } from './crud/user'
export { productCrud } from './crud/product'
export { categoryCrud } from './crud/category'
export { orderCrud } from './crud/order'
export { quoteCrud } from './crud/quote'
export { appointmentCrud } from './crud/appointment'
export { cartCrud } from './crud/cart'
export { invoiceCrud } from './crud/invoice'
export { expenseCrud } from './crud/expense'